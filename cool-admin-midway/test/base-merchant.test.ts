import * as mysql from 'mysql2/promise';
import {
  auth,
  boot,
  close,
  createHttpRequest,
  registerAndLogin,
} from './helper';

const phone = '13200132001';

const APPLY_OK = {
  shopName: '苗银世家',
  module: 'product',
  contactName: '张三',
  contactPhone: '13200132001',
  idCard: '522301199001010011',
  idCardFront: 'http://img/id-front.png',
  idCardBack: 'http://img/id-back.png',
  businessLicense: 'http://img/license.png',
};

describe('merchant 入驻申请', () => {
  let app;
  let token: string;

  beforeAll(async () => {
    app = await boot();
    token = await registerAndLogin(app, phone);
  });

  afterAll(async () => {
    await close(app);
  });

  it('merchant 与 merchant_application 两张表存在', async () => {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3307,
      user: 'root',
      password: '123456',
      database: 'wudong_platform_test',
    });
    const [rows]: any = await conn.query(
      `SELECT COUNT(*) AS c FROM information_schema.tables
       WHERE table_schema = 'wudong_platform_test'
         AND table_name IN ('merchant', 'merchant_application')`
    );
    await conn.end();
    expect(Number(rows[0].c)).toBe(2);
  });

  it('未登录申请被拦截', async () => {
    const res = await createHttpRequest(app)
      .post('/app/merchant/apply')
      .send(APPLY_OK);
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('必填字段缺失被拒绝', async () => {
    for (const missing of ['shopName', 'businessLicense', 'idCardFront']) {
      const param = { ...APPLY_OK };
      delete param[missing];
      const res = await createHttpRequest(app)
        .post('/app/merchant/apply')
        .set(auth(token))
        .send(param);
      expect(res.body.code).toBe(1001);
      expect(res.body.message).toBe('请填写完整的入驻信息');
    }
  });

  it('入驻模块不正确被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/merchant/apply')
      .set(auth(token))
      .send({ ...APPLY_OK, module: 'hotel' });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('入驻模块不正确');
  });

  it('提交入驻申请成功，可查申请进度', async () => {
    const res = await createHttpRequest(app)
      .post('/app/merchant/apply')
      .set(auth(token))
      .send(APPLY_OK);
    expect(res.body.code).toBe(1000);

    const progress = await createHttpRequest(app)
      .get('/app/merchant/application')
      .set(auth(token));
    expect(progress.body.code).toBe(1000);
    expect(progress.body.data.shopName).toBe('苗银世家');
    expect(progress.body.data.status).toBe(1);
  });

  it('重复申请被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/merchant/apply')
      .set(auth(token))
      .send({ ...APPLY_OK, shopName: '苗银世家二号' });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('已存在待审核的入驻申请');
  });

  it('尚未成为商家时 my 返回空', async () => {
    const res = await createHttpRequest(app)
      .get('/app/merchant/my')
      .set(auth(token));
    expect(res.body.code).toBe(1000);
    // cool-admin ok(null) 不输出 data 键，前端按 falsy 处理
    expect(res.body.data ?? null).toBe(null);
  });
});
