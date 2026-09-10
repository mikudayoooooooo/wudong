---
title: 购物车与购买功能设计
date: 2026-09-10
author: Claude
status: approved
---

# 购物车与购买功能设计文档

## 1. 概述

### 1.1 目标
为乌东文旅平台实现完整的购物功能，支持非遗商品和农产品的购物车、下单、支付流程。餐厅预订保持现有免费预约机制，不涉及支付。

### 1.2 范围
- **包含**：购物车模块、订单创建增强、库存管理、支付集成
- **不包含**：SKU变体支持（后期扩展）、优惠券、积分系统

### 1.3 关键需求
1. 用户可添加多个商品到购物车，统一结算
2. 简单数量选择（不需要复杂的SKU规格）
3. 结算时填写收货地址
4. 餐厅预订保持免费（仅登记，无需支付）

## 2. 系统架构

### 2.1 模块关系
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Product    │────▶│  Cart Module │────▶│    Order    │
│  (非遗商品) │     │  (购物车)    │     │   (订单)    │
└─────────────┘     └──────────────┘     └─────────────┘
                           │                     │
┌─────────────┐            │                     ▼
│ FarmProduct │────────────┘              ┌─────────────┐
│  (农产品)   │                           │     Pay     │
└─────────────┘                           │   (支付)    │
                                          └─────────────┘
```

### 2.2 数据流
1. **加购流程**：商品详情 → 加入购物车 → 保存快照
2. **结算流程**：购物车列表 → 选择地址 → 创建订单 → 扣减库存 → 清空购物车
3. **支付流程**：订单详情 → 创建支付单 → 模拟支付 → 订单状态更新
4. **发货流程**：商家后台 → 填写快递信息 → 用户查看物流

## 3. 数据库设计

### 3.1 新增表：cart_item（购物车项）

```sql
CREATE TABLE `cart_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `userId` int NOT NULL COMMENT '用户ID',
  `itemType` tinyint NOT NULL COMMENT '商品类型：1-非遗商品 2-农产品',
  `itemId` int NOT NULL COMMENT '商品ID（product.id 或 farm_product.id）',
  `quantity` int NOT NULL DEFAULT '1' COMMENT '数量',
  `itemName` varchar(100) NOT NULL COMMENT '商品名称快照',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '单价快照',
  `coverImage` varchar(500) DEFAULT NULL COMMENT '封面图快照',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_item` (`userId`,`itemType`,`itemId`),
  KEY `idx_userId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车项';
```

**设计说明：**
- `userId + itemType + itemId` 唯一约束：同一用户同一商品只能有一条记录（更新数量）
- 快照字段（itemName, price, coverImage）：加购时保存，防止商家修改后购物车显示混乱
- `itemType` 枚举：1=非遗商品（product表），2=农产品（farm_product表）

### 3.2 现有表扩展

**无需修改**，利用现有结构：
- `order` - 统一订单主表（已支持 orderType=1 商品订单）
- `order_product` - 订单商品明细（已有 addressId、快递字段）
- `user_address` - 收货地址（已完整实现）
- `payment_record` - 支付流水（已支持模拟支付）

## 4. 核心业务逻辑

### 4.1 购物车服务（CartService）

#### 4.1.1 addItem - 加入购物车
```typescript
async addItem(userId: number, itemType: number, itemId: number, quantity: number) {
  // 1. 校验 itemType（1 或 2）
  // 2. 根据 itemType 查询商品是否存在且上架
  // 3. 检查库存是否充足（软检查，允许加购）
  // 4. 查询是否已存在：存在则累加数量，不存在则新增
  // 5. 保存快照：itemName, price, coverImage
  // 6. 返回购物车项
}
```

**库存校验**：加购时只做提示性校验，不阻止加购。真正扣减在订单创建时。

#### 4.1.2 updateQuantity - 更新数量
```typescript
async updateQuantity(userId: number, cartItemId: number, quantity: number) {
  // 1. 校验购物车项归属（userId 匹配）
  // 2. 校验数量合法性（>= 1）
  // 3. 重新检查库存
  // 4. 更新数量
}
```

#### 4.1.3 getMyCart - 查看购物车
```typescript
async getMyCart(userId: number) {
  // 1. 查询用户所有购物车项
  // 2. 重新获取商品最新信息（状态、库存、价格）
  // 3. 标记已下架或库存不足的商品
  // 4. 计算总价（使用快照价格）
  // 5. 返回列表 + 总计
}
```

**Why:** 返回时重新查询商品，确保用户看到最新状态（库存、上架）。

#### 4.1.4 removeItem - 移除商品
```typescript
async removeItem(userId: number, cartItemId: number) {
  // 1. 校验归属
  // 2. 删除记录
}
```

#### 4.1.5 clearCart - 清空购物车
```typescript
async clearCart(userId: number) {
  // 1. 删除用户所有购物车项
  // 用途：结算成功后清空
}
```

### 4.2 订单服务增强（OrderService）

#### 4.2.1 createFromCart - 从购物车创建订单
```typescript
async createFromCart(userId: number, addressId: number) {
  // 事务开始
  // 1. 查询购物车所有项（必须非空）
  // 2. 校验收货地址归属
  // 3. 逐项校验：
  //    - 商品是否存在且上架
  //    - 库存是否充足
  //    - 重新获取当前价格
  //    - 如果价格变动 > 10%，抛异常提示用户
  // 4. 计算订单总额（使用实时价格）
  // 5. 创建订单主记录（module='product', orderType=1）
  // 6. 创建订单明细（OrderProductEntity）：
  //    - 每个购物车项对应一条明细
  //    - 包含快照：productName, price, quantity, totalAmount, addressId
  // 7. 扣减库存（product.stock 或 farm_product.stock）
  // 8. 清空购物车
  // 事务提交
  // 返回 { orderNo, payAmount }
}
```

**Why 事务：** 确保库存扣减、订单创建、购物车清空原子性执行。

**How to apply:** 价格变动检查防止用户看到的价格与实际支付不一致。

### 4.3 库存管理策略

| 阶段 | 检查类型 | 失败处理 |
|------|---------|---------|
| 加入购物车 | 软检查（提示） | 允许加购，前端提示库存紧张 |
| 更新数量 | 软检查（提示） | 允许更新，前端提示库存不足 |
| 查看购物车 | 软检查（标记） | 标记异常商品，提示用户移除 |
| 创建订单 | 硬检查（阻止） | 抛异常，订单创建失败 |
| 订单创建后 | 扣减库存 | 事务内 `UPDATE product SET stock = stock - quantity WHERE id = ? AND stock >= quantity` |

**Why:** 用户体验与数据一致性平衡。加购时宽松，结算时严格。

### 4.4 价格变动处理

| 价格变动幅度 | 处理策略 |
|-------------|---------|
| 0-10% | 静默使用实时价格，订单中记录实时价格 |
| > 10% | 抛异常 `CoolCommException('商品价格变动较大，请重新确认')` |

**How to apply:** 防止恶意商家在用户加购后大幅涨价。

## 5. API 设计

### 5.1 购物车接口（C端）

#### POST /app/cart/add
**描述**：加入购物车
**请求**：
```json
{
  "itemType": 1,        // 1-非遗商品 2-农产品
  "itemId": 123,        // 商品ID
  "quantity": 2         // 数量
}
```
**响应**：
```json
{
  "code": 1000,
  "data": {
    "id": 1,
    "itemName": "苗族刺绣手包",
    "price": 199.00,
    "quantity": 2,
    "coverImage": "https://..."
  }
}
```

#### POST /app/cart/update
**描述**：更新购物车数量
**请求**：
```json
{
  "cartItemId": 1,
  "quantity": 3
}
```

#### POST /app/cart/remove
**描述**：移除购物车商品
**请求**：
```json
{
  "cartItemId": 1
}
```

#### GET /app/cart/list
**描述**：查看购物车
**响应**：
```json
{
  "code": 1000,
  "data": {
    "items": [
      {
        "id": 1,
        "itemType": 1,
        "itemId": 123,
        "itemName": "苗族刺绣手包",
        "price": 199.00,
        "quantity": 2,
        "coverImage": "https://...",
        "currentPrice": 199.00,    // 实时价格
        "currentStock": 50,         // 实时库存
        "isAvailable": true         // 是否可购买
      }
    ],
    "totalAmount": 398.00,
    "totalCount": 2
  }
}
```

#### POST /app/cart/clear
**描述**：清空购物车

### 5.2 订单接口（C端）

#### POST /app/order/create-from-cart
**描述**：从购物车创建订单
**请求**：
```json
{
  "addressId": 5,       // 收货地址ID
  "remark": "尽快发货"  // 订单备注（可选）
}
```
**响应**：
```json
{
  "code": 1000,
  "data": {
    "orderNo": "202609101234567891234",
    "payAmount": 398.00
  }
}
```

**错误场景**：
- 购物车为空：`"购物车为空"`
- 地址不存在：`"收货地址不存在"`
- 库存不足：`"商品【苗族刺绣手包】库存不足"`
- 价格变动：`"商品价格变动较大，请重新确认"`

## 6. 前端集成点

### 6.1 购物车页面
**路径**：`wudong-web/src/views/cart/CartView.vue`

**功能**：
- 展示购物车列表（商品图、名称、价格、数量）
- 修改数量、删除商品
- 显示总价
- 选择收货地址
- 结算按钮 → 创建订单

### 6.2 商品详情页
**路径**：`wudong-web/src/views/product/ProductDetailView.vue`

**新增**：
- "加入购物车"按钮
- 数量选择器
- 购物车角标（显示购物车商品数量）

### 6.3 订单支付页
**路径**：`wudong-web/src/views/order/OrderPayView.vue`

**功能**：
- 显示订单号、金额、商品清单
- 选择支付方式（微信/支付宝）
- 调用支付接口
- 支付成功跳转到订单详情

## 7. 测试策略

### 7.1 单元测试
- CartService.addItem：正常加购、重复加购、库存不足
- CartService.updateQuantity：正常更新、数量非法
- OrderService.createFromCart：正常下单、库存不足、价格变动

### 7.2 集成测试
**完整购物流程**：
1. 登录用户
2. 添加商品A（非遗商品）到购物车
3. 添加商品B（农产品）到购物车
4. 查看购物车，验证总价
5. 选择收货地址
6. 创建订单，验证订单号
7. 模拟支付成功
8. 验证订单状态为"已支付"
9. 验证购物车已清空
10. 验证商品库存已扣减

### 7.3 边界测试
- 购物车为空时结算
- 结算时商品已下架
- 结算时库存不足
- 结算时价格大幅变动
- 并发下单（多个用户抢购最后库存）

## 8. 实施计划

### 阶段1：购物车模块（2-3小时）
- [ ] 创建 cart 模块目录结构
- [ ] 创建 CartItemEntity
- [ ] 实现 CartService 核心方法
- [ ] 创建 AppCartController
- [ ] 单元测试

### 阶段2：订单增强（1-2小时）
- [ ] 扩展 OrderService.createFromCart
- [ ] 更新 AppOrderController
- [ ] 集成测试

### 阶段3：前端集成（3-4小时）
- [ ] 购物车API封装
- [ ] 购物车页面开发
- [ ] 商品详情页集成
- [ ] 订单支付页更新

### 阶段4：端到端测试（1小时）
- [ ] 完整购物流程测试
- [ ] 边界场景测试
- [ ] 性能测试（并发下单）

**总计**：7-10 小时

## 9. 风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| 并发扣库存超卖 | 高 | 使用数据库行锁：`UPDATE ... WHERE stock >= quantity` |
| 价格频繁变动用户体验差 | 中 | 10%阈值提示，引导用户刷新购物车 |
| 购物车数据膨胀 | 低 | 后台任务清理30天未活动的购物车 |
| SKU需求变更 | 中 | 预留 skuId 字段，暂时置 NULL 或 0 |

## 10. 后续优化方向

1. **SKU支持**：扩展 CartItem 增加 skuId，支持规格选择
2. **优惠券**：订单创建时支持优惠码
3. **积分抵扣**：用户积分抵扣订单金额
4. **库存预占**：加购时预占库存15分钟
5. **购物车推荐**：基于购物车内容推荐关联商品
6. **订单自动取消**：未支付订单30分钟自动取消，释放库存

## 11. 附录

### 11.1 状态码约定
- 订单状态：1-待支付，2-已支付，3-已完成，4-已取消，5-已退款
- 商品状态：0-下架，1-上架
- 支付状态：1-待支付，2-已支付，3-已退款

### 11.2 模块文件清单
```
cool-admin-midway/src/modules/cart/
├── config.ts                          # 模块配置
├── controller/
│   └── app/
│       └── cart.ts                    # C端购物车控制器
├── entity/
│   └── cart-item.ts                   # 购物车项实体
└── service/
    └── cart.ts                        # 购物车服务
```

---

**文档版本**：v1.0  
**最后更新**：2026-09-10  
**审批状态**：已批准
