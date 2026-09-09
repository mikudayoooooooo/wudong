import { boot, close, createHttpRequest } from './helper';

const phone = '13900139001';
const password = 'abc123456';

describe('member 注册/登录', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  /** 请求模拟短信并取回显验证码（unittest 环境专用） */
  async function getSmsCode(p: string) {
    const res = await createHttpRequest(app)
      .post('/app/member/login/smsCode')
      .send({ phone: p });
    expect(res.body.code).toBe(1000);
    return res.body.data.code as string;
  }

  it('未注册手机号不能验证码登录', async () => {
    const code = await getSmsCode('13900139099');
    const res = await createHttpRequest(app)
      .post('/app/member/login/sms')
      .send({ phone: '13900139099', smsCode: code });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('该手机号未注册');
  });

  it('注册成功即登录并返回token', async () => {
    const code = await getSmsCode(phone);
    const res = await createHttpRequest(app)
      .post('/app/member/login/register')
      .send({ phone, smsCode: code, password });
    expect(res.body.code).toBe(1000);
    expect(res.body.data.userId).toBeGreaterThan(0);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.refreshToken).toBeTruthy();
  });

  it('密码不符合规则被拒绝（过短/无字母/无数字/过长）', async () => {
    const p = '13900139002';
    const code = await getSmsCode(p);
    for (const bad of ['12345678', 'abcdefgh', 'abc123', 'abc123456789012345678']) {
      const res = await createHttpRequest(app)
        .post('/app/member/login/register')
        .send({ phone: p, smsCode: code, password: bad });
      expect(res.body.code).toBe(1001);
      expect(res.body.message).toBe('密码须为8-20位，且同时包含字母和数字');
    }
  });

  it('重复注册被拒绝', async () => {
    const code = await getSmsCode(phone);
    const res = await createHttpRequest(app)
      .post('/app/member/login/register')
      .send({ phone, smsCode: code, password });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('该手机号已注册，请直接登录');
  });

  it('错误验证码不能注册', async () => {
    const res = await createHttpRequest(app)
      .post('/app/member/login/register')
      .send({ phone: '13900139003', smsCode: '000000', password });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('验证码错误或已过期');
  });

  it('密码登录成功，昵称含默认"游客"', async () => {
    const res = await createHttpRequest(app)
      .post('/app/member/login/password')
      .send({ phone, password });
    expect(res.body.code).toBe(1000);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.nickname).toContain('游客');
  });

  it('密码错误被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/member/login/password')
      .send({ phone, password: 'wrong12345' });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('账号或密码错误');
  });

  it('验证码登录成功', async () => {
    const code = await getSmsCode(phone);
    const res = await createHttpRequest(app)
      .post('/app/member/login/sms')
      .send({ phone, smsCode: code });
    expect(res.body.code).toBe(1000);
    expect(res.body.data.token).toBeTruthy();
  });

  it('accessToken 不能当 refreshToken 使用', async () => {
    const login = await createHttpRequest(app)
      .post('/app/member/login/password')
      .send({ phone, password });
    const res = await createHttpRequest(app)
      .post('/app/member/login/refreshToken')
      .send({ refreshToken: login.body.data.token });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('刷新token失败，请检查refreshToken是否正确或过期');
  });

  it('refreshToken 可换取新token', async () => {
    const login = await createHttpRequest(app)
      .post('/app/member/login/password')
      .send({ phone, password });
    const res = await createHttpRequest(app)
      .post('/app/member/login/refreshToken')
      .send({ refreshToken: login.body.data.refreshToken });
    expect(res.body.code).toBe(1000);
    expect(res.body.data.token).toBeTruthy();
  });
});
