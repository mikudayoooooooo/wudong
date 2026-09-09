import * as mysql from 'mysql2/promise';
import {
  auth,
  boot,
  close,
  createHttpRequest,
  registerAndLogin,
} from './helper';
import { MerchantService } from '../src/modules/merchant/service/merchant';

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

// 注意：一个测试文件只 boot 一次应用（helper 约定），全部用例串行共享同一实例
describe('merchant 入驻与审核', () => {
  let app;
  let merchantService: MerchantService;

  // 主用户（走完申请→重复申请→my 全流程）
  let token: string;
  // 审核流用户：E 通过、F 驳回
  let tokenE: string;
  let tokenF: string;
  let userIdE: number;
  let userIdF: number;
  let applicationEId: number;
  let applicationFId: number;

  beforeAll(async () => {
    app = await boot();
    merchantService = await app
      .getApplicationContext()
      .getAsync(MerchantService);
    token = await registerAndLogin(app, '13200132001');
    tokenE = await registerAndLogin(app, '13200132002');
    tokenF = await registerAndLogin(app, '13200132003');
    for (const [tk, id] of [
      [tokenE, 'userIdE'],
      [tokenF, 'userIdF'],
    ] as const) {
      const me = await createHttpRequest(app)
        .get('/app/member/info/person')
        .set(auth(tk));
      if (id === 'userIdE') {
        userIdE = me.body.data.id;
      } else {
        userIdF = me.body.data.id;
      }
    }
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

  it('审核通过：店铺生成 + role 回写 + 站内通知', async () => {
    // E 用户提交申请
    await createHttpRequest(app)
      .post('/app/merchant/apply')
      .set(auth(tokenE))
      .send({ ...APPLY_OK, contactPhone: '13200132002', shopName: '银饰工坊' });
    const progress = await createHttpRequest(app)
      .get('/app/merchant/application')
      .set(auth(tokenE));
    applicationEId = progress.body.data.id;

    await expect(
      merchantService.audit(applicationEId, true, '材料齐全', 1)
    ).resolves.toBe(true);

    const my = await createHttpRequest(app)
      .get('/app/merchant/my')
      .set(auth(tokenE));
    expect(my.body.data.shopName).toBe('银饰工坊');
    expect(my.body.data.status).toBe(1);
    expect(String(my.body.data.username)).toBe(`m${userIdE}`);

    const person = await createHttpRequest(app)
      .get('/app/member/info/person')
      .set(auth(tokenE));
    expect(person.body.data.role).toBe(2);

    const messages = await createHttpRequest(app)
      .get('/app/message/page?page=1&size=10')
      .set(auth(tokenE));
    expect(
      messages.body.data.list.some(x => x.title === '入驻审核通过')
    ).toBe(true);
  });

  it('重复审核被拒绝', async () => {
    await expect(
      merchantService.audit(applicationEId, true, 'x', 1)
    ).rejects.toThrow('该申请已审核');
  });

  it('审核驳回：通知 + 可重新申请', async () => {
    await createHttpRequest(app)
      .post('/app/merchant/apply')
      .set(auth(tokenF))
      .send({ ...APPLY_OK, contactPhone: '13200132003', shopName: '侗布染坊' });
    const progress = await createHttpRequest(app)
      .get('/app/merchant/application')
      .set(auth(tokenF));
    applicationFId = progress.body.data.id;

    await expect(
      merchantService.audit(applicationFId, false, '材料不全', 1)
    ).resolves.toBe(true);

    const after = await createHttpRequest(app)
      .get('/app/merchant/application')
      .set(auth(tokenF));
    expect(after.body.data.status).toBe(3);

    const messages = await createHttpRequest(app)
      .get('/app/message/page?page=1&size=10')
      .set(auth(tokenF));
    expect(
      messages.body.data.list.some(x => x.title === '入驻审核未通过')
    ).toBe(true);

    const again = await createHttpRequest(app)
      .post('/app/merchant/apply')
      .set(auth(tokenF))
      .send({ ...APPLY_OK, contactPhone: '13200132003', shopName: '侗布染坊二号' });
    expect(again.body.code).toBe(1000);
  });

  it('isMerchant 判断商家身份', async () => {
    const merchant = await merchantService.isMerchant(userIdE);
    expect(merchant.shopName).toBe('银饰工坊');
    const none = await merchantService.isMerchant(userIdF);
    expect(none ?? null).toBe(null);
  });

  it('管理端商家与申请接口未登录返回401', async () => {
    const m = await createHttpRequest(app).get(
      '/admin/merchant/page?page=1&size=10'
    );
    expect(m.status).toBe(401);
    const a = await createHttpRequest(app).get(
      '/admin/merchant/application/page?page=1&size=10'
    );
    expect(a.status).toBe(401);
  });
});
