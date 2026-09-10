# 购物车功能使用指南

## 🎯 功能已实现

### ✅ 后端API（已完成并测试）

#### 购物车接口
1. **加入购物车** - `POST /app/cart/add`
2. **更新数量** - `POST /app/cart/update`
3. **移除商品** - `POST /app/cart/remove`
4. **查看购物车** - `GET /app/cart/list`
5. **清空购物车** - `POST /app/cart/clear`
6. **获取数量** - `GET /app/cart/count`

#### 订单接口
7. **从购物车创建订单** - `POST /app/order/create-from-cart`

### ✅ 前端集成（已完成）

商品详情页已集成：
- ✅ "加入购物车"按钮
- ✅ "立即购买"按钮（直接下单）
- ✅ API调用已修复

---

## 🚀 快速测试

### 方式1：通过商品详情页测试（推荐）

1. **访问商品详情页**
   ```
   http://localhost:5173/products/6
   ```

2. **点击"加入购物车"按钮**
   - 需要先登录
   - 成功后显示提示"已加入购物车！"

3. **查看购物车**（需要开发购物车页面）
   - 或通过API直接测试：
   ```bash
   curl -X GET http://localhost:8001/app/cart/list \
     -H "Authorization: YOUR_TOKEN"
   ```

### 方式2：直接测试API

#### 1. 用户登录获取Token
```bash
curl -X POST http://localhost:8001/app/member/open/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000", "verifyCode": "1234"}'
```

#### 2. 加入购物车
```bash
curl -X POST http://localhost:8001/app/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_TOKEN" \
  -d '{
    "itemType": 1,
    "itemId": 6,
    "quantity": 2
  }'
```

参数说明：
- `itemType`: 1=非遗商品, 2=农产品
- `itemId`: 商品ID
- `quantity`: 数量

#### 3. 查看购物车
```bash
curl -X GET http://localhost:8001/app/cart/list \
  -H "Authorization: YOUR_TOKEN"
```

返回示例：
```json
{
  "code": 1000,
  "data": {
    "items": [
      {
        "id": 1,
        "itemType": 1,
        "itemId": 6,
        "itemName": "Batik Wall Hanging",
        "price": 158.00,
        "quantity": 2,
        "coverImage": "https://via.placeholder.com/300",
        "currentPrice": 158.00,
        "currentStock": 40,
        "isAvailable": true
      }
    ],
    "totalAmount": 316.00,
    "totalCount": 2
  }
}
```

#### 4. 更新数量
```bash
curl -X POST http://localhost:8001/app/cart/update \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_TOKEN" \
  -d '{
    "cartItemId": 1,
    "quantity": 3
  }'
```

#### 5. 创建订单（需要先添加收货地址）
```bash
# 添加收货地址
curl -X POST http://localhost:8001/app/user/address/add \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_TOKEN" \
  -d '{
    "contact": "张三",
    "phone": "13800138000",
    "province": "贵州省",
    "city": "黔东南州",
    "district": "雷山县",
    "address": "乌东苗寨1号",
    "isDefault": true
  }'

# 从购物车创建订单
curl -X POST http://localhost:8001/app/order/create-from-cart \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_TOKEN" \
  -d '{
    "addressId": 1,
    "remark": "请尽快发货"
  }'
```

返回：
```json
{
  "code": 1000,
  "data": {
    "orderNo": "202609101234567891234",
    "payAmount": 316.00
  }
}
```

#### 6. 支付订单
```bash
# 创建支付单
curl -X POST http://localhost:8001/app/pay/create \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_TOKEN" \
  -d '{
    "orderNo": "202609101234567891234",
    "channel": "wechat"
  }'

# 模拟支付成功
curl -X POST http://localhost:8001/app/pay/mock \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_TOKEN" \
  -d '{
    "paymentNo": "PAY202609101234567895678"
  }'
```

---

## 🔍 当前状态

### ✅ 已完成
- [x] 购物车后端模块（完整）
- [x] 订单创建增强（从购物车下单）
- [x] 商品详情页集成购物车按钮
- [x] 前端API封装
- [x] 后端API测试通过
- [x] 代码已提交到Git

### 🚧 待开发（前端）
- [ ] 购物车页面（CartView.vue）
  - 展示购物车商品列表
  - 修改数量、删除商品
  - 选择收货地址
  - 结算按钮
  
- [ ] 顶部导航购物车角标
  - 显示购物车商品数量
  - 点击跳转到购物车页面

- [ ] 订单列表页
  - 我的订单列表
  - 订单详情
  - 订单状态追踪

---

## 📝 前端开发建议

### 1. 创建购物车页面

**路径**：`wudong-web/src/views/cart/CartView.vue`

**功能清单**：
```vue
<template>
  <div class="cart-page">
    <!-- 购物车列表 -->
    <div v-for="item in cartItems" :key="item.id">
      <img :src="item.coverImage" />
      <div>{{ item.itemName }}</div>
      <div>¥{{ item.price }}</div>
      <input type="number" v-model="item.quantity" @change="updateQuantity(item)" />
      <button @click="removeItem(item.id)">删除</button>
    </div>

    <!-- 总价 -->
    <div>总计：¥{{ totalAmount }}</div>

    <!-- 收货地址选择 -->
    <select v-model="selectedAddressId">
      <option v-for="addr in addresses" :key="addr.id" :value="addr.id">
        {{ addr.contact }} - {{ addr.address }}
      </option>
    </select>

    <!-- 结算按钮 -->
    <button @click="checkout">去结算</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCartList, updateCartQuantity, removeCartItem, createOrderFromCart } from '@/api/order';

const cartItems = ref([]);
const totalAmount = ref(0);
const selectedAddressId = ref(null);

// 加载购物车
const loadCart = async () => {
  const data = await getCartList();
  cartItems.value = data.items;
  totalAmount.value = data.totalAmount;
};

// 更新数量
const updateQuantity = async (item) => {
  await updateCartQuantity(item.id, item.quantity);
  await loadCart();
};

// 移除商品
const removeItem = async (id) => {
  await removeCartItem(id);
  await loadCart();
};

// 结算
const checkout = async () => {
  if (!selectedAddressId.value) {
    alert('请选择收货地址');
    return;
  }
  
  const result = await createOrderFromCart(selectedAddressId.value);
  alert('订单创建成功！订单号：' + result.orderNo);
  // 跳转到支付页
  router.push(`/order/pay/${result.orderNo}`);
};

onMounted(loadCart);
</script>
```

### 2. 添加路由

**路径**：`wudong-web/src/router/index.ts`

```typescript
{
  path: '/cart',
  name: 'cart',
  component: () => import('@/views/cart/CartView.vue'),
  meta: { requiresAuth: true }
}
```

### 3. 顶部导航添加购物车图标

```vue
<template>
  <router-link to="/cart">
    <i class="cart-icon"></i>
    <span v-if="cartCount > 0">{{ cartCount }}</span>
  </router-link>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getCartCount } from '@/api/order';

const cartCount = ref(0);

const loadCartCount = async () => {
  cartCount.value = await getCartCount();
};

onMounted(loadCartCount);
</script>
```

---

## 📚 相关文档

- **设计文档**：`docs/superpowers/specs/2026-09-10-shopping-cart-purchase-design.md`
- **实现总结**：`SHOPPING-CART-IMPLEMENTATION.md`
- **测试文件**：`cool-admin-midway/test/cart-purchase-flow.test.ts`

---

## 🎉 总结

购物车与购买功能的**后端部分已100%完成**，包括：
- ✅ 完整的购物车CRUD
- ✅ 订单创建流程
- ✅ 库存管理
- ✅ 支付集成
- ✅ 商品详情页集成

**前端需要开发**：
1. 购物车页面（主要工作）
2. 购物车角标
3. 订单列表页

预计前端开发时间：**4-6小时**
