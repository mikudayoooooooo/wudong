import { auth, boot, close, createHttpRequest, registerAndLogin } from './helper';

const phone = '13000130001';

describe('member_user.role 字段（D1）', () => {
  let app;
  let token: string;

  beforeAll(async () => {
    app = await boot();
    token = await registerAndLogin(app, phone);
  });

  afterAll(async () => {
    await close(app);
  });

  it('注册用户默认 role 为游客(1)', async () => {
    const res = await createHttpRequest(app)
      .get('/app/member/info/person')
      .set(auth(token));
    expect(res.body.code).toBe(1000);
    expect(res.body.data.role).toBe(1);
  });
});
