import { auth, boot, close, createHttpRequest, registerAndLogin } from './helper';

const phone = '13700137001';
const password = 'abc123456';

describe('member 个人资料', () => {
  let app;
  let token: string;

  beforeAll(async () => {
    app = await boot();
    token = await registerAndLogin(app, phone, password);
  });

  afterAll(async () => {
    await close(app);
  });

  it('未登录访问受保护接口被拦截（生产真值：200 + 1001 登录失效，非 HTTP 401）', async () => {
    const res = await createHttpRequest(app).get('/app/member/info/person');
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('person 返回资料且不含密码字段', async () => {
    const res = await createHttpRequest(app)
      .get('/app/member/info/person')
      .set(auth(token));
    expect(res.body.code).toBe(1000);
    expect(res.body.data.phone).toBe(phone);
    expect(res.body.data.password).toBeUndefined();
    expect(res.body.data.nickname).toContain('游客');
  });

  it('updatePerson 只更新白名单字段', async () => {
    const res = await createHttpRequest(app)
      .post('/app/member/info/updatePerson')
      .set(auth(token))
      .send({
        nickname: '苗岭阿妹',
        bio: '喜欢徒步',
        gender: 2,
        phone: '19999999999',
        status: 0,
      });
    expect(res.body.code).toBe(1000);
    const person = await createHttpRequest(app)
      .get('/app/member/info/person')
      .set(auth(token));
    expect(person.body.data.nickname).toBe('苗岭阿妹');
    expect(person.body.data.bio).toBe('喜欢徒步');
    expect(person.body.data.gender).toBe(2);
    // 白名单外的字段不被篡改
    expect(person.body.data.phone).toBe(phone);
    expect(person.body.data.status).toBe(1);
  });

  it('验证码重置密码后新密码可登录、旧密码失效', async () => {
    const sms = await createHttpRequest(app)
      .post('/app/member/login/smsCode')
      .send({ phone });
    const res = await createHttpRequest(app)
      .post('/app/member/info/updatePassword')
      .set(auth(token))
      .send({ password: 'xyz987654', smsCode: sms.body.data.code });
    expect(res.body.code).toBe(1000);

    const newLogin = await createHttpRequest(app)
      .post('/app/member/login/password')
      .send({ phone, password: 'xyz987654' });
    expect(newLogin.body.code).toBe(1000);

    const oldLogin = await createHttpRequest(app)
      .post('/app/member/login/password')
      .send({ phone, password });
    expect(oldLogin.body.code).toBe(1001);
  });
});
