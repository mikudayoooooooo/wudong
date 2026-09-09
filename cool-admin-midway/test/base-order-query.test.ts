import { auth, boot, close, createHttpRequest, registerAndLogin } from './helper';

const phoneA = '13500135003';
const phoneB = '13500135004';

describe('order 查询与取消', () => {
  let app;
  let tokenA: string;
  let tokenB: string;
  let productOrderNo: string;
  let ticketOrderNo: string;

  beforeAll(async () => {
    app = await boot();
    tokenA = await registerAndLogin(app, phoneA);
    tokenB = await registerAndLogin(app, phoneB);

    const p = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(tokenA))
      .send({
        module: 'product',
        orderType: 1,
        items: [
          {
            productId: 1,
            skuId: 11,
            productName: '银手镯',
            price: 100,
            quantity: 1,
          },
        ],
      });
    productOrderNo = p.body.data.orderNo;

    const t = await createHttpRequest(app)
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
            quantity: 1,
          },
        ],
      });
    ticketOrderNo = t.body.data.orderNo;
  });

  afterAll(async () => {
    await close(app);
  });

  it('pageList 分页、状态过滤与用户隔离', async () => {
    const all = await createHttpRequest(app)
      .get('/app/order/page?page=1&size=10')
      .set(auth(tokenA));
    expect(all.body.code).toBe(1000);
    expect(all.body.data.total).toBe(2);

    const mine = await createHttpRequest(app)
      .get('/app/order/page?page=1&size=10')
      .set(auth(tokenB));
    expect(mine.body.data.total).toBe(0);

    const pending = await createHttpRequest(app)
      .get('/app/order/page?page=1&size=10&status=1')
      .set(auth(tokenA));
    expect(pending.body.data.total).toBe(2);
  });

  it('detail 返回主单与明细，且用户隔离', async () => {
    const ok = await createHttpRequest(app)
      .get(`/app/order/detail?orderNo=${productOrderNo}`)
      .set(auth(tokenA));
    expect(ok.body.code).toBe(1000);
    expect(ok.body.data.orderNo).toBe(productOrderNo);
    expect(ok.body.data.items.length).toBe(1);
    expect(ok.body.data.items[0].productName).toBe('银手镯');

    const deny = await createHttpRequest(app)
      .get(`/app/order/detail?orderNo=${productOrderNo}`)
      .set(auth(tokenB));
    expect(deny.body.code).toBe(1001);
    expect(deny.body.message).toBe('订单不存在');
  });

  it('detail 能返回门票明细快照', async () => {
    const ok = await createHttpRequest(app)
      .get(`/app/order/detail?orderNo=${ticketOrderNo}`)
      .set(auth(tokenA));
    expect(ok.body.data.items[0].ticketName).toBe('成人票');
    expect(ok.body.data.items[0].useDate).toBe('2026-10-01');
  });

  it('仅待支付可取消', async () => {
    const ok = await createHttpRequest(app)
      .post('/app/order/cancel')
      .set(auth(tokenA))
      .send({ orderNo: ticketOrderNo });
    expect(ok.body.code).toBe(1000);

    const again = await createHttpRequest(app)
      .post('/app/order/cancel')
      .set(auth(tokenA))
      .send({ orderNo: ticketOrderNo });
    expect(again.body.code).toBe(1001);
    expect(again.body.message).toBe('仅待支付订单可取消');

    const cancelled = await createHttpRequest(app)
      .get('/app/order/page?page=1&size=10&status=4')
      .set(auth(tokenA));
    expect(cancelled.body.data.total).toBe(1);
  });

  it('取消不存在/他人的订单报订单不存在', async () => {
    const res = await createHttpRequest(app)
      .post('/app/order/cancel')
      .set(auth(tokenB))
      .send({ orderNo: productOrderNo });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('订单不存在');
  });
});
