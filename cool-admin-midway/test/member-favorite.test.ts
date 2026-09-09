import {
  auth,
  boot,
  close,
  createHttpRequest,
  registerAndLogin,
} from './helper';
import { MemberFavoriteService } from '../src/modules/member/service/favorite';

const phoneA = '13600136001';
const phoneB = '13600136002';

describe('member 收藏', () => {
  let app;
  let tokenA: string;
  let tokenB: string;

  beforeAll(async () => {
    app = await boot();
    tokenA = await registerAndLogin(app, phoneA);
    tokenB = await registerAndLogin(app, phoneB);
  });

  afterAll(async () => {
    await close(app);
  });

  it('未登录访问被拦截（生产真值：200 + 1001 登录失效，非 HTTP 401）', async () => {
    const res = await createHttpRequest(app).get(
      '/app/member/favorite/page?page=1&size=10'
    );
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('toggle 收藏与取消（幂等切换）', async () => {
    const on = await createHttpRequest(app)
      .post('/app/member/favorite/toggle')
      .set(auth(tokenA))
      .send({ targetType: 'route', targetId: 101 });
    expect(on.body.code).toBe(1000);
    expect(on.body.data.favorited).toBe(true);

    const off = await createHttpRequest(app)
      .post('/app/member/favorite/toggle')
      .set(auth(tokenA))
      .send({ targetType: 'route', targetId: 101 });
    expect(off.body.code).toBe(1000);
    expect(off.body.data.favorited).toBe(false);

    const again = await createHttpRequest(app)
      .post('/app/member/favorite/toggle')
      .set(auth(tokenA))
      .send({ targetType: 'route', targetId: 101 });
    expect(again.body.data.favorited).toBe(true);
  });

  it('check 反映收藏状态', async () => {
    await createHttpRequest(app)
      .post('/app/member/favorite/toggle')
      .set(auth(tokenA))
      .send({ targetType: 'scenic', targetId: 202 });
    const yes = await createHttpRequest(app)
      .get('/app/member/favorite/check?targetType=scenic&targetId=202')
      .set(auth(tokenA));
    expect(yes.body.data).toBe(true);
    const no = await createHttpRequest(app)
      .get('/app/member/favorite/check?targetType=scenic&targetId=203')
      .set(auth(tokenA));
    expect(no.body.data).toBe(false);
  });

  it('非法 targetType 被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/member/favorite/toggle')
      .set(auth(tokenA))
      .send({ targetType: 'hotel', targetId: 1 });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('收藏类型不正确');
  });

  it('page 分页返回且用户间隔离，支持类型筛选', async () => {
    // A 收藏 3 条（route x2, post x1）
    const items = [
      { targetType: 'route', targetId: 301 },
      { targetType: 'route', targetId: 302 },
      { targetType: 'post', targetId: 303 },
    ];
    for (const it of items) {
      await createHttpRequest(app)
        .post('/app/member/favorite/toggle')
        .set(auth(tokenA))
        .send(it);
    }
    // B 收藏 1 条，验证隔离
    await createHttpRequest(app)
      .post('/app/member/favorite/toggle')
      .set(auth(tokenB))
      .send({ targetType: 'route', targetId: 301 });

    const all = await createHttpRequest(app)
      .get('/app/member/favorite/page?page=1&size=10')
      .set(auth(tokenA));
    expect(all.body.code).toBe(1000);
    // A 此前已收藏 route:101（toggle 用例末态）与 scenic:202（check 用例），再加 3 条 = 5
    expect(all.body.data.total).toBe(5);
    expect(all.body.data.list.length).toBe(5);

    const routes = await createHttpRequest(app)
      .get('/app/member/favorite/page?page=1&size=10&targetType=route')
      .set(auth(tokenA));
    expect(routes.body.data.total).toBe(3); // 101、301、302
    expect(
      routes.body.data.list.every((it: any) => it.targetType === 'route')
    ).toBe(true);

    const mineB = await createHttpRequest(app)
      .get('/app/member/favorite/page?page=1&size=10')
      .set(auth(tokenB));
    expect(mineB.body.data.total).toBe(1); // B 只能看到自己的
  });

  it('并发重复 toggle 落到唯一索引时仍返回 favorited（无 500）', async () => {
    // 先真实收藏 guide:401，使库中存在该行（A 的 userId 从已有收藏行反推）
    await createHttpRequest(app)
      .post('/app/member/favorite/toggle')
      .set(auth(tokenA))
      .send({ targetType: 'guide', targetId: 401 });
    const svc = await app
      .getApplicationContext()
      .getAsync(MemberFavoriteService);
    const row = await svc.memberFavoriteEntity.findOneBy({
      targetType: 'route',
      targetId: 101,
    });
    expect(row).toBeTruthy();
    const userIdA = row!.userId;

    // 确定性模拟竞态窗口：并发双方都没看见已存在行（findOneBy 返回 null），
    // 使 toggle 走 insert 分支撞上 uk_user_target 重复键，
    // 断言败方被捕获并按最终落库状态返回 { favorited: true }，而非抛 500
    const spy = jest
      .spyOn(svc.memberFavoriteEntity, 'findOneBy')
      .mockResolvedValue(null as any);
    try {
      const res = await svc.toggle(userIdA, 'guide', 401);
      expect(res).toEqual({ favorited: true });
    } finally {
      spy.mockRestore();
    }
    // 竞态败方不产生第二行，终态仍为已收藏
    expect(await svc.check(userIdA, 'guide', 401)).toBe(true);
  });
});
