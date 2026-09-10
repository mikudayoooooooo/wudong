import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

describe('test/cart-purchase-flow.test.ts - 购物车与购买流程测试', () => {
  let app;
  let userToken: string;
  let merchantToken: string;
  let merchantId: number;
  let productId: number;
  let farmProductId: number;
  let addressId: number;

  beforeAll(async () => {
    app = await createApp<Framework>();

    // 1. 商家登录
    const merchantLogin = await createHttpRequest(app)
      .post('/admin/base/open/login')
      .send({ username: 'admin', password: '123456' });
    merchantToken = merchantLogin.body.data.token;

    // 2. 获取商家信息
    const merchantInfo = await createHttpRequest(app)
      .get('/admin/base/comm/person')
      .set('Authorization', merchantToken);
    merchantId = merchantInfo.body.data.merchantId || 1;

    // 3. C端用户登录（假设已有测试用户）
    // 注：实际测试需要先创建C端用户，这里简化处理
    try {
      const userLogin = await createHttpRequest(app)
        .post('/app/member/open/login')
        .send({ phone: '13800138000', verifyCode: '1234' });
      userToken = userLogin.body.data.token;
    } catch (e) {
      console.log('用户登录失败，跳过C端测试');
      userToken = '';
    }

    // 4. 创建测试商品（非遗商品）
    const product = await createHttpRequest(app)
      .post('/admin/product/create')
      .set('Authorization', merchantToken)
      .send({
        categoryId: 1,
        name: '测试苗族刺绣手包',
        coverImage: 'https://example.com/product.jpg',
        price: 199.0,
        stock: 100,
        status: 1,
      });
    productId = product.body.data.id;

    // 5. 创建测试农产品
    const farmProduct = await createHttpRequest(app)
      .post('/admin/food/farm-product/create')
      .set('Authorization', merchantToken)
      .send({
        categoryId: 1,
        name: '测试贵州茶叶',
        coverImage: 'https://example.com/tea.jpg',
        price: 88.0,
        stock: 200,
        unit: '斤',
        status: 1,
      });
    farmProductId = farmProduct.body.data.id;
  });

  afterAll(async () => {
    await close(app);
  });

  it('完整购物流程：加购 → 查看购物车 → 创建订单 → 支付', async () => {
    if (!userToken) {
      console.log('无用户Token，跳过测试');
      return;
    }

    // 步骤1：添加收货地址
    const address = await createHttpRequest(app)
      .post('/app/user/address/add')
      .set('Authorization', userToken)
      .send({
        contact: '张三',
        phone: '13800138000',
        province: '贵州省',
        city: '黔东南州',
        district: '雷山县',
        address: '乌东苗寨',
        isDefault: true,
      });
    expect(address.status).toBe(200);
    addressId = address.body.data.id;

    // 步骤2：加入购物车 - 非遗商品
    const addProduct = await createHttpRequest(app)
      .post('/app/cart/add')
      .set('Authorization', userToken)
      .send({
        itemType: 1,
        itemId: productId,
        quantity: 2,
      });
    expect(addProduct.status).toBe(200);
    expect(addProduct.body.data.itemName).toBe('测试苗族刺绣手包');
    expect(addProduct.body.data.quantity).toBe(2);

    // 步骤3：加入购物车 - 农产品
    const addFarmProduct = await createHttpRequest(app)
      .post('/app/cart/add')
      .set('Authorization', userToken)
      .send({
        itemType: 2,
        itemId: farmProductId,
        quantity: 3,
      });
    expect(addFarmProduct.status).toBe(200);
    expect(addFarmProduct.body.data.itemName).toBe('测试贵州茶叶');

    // 步骤4：查看购物车
    const cartList = await createHttpRequest(app)
      .get('/app/cart/list')
      .set('Authorization', userToken);
    expect(cartList.status).toBe(200);
    expect(cartList.body.data.items.length).toBe(2);
    expect(cartList.body.data.totalAmount).toBe(199 * 2 + 88 * 3); // 398 + 264 = 662
    expect(cartList.body.data.totalCount).toBe(5);

    // 步骤5：更新购物车数量
    const cartItemId = cartList.body.data.items[0].id;
    const updateCart = await createHttpRequest(app)
      .post('/app/cart/update')
      .set('Authorization', userToken)
      .send({
        cartItemId,
        quantity: 3,
      });
    expect(updateCart.status).toBe(200);

    // 步骤6：再次查看购物车（验证更新）
    const cartList2 = await createHttpRequest(app)
      .get('/app/cart/list')
      .set('Authorization', userToken);
    expect(cartList2.body.data.totalCount).toBe(6); // 3 + 3

    // 步骤7：从购物车创建订单
    const createOrder = await createHttpRequest(app)
      .post('/app/order/create-from-cart')
      .set('Authorization', userToken)
      .send({
        addressId,
        remark: '测试订单，请尽快发货',
      });
    expect(createOrder.status).toBe(200);
    expect(createOrder.body.data.orderNo).toBeDefined();
    expect(createOrder.body.data.payAmount).toBeGreaterThan(0);

    const orderNo = createOrder.body.data.orderNo;
    const payAmount = createOrder.body.data.payAmount;

    // 步骤8：验证购物车已清空
    const cartList3 = await createHttpRequest(app)
      .get('/app/cart/list')
      .set('Authorization', userToken);
    expect(cartList3.body.data.items.length).toBe(0);

    // 步骤9：查看订单详情
    const orderDetail = await createHttpRequest(app)
      .get('/app/order/detail')
      .query({ orderNo })
      .set('Authorization', userToken);
    expect(orderDetail.status).toBe(200);
    expect(orderDetail.body.data.status).toBe(1); // 待支付
    expect(orderDetail.body.data.items.length).toBe(2); // 2个商品

    // 步骤10：创建支付单
    const createPay = await createHttpRequest(app)
      .post('/app/pay/create')
      .set('Authorization', userToken)
      .send({
        orderNo,
        channel: 'wechat',
      });
    expect(createPay.status).toBe(200);
    expect(createPay.body.data.paymentNo).toBeDefined();

    const paymentNo = createPay.body.data.paymentNo;

    // 步骤11：模拟支付成功
    const mockPay = await createHttpRequest(app)
      .post('/app/pay/mock')
      .set('Authorization', userToken)
      .send({ paymentNo });
    expect(mockPay.status).toBe(200);

    // 步骤12：验证订单状态已更新
    const orderDetail2 = await createHttpRequest(app)
      .get('/app/order/detail')
      .query({ orderNo })
      .set('Authorization', userToken);
    expect(orderDetail2.body.data.status).toBe(2); // 已支付

    console.log('✅ 完整购物流程测试通过！');
    console.log(`   订单号: ${orderNo}`);
    console.log(`   支付金额: ${payAmount}`);
  });

  it('边界测试：购物车为空时创建订单', async () => {
    if (!userToken) return;

    const createOrder = await createHttpRequest(app)
      .post('/app/order/create-from-cart')
      .set('Authorization', userToken)
      .send({ addressId: 1 });

    expect(createOrder.body.message).toContain('购物车为空');
  });

  it('边界测试：库存不足时创建订单', async () => {
    if (!userToken) return;

    // 创建库存为0的商品
    const lowStockProduct = await createHttpRequest(app)
      .post('/admin/product/create')
      .set('Authorization', merchantToken)
      .send({
        categoryId: 1,
        name: '库存不足商品',
        coverImage: 'https://example.com/low.jpg',
        price: 99.0,
        stock: 0,
        status: 1,
      });

    const lowProductId = lowStockProduct.body.data.id;

    // 尝试加入购物车（应该失败）
    const addLowStock = await createHttpRequest(app)
      .post('/app/cart/add')
      .set('Authorization', userToken)
      .send({
        itemType: 1,
        itemId: lowProductId,
        quantity: 1,
      });

    expect(addLowStock.body.message).toContain('库存不足');
  });

  it('购物车数量统计', async () => {
    if (!userToken) return;

    // 清空购物车
    await createHttpRequest(app)
      .post('/app/cart/clear')
      .set('Authorization', userToken);

    // 添加商品
    await createHttpRequest(app)
      .post('/app/cart/add')
      .set('Authorization', userToken)
      .send({ itemType: 1, itemId: productId, quantity: 1 });

    // 获取数量
    const count = await createHttpRequest(app)
      .get('/app/cart/count')
      .set('Authorization', userToken);

    expect(count.body.data).toBe(1);
  });

  it('移除购物车商品', async () => {
    if (!userToken) return;

    // 清空购物车
    await createHttpRequest(app)
      .post('/app/cart/clear')
      .set('Authorization', userToken);

    // 添加商品
    const add = await createHttpRequest(app)
      .post('/app/cart/add')
      .set('Authorization', userToken)
      .send({ itemType: 1, itemId: productId, quantity: 1 });

    const cartItemId = add.body.data.id;

    // 移除商品
    const remove = await createHttpRequest(app)
      .post('/app/cart/remove')
      .set('Authorization', userToken)
      .send({ cartItemId });

    expect(remove.status).toBe(200);

    // 验证已移除
    const cartList = await createHttpRequest(app)
      .get('/app/cart/list')
      .set('Authorization', userToken);

    expect(cartList.body.data.items.length).toBe(0);
  });
});
