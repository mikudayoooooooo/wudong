import * as mysql from 'mysql2/promise';
import { boot, close, createHttpRequest, auth, registerAndLogin } from './helper';

/**
 * travel 匿名浏览接口 + 足迹点亮统计（号段 137xxx）
 */
describe('travel 浏览与足迹', () => {
  let app;
  let conn: mysql.Connection;
  let tokenA: string;

  beforeAll(async () => {
    app = await boot();
    conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3307,
      user: 'root',
      password: '123456',
      database: 'wudong_platform_test',
    });
    await conn.query(`INSERT INTO travel_scenic_spot (id, name, type, address, openTime, intro, status, createTime, updateTime)
      VALUES (9101, '测试观景台T', 'spot', '乌东村东', '6:00-19:00', '晨雾机位', 1, NOW(), NOW())`);
    await conn.query(`INSERT INTO travel_ticket_type (id, scenicSpotId, name, price, totalStock, status, createTime, updateTime)
      VALUES (9101, 9101, '测试观景票T', 40, 200, 1, NOW(), NOW())`);
    await conn.query(`INSERT INTO travel_route_package (id, title, days, theme, price, departure, destination, status, createTime, updateTime)
      VALUES (9101, '测试摄影一日游T', 1, '摄影', 299, '凯里南站', '乌东村', 1, NOW(), NOW())`);
    await conn.query(`INSERT INTO travel_route_itinerary (routeId, dayNo, sort, scenicSpotId, createTime, updateTime)
      VALUES (9101, 1, 1, 9101, NOW(), NOW())`);
    await conn.query(`INSERT INTO travel_inventory (itemType, itemId, useDate, total, sold, createTime, updateTime)
      VALUES ('route', 9101, '2030-10-01', 20, 3, NOW(), NOW())`);
    await conn.query(`INSERT INTO travel_traffic_guide (id, title, departure, destination, transportType, duration, cost, detail, status, createTime, updateTime)
      VALUES (9101, '测试贵阳→乌东T', '贵阳北', '乌东村', '高铁+班车', '约2.5小时', 180, '测试攻略', 1, NOW(), NOW())`);
    await conn.query(`INSERT INTO travel_recommend_slot (position, title, subtitle, badge, itemType, itemId, sort, rotationGroup, intervalSeconds, status, createTime, updateTime)
      VALUES ('home', '测试轮播T', '¥299 起', '🔥 置顶', 'route', 9101, 1, 1, 5, 1, NOW(), NOW())`);
    await conn.query(`INSERT INTO travel_review (targetType, targetId, userId, rating, content, status, createTime, updateTime)
      VALUES ('route', 9101, 1, 5, '值得走一趟', 1, NOW(), NOW())`);
    tokenA = await registerAndLogin(app, '13700000002');
  });

  afterAll(async () => {
    await conn.query(`DELETE FROM travel_review WHERE targetId = 9101`);
    await conn.query(`DELETE FROM travel_recommend_slot WHERE itemId = 9101`);
    await conn.query(`DELETE FROM travel_traffic_guide WHERE id = 9101`);
    await conn.query(`DELETE FROM travel_inventory WHERE itemId = 9101`);
    await conn.query(`DELETE FROM travel_route_itinerary WHERE routeId = 9101`);
    await conn.query(`DELETE FROM travel_route_package WHERE id = 9101`);
    await conn.query(`DELETE FROM travel_ticket_type WHERE id = 9101`);
    await conn.query(`DELETE FROM travel_scenic_spot WHERE id = 9101`);
    await conn.query(`DELETE FROM member_user WHERE phone LIKE '137000000%'`);
    await conn.end();
    await close(app);
  });

  it('匿名：景区列表/详情（附票种与相关路线）', async () => {
    const list = await createHttpRequest(app).get('/app/travel/scenic/list?type=spot');
    expect(list.body.code).toBe(1000);
    expect(list.body.data.some((s) => s.name === '测试观景台T')).toBe(true);
    const detail = await createHttpRequest(app).get('/app/travel/scenic/detail?id=9101');
    expect(detail.body.data.name).toBe('测试观景台T');
    expect(detail.body.data.tickets[0].name).toBe('测试观景票T');
    expect(detail.body.data.relatedRoutes[0].id).toBe(9101);
  });

  it('匿名：路线列表过滤与详情（行程点亮初始为 locked）', async () => {
    const list = await createHttpRequest(app).get(
      `/app/travel/route/list?theme=${encodeURIComponent('摄影')}`
    );
    expect(list.body.data.some((r) => r.id === 9101)).toBe(true);
    const detail = await createHttpRequest(app).get('/app/travel/route/detail?id=9101');
    expect(detail.body.data.title).toBe('测试摄影一日游T');
    expect(detail.body.data.stops).toHaveLength(1);
    expect(detail.body.data.stops[0].lit).toBe(false);
    expect(detail.body.data.stops[0].lightCount).toBe(0);
    expect(detail.body.data.inventories[0].useDate).toBe('2030-10-01');
    expect(detail.body.data.reviews).toHaveLength(1);
  });

  it('匿名：攻略/推荐位/库存列表', async () => {
    const guide = await createHttpRequest(app).get('/app/travel/guide/list');
    expect(guide.body.data.some((g) => g.title === '测试贵阳→乌东T')).toBe(true);
    const rec = await createHttpRequest(app).get('/app/travel/recommend/list?position=home');
    expect(rec.body.data.some((r) => r.title === '测试轮播T')).toBe(true);
    const inv = await createHttpRequest(app).get('/app/travel/inventory/list?itemType=route&itemId=9101');
    expect(inv.body.data).toHaveLength(1);
  });

  it('预订→支付→SQL 模拟核销后，路线详情点亮人数为 1', async () => {
    // 未登录访问需登录接口：200 + code 1001
    const denied = await createHttpRequest(app).get('/app/travel/ticket/my');
    expect(denied.status).toBe(200);
    expect(denied.body.code).toBe(1001);

    const book = await createHttpRequest(app)
      .post('/app/travel/booking/create')
      .set(auth(tokenA))
      .send({ itemType: 'route', itemId: 9101, useDate: '2030-10-01', quantity: 1 });
    const { orderNo } = book.body.data;
    await createHttpRequest(app).post('/app/pay/create').set(auth(tokenA)).send({ orderNo, channel: 'wechat' });
    const rec = await createHttpRequest(app).get(`/app/pay/record?orderNo=${orderNo}`).set(auth(tokenA));
    await createHttpRequest(app).post('/app/pay/mock').set(auth(tokenA)).send({ paymentNo: rec.body.data[0].paymentNo });
    // 管理端核销在无 admin 会话的 unittest 环境用 SQL 模拟（等价于 verify 的落库结果）
    await conn.query(
      `UPDATE travel_e_ticket SET status='used', verifyTime=NOW() WHERE orderNo='${orderNo}'`
    );
    const detail = await createHttpRequest(app).get('/app/travel/route/detail?id=9101');
    expect(detail.body.data.stops[0].lit).toBe(true);
    expect(detail.body.data.stops[0].lightCount).toBe(1);
    // 我的票卡出现已核销
    const my = await createHttpRequest(app).get('/app/travel/ticket/my').set(auth(tokenA));
    expect(my.body.data.find((t) => t.orderNo === orderNo).status).toBe('used');
  });

  it('评价发布需登录且校验评分范围', async () => {
    const denied = await createHttpRequest(app)
      .post('/app/travel/review/add')
      .send({ targetType: 'route', targetId: 9101, rating: 5, content: '匿名评价' });
    expect(denied.body.code).toBe(1001);
    const bad = await createHttpRequest(app)
      .post('/app/travel/review/add')
      .set(auth(tokenA))
      .send({ targetType: 'route', targetId: 9101, rating: 9, content: '评分非法' });
    expect(bad.body.code).toBe(1001);
    const ok = await createHttpRequest(app)
      .post('/app/travel/review/add')
      .set(auth(tokenA))
      .send({ targetType: 'route', targetId: 9101, rating: 4, content: '晨雾值得' });
    expect(ok.body.code).toBe(1000);
  });
});
