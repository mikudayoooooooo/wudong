import * as mysql from 'mysql2/promise';
import {
  auth,
  boot,
  close,
  createHttpRequest,
  registerAndLogin,
  registerMerchant,
} from './helper';

const DB = {
  host: '127.0.0.1',
  port: 3307,
  user: 'root',
  password: '123456',
  database: 'wudong_platform_test',
};

// 一个测试文件只 boot 一次应用（helper 约定），用例串行共享同一实例
describe('B 端民宿管理', () => {
  let app;
  let tokenA: string; // 商家 A（住宿模块）
  let merchantIdA: number;
  let tokenB: string; // 商家 B（住宿模块）
  let merchantIdB: number;
  let tokenC: string; // 普通会员（未入驻）

  beforeAll(async () => {
    app = await boot();
    ({ token: tokenA, merchantId: merchantIdA } = await registerMerchant(
      app,
      '13300133001',
      'accommodation'
    ));
    ({ token: tokenB, merchantId: merchantIdB } = await registerMerchant(
      app,
      '13300133002',
      'accommodation'
    ));
    tokenC = await registerAndLogin(app, '13300133003');
  });

  afterAll(async () => {
    await close(app);
  });

  it('未登录返回登录失效', async () => {
    const res = await createHttpRequest(app).get(
      '/app/accommodation/merchant/hotel/page'
    );
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('未入驻会员返回仅商家可访问', async () => {
    const res = await createHttpRequest(app)
      .get('/app/accommodation/merchant/hotel/page')
      .set(auth(tokenC));
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('仅商家可访问');
  });

  it('被禁用的商家返回仅商家可访问', async () => {
    const conn = await mysql.createConnection(DB);
    await conn.query('UPDATE merchant SET status = 0 WHERE id = ?', [
      merchantIdA,
    ]);
    const res = await createHttpRequest(app)
      .get('/app/accommodation/merchant/hotel/page')
      .set(auth(tokenA));
    await conn.query('UPDATE merchant SET status = 1 WHERE id = ?', [
      merchantIdA,
    ]);
    await conn.end();
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('仅商家可访问');
  });

  it('新商家民宿列表为空', async () => {
    const res = await createHttpRequest(app)
      .get('/app/accommodation/merchant/hotel/page')
      .set(auth(tokenA));
    expect(res.body.code).toBe(1000);
    expect(res.body.data.list).toEqual([]);
    expect(res.body.data.total).toBe(0);
  });
});
