import { boot, close, createHttpRequest } from './helper';

describe('测试基建冒烟', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it('应用可启动，脚手架接口可访问（/app/user/login/captcha）', async () => {
    const res = await createHttpRequest(app).get(
      '/app/user/login/captcha?width=100&height=40'
    );
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1000);
  });
});
