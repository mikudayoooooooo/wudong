import * as mysql from 'mysql2/promise';
import { boot, close, createHttpRequest, auth, registerAndLogin } from './helper';

/**
 * community 发布/足迹/审核流（号段 136xxx；每文件一次 boot）
 */
describe('community 游记与足迹', () => {
  let app;
  let conn: mysql.Connection;
  let tokenA: string;
  let tokenB: string;

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
    // travel 种子：两站路线 + 用户A的已核销票（足迹凭证）
    await conn.query(`INSERT INTO travel_scenic_spot (id, name, type, status, createTime, updateTime)
      VALUES (9201, '测试社区景区一T', 'spot', 1, NOW(), NOW()), (9202, '测试社区景区二T', 'spot', 1, NOW(), NOW())`);
    await conn.query(`INSERT INTO travel_route_package (id, title, days, theme, price, departure, destination, status, createTime, updateTime)
      VALUES (9201, '测试社区路线T', 2, '经典', 899, '凯里南', '乌东', 1, NOW(), NOW())`);
    await conn.query(`INSERT INTO travel_route_itinerary (routeId, dayNo, sort, scenicSpotId, createTime, updateTime)
      VALUES (9201, 1, 1, 9201, NOW(), NOW()), (9201, 2, 1, 9202, NOW(), NOW())`);
    await conn.query(`INSERT INTO travel_ticket_type (id, scenicSpotId, name, price, totalStock, status, createTime, updateTime)
      VALUES (9201, 9202, '测试社区门票T', 40, 100, 1, NOW(), NOW())`);
    // 敏感词种子里一个演示词
    await conn.query(
      `INSERT INTO sensitive_word (word, status, createTime, updateTime) VALUES ('测试敏感词T', 1, NOW(), NOW())`
    );
    tokenA = await registerAndLogin(app, '13600000001');
    tokenB = await registerAndLogin(app, '13600000002');
  });

  afterAll(async () => {
    await conn.query(`DELETE FROM community_post_footprint WHERE postId IN (SELECT id FROM community_post WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '136000000%'))`);
    await conn.query(`DELETE FROM community_post WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '136000000%')`);
    await conn.query(`DELETE FROM community_like`);
    await conn.query(`DELETE FROM community_comment`);
    await conn.query(`DELETE FROM community_message WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '136000000%')`);
    await conn.query(`DELETE FROM community_follow`);
    await conn.query(`DELETE FROM community_topic WHERE name LIKE '%测试T'`);
    await conn.query(`DELETE FROM sensitive_word WHERE word = '测试敏感词T'`);
    await conn.query(`DELETE FROM travel_e_ticket WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '136000000%')`);
    await conn.query(`DELETE FROM travel_route_itinerary WHERE routeId = 9201`);
    await conn.query(`DELETE FROM travel_route_package WHERE id = 9201`);
    await conn.query(`DELETE FROM travel_ticket_type WHERE id = 9201`);
    await conn.query(`DELETE FROM travel_scenic_spot WHERE id IN (9201, 9202)`);
    await conn.query(`DELETE FROM member_user WHERE phone LIKE '136000000%'`);
    await conn.end();
    await close(app);
  });

  it('发布：正常内容直接 normal，返回 id', async () => {
    const res = await createHttpRequest(app)
      .post('/app/community/post/add')
      .set(auth(tokenA))
      .send({ title: '测试游记一T', content: '晨雾很美', images: [0, 1], topicIds: [] });
    expect(res.body.code).toBe(1000);
    expect(res.body.data.status).toBe('normal');
  });

  it('敏感词命中 → pending + auditReason', async () => {
    const res = await createHttpRequest(app)
      .post('/app/community/post/add')
      .set(auth(tokenA))
      .send({ title: '含测试敏感词T的标题', content: '内容', images: [] });
    expect(res.body.code).toBe(1000);
    expect(res.body.data.status).toBe('pending');
  });

  it('正文超 5000 字拦截', async () => {
    const res = await createHttpRequest(app)
      .post('/app/community/post/add')
      .set(auth(tokenA))
      .send({ title: '超长T', content: '字'.repeat(5001), images: [] });
    expect(res.body.code).toBe(1001);
  });

  it('发布即生成模式A足迹（来自已核销票）', async () => {
    // 给用户A造一张已核销的路线票（覆盖 9201/9202 两站）
    const u = await one(`SELECT id FROM member_user WHERE phone='13600000001'`);
    await conn.query(
      `INSERT INTO travel_e_ticket (orderNo, userId, itemType, itemId, useDate, qrCode, status, verifyTime, createTime, updateTime)
       VALUES ('TESTTC21001', ${u.id}, 'route', 9201, '2030-01-01', 'TESTTC21001-01', 'used', NOW(), NOW(), NOW())`
    );
    const add = await createHttpRequest(app)
      .post('/app/community/post/add')
      .set(auth(tokenA))
      .send({ title: '有足迹的游记T', content: '两站都点亮', images: [] });
    expect(add.body.code).toBe(1000);
    const detail = await createHttpRequest(app).get(
      `/app/community/post/detail?id=${add.body.data.id}`
    );
    expect(detail.body.data.footprint.mode).toBe('auto');
    expect(detail.body.data.footprint.stops.length).toBe(2);
    expect(detail.body.data.footprint.stops.every((s) => s.lit)).toBe(true);
  });

  it('attachRoute 模式B：快照命中站 lit、未去站 locked', async () => {
    const add = await createHttpRequest(app)
      .post('/app/community/post/add')
      .set(auth(tokenA))
      .send({ title: '模式B游记T', content: '只去了一站', images: [] });
    const postId = add.body.data.id;
    const att = await createHttpRequest(app)
      .post('/app/community/post/attachRoute')
      .set(auth(tokenA))
      .send({
        postId,
        routeId: 9201,
        stops: [{ spotId: 9201, dayNo: 1, memo: '晨雾六点十分' }],
      });
    expect(att.body.code).toBe(1000);
    const detail = await createHttpRequest(app).get(
      `/app/community/post/detail?id=${postId}`
    );
    expect(detail.body.data.footprint.mode).toBe('route');
    expect(detail.body.data.footprint.routeId).toBe(9201);
    const stops = detail.body.data.footprint.stops;
    expect(stops).toHaveLength(2);
    const litStop = stops.find((s) => s.spotId === 9201);
    const lockedStop = stops.find((s) => s.spotId === 9202);
    expect(litStop.lit).toBe(true);
    expect(litStop.memo).toBe('晨雾六点十分');
    expect(lockedStop.locked).toBe(true);
  });

  it('feed：recommend/latest 返回 normal 帖，pending 不出现', async () => {
    const feed = await createHttpRequest(app).get('/app/community/post/feed?tab=latest');
    expect(feed.body.code).toBe(1000);
    expect(feed.body.data.total).toBeGreaterThan(0);
    expect(feed.body.data.list.every((p) => p.status === 'normal')).toBe(true);
    expect(feed.body.data.list.every((p) => p.author && p.author.nickname)).toBe(true);
  });

  it('非本人不可删除他人游记', async () => {
    const add = await createHttpRequest(app)
      .post('/app/community/post/add')
      .set(auth(tokenA))
      .send({ title: '待删游记T', content: 'x', images: [] });
    const res = await createHttpRequest(app)
      .post('/app/community/post/delete')
      .set(auth(tokenB))
      .send({ id: add.body.data.id });
    expect(res.body.code).toBe(1001);
    const ok = await createHttpRequest(app)
      .post('/app/community/post/delete')
      .set(auth(tokenA))
      .send({ id: add.body.data.id });
    expect(ok.body.code).toBe(1000);
  });
});
