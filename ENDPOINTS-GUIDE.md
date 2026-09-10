# 🖥️ 项目端口划分说明

## 📱 项目有3个端

### 1. **C端（用户端/小程序端）**
- **用户**: 普通游客/会员
- **访问方式**: 小程序、H5、APP
- **主要功能**: 浏览、购买、预订、评价、社区互动

### 2. **商家端（商家管理后台）**
- **用户**: 商家（餐厅老板、商品卖家等）
- **访问方式**: Web后台
- **主要功能**: 管理自己的商品/餐厅/订单

### 3. **平台管理端（超级管理员）**
- **用户**: 平台运营人员
- **访问方式**: Web后台（Cool Admin）
- **主要功能**: 审核、统计、用户管理、财务管理

---

## 🎯 你需要开发的接口端

### 模块一：衣-非遗商品

#### ✅ 1. C端接口（App/小程序）
**路径前缀**: `/app/product/...`

```typescript
// 普通用户使用
GET  /app/product/category/list    // 商品分类
GET  /app/product/list             // 商品列表
GET  /app/product/:id              // 商品详情
POST /app/product/:id/favorite     // 收藏商品
POST /app/product/review           // 发布评价
GET  /app/product/:id/reviews      // 查看评价
```

**功能**：
- ✅ 浏览商品
- ✅ 搜索筛选
- ✅ 查看详情
- ✅ 加入购物车
- ✅ 收藏商品
- ✅ 发布评价

---

#### ✅ 2. 商家端接口（商家后台）
**路径前缀**: `/admin/product/...`

```typescript
// 商家管理自己的商品
GET    /admin/product/list         // 我的商品列表
POST   /admin/product              // 创建商品
PUT    /admin/product/:id          // 更新商品
DELETE /admin/product/:id          // 删除商品
PATCH  /admin/product/:id/status   // 上下架
POST   /admin/product/:id/sku      // 添加SKU
```

**功能**：
- ✅ 管理商品（增删改查）
- ✅ 管理SKU
- ✅ 上下架控制
- ✅ 查看评价
- ✅ 查看销售数据

---

#### ⚠️ 3. 平台管理端接口（可选）
**路径前缀**: `/admin/platform/product/...`

```typescript
// 平台审核和管理
GET   /admin/platform/product/list        // 所有商品
PATCH /admin/platform/product/:id/audit   // 审核商品
GET   /admin/platform/review/audit        // 审核评价
```

**功能**（可选，看项目需求）：
- ⏳ 商品审核
- ⏳ 评价审核
- ⏳ 违规商品下架

---

## 🍜 模块二：食-餐饮美食

### Part A: 餐厅预订

#### ✅ 1. C端接口（App/小程序）
**路径前缀**: `/app/food/...`

```typescript
// 普通用户使用
GET  /app/food/restaurant/list     // 餐厅列表
GET  /app/food/restaurant/:id      // 餐厅详情
POST /app/food/reservation         // 创建预订
GET  /app/food/reservation/my      // 我的预订
```

---

#### ✅ 2. 商家端接口（餐厅后台）
**路径前缀**: `/admin/food/...`

```typescript
// 商家管理自己的餐厅
POST  /admin/food/restaurant        // 创建餐厅
PUT   /admin/food/restaurant/:id    // 更新餐厅
POST  /admin/food/dish              // 添加菜品
POST  /admin/food/time-slot         // 设置时段
GET   /admin/food/reservation/list  // 预订列表
PATCH /admin/food/reservation/:id/confirm  // 确认预订
```

---

### Part B: 农产品

#### ✅ 1. C端接口（App/小程序）
**路径前缀**: `/app/food/...`

```typescript
GET /app/food/farm-product/list    // 农产品列表
GET /app/food/farm-product/:id     // 农产品详情
```

---

#### ✅ 2. 商家端接口（商家后台）
**路径前缀**: `/admin/food/...`

```typescript
POST   /admin/food/farm-product     // 创建农产品
PUT    /admin/food/farm-product/:id // 更新农产品
DELETE /admin/food/farm-product/:id // 删除农产品
```

---

## 📊 总结：你需要开发的端

### ✅ 必须开发（2个端）

#### 1. **C端接口（用户端）** ⭐
- 模块一：6个接口
- 模块二：6个接口
- **总计**: 约12个接口
- **权重**: 60%

#### 2. **商家端接口（商家后台）** ⭐
- 模块一：6个接口
- 模块二：9个接口
- **总计**: 约15个接口
- **权重**: 40%

### ⏳ 可选开发（1个端）

#### 3. **平台管理端接口**
- 审核功能
- 数据统计
- 看项目需求和时间

---

## 🎯 接口路径规范

### C端（用户端）
```
/app/{模块名}/{功能}
例如：
/app/product/list
/app/food/restaurant/list
```

### 商家端
```
/admin/{模块名}/{功能}
例如：
/admin/product/list
/admin/food/restaurant
```

### 平台管理端
```
/admin/platform/{模块名}/{功能}
例如：
/admin/platform/product/audit
```

---

## 🔐 权限控制

### C端
- ✅ 需要登录：收藏、评价、预订
- ❌ 无需登录：浏览商品、餐厅列表

### 商家端
- ✅ 必须商家登录
- ✅ 只能管理自己的商品/餐厅
- ✅ 权限检查：`merchantId === loginUser.merchantId`

### 平台管理端
- ✅ 必须管理员登录
- ✅ 可以查看所有数据

---

## 💡 开发建议

### 优先级排序

#### Phase 1: C端接口（先开发）
**原因**：
1. 用户最常用
2. 功能相对简单
3. 可以快速验证业务逻辑

#### Phase 2: 商家端接口（后开发）
**原因**：
1. 依赖C端的业务逻辑
2. 需要增加权限控制
3. 管理功能更复杂

#### Phase 3: 平台管理端（按需开发）
**原因**：
1. 看项目需求
2. 时间允许再做

---

## 📝 Controller 文件组织

### 模块一：商品模块

#### 目录结构
```
src/modules/product/
├── controller/
│   ├── app/
│   │   └── product.ts        # C端控制器 ⭐
│   └── admin/
│       └── product.ts        # 商家端控制器 ⭐
├── entity/
├── service/
└── config.ts
```

#### C端 Controller
```typescript
// src/modules/product/controller/app/product.ts

@Provide()
@Controller('/app/product')
export class AppProductController extends BaseController {
  
  @Get('/list')
  async list() {
    // 商品列表（所有用户可见）
  }
  
  @Get('/:id')
  async info() {
    // 商品详情
  }
  
  @Post('/:id/favorite')
  @Validate()
  async favorite() {
    // 收藏商品（需要登录）
    const userId = this.ctx.user.id;
  }
}
```

#### 商家端 Controller
```typescript
// src/modules/product/controller/admin/product.ts

@Provide()
@Controller('/admin/product')
export class AdminProductController extends BaseController {
  
  @Get('/list')
  @Validate()
  async list() {
    // 我的商品列表（只能看自己的）
    const merchantId = this.ctx.merchant.id;
  }
  
  @Post('/')
  @Validate()
  async add() {
    // 创建商品
  }
}
```

---

### 模块二：餐饮模块

#### 目录结构
```
src/modules/food/
├── controller/
│   ├── app/
│   │   ├── restaurant.ts     # C端-餐厅 ⭐
│   │   └── farm.ts           # C端-农产品 ⭐
│   └── admin/
│       ├── restaurant.ts     # 商家端-餐厅 ⭐
│       └── farm.ts           # 商家端-农产品 ⭐
├── entity/
├── service/
└── config.ts
```

---

## 🎯 验收清单

### C端接口
- [ ] 用户可以浏览商品/餐厅
- [ ] 搜索和筛选功能正常
- [ ] 可以查看详情
- [ ] 登录后可以收藏
- [ ] 登录后可以评价
- [ ] 登录后可以预订

### 商家端接口
- [ ] 商家可以登录
- [ ] 可以创建商品/餐厅
- [ ] 可以编辑自己的数据
- [ ] 不能编辑别人的数据
- [ ] 可以查看订单
- [ ] 可以确认预订

---

## 📊 开发工作量分配

| 端 | 接口数 | 预计时间 | 占比 |
|----|--------|---------|------|
| C端 | 12个 | 10小时 | 40% |
| 商家端 | 15个 | 12小时 | 45% |
| 测试集成 | - | 4小时 | 15% |
| **总计** | **27个** | **26小时** | **100%** |

---

## 💡 总结

你需要开发 **2个端**：

1. ✅ **C端（用户端）** - 12个接口 - 普通用户使用
2. ✅ **商家端（商家后台）** - 15个接口 - 商家管理自己的内容

**不需要开发平台管理端**（除非项目明确要求）

---

**建议开发顺序**：
1. 先写 C端接口（用户浏览功能）
2. 再写商家端接口（商家管理功能）
3. 最后集成测试

**这样你就清楚了吗？** 🚀
