import { auth, boot, close, createHttpRequest, registerAndLogin } from './helper';

const phoneA = '13500135001';

describe('order 下单链路', () => {
  let app;
  let tokenA: string;

  beforeAll(async () => {
    app = await boot();
    tokenA = await registerAndLogin(app, phoneA);
  });

  afterAll(async () => {
    await close(app);
  });

  it('未登录创建订单被拦截（200 + 1001 登录失效）', async () => {
    const res = await createHttpRequest(app).post('/app/order/create').send({});
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('创建商品订单，服务端计算总额', async () => {
    const res = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(tokenA))
      .send({
        module: 'product',
        orderType: 1,
        remark: '尽快发货',
        items: [
          {
            productId: 1,
            skuId: 11,
            productName: '银手镯',
            skuName: '素圈',
            productImage: 'http://img/1.png',
            price: 129.9,
            quantity: 2,
            addressId: 1,
          },
        ],
      });
    expect(res.body.code).toBe(1000);
    expect(res.body.data.orderNo).toBeTruthy();
    expect(Number(res.body.data.payAmount)).toBeCloseTo(259.8);
  });

  it('创建门票订单（travel 模块 orderType=4）', async () => {
    const res = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(tokenA))
      .send({
        module: 'travel',
        orderType: 4,
        items: [
          {
            targetId: 1,
            targetName: '苗寨景区',
            ticketName: '成人票',
            useDate: '2026-10-01',
            price: 80,
            quantity: 3,
            visitorInfo: [{ name: '张三', idCard: '522301199001010011' }],
          },
        ],
      });
    expect(res.body.code).toBe(1000);
    expect(Number(res.body.data.payAmount)).toBe(240);
  });

  it('模块与订单类型不匹配被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(tokenA))
      .send({ module: 'travel', orderType: 1, items: [{ price: 1, quantity: 1 }] });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('订单类型与模块不匹配');
  });

  it('非法模块被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(tokenA))
      .send({ module: 'hotel', orderType: 3, items: [{ price: 1, quantity: 1 }] });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('订单模块不正确');
  });

  it('空明细被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(tokenA))
      .send({ module: 'product', orderType: 1, items: [] });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('订单明细不能为空');
  });

  it('明细价格或数量非法被拒绝', async () => {
    for (const bad of [
      { productId: 1, skuId: 1, productName: 'x', price: 0, quantity: 1 },
      { productId: 1, skuId: 1, productName: 'x', price: 10, quantity: 0 },
    ]) {
      const res = await createHttpRequest(app)
        .post('/app/order/create')
        .set(auth(tokenA))
        .send({ module: 'product', orderType: 1, items: [bad] });
      expect(res.body.code).toBe(1001);
      expect(res.body.message).toBe('订单明细的单价或数量不正确');
    }
  });
});
