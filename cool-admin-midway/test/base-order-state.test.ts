import {
  auth,
  boot,
  close,
  createHttpRequest,
  registerAndLogin,
} from './helper';
import { OrderService } from '../src/modules/order/service/order';

const phone = '13500135005';

describe('order 状态机与管理端', () => {
  let app;
  let token: string;
  let orderNo: string;
  let orderService: OrderService;

  beforeAll(async () => {
    app = await boot();
    orderService = await app.getApplicationContext().getAsync(OrderService);
    token = await registerAndLogin(app, phone);
    const res = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(token))
      .send({
        module: 'travel',
        orderType: 5,
        items: [
          {
            targetId: 2,
            targetName: '梯田二日',
            ticketName: '路线套餐',
            useDate: '2026-10-02',
            price: 500,
            quantity: 1,
          },
        ],
      });
    orderNo = res.body.data.orderNo;
  });

  afterAll(async () => {
    await close(app);
  });

  it('待支付订单不能直接置为已退款', async () => {
    await expect(orderService.markRefunded(orderNo)).rejects.toThrow(
      '订单不存在或状态已变化'
    );
  });

  it('markPaid 将待支付置为已支付', async () => {
    await expect(orderService.markPaid(orderNo)).resolves.toBe(true);
    const detail = await createHttpRequest(app)
      .get(`/app/order/detail?orderNo=${orderNo}`)
      .set(auth(token));
    expect(detail.body.data.status).toBe(2);
    expect(detail.body.data.payTime).toBeTruthy();
  });

  it('重复 markPaid 被拒绝', async () => {
    await expect(orderService.markPaid(orderNo)).rejects.toThrow(
      '订单不存在或状态已变化'
    );
  });

  it('已支付订单不能被用户取消', async () => {
    const res = await createHttpRequest(app)
      .post('/app/order/cancel')
      .set(auth(token))
      .send({ orderNo });
    expect(res.body.code).toBe(1001);
  });

  it('markRefunded 将已支付置为已退款', async () => {
    await expect(orderService.markRefunded(orderNo)).resolves.toBe(true);
    const detail = await createHttpRequest(app)
      .get(`/app/order/detail?orderNo=${orderNo}`)
      .set(auth(token));
    expect(detail.body.data.status).toBe(5);
  });

  it('管理端接口未登录返回401', async () => {
    const res = await createHttpRequest(app).get(
      '/admin/order/page?page=1&size=10'
    );
    expect(res.status).toBe(401);
  });
});
