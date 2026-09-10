import * as mysql from 'mysql2/promise';
import { boot, close, createHttpRequest, auth, registerAndLogin } from './helper';

/**
 * travel 下单/支付/退票 全链路（纪律：每文件一次 boot；号段 137xxx）
 * 价格由服务端查表计算——booking 接口不接收 price 字段（防篡改是结构性的）
 */
describe('travel 下单与电子票', () => {
  let app;
  let conn: mysql.Connection;
  let tokenA: string;
  let routeInventoryDate: string;
  let ticketInventoryDate: string;

  /** 取查询结果第一行（mysql2 联合类型收敛） */
  async function one(sql: string) {
    const [rows] = await conn.query(sql);
    return ((rows as any[]) || [])[0] || {};
  }

  beforeAll(async () => {
    app = await boot();
    conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3307,
      user: 'root',
      password: '123456',
      database: 'wudong_platform_test',
    });
    // 种子：景区/票种/路线/行程/库存（唯一命名便于清理与查询）
    await conn.query(`INSERT INTO travel_scenic_spot (id, name, type, address, openTime, intro, status, createTime, updateTime)
      VALUES (9001, '测试苗寨景区T', 'spot', '黔东南', '8:00-18:00', '测试景区', 1, NOW(), NOW())`);
    await conn.query(`INSERT INTO travel_ticket_type (id, scenicSpotId, name, price, totalStock, status, createTime, updateTime)
      VALUES (9001, 9001, '测试成人票T', 80, 100, 1, NOW(), NOW())`);
    await conn.query(`INSERT INTO travel_route_package (id, title, days, theme, price, departure, destination, status, createTime, updateTime)
      VALUES (9001, '测试深度两日游T', 2, '经典', 899, '凯里南站', '乌东村', 1, NOW(), NOW())`);
    await conn.query(`INSERT INTO travel_route_itinerary (routeId, dayNo, sort, scenicSpotId, createTime, updateTime)
      VALUES (9001, 1, 1, 9001, NOW(), NOW())`);
    // 库存：路线 9/12 售 7/30；门票 9/12 售 95/100（余 5）
    routeInventoryDate = '2030-09-12';
    ticketInventoryDate = '2030-09-12';
    await conn.query(`INSERT INTO travel_inventory (itemType, itemId, useDate, total, sold, createTime, updateTime)
      VALUES ('route', 9001, '${routeInventoryDate}', 30, 7, NOW(), NOW())`);
    await conn.query(`INSERT INTO travel_inventory (itemType, itemId, useDate, total, sold, createTime, updateTime)
      VALUES ('ticket', 9001, '${ticketInventoryDate}', 100, 95, NOW(), NOW())`);
    tokenA = await registerAndLogin(app, '13700000001');
  });

  afterAll(async () => {
    await conn.query(
      `DELETE FROM travel_e_ticket WHERE orderNo IN (SELECT orderNo FROM \`order\` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '137000000%'))`
    );
    await conn.query(`DELETE FROM travel_inventory WHERE itemId = 9001`);
    await conn.query(`DELETE FROM travel_route_itinerary WHERE routeId = 9001`);
    await conn.query(`DELETE FROM travel_route_package WHERE id = 9001`);
    await conn.query(`DELETE FROM travel_ticket_type WHERE id = 9001`);
    await conn.query(`DELETE FROM travel_scenic_spot WHERE id = 9001`);
    await conn.query(`DELETE FROM \`order\` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '137000000%')`);
    await conn.query(`DELETE FROM payment_record WHERE orderId NOT IN (SELECT id FROM \`order\`)`);
    await conn.query(`DELETE FROM member_user WHERE phone LIKE '137000000%'`);
    await conn.end();
    await close(app);
  });

  it('路线预订：服务端查价（899×2=1798），库存扣减，出 2 张票', async () => {
    const res = await createHttpRequest(app)
      .post('/app/travel/booking/create')
      .set(auth(tokenA))
      .send({ itemType: 'route', itemId: 9001, useDate: routeInventoryDate, quantity: 2 });
    expect(res.body.code).toBe(1000);
    expect(Number(res.body.data.payAmount)).toBe(1798);
    expect(res.body.data.ticketIds).toHaveLength(2);
    const inv = await one(
      `SELECT sold FROM travel_inventory WHERE itemType='route' AND itemId=9001 AND useDate='${routeInventoryDate}'`
    );
    expect(inv.sold).toBe(9);
  });

  it('预订接口不信任前端价格：无 price 字段，payAmount 与库表价一致', async () => {
    const res = await createHttpRequest(app)
      .post('/app/travel/booking/create')
      .set(auth(tokenA))
      .send({ itemType: 'ticket', itemId: 9001, useDate: ticketInventoryDate, quantity: 1, price: 0.01 });
    expect(res.body.code).toBe(1000);
    // 门票票种价 80，而非前端可传的 0.01
    expect(Number(res.body.data.payAmount)).toBe(80);
  });

  it('支付成功后订单已支付、票卡可查（effectiveStatus=unused）', async () => {
    const book = await createHttpRequest(app)
      .post('/app/travel/booking/create')
      .set(auth(tokenA))
      .send({ itemType: 'route', itemId: 9001, useDate: routeInventoryDate, quantity: 1 });
    const { orderNo } = book.body.data;
    const pay1 = await createHttpRequest(app)
      .post('/app/pay/create')
      .set(auth(tokenA))
      .send({ orderNo, channel: 'wechat' });
    const { paymentNo } = pay1.body.data;
    const pay2 = await createHttpRequest(app)
      .post('/app/pay/mock')
      .set(auth(tokenA))
      .send({ paymentNo });
    expect(pay2.body.code).toBe(1000);
    const my = await createHttpRequest(app).get('/app/travel/ticket/my').set(auth(tokenA));
    const row = my.body.data.find((t) => t.orderNo === orderNo);
    expect(row.effectiveStatus).toBe('unused');
    expect(row.orderStatus).toBe(2);
  });

  it('退票规则：使用日期不足 24h 拒绝', async () => {
    // 2030 的日期远超 24h，构造一个"明天"的订单验证拒绝
    const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10);
    await conn.query(
      `INSERT INTO travel_inventory (itemType, itemId, useDate, total, sold, createTime, updateTime)
       VALUES ('route', 9001, '${tomorrow}', 10, 0, NOW(), NOW())
       ON DUPLICATE KEY UPDATE total = 10, sold = 0`
    );
    const book = await createHttpRequest(app)
      .post('/app/travel/booking/create')
      .set(auth(tokenA))
      .send({ itemType: 'route', itemId: 9001, useDate: tomorrow, quantity: 1 });
    expect(book.body.code).toBe(1000);
    const { orderNo } = book.body.data;
    await createHttpRequest(app).post('/app/pay/create').set(auth(tokenA)).send({ orderNo, channel: 'wechat' });
    const rec = await createHttpRequest(app).get(`/app/pay/record?orderNo=${orderNo}`).set(auth(tokenA));
    await createHttpRequest(app).post('/app/pay/mock').set(auth(tokenA)).send({ paymentNo: rec.body.data[0].paymentNo });
    const res = await createHttpRequest(app)
      .post('/app/travel/ticket/refund')
      .set(auth(tokenA))
      .send({ orderNo });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toContain('24');
  });

  it('退票成功：票 refunded、订单状态 5、库存回补、流水退款 90%', async () => {
    const book = await createHttpRequest(app)
      .post('/app/travel/booking/create')
      .set(auth(tokenA))
      .send({ itemType: 'route', itemId: 9001, useDate: routeInventoryDate, quantity: 1 });
    const { orderNo } = book.body.data;
    await createHttpRequest(app).post('/app/pay/create').set(auth(tokenA)).send({ orderNo, channel: 'alipay' });
    const rec = await createHttpRequest(app).get(`/app/pay/record?orderNo=${orderNo}`).set(auth(tokenA));
    await createHttpRequest(app).post('/app/pay/mock').set(auth(tokenA)).send({ paymentNo: rec.body.data[0].paymentNo });
    // 清理前面用例的扣减影响后核对库存基线
    const before = await one(
      `SELECT sold FROM travel_inventory WHERE itemType='route' AND itemId=9001 AND useDate='${routeInventoryDate}'`
    );
    const res = await createHttpRequest(app)
      .post('/app/travel/ticket/refund')
      .set(auth(tokenA))
      .send({ orderNo });
    expect(res.body.code).toBe(1000);
    expect(Number(res.body.data.refundAmount)).toBe(809.1); // 899 × 0.9
    const inv = await one(
      `SELECT sold FROM travel_inventory WHERE itemType='route' AND itemId=9001 AND useDate='${routeInventoryDate}'`
    );
    expect(inv.sold).toBe(before.sold - 1);
    const order = await one(`SELECT status FROM \`order\` WHERE orderNo='${orderNo}'`);
    expect(order.status).toBe(5);
    const tk = await one(`SELECT status FROM travel_e_ticket WHERE orderNo='${orderNo}'`);
    expect(tk.status).toBe('refunded');
    const pay = await one(
      `SELECT payStatus, refundAmount FROM payment_record WHERE orderId = (SELECT id FROM \`order\` WHERE orderNo='${orderNo}')`
    );
    expect(pay.payStatus).toBe(3);
    expect(Number(pay.refundAmount)).toBe(809.1);
  });

  it('余票不足拒绝且不产生订单', async () => {
    const res = await createHttpRequest(app)
      .post('/app/travel/booking/create')
      .set(auth(tokenA))
      .send({ itemType: 'ticket', itemId: 9001, useDate: ticketInventoryDate, quantity: 9 });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toContain('余票不足');
  });

  it('提前预订校验：使用日期不得早于明天', async () => {
    const today = new Date().toISOString().slice(0, 10);
    const res = await createHttpRequest(app)
      .post('/app/travel/booking/create')
      .set(auth(tokenA))
      .send({ itemType: 'route', itemId: 9001, useDate: today, quantity: 1 });
    expect(res.body.code).toBe(1001);
  });
});
