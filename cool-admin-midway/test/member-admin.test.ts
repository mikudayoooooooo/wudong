import { boot, close, createHttpRequest } from './helper';

describe('member 管理端', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it('无 admin token 访问返回401（路由已注册且受 admin 鉴权保护）', async () => {
    const res = await createHttpRequest(app).get(
      '/admin/member/user/page?page=1&size=10'
    );
    expect(res.status).toBe(401);
  });
});
