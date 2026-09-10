import {
  auth,
  boot,
  close,
  createHttpRequest,
  registerAndLogin,
} from './helper';

const phoneA = '13000230001';
const phoneB = '13000230002';

describe('cart 购物车', () => {
  let app;
  let tokenA: string;
  let tokenB: string;
  let cartId: number;

  beforeAll(async () => {
    app = await boot();
    tokenA = await registerAndLogin(app, phoneA);
    tokenB = await registerAndLogin(app, phoneB);
  });

  afterAll(async () => {
    await close(app);
  });

  it('未登录访问被拦截', async () => {
    const res = await createHttpRequest(app).get('/app/cart/page');
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('add 加入购物车，同 SKU 再加数量累加', async () => {
    const first = await createHttpRequest(app)
      .post('/app/cart/add')
      .set(auth(tokenA))
      .send({ productId: 1, skuId: 11, quantity: 2 });
    expect(first.body.code).toBe(1000);

    const again = await createHttpRequest(app)
      .post('/app/cart/add')
      .set(auth(tokenA))
      .send({ productId: 1, skuId: 11, quantity: 3 });
    expect(again.body.code).toBe(1000);

    const page = await createHttpRequest(app)
      .get('/app/cart/page?page=1&size=10')
      .set(auth(tokenA));
    expect(page.body.data.total).toBe(1);
    expect(page.body.data.list[0].quantity).toBe(5);
    cartId = page.body.data.list[0].id;
  });

  it('update 修改数量与勾选', async () => {
    const res = await createHttpRequest(app)
      .post('/app/cart/update')
      .set(auth(tokenA))
      .send({ id: cartId, quantity: 1, checked: 0 });
    expect(res.body.code).toBe(1000);

    const page = await createHttpRequest(app)
      .get('/app/cart/page?page=1&size=10')
      .set(auth(tokenA));
    expect(page.body.data.list[0].quantity).toBe(1);
    expect(page.body.data.list[0].checked).toBe(0);
  });

  it('不能修改他人的购物车项', async () => {
    const res = await createHttpRequest(app)
      .post('/app/cart/update')
      .set(auth(tokenB))
      .send({ id: cartId, quantity: 99 });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('购物车项不存在');
  });

  it('page 用户间隔离', async () => {
    const pageB = await createHttpRequest(app)
      .get('/app/cart/page?page=1&size=10')
      .set(auth(tokenB));
    expect(pageB.body.data.total).toBe(0);
  });

  it('delete 仅本人可删', async () => {
    const deny = await createHttpRequest(app)
      .post('/app/cart/delete')
      .set(auth(tokenB))
      .send({ ids: [cartId] });
    expect(deny.body.code).toBe(1001);
    expect(deny.body.message).toBe('购物车项不存在');

    const ok = await createHttpRequest(app)
      .post('/app/cart/delete')
      .set(auth(tokenA))
      .send({ ids: [cartId] });
    expect(ok.body.code).toBe(1000);

    const page = await createHttpRequest(app)
      .get('/app/cart/page?page=1&size=10')
      .set(auth(tokenA));
    expect(page.body.data.total).toBe(0);
  });
});
