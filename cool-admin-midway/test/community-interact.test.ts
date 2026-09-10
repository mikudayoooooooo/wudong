import * as mysql from 'mysql2/promise';
import { boot, close, createHttpRequest, auth, registerAndLogin } from './helper';

/**
 * community 互动：评论/点赞/话题/关注/搜索/消息（号段 136xxx）
 */
describe('community 互动', () => {
  let app;
  let conn: mysql.Connection;
  let tokenA: string;
  let tokenB: string;
  let postId: number;

  /** 取查询结果第一行（mysql2 联合类型收敛） */
  async function one(sql: string) {
    const [rows] = await conn.query(sql);
    return ((rows as any[]) || [])[0] || {};
  }

  beforeAll(async () => {
    app = await boot();
    conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3307,
      user: 'root',
      password: '123456',
      database: 'wudong_platform_test',
    });
    await conn.query(`INSERT INTO community_topic (id, name, intro, isHot, status, bindRouteIds, createTime, updateTime)
      VALUES (9301, '#测试话题T', '测试简介', 1, 1, '[9201]', NOW(), NOW())`);
    tokenA = await registerAndLogin(app, '13600000003');
    tokenB = await registerAndLogin(app, '13600000004');
    const add = await createHttpRequest(app)
      .post('/app/community/post/add')
      .set(auth(tokenA))
      .send({ title: '互动测试游记T', content: '互动正文', images: [], topicIds: [9301] });
    postId = add.body.data.id;
  });

  afterAll(async () => {
    await conn.query(`DELETE FROM community_message WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '136000000%')`);
    await conn.query(`DELETE FROM community_like`);
    await conn.query(`DELETE FROM community_comment`);
    await conn.query(`DELETE FROM community_topic_follow`);
    await conn.query(`DELETE FROM community_follow`);
    await conn.query(`DELETE FROM community_post WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '136000000%')`);
    await conn.query(`DELETE FROM community_topic WHERE id = 9301`);
    await conn.query(`DELETE FROM member_user WHERE phone LIKE '136000000%'`);
    await conn.end();
    await close(app);
  });

  it('评论：发布后计数+1，作者收到互动消息', async () => {
    const res = await createHttpRequest(app)
      .post('/app/community/comment/add')
      .set(auth(tokenB))
      .send({ postId, content: '拍得真好' });
    expect(res.body.code).toBe(1000);
    const detail = await createHttpRequest(app).get(`/app/community/post/detail?id=${postId}`);
    expect(detail.body.data.commentCount).toBe(1);
    const list = await createHttpRequest(app).get(`/app/community/comment/list?postId=${postId}`);
    expect(list.body.data).toHaveLength(1);
    // 作者（用户A）应收到 comment 消息
    const msg = await one(
      `SELECT type, content FROM community_message WHERE type='comment' AND refId=${postId}`
    );
    expect(msg.content).toContain('新评论');
  });

  it('评论敏感词拦截', async () => {
    await conn.query(
      `INSERT INTO sensitive_word (word, status, createTime, updateTime) VALUES ('测试敏感词T', 1, NOW(), NOW())`
    );
    const res = await createHttpRequest(app)
      .post('/app/community/comment/add')
      .set(auth(tokenB))
      .send({ postId, content: '带测试敏感词T的评论' });
    expect(res.body.code).toBe(1001);
    await conn.query(`DELETE FROM sensitive_word WHERE word='测试敏感词T'`);
  });

  it('点赞切换：liked 与计数联动', async () => {
    const t1 = await createHttpRequest(app)
      .post('/app/community/like/toggle')
      .set(auth(tokenB))
      .send({ targetType: 'post', targetId: postId });
    expect(t1.body.data.liked).toBe(true);
    expect(t1.body.data.count).toBe(1);
    const t2 = await createHttpRequest(app)
      .post('/app/community/like/toggle')
      .set(auth(tokenB))
      .send({ targetType: 'post', targetId: postId });
    expect(t2.body.data.liked).toBe(false);
    expect(t2.body.data.count).toBe(0);
  });

  it('话题：详情含话题下游记，关注后粉丝数+1', async () => {
    const detail = await createHttpRequest(app).get('/app/community/topic/detail?id=9301');
    expect(detail.body.data.name).toBe('#测试话题T');
    expect(detail.body.data.posts.some((p) => p.id === postId)).toBe(true);
    const fol = await createHttpRequest(app)
      .post('/app/community/topic/follow')
      .set(auth(tokenB))
      .send({ topicId: 9301 });
    expect(fol.body.data.followed).toBe(true);
    const row = await one(`SELECT followerCount FROM community_topic WHERE id=9301`);
    expect(row.followerCount).toBe(1);
  });

  it('用户关注：A 关注 B 后 B 收到 follow 消息，feed follow tab 生效', async () => {
    const ua = await one(`SELECT id FROM member_user WHERE phone='13600000003'`);
    const ub = await one(`SELECT id FROM member_user WHERE phone='13600000004'`);
    const fol = await createHttpRequest(app)
      .post('/app/community/follow/toggle')
      .set(auth(tokenA))
      .send({ followingId: ub.id });
    expect(fol.body.data.followed).toBe(true);
    const msg = await one(
      `SELECT content FROM community_message WHERE type='follow' AND userId=${ub.id}`
    );
    expect(msg.content).toContain('关注了你');
    // B 再发一帖，A 的 follow tab 应包含
    const add = await createHttpRequest(app)
      .post('/app/community/post/add')
      .set(auth(tokenB))
      .send({ title: 'B的新帖T', content: 'x', images: [] });
    expect(add.body.code).toBe(1000);
    const feed = await createHttpRequest(app)
      .get('/app/community/post/feed?tab=follow')
      .set(auth(tokenA));
    expect(feed.body.data.list.some((p) => p.title === 'B的新帖T')).toBe(true);
    // 自己不能关注自己
    const self = await createHttpRequest(app)
      .post('/app/community/follow/toggle')
      .set(auth(tokenA))
      .send({ followingId: ua.id });
    expect(self.body.code).toBe(1001);
  });

  it('搜索：游记/话题/用户 LIKE 命中', async () => {
    const res = await createHttpRequest(app).get(
      `/app/community/search/list?keyword=${encodeURIComponent('互动测试游记T')}`
    );
    expect(res.body.data.posts.some((p) => p.id === postId)).toBe(true);
    const t = await createHttpRequest(app).get(
      `/app/community/search/list?keyword=${encodeURIComponent('测试话题T')}`
    );
    expect(t.body.data.topics).toHaveLength(1);
  });

  it('举报：提交后 pending，非法类型拒绝', async () => {
    const bad = await createHttpRequest(app)
      .post('/app/community/report/add')
      .set(auth(tokenB))
      .send({ targetType: 'ad', targetId: 1, reason: 'x' });
    expect(bad.body.code).toBe(1001);
    const ok = await createHttpRequest(app)
      .post('/app/community/report/add')
      .set(auth(tokenB))
      .send({ targetType: 'post', targetId: postId, reason: '测试举报' });
    expect(ok.body.code).toBe(1000);
    const row = await one(
      `SELECT status FROM community_report WHERE targetId=${postId} AND targetType='post'`
    );
    expect(row.status).toBe('pending');
  });
});
