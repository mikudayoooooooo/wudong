import { auth, boot, close, createHttpRequest, registerMerchant } from './helper';

describe('B 端房态日历', () => {
  let app;
  let tokenA: string;
  let tokenB: string;
  let hotelA = 0;
  let roomTypeA = 0;
  let roomTypeB = 0;

  const START = '2026-10-01';
  const END = '2026-10-07';

  beforeAll(async () => {
    app = await boot();
    ({ token: tokenA } = await registerMerchant(app, '13300133201', 'accommodation'));
    ({ token: tokenB } = await registerMerchant(app, '13300133202', 'accommodation'));

    const hotel = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenA))
      .send({ name: '日历测试院', address: '雷山县三组', longitude: 108.3, latitude: 26.6 });
    hotelA = hotel.body.data.id;

    const roomType = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/add')
      .set(auth(tokenA))
      .send({ hotelId: hotelA, name: '大床房', price: 400, stock: 3 });
    roomTypeA = roomType.body.data.id;

    const hotelB = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenB))
      .send({ name: '别人家院子', address: '雷山县四组', longitude: 108.4, latitude: 26.7 });
    const roomTypeOther = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/add')
      .set(auth(tokenB))
      .send({ hotelId: hotelB.body.data.id, name: '别家大床房', price: 500, stock: 2 });
    roomTypeB = roomTypeOther.body.data.id;
  });

  afterAll(async () => {
    await close(app);
  });

  it('未登录返回登录失效', async () => {
    const res = await createHttpRequest(app).get(
      `/app/accommodation/merchant/calendar/range?roomTypeId=${roomTypeA}&startDate=${START}&endDate=${END}`
    );
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('操作他人房型的房态被拒绝（P3）', async () => {
    const res = await createHttpRequest(app)
      .get(
        `/app/accommodation/merchant/calendar/range?roomTypeId=${roomTypeB}&startDate=${START}&endDate=${END}`
      )
      .set(auth(tokenA));
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('无权操作该资源');
  });

  it('用他人房型批量设置被拒绝且不写入（P3 写接口越权）', async () => {
    // calendar/batch 是写接口：requireOwnedRoomType 若被挪走/传错参，这里必须红
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/calendar/batch')
      .set(auth(tokenA))
      .send({ roomTypeId: roomTypeB, startDate: START, endDate: END, price: 123 });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('无权操作该资源');

    // 关键：确认没有落库——用房主 B 自己的 token 查该区间，价格仍是房型基础价
    const range = await createHttpRequest(app)
      .get(
        `/app/accommodation/merchant/calendar/range?roomTypeId=${roomTypeB}&startDate=${START}&endDate=${END}`
      )
      .set(auth(tokenB));
    expect(range.body.code).toBe(1000);
    expect(Number(range.body.data[0].price)).toBe(500);
    expect(range.body.data.every((r: any) => Number(r.price) !== 123)).toBe(true);
  });

  it('批量设置价格与库存', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/calendar/batch')
      .set(auth(tokenA))
      .send({
        roomTypeId: roomTypeA,
        startDate: START,
        endDate: END,
        price: 480,
        availableStock: 5,
      });
    expect(res.body.code).toBe(1000);
    expect(res.body.data.count).toBe(7);
  });

  it('区间查询读回设置值，超出房型库存被截断', async () => {
    const res = await createHttpRequest(app)
      .get(
        `/app/accommodation/merchant/calendar/range?roomTypeId=${roomTypeA}&startDate=${START}&endDate=${END}`
      )
      .set(auth(tokenA));
    expect(res.body.code).toBe(1000);
    expect(res.body.data.length).toBe(7);
    expect(Number(res.body.data[0].price)).toBe(480);
    expect(res.body.data[0].availableStock).toBe(3); // 房型 stock=3
    expect(res.body.data[0].status).toBe(1);
  });

  it('无记录日期回退房型默认值', async () => {
    const res = await createHttpRequest(app)
      .get(
        `/app/accommodation/merchant/calendar/range?roomTypeId=${roomTypeA}&startDate=2026-11-01&endDate=2026-11-03`
      )
      .set(auth(tokenA));
    expect(res.body.data.length).toBe(3);
    expect(Number(res.body.data[0].price)).toBe(400); // 房型基础价
    expect(res.body.data[0].availableStock).toBe(3);
  });

  it('关房后该日不可订', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/calendar/batch')
      .set(auth(tokenA))
      .send({
        roomTypeId: roomTypeA,
        startDate: '2026-10-03',
        endDate: '2026-10-03',
        closed: true,
      });
    expect(res.body.data.count).toBe(1);

    const range = await createHttpRequest(app)
      .get(
        `/app/accommodation/merchant/calendar/range?roomTypeId=${roomTypeA}&startDate=${START}&endDate=${END}`
      )
      .set(auth(tokenA));
    const day = range.body.data.find((r: any) => r.date === '2026-10-03');
    expect(day.status).toBe(0);
  });

  it('按星期批量设置只落在指定星期', async () => {
    // 2026-10-01 是周四(4)、10-02 周五(5)…；只设周五
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/calendar/batch')
      .set(auth(tokenA))
      .send({
        roomTypeId: roomTypeA,
        startDate: START,
        endDate: END,
        weekDays: [5],
        price: 999,
      });
    expect(res.body.data.count).toBe(1); // 区间内只有 10-02 是周五

    const range = await createHttpRequest(app)
      .get(
        `/app/accommodation/merchant/calendar/range?roomTypeId=${roomTypeA}&startDate=${START}&endDate=${END}`
      )
      .set(auth(tokenA));
    const friday = range.body.data.find((r: any) => r.date === '2026-10-02');
    expect(Number(friday.price)).toBe(999);
  });

  it('超过 32 天被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/calendar/batch')
      .set(auth(tokenA))
      .send({ roomTypeId: roomTypeA, startDate: '2026-12-01', endDate: '2027-01-05', price: 100 });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('日期区间最多32天');
  });

  it('日期区间无效被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/calendar/batch')
      .set(auth(tokenA))
      .send({ roomTypeId: roomTypeA, startDate: '2026-10-05', endDate: '2026-10-01', price: 100 });
    expect(res.body.message).toBe('日期区间无效');
  });
});
