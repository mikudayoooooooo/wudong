# 🎯 你的开发任务清单

**负责人**: Yamal  
**分配模块**: 模块一（衣-非遗商品）+ 模块二（食-餐饮美食）  
**开发时间**: 待定  

---

## 📋 模块一：衣-非遗商品（电商系统）

### 🎨 业务场景
销售乌东地区的非遗手工艺品，如藏族服饰、手工编织品、传统工艺品等。

### 📊 需要创建的数据表（6张）

#### 1. `product_category` - 商品分类表
```sql
- id: 分类ID
- parent_id: 父分类ID（支持多级分类）
- name: 分类名称
- icon: 分类图标
- sort: 排序
- status: 状态
```

#### 2. `product` - 商品主表
```sql
- id: 商品ID
- merchant_id: 商家ID
- category_id: 分类ID
- name: 商品名称
- cover_image: 封面图
- price: 售价
- stock: 库存
- sales: 销量
- craft_intro: 工艺介绍 ⭐（非遗特色）
- inheritor_id: 传承人ID ⭐（非遗特色）
- description: 商品详情
- status: 状态（上架/下架）
```

#### 3. `product_sku` - 商品SKU表
```sql
- id: SKU ID
- product_id: 商品ID
- attributes: 规格属性（JSON格式，如：{"颜色":"红色","尺寸":"L"}）
- price: SKU价格
- stock: SKU库存
- sku_code: SKU编码
```

#### 4. `product_image` - 商品图片表
```sql
- id: 图片ID
- product_id: 商品ID
- image_url: 图片URL
- sort: 排序
```

#### 5. `review` - 评价表
```sql
- id: 评价ID
- user_id: 用户ID
- product_id: 商品ID
- order_id: 订单ID
- rating: 评分（1-5星）
- content: 评价内容
- images: 晒图（JSON数组）
- status: 状态（待审核/已通过）
```

#### 6. `product_favorite` - 商品收藏表
```sql
注意：member模块已有通用的favorite表，可能需要扩展
```

---

### 🔌 需要开发的API接口

#### C端（小程序/前台）接口

##### 1. 商品分类
```typescript
GET /admin/product/category/list
// 获取商品分类树（支持多级）
```

##### 2. 商品列表
```typescript
GET /admin/product/list
Query: {
  categoryId?: number;  // 分类筛选
  keyword?: string;     // 关键词搜索
  minPrice?: number;    // 价格区间
  maxPrice?: number;
  sortBy?: 'price' | 'sales' | 'created';  // 排序
  page: number;
  pageSize: number;
}
```

##### 3. 商品详情
```typescript
GET /admin/product/:id
Response: {
  product: {...},      // 商品基本信息
  skus: [...],        // SKU列表
  images: [...],      // 商品图片
  merchant: {...},    // 商家信息
  reviews: {...}      // 评价统计
}
```

##### 4. 收藏商品
```typescript
POST /admin/product/:id/favorite
DELETE /admin/product/:id/favorite
```

##### 5. 发布评价
```typescript
POST /admin/product/review
Body: {
  productId: number;
  orderId: number;
  rating: number;
  content: string;
  images?: string[];
}
```

##### 6. 评价列表
```typescript
GET /admin/product/:id/reviews
Query: {
  rating?: number;  // 筛选星级
  hasImages?: boolean;  // 是否有图
  page: number;
}
```

#### 商家后台接口

##### 7. 商品管理
```typescript
GET    /admin/product/list        // 商家的商品列表
POST   /admin/product             // 创建商品
PUT    /admin/product/:id         // 更新商品
DELETE /admin/product/:id         // 删除商品
PATCH  /admin/product/:id/status  // 上下架
```

##### 8. SKU管理
```typescript
POST   /admin/product/:id/sku     // 添加SKU
PUT    /admin/product/sku/:id     // 更新SKU
DELETE /admin/product/sku/:id     // 删除SKU
```

---

### 🎯 核心功能点

1. ✅ **商品分类管理**（多级分类）
2. ✅ **商品CRUD**（增删改查）
3. ✅ **SKU管理**（多规格支持）
4. ✅ **商品图片**（多图上传）
5. ✅ **商品搜索**（关键词+分类+价格）
6. ✅ **商品排序**（价格/销量/时间）
7. ✅ **商品收藏**（集成member模块）
8. ✅ **商品评价**（星级+文字+晒图）
9. ✅ **上下架管理**
10. ✅ **库存管理**（与订单模块对接）

---

## 🍜 模块二：食-餐饮美食（餐饮+农产品）

### 🎨 业务场景
1. **餐厅预订**：预订乌东特色餐厅的餐位
2. **农产品销售**：销售本地特产（青稞、牦牛肉干等）

### 📊 需要创建的数据表（5张）

#### 1. `restaurant` - 餐厅表
```sql
- id: 餐厅ID
- merchant_id: 商家ID
- name: 餐厅名称
- cover_image: 封面图
- images: 餐厅图片（JSON数组）
- address: 地址
- longitude: 经度 ⭐
- latitude: 纬度 ⭐
- phone: 联系电话
- business_hours: 营业时间
- avg_price: 人均消费
- specialty: 特色菜品
- description: 餐厅介绍
- status: 状态
```

#### 2. `dish` - 菜品表
```sql
- id: 菜品ID
- restaurant_id: 餐厅ID
- name: 菜品名称
- image: 菜品图片
- price: 价格
- category: 分类（凉菜/热菜/主食/饮品）
- description: 菜品介绍
- is_recommended: 是否推荐
- status: 状态
```

#### 3. `time_slot` - 餐位时段表
```sql
- id: 时段ID
- restaurant_id: 餐厅ID
- date: 日期
- time_period: 时段（午餐/晚餐）
- start_time: 开始时间
- end_time: 结束时间
- max_reservations: 最大预订数 ⭐
- current_reservations: 当前预订数
- status: 状态
```

#### 4. `farm_product_category` - 农产品分类表
```sql
- id: 分类ID
- name: 分类名称
- icon: 图标
- sort: 排序
```

#### 5. `farm_product` - 农产品表
```sql
- id: 产品ID
- merchant_id: 商家ID
- category_id: 分类ID
- name: 产品名称
- cover_image: 封面图
- images: 产品图片（JSON数组）
- price: 价格
- unit: 单位（斤/袋/盒）
- stock: 库存
- origin: 产地
- description: 产品描述
- status: 状态
```

---

### 🔌 需要开发的API接口

#### C端（小程序/前台）接口

##### 餐厅相关

###### 1. 餐厅列表
```typescript
GET /admin/food/restaurant/list
Query: {
  keyword?: string;      // 搜索关键词
  longitude?: number;    // 用户位置（用于距离排序）
  latitude?: number;
  avgPriceMin?: number;  // 人均消费筛选
  avgPriceMax?: number;
  sortBy?: 'distance' | 'avgPrice';
  page: number;
}
```

###### 2. 餐厅详情
```typescript
GET /admin/food/restaurant/:id
Response: {
  restaurant: {...},   // 餐厅信息
  dishes: [...],       // 菜品列表
  timeSlots: [...]     // 可预订时段
}
```

###### 3. 创建餐位预订
```typescript
POST /admin/food/reservation
Body: {
  restaurantId: number;
  timeSlotId: number;
  guestCount: number;   // 就餐人数
  contactName: string;
  contactPhone: string;
  remark?: string;
}
```

###### 4. 我的预订
```typescript
GET /admin/food/reservation/my
```

##### 农产品相关

###### 5. 农产品列表
```typescript
GET /admin/food/farm-product/list
Query: {
  categoryId?: number;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  page: number;
}
```

###### 6. 农产品详情
```typescript
GET /admin/food/farm-product/:id
```

#### 商家后台接口

##### 7. 餐厅管理
```typescript
POST /admin/food/restaurant        // 创建餐厅
PUT  /admin/food/restaurant/:id    // 更新餐厅
```

##### 8. 菜品管理
```typescript
POST   /admin/food/dish            // 添加菜品
PUT    /admin/food/dish/:id        // 更新菜品
DELETE /admin/food/dish/:id        // 删除菜品
```

##### 9. 时段管理
```typescript
POST /admin/food/time-slot         // 设置可预订时段
PUT  /admin/food/time-slot/:id     // 更新时段
```

##### 10. 预订管理
```typescript
GET   /admin/food/reservation/list          // 预订列表
PATCH /admin/food/reservation/:id/confirm   // 确认预订
PATCH /admin/food/reservation/:id/cancel    // 取消预订
```

##### 11. 农产品管理
```typescript
POST   /admin/food/farm-product     // 创建农产品
PUT    /admin/food/farm-product/:id // 更新农产品
DELETE /admin/food/farm-product/:id // 删除农产品
```

---

### 🎯 核心功能点

#### 餐厅模块
1. ✅ **餐厅CRUD**
2. ✅ **菜品管理**
3. ✅ **地图定位**（经纬度）
4. ✅ **距离计算**（根据用户位置排序）
5. ✅ **时段管理**（设置可预订时段）
6. ✅ **预订系统**（限制最大预订数）
7. ✅ **预订确认/取消**

#### 农产品模块
8. ✅ **农产品分类**
9. ✅ **农产品CRUD**
10. ✅ **库存管理**
11. ✅ **产地标注**
12. ✅ **商品搜索和筛选**

---

## 🔗 与已有模块的对接

### 1. Member 模块
- ✅ 用户登录认证（已有）
- ✅ 用户收藏功能（已有）
- 需要集成商品收藏

### 2. Merchant 模块
- ✅ 商家信息（已有）
- 需要在创建商品/餐厅时关联 merchant_id

### 3. Order 模块
- ✅ 统一订单（已有）
- 需要创建商品订单时调用 OrderService
- 需要创建餐位预订订单

### 4. Cart 模块
- ✅ 购物车（已有）
- 商品和农产品可加入购物车

### 5. Pay 模块
- ✅ 支付功能（已有）
- 订单支付后更新库存

### 6. Message 模块
- ✅ 消息通知（已有）
- 预订确认后发送通知

---

## 📝 开发步骤建议

### 阶段一：模块一（衣-非遗商品）- 优先级高

#### 第1步：创建实体（Entity）
```
1. ProductCategoryEntity
2. ProductEntity
3. ProductSkuEntity
4. ProductImageEntity
5. ReviewEntity
```

#### 第2步：创建服务（Service）
```
1. ProductService（核心）
2. CategoryService
3. SkuService
4. ReviewService
```

#### 第3步：创建控制器（Controller）
```
1. AppProductController（C端）
2. AdminProductController（商家后台）
```

#### 第4步：测试
```
1. 使用 Postman 测试所有接口
2. 测试购物车集成
3. 测试订单创建
```

---

### 阶段二：模块二（食-餐饮美食）

#### 第1步：创建实体（Entity）
```
1. RestaurantEntity
2. DishEntity
3. TimeSlotEntity
4. FarmProductCategoryEntity
5. FarmProductEntity
```

#### 第2步：创建服务（Service）
```
1. RestaurantService
2. DishService
3. ReservationService
4. FarmProductService
```

#### 第3步：创建控制器（Controller）
```
1. AppFoodController（C端）
2. AdminFoodController（商家后台）
```

#### 第4步：测试
```
1. 测试餐厅列表和搜索
2. 测试预订系统
3. 测试农产品购买流程
```

---

## 💡 技术要点

### 1. 多规格SKU设计
- SKU attributes 使用 JSON 存储
- 前端动态生成规格选择器
- 库存以 SKU 为单位

### 2. 地理位置计算
```typescript
// 计算两点距离（Haversine公式）
function calculateDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  // 返回距离（公里）
}
```

### 3. 时段预订限制
- 使用事务确保并发安全
- 检查 `current_reservations < max_reservations`

### 4. 图片上传
- 使用 base 模块的 UploadService
- 支持多图上传

### 5. 敏感词过滤
- 评价内容使用 sensitive 模块过滤

---

## 📊 工作量估算

### 模块一：衣-非遗商品
- 实体层：5个实体 × 30分钟 = 2.5小时
- 服务层：4个服务 × 2小时 = 8小时
- 控制器：2个控制器 × 1.5小时 = 3小时
- 测试：2小时
- **预计总时间**：15-16小时

### 模块二：食-餐饮美食
- 实体层：5个实体 × 30分钟 = 2.5小时
- 服务层：4个服务 × 2小时 = 8小时
- 控制器：2个控制器 × 1.5小时 = 3小时
- 测试：2小时
- **预计总时间**：15-16小时

### 总计
**30-32小时**（约4个工作日）

---

## 🎯 验收标准

### 功能完整性
- ✅ 所有API接口开发完成
- ✅ 基本CRUD功能正常
- ✅ 与已有模块集成成功

### 代码质量
- ✅ 遵循 TypeScript 规范
- ✅ 实体字段有完整注释
- ✅ Service 方法有业务逻辑注释

### 测试验证
- ✅ Postman 测试通过
- ✅ 能成功创建订单
- ✅ 库存扣减正确

---

**准备好开始了吗？我可以帮你一步步完成！** 🚀
