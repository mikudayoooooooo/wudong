import {
  auth,
  boot,
  close,
  createHttpRequest,
  registerAndLogin,
} from './helper';

const phone = '13000430001';

describe('收藏类型白名单七类并集', () => {
  let app;
  let token: string;

  beforeAll(async () => {
    app = await boot();
    token = await registerAndLogin(app, phone);
  });

  afterAll(async () => {
    await close(app);
  });

  it('新增类型 product/restaurant/hotel 可收藏', async () => {
    for (const targetType of ['product', 'restaurant', 'hotel']) {
      const res = await createHttpRequest(app)
        .post('/app/member/favorite/toggle')
        .set(auth(token))
        .send({ targetType, targetId: 1 });
      expect(res.body.code).toBe(1000);
      expect(res.body.data.favorited).toBe(true);
    }
  });

  it('原有类型回归不受影响', async () => {
    const res = await createHttpRequest(app)
      .post('/app/member/favorite/toggle')
      .set(auth(token))
      .send({ targetType: 'route', targetId: 2 });
    expect(res.body.code).toBe(1000);
    expect(res.body.data.favorited).toBe(true);
  });

  it('白名单之外仍被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/member/favorite/toggle')
      .set(auth(token))
      .send({ targetType: 'ticket', targetId: 1 });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('收藏类型不正确');
  });
});
