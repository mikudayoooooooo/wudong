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
  let tokenD: string; // 非住宿模块（product）商家
  let hotelIdA = 0;

  beforeAll(async () => {
    app = await boot();
    ({ token: tokenA, merchantId: merchantIdA } = await registerMerchant(
      app,
      '13300133004',
      'accommodation'
    ));
    ({ token: tokenB, merchantId: merchantIdB } = await registerMerchant(
      app,
      '13300133005',
      'accommodation'
    ));
    tokenC = await registerAndLogin(app, '13300133006');
    ({ token: tokenD } = await registerMerchant(app, '13300133007', 'product'));
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

  it('新增民宿：归属当前商家，请求体 merchantId 被忽略（P5）', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenA))
      .send({
        name: '苗寨一号院',
        address: '雷山县乌东村一组',
        longitude: 108.107,
        latitude: 26.403,
        styleTags: ['苗寨', '江景'],
        facilityTags: ['WiFi'],
        intro: '推窗见梯田',
        merchantId: 99999,
      });
    expect(res.body.code).toBe(1000);
    hotelIdA = res.body.data.id;
    expect(Number(res.body.data.merchantId)).toBe(merchantIdA);
  });

  it('民宿必填字段缺失被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenA))
      .send({ address: '只有地址' });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('请填写完整的民宿信息');
  });

  it('非住宿模块商家无法新增民宿（P4）', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenD))
      .send({ name: '不该建的院', address: 'x', longitude: 1, latitude: 1 });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('您的入驻模块非住宿，无法新增民宿');
  });

  it('列表只含自己的民宿', async () => {
    const mine = await createHttpRequest(app)
      .get('/app/accommodation/merchant/hotel/page')
      .set(auth(tokenA));
    expect(mine.body.data.total).toBe(1);
    const other = await createHttpRequest(app)
      .get('/app/accommodation/merchant/hotel/page')
      .set(auth(tokenB));
    expect(other.body.data.total).toBe(0);
  });

  it('查看他人民宿被拒绝（P3）', async () => {
    const res = await createHttpRequest(app)
      .get(`/app/accommodation/merchant/hotel/info?id=${hotelIdA}`)
      .set(auth(tokenB));
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('无权操作该资源');
  });

  it('他人民宿不存在的 id 与无权同文案（不泄漏存在性）', async () => {
    const res = await createHttpRequest(app)
      .get('/app/accommodation/merchant/hotel/info?id=99999999')
      .set(auth(tokenB));
    expect(res.body.message).toBe('无权操作该资源');
  });

  it('更新他人民宿被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/update')
      .set(auth(tokenB))
      .send({ id: hotelIdA, name: '被篡改' });
    expect(res.body.message).toBe('无权操作该资源');
  });

  it('更新自己的民宿成功，且改不动归属（P5）', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/update')
      .set(auth(tokenA))
      .send({
        id: hotelIdA,
        name: '苗寨一号院（改）',
        status: 0,
        merchantId: 88888,
      });
    expect(res.body.code).toBe(1000);

    const info = await createHttpRequest(app)
      .get(`/app/accommodation/merchant/hotel/info?id=${hotelIdA}`)
      .set(auth(tokenA));
    expect(info.body.data.name).toBe('苗寨一号院（改）');
    expect(info.body.data.status).toBe(0);
    expect(Number(info.body.data.merchantId)).toBe(merchantIdA);
  });

  it('标签不是数组被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/update')
      .set(auth(tokenA))
      .send({ id: hotelIdA, styleTags: '苗寨' });
    expect(res.body.message).toBe('标签格式不正确');
  });

  it('删除有房型的民宿被拒绝（P6）', async () => {
    const conn = await mysql.createConnection(DB);
    await conn.query(
      `INSERT INTO room_type
        (hotelId, name, bedType, maxGuests, price, stock, status, createTime, updateTime)
       VALUES (?, ?, ?, ?, ?, ?, 1, '2026-09-10 10:00:00', '2026-09-10 10:00:00')`,
      [hotelIdA, '大床房', '大床', 2, 380, 3]
    );

    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/delete')
      .set(auth(tokenA))
      .send({ id: hotelIdA });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('请先删除该民宿下的房型');

    await conn.query('DELETE FROM room_type WHERE hotelId = ?', [hotelIdA]);
    await conn.end();
  });

  it('删除自己的空民宿成功', async () => {
    const created = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenA))
      .send({
        name: '临时院',
        address: '雷山县',
        longitude: 108,
        latitude: 26,
      });
    const id = created.body.data.id;

    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/delete')
      .set(auth(tokenA))
      .send({ id });
    expect(res.body.code).toBe(1000);

    const info = await createHttpRequest(app)
      .get(`/app/accommodation/merchant/hotel/info?id=${id}`)
      .set(auth(tokenA));
    expect(info.body.message).toBe('无权操作该资源');
  });
});
