# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**乌东文旅"衣食住行"综合服务平台** - A full-stack cultural tourism platform for Wudong Miao Village in Guizhou Province, covering clothing (非遗商品), food (餐饮美食), accommodation (住宿预订), travel (线路订票), and community (照片分享) modules.

**Tech Stack**:
- Backend: Midway.js 3.x + TypeORM + MySQL 8.0 + Cool-Admin 8.0
- Frontend: Vue 3 + TypeScript + Element Plus + Vite
- Architecture: Monorepo with backend (cool-admin-midway), frontend (cool-admin-vue)

---

## Development Commands

### Backend (cool-admin-midway)
```bash
cd cool-admin-midway

# Development
npm run dev                    # Start dev server on port 8001

# Build
npm run build                  # Build for production
npm run build:obfuscate        # Build with code obfuscation

# Testing
npm run test                   # Run all tests
npm run cov                    # Run tests with coverage

# Code Quality
npm run lint                   # Check code style
npm run lint:fix               # Auto-fix code style issues

# Deployment
npm run pm2:start              # Start with PM2
npm run pm2:stop               # Stop PM2 instance
```

### Frontend (cool-admin-vue)
```bash
cd cool-admin-vue

# Development
npm run dev                    # Start dev server on port 9000

# Build
npm run build                  # Build for production
npm run build-static           # Build static site
npm run preview                # Preview production build

# Code Quality
npm run lint                   # Check and fix with ESLint
npm run format                 # Format code with Prettier
npm run type-check             # TypeScript type checking
```

### Quick Start
```bash
# 1. Start backend
cd cool-admin-midway && npm run dev

# 2. Start frontend (in another terminal)
cd cool-admin-vue && npm run dev

# 3. Access
# Backend API: http://localhost:8001
# Swagger UI: http://localhost:8001/swagger-ui/index.html
# Frontend: http://localhost:9000
# Default login: admin / 123456
```

---

## Module Architecture

### Module Structure Pattern
Every business module follows this structure:
```
src/modules/{module-name}/
├── config.ts                          # Module registration (REQUIRED)
├── controller/
│   ├── admin/                         # Merchant/admin endpoints (/admin/*)
│   │   └── {resource}.ts
│   └── app/                           # C-side user endpoints (/app/*)
│       └── {resource}.ts
├── entity/                            # TypeORM entities (database tables)
│   └── {table}.ts
└── service/                           # Business logic layer
    └── {resource}.ts
```

### Completed Modules (as of 2026-09-10)

#### Module 1: Product System (product/)
**Status**: ✅ Fully implemented (商家端 + C端)

**Entities** (5): product, category, sku, image, review, favorite
**Controllers**: 
- Admin (3): ProductController, CategoryController, SkuController
- App (1): AppProductController

**Key Features**:
- Multi-level category tree
- SKU variants management
- Merchant-scoped product CRUD
- Review system with auto-rating calculation
- Favorite/bookmark functionality
- C-side product listing with filters and sorting

**API Endpoints**: 15 endpoints
- Admin: `/admin/product/*`, `/admin/product/category/*`, `/admin/product/sku/*`
- App: `/app/product/*` (list, detail, favorite, reviews)

---

#### Module 2: Food System (food/)
**Status**: ✅ Fully implemented (商家端 + C端)

**Entities** (8): restaurant, dish, time-slot, reservation, farm-product, farm-category
**Controllers**:
- Admin (5): RestaurantController, DishController, TimeSlotController, FarmProductController, FarmCategoryController
- App (3): AppRestaurantController, AppReservationController, AppFarmProductController

**Key Features**:
- Restaurant management with geolocation (longitude/latitude)
- Haversine distance calculation for nearby restaurants
- Dish/menu management
- Time slot configuration for reservations
- Reservation system (create, confirm, cancel)
- Farm product marketplace

**API Endpoints**: 24 endpoints
- Admin: `/admin/food/restaurant/*`, `/admin/food/dish/*`, `/admin/food/time-slot/*`, `/admin/food/farm-product/*`
- App: `/app/food/restaurant/*`, `/app/food/reservation/*`, `/app/food/farm-product/*`

---

### Framework Modules (DO NOT MODIFY)

**base/** - Cool-Admin RBAC system
- Menu management, role/permission system
- Department hierarchy
- System parameters and logging

**user/** - Framework user module
- WeChat login integration
- User address management

**member/** - Platform C-side user authentication
- Can be extended per reuse matrix

**merchant/** - Merchant onboarding and management
- Merchant application/audit workflow
- Module assignment (product, food, accommodation, etc.)

**order/** - Unified order system
- Cross-module order aggregation

**pay/** - Payment integration layer
- Multiple payment gateway support

---

## Critical Development Patterns

### 1. Controller Pattern

**Admin Controller** (Merchant/Backend):
```typescript
@Provide()
@CoolController('/admin/{module}/{resource}')
export class AdminResourceController extends BaseController {
  @Inject()
  resourceService: ResourceService;

  @Inject()
  ctx: Context;

  @Post('/create', { summary: 'Create resource' })
  async create(@Body() body: any) {
    const merchantId = this.ctx.admin.merchantId; // Get merchant from JWT
    const result = await this.resourceService.create(merchantId, body);
    return this.ok(result);
  }
}
```

**App Controller** (C-side/User):
```typescript
@Provide()
@CoolController('/app/{module}/{resource}')
export class AppResourceController extends BaseController {
  @Post('/action', { summary: 'User action' })
  async action(@Body() body: any) {
    const userId = this.ctx.user?.id; // Get user from JWT
    if (!userId) {
      return this.fail('请先登录');
    }
    // ... business logic
  }
}
```

### 2. Service Pattern - Merchant Scope Validation

**Always validate merchant ownership**:
```typescript
async update(merchantId: number, resourceId: number, data: any) {
  const resource = await this.resourceEntity.findOneBy({
    id: resourceId,
    merchantId,  // CRITICAL: Scope check
  });
  if (!resource) {
    throw new CoolCommException('资源不存在或无权限');
  }
  // ... update logic
}
```

### 3. Entity Pattern

```typescript
import { EntityModel } from '@midwayjs/orm';
import { BaseEntity } from '@cool-midway/core';
import { Column, Index } from 'typeorm';

@EntityModel('module_table_name')
export class ResourceEntity extends BaseEntity {
  @Index()
  @Column({ comment: 'Merchant ID' })
  merchantId: number;

  @Column({ comment: 'Resource name' })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, comment: 'Price' })
  price: number;

  @Column({ type: 'tinyint', default: 0, comment: 'Status: 0-下架 1-上架' })
  status: number;
}
```

### 4. Distance Calculation (Geolocation)

Use Haversine formula for restaurant distance:
```typescript
private calculateDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal
}
```

---

## Database Schema Design

### Naming Conventions
- Table names: `module_resource` (e.g., `product`, `food_restaurant`)
- Primary key: `id` (auto-increment, inherited from BaseEntity)
- Timestamps: `createTime`, `updateTime` (auto-managed by BaseEntity)
- Foreign keys: `{resource}Id` (e.g., `merchantId`, `categoryId`)

### Common Field Patterns
```typescript
merchantId: number        // Merchant ownership
userId: number           // User ownership
status: number           // 0-inactive, 1-active (or custom states)
sort: number            // Display order
longitude: number       // Geolocation (8 decimals)
latitude: number        // Geolocation (8 decimals)
```

### Status Code Conventions
- **Product/Resource**: 0-下架(offline), 1-上架(online)
- **Reservation**: 0-待确认, 1-已确认, 2-已取消, 3-已完成
- **Order**: 0-待支付, 1-已支付, 2-已发货, 3-已完成, 4-已取消

---

## API Response Format

### Success Response
```typescript
return this.ok(data); // { code: 1000, message: 'success', data: ... }
```

### Error Response
```typescript
return this.fail('错误信息'); // { code: 1001, message: '...' }
throw new CoolCommException('错误信息'); // Caught by framework
```

### Pagination Response
```typescript
{
  list: [...],
  pagination: {
    page: 1,
    size: 10,
    total: 100
  }
}
```

---

## Testing

### Test File Location
Place tests in `cool-admin-midway/test/` directory.

### Test Pattern
```typescript
import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

describe('test/product.test.ts', () => {
  let app;
  let token: string;

  beforeAll(async () => {
    app = await createApp<Framework>();
    // Login to get token
    const result = await createHttpRequest(app)
      .post('/admin/base/open/login')
      .send({ username: 'admin', password: '123456' });
    token = result.body.data.token;
  });

  afterAll(async () => {
    await close(app);
  });

  it('should create product', async () => {
    const result = await createHttpRequest(app)
      .post('/admin/product/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Product', price: 99.00 });
    expect(result.status).toBe(200);
  });
});
```

---

## Frontend Module Structure (cool-admin-vue)

### Module Pattern
```
src/modules/{module-name}/
├── config.ts              # Route and component registration
├── views/                 # Page components
│   └── {page}.vue
└── components/            # Reusable components (optional)
```

### Route Registration
```typescript
// config.ts
export default (): ModuleConfig => {
  return {
    order: 99,
    views: [
      {
        path: '/product/list',
        meta: { label: '商品列表', keepAlive: true },
        component: () => import('./views/list.vue')
      }
    ]
  };
};
```

**Note**: Frontend currently has routing issues with Cool-Admin's permission system. Backend is fully functional and can be tested via Postman or directly integrated with other frontends.

---

## Common Pitfalls

### 1. Missing Merchant Scope Check
❌ Bad:
```typescript
const product = await this.productEntity.findOneBy({ id });
```

✅ Good:
```typescript
const product = await this.productEntity.findOneBy({ id, merchantId });
```

### 2. Forgetting to Inject Dependencies
```typescript
@Inject()
resourceService: ResourceService; // Don't forget @Inject()
```

### 3. Module Config Not Created
Every new module MUST have a `config.ts` file to register with the framework.

### 4. Decimal Precision
Always use `type: 'decimal'` with `precision` and `scale` for money/prices:
```typescript
@Column({ type: 'decimal', precision: 10, scale: 2 })
price: number;
```

---

## Documentation

- `README.md` - Project overview and quick start
- `BACKEND-DEVELOPMENT-COMPLETE.md` - Merchant-side API documentation
- `C-END-DEVELOPMENT-COMPLETE.md` - C-side API documentation
- `ENDPOINTS-GUIDE.md` - Complete API endpoint reference
- `FINAL-SUMMARY.md` - Development summary

---

## Module Development Workflow

### Creating a New Module

```bash
# 1. Create module structure
cd cool-admin-midway/src/modules
mkdir -p mymodule/{controller/admin,controller/app,entity,service}

# 2. Create config.ts (REQUIRED)
cat > mymodule/config.ts << EOF
import { ModuleConfig } from '@cool-midway/core';
export default () => {
  return {
    name: 'My Module',
    description: 'Module description',
  } as ModuleConfig;
};
EOF

# 3. Create entity (defines database table)
# See existing entities in product/ or food/ for examples

# 4. Create service (business logic)
# See existing services for patterns

# 5. Create controllers (API endpoints)
# Admin: /admin/mymodule/*
# App: /app/mymodule/*

# 6. Test
npm run dev
# Visit http://localhost:8001/swagger-ui/index.html

# 7. Write tests
# Create test/mymodule.test.ts
```

---

## Current Development Status

### Completed (✅)
- Module 1: Product System (衣-非遗商品) - 12 files, 15 endpoints
- Module 2: Food System (食-餐饮美食) - 15 files, 24 endpoints
- Framework modules: merchant, order, pay, message (基础交易系统)

### In Progress (🚧)
- Module 3: Accommodation (住-住宿预订) - Partial implementation

### Pending (📋)
- Module 4: Travel/Transport (行-线路订票)
- Module 5: Community (社区-照片分享)
- Module 6: Platform Admin (平台管理后台)

---

**Last Updated**: 2026-09-10  
**Total Backend Files**: 40+ files  
**Total API Endpoints**: 50+ endpoints  
**Lines of Code**: 4000+ lines
