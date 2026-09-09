import {
  auth,
  boot,
  close,
  createHttpRequest,
  registerAndLogin,
} from './helper';

const phone = '13100131001';

describe('pay 支付成功站内通知（集成）', () => {
  let app;
  let token: string;

  beforeAll(async () => {
    app = await boot();
    token = await registerAndLogin(app, phone);
  });

  afterAll(async () => {
    await close(app);
  });

  it('mock 支付成功后收到 type=order 的支付成功消息', async () => {
    const order = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(token))
      .send({
        module: 'travel',
        orderType: 4,
        items: [
          {
            targetId: 9,
            targetName: '苗寨景区',
            ticketName: '成人票',
            useDate: '2026-10-08',
            price: 60,
            quantity: 1,
          },
        ],
      });
    const orderNo = order.body.data.orderNo;

    const pay = await createHttpRequest(app)
      .post('/app/pay/create')
      .set(auth(token))
      .send({ orderNo, channel: 'wechat' });
    const paymentNo = pay.body.data.paymentNo;

    const mock = await createHttpRequest(app)
      .post('/app/pay/mock')
      .set(auth(token))
      .send({ paymentNo });
    expect(mock.body.code).toBe(1000);

    const messages = await createHttpRequest(app)
      .get('/app/message/page?page=1&size=10&type=order')
      .set(auth(token));
    expect(messages.body.data.total).toBe(1);
    const msg = messages.body.data.list[0];
    expect(msg.title).toBe('支付成功');
    expect(msg.content).toContain(orderNo);
    expect(msg.isRead).toBe(0);
  });
});
