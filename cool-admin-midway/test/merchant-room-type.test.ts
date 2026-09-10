import * as mysql from 'mysql2/promise';
import { auth, boot, close, createHttpRequest, registerMerchant } from './helper';

const DB = {
  host: '127.0.0.1',
  port: 3307,
  user: 'root',
  password: '123456',
  database: 'wudong_platform_test',
};

describe('B 端房型管理', () => {
  let app;
  let tokenA: string;
  let merchantIdA: number;
  let tokenB: string;
  let hotelA = 0;
  let hotelB = 0;
  let roomTypeA = 0;

  beforeAll(async () => {
    app = await boot();
    ({ token: tokenA, merchantId: merchantIdA } = await registerMerchant(
      app,
      '13300133101',
      'accommodation'
    ));
    ({ token: tokenB } = await registerMerchant(app, '13300133102', 'accommodation'));

    const a = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenA))
      .send({ name: 'A 家院子', address: '雷山县一组', longitude: 108.1, latitude: 26.4 });
    hotelA = a.body.data.id;
    const b = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenB))
      .send({ name: 'B 家院子', address: '雷山县二组', longitude: 108.2, latitude: 26.5 });
    hotelB = b.body.data.id;
  });

  afterAll(async () => {
    await close(app);
  });

  it('缺少 hotelId 被拒绝', async () => {
    const res = await createHttpRequest(app)
      .get('/app/accommodation/merchant/room-type/page')
      .set(auth(tokenA));
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('请指定民宿');
  });

  it('未登录返回登录失效', async () => {
    const res = await createHttpRequest(app).post(
      '/app/accommodation/merchant/room-type/add'
    );
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('给他人民宿加房型被拒绝（P3）', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/add')
      .set(auth(tokenB))
      .send({ hotelId: hotelA, name: '偷加房型', price: 380, stock: 1 });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('无权操作该资源');
  });

  it('新增房型成功且归属该民宿', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/add')
      .set(auth(tokenA))
      .send({
        hotelId: hotelA,
        name: '苗寨大床房',
        bedType: '大床',
        maxGuests: 2,
        price: 380,
        stock: 3,
        facilities: ['WiFi', '空调'],
      });
    expect(res.body.code).toBe(1000);
    roomTypeA = res.body.data.id;
    expect(Number(res.body.data.hotelId)).toBe(hotelA);
  });

  it('房型必填字段缺失被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/add')
      .set(auth(tokenA))
      .send({ hotelId: hotelA, name: '没有价格' });
    expect(res.body.message).toBe('请填写完整的房型信息');
  });

  it('价格必须大于 0', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/add')
      .set(auth(tokenA))
      .send({ hotelId: hotelA, name: '免费房', price: 0, stock: 1 });
    expect(res.body.message).toBe('房型价格必须大于 0');
  });

  it('房间数量至少为 1', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/add')
      .set(auth(tokenA))
      .send({ hotelId: hotelA, name: '零间房', price: 100, stock: 0 });
    expect(res.body.message).toBe('房间数量至少为 1');
  });

  it('价格传空串被拒绝（Number(\'\') 不是 0）', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/add')
      .set(auth(tokenA))
      .send({ hotelId: hotelA, name: '空价房', price: '', stock: 1 });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('房型信息格式不正确');

    const list = await createHttpRequest(app)
      .get(`/app/accommodation/merchant/room-type/page?hotelId=${hotelA}`)
      .set(auth(tokenA));
    expect(list.body.data.list.some((r: any) => r.name === '空价房')).toBe(false);
  });

  it('设施标签元素不是字符串被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/update')
      .set(auth(tokenA))
      .send({ id: roomTypeA, facilities: [{ name: 'WiFi' }] });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('标签格式不正确');
  });

  it('房型列表只含本民宿', async () => {
    const mine = await createHttpRequest(app)
      .get(`/app/accommodation/merchant/room-type/page?hotelId=${hotelA}`)
      .set(auth(tokenA));
    expect(mine.body.data.total).toBe(1);
    expect(mine.body.data.list[0].name).toBe('苗寨大床房');
  });

  it('查他人民宿房型列表被拒绝', async () => {
    const res = await createHttpRequest(app)
      .get(`/app/accommodation/merchant/room-type/page?hotelId=${hotelA}`)
      .set(auth(tokenB));
    expect(res.body.message).toBe('无权操作该资源');
  });

  it('更新他人房型被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/update')
      .set(auth(tokenB))
      .send({ id: roomTypeA, price: 1 });
    expect(res.body.message).toBe('无权操作该资源');
  });

  it('更新自己的房型成功，且不能改挂到别人民宿', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/update')
      .set(auth(tokenA))
      .send({ id: roomTypeA, price: 420, stock: 5, hotelId: hotelB, status: 0 });
    expect(res.body.code).toBe(1000);

    const list = await createHttpRequest(app)
      .get(`/app/accommodation/merchant/room-type/page?hotelId=${hotelA}`)
      .set(auth(tokenA));
    const row = list.body.data.list[0];
    expect(Number(row.price)).toBe(420);
    expect(row.stock).toBe(5);
    expect(row.status).toBe(0);
    expect(Number(row.hotelId)).toBe(hotelA);
  });

  it('删除房型级联清理房态（P7）', async () => {
    const conn = await mysql.createConnection(DB);
    await conn.query(
      `INSERT INTO room_calendar
        (roomTypeId, date, availableStock, price, status, createTime, updateTime)
       VALUES (?, '2026-10-01', 2, 420, 1, '2026-09-10 10:00:00', '2026-09-10 10:00:00')`,
      [roomTypeA]
    );
    const before: any = await conn.query(
      'SELECT COUNT(*) AS c FROM room_calendar WHERE roomTypeId = ?',
      [roomTypeA]
    );
    expect(Number(before[0][0].c)).toBe(1);

    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/delete')
      .set(auth(tokenA))
      .send({ id: roomTypeA });
    expect(res.body.code).toBe(1000);

    const after: any = await conn.query(
      'SELECT COUNT(*) AS c FROM room_calendar WHERE roomTypeId = ?',
      [roomTypeA]
    );
    await conn.end();
    expect(Number(after[0][0].c)).toBe(0);

    const list = await createHttpRequest(app)
      .get(`/app/accommodation/merchant/room-type/page?hotelId=${hotelA}`)
      .set(auth(tokenA));
    expect(list.body.data.total).toBe(0);
  });
});
