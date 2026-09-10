# 🔄 项目融合指南

**日期**: 2026-09-10  
**任务**: 将你的模块（product + food）与组员的模块（accommodation + operate）融合

---

## 📊 当前项目状况

### 你完成的模块（在 cool-admin-midway）

#### ✅ 模块一：商品系统（product/）
- **后端文件**: 14个（包括 admin + app 控制器）
- **接口数量**: 15个（9个商家端 + 6个C端）
- **功能**: 
  - 商品CRUD、分类管理、SKU管理
  - 商品评价、收藏功能
  - C端商品浏览、搜索、排序

#### ✅ 模块二：餐饮系统（food/）
- **后端文件**: 20个（包括 admin + app 控制器）
- **接口数量**: 24个（15个商家端 + 9个C端）
- **功能**:
  - 餐厅管理（带地理位置）
  - 预订系统（完整流程）
  - 农产品展示
  - 菜品管理、时段配置

---

### 组员完成的模块

#### ✅ 模块三：住宿系统（accommodation/）
**位置**: 已经在 `cool-admin-midway/src/modules/accommodation/`

**后端文件** (约10个):
```
accommodation/
├── config.ts
├── controller/
│   ├── admin/
│   │   ├── hotel.ts           # 民宿管理
│   │   ├── room-type.ts       # 房型管理
│   │   └── room-calendar.ts   # 房态日历
│   └── app/
│       ├── hotel.ts           # C端民宿浏览
│       └── room-type.ts       # C端房型查看
├── entity/
│   ├── hotel.ts               # 民宿实体
│   ├── room-type.ts           # 房型实体
│   └── room-calendar.ts       # 房态日历实体
└── service/
    ├── hotel.ts
    └── room-calendar.ts
```

**功能**:
- 民宿信息管理（地址、经纬度、风格标签、设施）
- 房型管理（价格、容纳人数、床型）
- 房态日历（动态定价、满房/关房状态）
- C端浏览接口（搜索、筛选、详情）

---

#### ✅ 运营模块（operate/）
**位置**: 已经在 `cool-admin-midway/src/modules/operate/`

**功能**: 
- Banner 管理
- 公告管理
- 财务记录（预留）

---

#### ✅ C端前端（wudong-web/）
**位置**: `d:/wudong/wudong-web/`

**技术栈**: Vue 3 + Vite 5 + TypeScript + Vue Router + Pinia

**已完成页面**:
```
wudong-web/src/
├── views/
│   ├── home/HomeView.vue              # 首页（banner + 精选民宿）
│   └── accommodation/
│       ├── HotelListView.vue          # 民宿列表（搜索/筛选）
│       └── HotelDetailView.vue        # 民宿详情 + 房态日历
├── api/
│   ├── accommodation.ts               # 民宿API调用
│   ├── operate.ts                     # 运营内容API
│   └── http.ts                        # HTTP客户端
└── components/                        # 公共组件
```

**API 调用**: 已配置代理到 `http://localhost:8001/app/**`

---

## 🎯 融合方案

### 方案：统一使用 cool-admin-midway 作为后端

**好消息**: 所有后端代码**已经在同一个项目中**了！

```
cool-admin-midway/src/modules/
├── product/          # ✅ 你的模块一
├── food/             # ✅ 你的模块二
├── accommodation/    # ✅ 组员的模块三（已存在）
└── operate/          # ✅ 组员的运营模块（已存在）
```

**你们的后端代码已经融合了！** 只需要：

---

## 📋 融合步骤

### 步骤1: 验证后端模块完整性

```bash
cd cool-admin-midway

# 检查所有模块是否正常加载
npm run dev

# 访问 Swagger 查看接口
# http://localhost:8001/swagger-ui/index.html
```

**检查这些接口是否存在**:
- `/admin/product/*` - 你的商品接口
- `/admin/food/*` - 你的餐饮接口
- `/admin/accommodation/*` - 组员的住宿接口
- `/app/product/*` - 商品C端接口
- `/app/food/*` - 餐饮C端接口
- `/app/accommodation/*` - 住宿C端接口

---

### 步骤2: 创建商品和餐饮的C端前端页面

**目前缺少的**: 你的 product 和 food 模块的C端前端页面

**需要创建**:

#### 选项A: 在 wudong-web 中添加（推荐）

```bash
cd wudong-web

# 创建商品页面
mkdir -p src/views/product
touch src/views/product/ProductListView.vue
touch src/views/product/ProductDetailView.vue

# 创建餐饮页面
mkdir -p src/views/food
touch src/views/food/RestaurantListView.vue
touch src/views/food/RestaurantDetailView.vue
touch src/views/food/FarmProductListView.vue

# 创建 API 调用
touch src/api/product.ts
touch src/api/food.ts
```

**参考 accommodation 的实现方式**:
```typescript
// src/api/product.ts
import { http } from './http';

export async function getProductList(params: any) {
  return http.get('/app/product/list', { params });
}

export async function getProductDetail(id: number) {
  return http.get(`/app/product/${id}`);
}
```

---

#### 选项B: 使用 cool-admin-vue（管理后台）

`cool-admin-vue` 适合商家使用，不适合C端用户。

**建议**: 
- 商家端继续用 `cool-admin-vue`（已有框架）
- C端用户使用 `wudong-web`（你组员开发的）

---

### 步骤3: 配置前端路由

**在 wudong-web/src/router/index.ts 添加路由**:

```typescript
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/HomeView.vue')
    },
    // 组员已完成
    {
      path: '/hotels',
      name: 'hotel-list',
      component: () => import('@/views/accommodation/HotelListView.vue')
    },
    {
      path: '/hotels/:id',
      name: 'hotel-detail',
      component: () => import('@/views/accommodation/HotelDetailView.vue')
    },
    
    // 你需要添加的
    {
      path: '/products',
      name: 'product-list',
      component: () => import('@/views/product/ProductListView.vue')
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('@/views/product/ProductDetailView.vue')
    },
    {
      path: '/restaurants',
      name: 'restaurant-list',
      component: () => import('@/views/food/RestaurantListView.vue')
    },
    {
      path: '/restaurants/:id',
      name: 'restaurant-detail',
      component: () => import('@/views/food/RestaurantDetailView.vue')
    },
    {
      path: '/farm-products',
      name: 'farm-product-list',
      component: () => import('@/views/food/FarmProductListView.vue')
    }
  ]
});

export default router;
```

---

### 步骤4: 统一运行所有服务

```bash
# 终端1: 启动后端（包含所有模块）
cd cool-admin-midway
npm run dev
# 运行在 http://localhost:8001

# 终端2: 启动C端前端
cd wudong-web
npm run dev
# 运行在 http://localhost:5173

# 终端3: 启动管理后台（可选）
cd cool-admin-vue
npm run dev
# 运行在 http://localhost:9000
```

---

## 🔗 API 对接示例

### wudong-web 中如何调用你的接口

```typescript
// src/api/product.ts
import { http } from './http';

export const productApi = {
  // 商品列表
  getList(params: {
    page?: number;
    size?: number;
    categoryId?: number;
    keyword?: string;
    sort?: string;
  }) {
    return http.get('/app/product/list', { params });
  },

  // 商品详情
  getDetail(id: number) {
    return http.get(`/app/product/${id}`);
  },

  // 收藏商品
  toggleFavorite(id: number) {
    return http.post(`/app/product/${id}/favorite`);
  },

  // 获取评价
  getReviews(id: number, page: number = 1) {
    return http.get(`/app/product/${id}/reviews`, {
      params: { page, size: 10 }
    });
  },

  // 发布评价
  createReview(data: {
    productId: number;
    rating: number;
    content: string;
    images?: string[];
  }) {
    return http.post('/app/product/review', data);
  }
};
```

```typescript
// src/api/food.ts
import { http } from './http';

export const foodApi = {
  // 餐厅列表
  getRestaurantList(params: any) {
    return http.get('/app/food/restaurant/list', { params });
  },

  // 餐厅详情
  getRestaurantDetail(id: number) {
    return http.get(`/app/food/restaurant/${id}`);
  },

  // 创建预订
  createReservation(data: any) {
    return http.post('/app/food/reservation/create', data);
  },

  // 农产品列表
  getFarmProductList(params: any) {
    return http.get('/app/food/farm-product/list', { params });
  }
};
```

---

## 📂 最终项目结构

```
wudong/
├── cool-admin-midway/              # 统一后端
│   └── src/modules/
│       ├── product/                # ✅ 你的：商品系统
│       ├── food/                   # ✅ 你的：餐饮系统
│       ├── accommodation/          # ✅ 组员：住宿系统
│       ├── operate/                # ✅ 组员：运营模块
│       ├── base/                   # 框架：权限系统
│       ├── merchant/               # 框架：商家管理
│       ├── order/                  # 框架：订单系统
│       └── pay/                    # 框架：支付系统
│
├── wudong-web/                     # C端前端（游客站）
│   └── src/
│       ├── views/
│       │   ├── home/               # ✅ 组员：首页
│       │   ├── accommodation/      # ✅ 组员：住宿浏览
│       │   ├── product/            # ⚠️ 需要你创建：商品浏览
│       │   └── food/               # ⚠️ 需要你创建：餐饮浏览
│       └── api/
│           ├── accommodation.ts    # ✅ 组员已完成
│           ├── operate.ts          # ✅ 组员已完成
│           ├── product.ts          # ⚠️ 需要你创建
│           └── food.ts             # ⚠️ 需要你创建
│
└── cool-admin-vue/                 # 商家管理后台
    └── src/modules/
        ├── product/                # ⚠️ 可选：商家端商品管理页面
        └── food/                   # ⚠️ 可选：商家端餐饮管理页面
```

---

## ⚠️ 注意事项

### 1. 端口配置
- **后端**: 8001
- **C端前端**: 5173（wudong-web）
- **管理后台**: 9000（cool-admin-vue）

### 2. 数据库
所有模块共用**同一个数据库**，确保：
- MySQL 正常运行
- `cool-admin-midway/.env` 中数据库配置正确

### 3. API 代理
wudong-web 的 vite.config.ts 应该已经配置了代理：
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/app': {
        target: 'http://localhost:8001',
        changeOrigin: true
      }
    }
  }
});
```

---

## 🚀 下一步工作

### 你需要做的：

1. **创建C端前端页面** (在 wudong-web 中):
   - [ ] `src/views/product/ProductListView.vue`
   - [ ] `src/views/product/ProductDetailView.vue`
   - [ ] `src/views/food/RestaurantListView.vue`
   - [ ] `src/views/food/RestaurantDetailView.vue`
   - [ ] `src/views/food/FarmProductListView.vue`

2. **创建API调用层** (在 wudong-web 中):
   - [ ] `src/api/product.ts`
   - [ ] `src/api/food.ts`

3. **添加路由** (在 wudong-web/src/router/index.ts)

4. **测试接口对接**

---

## 💡 参考组员的代码

**学习如何写C端页面**:
```bash
# 查看组员的实现
cat wudong-web/src/views/accommodation/HotelListView.vue
cat wudong-web/src/api/accommodation.ts
```

**复制他们的模式**，替换成你的商品和餐饮接口即可！

---

## ✅ 总结

**好消息**: 
- ✅ 后端代码已经在同一个项目中，**无需融合**
- ✅ 所有模块可以同时运行
- ✅ 数据库共享，订单系统可以跨模块

**你的任务**:
- 📝 在 wudong-web 中添加商品和餐饮的C端页面
- 🔗 参考组员的 accommodation 页面实现方式
- 🧪 测试所有接口联调

---

**后端已经融合完成！现在只需要补充前端页面！** 🎉
