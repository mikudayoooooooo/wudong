# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**乌东文旅"衣食住行"综合服务平台** - A full-stack cultural tourism platform for Wudong Miao Village in Guizhou, covering clothing (非遗商品), food (餐饮美食), accommodation (住宿预订), travel (线路订票), and community (照片分享) modules.

**Architecture**: Monorepo with backend (cool-admin-midway), frontend (cool-admin-vue), and documentation (docs).

---

## Critical Development Constraints

### 🚨 DO NOT MODIFY THESE MODULES
- `cool-admin-midway/src/modules/base/` - Cool-admin RBAC system
- `cool-admin-midway/src/modules/user/` - Framework user module (微信登录 + address)
- `cool-admin-midway/src/modules/member/` - Platform C-side user authentication (unless extending per §6 复用矩阵)

### 🔒 Base Layer Merge Notice (2026-09-09)
Per `docs/superpowers/specs/2026-09-09-platform-base-design.md`:
- Common base modules (member/order/pay/merchant/message/cart/operate/sensitive) are merged into main
- After pulling latest main, run cleanup script:
  ```bash
  mysql -uroot -p wudong_platform < docs/database/migrate-base-20260909.sql
  cd cool-admin-midway && npm i && npm run test
  ```
- **Database port**: Use 3307 (docker `wudong-mysql`) NOT 3306 (local MySQL80)
- **Development discipline** per §9.3:
  - Current user: `ctx.user.id` (from member JWT)
  - Favorites: inject `MemberFavoriteService`
  - Orders: use `OrderService.create()`
  - Payments: use `PayService`
  - Merchant identity: check `isMerchant()`
  - **DO NOT reinvent user/order/payment/message wheels**

---

## Common Commands

### Backend (cool-admin-midway)

```bash
# Development
cd cool-admin-midway
npm install
npm run dev              # Start dev server (http://localhost:8001)

# Testing
npm run test             # Run all tests (21 suites / 101 cases expected)
npm run cov              # Test with coverage

# Linting
npm run lint             # Check code style
npm run lint:fix         # Auto-fix style issues

# Building
npm run build            # Production build
npm run start            # Start production server (NODE_ENV=production)

# Process management
npm run pm2:start        # Start with PM2
npm run pm2:stop         # Stop PM2 process
```

### Frontend (cool-admin-vue)

```bash
cd cool-admin-vue
npm install
npm run dev              # Start dev server (http://localhost:9000)
npm run build            # Production build
npm run build-static     # Static build mode
npm run type-check       # TypeScript type checking
npm run lint             # ESLint
npm run format           # Prettier formatting
```

### Database Setup

```bash
# Local development uses MySQL 8.0
mysql -u root -p -h 127.0.0.1 -P 3307
# Database: cool (auto-created on first run)
# Schema: synchronize: true (auto-creates tables from entities)
```

---

## Architecture & Module Structure

### Backend Module Organization

```
cool-admin-midway/src/modules/
├── base/          # Cool-admin RBAC (admin_user/role/permission/log) ✅ DO NOT MODIFY
├── user/          # Framework user module (微信登录 + user_address) ✅ DO NOT MODIFY
├── member/        # ✅ C-side users (member_user/member_sms_code/user_favorite)
├── merchant/      # 商家中心 (merchant/merchant_application + 入驻审核)
├── order/         # 统一订单 (order + order_product/order_reservation/order_ticket)
├── pay/           # 统一支付模拟 (payment_record + PayService)
├── cart/          # 购物车 (cart + CartService)
├── message/       # 消息中心 (system_message + MessageService)
├── operate/       # 平台运营 (banner/announcement/finance_record)
├── sensitive/     # 敏感词过滤 (sensitive_word + DFA)
├── travel/        # 行模块 (第4组: 景区/门票/路线/电子票)
└── community/     # 社区模块 (第5组: 游记/评论/话题/关注)
```

### Module Anatomy (Standard Layout)

```
modules/<module-name>/
├── controller/
│   ├── admin/          # 管理端接口 (需 admin JWT)
│   └── app/            # C端接口 (需 member JWT 或 IGNORE_TOKEN)
├── dto/                # 参数校验 (optional)
├── entity/             # TypeORM实体类 (表定义)
├── middleware/         # 中间件 (optional)
├── service/            # 业务逻辑层
├── config.ts           # ✅ 必须: 模块配置 (name/description/middlewares)
├── db.json             # 可选: 初始化数据
└── menu.json           # 可选: 初始化菜单 (cool-admin)
```

---

## Coding Conventions (Cool-Admin Framework)

### 1. Entity Rules

```typescript
// ✅ CORRECT: BaseEntity import (固定两层级)
import { BaseEntity } from '../../base/entity/base';

// ❌ WRONG: 不要修改层级
import { BaseEntity } from '../../../base/entity/base';

@Entity('product')  // 表名使用下划线 snake_case
export class ProductEntity extends BaseEntity {
  @Column({ comment: '商品标题' })
  title: string;  // ✅ 字段使用驼峰 camelCase (NOT snake_case)

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  // ❌ 禁止使用外键关系注解
  // @ManyToOne() / @OneToMany() / @ManyToMany() - 不允许!
  // 只做逻辑关联 + 索引
}
```

**Key Constraints**:
- ❌ NO TypeORM foreign key decorators (`@ManyToOne`, `@OneToMany`, etc.)
- ✅ Tables auto-created via `synchronize: true` (dev only)
- ✅ Field names: camelCase (框架无 snake_case 转换策略)
- ✅ All timestamps via `BaseEntity` (createTime/updateTime)

### 2. Controller Rules

```typescript
import { CoolController, BaseController } from '@cool-midway/core';
import { ProductEntity } from '../../entity/product';
import { ProductService } from '../../service/product';

// ✅ 自动路由推导 (推荐)
// 文件路径: src/modules/product/controller/app/goods.ts
// 生成路由: /app/product/goods/*

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],  // 通用CRUD
  entity: ProductEntity,
  service: ProductService,  // 可选: 自定义Service
  pageQueryOp: {
    keyWordLikeFields: ['title'],  // 模糊查询
    fieldEq: ['categoryId', 'status'],  // 精确筛选
    select: ['a.*', 'b.name as categoryName'],  // 多表查询必须指定select
    join: [{
      entity: CategoryEntity,
      alias: 'b',
      condition: 'a.categoryId = b.id',
      type: 'leftJoin'
    }]
  }
})
export class AppProductGoodsController extends BaseController {
  // ❌ 不允许重写: add/delete/update/info/list/page (除非在Service层重写)
  // ✅ 允许: 自定义方法
  
  @Get('/recommend')
  async recommend() {
    return this.ok(await this.productService.getRecommend());
  }
}
```

**Controller 路由规则** (§9.3 并行开发纪律):
- **需登录的自定义路由**: 可用显式 `prefix: '/app/order'` (会有 swagger 幽灵路径警告，但不影响功能)
- **带 `IGNORE_TOKEN` 的控制器**: 禁止显式 prefix! 必须用"文件名=资源名"凑出目标 URL
  ```typescript
  // 文件: controller/app/banner.ts
  @CoolController({ api: ['list'] })
  @CoolUrlTag({ key: TagTypes.IGNORE_TOKEN, value: ['list'] })
  export class AppOperateBannerController extends BaseController {}
  // 路由: /app/operate/banner/list (三段式)
  ```

### 3. Service Rules

```typescript
import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';

@Provide()
export class ProductService extends BaseService {
  @InjectEntityModel(ProductEntity)
  productRepo: Repository<ProductEntity>;

  // 重写BaseService的方法 (会影响Controller的通用CRUD)
  async add(param: any) {
    // 自定义新增逻辑
    const result = await super.add(param);
    // 你的业务逻辑
    return result;
  }

  // ✅ 使用TypeORM API (不要自定义SQL，除非统计/复杂查询)
  async list(query) {
    return await this.productRepo.find({ where: { status: 1 } });
  }

  // 高级查询用 createQueryBuilder
  async search(keyword: string) {
    return await this.productRepo
      .createQueryBuilder('p')
      .where('p.title LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();
  }
}
```

### 4. File Naming

```
✅ CORRECT: snake_case for files
- product_sku.ts
- user_address.ts
- order_ticket.ts

❌ WRONG: camelCase for files
- productSku.ts  
- userAddress.ts

✅ 模块内简化命名:
modules/product/entity/sku.ts       (NOT product_sku.ts)
modules/product/service/review.ts   (NOT product_review.ts)
```

### 5. API URL 规则

```
需求文档 /api/* → 实际实现:
- C端接口:   /app/<module>/*     (需 member JWT)
- 管理端接口: /admin/<module>/*   (需 admin JWT)
- 匿名接口:   /app/<module>/*     (加 @CoolUrlTag IGNORE_TOKEN)

示例:
POST /app/order/create      # C端下单
GET  /admin/order/page      # 管理端订单列表
GET  /app/operate/banner/list  # 匿名浏览轮播图
```

---

## Module Reuse Matrix (谁用什么)

| 业务模块 | 依赖的公共模块 |
|---------|--------------|
| 衣-非遗商品 (第1组) | member, merchant, **order(order_product)**, **pay**, **cart**, message, sensitive, user.address |
| 食-餐饮美食 (第2组) | member, merchant, **order(order_reservation)**, **pay**, message |
| 住-住宿预订 (第3组) | member, merchant, **order(order_reservation)**, **pay**, message |
| 行-线路订票 (第4组) | member, merchant, **order(order_ticket)**, **pay**, message, favorite |
| 社区-照片分享 (第5组) | member, favorite(post), message(community_message自留), **sensitive** |
| 平台管理后台 (第6组) | base RBAC, merchant审核, operate, finance, /admin/order, /admin/message |

**Service 调用示例**:
```typescript
// 下单
@Inject()
orderService: OrderService;
const order = await this.orderService.create(userId, { module: 'travel', orderType: 4, items, remark });

// 支付
@Inject()
payService: PayService;
const payment = await this.payService.create(userId, orderNo, 'wechat');
await this.payService.mockPay(paymentNo);  // 模拟支付

// 商家身份
@Inject()
merchantService: MerchantService;
const merchant = await this.merchantService.isMerchant(userId);
if (!merchant) throw new Error('无商家权限');

// 消息通知
@Inject()
messageService: MessageService;
await this.messageService.send(userId, 'order', '订单已支付', `订单${orderNo}已支付成功`);

// 敏感词过滤
@Inject()
sensitiveService: SensitiveService;
const check = await this.sensitiveService.check(content);
if (check.hit) { /* 内容待审核 */ }
```

---

## Testing

### Test Structure

```typescript
// test/<module>-<feature>.test.ts
import { createApp, close } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

describe('test/order-crud.test.ts', () => {
  let app: Application;

  // ✅ 每个文件只 boot() 一次!
  beforeAll(async () => {
    app = await createApp<Framework>();
  });

  afterAll(async () => {
    await close(app);
  });

  // ✅ 多场景用一个 describe 串行覆盖
  it('should create order', async () => {
    const res = await app.httpRequest()
      .post('/app/order/create')
      .set('Authorization', 'Bearer ' + token)
      .send({ orderType: 1, items: [...] });
    
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1000);
    // ⚠️ ok(null) 不输出 data 键，断言空值用:
    expect(res.body.data ?? null).toBeNull();
  });
});
```

**测试纪律** (§9.3):
- 测试手机号段按模块划分 (order用 135xxx, merchant用 134xxx)
- 同文件多次 createApp/close 会导致随机失败
- `npm run test` 应通过 21 套件 / 101 用例

---

## Configuration

### Database Config (`src/config/config.local.ts`)

```typescript
typeorm: {
  dataSource: {
    default: {
      type: 'mysql',
      host: '127.0.0.1',
      port: 3307,  // ⚠️ docker wudong-mysql (NOT 3306!)
      username: 'root',
      password: '123456',
      database: 'cool',
      synchronize: true,  // ⚠️ 生产环境禁用!
      logging: false,
      charset: 'utf8mb4',
      entities: ['**/modules/*/entity'],
    }
  }
}

cool: {
  eps: true,        // 实体路径 (swagger相关)
  initDB: true,     // 自动导入 db.json
  initMenu: true,   // 自动导入 menu.json
}
```

### API Documentation

- Swagger: http://localhost:8001/swagger-ui/index.html
- 完整接口: 约134个 (见 `docs/docs/API接口设计文档.md`)

---

## Key Development References

### Must-Read Before Coding

1. **Base Design** (`docs/superpowers/specs/2026-09-09-platform-base-design.md`):
   - §6 复用矩阵: 谁的模块用什么
   - §9.3 并行开发纪律: 避免合并冲突的约束

2. **Cursor Rules** (`.cursor/rules/`):
   - `module.mdc`: 模块开发规范
   - `controller.mdc`: 控制器规范 (路由/CRUD/pageQueryOp)
   - `service.mdc`: 服务层规范 (重写CRUD/查询/modifyBefore)
   - `db.mdc`: Entity规范 (禁止外键/层级固定)

3. **组员开发文档** (`docs/docs/组员开发文档-完整版.md`):
   - 数据库设计 (50张表)
   - API接口规范 (RESTful)
   - Git协作规范 (分支/提交信息)

### Framework Documentation

- Cool-admin: https://cool-js.com / https://node.cool-admin.com
- Midway.js: https://midwayjs.org
- TypeORM: https://typeorm.io

---

## Common Pitfalls

1. **❌ 修改 base/user/member 核心模块** → 会破坏公共底座契约
2. **❌ 使用 @ManyToOne 等外键注解** → 框架禁止物理外键
3. **❌ BaseEntity import 层级错误** → 必须固定两层 `../../base/entity/base`
4. **❌ 控制器重写 CRUD 方法** → 应在 Service 层重写
5. **❌ IGNORE_TOKEN 控制器用显式 prefix** → 会导致鉴权豁免失效
6. **❌ 测试文件多次 boot()** → 会导致随机失败
7. **❌ 使用 3306 端口** → 应用 3307 (docker wudong-mysql)
8. **❌ 自建 user/order/payment 轮子** → 必须复用公共模块

---

## Project-Specific Notes

- **版本**: Cool-admin 8.x (最新写法，如 Entity 字典配置)
- **语言**: 始终使用中文回复，包括代码注释
- **API 前缀**: 创建接口不要多层级如 `/student/detail`，改为 `/studentDetail` (驼峰)
- **同步策略**: `synchronize: true` 开发模式自动建表，生产环境必须禁用
- **商家审核流程**: merchant 模块审核通过后回写 `member_user.role=2`
- **支付模拟**: pay 模块的 `mockPay()` 方法，生产接真实微信支付只改此方法

---

## Team Context (6 Groups)

| 组 | 模块 | 表数 | 负责人 | 状态 |
|----|------|------|-------|------|
| 1 | 衣-非遗商品 | 6 | TBD | 待开始 |
| 2 | 食-餐饮美食 | 7 | TBD | 待开始 |
| 3 | 住-住宿预订 | 5 | TBD | 待开始 |
| 4 | 行-线路订票 | 9 | cja (第4组) | member已完成 ✅ |
| 5 | 社区-照片分享 | 7 | TBD | 待开始 |
| 6 | 平台管理后台 | 8 | TBD | 待开始 |

**Phase B1** (当前): order + pay ∥ merchant + message (交易底座并行开发中)

---

## Quick Start for New Features

```bash
# 1. 创建模块目录
mkdir -p src/modules/mymodule/{controller/admin,controller/app,entity,service}

# 2. 创建 config.ts (必须)
# 参考: src/modules/member/config.ts

# 3. 创建 Entity
# 参考 Cursor rule: .cursor/rules/db.mdc

# 4. 创建 Controller
# 参考 Cursor rule: .cursor/rules/controller.mdc

# 5. 创建 Service (如需自定义逻辑)
# 参考 Cursor rule: .cursor/rules/service.mdc

# 6. 测试
npm run dev
# 访问 http://localhost:8001/swagger-ui/index.html

# 7. 编写测试用例
# 参考: test/member-*.test.ts

npm run test
```

---

**Last Updated**: 2026-09-09  
**Maintainer**: Platform Tech Team
