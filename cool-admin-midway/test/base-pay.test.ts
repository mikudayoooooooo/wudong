import {
  auth,
  boot,
  close,
  createHttpRequest,
  registerAndLogin,
} from './helper';
import { OrderService } from '../src/modules/order/service/order';
import { PayService } from '../src/modules/pay/service/pay';

const phoneC = '13400134001';
const phoneD = '13400134002';

describe('pay 统一支付', () => {
  let app;
  let tokenC: string;
  let tokenD: string;
  let orderNoC: string;
  let paymentNo: string;
  let payService: PayService;
  let orderService: OrderService;

  beforeAll(async () => {
    app = await boot();
    payService = await app.getApplicationContext().getAsync(PayService);
    orderService = await app.getApplicationContext().getAsync(OrderService);
    tokenC = await registerAndLogin(app, phoneC);
    tokenD = await registerAndLogin(app, phoneD);
    const res = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(tokenC))
      .send({
        module: 'product',
        orderType: 1,
        items: [
          { productId: 2, skuId: 21, productName: '蜡染围巾', price: 50, quantity: 1 },
        ],
      });
    orderNoC = res.body.data.orderNo;
  });

  afterAll(async () => {
    await close(app);
  });

  it('未登录访问支付接口被拦截', async () => {
    const res = await createHttpRequest(app)
      .post('/app/pay/mock')
      .send({ paymentNo: 'x' });
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('支付渠道不正确被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/pay/create')
      .set(auth(tokenC))
      .send({ orderNo: orderNoC, channel: 'wx' });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('支付渠道不正确');
  });

  it('不能为他人订单创建支付单', async () => {
    const res = await createHttpRequest(app)
      .post('/app/pay/create')
      .set(auth(tokenD))
      .send({ orderNo: orderNoC, channel: 'wechat' });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('订单不存在');
  });

  it('创建支付单并幂等复用待支付流水', async () => {
    const first = await createHttpRequest(app)
      .post('/app/pay/create')
      .set(auth(tokenC))
      .send({ orderNo: orderNoC, channel: 'wechat' });
    expect(first.body.code).toBe(1000);
    expect(first.body.data.paymentNo).toBeTruthy();

    const second = await createHttpRequest(app)
      .post('/app/pay/create')
      .set(auth(tokenC))
      .send({ orderNo: orderNoC, channel: 'alipay' });
    expect(second.body.data.paymentNo).toBe(first.body.data.paymentNo);

    paymentNo = first.body.data.paymentNo;
  });

  it('mock 支付成功后流水与订单均为已支付', async () => {
    const res = await createHttpRequest(app)
      .post('/app/pay/mock')
      .set(auth(tokenC))
      .send({ paymentNo });
    expect(res.body.code).toBe(1000);

    const records = await createHttpRequest(app)
      .get(`/app/pay/record?orderNo=${orderNoC}`)
      .set(auth(tokenC));
    expect(records.body.data.length).toBe(1);
    expect(records.body.data[0].payStatus).toBe(2);
    expect(records.body.data[0].payTime).toBeTruthy();
    expect(records.body.data[0].transactionId).toContain('MOCK');

    const order = await createHttpRequest(app)
      .get(`/app/order/detail?orderNo=${orderNoC}`)
      .set(auth(tokenC));
    expect(order.body.data.status).toBe(2);
  });

  it('重复 mock 支付被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/pay/mock')
      .set(auth(tokenC))
      .send({ paymentNo });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('支付单当前状态不可支付');
  });

  it('已支付订单不能再创建支付单', async () => {
    const res = await createHttpRequest(app)
      .post('/app/pay/create')
      .set(auth(tokenC))
      .send({ orderNo: orderNoC, channel: 'wechat' });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('订单当前状态不可支付');
  });

  it('退款金额校验与退款成功', async () => {
    const over = await payService.refund(paymentNo, 999).catch(e => e);
    expect(over.message).toBe('退款金额不正确');

    await expect(payService.refund(paymentNo, 50)).resolves.toBe(true);

    const again = await payService.refund(paymentNo, 50).catch(e => e);
    expect(again.message).toBe('仅已支付的支付单可退款');

    const records = await createHttpRequest(app)
      .get(`/app/pay/record?orderNo=${orderNoC}`)
      .set(auth(tokenC));
    expect(records.body.data[0].payStatus).toBe(3);
    expect(Number(records.body.data[0].refundAmount)).toBe(50);
  });

  it('业务模块调 markRefunded 后订单置为已退款', async () => {
    await expect(orderService.markRefunded(orderNoC)).resolves.toBe(true);
    const order = await createHttpRequest(app)
      .get(`/app/order/detail?orderNo=${orderNoC}`)
      .set(auth(tokenC));
    expect(order.body.data.status).toBe(5);
  });

  it('他人不能查看我的支付流水', async () => {
    const res = await createHttpRequest(app)
      .get(`/app/pay/record?orderNo=${orderNoC}`)
      .set(auth(tokenD));
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('订单不存在');
  });

  it('管理端支付流水接口未登录返回401', async () => {
    const res = await createHttpRequest(app).get(
      '/admin/pay/record/page?page=1&size=10'
    );
    expect(res.status).toBe(401);
  });
});
