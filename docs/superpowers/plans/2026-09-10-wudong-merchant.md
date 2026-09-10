# B 端商家（商户入驻 + 自管民宿房态）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让入驻商户在 `wudong-web` 商家区登录后，能查看入驻进度/店铺信息，并对自己的民宿、房型、房态日历做完整增删改查（含上下架），后端接口严格按登录身份做归属校验。

**Architecture:** 后端在 `accommodation` 模块新增 B 端只读/写入服务与一个显式前缀控制器 `/app/accommodation/merchant`（`/app/*` 自动走登录中间件），归属校验集中在 `MerchantScopeService`（P2 商家身份 + P3 资源归属），房态直接复用已有 `RoomCalendarService`（不重复实现）。前端在 `wudong-web` 内新增商家区（`/merchant/*` 嵌套路由 + 登录守卫）：`http.ts` 扩展 POST/鉴权头/登录失效处理，`stores/auth.ts` 持久化 token，`api/merchant.ts` 与 `mocks/merchant.ts` 同构（`USE_MOCK` 唯一开关，与既有 C 端写法一致）。

**Tech Stack:** 后端 Midway.js 3 + TypeORM 0.3 + `@cool-midway/core` 8 + jest(ts-jest) + mysql2；前端 Vue 3.4 `<script setup>` + TS strict + Pinia + Vue Router 4 + Vitest(jsdom) + SCSS。

**Spec:** `docs/superpowers/specs/2026-09-10-wudong-merchant-design.md`

## Global Constraints

- 后端本地运行：`cool-admin-midway/` 下 `npm run dev`（8001，读 `src/config/config.local.ts`）。
- **跑 jest 前必须先停掉 8001 的 dev 进程**（jest 启动的应用同样绑定 8001，会直接失败）；jest 命令一律在 `cool-admin-midway/` 下执行：
  `npx cross-env NODE_ENV=unittest jest test/<file>.test.ts --runInBand`
  （jest.config.js 已 `maxWorkers: 1` + `forceExit: true` + `testTimeout: 120000`；`NODE_ENV=unittest` 才会读 `config.unittest.ts` → 测试库 `127.0.0.1:3307 / root / 123456 / wudong_platform_test`，由 `test/global-setup.js` 每次重建）。
- 测试依赖本机 3307 的 MySQL（docker 容器 `wudong-mysql`）已启动。
- **鉴权头是裸 token**：`test/helper.ts` 的 `auth(token)` 返回 `{ Authorization: token }`，**没有 `Bearer ` 前缀**（中间件直接 `jwt.verify(ctx.get('Authorization'))`）。前端同此约定。
- C 端未登录的响应形态：HTTP **200** + `{"code":1001,"message":"登录失效~"}`；业务错误也是 `code:1001`。
- **测试手机号必须按套件分块，不得与其它测试文件撞号**：`test/global-setup.js` 只在**每次 jest 运行开始时**重建一次测试库，同一次 `--runInBand` 里所有套件共用同一个库；而注册接口对已存在的手机号会抛 `该手机号已注册，请直接登录`，`registerAndLogin` 又断言 `code === 1000`，撞号会让**后跑的那个套件**在 `beforeAll` 全挂。既有占用：`13300133001-03`（base-message）、`13200132001-03`（base-merchant）等。本计划占用：T1 `13300133004/05/06`、T2 `13300133007`、T3 `13300133101/102`、T4 `13300133201/202`——新增用例继续在这些块内取未用号，不要复用其它套件的号段。**前端只能靠 `message.startsWith('登录失效')` 区分鉴权失败**，不能靠 code。
- 所有 B 端路由挂在显式前缀 `/app/accommodation/merchant`（`@CoolController({ prefix: ... })`）；`/app/*` 自动受登录中间件保护，**不要**加 `@CoolTag(TagTypes.IGNORE_TOKEN)`。
- 控制器方法名**不得**与 `BaseController` 内置方法同名（`page/list/info/add/update/delete`），否则 TS2416 编译失败；一律用 `hotelPage` / `hotelAdd` 这类前缀名。
- **服务方法名同样受限**：`@cool-midway/core` 的 `BaseService` 也声明了 `page/list/info/add/update/delete`（`node_modules/@cool-midway/core/dist/service/base.js:135-215`），同名即 TS2416 且应用启动失败。因此 `MerchantHotelService` 用 `hotelPage/hotelInfo/hotelAdd/hotelUpdate/hotelRemove`，`MerchantRoomTypeService` 用 `roomTypePage/roomTypeAdd/roomTypeUpdate/roomTypeRemove`（`MerchantCalendarService.range/batch` 不冲突，保持原名）。T1 实现时已按此基线落地命名。
- 归属字段：`hotel.merchantId` 定民宿归属；`room_type.hotelId` → `hotel.merchantId` 定房型归属；`room_calendar.roomTypeId` → 房型归属。
- 后端错误文案（测试精确断言，不得改写）：
  `仅商家可访问` / `无权操作该资源` / `请指定民宿` / `请填写完整的民宿信息` / `请填写完整的房型信息` / `房型价格必须大于 0` / `房间数量至少为 1` / `标签格式不正确` / `您的入驻模块非住宿，无法新增民宿` / `请先删除该民宿下的房型` / `日期区间无效` / `日期区间最多32天`。
  归一（`service/merchant-field.ts` 的 `pickFields`）另有两个「字段值形态不对」的文案：数字字段为空/不可解析 → `民宿信息格式不正确`（民宿）/ `房型信息格式不正确`（房型）；标签类字段元素不是非空字符串 → `标签格式不正确`。
- **不提交 `cool-admin-midway/src/config/config.local.ts`**（本机 3307/`cool` 覆盖，未提交状态必须保持；`git add` 时不得带上它）。
- 不修改其它组的模块（`base` / `member` / `merchant` / `order` / `pay` / `message` / `cart` / `food` / `product` / `sensitive`）。本计划只允许改：`cool-admin-midway/src/modules/accommodation/**`、`cool-admin-midway/src/modules/operate/controller/admin/{banner,announcement}.ts`、`cool-admin-midway/test/{helper.ts,*.test.ts}`、`wudong-web/**`、`docs/**`。
- 前端：路径别名 `@` → `src`；测试与被测文件同目录、命名 `*.spec.ts`，`include: ['src/**/*.spec.ts']`；命令 `npm run test`（vitest）与 `npm run type-check`（vue-tsc `--noEmit`）。
- 前端数据源开关唯一判据是 `USE_MOCK`（`src/env.ts`）：每个 api 模块在**内部**选择 mock/real，视图层不感知。
- 前端错误约定：`ApiError.message` 以 `登录失效` 开头 → 清 token、跳 `/login`；其它 → 就地展示 message。
- 提交粒度：一个 Task 一次 commit，信息形如 `feat(merchant): …` / `fix(operate): …`；只 `git add` 该 Task 涉及的文件。

---

## 文件结构总览

**后端（新增/修改）**

| 文件 | 职责 |
|---|---|
| `cool-admin-midway/src/modules/accommodation/service/merchant-scope.ts` | 新增。P2/P3 归属校验（商家身份、民宿归属、房型归属） |
| `cool-admin-midway/src/modules/accommodation/service/merchant-hotel.ts` | 新增。商家民宿 page/info/add/update/remove（P4/P5/P6） |
| `cool-admin-midway/src/modules/accommodation/service/merchant-room-type.ts` | 新增。商家房型 page/add/update/remove（P7 级联清房态） |
| `cool-admin-midway/src/modules/accommodation/service/merchant-calendar.ts` | 新增。商家房态 range/batch（校验归属 + 32 天窗口，委托 `RoomCalendarService`） |
| `cool-admin-midway/src/modules/accommodation/controller/app/merchant.ts` | 新增。B 端唯一控制器，前缀 `/app/accommodation/merchant` |
| `cool-admin-midway/src/modules/operate/controller/admin/banner.ts` | **不改**。Task 5 原计划改此文件，执行前核对发现第 9 行本已是正确的 `keyWordLikeFields`（详见 Task 5） |
| `cool-admin-midway/src/modules/operate/controller/admin/announcement.ts` | 同上，**不改** |
| `cool-admin-midway/test/helper.ts` | 修改：追加 `APPLY_OK`、`registerMerchant()` |
| `cool-admin-midway/test/merchant-hotel.test.ts` | 新增。T1 建、T2 续写 |
| `cool-admin-midway/test/merchant-room-type.test.ts` | 新增 |
| `cool-admin-midway/test/merchant-calendar.test.ts` | 新增 |
| `cool-admin-midway/test/operate-admin.test.ts` | 修改：追加 `keyWordLikeFields` 回归断言 |

**前端（`wudong-web/src/`）**

| 文件 | 职责 |
|---|---|
| `api/http.ts` | 修改：抽 `doFetch`，新增 `post`、`setAuthToken`、`setUnauthorizedHandler` |
| `api/normalize.ts` | 新增：`toNum/normHotel/normRoomType/normRow`（从 `accommodation.ts` 抽出，两处复用） |
| `api/accommodation.ts` | 修改：改为从 `normalize.ts` 引入归一函数 |
| `api/auth.ts` | 新增：注册/密码登录/发送验证码/退出（个人作息） |
| `api/merchant.ts` | 新增：入驻 apply/application/my + 民宿/房型/房态管理（内部 `USE_MOCK` 分支） |
| `api/types.ts` | 修改：追加商家域类型 |
| `mocks/merchant.ts` | 新增：内存态演示数据（可增删改） |
| `stores/auth.ts` | 新增：token 持久化 + 会员信息 + 店铺信息 + 登录/退出 |
| `router/index.ts` | 修改：新增 `/login` 与 `/merchant/*` 嵌套路由 + 全局守卫 |
| `views/merchant/MerchantShell.vue` | 新增：商家区外壳（侧边导航 + 店铺头部 + RouterView） |
| `views/LoginView.vue` | 新增：登录/注册页 |
| `views/merchant/MerchantHomeView.vue` | 新增：店铺概览 + 入驻进度 + 快捷入口 |
| `views/merchant/MerchantApplyView.vue` | 新增：入驻申请表单 / 审核中 / 驳回重填 三态 |
| `views/merchant/MerchantHotelListView.vue` | 新增：我的民宿列表（上下架/编辑/删除/新增） |
| `views/merchant/MerchantHotelEditView.vue` | 新增：民宿新增/编辑表单 |
| `views/merchant/MerchantRoomTypeView.vue` | 新增：某民宿的房型管理 |
| `views/merchant/MerchantCalendarView.vue` | 新增：房态日历（7/30 天切换 + 批量设价/关房） |
| `components/ImageUploader.vue` | 新增：图片上传（真实走 `/app/base/comm/upload`，mock 走本地 blob URL） |
| `components/TagInput.vue` | 新增：标签数组输入 |
| `styles/merchant.scss` | 新增：商家区样式（全局类，视图不再写 scoped 样式） |
| `main.ts` | 修改：引入 `styles/merchant.scss` |
| `App.vue` | 修改：顶栏加「商家中心」入口 |
| `README.md` | 修改：补商家区说明 |

---

# Phase A — 后端（cool-admin-midway）

## Task 1: 归属校验基座 + 我的民宿分页

**Files:**
- Modify: `cool-admin-midway/test/helper.ts`（追加导出）
- Create: `cool-admin-midway/src/modules/accommodation/service/merchant-scope.ts`
- Create: `cool-admin-midway/src/modules/accommodation/service/merchant-hotel.ts`
- Create: `cool-admin-midway/src/modules/accommodation/controller/app/merchant.ts`
- Test: `cool-admin-midway/test/merchant-hotel.test.ts`

**Interfaces:**
- Consumes: `MerchantEntity`（`src/modules/merchant/entity/merchant.ts`：`userId`/`module`/`status`/`shopName`）、`HotelEntity`、`RoomTypeEntity`、`MerchantService.audit(id, pass, remark, adminId)`（base 已交付）。
- Produces:
  - `MerchantScopeService.requireMerchant(userId: number): Promise<MerchantEntity>`
  - `MerchantScopeService.requireOwnedHotel(merchantId: number, hotelId: number): Promise<HotelEntity>`
  - `MerchantScopeService.requireOwnedRoomType(merchantId: number, roomTypeId: number): Promise<RoomTypeEntity>`
  - `MerchantHotelService.hotelPage(merchantId: number, query: any): Promise<{ list: HotelEntity[]; total: number }>`
  - 控制器 `AppAccommodationMerchantController` 前缀 `/app/accommodation/merchant`，本节交付 `GET /hotel/page`
  - 测试夹具 `test/helper.ts` 新增 `APPLY_OK`、`registerMerchant(app, phone, module?)` → `{ token, userId, merchantId }`

- [ ] **Step 1: 在 `test/helper.ts` 末尾追加测试夹具（其它 Task 都依赖它）**

在 `cool-admin-midway/test/helper.ts` 的 `registerAndLogin` 之后追加（文件开头补 `import { MerchantService } from '../src/modules/merchant/service/merchant';`）：

```ts
/** 入驻申请固定材料（与 base merchant.apply 的必填校验一致） */
export const APPLY_OK = {
  shopName: '测试店铺',
  module: 'product',
  contactName: '张三',
  contactPhone: '13200132001',
  idCard: '522301199001010011',
  idCardFront: 'http://img/id-front.png',
  idCardBack: 'http://img/id-back.png',
  businessLicense: 'http://img/license.png',
};

/**
 * 注册会员 → 提交入驻申请 → 审核通过，返回 { token, userId, merchantId }。
 * module 传 'accommodation' 得到可管理民宿的商家；传 'product' 得到非住宿模块商家（P4 测试用）
 */
export async function registerMerchant(
  app,
  phone: string,
  module = 'accommodation'
) {
  const token = await registerAndLogin(app, phone);
  const me = await createHttpRequest(app)
    .get('/app/member/info/person')
    .set(auth(token));
  const userId = me.body.data.id;

  const apply = await createHttpRequest(app)
    .post('/app/merchant/apply')
    .set(auth(token))
    .send({ ...APPLY_OK, module, contactPhone: phone, shopName: `测试店铺${phone}` });
  expect(apply.body.code).toBe(1000);

  const progress = await createHttpRequest(app)
    .get('/app/merchant/application')
    .set(auth(token));
  const merchantService: MerchantService = await app
    .getApplicationContext()
    .getAsync(MerchantService);
  await merchantService.audit(progress.body.data.id, true, '材料齐全', 1);

  const my = await createHttpRequest(app)
    .get('/app/merchant/my')
    .set(auth(token));
  expect(my.body.code).toBe(1000);
  return { token, userId, merchantId: my.body.data.id as number };
}
```

- [ ] **Step 2: 写失败测试 `test/merchant-hotel.test.ts`**

```ts
import * as mysql from 'mysql2/promise';
import {
  auth,
  boot,
  close,
  createHttpRequest,
  registerAndLogin,
  registerMerchant,
} from './helper';

const DB = {
  host: '127.0.0.1',
  port: 3307,
  user: 'root',
  password: '123456',
  database: 'wudong_platform_test',
};

// 一个测试文件只 boot 一次应用（helper 约定），用例串行共享同一实例
describe('B 端民宿管理', () => {
  let app;
  let tokenA: string; // 商家 A（住宿模块）
  let merchantIdA: number;
  let tokenB: string; // 商家 B（住宿模块）
  let merchantIdB: number;
  let tokenC: string; // 普通会员（未入驻）

  beforeAll(async () => {
    app = await boot();
    ({ token: tokenA, merchantId: merchantIdA } = await registerMerchant(
      app,
      '13300133004',
      'accommodation'
    ));
    ({ token: tokenB, merchantId: merchantIdB } = await registerMerchant(
      app,
      '13300133005',
      'accommodation'
    ));
    tokenC = await registerAndLogin(app, '13300133006');
  });

  afterAll(async () => {
    await close(app);
  });

  it('未登录返回登录失效', async () => {
    const res = await createHttpRequest(app).get(
      '/app/accommodation/merchant/hotel/page'
    );
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('未入驻会员返回仅商家可访问', async () => {
    const res = await createHttpRequest(app)
      .get('/app/accommodation/merchant/hotel/page')
      .set(auth(tokenC));
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('仅商家可访问');
  });

  it('被禁用的商家返回仅商家可访问', async () => {
    const conn = await mysql.createConnection(DB);
    await conn.query('UPDATE merchant SET status = 0 WHERE id = ?', [
      merchantIdA,
    ]);
    const res = await createHttpRequest(app)
      .get('/app/accommodation/merchant/hotel/page')
      .set(auth(tokenA));
    await conn.query('UPDATE merchant SET status = 1 WHERE id = ?', [
      merchantIdA,
    ]);
    await conn.end();
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('仅商家可访问');
  });

  it('新商家民宿列表为空', async () => {
    const res = await createHttpRequest(app)
      .get('/app/accommodation/merchant/hotel/page')
      .set(auth(tokenA));
    expect(res.body.code).toBe(1000);
    expect(res.body.data.list).toEqual([]);
    expect(res.body.data.total).toBe(0);
  });
});
```

- [ ] **Step 3: 运行测试确认失败**

Run（在 `cool-admin-midway/`；**先停掉 8001 的 dev 进程**）：
`npx cross-env NODE_ENV=unittest jest test/merchant-hotel.test.ts --runInBand`
Expected: FAIL — `registerMerchant` 未定义 / `Expecting 1000, Received 404`（路由未注册）。

- [ ] **Step 4: 实现 `src/modules/accommodation/service/merchant-scope.ts`**

```ts
import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantEntity } from '../../merchant/entity/merchant';
import { HotelEntity } from '../entity/hotel';
import { RoomTypeEntity } from '../entity/room-type';

/**
 * B 端数据归属校验（P2/P3）
 * 所有 B 端住宿接口的第一步：先确认调用者是正常商家，再确认资源属于他。
 * “不存在”与“非本人”一律同一文案，避免被用来探测他人资源是否存在。
 */
@Provide()
export class MerchantScopeService extends BaseService {
  @InjectEntityModel(MerchantEntity)
  merchantEntity: Repository<MerchantEntity>;

  @InjectEntityModel(HotelEntity)
  hotelEntity: Repository<HotelEntity>;

  @InjectEntityModel(RoomTypeEntity)
  roomTypeEntity: Repository<RoomTypeEntity>;

  /** P2：必须是 status=1 的商家 */
  async requireMerchant(userId: number): Promise<MerchantEntity> {
    const merchant = await this.merchantEntity.findOneBy({ userId });
    if (!merchant || merchant.status !== 1) {
      throw new CoolCommException('仅商家可访问');
    }
    return merchant;
  }

  /** P3：民宿必须属于该商家 */
  async requireOwnedHotel(
    merchantId: number,
    hotelId: number
  ): Promise<HotelEntity> {
    const id = Number(hotelId);
    const hotel = id ? await this.hotelEntity.findOneBy({ id }) : null;
    if (!hotel || Number(hotel.merchantId) !== Number(merchantId)) {
      throw new CoolCommException('无权操作该资源');
    }
    return hotel;
  }

  /** P3：房型必须属于该商家的民宿 */
  async requireOwnedRoomType(
    merchantId: number,
    roomTypeId: number
  ): Promise<RoomTypeEntity> {
    const id = Number(roomTypeId);
    const roomType = id ? await this.roomTypeEntity.findOneBy({ id }) : null;
    if (!roomType) {
      throw new CoolCommException('无权操作该资源');
    }
    const hotel = await this.hotelEntity.findOneBy({ id: roomType.hotelId });
    if (!hotel || Number(hotel.merchantId) !== Number(merchantId)) {
      throw new CoolCommException('无权操作该资源');
    }
    return roomType;
  }
}
```

- [ ] **Step 5: 实现 `src/modules/accommodation/service/merchant-hotel.ts`（本节只 `page`）**

```ts
import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { HotelEntity } from '../entity/hotel';
import { MerchantScopeService } from './merchant-scope';

/** 商家自管民宿（P5 归属由登录身份决定；P6 有房型不可删） */
@Provide()
export class MerchantHotelService extends BaseService {
  @InjectEntityModel(HotelEntity)
  hotelEntity: Repository<HotelEntity>;

  @Inject()
  scopeService: MerchantScopeService;

  /** 我的民宿分页：name 模糊 + status 精确，按 id 倒序 */
  async hotelPage(
    merchantId: number,
    query: any
  ): Promise<{ list: HotelEntity[]; total: number }> {
    const page = Math.max(Number(query?.page) || 1, 1);
    const size = Math.min(Math.max(Number(query?.size) || 10, 1), 50);
    const qb = this.hotelEntity
      .createQueryBuilder('a')
      .where('a.merchantId = :merchantId', { merchantId });

    const status = query?.status;
    if (status !== undefined && status !== null && status !== '') {
      qb.andWhere('a.status = :status', { status: Number(status) });
    }
    const name = String(query?.name ?? '').trim();
    if (name) {
      qb.andWhere('a.name LIKE :name', { name: `%${name}%` });
    }
    qb.orderBy('a.id', 'DESC')
      .skip((page - 1) * size)
      .take(size);

    const [list, total] = await qb.getManyAndCount();
    return { list, total };
  }
}
```

- [ ] **Step 6: 实现 `src/modules/accommodation/controller/app/merchant.ts`（本节只 `hotelPage`）**

```ts
import { CoolController, BaseController } from '@cool-midway/core';
import { Get, Inject, Query } from '@midwayjs/core';
import { MerchantScopeService } from '../../service/merchant-scope';
import { MerchantHotelService } from '../../service/merchant-hotel';

/**
 * B 端民宿管理（需登录 + 商家身份 + 归属校验）
 * 前缀显式声明为 /app/accommodation/merchant，避免依赖目录推导
 */
@CoolController({ prefix: '/app/accommodation/merchant' })
export class AppAccommodationMerchantController extends BaseController {
  @Inject() ctx;

  @Inject()
  scopeService: MerchantScopeService;

  @Inject()
  merchantHotelService: MerchantHotelService;

  @Get('/hotel/page', { summary: '我的民宿分页' })
  async hotelPage(@Query() query) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(await this.merchantHotelService.hotelPage(merchant.id, query));
  }
}
```

- [ ] **Step 7: 运行测试确认通过**

Run: `npx cross-env NODE_ENV=unittest jest test/merchant-hotel.test.ts --runInBand`
Expected: PASS（4 个用例）。

- [ ] **Step 8: Commit**

```bash
cd cool-admin-midway
git add test/helper.ts test/merchant-hotel.test.ts \
  src/modules/accommodation/service/merchant-scope.ts \
  src/modules/accommodation/service/merchant-hotel.ts \
  src/modules/accommodation/controller/app/merchant.ts
git commit -m "feat(merchant): B 端住宿归属校验基座 + 我的民宿分页"
```

---

## Task 2: 民宿 增/查/改/删（P4/P5/P6）

**Files:**
- Modify: `cool-admin-midway/src/modules/accommodation/service/merchant-hotel.ts`
- Modify: `cool-admin-midway/src/modules/accommodation/controller/app/merchant.ts`
- Test: `cool-admin-midway/test/merchant-hotel.test.ts`（续写用例）

**Interfaces:**
- Consumes: Task 1 的 `MerchantScopeService.requireOwnedHotel`、`MerchantHotelService` 类。
- Produces:
  - `MerchantHotelService.hotelInfo(merchantId, id): Promise<HotelEntity>`
  - `MerchantHotelService.hotelAdd(merchantId, module, body): Promise<HotelEntity>`
  - `MerchantHotelService.hotelUpdate(merchantId, body): Promise<boolean>`
  - `MerchantHotelService.hotelRemove(merchantId, id): Promise<boolean>`
  - 路由 `GET /hotel/info?id=`、`POST /hotel/add`、`POST /hotel/update`、`POST /hotel/delete`

- [ ] **Step 1: 续写失败测试（追加到 `test/merchant-hotel.test.ts` 的最后一个 `it` 之后、`afterAll` 之前）**

先在 `describe` 顶部变量区追加：

```ts
  let tokenD: string; // 非住宿模块（product）商家
  let hotelIdA = 0;
```

并在 `beforeAll` 末尾追加一行：

```ts
    ({ token: tokenD } = await registerMerchant(app, '13300133007', 'product'));
```

再追加用例：

```ts
  it('新增民宿：归属当前商家，请求体 merchantId 被忽略（P5）', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenA))
      .send({
        name: '苗寨一号院',
        address: '雷山县乌东村一组',
        longitude: 108.107,
        latitude: 26.403,
        styleTags: ['苗寨', '江景'],
        facilityTags: ['WiFi'],
        intro: '推窗见梯田',
        merchantId: 99999,
      });
    expect(res.body.code).toBe(1000);
    hotelIdA = res.body.data.id;
    expect(Number(res.body.data.merchantId)).toBe(merchantIdA);
  });

  it('民宿必填字段缺失被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenA))
      .send({ address: '只有地址' });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('请填写完整的民宿信息');
  });

  it('非住宿模块商家无法新增民宿（P4）', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenD))
      .send({ name: '不该建的院', address: 'x', longitude: 1, latitude: 1 });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('您的入驻模块非住宿，无法新增民宿');
  });

  it('列表只含自己的民宿', async () => {
    const mine = await createHttpRequest(app)
      .get('/app/accommodation/merchant/hotel/page')
      .set(auth(tokenA));
    expect(mine.body.data.total).toBe(1);
    const other = await createHttpRequest(app)
      .get('/app/accommodation/merchant/hotel/page')
      .set(auth(tokenB));
    expect(other.body.data.total).toBe(0);
  });

  it('查看他人民宿被拒绝（P3）', async () => {
    const res = await createHttpRequest(app)
      .get(`/app/accommodation/merchant/hotel/info?id=${hotelIdA}`)
      .set(auth(tokenB));
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('无权操作该资源');
  });

  it('他人民宿不存在的 id 与无权同文案（不泄漏存在性）', async () => {
    const res = await createHttpRequest(app)
      .get('/app/accommodation/merchant/hotel/info?id=99999999')
      .set(auth(tokenB));
    expect(res.body.message).toBe('无权操作该资源');
  });

  it('更新他人民宿被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/update')
      .set(auth(tokenB))
      .send({ id: hotelIdA, name: '被篡改' });
    expect(res.body.message).toBe('无权操作该资源');
  });

  it('更新自己的民宿成功，且改不动归属（P5）', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/update')
      .set(auth(tokenA))
      .send({ id: hotelIdA, name: '苗寨一号院（改）', status: 0, merchantId: 88888 });
    expect(res.body.code).toBe(1000);

    const info = await createHttpRequest(app)
      .get(`/app/accommodation/merchant/hotel/info?id=${hotelIdA}`)
      .set(auth(tokenA));
    expect(info.body.data.name).toBe('苗寨一号院（改）');
    expect(info.body.data.status).toBe(0);
    expect(Number(info.body.data.merchantId)).toBe(merchantIdA);
  });

  it('标签不是数组被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/update')
      .set(auth(tokenA))
      .send({ id: hotelIdA, styleTags: '苗寨' });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('标签格式不正确');
  });

  it('标签元素不是字符串被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/update')
      .set(auth(tokenA))
      .send({ id: hotelIdA, images: [{ url: 'a.jpg' }] });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('标签格式不正确');
  });

  it('经纬度传空串被拒绝，且不落库（Number(\'\') 不是 0）', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenA))
      .send({
        name: '空坐标院',
        address: '雷山县',
        longitude: '',
        latitude: '',
      });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('民宿信息格式不正确');

    const list = await createHttpRequest(app)
      .get('/app/accommodation/merchant/hotel/page?page=1&size=50')
      .set(auth(tokenA));
    expect(
      list.body.data.list.some((h: any) => h.name === '空坐标院')
    ).toBe(false);
  });

  it('删除有房型的民宿被拒绝（P6）', async () => {
    const conn = await mysql.createConnection(DB);
    await conn.query(
      `INSERT INTO room_type
        (hotelId, name, bedType, maxGuests, price, stock, status, createTime, updateTime)
       VALUES (?, ?, ?, ?, ?, ?, 1, '2026-09-10 10:00:00', '2026-09-10 10:00:00')`,
      [hotelIdA, '大床房', '大床', 2, 380, 3]
    );

    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/delete')
      .set(auth(tokenA))
      .send({ id: hotelIdA });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('请先删除该民宿下的房型');

    await conn.query('DELETE FROM room_type WHERE hotelId = ?', [hotelIdA]);
    await conn.end();
  });

  it('删除自己的空民宿成功', async () => {
    const created = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenA))
      .send({ name: '临时院', address: '雷山县', longitude: 108, latitude: 26 });
    const id = created.body.data.id;

    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/delete')
      .set(auth(tokenA))
      .send({ id });
    expect(res.body.code).toBe(1000);

    const info = await createHttpRequest(app)
      .get(`/app/accommodation/merchant/hotel/info?id=${id}`)
      .set(auth(tokenA));
    expect(info.body.message).toBe('无权操作该资源');
  });
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx cross-env NODE_ENV=unittest jest test/merchant-hotel.test.ts --runInBand`
Expected: FAIL — `/hotel/add` 返回 404（路由未注册）、`merchantId` 断言失败。

- [ ] **Step 3: 给 `merchant-hotel.ts` 补 `info/add/update/remove` 与字段白名单**

在 `merchant-hotel.ts` 顶部（`import` 之后、`@Provide()` 之前）加：

```ts
/** 可写字段白名单：不含 merchantId，归属只认登录身份（P5） */
const HOTEL_FIELDS = [
  'name',
  'address',
  'longitude',
  'latitude',
  'styleTags',
  'facilityTags',
  'mainImage',
  'images',
  'intro',
  'checkInTime',
  'checkOutTime',
  'petPolicy',
  'hasBreakfast',
  'deposit',
  'status',
];
const NUMERIC_FIELDS = ['longitude', 'latitude', 'hasBreakfast', 'deposit', 'status'];
const JSON_FIELDS = ['styleTags', 'facilityTags', 'images'];
```

把 imports 补全为（新增 `CoolCommException`、`RoomTypeEntity`）：

```ts
import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { HotelEntity } from '../entity/hotel';
import { RoomTypeEntity } from '../entity/room-type';
import { MerchantScopeService } from './merchant-scope';
```

在类里追加房型仓储（`page` 之后）：

```ts
  @InjectEntityModel(RoomTypeEntity)
  roomTypeEntity: Repository<RoomTypeEntity>;

  /** 字段白名单过滤 + 类型归一：数字字段 Number()、数组字段校验后逐项 String()、字符串 trim */
  private pick(body: any): Partial<HotelEntity> {
    const out: any = {};
    for (const key of HOTEL_FIELDS) {
      const value = body?.[key];
      if (value === undefined || value === null) continue;
      if (NUMERIC_FIELDS.includes(key)) {
        // 空串/空数组是「没填」而不是 0：Number('') === 0 会让必填校验形同虚设
        if (value === '' || (Array.isArray(value) && value.length === 0)) {
          throw new CoolCommException('民宿信息格式不正确');
        }
        const num = Number(value);
        if (Number.isNaN(num)) {
          throw new CoolCommException('民宿信息格式不正确');
        }
        out[key] = num;
      } else if (JSON_FIELDS.includes(key)) {
        // 元素必须是字符串：String({url:'a.jpg'}) 会静默存成 '[object Object]'
        if (
          !Array.isArray(value) ||
          value.some((v: unknown) => typeof v !== 'string' || !v.trim())
        ) {
          throw new CoolCommException('标签格式不正确');
        }
        out[key] = value.map((v: string) => v.trim());
      } else {
        out[key] = typeof value === 'string' ? value.trim() : value;
      }
    }
    return out;
  }

  /** 民宿详情（仅本人） */
  async hotelInfo(merchantId: number, id: number): Promise<HotelEntity> {
    return this.scopeService.requireOwnedHotel(merchantId, id);
  }

  /** 新增民宿：P4 模块校验 + P5 归属回写；rating/reviewCount/deposit/status 由实体默认值给出 */
  async hotelAdd(merchantId: number, module: string, body: any): Promise<HotelEntity> {
    if (module !== 'accommodation') {
      throw new CoolCommException('您的入驻模块非住宿，无法新增民宿');
    }
    const data = this.pick(body);
    if (
      !data.name ||
      !data.address ||
      data.longitude === undefined ||
      data.latitude === undefined
    ) {
      throw new CoolCommException('请填写完整的民宿信息');
    }
    const hotel = new HotelEntity();
    Object.assign(hotel, data);
    hotel.merchantId = merchantId;
    await this.hotelEntity.save(hotel);
    return hotel;
  }

  /** 更新民宿：归属不可改（merchantId 不在白名单） */
  async hotelUpdate(merchantId: number, body: any): Promise<boolean> {
    const hotel = await this.scopeService.requireOwnedHotel(merchantId, body?.id);
    Object.assign(hotel, this.pick(body));
    await this.hotelEntity.save(hotel);
    return true;
  }

  /** 删除民宿：P6 有房型时拒绝 */
  async hotelRemove(merchantId: number, id: number): Promise<boolean> {
    const hotel = await this.scopeService.requireOwnedHotel(merchantId, id);
    const roomCount = await this.roomTypeEntity.countBy({ hotelId: hotel.id });
    if (roomCount > 0) {
      throw new CoolCommException('请先删除该民宿下的房型');
    }
    await this.hotelEntity.delete({ id: hotel.id });
    return true;
  }
```

- [ ] **Step 4: 在控制器里补四条路由**

在 `controller/app/merchant.ts` 的 imports 里把 `Get` 改为 `Body, Get, Inject, Post, Query`，然后在
`hotelPage` 之后追加：

```ts
  @Get('/hotel/info', { summary: '民宿详情' })
  async hotelInfo(@Query('id') id: number) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(await this.merchantHotelService.hotelInfo(merchant.id, Number(id)));
  }

  @Post('/hotel/add', { summary: '新增民宿' })
  async hotelAdd(@Body() body) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(
      await this.merchantHotelService.hotelAdd(merchant.id, merchant.module, body)
    );
  }

  @Post('/hotel/update', { summary: '更新民宿' })
  async hotelUpdate(@Body() body) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(await this.merchantHotelService.hotelUpdate(merchant.id, body));
  }

  @Post('/hotel/delete', { summary: '删除民宿' })
  async hotelDelete(@Body('id') id: number) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(await this.merchantHotelService.hotelRemove(merchant.id, Number(id)));
  }
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npx cross-env NODE_ENV=unittest jest test/merchant-hotel.test.ts --runInBand`
Expected: PASS（14 个用例）。

- [ ] **Step 6: Commit**

```bash
cd cool-admin-midway
git add test/merchant-hotel.test.ts \
  src/modules/accommodation/service/merchant-hotel.ts \
  src/modules/accommodation/controller/app/merchant.ts
git commit -m "feat(merchant): 商家民宿增查改删（模块/归属/删除守卫）"
```

---

## Task 3: 房型 增/查/改/删（P7 级联清房态）

**Files:**
- Create: `cool-admin-midway/src/modules/accommodation/service/merchant-field.ts`
- Create: `cool-admin-midway/src/modules/accommodation/service/merchant-room-type.ts`
- Modify: `cool-admin-midway/src/modules/accommodation/service/merchant-hotel.ts`（`pick()` 改为调用共用 `pickFields`，签名与行为不变）
- Modify: `cool-admin-midway/src/modules/accommodation/controller/app/merchant.ts`
- Test: `cool-admin-midway/test/merchant-room-type.test.ts`
- 回归（不新增用例）：`cool-admin-midway/test/merchant-hotel.test.ts` 必须**一并跑绿** —— `merchant-hotel.ts` 的 `pick()` 本 Task 被改为委托给共用 `pickFields`，T2 已通过的 `民宿信息格式不正确`/`标签格式不正确`/`经纬度空串` 用例就是这次抽取的回归网。

**Interfaces:**
- Consumes: `MerchantScopeService.requireOwnedHotel / requireOwnedRoomType`（Task 1）、`RoomCalendarEntity`。
- Produces: `pickFields(body, spec)`（`service/merchant-field.ts`）——民宿与房型两个服务共用同一个白名单归一实现，避免 T2 已修好的校验被复制后各自漂移。
- Produces:
  - `MerchantRoomTypeService.roomTypePage(merchantId, query): Promise<{ list: RoomTypeEntity[]; total: number }>`
  - `MerchantRoomTypeService.roomTypeAdd(merchantId, body): Promise<RoomTypeEntity>`
  - `MerchantRoomTypeService.roomTypeUpdate(merchantId, body): Promise<boolean>`
  - `MerchantRoomTypeService.roomTypeRemove(merchantId, id): Promise<boolean>`
  - 路由 `GET /room-type/page?hotelId=`、`POST /room-type/add|update|delete`

- [ ] **Step 1: 写失败测试 `test/merchant-room-type.test.ts`**

```ts
import * as mysql from 'mysql2/promise';
import { auth, boot, close, createHttpRequest, registerMerchant } from './helper';

const DB = {
  host: '127.0.0.1',
  port: 3307,
  user: 'root',
  password: '123456',
  database: 'wudong_platform_test',
};

describe('B 端房型管理', () => {
  let app;
  let tokenA: string;
  let merchantIdA: number;
  let tokenB: string;
  let hotelA = 0;
  let hotelB = 0;
  let roomTypeA = 0;

  beforeAll(async () => {
    app = await boot();
    ({ token: tokenA, merchantId: merchantIdA } = await registerMerchant(
      app,
      '13300133101',
      'accommodation'
    ));
    ({ token: tokenB } = await registerMerchant(app, '13300133102', 'accommodation'));

    const a = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenA))
      .send({ name: 'A 家院子', address: '雷山县一组', longitude: 108.1, latitude: 26.4 });
    hotelA = a.body.data.id;
    const b = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenB))
      .send({ name: 'B 家院子', address: '雷山县二组', longitude: 108.2, latitude: 26.5 });
    hotelB = b.body.data.id;
  });

  afterAll(async () => {
    await close(app);
  });

  it('缺少 hotelId 被拒绝', async () => {
    const res = await createHttpRequest(app)
      .get('/app/accommodation/merchant/room-type/page')
      .set(auth(tokenA));
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('请指定民宿');
  });

  it('未登录返回登录失效', async () => {
    const res = await createHttpRequest(app).post(
      '/app/accommodation/merchant/room-type/add'
    );
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('给他人民宿加房型被拒绝（P3）', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/add')
      .set(auth(tokenB))
      .send({ hotelId: hotelA, name: '偷加房型', price: 380, stock: 1 });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('无权操作该资源');
  });

  it('新增房型成功且归属该民宿', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/add')
      .set(auth(tokenA))
      .send({
        hotelId: hotelA,
        name: '苗寨大床房',
        bedType: '大床',
        maxGuests: 2,
        price: 380,
        stock: 3,
        facilities: ['WiFi', '空调'],
      });
    expect(res.body.code).toBe(1000);
    roomTypeA = res.body.data.id;
    expect(Number(res.body.data.hotelId)).toBe(hotelA);
  });

  it('房型必填字段缺失被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/add')
      .set(auth(tokenA))
      .send({ hotelId: hotelA, name: '没有价格' });
    expect(res.body.message).toBe('请填写完整的房型信息');
  });

  it('价格必须大于 0', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/add')
      .set(auth(tokenA))
      .send({ hotelId: hotelA, name: '免费房', price: 0, stock: 1 });
    expect(res.body.message).toBe('房型价格必须大于 0');
  });

  it('房间数量至少为 1', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/add')
      .set(auth(tokenA))
      .send({ hotelId: hotelA, name: '零间房', price: 100, stock: 0 });
    expect(res.body.message).toBe('房间数量至少为 1');
  });

  it('价格传空串被拒绝（Number(\'\') 不是 0）', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/add')
      .set(auth(tokenA))
      .send({ hotelId: hotelA, name: '空价房', price: '', stock: 1 });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('房型信息格式不正确');

    const list = await createHttpRequest(app)
      .get(`/app/accommodation/merchant/room-type/page?hotelId=${hotelA}`)
      .set(auth(tokenA));
    expect(list.body.data.list.some((r: any) => r.name === '空价房')).toBe(false);
  });

  it('设施标签元素不是字符串被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/update')
      .set(auth(tokenA))
      .send({ id: roomTypeA, facilities: [{ name: 'WiFi' }] });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('标签格式不正确');
  });

  it('房型列表只含本民宿', async () => {
    const mine = await createHttpRequest(app)
      .get(`/app/accommodation/merchant/room-type/page?hotelId=${hotelA}`)
      .set(auth(tokenA));
    expect(mine.body.data.total).toBe(1);
    expect(mine.body.data.list[0].name).toBe('苗寨大床房');
  });

  it('查他人民宿房型列表被拒绝', async () => {
    const res = await createHttpRequest(app)
      .get(`/app/accommodation/merchant/room-type/page?hotelId=${hotelA}`)
      .set(auth(tokenB));
    expect(res.body.message).toBe('无权操作该资源');
  });

  it('更新他人房型被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/update')
      .set(auth(tokenB))
      .send({ id: roomTypeA, price: 1 });
    expect(res.body.message).toBe('无权操作该资源');
  });

  it('更新自己的房型成功，且不能改挂到别人民宿', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/update')
      .set(auth(tokenA))
      .send({ id: roomTypeA, price: 420, stock: 5, hotelId: hotelB, status: 0 });
    expect(res.body.code).toBe(1000);

    const list = await createHttpRequest(app)
      .get(`/app/accommodation/merchant/room-type/page?hotelId=${hotelA}`)
      .set(auth(tokenA));
    const row = list.body.data.list[0];
    expect(Number(row.price)).toBe(420);
    expect(row.stock).toBe(5);
    expect(row.status).toBe(0);
    expect(Number(row.hotelId)).toBe(hotelA);
  });

  it('删除房型级联清理房态（P7）', async () => {
    const conn = await mysql.createConnection(DB);
    await conn.query(
      `INSERT INTO room_calendar
        (roomTypeId, date, availableStock, price, status, createTime, updateTime)
       VALUES (?, '2026-10-01', 2, 420, 1, '2026-09-10 10:00:00', '2026-09-10 10:00:00')`,
      [roomTypeA]
    );
    const before: any = await conn.query(
      'SELECT COUNT(*) AS c FROM room_calendar WHERE roomTypeId = ?',
      [roomTypeA]
    );
    expect(Number(before[0][0].c)).toBe(1);

    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/delete')
      .set(auth(tokenA))
      .send({ id: roomTypeA });
    expect(res.body.code).toBe(1000);

    const after: any = await conn.query(
      'SELECT COUNT(*) AS c FROM room_calendar WHERE roomTypeId = ?',
      [roomTypeA]
    );
    await conn.end();
    expect(Number(after[0][0].c)).toBe(0);

    const list = await createHttpRequest(app)
      .get(`/app/accommodation/merchant/room-type/page?hotelId=${hotelA}`)
      .set(auth(tokenA));
    expect(list.body.data.total).toBe(0);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx cross-env NODE_ENV=unittest jest test/merchant-room-type.test.ts --runInBand`
Expected: FAIL — `/room-type/page` 404。

- [ ] **Step 3: 抽出共用归一 `service/merchant-field.ts`，并实现 `service/merchant-room-type.ts`**

**3a. 创建 `src/modules/accommodation/service/merchant-field.ts`**（民宿与房型共用一份归一逻辑，
避免两处 `pick()` 各写一遍后校验语义漂移——T2 的 review 正是在这份代码上抓到两个「静默把坏输入变合法」的洞）：

```ts
import { CoolCommException } from '@cool-midway/core';

/** 一份白名单字段表的归一规则 */
export interface FieldSpec {
  /** 可写字段白名单；不在表里的键（id、归属字段、实体默认字段）一律丢弃 */
  fields: string[];
  /** 需要转成 number 的字段 */
  numeric: string[];
  /** 需要是「非空字符串数组」的字段 */
  json: string[];
  /** 数字字段值为空或无法解析时抛出的文案 */
  numberError: string;
}

/**
 * 字段白名单过滤 + 类型归一（B 端商家服务共用）。
 * - 空串/空数组视为「没填」而不是 0：Number('') === 0 会让必填校验形同虚设
 * - 数组元素必须是字符串：String({url:'a.jpg'}) 会静默存成 '[object Object]'
 */
export function pickFields(body: any, spec: FieldSpec): Record<string, any> {
  const out: Record<string, any> = {};
  for (const key of spec.fields) {
    const value = body?.[key];
    if (value === undefined || value === null) continue;
    if (spec.numeric.includes(key)) {
      if (value === '' || (Array.isArray(value) && value.length === 0)) {
        throw new CoolCommException(spec.numberError);
      }
      const num = Number(value);
      if (Number.isNaN(num)) {
        throw new CoolCommException(spec.numberError);
      }
      out[key] = num;
    } else if (spec.json.includes(key)) {
      if (
        !Array.isArray(value) ||
        value.some((v: unknown) => typeof v !== 'string' || !v.trim())
      ) {
        throw new CoolCommException('标签格式不正确');
      }
      out[key] = value.map((v: string) => v.trim());
    } else {
      out[key] = typeof value === 'string' ? value.trim() : value;
    }
  }
  return out;
}
```

**3b. 改 `service/merchant-hotel.ts`**：删掉私有 `pick()` 的实现，改为调用共用函数（对外签名与行为不变）：

```ts
  /** 字段白名单过滤 + 类型归一 */
  private pick(body: any): Partial<HotelEntity> {
    return pickFields(body, {
      fields: HOTEL_FIELDS,
      numeric: NUMERIC_FIELDS,
      json: JSON_FIELDS,
      numberError: '民宿信息格式不正确',
    });
  }
```

并在该文件顶部 import 里加 `import { pickFields } from './merchant-field';`。
（`HOTEL_FIELDS`/`NUMERIC_FIELDS`/`JSON_FIELDS` 三个常量原样保留。）

**3c. 创建 `src/modules/accommodation/service/merchant-room-type.ts`**：

```ts
import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { RoomTypeEntity } from '../entity/room-type';
import { RoomCalendarEntity } from '../entity/room-calendar';
import { MerchantScopeService } from './merchant-scope';
import { pickFields } from './merchant-field';

/** 可写字段白名单：不含 hotelId，房型不能改挂到别的人民宿 */
const ROOM_FIELDS = [
  'name',
  'bedType',
  'area',
  'maxGuests',
  'facilities',
  'price',
  'stock',
  'images',
  'status',
];
const NUMERIC_FIELDS = ['area', 'maxGuests', 'price', 'stock', 'status'];
const JSON_FIELDS = ['facilities', 'images'];

/** 商家自管房型（P7 删房型级联清房态） */
@Provide()
export class MerchantRoomTypeService extends BaseService {
  @InjectEntityModel(RoomTypeEntity)
  roomTypeEntity: Repository<RoomTypeEntity>;

  @InjectEntityModel(RoomCalendarEntity)
  roomCalendarEntity: Repository<RoomCalendarEntity>;

  @Inject()
  scopeService: MerchantScopeService;

  /** 字段白名单过滤 + 类型归一（与民宿共用 `pickFields`） */
  private pick(body: any): Partial<RoomTypeEntity> {
    return pickFields(body, {
      fields: ROOM_FIELDS,
      numeric: NUMERIC_FIELDS,
      json: JSON_FIELDS,
      numberError: '房型信息格式不正确',
    });
  }

  /** 某民宿的房型分页（必须先确认民宿归属） */
  async roomTypePage(
    merchantId: number,
    query: any
  ): Promise<{ list: RoomTypeEntity[]; total: number }> {
    if (!query?.hotelId) {
      throw new CoolCommException('请指定民宿');
    }
    const hotel = await this.scopeService.requireOwnedHotel(
      merchantId,
      query.hotelId
    );

    const page = Math.max(Number(query?.page) || 1, 1);
    const size = Math.min(Math.max(Number(query?.size) || 20, 1), 50);
    const qb = this.roomTypeEntity
      .createQueryBuilder('a')
      .where('a.hotelId = :hotelId', { hotelId: hotel.id });

    const status = query?.status;
    if (status !== undefined && status !== null && status !== '') {
      qb.andWhere('a.status = :status', { status: Number(status) });
    }
    const name = String(query?.name ?? '').trim();
    if (name) {
      qb.andWhere('a.name LIKE :name', { name: `%${name}%` });
    }
    qb.orderBy('a.id', 'ASC')
      .skip((page - 1) * size)
      .take(size);

    const [list, total] = await qb.getManyAndCount();
    return { list, total };
  }

  /** 新增房型 */
  async roomTypeAdd(merchantId: number, body: any): Promise<RoomTypeEntity> {
    const hotel = await this.scopeService.requireOwnedHotel(
      merchantId,
      body?.hotelId
    );
    const data = this.pick(body);
    if (!data.name || data.price === undefined) {
      throw new CoolCommException('请填写完整的房型信息');
    }
    if (Number(data.price) <= 0) {
      throw new CoolCommException('房型价格必须大于 0');
    }
    if (data.stock !== undefined && Number(data.stock) < 1) {
      throw new CoolCommException('房间数量至少为 1');
    }
    const roomType = new RoomTypeEntity();
    Object.assign(roomType, data);
    roomType.hotelId = hotel.id;
    await this.roomTypeEntity.save(roomType);
    return roomType;
  }

  /** 更新房型 */
  async roomTypeUpdate(merchantId: number, body: any): Promise<boolean> {
    const roomType = await this.scopeService.requireOwnedRoomType(
      merchantId,
      body?.id
    );
    Object.assign(roomType, this.pick(body));
    if (Number(roomType.price) <= 0) {
      throw new CoolCommException('房型价格必须大于 0');
    }
    if (Number(roomType.stock) < 1) {
      throw new CoolCommException('房间数量至少为 1');
    }
    await this.roomTypeEntity.save(roomType);
    return true;
  }

  /** 删除房型：P7 先清该房型的房态记录（二者无外键，需显式级联） */
  async roomTypeRemove(merchantId: number, id: number): Promise<boolean> {
    const roomType = await this.scopeService.requireOwnedRoomType(
      merchantId,
      id
    );
    await this.roomCalendarEntity.delete({ roomTypeId: roomType.id });
    await this.roomTypeEntity.delete({ id: roomType.id });
    return true;
  }
}
```

- [ ] **Step 4: 在控制器里补四条房型路由**

`controller/app/merchant.ts` 追加 import：

```ts
import { MerchantRoomTypeService } from '../../service/merchant-room-type';
```

类内追加注入与方法：

```ts
  @Inject()
  merchantRoomTypeService: MerchantRoomTypeService;

  @Get('/room-type/page', { summary: '某民宿的房型分页' })
  async roomTypePage(@Query() query) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(
      await this.merchantRoomTypeService.roomTypePage(merchant.id, query)
    );
  }

  @Post('/room-type/add', { summary: '新增房型' })
  async roomTypeAdd(@Body() body) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(await this.merchantRoomTypeService.roomTypeAdd(merchant.id, body));
  }

  @Post('/room-type/update', { summary: '更新房型' })
  async roomTypeUpdate(@Body() body) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(await this.merchantRoomTypeService.roomTypeUpdate(merchant.id, body));
  }

  @Post('/room-type/delete', { summary: '删除房型' })
  async roomTypeDelete(@Body('id') id: number) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(
      await this.merchantRoomTypeService.roomTypeRemove(merchant.id, Number(id))
    );
  }
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npx cross-env NODE_ENV=unittest jest test/merchant-room-type.test.ts test/merchant-hotel.test.ts --runInBand`
（两个套件必须在同一次 jest 调用里一起跑：`merchant-hotel.ts` 的 `pick()` 本 Task 被改成委托，
它的 17 个用例就是这次抽取的回归网。两个套件的手机号段不同——101/102 与 04-07——同一库可共存。）
Expected: PASS（房型 14 个用例 + 民宿 17 个用例）。

- [ ] **Step 6: Commit**

```bash
cd cool-admin-midway
git add test/merchant-room-type.test.ts \
  src/modules/accommodation/service/merchant-field.ts \
  src/modules/accommodation/service/merchant-room-type.ts \
  src/modules/accommodation/service/merchant-hotel.ts \
  src/modules/accommodation/controller/app/merchant.ts
git commit -m "feat(merchant): 商家房型管理（共用归一 + 价/库存校验 + 删房型级联清房态）"
```

---

## Task 4: 房态日历（批量设价/关房 + 区间查询）

**Files:**
- Create: `cool-admin-midway/src/modules/accommodation/service/merchant-calendar.ts`
- Modify: `cool-admin-midway/src/modules/accommodation/controller/app/merchant.ts`
- Test: `cool-admin-midway/test/merchant-calendar.test.ts`

**Interfaces:**
- Consumes: `RoomCalendarService.range(roomTypeId, startDate, endDate)` 与 `.batch(param)`（**已存在**：`src/modules/accommodation/service/room-calendar.ts`，含“无记录日期回退房型基础价/库存”与 `availableStock` 截断到房型 stock 的语义）；`MerchantScopeService.requireOwnedRoomType`。
- Produces:
  - `MerchantCalendarService.range(merchantId, roomTypeId, startDate, endDate)`
  - `MerchantCalendarService.batch(merchantId, body): Promise<{ count: number }>`
  - 路由 `GET /calendar/range?roomTypeId&startDate&endDate`、`POST /calendar/batch`

- [ ] **Step 1: 写失败测试 `test/merchant-calendar.test.ts`**

```ts
import { auth, boot, close, createHttpRequest, registerMerchant } from './helper';

const FMT = (d: Date) => d.toISOString().slice(0, 10);

describe('B 端房态日历', () => {
  let app;
  let tokenA: string;
  let tokenB: string;
  let hotelA = 0;
  let roomTypeA = 0;
  let roomTypeB = 0;

  const START = '2026-10-01';
  const END = '2026-10-07';

  beforeAll(async () => {
    app = await boot();
    ({ token: tokenA } = await registerMerchant(app, '13300133201', 'accommodation'));
    ({ token: tokenB } = await registerMerchant(app, '13300133202', 'accommodation'));

    const hotel = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenA))
      .send({ name: '日历测试院', address: '雷山县三组', longitude: 108.3, latitude: 26.6 });
    hotelA = hotel.body.data.id;

    const roomType = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/add')
      .set(auth(tokenA))
      .send({ hotelId: hotelA, name: '大床房', price: 400, stock: 3 });
    roomTypeA = roomType.body.data.id;

    const hotelB = await createHttpRequest(app)
      .post('/app/accommodation/merchant/hotel/add')
      .set(auth(tokenB))
      .send({ name: '别人家院子', address: '雷山县四组', longitude: 108.4, latitude: 26.7 });
    const roomTypeOther = await createHttpRequest(app)
      .post('/app/accommodation/merchant/room-type/add')
      .set(auth(tokenB))
      .send({ hotelId: hotelB.body.data.id, name: '别家大床房', price: 500, stock: 2 });
    roomTypeB = roomTypeOther.body.data.id;
  });

  afterAll(async () => {
    await close(app);
  });

  it('未登录返回登录失效', async () => {
    const res = await createHttpRequest(app).get(
      `/app/accommodation/merchant/calendar/range?roomTypeId=${roomTypeA}&startDate=${START}&endDate=${END}`
    );
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('操作他人房型的房态被拒绝（P3）', async () => {
    const res = await createHttpRequest(app)
      .get(
        `/app/accommodation/merchant/calendar/range?roomTypeId=${roomTypeB}&startDate=${START}&endDate=${END}`
      )
      .set(auth(tokenA));
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('无权操作该资源');
  });

  it('批量设置价格与库存', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/calendar/batch')
      .set(auth(tokenA))
      .send({
        roomTypeId: roomTypeA,
        startDate: START,
        endDate: END,
        price: 480,
        availableStock: 5,
      });
    expect(res.body.code).toBe(1000);
    expect(res.body.data.count).toBe(7);
  });

  it('区间查询读回设置值，超出房型库存被截断', async () => {
    const res = await createHttpRequest(app)
      .get(
        `/app/accommodation/merchant/calendar/range?roomTypeId=${roomTypeA}&startDate=${START}&endDate=${END}`
      )
      .set(auth(tokenA));
    expect(res.body.code).toBe(1000);
    expect(res.body.data.length).toBe(7);
    expect(Number(res.body.data[0].price)).toBe(480);
    expect(res.body.data[0].availableStock).toBe(3); // 房型 stock=3
    expect(res.body.data[0].status).toBe(1);
  });

  it('无记录日期回退房型默认值', async () => {
    const res = await createHttpRequest(app)
      .get(
        `/app/accommodation/merchant/calendar/range?roomTypeId=${roomTypeA}&startDate=2026-11-01&endDate=2026-11-03`
      )
      .set(auth(tokenA));
    expect(res.body.data.length).toBe(3);
    expect(Number(res.body.data[0].price)).toBe(400); // 房型基础价
    expect(res.body.data[0].availableStock).toBe(3);
  });

  it('关房后该日不可订', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/calendar/batch')
      .set(auth(tokenA))
      .send({
        roomTypeId: roomTypeA,
        startDate: '2026-10-03',
        endDate: '2026-10-03',
        closed: true,
      });
    expect(res.body.data.count).toBe(1);

    const range = await createHttpRequest(app)
      .get(
        `/app/accommodation/merchant/calendar/range?roomTypeId=${roomTypeA}&startDate=${START}&endDate=${END}`
      )
      .set(auth(tokenA));
    const day = range.body.data.find((r: any) => r.date === '2026-10-03');
    expect(day.status).toBe(0);
  });

  it('按星期批量设置只落在指定星期', async () => {
    // 2026-10-01 是周四(4)、10-02 周五(5)…；只设周五
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/calendar/batch')
      .set(auth(tokenA))
      .send({
        roomTypeId: roomTypeA,
        startDate: START,
        endDate: END,
        weekDays: [5],
        price: 999,
      });
    expect(res.body.data.count).toBe(1); // 区间内只有 10-02 是周五

    const range = await createHttpRequest(app)
      .get(
        `/app/accommodation/merchant/calendar/range?roomTypeId=${roomTypeA}&startDate=${START}&endDate=${END}`
      )
      .set(auth(tokenA));
    const friday = range.body.data.find((r: any) => r.date === '2026-10-02');
    expect(Number(friday.price)).toBe(999);
  });

  it('超过 32 天被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/calendar/batch')
      .set(auth(tokenA))
      .send({ roomTypeId: roomTypeA, startDate: '2026-12-01', endDate: '2027-01-05', price: 100 });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('日期区间最多32天');
    expect(FMT(new Date())).toBeTruthy(); // 常量占位，保持 FMT 被使用
  });

  it('日期区间无效被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/accommodation/merchant/calendar/batch')
      .set(auth(tokenA))
      .send({ roomTypeId: roomTypeA, startDate: '2026-10-05', endDate: '2026-10-01', price: 100 });
    expect(res.body.message).toBe('日期区间无效');
  });
});
```

> 注：`FMT` 仅用于避免未使用变量告警，如 lint 允许可删掉该 const 与最后一行断言。

- [ ] **Step 2: 运行测试确认失败**

Run: `npx cross-env NODE_ENV=unittest jest test/merchant-calendar.test.ts --runInBand`
Expected: FAIL — `/calendar/range` 404。

- [ ] **Step 3: 实现 `src/modules/accommodation/service/merchant-calendar.ts`**

```ts
import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import * as moment from 'moment';
import { RoomCalendarService } from './room-calendar';
import { MerchantScopeService } from './merchant-scope';

const FMT = 'YYYY-MM-DD';
// 与 C 端一致：单次窗口上限（含首尾）32 天
const MAX_DAYS = 32;

/**
 * 商家自管房态：只做归属校验 + 窗口校验，具体读写复用 RoomCalendarService
 * （默认回退、库存截断等语义单一来源，避免两套实现漂移）
 */
@Provide()
export class MerchantCalendarService extends BaseService {
  @Inject()
  roomCalendarService: RoomCalendarService;

  @Inject()
  scopeService: MerchantScopeService;

  /** 区间合法性：格式、先后、上限 */
  private assertPeriod(startDate: string, endDate: string) {
    const start = moment(startDate, FMT, true);
    const end = moment(endDate, FMT, true);
    if (!start.isValid() || !end.isValid() || start.isAfter(end)) {
      throw new CoolCommException('日期区间无效');
    }
    if (end.diff(start, 'days') + 1 > MAX_DAYS) {
      throw new CoolCommException('日期区间最多32天');
    }
  }

  /** 房态区间查询（含回退默认） */
  async range(
    merchantId: number,
    roomTypeId: number,
    startDate: string,
    endDate: string
  ) {
    const roomType = await this.scopeService.requireOwnedRoomType(
      merchantId,
      roomTypeId
    );
    this.assertPeriod(startDate, endDate);
    return this.roomCalendarService.range(
      roomType.id,
      startDate,
      endDate
    );
  }

  /** 批量设置房态：价格/库存/关房，可限定星期几 */
  async batch(merchantId: number, body: any): Promise<{ count: number }> {
    const roomType = await this.scopeService.requireOwnedRoomType(
      merchantId,
      body?.roomTypeId
    );
    this.assertPeriod(body?.startDate, body?.endDate);
    if (body?.closed !== true && body?.price == null && body?.availableStock == null) {
      throw new CoolCommException('请至少填写价格或可售间数');
    }
    if (body?.price != null && Number(body.price) <= 0) {
      throw new CoolCommException('房型价格必须大于 0');
    }
    return this.roomCalendarService.batch({
      roomTypeId: roomType.id,
      startDate: body.startDate,
      endDate: body.endDate,
      weekDays: body.weekDays,
      price: body.price == null ? undefined : Number(body.price),
      availableStock:
        body.availableStock == null ? undefined : Number(body.availableStock),
      closed: body.closed === true,
    });
  }
}
```

- [ ] **Step 4: 在控制器里补两条房态路由**

`controller/app/merchant.ts` 追加 import：

```ts
import { MerchantCalendarService } from '../../service/merchant-calendar';
```

类内追加注入与方法：

```ts
  @Inject()
  merchantCalendarService: MerchantCalendarService;

  @Get('/calendar/range', { summary: '房态区间查询' })
  async calendarRange(
    @Query('roomTypeId') roomTypeId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(
      await this.merchantCalendarService.range(
        merchant.id,
        Number(roomTypeId),
        startDate,
        endDate
      )
    );
  }

  @Post('/calendar/batch', { summary: '批量设置房态' })
  async calendarBatch(@Body() body) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(
      await this.merchantCalendarService.batch(merchant.id, body)
    );
  }
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npx cross-env NODE_ENV=unittest jest test/merchant-calendar.test.ts --runInBand`
Expected: PASS（9 个用例）。

- [ ] **Step 6: 手工冒烟（可选但推荐）**

停掉 jest 后启动 `npm run dev`，用浏览器/curl 走一遍：先 `POST /app/member/login/password` 拿 token（本地 `smsCode` 接口会直接回验证码），再
`GET /app/accommodation/merchant/hotel/page`，确认 HTTP 200 + `code:1000`。

- [ ] **Step 7: Commit**

```bash
cd cool-admin-midway
git add test/merchant-calendar.test.ts \
  src/modules/accommodation/service/merchant-calendar.ts \
  src/modules/accommodation/controller/app/merchant.ts
git commit -m "feat(merchant): 商家房态日历（批量设价/关房 + 32 天窗口）"
```

---

## Task 5: operate 管理端关键字搜索字段名的回归守卫（**无生产代码改动**）

**背景（已修正，见 spec §10.2b）：** spec 原文声称 `operate/controller/admin/{banner,announcement}.ts` 的 `pageQueryOp`
把 `keyWordLikeFields`（大写 W）误写成 `keywordLikeFields`（小写 w）。**执行前核对发现该缺陷并不存在**：
两个控制器第 9 行本已是正确写法，`git log -S keywordLikeFields --all` 也证明小写形式从未出现在本仓库代码里
（唯一命中是 spec/plan 自己的描述文字）。因此**不要修改任何生产文件**。

保留本 Task 的理由是机制值得守卫：cool 在
`node_modules/@cool-midway/core/dist/service/mysql.js:366-368` 直接读 `option.keyWordLikeFields` 去拼
`orWhere(... like :keyWord)`（`dist/rest/eps.js:55` 读同一属性），而 `pageQueryOp` 是无类型校验的普通对象字面量——
写成小写 w **不会**被任何编译或运行时报错拦住，只会让管理端关键字搜索静默失效。本 Task 把这个属性名钉进测试，
防止后续（本组或其它组）改动时无声退化。

因为代码本来就是对的，本 Task **拿不到 RED**——这是诚实的「特性固化/回归守卫」测试，不是 TDD 的新功能测试。
不要为了凑 RED 去先改坏生产代码。

**Files:**
- Test: `cool-admin-midway/test/operate-admin.test.ts`（追加 1 个用例）

**Interfaces:**
- Consumes: `@midwayjs/core` 的 `getClassMetadata` / `CONTROLLER_KEY`（该测试文件已在用）；cool 的 `saveClassMetadata(CONTROLLER_KEY, { prefix, routerOptions, curdOption, module })` 会把**原始 curdOption**整体存进元数据，因此可以直接断言 `pageQueryOp`。
- Produces: 无新接口。

- [ ] **Step 1: 追加速守卫断言到 `test/operate-admin.test.ts`**

在文件顶部 import 之后、`describe` 之前加：

```ts
/** cool 的分页关键字字段配置属性名是 keyWordLikeFields（大写 W）；写错会静默失效 */
const keyWordFieldsOf = (controller: any): string[] | undefined =>
  getClassMetadata(CONTROLLER_KEY, controller)?.curdOption?.pageQueryOp
    ?.keyWordLikeFields;
```

在 `describe` 里追加用例：

```ts
  it('banner/announcement 的 pageQueryOp 使用正确的 keyWordLikeFields 属性名', async () => {
    expect(keyWordFieldsOf(AdminOperateBannerController)).toEqual(['a.title']);
    expect(keyWordFieldsOf(AdminOperateAnnouncementController)).toEqual([
      'a.title',
    ]);

    // 反向守卫：错误的小写写法不得存在（否则搜索会被 cool 静默忽略）
    for (const controller of [
      AdminOperateBannerController,
      AdminOperateAnnouncementController,
    ]) {
      const op = getClassMetadata(CONTROLLER_KEY, controller)?.curdOption
        ?.pageQueryOp;
      expect(op?.keywordLikeFields).toBeUndefined();
    }
  });
```

- [ ] **Step 2: 先确认生产代码本来就是对的（不要跳过这步）**

Run: `git log -S keywordLikeFields --oneline --all`（在仓库根目录跑）
Expected: 只命中本计划/spec 的 docs 提交，**没有任何**改这两个控制器的代码提交。

再打开 `src/modules/operate/controller/admin/banner.ts` 与 `announcement.ts`，确认第 9 行是
`keyWordLikeFields: ['a.title'],`（大写 W）。若发现真有小写写法，说明前提变了 —— **停下来报告 NEEDS_CONTEXT**，
不要自行改生产代码（本 Task 的 brief 已明确「无生产代码改动」）。

- [ ] **Step 3: 运行测试**

Run: `npx cross-env NODE_ENV=unittest jest test/operate-admin.test.ts --runInBand`
Expected: **PASS**。新用例一开始就通过 —— 代码本来就是对的，本 Task 拿不到 RED，这是守卫测试的正常形态。
（如果它 FAIL 了，说明属性名真的写错了，那就是真缺陷：报 DONE_WITH_CONCERNS 并把失败输出写进报告。）

- [ ] **Step 4: 跑一遍 operate 相关既有测试，确认无回归**

Run: `npx cross-env NODE_ENV=unittest jest test/operate-admin.test.ts test/operate-app.test.ts test/base-operate.test.ts --runInBand`
Expected: 全部 PASS。（`test/base-operate.test.ts` 在本次基线偶发 `Pool is closed` 跨套件污染，
若只有它失败且失败原因是 teardown 竞争，属既有环境问题，写进报告的 concerns，不要试图修。）

- [ ] **Step 5: Commit**

```bash
cd cool-admin-midway
git add test/operate-admin.test.ts
git commit -m "test(operate): 钉住管理端 pageQueryOp 的 keyWordLikeFields 属性名（写错会静默失效）"
```

---

# Phase B — 前端（wudong-web）

> Phase B 各 Task 之间是严格串行的（后一个 Task 依赖前一个新建的文件与类型）。测试命令均在 `wudong-web/` 下执行：
> `npm run test -- src/<path>/*.spec.ts`（vitest），类型检查 `npm run type-check`。

## Task 6: http 层支持 POST / 鉴权头 / 登录失效

**Files:**
- Modify: `wudong-web/src/api/http.ts`
- Test: `wudong-web/src/api/http.spec.ts`（追加）

**Interfaces:**
- Produces:
  - `request<T>(path: string, query?: Record<string, unknown>): Promise<T>`（保持既有签名）
  - `post<T>(path: string, body?: Record<string, unknown>): Promise<T>`
  - `setAuthToken(token: string | null): void`
  - `setUnauthorizedHandler(handler: (() => void) | null): void`
  - `ApiError`（不变）
- 约定：`Authorization` 头是**裸 token**；`message` 以 `登录失效` 开头视为鉴权失败 → 调 handler 后照常抛 `ApiError`。

- [ ] **Step 1: 追加失败测试到 `src/api/http.spec.ts`**

```ts
import { post, setAuthToken, setUnauthorizedHandler } from './http';

describe('post 与鉴权', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    setAuthToken(null);
    setUnauthorizedHandler(null);
  });

  it('POST 发送 JSON body 且不带 token 时不加 Authorization 头', async () => {
    let init: any = null;
    vi.stubGlobal('fetch', vi.fn((u: string, i: any) => {
      init = i;
      return { ok: true, json: async () => ({ code: 1000, data: { id: 1 } }) };
    }));
    await expect(post('/app/x', { a: 1 })).resolves.toEqual({ id: 1 });
    expect(init.method).toBe('POST');
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(init.headers.Authorization).toBeUndefined();
    expect(init.body).toBe(JSON.stringify({ a: 1 }));
  });

  it('设置 token 后 POST 与 GET 都带裸 token', async () => {
    const headers: any[] = [];
    vi.stubGlobal('fetch', vi.fn((u: string, i: any) => {
      headers.push(i ? i.headers : {});
      return { ok: true, json: async () => ({ code: 1000, data: 1 }) };
    }));
    setAuthToken('jwt-abc');
    await post('/app/x', {});
    await request('/app/y');
    expect(headers[0].Authorization).toBe('jwt-abc'); // 无 Bearer 前缀
    expect(headers[1].Authorization).toBe('jwt-abc');
  });

  it('code 1001 且 message 以登录失效开头时触发 unauthorized 回调', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ code: 1001, message: '登录失效~' }),
    }));
    const onUnauthorized = vi.fn();
    setUnauthorizedHandler(onUnauthorized);
    await expect(post('/app/x')).rejects.toThrow(/登录失效/);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('普通业务错误不触发 unauthorized 回调', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ code: 1001, message: '无权操作该资源' }),
    }));
    const onUnauthorized = vi.fn();
    setUnauthorizedHandler(onUnauthorized);
    await expect(post('/app/x')).rejects.toThrow('无权操作该资源');
    expect(onUnauthorized).not.toHaveBeenCalled();
  });

  it('HTTP 401 触发 unauthorized 回调', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
    }));
    const onUnauthorized = vi.fn();
    setUnauthorizedHandler(onUnauthorized);
    await expect(request('/admin/x')).rejects.toThrow('HTTP 401');
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- src/api/http.spec.ts`
Expected: FAIL — `post`/`setAuthToken`/`setUnauthorizedHandler` 未导出。

- [ ] **Step 3: 重写 `src/api/http.ts`（保留既有 GET 行为）**

```ts
// 轻量请求封装：/app/** 与 /admin/**，code===1000 返回 data，否则抛 ApiError。
// query 以 encodeURIComponent 手动拼接（空格 → %20，而非 +）。
// 鉴权头是【裸 token】（无 Bearer 前缀），与 cool 中间件 jwt.verify(ctx.get('Authorization')) 一致。
// 未登录时后端返回 HTTP 200 + {code:1001,message:'登录失效~'}，业务错误同样 code:1001，
// 因此只能靠 message 前缀识别鉴权失败（不能靠 code）。
interface Envelope<T> {
  code: number;
  message?: string;
  data?: T;
}

/** 接口错误（携带业务 code 与 message） */
export class ApiError extends Error {
  code?: number;

  constructor(message: string, code?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

/** 当前登录 token（裸 JWT）；由 stores/auth 在登录/登出时同步 */
let authToken: string | null = null;
/** 鉴权失败回调（清 token + 跳登录），由 stores/auth 注册 */
let unauthorizedHandler: (() => void) | null = null;

export const setAuthToken = (token: string | null): void => {
  authToken = token;
};

export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
  unauthorizedHandler = handler;
};

/** 拼接 query string：跳过 null/undefined/''，值经 encodeURIComponent */
const buildQuery = (query?: Record<string, unknown>): string => {
  if (!query) return '';
  const parts: string[] = [];
  for (const [k, v] of Object.entries(query)) {
    if (v === '' || v == null) continue;
    parts.push(`${k}=${encodeURIComponent(String(v))}`);
  }
  return parts.length ? `?${parts.join('&')}` : '';
};

const isAuthFailure = (message?: string): boolean =>
  typeof message === 'string' && message.startsWith('登录失效');

/** 统一收发：GET 走 query，POST 走 JSON body；鉴权失败先回调再抛错 */
const doFetch = async <T>(
  method: 'GET' | 'POST',
  path: string,
  query?: Record<string, unknown>,
  body?: Record<string, unknown>
): Promise<T> => {
  const url = method === 'GET' ? `${path}${buildQuery(query)}` : path;
  const headers: Record<string, string> = {};
  if (authToken) headers.Authorization = authToken;

  const init: RequestInit = { method, headers };
  if (method === 'POST') {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body ?? {});
  }

  const res = await fetch(url, init);
  if (!res.ok) {
    if (res.status === 401) unauthorizedHandler?.();
    throw new ApiError(`HTTP ${res.status}`, res.status);
  }
  const json = (await res.json()) as Envelope<T>;
  if (json.code !== 1000) {
    if (isAuthFailure(json.message)) unauthorizedHandler?.();
    throw new ApiError(json.message || '接口异常', json.code);
  }
  return json.data as T;
};

/** GET 请求 */
export const request = <T>(
  path: string,
  query?: Record<string, unknown>
): Promise<T> => doFetch<T>('GET', path, query);

/** POST 请求（JSON body） */
export const post = <T>(
  path: string,
  body?: Record<string, unknown>
): Promise<T> => doFetch<T>('POST', path, undefined, body);
```

- [ ] **Step 4: 运行全部前端测试确认既有 GET 行为未被破坏**

Run: `npm run test`
Expected: PASS（含既有 3 个 http 用例 + 新增 5 个）。

- [ ] **Step 5: 类型检查**

Run: `npm run type-check`
Expected: 无错误。

- [ ] **Step 6: Commit**

```bash
cd wudong-web
git add src/api/http.ts src/api/http.spec.ts
git commit -m "feat(merchant): http 层支持 POST/裸 token 鉴权头/登录失效回调"
```

---

## Task 7: 商家数据层（类型 + 归一抽取 + api/merchant + mocks）

**Files:**
- Modify: `wudong-web/src/api/types.ts`（追加商家域类型）
- Create: `wudong-web/src/api/normalize.ts`
- Modify: `wudong-web/src/api/accommodation.ts`（改用 `normalize.ts`）
- Create: `wudong-web/src/mocks/merchant.ts`
- Create: `wudong-web/src/api/merchant.ts`
- Test: `wudong-web/src/api/merchant.spec.ts`

**Interfaces:**
- Consumes: `USE_MOCK`（`src/env.ts`）、`request/post`（Task 6）、`buildCalendar(roomTypeId, base, stock, start, end)`（`src/mocks/calendar.ts`，已存在）、`mockHotels/mockRoomTypes`（`src/mocks/index.ts`）。
- Produces（`src/api/normalize.ts`）：`toNum`、`normHotel`、`normRoomType`、`normRow`、`normMerchantHotel`、`normMerchantRoomType`
- Produces（`src/api/types.ts` 追加）：`MemberInfo`、`LoginResult`、`MerchantInfo`、`MerchantApplication`、`MerchantHotel`、`MerchantRoomType`、`HotelForm`、`RoomTypeForm`、`MerchantApplyForm`、`CalendarBatchForm`、`PageResult<T>`
- Produces（`src/api/merchant.ts`）：
  - `merchantApply(form: MerchantApplyForm): Promise<true>`
  - `merchantApplication(): Promise<MerchantApplication | null>`
  - `merchantMy(): Promise<MerchantInfo | null>`
  - `merchantHotelPage(q?: { page?: number; size?: number; name?: string; status?: number }): Promise<PageResult<MerchantHotel>>`
  - `merchantHotelInfo(id: number): Promise<MerchantHotel>`
  - `merchantHotelSave(form: HotelForm): Promise<MerchantHotel>`
  - `merchantHotelDelete(id: number): Promise<true>`
  - `merchantRoomTypePage(hotelId: number, q?: { page?: number; size?: number }): Promise<PageResult<MerchantRoomType>>`
  - `merchantRoomTypeSave(form: RoomTypeForm): Promise<MerchantRoomType>`
  - `merchantRoomTypeDelete(id: number): Promise<true>`
  - `merchantCalendarRange(roomTypeId: number, start: string, end: string): Promise<CalendarRow[]>`
  - `merchantCalendarBatch(form: CalendarBatchForm): Promise<{ count: number }>`
- Produces（`src/mocks/merchant.ts`）：`mockMemberInfo`、`mockMerchantInfo`、`mockLogin(phone)`、`mockSendSmsCode(phone)`、`mockMerchantApply`、`mockMerchantApplication`、`mockMerchantMy`、`mockHotelPage`、`mockHotelInfo`、`mockHotelSave`、`mockHotelDelete`、`mockRoomTypePage`、`mockRoomTypeSave`、`mockRoomTypeDelete`、`mockCalendarRange`、`mockCalendarBatch`、`resetMerchantMocks()`

- [ ] **Step 1: 追加失败测试 `src/api/merchant.spec.ts`**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  merchantCalendarBatch,
  merchantCalendarRange,
  merchantHotelPage,
  merchantHotelSave,
  merchantMy,
} from './merchant';
import { resetMerchantMocks } from '../mocks/merchant';

const okJson = (data: unknown) => ({
  ok: true,
  json: async () => ({ code: 1000, data }),
});

describe('api/merchant 真实后端分支', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_USE_MOCK', 'false');
    vi.resetModules();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('merchantMy 无店铺时返回 null（cool 不输出 data 键）', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ code: 1000 }) }));
    await expect(merchantMy()).resolves.toBeNull();
  });

  it('民宿分页请求路径与 query 正确', async () => {
    let url = '';
    vi.stubGlobal('fetch', vi.fn((u: string) => {
      url = u;
      return Promise.resolve(okJson({ list: [], total: 0 }));
    }));
    await merchantHotelPage({ page: 2, size: 10, name: '苗寨' });
    expect(url).toBe(
      '/app/accommodation/merchant/hotel/page?page=2&size=10&name=%E8%8B%97%E5%AF%A8'
    );
  });

  it('merchantHotelSave 无 id 走 add，有 id 走 update', async () => {
    // update 的后端只返回 boolean，故保存后必须 GET /hotel/info 回读完整行：
    // 这个回读本身就是被断言的行为之一（少了它，用例必须变红）
    const calls: string[] = [];
    vi.stubGlobal('fetch', vi.fn((u: string, i: any) => {
      calls.push(`${i?.method ?? 'GET'} ${u}`);
      return Promise.resolve(okJson({ id: 1, name: 'x' }));
    }));
    const base = {
      name: '苗寨一号院',
      address: '雷山县',
      longitude: 108,
      latitude: 26,
      styleTags: [],
      facilityTags: [],
      mainImage: '',
      images: [],
      intro: '',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      petPolicy: '',
      hasBreakfast: 0,
      deposit: 0,
      status: 1,
    };
    await merchantHotelSave(base);
    await merchantHotelSave({ ...base, id: 5 });
    expect(calls).toEqual([
      'POST /app/accommodation/merchant/hotel/add',
      'POST /app/accommodation/merchant/hotel/update',
      'GET /app/accommodation/merchant/hotel/info?id=5',
    ]);
  });

  it('房态区间查询归一 decimal', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okJson([
      { date: '2026-10-01', price: '480.00', availableStock: '3', status: '1' },
    ])));
    const rows = await merchantCalendarRange(2, '2026-10-01', '2026-10-01');
    expect(rows[0].price).toBe(480);
    expect(rows[0].availableStock).toBe(3);
    expect(rows[0].status).toBe(1);
  });

  it('批量设置提交 JSON body', async () => {
    let body = '';
    vi.stubGlobal('fetch', vi.fn((u: string, i: any) => {
      body = i.body;
      return Promise.resolve(okJson({ count: 7 }));
    }));
    await merchantCalendarBatch({
      roomTypeId: 2,
      startDate: '2026-10-01',
      endDate: '2026-10-07',
      price: 480,
    });
    expect(body).toBe(
      JSON.stringify({ roomTypeId: 2, startDate: '2026-10-01', endDate: '2026-10-07', price: 480 })
    );
  });
});

describe('api/merchant mock 分支（内存态可增删改）', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_USE_MOCK', 'true');
    vi.resetModules();
    resetMerchantMocks();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('mock 模式下不发出网络请求', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    await merchantHotelPage();
    await merchantCalendarRange(11, '2026-10-01', '2026-10-03');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('mock 模式新增民宿后列表可见', async () => {
    const before = await merchantHotelPage();
    const created = await merchantHotelSave({
      name: '演示新院子',
      address: '雷山县五组',
      longitude: 108.5,
      latitude: 26.8,
      styleTags: ['苗寨'],
      facilityTags: [],
      mainImage: '',
      images: [],
      intro: '',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      petPolicy: '',
      hasBreakfast: 0,
      deposit: 0,
      status: 1,
    });
    const after = await merchantHotelPage();
    expect(after.total).toBe(before.total + 1);
    expect(after.list.some((h) => h.id === created.id)).toBe(true);
  });
});
```

> 注：`vi.stubEnv` + `vi.resetModules()` 是必需的——`USE_MOCK` 在模块加载时取值，必须让被测模块在设置环境变量后重新导入。为此上面的测试在 `beforeEach` 里 stub 后需用动态 `import`。**把文件改成下面的形态**（避免静态 import 固定住 `USE_MOCK`）：

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const okJson = (data: unknown) => ({
  ok: true,
  json: async () => ({ code: 1000, data }),
});

/** USE_MOCK 在模块顶层求值，必须先设定环境变量再动态导入 */
const loadApi = async () => {
  vi.resetModules();
  return import('./merchant');
};

describe('api/merchant', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  describe('真实后端分支', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_USE_MOCK', 'false');
    });

    it('merchantMy 无店铺时返回 null（cool 不输出 data 键）', async () => {
      const { merchantMy } = await loadApi();
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ code: 1000 }) }));
      await expect(merchantMy()).resolves.toBeNull();
    });

    it('民宿分页请求路径与 query 正确', async () => {
      const { merchantHotelPage } = await loadApi();
      let url = '';
      vi.stubGlobal('fetch', vi.fn((u: string) => {
        url = u;
        return Promise.resolve(okJson({ list: [], total: 0 }));
      }));
      await merchantHotelPage({ page: 2, size: 10, name: '苗寨' });
      expect(url).toBe(
        '/app/accommodation/merchant/hotel/page?page=2&size=10&name=%E8%8B%97%E5%AF%A8'
      );
    });

    it('merchantHotelSave 无 id 走 add，有 id 走 update', async () => {
      const { merchantHotelSave } = await loadApi();
      // update 的后端只返回 boolean，故保存后必须 GET /hotel/info 回读完整行：
      // 这个回读本身就是被断言的行为之一（少了它，用例必须变红）
      const calls: string[] = [];
      vi.stubGlobal('fetch', vi.fn((u: string, i: any) => {
        calls.push(`${i?.method ?? 'GET'} ${u}`);
        return Promise.resolve(okJson({ id: 1, name: 'x' }));
      }));
      const base = {
        name: '苗寨一号院',
        address: '雷山县',
        longitude: 108,
        latitude: 26,
        styleTags: [],
        facilityTags: [],
        mainImage: '',
        images: [],
        intro: '',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        petPolicy: '',
        hasBreakfast: 0,
        deposit: 0,
        status: 1,
      };
      await merchantHotelSave(base);
      await merchantHotelSave({ ...base, id: 5 });
      expect(calls).toEqual([
        'POST /app/accommodation/merchant/hotel/add',
        'POST /app/accommodation/merchant/hotel/update',
        'GET /app/accommodation/merchant/hotel/info?id=5',
      ]);
    });

    it('房态区间查询归一 decimal', async () => {
      const { merchantCalendarRange } = await loadApi();
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(okJson([
        { date: '2026-10-01', price: '480.00', availableStock: '3', status: '1' },
      ])));
      const rows = await merchantCalendarRange(2, '2026-10-01', '2026-10-01');
      expect(rows[0].price).toBe(480);
      expect(rows[0].availableStock).toBe(3);
      expect(rows[0].status).toBe(1);
    });

    it('批量设置提交 JSON body', async () => {
      const { merchantCalendarBatch } = await loadApi();
      let body = '';
      vi.stubGlobal('fetch', vi.fn((u: string, i: any) => {
        body = i.body;
        return Promise.resolve(okJson({ count: 7 }));
      }));
      await merchantCalendarBatch({
        roomTypeId: 2,
        startDate: '2026-10-01',
        endDate: '2026-10-07',
        price: 480,
      });
      expect(body).toBe(
        JSON.stringify({ roomTypeId: 2, startDate: '2026-10-01', endDate: '2026-10-07', price: 480 })
      );
    });
  });

  describe('mock 分支（内存态可增删改）', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_USE_MOCK', 'true');
    });

    it('mock 模式下不发出网络请求', async () => {
      const { merchantHotelPage, merchantCalendarRange } = await loadApi();
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);
      await merchantHotelPage();
      await merchantCalendarRange(11, '2026-10-01', '2026-10-03');
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('mock 模式新增民宿后列表可见', async () => {
      const { merchantHotelPage, merchantHotelSave } = await loadApi();
      const before = await merchantHotelPage();
      const created = await merchantHotelSave({
        name: '演示新院子',
        address: '雷山县五组',
        longitude: 108.5,
        latitude: 26.8,
        styleTags: ['苗寨'],
        facilityTags: [],
        mainImage: '',
        images: [],
        intro: '',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        petPolicy: '',
        hasBreakfast: 0,
        deposit: 0,
        status: 1,
      });
      const after = await merchantHotelPage();
      expect(after.total).toBe(before.total + 1);
      expect(after.list.some((h) => h.id === created.id)).toBe(true);
    });
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- src/api/merchant.spec.ts`
Expected: FAIL — `./merchant` 不存在。

- [ ] **Step 3: 追加类型到 `src/api/types.ts`**

在文件末尾追加：

```ts
/** 会员（C 端登录用户） */
export interface MemberInfo {
  id: number;
  phone: string;
  nickname?: string;
  avatar?: string;
  /** 1 游客 2 商家 */
  role: number;
}

/** 登录结果 */
export interface LoginResult {
  token: string;
  refreshToken?: string;
}

/** 商家（已入驻店铺） */
export interface MerchantInfo {
  id: number;
  userId: number;
  /** 商家账号，如 m12 */
  username: string;
  shopName: string;
  /** 入驻模块 product/food/accommodation/travel */
  module: string;
  contactName: string;
  contactPhone: string;
  /** 1 正常 0 禁用 */
  status: number;
  joinedAt?: string;
}

/** 入驻申请进度（后端 dict：1 待审核 2 已通过 3 已驳回） */
export interface MerchantApplication {
  id: number;
  shopName: string;
  module: string;
  contactName: string;
  contactPhone: string;
  idCard: string;
  status: number;
  /** 审核意见（驳回原因） */
  auditResult?: string | null;
}

/** 商家视角的民宿（含 C 端不展示的字段） */
export interface MerchantHotel extends Hotel {
  merchantId: number;
  longitude: number;
  latitude: number;
  deposit: number;
  /** 1 正常 0 下架 */
  status: number;
}

/** 商家视角的房型 */
export interface MerchantRoomType extends RoomType {
  facilities: string[];
  status: number;
}

/** 民宿新增/编辑表单（有 id 即更新） */
export type HotelForm = Omit<
  MerchantHotel,
  'id' | 'merchantId' | 'rating' | 'reviewCount' | 'minPrice'
> & { id?: number };

/** 房型新增/编辑表单（有 id 即更新） */
export type RoomTypeForm = Omit<MerchantRoomType, 'id'> & { id?: number };

/** 入驻申请表单（字段与后端 merchant.apply 必填校验一致） */
export interface MerchantApplyForm {
  shopName: string;
  module: string;
  contactName: string;
  contactPhone: string;
  idCard: string;
  idCardFront: string;
  idCardBack: string;
  businessLicense: string;
}

/** 房态批量设置 */
export interface CalendarBatchForm {
  roomTypeId: number;
  startDate: string;
  endDate: string;
  /** 限定星期几（0 周日 … 6 周六），不传表示区间内全部 */
  weekDays?: number[];
  price?: number;
  availableStock?: number;
  /** true 表示关房（不写价与库存） */
  closed?: boolean;
}

/** 分页结果 */
export interface PageResult<T> {
  list: T[];
  total: number;
}
```

- [ ] **Step 4: 创建 `src/api/normalize.ts`（把 `accommodation.ts` 里的归一函数抽出复用）**

```ts
// decimal 字段归一：后端 decimal 序列化后可能是 string（如 '480.00'），页面只消费 number。
import type {
  CalendarRow,
  Hotel,
  MerchantHotel,
  MerchantRoomType,
  RoomType,
} from './types';

/** 任意值 → number，不可解析时为 0 */
export const toNum = (v: unknown): number => {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
};

/** 任意值 → number，null/undefined 保持 null（minPrice 语义） */
export const toNumOrNull = (v: unknown): number | null =>
  v == null ? null : toNum(v);

/** 归一民宿（C 端） */
export const normHotel = (h: Hotel): Hotel => ({
  ...h,
  rating: toNum(h.rating),
  reviewCount: toNum(h.reviewCount),
  hasBreakfast: toNum(h.hasBreakfast),
  minPrice: toNumOrNull(h.minPrice),
});

/** 归一房型（C 端） */
export const normRoomType = (r: RoomType): RoomType => ({
  ...r,
  price: toNum(r.price),
  stock: toNum(r.stock),
  maxGuests: toNum(r.maxGuests),
});

/** 归一日历行 */
export const normRow = (r: CalendarRow): CalendarRow => ({
  ...r,
  price: toNum(r.price),
  availableStock: toNum(r.availableStock),
  status: toNum(r.status),
});

/** 归一民宿（商家视角，额外含经纬度/押金/状态） */
export const normMerchantHotel = (h: MerchantHotel): MerchantHotel => ({
  ...h,
  rating: toNum(h.rating),
  reviewCount: toNum(h.reviewCount),
  hasBreakfast: toNum(h.hasBreakfast),
  minPrice: toNumOrNull(h.minPrice),
  longitude: toNum(h.longitude),
  latitude: toNum(h.latitude),
  deposit: toNum(h.deposit),
  status: toNum(h.status),
});

/** 归一房型（商家视角，额外含设施/状态） */
export const normMerchantRoomType = (r: MerchantRoomType): MerchantRoomType => ({
  ...r,
  price: toNum(r.price),
  stock: toNum(r.stock),
  maxGuests: toNum(r.maxGuests),
  area: r.area == null ? null : toNum(r.area),
  status: toNum(r.status),
});
```

- [ ] **Step 5: 改 `src/api/accommodation.ts` 使用 `normalize.ts`**

把 `accommodation.ts` 顶部的 `toNum`、`normHotel`、`normRoomType`、`normRow` 四个本地定义**整段删除**，改为在 import 区加入：

```ts
import { normHotel, normRoomType, normRow, toNum } from './normalize';
```

其余逻辑（`mockSearchHotels`、`searchHotels`、`hotelDetail`、`roomCalendar`）**不改**——它们继续调用同名函数。
`toNum` 仍被 `mockSearchHotels` 与 `roomCalendar` 的 mock 分支使用，所以必须一起 import。

- [ ] **Step 6: 创建 `src/mocks/merchant.ts`（内存态演示数据）**

```ts
// 商家区演示数据：内存态，增删改在本次会话内生效（刷新页面即重置）。
// 结构与后端返回同构；api/merchant.ts 负责在 USE_MOCK 时选它，视图层不感知。
import type {
  CalendarRow,
  MerchantApplication,
  MerchantHotel,
  MerchantInfo,
  MerchantRoomType,
  MemberInfo,
  PageResult,
} from '../api/types';
import { mockHotels, mockRoomTypes } from './index';
import { buildCalendar } from './calendar';

/** mock 模式下已登录的会员（商家身份） */
export const mockMemberInfo: MemberInfo = {
  id: 1,
  phone: '13300133001',
  nickname: '演示商家',
  role: 2,
};

/** mock 模式下已入驻的店铺 */
export const mockMerchantInfo: MerchantInfo = {
  id: 1,
  userId: 1,
  username: 'm1',
  shopName: '乌东苗寨木楼',
  module: 'accommodation',
  contactName: '杨阿妹',
  contactPhone: '13300133001',
  status: 1,
  joinedAt: '2026-09-01 10:00:00',
};

export const mockLogin = (phone: string): { token: string } => ({
  token: `mock-token-${phone}`,
});

export const mockSendSmsCode = (_phone: string): { code: string } => ({
  code: '123456',
});

/** 演示身份已入驻，因此没有进行中的申请（首页直接展示店铺） */
export const mockMerchantApplication = (): MerchantApplication | null => null;

export const mockMerchantApply = (): true => true;

export const mockMerchantMy = (): MerchantInfo | null => mockMerchantInfo;

// ---- 内存态数据 ----

const seedHotels = (): MerchantHotel[] =>
  mockHotels.map((h, i) => ({
    ...h,
    merchantId: 1,
    longitude: 108.1 + i * 0.01,
    latitude: 26.4 + i * 0.01,
    deposit: 100,
    status: 1,
  }));

const seedRoomTypes = (): MerchantRoomType[] =>
  mockRoomTypes.map((r) => ({
    ...r,
    facilities: ['WiFi', '空调'],
    status: 1,
  }));

let hotels: MerchantHotel[] = seedHotels();
let roomTypes: MerchantRoomType[] = seedRoomTypes();
/** 房态覆盖：key = `${roomTypeId}|${date}` */
const overrides: Record<string, CalendarRow> = {};
let nextId = 1000;

/** 仅测试用：把内存态恢复为初始种子 */
export const resetMerchantMocks = (): void => {
  hotels = seedHotels();
  roomTypes = seedRoomTypes();
  for (const key of Object.keys(overrides)) delete overrides[key];
  nextId = 1000;
};

export const mockHotelPage = (q: {
  page?: number;
  size?: number;
  name?: string;
  status?: number;
} = {}): PageResult<MerchantHotel> => {
  let rows = hotels.slice();
  const name = (q.name ?? '').trim();
  if (name) rows = rows.filter((h) => h.name.includes(name));
  if (q.status != null) rows = rows.filter((h) => h.status === Number(q.status));
  const page = Math.max(Number(q.page) || 1, 1);
  const size = Math.max(Number(q.size) || 10, 1);
  return {
    list: rows.slice((page - 1) * size, page * size),
    total: rows.length,
  };
};

export const mockHotelInfo = (id: number): MerchantHotel | null =>
  hotels.find((h) => h.id === Number(id)) ?? null;

export const mockHotelSave = (form: MerchantHotel): MerchantHotel => {
  if (form.id) {
    const index = hotels.findIndex((h) => h.id === Number(form.id));
    if (index < 0) throw new Error('无权操作该资源');
    hotels[index] = { ...hotels[index], ...form };
    return hotels[index];
  }
  const created: MerchantHotel = {
    ...form,
    id: ++nextId,
    merchantId: 1,
    rating: 5,
    reviewCount: 0,
    minPrice: null,
  };
  hotels = [created, ...hotels];
  return created;
};

export const mockHotelDelete = (id: number): true => {
  if (roomTypes.some((r) => r.hotelId === Number(id))) {
    throw new Error('请先删除该民宿下的房型');
  }
  hotels = hotels.filter((h) => h.id !== Number(id));
  return true;
};

export const mockRoomTypePage = (hotelId: number): PageResult<MerchantRoomType> => {
  const list = roomTypes.filter((r) => r.hotelId === Number(hotelId));
  return { list, total: list.length };
};

export const mockRoomTypeSave = (form: MerchantRoomType): MerchantRoomType => {
  if (form.id) {
    const index = roomTypes.findIndex((r) => r.id === Number(form.id));
    if (index < 0) throw new Error('无权操作该资源');
    roomTypes[index] = { ...roomTypes[index], ...form };
    return roomTypes[index];
  }
  const created: MerchantRoomType = { ...form, id: ++nextId };
  roomTypes = [...roomTypes, created];
  return created;
};

export const mockRoomTypeDelete = (id: number): true => {
  roomTypes = roomTypes.filter((r) => r.id !== Number(id));
  for (const key of Object.keys(overrides)) {
    if (key.startsWith(`${id}|`)) delete overrides[key];
  }
  return true;
};

/** 区间房态：无覆盖的日期回退房型基础价/库存（与后端语义一致） */
export const mockCalendarRange = (
  roomTypeId: number,
  start: string,
  end: string
): CalendarRow[] => {
  const roomType = roomTypes.find((r) => r.id === Number(roomTypeId));
  if (!roomType) throw new Error('无权操作该资源');
  return buildCalendar(roomTypeId, roomType.price, roomType.stock, start, end).map(
    (row) => overrides[`${roomTypeId}|${row.date}`] ?? row
  );
};

/** 批量设置：区间内逐日写覆盖，可按星期筛选；availableStock 截断到房型 stock */
export const mockCalendarBatch = (form: {
  roomTypeId: number;
  startDate: string;
  endDate: string;
  weekDays?: number[];
  price?: number;
  availableStock?: number;
  closed?: boolean;
}): { count: number } => {
  const roomType = roomTypes.find((r) => r.id === Number(form.roomTypeId));
  if (!roomType) throw new Error('无权操作该资源');
  const dates = buildCalendar(
    form.roomTypeId,
    roomType.price,
    roomType.stock,
    form.startDate,
    form.endDate
  ).map((r) => r.date);
  const week = (form.weekDays ?? []).map(Number);

  let count = 0;
  for (const date of dates) {
    // 正午解析避免时区把日期推到前一天
    if (week.length && !week.includes(new Date(`${date}T12:00:00`).getDay())) {
      continue;
    }
    const key = `${form.roomTypeId}|${date}`;
    const current =
      overrides[key] ??
      ({
        date,
        price: roomType.price,
        availableStock: roomType.stock,
        status: 1,
      } as CalendarRow);
    if (form.closed) {
      overrides[key] = { ...current, status: 0 };
    } else {
      overrides[key] = {
        ...current,
        status: 1,
        price: form.price == null ? current.price : Number(form.price),
        availableStock:
          form.availableStock == null
            ? current.availableStock
            : Math.min(Number(form.availableStock), roomType.stock),
      };
    }
    count++;
  }
  return { count };
};
```

- [ ] **Step 7: 创建 `src/api/merchant.ts`**

```ts
// 商家区数据层：真实后端(8001) 与 mocks 同构数据间选择（唯一判据 USE_MOCK）。
// 两条分支的返回都过同一归一（normalize.ts），视图只消费归一后类型。
import { USE_MOCK } from '../env';
import { post, request } from './http';
import {
  normMerchantHotel,
  normMerchantRoomType,
  normRow,
} from './normalize';
import type {
  CalendarBatchForm,
  CalendarRow,
  HotelForm,
  MerchantApplication,
  MerchantApplyForm,
  MerchantHotel,
  MerchantInfo,
  MerchantRoomType,
  PageResult,
  RoomTypeForm,
} from './types';
import {
  mockCalendarBatch,
  mockCalendarRange,
  mockHotelDelete,
  mockHotelInfo,
  mockHotelPage,
  mockHotelSave,
  mockMerchantApplication,
  mockMerchantApply,
  mockMerchantMy,
  mockRoomTypeDelete,
  mockRoomTypePage,
  mockRoomTypeSave,
} from '../mocks/merchant';

const BASE = '/app/accommodation/merchant';

/** 提交入驻申请 */
export const merchantApply = async (form: MerchantApplyForm): Promise<true> => {
  if (USE_MOCK) return mockMerchantApply();
  return post<true>('/app/merchant/apply', { ...form });
};

/** 最新一次入驻申请进度（无申请时后端不输出 data → undefined → 归 null） */
export const merchantApplication = async (): Promise<MerchantApplication | null> => {
  if (USE_MOCK) return mockMerchantApplication();
  const data = await request<MerchantApplication>('/app/merchant/application');
  return data ?? null;
};

/** 我的店铺（未入驻时后端不输出 data → undefined → 归 null） */
export const merchantMy = async (): Promise<MerchantInfo | null> => {
  if (USE_MOCK) return mockMerchantMy();
  const data = await request<MerchantInfo>('/app/merchant/my');
  return data ?? null;
};

/** 我的民宿分页 */
export const merchantHotelPage = async (q: {
  page?: number;
  size?: number;
  name?: string;
  status?: number;
} = {}): Promise<PageResult<MerchantHotel>> => {
  if (USE_MOCK) return mockHotelPage(q);
  const data = await request<PageResult<MerchantHotel>>(`${BASE}/hotel/page`, {
    page: q.page ?? 1,
    size: q.size ?? 10,
    name: q.name,
    status: q.status,
  });
  return {
    list: (data?.list ?? []).map(normMerchantHotel),
    total: Number(data?.total ?? 0),
  };
};

/** 民宿详情（仅本人） */
export const merchantHotelInfo = async (id: number): Promise<MerchantHotel> => {
  if (USE_MOCK) {
    const info = mockHotelInfo(id);
    if (!info) throw new Error('无权操作该资源');
    return normMerchantHotel(info);
  }
  return normMerchantHotel(
    await request<MerchantHotel>(`${BASE}/hotel/info`, { id })
  );
};

/** 新增/更新民宿（有 id 即更新） */
export const merchantHotelSave = async (form: HotelForm): Promise<MerchantHotel> => {
  if (USE_MOCK) {
    return normMerchantHotel(mockHotelSave(form as MerchantHotel));
  }
  const path = form.id ? `${BASE}/hotel/update` : `${BASE}/hotel/add`;
  if (form.id) {
    await post<boolean>(path, { ...form });
    return normMerchantHotel(
      await request<MerchantHotel>(`${BASE}/hotel/info`, { id: form.id })
    );
  }
  return normMerchantHotel(await post<MerchantHotel>(path, { ...form }));
};

/** 删除民宿（含房型时后端拒绝） */
export const merchantHotelDelete = async (id: number): Promise<true> => {
  if (USE_MOCK) return mockHotelDelete(id);
  return post<true>(`${BASE}/hotel/delete`, { id });
};

/** 某民宿的房型列表 */
export const merchantRoomTypePage = async (
  hotelId: number,
  q: { page?: number; size?: number } = {}
): Promise<PageResult<MerchantRoomType>> => {
  if (USE_MOCK) return mockRoomTypePage(hotelId);
  const data = await request<PageResult<MerchantRoomType>>(
    `${BASE}/room-type/page`,
    { hotelId, page: q.page ?? 1, size: q.size ?? 50 }
  );
  return {
    list: (data?.list ?? []).map(normMerchantRoomType),
    total: Number(data?.total ?? 0),
  };
};

/** 新增/更新房型（有 id 即更新） */
export const merchantRoomTypeSave = async (
  form: RoomTypeForm
): Promise<MerchantRoomType> => {
  if (USE_MOCK) {
    return normMerchantRoomType(mockRoomTypeSave(form as MerchantRoomType));
  }
  const path = form.id ? `${BASE}/room-type/update` : `${BASE}/room-type/add`;
  if (form.id) {
    await post<boolean>(path, { ...form });
    const page = await merchantRoomTypePage(form.hotelId);
    const found = page.list.find((r) => r.id === form.id);
    if (!found) throw new Error('房型不存在');
    return found;
  }
  return normMerchantRoomType(await post<MerchantRoomType>(path, { ...form }));
};

/** 删除房型（后端级联清理该房型房态） */
export const merchantRoomTypeDelete = async (id: number): Promise<true> => {
  if (USE_MOCK) return mockRoomTypeDelete(id);
  return post<true>(`${BASE}/room-type/delete`, { id });
};

/** 房态区间查询（无记录日期回退房型基础价/库存） */
export const merchantCalendarRange = async (
  roomTypeId: number,
  start: string,
  end: string
): Promise<CalendarRow[]> => {
  if (USE_MOCK) return mockCalendarRange(roomTypeId, start, end).map(normRow);
  const rows = await request<CalendarRow[]>(`${BASE}/calendar/range`, {
    roomTypeId,
    startDate: start,
    endDate: end,
  });
  return (rows ?? []).map(normRow);
};

/** 批量设置房态（价格/库存/关房，可限定星期几） */
export const merchantCalendarBatch = async (
  form: CalendarBatchForm
): Promise<{ count: number }> => {
  if (USE_MOCK) return mockCalendarBatch(form);
  return post<{ count: number }>(`${BASE}/calendar/batch`, { ...form });
};
```

- [ ] **Step 8: 运行测试确认通过**

Run: `npm run test`
Expected: PASS（既有用例 + 新增 7 个；`accommodation.spec.ts` 在归一抽取后仍全绿）。

- [ ] **Step 9: 类型检查**

Run: `npm run type-check`
Expected: 无错误。

- [ ] **Step 10: Commit**

```bash
cd wudong-web
git add src/api/types.ts src/api/normalize.ts src/api/accommodation.ts \
  src/mocks/merchant.ts src/api/merchant.ts src/api/merchant.spec.ts
git commit -m "feat(merchant): 商家区数据层（类型/归一抽取/api/mocks）"
```

---

## Task 8: 认证 API 与 auth store

**Files:**
- Create: `wudong-web/src/api/auth.ts`
- Create: `wudong-web/src/stores/auth.ts`
- Test: `wudong-web/src/stores/auth.spec.ts`

**Interfaces:**
- Consumes: `post/request/setAuthToken`（Task 6）、`merchantMy`（Task 7）、`mockLogin/mockSendSmsCode/mockMemberInfo`（Task 7）。
- Produces（`src/api/auth.ts`）：
  - `sendSmsCode(phone: string): Promise<{ code?: string }>`
  - `register(params: { phone: string; smsCode: string; password: string; nickname?: string }): Promise<LoginResult>`
  - `loginByPassword(phone: string, password: string): Promise<LoginResult>`
  - `memberInfo(): Promise<MemberInfo>`
- Produces（`src/stores/auth.ts`）：`useAuthStore`，state `{ token, member, merchant }`，getters `isLoggedIn`、`isMerchant`，actions `login(phone, password)`、`registerAndLogin(params)`、`loadProfile()`、`logout()`、`setToken(token)`

- [ ] **Step 1: 写失败测试 `src/stores/auth.spec.ts`**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from './auth';
import { setAuthToken } from '../api/http';

const okJson = (data: unknown) => ({
  ok: true,
  json: async () => ({ code: 1000, data }),
});

/** 按 URL 分派的 fetch 打桩 */
const stubRoutes = (routes: Record<string, unknown>) => {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      const key = Object.keys(routes).find((k) => url.startsWith(k));
      if (!key) throw new Error(`unexpected url: ${url}`);
      return Promise.resolve(okJson(routes[key]));
    })
  );
};

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    // http 层的 authToken 是模块级变量，会在**同一文件的用例之间**留存：
    // 上一个用例登录留下的 token 会让下一个用例的登录请求带上 Authorization 头。
    setAuthToken(null);
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('未登录时 isLoggedIn / isMerchant 均为 false', () => {
    const auth = useAuthStore();
    expect(auth.isLoggedIn).toBe(false);
    expect(auth.isMerchant).toBe(false);
  });

  it('密码登录后保存 token 并加载会员与店铺', async () => {
    stubRoutes({
      '/app/member/login/password': { token: 'jwt-1' },
      '/app/member/info/person': { id: 7, phone: '13800000000', role: 2 },
      '/app/merchant/my': {
        id: 3,
        userId: 7,
        username: 'm7',
        shopName: '苗银世家',
        module: 'accommodation',
        contactName: '张三',
        contactPhone: '13800000000',
        status: 1,
      },
    });
    const auth = useAuthStore();
    await auth.login('13800000000', 'abc123456');

    expect(auth.token).toBe('jwt-1');
    expect(localStorage.getItem('wudong_token')).toBe('jwt-1');
    expect(auth.member?.id).toBe(7);
    expect(auth.isLoggedIn).toBe(true);
    expect(auth.isMerchant).toBe(true);
    expect(auth.merchant?.shopName).toBe('苗银世家');
  });

  it('登录后请求自动带裸 token', async () => {
    const headers: any[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string, init: any) => {
        headers.push(init?.headers ?? {});
        if (url.startsWith('/app/member/login/password')) {
          return Promise.resolve(okJson({ token: 'jwt-9' }));
        }
        if (url.startsWith('/app/member/info/person')) {
          return Promise.resolve(okJson({ id: 1, phone: '1', role: 1 }));
        }
        return Promise.resolve({ ok: true, json: async () => ({ code: 1000 }) });
      })
    );
    const auth = useAuthStore();
    await auth.login('13800000000', 'abc123456');
    expect(headers[0].Authorization).toBeUndefined(); // 登录请求本身不带 token
    expect(headers[1].Authorization).toBe('jwt-9'); // 后续请求带裸 token
  });

  it('未入驻会员 isMerchant 为 false（cool 不输出 data 键）', async () => {
    stubRoutes({
      '/app/member/login/password': { token: 'jwt-2' },
      '/app/member/info/person': { id: 8, phone: '13800000001', role: 1 },
      // 未入驻：后端不输出 data 键 → request 得到 undefined → merchantMy 归 null
      '/app/merchant/my': undefined,
    });
    const auth = useAuthStore();
    await auth.login('13800000001', 'abc123456');
    expect(auth.merchant).toBeNull();
    expect(auth.isMerchant).toBe(false);
  });

  it('店铺被禁用的商家 isMerchant 为 false', async () => {
    stubRoutes({
      '/app/member/login/password': { token: 'jwt-3' },
      '/app/member/info/person': { id: 9, phone: '13800000002', role: 2 },
      '/app/merchant/my': { id: 4, shopName: 'x', status: 0, module: 'accommodation' },
    });
    const auth = useAuthStore();
    await auth.login('13800000002', 'abc123456');
    expect(auth.isMerchant).toBe(false);
  });

  it('注册成功即登录并加载身份', async () => {
    stubRoutes({
      '/app/member/login/smsCode': { code: '123456' },
      '/app/member/login/register': { token: 'jwt-reg' },
      '/app/member/info/person': { id: 10, phone: '13800000003', role: 1 },
      // 注册后尚未入驻：仍需给出该路由，否则 stubRoutes 会以 unexpected url 抛错
      '/app/merchant/my': undefined,
    });
    const auth = useAuthStore();
    await auth.registerAndLogin({
      phone: '13800000003',
      smsCode: '123456',
      password: 'abc123456',
    });
    expect(auth.token).toBe('jwt-reg');
    expect(auth.member?.id).toBe(10);
  });

  it('退出清空 token / 会员 / 店铺与本地存储', async () => {
    stubRoutes({
      '/app/member/login/password': { token: 'jwt-4' },
      '/app/member/info/person': { id: 11, phone: '13800000004', role: 2 },
      '/app/merchant/my': { id: 5, shopName: 'y', status: 1, module: 'accommodation' },
    });
    const auth = useAuthStore();
    await auth.login('13800000004', 'abc123456');
    auth.logout();
    expect(auth.token).toBe('');
    expect(auth.member).toBeNull();
    expect(auth.merchant).toBeNull();
    expect(localStorage.getItem('wudong_token')).toBeNull();
  });

  it('已持久化 token 时初始化即为登录态（不请求）', () => {
    localStorage.setItem('wudong_token', 'jwt-saved');
    const auth = useAuthStore();
    expect(auth.token).toBe('jwt-saved');
    expect(auth.isLoggedIn).toBe(true);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- src/stores/auth.spec.ts`
Expected: FAIL — `./auth` 不存在。

- [ ] **Step 3: 创建 `src/api/auth.ts`**

```ts
// C 端会员认证：注册 / 密码登录 / 验证码 / 当前会员信息。
// 本地与测试环境后端不发短信，smsCode 接口直接把验证码放在返回值里；
// mock 模式回固定验证码 '123456'。页面需兼容“有 code / 无 code”两种形态。
import { USE_MOCK } from '../env';
import { post, request } from './http';
import type { LoginResult, MemberInfo } from './types';
import { mockLogin, mockMemberInfo, mockSendSmsCode } from '../mocks/merchant';

/** 发送短信验证码（本地/测试环境后端直接返回验证码） */
export const sendSmsCode = async (phone: string): Promise<{ code?: string }> => {
  if (USE_MOCK) return mockSendSmsCode(phone);
  return post<{ code?: string }>('/app/member/login/smsCode', { phone });
};

/** 注册（手机号 + 验证码 + 密码），成功即返回 token */
export const register = async (params: {
  phone: string;
  smsCode: string;
  password: string;
  nickname?: string;
}): Promise<LoginResult> => {
  if (USE_MOCK) return mockLogin(params.phone);
  return post<LoginResult>('/app/member/login/register', { ...params });
};

/** 密码登录 */
export const loginByPassword = async (
  phone: string,
  password: string
): Promise<LoginResult> => {
  if (USE_MOCK) return mockLogin(phone);
  return post<LoginResult>('/app/member/login/password', { phone, password });
};

/** 当前登录会员信息 */
export const memberInfo = async (): Promise<MemberInfo> => {
  if (USE_MOCK) return mockMemberInfo;
  return request<MemberInfo>('/app/member/info/person');
};
```

- [ ] **Step 4: 创建 `src/stores/auth.ts`**

```ts
// 登录态：token 持久化在 localStorage，会员与店铺信息每次登录/进入商家区时加载。
// token 同步到 api/http 层（setAuthToken），所有后续请求自动携带。
import { defineStore } from 'pinia';
import { memberInfo, loginByPassword, register } from '../api/auth';
import { merchantMy } from '../api/merchant';
import { setAuthToken } from '../api/http';
import type { MemberInfo, MerchantInfo } from '../api/types';

const TOKEN_KEY = 'wudong_token';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    /** 裸 JWT；'' 表示未登录 */
    token: (localStorage.getItem(TOKEN_KEY) ?? '') as string,
    member: null as MemberInfo | null,
    /** 已入驻店铺；未入驻为 null */
    merchant: null as MerchantInfo | null,
  }),
  getters: {
    isLoggedIn: (state): boolean => !!state.token,
    /** 仅在店铺存在且 status=1 时视为商家（P2 与后端一致） */
    isMerchant: (state): boolean =>
      !!state.merchant && Number(state.merchant.status) === 1,
  },
  actions: {
    /** 写入/清除 token（同时同步到 http 层与本地存储） */
    setToken(token: string): void {
      this.token = token;
      setAuthToken(token || null);
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    },

    /** 加载会员与店铺信息；任一失败向上抛出由调用方决定跳转 */
    async loadProfile(): Promise<void> {
      if (!this.token) return;
      this.member = await memberInfo();
      this.merchant = await merchantMy();
    },

    /** 密码登录 → 保存 token → 加载身份 */
    async login(phone: string, password: string): Promise<void> {
      const result = await loginByPassword(phone, password);
      this.setToken(result.token);
      await this.loadProfile();
    },

    /** 注册成功即登录 */
    async registerAndLogin(params: {
      phone: string;
      smsCode: string;
      password: string;
      nickname?: string;
    }): Promise<void> {
      const result = await register(params);
      this.setToken(result.token);
      await this.loadProfile();
    },

    /** 退出：清空本地登录态（不调用后端接口） */
    logout(): void {
      this.setToken('');
      this.member = null;
      this.merchant = null;
    },
  },
});
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npm run test -- src/stores/auth.spec.ts`
Expected: PASS（8 个用例）。

- [ ] **Step 6: 类型检查**

Run: `npm run type-check`
Expected: 无错误。

- [ ] **Step 7: Commit**

```bash
cd wudong-web
git add src/api/auth.ts src/stores/auth.ts src/stores/auth.spec.ts
git commit -m "feat(merchant): 认证 api 与 auth store（token 持久化 + 店铺身份）"
```

---

## Task 9: 路由 / 守卫 / 商家区外壳 / 全局挂载

**Files:**
- Modify: `wudong-web/src/router/index.ts`
- Create: `wudong-web/src/views/merchant/MerchantShell.vue`
- Create: `wudong-web/src/views/LoginView.vue`（本 Task 只做最小可用版；Task 10 整文件替换）
- Create: `wudong-web/src/styles/merchant.scss`
- Modify: `wudong-web/src/main.ts`
- Modify: `wudong-web/src/App.vue`
- Test: `wudong-web/src/router/index.spec.ts`

**Interfaces:**
- Consumes: `useAuthStore`（Task 8）、`setAuthToken/setUnauthorizedHandler`（Task 6）。
- Produces:
  - 路由名：`login`(`/login`)、`merchant`(`/merchant`，含 `meta.requiresAuth: true`)、`merchant-home`(`path: ''`，即 `/merchant` 本身)、`merchant-apply`(`/merchant/apply`)、`merchant-hotels`(`/merchant/hotels`)、`merchant-hotel-new`(`/merchant/hotels/new`)、`merchant-hotel-edit`(`/merchant/hotels/:id/edit`)、`merchant-hotel-rooms`(`/merchant/hotels/:id/rooms`)、`merchant-room-calendar`(`/merchant/rooms/:id/calendar`)
  - 组件（后续 Task 实现，本 Task 先用占位组件文件：`views/merchant/MerchantHomeView.vue` 等由后续 Task 逐个替换）——
    **为避免“引用不存在的文件”，本 Task 只注册已存在的组件**：`MerchantShell` + 后续 Task 创建的视图。
    因此本 Task 先注册 `/login` 与 `/merchant`（shell 内只放一个 `MerchantHomeView` 占位），其余子路由在各自 Task 里追加。

> **实施提示（重要）：** 路由文件是多个 Task 共同修改的共享文件。**每个 Task 只在自己的步骤里向 `children` 数组追加一行**，不要整文件重写，避免互相覆盖。

- [ ] **Step 1: 写失败测试 `src/router/index.spec.ts`**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import router from './index';
import { useAuthStore } from '../stores/auth';

// 注意：本文件不需要 fetch 打桩，故没有 okJson 之类的辅助常量 —
// 未被引用的顶层 const 同样会触发 noUnusedLocals 的 TS6133。

describe('router 守卫', () => {
  beforeEach(async () => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.unstubAllGlobals();
    await router.replace('/');
  });

  it('未登录访问 /merchant 重定向到 /login 且带 redirect', async () => {
    await router.push('/merchant');
    expect(router.currentRoute.value.path).toBe('/login');
    expect(router.currentRoute.value.query.redirect).toBe('/merchant');
  });

  it('已登录可直接进入 /merchant', async () => {
    localStorage.setItem('wudong_token', 'jwt-x');
    // 守卫在**每次**导航里都调 useAuthStore()，所以上面 beforeEach 的 router.replace('/')
    // 已经用"localStorage 刚清空"的状态建好并缓存了一个 store 实例。
    // 必须换一个全新的 pinia，才能在 setItem 之后重新按持久化 token 初始化：
    setActivePinia(createPinia());
    const auth = useAuthStore();
    expect(auth.isLoggedIn).toBe(true);
    await router.push('/merchant');
    expect(router.currentRoute.value.path).toBe('/merchant');
  });

  it('游客页不受守卫影响', async () => {
    await router.push('/hotels');
    expect(router.currentRoute.value.path).toBe('/hotels');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- src/router/index.spec.ts`
Expected: FAIL — 无 `/merchant` 路由（跳不到 `/login`）。

- [ ] **Step 3: 创建 `src/views/merchant/MerchantShell.vue`**

```vue
<script setup lang="ts">
// 商家区外壳：进入时确保已加载会员/店铺信息；侧边导航只显示当前身份可用的入口。
import { computed, onMounted } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const navItems = computed(() => {
  const items = [{ label: '店铺概览', name: 'merchant-home' }];
  if (auth.isMerchant) {
    items.push({ label: '我的民宿', name: 'merchant-hotels' });
  } else {
    items.push({ label: '入驻申请', name: 'merchant-apply' });
  }
  return items;
});

const activeName = computed(() => {
  if (route.name === 'merchant-apply') return 'merchant-apply';
  if (route.name === 'merchant-hotels') return 'merchant-hotels';
  return 'merchant-home';
});

function go(name: string): void {
  router.push({ name });
}

function logout(): void {
  auth.logout();
  router.push('/');
}

onMounted(async () => {
  if (auth.isLoggedIn && !auth.member) {
    try {
      await auth.loadProfile();
    } catch {
      // 鉴权失败由 http 层的 unauthorized 回调统一处理（清 token + 跳登录）
    }
  }
});
</script>

<template>
  <div class="merchant-page">
    <aside class="merchant-aside">
      <div class="merchant-shop">
        <div class="merchant-shop-name">
          {{ auth.merchant?.shopName || '尚未入驻' }}
        </div>
        <div class="merchant-shop-meta">
          {{ auth.member?.phone || '' }}
          <span v-if="auth.merchant" class="tag tag-on">营业中</span>
          <span v-else class="tag tag-off">未入驻</span>
        </div>
      </div>

      <nav class="merchant-nav">
        <button
          v-for="item in navItems"
          :key="item.name"
          type="button"
          :class="{ active: activeName === item.name }"
          @click="go(item.name)"
        >
          {{ item.label }}
        </button>
      </nav>

      <button type="button" class="merchant-logout" @click="logout">退出登录</button>
    </aside>

    <section class="merchant-main">
      <RouterView />
    </section>
  </div>
</template>
```

- [ ] **Step 4: 创建 `src/styles/merchant.scss`（商家区全局样式，视图不再写 scoped 样式）**

```scss
// 商家区样式：类名前缀 merchant- / m- 避免与游客站冲突
.merchant-page {
  display: flex;
  gap: 20px;
  max-width: 1160px;
  margin: 24px auto;
  padding: 0 20px;
  align-items: flex-start;
}

.merchant-aside {
  flex: 0 0 200px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 16px;
  position: sticky;
  top: 84px;
}
.merchant-shop-name {
  font-weight: 700;
  color: var(--green-900);
  font-size: 16px;
  margin-bottom: 6px;
}
.merchant-shop-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 14px;
}
.tag {
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 12px;
}
.tag-on {
  color: var(--green-500);
  background: var(--green-100);
}
.tag-off {
  color: var(--gold-600);
  background: #fff7ec;
}
.merchant-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}
.merchant-nav button {
  text-align: left;
  border: 0;
  background: transparent;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--ink);
}
.merchant-nav button.active,
.merchant-nav button:hover {
  background: var(--green-700);
  color: #fff;
}
.merchant-logout {
  width: 100%;
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 8px;
  padding: 8px 0;
  font-size: 13px;
  color: var(--muted);
}

.merchant-main {
  flex: 1;
  min-width: 0;
}

.m-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 20px;
  margin-bottom: 16px;
}
.m-card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  font-size: 18px;
  color: var(--green-900);
}
.m-card-title .m-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.m-btn {
  border: 1px solid var(--green-700);
  background: var(--green-700);
  color: #fff;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
}
.m-btn:hover {
  opacity: 0.9;
}
.m-btn-ghost {
  background: #fff;
  color: var(--green-700);
}
.m-btn-danger {
  background: #fff;
  color: var(--gold-600);
  border-color: #e6b4ad;
}
.m-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.m-form-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}
.m-form-row > label {
  font-size: 13px;
  color: var(--muted);
}
.m-form-row input,
.m-form-row select,
.m-form-row textarea {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--ink);
  background: #fff;
}
.m-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 16px;
}
.m-form-actions {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

.m-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.m-table th,
.m-table td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid var(--line);
}
.m-table th {
  color: var(--muted);
  font-weight: 500;
  font-size: 13px;
}

.m-state {
  padding: 26px 16px;
  text-align: center;
  color: var(--muted);
  font-size: 14px;
}
.m-error {
  color: var(--gold-600);
}
.m-hint {
  font-size: 13px;
  color: var(--muted);
}
.m-required {
  color: var(--gold-600);
  margin-left: 2px;
}
```

- [ ] **Step 5: 改 `src/main.ts` 挂载样式 + 鉴权回调**

```ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import { setAuthToken, setUnauthorizedHandler } from './api/http';
import './styles/base.scss';
import './styles/merchant.scss';

const app = createApp(App).use(createPinia()).use(router);

// 恢复持久化 token → http 层；鉴权失效时清登录态并跳登录页
const auth = useAuthStore();
setAuthToken(auth.token || null);
setUnauthorizedHandler(() => {
  auth.logout();
  if (router.currentRoute.value.path !== '/login') {
    router.push({ name: 'login' });
  }
});

app.mount('#app');
```

- [ ] **Step 6: 改 `src/router/index.ts`（新增 /login 与 /merchant，含守卫）**

```ts
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/home/HomeView.vue';
import HotelListView from '../views/accommodation/HotelListView.vue';
import HotelDetailView from '../views/accommodation/HotelDetailView.vue';
import MerchantShell from '../views/merchant/MerchantShell.vue';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/hotels', name: 'hotels', component: HotelListView },
    { path: '/hotels/:id', name: 'hotel-detail', component: HotelDetailView },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    {
      path: '/merchant',
      name: 'merchant',
      component: MerchantShell,
      meta: { requiresAuth: true },
      children: [
        // 后续 Task 逐个追加子路由（只改这一段）
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

// 登录守卫：/merchant/** 需要登录态；未登录跳登录页并记住来源
router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  return true;
});

export default router;
```

> 说明：`/merchant` 没有 `redirect` 与空 children，`/merchant` 本身只渲染外壳；**Task 12 会追加
> `{ path: '', name: 'merchant-home', component: ... }` 与 apply 子路由**，Task 13–16 追加其余子路由。

- [ ] **Step 7: 创建 `src/views/LoginView.vue`（本 Task 只做最小可用版，Task 10 再补样式与注册表单）**

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const form = reactive({ phone: '', password: '' });
const submitting = ref(false);
const error = ref('');

async function submit(): Promise<void> {
  error.value = '';
  if (!form.phone || !form.password) {
    error.value = '请填写手机号与密码';
    return;
  }
  submitting.value = true;
  try {
    await auth.login(form.phone, form.password);
    const redirect = String(route.query.redirect || '/merchant');
    await router.replace(redirect);
  } catch (e) {
    error.value = e instanceof Error ? e.message : '登录失败';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <main class="container">
    <section class="m-card" style="max-width: 380px; margin: 40px auto">
      <h2 class="m-card-title">商家登录</h2>
      <form @submit.prevent="submit">
        <div class="m-form-row">
          <label>手机号</label>
          <input v-model="form.phone" type="tel" placeholder="请输入手机号" />
        </div>
        <div class="m-form-row">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </div>
        <p v-if="error" class="m-state m-error">{{ error }}</p>
        <div class="m-form-actions">
          <button class="m-btn" type="submit" :disabled="submitting">
            {{ submitting ? '登录中…' : '登录' }}
          </button>
        </div>
      </form>
    </section>
  </main>
</template>
```

- [ ] **Step 8: 改 `src/App.vue` 顶栏加「商家中心」入口**

在 `<script setup>` 的 `navItems` 之后加：

```ts
function goMerchant(): void {
  router.push('/merchant');
}
```

在 `<nav class="nav">` 之后、`<span class="badge-coming">` 之前插入：

```html
        <button type="button" class="merchant-entry" @click="goMerchant">商家中心</button>
```

并在 `<style>` 里（`App.vue` 目前无 style 块，用下面这段新建在文件末尾）：

```vue
<style scoped>
.merchant-entry {
  border: 1px solid var(--green-700);
  background: #fff;
  color: var(--green-700);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
}
.merchant-entry:hover {
  background: var(--green-700);
  color: #fff;
}
</style>
```

- [ ] **Step 9: 运行测试确认通过**

Run: `npm run test`
Expected: PASS（含 router 守卫 3 个用例）。

> 注意：`router/index.spec.ts` 用的 `createWebHistory()` 在 jsdom 下可用；若 `router.replace('/')`
> 因初始 URL 为 `about:blank` 报警告，可在测试里先 `window.history.pushState({}, '', '/')`。
> **若出现该警告，就在 `beforeEach` 第一行加上这句**。

- [ ] **Step 10: 类型检查 + 启动 dev 目视确认**

Run: `npm run type-check`
Expected: 无错误。

Run（另开终端，后端 8001 需在跑）：`npm run dev`
Expected: 顶栏出现「商家中心」；点击后未登录会跳到 `/login`。

- [ ] **Step 11: Commit**

```bash
cd wudong-web
git add src/router/index.ts src/router/index.spec.ts src/views/merchant/MerchantShell.vue \
  src/views/LoginView.vue src/styles/merchant.scss src/main.ts src/App.vue
git commit -m "feat(merchant): 商家区路由/登录守卫/外壳与全局鉴权回调"
```

---

## Task 10: 登录页补注册与验证码

**Files:**
- Modify: `wudong-web/src/views/LoginView.vue`
- Test: `wudong-web/src/views/LoginView.spec.ts`

**Interfaces:**
- Consumes: `useAuthStore.login/registerAndLogin`（Task 8）、`sendSmsCode`（Task 8）。
- Produces: 登录页支持「登录 / 注册」两态，注册态可发送验证码（本地/测试环境后端返回 `{code}`，页面回填并提示）。

- [ ] **Step 1: 写失败测试 `src/views/LoginView.spec.ts`**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import LoginView from './LoginView.vue';
import { loginByPassword, register, sendSmsCode, memberInfo } from '@/api/auth';
import { merchantMy } from '@/api/merchant';

vi.mock('@/api/auth', () => ({
  loginByPassword: vi.fn(),
  register: vi.fn(),
  sendSmsCode: vi.fn(),
  memberInfo: vi.fn(),
}));
vi.mock('@/api/merchant', () => ({ merchantMy: vi.fn() }));

const merchantFixture = {
  id: 1,
  userId: 1,
  username: 'm1',
  shopName: '乌东苗寨木楼',
  module: 'accommodation',
  contactName: '杨阿妹',
  contactPhone: '13300133001',
  status: 1,
};

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
  vi.mocked(loginByPassword).mockReset();
  vi.mocked(register).mockReset();
  vi.mocked(sendSmsCode).mockReset();
  vi.mocked(memberInfo).mockReset().mockResolvedValue({
    id: 1,
    phone: '13300133001',
    role: 2,
  });
  vi.mocked(merchantMy).mockReset().mockResolvedValue(merchantFixture);
});

async function mountView(redirect?: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/login', name: 'login', component: LoginView },
      { path: '/merchant', name: 'merchant', component: { template: '<div>merchant</div>' } },
      { path: '/', name: 'home', component: { template: '<div>home</div>' } },
    ],
  });
  await router.push({ path: '/login', query: redirect ? { redirect } : {} });
  await router.isReady();
  const wrapper = mount(LoginView, { global: { plugins: [router] } });
  return { wrapper, router };
}

describe('LoginView', () => {
  it('密码登录成功后跳转到 redirect 指定的页面', async () => {
    vi.mocked(loginByPassword).mockResolvedValue({ token: 'jwt-1' });
    const { wrapper, router } = await mountView('/merchant/hotels');

    await wrapper.find('input[type="tel"]').setValue('13300133001');
    await wrapper.find('input[type="password"]').setValue('abc123456');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(loginByPassword).toHaveBeenCalledWith('13300133001', 'abc123456');
    expect(router.currentRoute.value.path).toBe('/merchant/hotels');
  });

  it('未带 redirect 时登录后进入商家区', async () => {
    vi.mocked(loginByPassword).mockResolvedValue({ token: 'jwt-1' });
    const { wrapper, router } = await mountView();
    await wrapper.find('input[type="tel"]').setValue('13300133001');
    await wrapper.find('input[type="password"]').setValue('abc123456');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(router.currentRoute.value.path).toBe('/merchant');
  });

  it('登录失败展示后端 message 且不跳转', async () => {
    vi.mocked(loginByPassword).mockRejectedValue(new Error('手机号或密码错误'));
    const { wrapper, router } = await mountView('/merchant');
    await wrapper.find('input[type="tel"]').setValue('13300133001');
    await wrapper.find('input[type="password"]').setValue('bad');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(wrapper.text()).toContain('手机号或密码错误');
    expect(router.currentRoute.value.path).toBe('/login');
  });

  it('切换到注册态显示验证码字段', async () => {
    const { wrapper } = await mountView();
    expect(wrapper.find('.sms-code-input').exists()).toBe(false);
    const registerTab = wrapper
      .findAll('.login-tab button')
      .find((b) => b.text().includes('注册'));
    await registerTab!.trigger('click');
    expect(wrapper.find('.sms-code-input').exists()).toBe(true);
  });

  it('发送验证码后提示并回填（本地环境后端直接回验证码）', async () => {
    vi.mocked(sendSmsCode).mockResolvedValue({ code: '123456' });
    const { wrapper } = await mountView();
    const registerTab = wrapper
      .findAll('.login-tab button')
      .find((b) => b.text().includes('注册'));
    await registerTab!.trigger('click');
    await wrapper.find('input[type="tel"]').setValue('13300133001');

    await wrapper.find('.send-code').trigger('click');
    await flushPromises();

    expect(sendSmsCode).toHaveBeenCalledWith('13300133001');
    expect(wrapper.text()).toContain('123456');
    expect(
      (wrapper.find('.sms-code-input').element as HTMLInputElement).value
    ).toBe('123456');
  });

  it('注册成功后进入商家区', async () => {
    vi.mocked(register).mockResolvedValue({ token: 'jwt-reg' });
    const { wrapper, router } = await mountView('/merchant');
    const registerTab = wrapper
      .findAll('.login-tab button')
      .find((b) => b.text().includes('注册'));
    await registerTab!.trigger('click');
    await wrapper.find('input[type="tel"]').setValue('13300133002');
    await wrapper.find('.sms-code-input').setValue('123456');
    await wrapper.find('input[type="password"]').setValue('abc123456');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(register).toHaveBeenCalledWith({
      phone: '13300133002',
      smsCode: '123456',
      password: 'abc123456',
    });
    expect(router.currentRoute.value.path).toBe('/merchant');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- src/views/LoginView.spec.ts`
Expected: FAIL — 无 `.login-tab` / `.sms-code-input`。

- [ ] **Step 3: 用下面的实现替换 `src/views/LoginView.vue`**

```vue
<script setup lang="ts">
// 商家登录页：登录 / 注册 两态。注册需短信验证码；本地与测试环境后端把验证码放在
// 返回值里（无短信通道），因此发送后直接回填并提示，方便演示与联调。
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { sendSmsCode } from '@/api/auth';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const mode = ref<'login' | 'register'>('login');
const form = reactive({ phone: '', password: '', smsCode: '' });
const submitting = ref(false);
const sending = ref(false);
const error = ref('');
const notice = ref('');

const submitLabel = computed(() =>
  mode.value === 'login' ? '登录' : '注册并登录'
);

function switchMode(next: 'login' | 'register'): void {
  mode.value = next;
  error.value = '';
  notice.value = '';
}

/** 本地环境后端会直接返回验证码，回填+提示；线上（无 code）则提示去查短信 */
async function onSendCode(): Promise<void> {
  error.value = '';
  notice.value = '';
  if (!form.phone) {
    error.value = '请先填写手机号';
    return;
  }
  sending.value = true;
  try {
    const result = await sendSmsCode(form.phone);
    if (result?.code) {
      form.smsCode = result.code;
      notice.value = `验证码已发送（当前环境验证码：${result.code}）`;
    } else {
      notice.value = '验证码已发送，请查看短信';
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : '验证码发送失败';
  } finally {
    sending.value = false;
  }
}

async function submit(): Promise<void> {
  error.value = '';
  if (!form.phone || !form.password) {
    error.value = '请填写手机号与密码';
    return;
  }
  if (mode.value === 'register' && !form.smsCode) {
    error.value = '请填写短信验证码';
    return;
  }
  submitting.value = true;
  try {
    if (mode.value === 'login') {
      await auth.login(form.phone, form.password);
    } else {
      await auth.registerAndLogin({
        phone: form.phone,
        smsCode: form.smsCode,
        password: form.password,
      });
    }
    const redirect = String(route.query.redirect || '/merchant');
    await router.replace(redirect);
  } catch (e) {
    error.value = e instanceof Error ? e.message : '操作失败，请稍后重试';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <main class="container">
    <section class="m-card login-card">
      <h2 class="m-card-title">商家中心</h2>

      <div class="login-tab">
        <button
          type="button"
          :class="{ active: mode === 'login' }"
          @click="switchMode('login')"
        >
          登录
        </button>
        <button
          type="button"
          :class="{ active: mode === 'register' }"
          @click="switchMode('register')"
        >
          注册
        </button>
      </div>

      <form @submit.prevent="submit">
        <div class="m-form-row">
          <label>手机号<span class="m-required">*</span></label>
          <input v-model="form.phone" type="tel" placeholder="请输入手机号" />
        </div>

        <div v-if="mode === 'register'" class="m-form-row">
          <label>短信验证码<span class="m-required">*</span></label>
          <div class="sms-code-row">
            <input
              v-model="form.smsCode"
              class="sms-code-input"
              type="text"
              placeholder="请输入验证码"
            />
            <button
              type="button"
              class="m-btn m-btn-ghost send-code"
              :disabled="sending"
              @click="onSendCode"
            >
              {{ sending ? '发送中…' : '获取验证码' }}
            </button>
          </div>
        </div>

        <div class="m-form-row">
          <label>密码<span class="m-required">*</span></label>
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </div>

        <p v-if="notice" class="m-hint">{{ notice }}</p>
        <p v-if="error" class="m-state m-error">{{ error }}</p>

        <div class="m-form-actions">
          <button class="m-btn" type="submit" :disabled="submitting">
            {{ submitting ? '提交中…' : submitLabel }}
          </button>
        </div>
      </form>

      <p class="m-hint login-foot">
        商家中心面向入驻商户；游客浏览请返回
        <router-link to="/">首页</router-link>。
      </p>
    </section>
  </main>
</template>

<style scoped>
.login-card {
  max-width: 400px;
  margin: 40px auto;
}
.login-tab {
  display: flex;
  gap: 6px;
  margin-bottom: 18px;
}
.login-tab button {
  flex: 1;
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: var(--muted);
}
.login-tab button.active {
  border-color: var(--green-700);
  background: var(--green-700);
  color: #fff;
}
.sms-code-row {
  display: flex;
  gap: 8px;
}
.sms-code-row input {
  flex: 1;
  min-width: 0;
}
.login-foot {
  margin: 16px 0 0;
}
.login-foot a {
  color: var(--green-500);
  text-decoration: underline;
}
</style>
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npm run test -- src/views/LoginView.spec.ts`
Expected: PASS（6 个用例）。

- [ ] **Step 5: 类型检查 + Commit**

Run: `npm run type-check` → 无错误。

```bash
cd wudong-web
git add src/views/LoginView.vue src/views/LoginView.spec.ts
git commit -m "feat(merchant): 登录页补注册与验证码"
```

---

## Task 11: 图片上传与标签输入组件

**Files:**
- Modify: `wudong-web/src/api/http.ts`（导出 `authHeader()` 供 FormData 上传复用）
- Create: `wudong-web/src/api/upload.ts`
- Create: `wudong-web/src/components/ImageUploader.vue`
- Create: `wudong-web/src/components/TagInput.vue`
- Test: `wudong-web/src/components/ImageUploader.spec.ts`
- Test: `wudong-web/src/components/TagInput.spec.ts`

**Interfaces:**
- Consumes: `USE_MOCK`、`ApiError`。
- Produces:
  - `authHeader(): Record<string, string>`（`src/api/http.ts` 新增导出）
  - `uploadImage(file: File): Promise<string>`（`src/api/upload.ts`）
  - `ImageUploader` 组件：props `{ modelValue: string[]; max?: number; label?: string }`，emits `update:modelValue`
  - `TagInput` 组件：props `{ modelValue: string[]; placeholder?: string; suggestions?: string[] }`，emits `update:modelValue`

- [ ] **Step 1: 写失败测试 `src/components/TagInput.spec.ts`**

```ts
// 注意：本文件不用 vi，故不 import（tsconfig 的 noUnusedLocals 会让未用的 import 报 TS6133）
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TagInput from './TagInput.vue';

const mountInput = (modelValue: string[] = [], suggestions: string[] = []) =>
  mount(TagInput, { props: { modelValue, suggestions } });

describe('TagInput', () => {
  it('回车添加标签并清空输入框', async () => {
    const wrapper = mountInput();
    const input = wrapper.find('input');
    await input.setValue('苗寨');
    await input.trigger('keydown.enter');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['苗寨']]);
    expect((input.element as HTMLInputElement).value).toBe('');
  });

  it('逗号也触发添加', async () => {
    const wrapper = mountInput();
    const input = wrapper.find('input');
    await input.setValue('江景');
    await input.trigger('keydown', { key: ',' });
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['江景']]);
  });

  it('重复标签不重复添加', async () => {
    const wrapper = mountInput(['苗寨']);
    const input = wrapper.find('input');
    await input.setValue('苗寨');
    await input.trigger('keydown.enter');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('空白输入被忽略', async () => {
    const wrapper = mountInput();
    const input = wrapper.find('input');
    await input.setValue('   ');
    await input.trigger('keydown.enter');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('点击 × 删除标签', async () => {
    const wrapper = mountInput(['苗寨', '江景']);
    const tags = wrapper.findAll('.tag-item');
    expect(tags.length).toBe(2);
    await tags[0].find('button').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['江景']]);
  });

  it('点击推荐标签直接添加', async () => {
    const wrapper = mountInput([], ['WiFi', '空调']);
    const chip = wrapper.findAll('.tag-suggestion')[0];
    expect(chip.text()).toBe('WiFi');
    await chip.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['WiFi']]);
  });
});
```

- [ ] **Step 2: 写失败测试 `src/components/ImageUploader.spec.ts`**

```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import ImageUploader from './ImageUploader.vue';
import { uploadImage } from '@/api/upload';

vi.mock('@/api/upload', () => ({ uploadImage: vi.fn() }));

afterEach(() => {
  vi.mocked(uploadImage).mockReset();
});

/** 构造一个选择文件的 change 事件 */
const pickFile = (wrapper: any, name = 'a.png') => {
  const input = wrapper.find('input[type="file"]');
  const file = new File(['x'], name, { type: 'image/png' });
  Object.defineProperty(input.element, 'files', { value: [file], configurable: true });
  return input.trigger('change');
};

describe('ImageUploader', () => {
  it('选择文件后上传并追加到 modelValue', async () => {
    vi.mocked(uploadImage).mockResolvedValue('http://img/a.png');
    const wrapper = mount(ImageUploader, { props: { modelValue: [] } });
    await pickFile(wrapper);
    await flushPromises();
    expect(uploadImage).toHaveBeenCalledTimes(1);
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([
      ['http://img/a.png'],
    ]);
  });

  it('已达 max 时不再展示上传入口', async () => {
    const wrapper = mount(ImageUploader, {
      props: { modelValue: ['a.jpg'], max: 1 },
    });
    expect(wrapper.find('input[type="file"]').exists()).toBe(false);
  });

  it('删除图片后 emit 剩余列表', async () => {
    const wrapper = mount(ImageUploader, {
      props: { modelValue: ['a.jpg', 'b.jpg'] },
    });
    await wrapper.findAll('.image-remove')[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['a.jpg']]);
  });

  it('上传失败时展示错误且不写入 modelValue', async () => {
    vi.mocked(uploadImage).mockRejectedValue(new Error('上传失败'));
    const wrapper = mount(ImageUploader, { props: { modelValue: [] } });
    await pickFile(wrapper);
    await flushPromises();
    expect(wrapper.text()).toContain('上传失败');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });
});
```

- [ ] **Step 3: 运行测试确认失败**

Run: `npm run test -- src/components/TagInput.spec.ts src/components/ImageUploader.spec.ts`
Expected: FAIL — 两个组件文件不存在。

- [ ] **Step 4: 在 `src/api/http.ts` 末尾追加 `authHeader`**

```ts
/** 当前鉴权头（供 FormData 上传等需要自建 fetch 的场景复用；未登录返回 {}） */
export const authHeader = (): Record<string, string> =>
  authToken ? { Authorization: authToken } : {};
```

- [ ] **Step 5: 创建 `src/api/upload.ts`**

```ts
// 图片上传：真实后端走 /app/base/comm/upload（multipart，字段名 file）；
// mock 模式把文件读成 dataURL（本地即可预览，无需后端）。
// 后端各上传插件返回形态不一致，这里统一兼容 string / {url} / {path}。
import { USE_MOCK } from '../env';
import { ApiError, authHeader } from './http';

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('图片读取失败'));
    reader.readAsDataURL(file);
  });

/** 从上传结果里取出 URL（兼容多种插件返回形态） */
export const pickUploadUrl = (data: unknown): string => {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    for (const key of ['url', 'path', 'src']) {
      if (typeof record[key] === 'string') return record[key] as string;
    }
  }
  return '';
};

export const uploadImage = async (file: File): Promise<string> => {
  if (USE_MOCK) return fileToDataUrl(file);

  const form = new FormData();
  form.append('file', file);
  const res = await fetch('/app/base/comm/upload', {
    method: 'POST',
    headers: authHeader(),
    body: form,
  });
  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}`, res.status);
  }
  const json = (await res.json()) as { code: number; message?: string; data?: unknown };
  if (json.code !== 1000) {
    throw new ApiError(json.message || '图片上传失败', json.code);
  }
  const url = pickUploadUrl(json.data);
  if (!url) throw new ApiError('图片上传失败：返回结果缺少地址');
  return url;
};
```

- [ ] **Step 6: 创建 `src/components/TagInput.vue`**

```vue
<script setup lang="ts">
// 标签数组输入：回车/逗号添加，点 × 删除，可点推荐标签直接添加。去重且忽略空白。
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    placeholder?: string;
    suggestions?: string[];
  }>(),
  { placeholder: '输入后回车添加', suggestions: () => [] }
);

const emit = defineEmits<{ 'update:modelValue': [string[]] }>();

const draft = ref('');

function add(tag: string): void {
  const value = tag.trim();
  if (!value || props.modelValue.includes(value)) return;
  emit('update:modelValue', [...props.modelValue, value]);
}

function onEnter(): void {
  add(draft.value);
  draft.value = '';
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === ',' || event.key === '，') {
    event.preventDefault();
    onEnter();
  }
}

function remove(index: number): void {
  const next = props.modelValue.slice();
  next.splice(index, 1);
  emit('update:modelValue', next);
}
</script>

<template>
  <div class="tag-input">
    <div class="tag-list">
      <span v-for="(tag, index) in modelValue" :key="tag" class="tag-item">
        {{ tag }}
        <button type="button" @click="remove(index)">×</button>
      </span>
    </div>

    <input
      v-model="draft"
      type="text"
      :placeholder="placeholder"
      @keydown.enter.prevent="onEnter"
      @keydown="onKeydown"
    />

    <div v-if="suggestions.length" class="tag-suggestions">
      <button
        v-for="item in suggestions"
        :key="item"
        type="button"
        class="tag-suggestion"
        :disabled="modelValue.includes(item)"
        @click="add(item)"
      >
        {{ item }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.tag-input input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 14px;
  font-family: inherit;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}
.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--green-100);
  color: var(--green-700);
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 13px;
}
.tag-item button {
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 14px;
  line-height: 1;
  padding: 0;
}
.tag-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
.tag-suggestion {
  border: 1px dashed var(--line);
  background: #fff;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 12px;
  color: var(--muted);
}
.tag-suggestion:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
```

- [ ] **Step 7: 创建 `src/components/ImageUploader.vue`**

```vue
<script setup lang="ts">
// 图片上传：点选文件 → 上传成功即追加 URL；最多 max 张（默认 6）。
import { computed, ref } from 'vue';
import { uploadImage } from '@/api/upload';

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    max?: number;
    label?: string;
  }>(),
  { max: 6, label: '上传图片' }
);

const emit = defineEmits<{ 'update:modelValue': [string[]] }>();

const uploading = ref(false);
const error = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

const canUpload = computed(() => props.modelValue.length < props.max);

async function onChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);
  if (!files.length) return;

  error.value = '';
  uploading.value = true;
  try {
    const urls: string[] = [];
    for (const file of files.slice(0, props.max - props.modelValue.length)) {
      urls.push(await uploadImage(file));
    }
    emit('update:modelValue', [...props.modelValue, ...urls]);
  } catch (e) {
    error.value = e instanceof Error ? e.message : '图片上传失败';
  } finally {
    uploading.value = false;
    input.value = ''; // 允许重复选择同一文件
  }
}

function remove(index: number): void {
  const next = props.modelValue.slice();
  next.splice(index, 1);
  emit('update:modelValue', next);
}
</script>

<template>
  <div class="image-uploader">
    <div class="image-list">
      <div v-for="(url, index) in modelValue" :key="`${url}-${index}`" class="image-item">
        <img :src="url" alt="" />
        <button type="button" class="image-remove" @click="remove(index)">×</button>
      </div>
    </div>

    <label v-if="canUpload" class="image-pick">
      <input ref="inputRef" type="file" accept="image/*" multiple @change="onChange" />
      <span>{{ uploading ? '上传中…' : label }}</span>
    </label>

    <p v-if="error" class="m-state m-error">{{ error }}</p>
  </div>
</template>

<style scoped>
.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}
.image-item {
  position: relative;
  width: 88px;
  height: 66px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--line);
}
.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.image-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  border: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 12px;
  line-height: 1;
  padding: 0;
}
.image-pick input {
  display: none;
}
.image-pick span {
  display: inline-block;
  border: 1px dashed var(--line);
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  color: var(--muted);
  cursor: pointer;
}
.image-pick span:hover {
  border-color: var(--green-500);
  color: var(--green-700);
}
</style>
```

- [ ] **Step 8: 运行测试确认通过**

Run: `npm run test`
Expected: PASS（含 TagInput 6 个 + ImageUploader 4 个）。

- [ ] **Step 9: 类型检查 + Commit**

Run: `npm run type-check` → 无错误。

```bash
cd wudong-web
git add src/api/http.ts src/api/upload.ts src/components/ImageUploader.vue \
  src/components/ImageUploader.spec.ts src/components/TagInput.vue \
  src/components/TagInput.spec.ts
git commit -m "feat(merchant): 图片上传与标签输入组件"
```

---

## Task 12: 商家首页与入驻申请（三态）

**Files:**
- Create: `wudong-web/src/utils/merchant.ts`
- Create: `wudong-web/src/views/merchant/MerchantHomeView.vue`
- Create: `wudong-web/src/views/merchant/MerchantApplyView.vue`
- Modify: `wudong-web/src/router/index.ts`（在 `/merchant` 的 `children` 里追加两行）
- Test: `wudong-web/src/views/merchant/MerchantHomeView.spec.ts`
- Test: `wudong-web/src/views/merchant/MerchantApplyView.spec.ts`

**Interfaces:**
- Consumes: `merchantMy/merchantApplication/merchantApply`（Task 7）、`useAuthStore`（Task 8）、`ImageUploader`（Task 11）。
- Produces:
  - `src/utils/merchant.ts`：`MODULE_LABELS: Record<string, string>`、`MODULE_OPTIONS: { value: string; label: string }[]`、`APPLICATION_STATUS_TEXT: Record<number, string>`、`moduleLabel(module: string): string`、`applicationStatusText(status: number): string`
  - 路由：`merchant-home`（`''`）、`merchant-apply`（`'apply'`）

- [ ] **Step 1: 写失败测试 `src/views/merchant/MerchantHomeView.spec.ts`**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MerchantHomeView from './MerchantHomeView.vue';
import { merchantApplication, merchantMy } from '@/api/merchant';
import { useAuthStore } from '@/stores/auth';

vi.mock('@/api/merchant', () => ({
  merchantApplication: vi.fn(),
  merchantMy: vi.fn(),
}));

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
  vi.mocked(merchantMy).mockReset().mockResolvedValue(null);
  vi.mocked(merchantApplication).mockReset().mockResolvedValue(null);
});

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/merchant', name: 'merchant-home', component: MerchantHomeView },
      { path: '/merchant/apply', name: 'merchant-apply', component: { template: '<div>apply</div>' } },
      { path: '/merchant/hotels', name: 'merchant-hotels', component: { template: '<div>hotels</div>' } },
    ],
  });
  await router.push('/merchant');
  await router.isReady();
  const wrapper = mount(MerchantHomeView, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

describe('MerchantHomeView', () => {
  it('已入驻：展示店铺信息与「我的民宿」入口', async () => {
    vi.mocked(merchantMy).mockResolvedValue({
      id: 1,
      userId: 1,
      username: 'm1',
      shopName: '乌东苗寨木楼',
      module: 'accommodation',
      contactName: '杨阿妹',
      contactPhone: '13300133001',
      status: 1,
      joinedAt: '2026-09-01 10:00:00',
    });
    const { wrapper } = await mountView();

    expect(wrapper.text()).toContain('乌东苗寨木楼');
    expect(wrapper.text()).toContain('住宿');
    expect(wrapper.text()).toContain('我的民宿');
    expect(wrapper.find('.go-apply').exists()).toBe(false);
  });

  it('未入驻且有待审核申请：提示审核中并可查看', async () => {
    vi.mocked(merchantApplication).mockResolvedValue({
      id: 9,
      shopName: '苗银世家',
      module: 'accommodation',
      contactName: '张三',
      contactPhone: '13300133001',
      idCard: '522301199001010011',
      status: 1,
    });
    const { wrapper } = await mountView();

    expect(wrapper.text()).toContain('待审核');
    expect(wrapper.text()).toContain('苗银世家');
    // 审核中态渲染的是「入驻进度」卡片，其中只有「查看入驻申请」按钮；
    // 「我的民宿」入口只出现在已入驻态（本用例 merchantMy 为 null，渲染不到那里）。
    expect(wrapper.text()).toContain('查看入驻申请');
  });

  it('未入驻且无申请：引导去入驻申请', async () => {
    const { wrapper, router } = await mountView();
    expect(wrapper.text()).toContain('尚未入驻');
    const button = wrapper.find('.go-apply');
    expect(button.exists()).toBe(true);
    await button.trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.path).toBe('/merchant/apply');
  });

  it('申请被驳回：展示驳回原因', async () => {
    vi.mocked(merchantApplication).mockResolvedValue({
      id: 9,
      shopName: '苗银世家',
      module: 'accommodation',
      contactName: '张三',
      contactPhone: '13300133001',
      idCard: '522301199001010011',
      status: 3,
      auditResult: '营业执照不清晰',
    });
    const { wrapper } = await mountView();
    expect(wrapper.text()).toContain('已驳回');
    expect(wrapper.text()).toContain('营业执照不清晰');
  });

  it('加载后同步店铺信息到 auth store', async () => {
    vi.mocked(merchantMy).mockResolvedValue({
      id: 2,
      userId: 1,
      username: 'm1',
      shopName: '银饰工坊',
      module: 'accommodation',
      contactName: '李四',
      contactPhone: '13300133002',
      status: 1,
    });
    const { wrapper } = await mountView();
    const auth = useAuthStore();
    expect(auth.merchant?.shopName).toBe('银饰工坊');
    expect(wrapper.text()).toContain('银饰工坊');
  });

  it('接口失败展示错误提示', async () => {
    vi.mocked(merchantMy).mockRejectedValue(new Error('登录失效~'));
    const { wrapper } = await mountView();
    expect(wrapper.text()).toContain('登录失效');
  });
});
```

- [ ] **Step 2: 写失败测试 `src/views/merchant/MerchantApplyView.spec.ts`**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MerchantApplyView from './MerchantApplyView.vue';
import ImageUploader from '@/components/ImageUploader.vue';
import { merchantApplication, merchantApply, merchantMy } from '@/api/merchant';

// 注意：本文件不用 useAuthStore，故不 import（noUnusedLocals 会让未用的 import 报 TS6133）
vi.mock('@/api/merchant', () => ({
  merchantApplication: vi.fn(),
  merchantApply: vi.fn(),
  merchantMy: vi.fn(),
}));

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
  vi.mocked(merchantMy).mockReset().mockResolvedValue(null);
  vi.mocked(merchantApplication).mockReset().mockResolvedValue(null);
  vi.mocked(merchantApply).mockReset().mockResolvedValue(true);
});

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/merchant/apply', name: 'merchant-apply', component: MerchantApplyView },
      { path: '/merchant', name: 'merchant-home', component: { template: '<div>home</div>' } },
    ],
  });
  await router.push('/merchant/apply');
  await router.isReady();
  const wrapper = mount(MerchantApplyView, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

/** 填写文本类必填项（模块保持默认 accommodation） */
async function fillForm(wrapper: any) {
  await wrapper.find('.field-shopName input').setValue('苗银世家');
  await wrapper.find('.field-contactName input').setValue('张三');
  await wrapper.find('.field-contactPhone input').setValue('13300133001');
  await wrapper.find('.field-idCard input').setValue('522301199001010011');
}

/** 三张证件图：直接触发 ImageUploader 的 v-model 回写（不走真实上传） */
async function fillImages(wrapper: any) {
  for (const uploader of wrapper.findAllComponents(ImageUploader)) {
    await uploader.vm.$emit('update:modelValue', ['http://img/x.png']);
  }
  await flushPromises();
}

describe('MerchantApplyView', () => {
  it('无申请：展示申请表单且默认住宿模块', async () => {
    const { wrapper } = await mountView();
    expect(wrapper.find('.apply-form').exists()).toBe(true);
    expect(
      (wrapper.find('.field-module select').element as HTMLSelectElement).value
    ).toBe('accommodation');
  });

  it('必填缺失时不提交并提示', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.apply-form').trigger('submit');
    await flushPromises();
    expect(merchantApply).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('请填写完整的入驻信息');
  });

  it('提交成功后展示待审核状态', async () => {
    // 提交成功后页面会重新 load()，此时应查到一条待审核申请
    vi.mocked(merchantApply).mockImplementation(async () => {
      vi.mocked(merchantApplication).mockResolvedValue({
        id: 9,
        shopName: '苗银世家',
        module: 'accommodation',
        contactName: '张三',
        contactPhone: '13300133001',
        idCard: '522301199001010011',
        status: 1,
      });
      return true;
    });

    const { wrapper } = await mountView();
    // 图片经 ImageUploader 的 v-model 写入：直接触发子组件 emit
    await fillImages(wrapper);
    await fillForm(wrapper);
    await flushPromises();
    await wrapper.find('.apply-form').trigger('submit');
    await flushPromises();

    expect(merchantApply).toHaveBeenCalledWith(
      expect.objectContaining({
        shopName: '苗银世家',
        module: 'accommodation',
        idCardFront: 'http://img/x.png',
        idCardBack: 'http://img/x.png',
        businessLicense: 'http://img/x.png',
      })
    );
    expect(wrapper.text()).toContain('待审核');
  });

  it('已入驻：提示已入驻且不展示表单', async () => {
    vi.mocked(merchantMy).mockResolvedValue({
      id: 1,
      userId: 1,
      username: 'm1',
      shopName: '乌东苗寨木楼',
      module: 'accommodation',
      contactName: '杨阿妹',
      contactPhone: '13300133001',
      status: 1,
    });
    const { wrapper } = await mountView();
    expect(wrapper.find('.apply-form').exists()).toBe(false);
    expect(wrapper.text()).toContain('已入驻');
  });

  it('待审核申请：展示审核中并隐藏表单', async () => {
    vi.mocked(merchantApplication).mockResolvedValue({
      id: 9,
      shopName: '苗银世家',
      module: 'accommodation',
      contactName: '张三',
      contactPhone: '13300133001',
      idCard: '522301199001010011',
      status: 1,
    });
    const { wrapper } = await mountView();
    expect(wrapper.find('.apply-form').exists()).toBe(false);
    expect(wrapper.text()).toContain('待审核');
  });

  it('驳回后可重新提交并展示驳回原因', async () => {
    vi.mocked(merchantApplication).mockResolvedValue({
      id: 9,
      shopName: '苗银世家',
      module: 'accommodation',
      contactName: '张三',
      contactPhone: '13300133001',
      idCard: '522301199001010011',
      status: 3,
      auditResult: '营业执照不清晰',
    });
    const { wrapper } = await mountView();
    expect(wrapper.text()).toContain('营业执照不清晰');
    expect(wrapper.find('.apply-form').exists()).toBe(true);
    expect(
      (wrapper.find('.field-shopName input').element as HTMLInputElement).value
    ).toBe('苗银世家'); // 用上次资料预填
  });

  it('提交失败展示后端 message', async () => {
    vi.mocked(merchantApply).mockRejectedValue(new Error('已存在待审核的入驻申请'));
    const { wrapper } = await mountView();
    await fillImages(wrapper);
    await fillForm(wrapper);
    await wrapper.find('.apply-form').trigger('submit');
    await flushPromises();
    expect(wrapper.text()).toContain('已存在待审核的入驻申请');
  });
});
```

> 说明：`fillForm` 里的 `input[type="file"].trigger('change')` 不带文件，用来确认「未选文件不写入」；
> 真正写入图片靠 `$emit('update:modelValue')`。若 `findAllComponents({ name: 'ImageUploader' })`
> 因 `<script setup>` 无显式 name 匹配不到，改用 `findAllComponents(ImageUploader)`（直接传组件对象）。

- [ ] **Step 3: 运行测试确认失败**

Run: `npm run test -- src/views/merchant`
Expected: FAIL — 视图文件不存在。

- [ ] **Step 4: 创建 `src/utils/merchant.ts`**

```ts
// 商家域展示常量与文案（入驻模块 / 申请状态），首页与申请页共用。
export const MODULE_LABELS: Record<string, string> = {
  product: '特产',
  food: '美食',
  accommodation: '住宿',
  travel: '旅行',
};

export const MODULE_OPTIONS: { value: string; label: string }[] = [
  { value: 'accommodation', label: '住宿' },
  { value: 'product', label: '特产' },
  { value: 'food', label: '美食' },
  { value: 'travel', label: '旅行' },
];

/** 后端 dict：1 待审核 2 已通过 3 已驳回 */
export const APPLICATION_STATUS_TEXT: Record<number, string> = {
  1: '待审核',
  2: '已通过',
  3: '已驳回',
};

export const moduleLabel = (module: string): string =>
  MODULE_LABELS[module] ?? module;

export const applicationStatusText = (status: number): string =>
  APPLICATION_STATUS_TEXT[Number(status)] ?? '未知状态';
```

- [ ] **Step 5: 创建 `src/views/merchant/MerchantHomeView.vue`**

```vue
<script setup lang="ts">
// 商家首页：店铺概览 + 入驻进度 + 快捷入口。数据来自 merchantMy / merchantApplication，
// 加载成功后回写 auth store，供外壳导航与其它页面复用。
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { merchantApplication, merchantMy } from '@/api/merchant';
import { useAuthStore } from '@/stores/auth';
import { applicationStatusText, moduleLabel } from '@/utils/merchant';
import type { MerchantApplication } from '@/api/types';

const auth = useAuthStore();
const router = useRouter();

const application = ref<MerchantApplication | null>(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const [merchant, progress] = await Promise.all([
      merchantMy(),
      merchantApplication(),
    ]);
    auth.merchant = merchant;
    application.value = progress;
  } catch (e) {
    error.value = e instanceof Error ? e.message : '店铺信息加载失败';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div v-if="loading" class="m-card m-state">正在加载店铺信息…</div>

    <div v-else-if="error" class="m-card m-state m-error">{{ error }}</div>

    <div v-else-if="auth.merchant" class="m-card">
      <h2 class="m-card-title">我的店铺</h2>
      <table class="m-table">
        <tbody>
          <tr>
            <th>店铺名称</th>
            <td>{{ auth.merchant.shopName }}</td>
          </tr>
          <tr>
            <th>入驻模块</th>
            <td>{{ moduleLabel(auth.merchant.module) }}</td>
          </tr>
          <tr>
            <th>商家账号</th>
            <td>{{ auth.merchant.username }}</td>
          </tr>
          <tr>
            <th>联系人</th>
            <td>{{ auth.merchant.contactName }} {{ auth.merchant.contactPhone }}</td>
          </tr>
          <tr>
            <th>入驻时间</th>
            <td>{{ auth.merchant.joinedAt || '—' }}</td>
          </tr>
          <tr>
            <th>店铺状态</th>
            <td>{{ Number(auth.merchant.status) === 1 ? '正常营业' : '已禁用' }}</td>
          </tr>
        </tbody>
      </table>

      <div class="m-form-actions">
        <button
          v-if="auth.merchant.module === 'accommodation'"
          type="button"
          class="m-btn"
          @click="router.push({ name: 'merchant-hotels' })"
        >
          我的民宿
        </button>
        <span v-else class="m-hint">
          当前入驻模块为{{ moduleLabel(auth.merchant.module) }}，住宿管理功能仅对住宿模块商家开放。
        </span>
      </div>
    </div>

    <div v-else class="m-card">
      <h2 class="m-card-title">入驻进度</h2>

      <template v-if="application">
        <p class="m-hint">
          申请店铺「{{ application.shopName }}」当前状态：
          <strong>{{ applicationStatusText(application.status) }}</strong>
        </p>
        <p v-if="application.auditResult" class="m-state m-error">
          审核意见：{{ application.auditResult }}
        </p>
      </template>
      <p v-else class="m-hint">尚未入驻，提交入驻申请后即可管理自己的民宿。</p>

      <div class="m-form-actions">
        <button
          type="button"
          class="m-btn go-apply"
          @click="router.push({ name: 'merchant-apply' })"
        >
          {{ application && Number(application.status) === 1 ? '查看入驻申请' : '去入驻申请' }}
        </button>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 6: 创建 `src/views/merchant/MerchantApplyView.vue`**

```vue
<script setup lang="ts">
// 入驻申请三态：已入驻（引导回首页）/ 待审核（只读展示）/ 可提交（表单，被驳回时预填并显示原因）。
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { merchantApplication, merchantApply, merchantMy } from '@/api/merchant';
import ImageUploader from '@/components/ImageUploader.vue';
import { useAuthStore } from '@/stores/auth';
import { MODULE_OPTIONS, applicationStatusText } from '@/utils/merchant';
import type { MerchantApplication, MerchantApplyForm } from '@/api/types';

const auth = useAuthStore();
const router = useRouter();

const application = ref<MerchantApplication | null>(null);
const loading = ref(true);
const submitting = ref(false);
const error = ref('');
const notice = ref('');

const form = reactive<MerchantApplyForm & { idCardFrontList: string[]; idCardBackList: string[]; licenseList: string[] }>({
  shopName: '',
  module: 'accommodation',
  contactName: '',
  contactPhone: '',
  idCard: '',
  idCardFront: '',
  idCardBack: '',
  businessLicense: '',
  idCardFrontList: [],
  idCardBackList: [],
  licenseList: [],
});

/** 待审核或已入驻时不显示表单 */
const showForm = ref(false);

async function load(): Promise<void> {
  loading.value = true;
  error.value = '';
  try {
    const [merchant, progress] = await Promise.all([
      merchantMy(),
      merchantApplication(),
    ]);
    auth.merchant = merchant;
    application.value = progress;

    if (merchant) {
      showForm.value = false;
      return;
    }
    if (progress && Number(progress.status) === 1) {
      showForm.value = false;
      return;
    }
    // 无申请或被驳回 → 可提交；被驳回时用上次资料预填
    if (progress) {
      form.shopName = progress.shopName;
      form.module = progress.module;
      form.contactName = progress.contactName;
      form.contactPhone = progress.contactPhone;
      form.idCard = progress.idCard;
    } else {
      form.contactPhone = auth.member?.phone ?? '';
    }
    showForm.value = true;
  } catch (e) {
    error.value = e instanceof Error ? e.message : '入驻信息加载失败';
  } finally {
    loading.value = false;
  }
}

function syncImages(): void {
  form.idCardFront = form.idCardFrontList[0] ?? '';
  form.idCardBack = form.idCardBackList[0] ?? '';
  form.businessLicense = form.licenseList[0] ?? '';
}

async function submit(): Promise<void> {
  error.value = '';
  notice.value = '';
  syncImages();

  if (
    !form.shopName.trim() ||
    !form.contactName.trim() ||
    !form.contactPhone.trim() ||
    !form.idCard.trim() ||
    !form.idCardFront ||
    !form.idCardBack ||
    !form.businessLicense
  ) {
    error.value = '请填写完整的入驻信息';
    return;
  }

  submitting.value = true;
  try {
    await merchantApply({
      shopName: form.shopName.trim(),
      module: form.module,
      contactName: form.contactName.trim(),
      contactPhone: form.contactPhone.trim(),
      idCard: form.idCard.trim(),
      idCardFront: form.idCardFront,
      idCardBack: form.idCardBack,
      businessLicense: form.businessLicense,
    });
    notice.value = '入驻申请已提交，请等待平台审核';
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : '提交失败，请稍后重试';
  } finally {
    submitting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div v-if="loading" class="m-card m-state">正在加载入驻信息…</div>

    <template v-else>
      <div v-if="error && !showForm" class="m-card m-state m-error">{{ error }}</div>

      <!-- 已入驻 -->
      <div v-if="auth.merchant" class="m-card">
        <h2 class="m-card-title">已入驻</h2>
        <p class="m-hint">
          店铺「{{ auth.merchant.shopName }}」已通过审核，无需重复申请。
        </p>
        <div class="m-form-actions">
          <button
            type="button"
            class="m-btn"
            @click="router.push({ name: 'merchant-home' })"
          >
            返回店铺概览
          </button>
        </div>
      </div>

      <!-- 待审核 -->
      <div v-else-if="application && Number(application.status) === 1" class="m-card">
        <h2 class="m-card-title">入驻申请审核中</h2>
        <table class="m-table">
          <tbody>
            <tr>
              <th>店铺名称</th>
              <td>{{ application.shopName }}</td>
            </tr>
            <tr>
              <th>联系人</th>
              <td>{{ application.contactName }} {{ application.contactPhone }}</td>
            </tr>
            <tr>
              <th>当前状态</th>
              <td>{{ applicationStatusText(application.status) }}</td>
            </tr>
          </tbody>
        </table>
        <p class="m-hint">平台审核完成后会通过站内消息通知你。</p>
      </div>

      <!-- 表单（无申请 / 已驳回） -->
      <div v-else-if="showForm" class="m-card">
        <h2 class="m-card-title">
          {{ application ? '重新提交入驻申请' : '入驻申请' }}
        </h2>

        <p v-if="application?.auditResult" class="m-state m-error">
          上次审核意见：{{ application.auditResult }}
        </p>
        <p v-if="notice" class="m-hint">{{ notice }}</p>

        <form class="apply-form" @submit.prevent="submit">
          <div class="m-form-grid">
            <div class="m-form-row field-shopName">
              <label>店铺名称<span class="m-required">*</span></label>
              <input v-model="form.shopName" type="text" placeholder="如 苗银世家" />
            </div>
            <div class="m-form-row field-module">
              <label>入驻模块<span class="m-required">*</span></label>
              <select v-model="form.module">
                <option v-for="item in MODULE_OPTIONS" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </div>
            <div class="m-form-row field-contactName">
              <label>联系人<span class="m-required">*</span></label>
              <input v-model="form.contactName" type="text" placeholder="请输入联系人姓名" />
            </div>
            <div class="m-form-row field-contactPhone">
              <label>联系电话<span class="m-required">*</span></label>
              <input v-model="form.contactPhone" type="tel" placeholder="11 位手机号" />
            </div>
            <div class="m-form-row field-idCard">
              <label>身份证号<span class="m-required">*</span></label>
              <input v-model="form.idCard" type="text" placeholder="18 位身份证号" />
            </div>
          </div>

          <div class="m-form-row field-idCardFront">
            <label>身份证正面<span class="m-required">*</span></label>
            <ImageUploader v-model="form.idCardFrontList" :max="1" label="上传身份证正面" />
          </div>
          <div class="m-form-row field-idCardBack">
            <label>身份证反面<span class="m-required">*</span></label>
            <ImageUploader v-model="form.idCardBackList" :max="1" label="上传身份证反面" />
          </div>
          <div class="m-form-row field-businessLicense">
            <label>营业执照<span class="m-required">*</span></label>
            <ImageUploader v-model="form.licenseList" :max="1" label="上传营业执照" />
          </div>

          <p v-if="error" class="m-state m-error">{{ error }}</p>

          <div class="m-form-actions">
            <button class="m-btn" type="submit" :disabled="submitting">
              {{ submitting ? '提交中…' : '提交申请' }}
            </button>
          </div>
        </form>
      </div>
    </template>
  </div>
</template>
```

- [ ] **Step 7: 在 `src/router/index.ts` 的 `/merchant` `children` 里追加两行**

```ts
      children: [
        {
          path: '',
          name: 'merchant-home',
          component: () => import('../views/merchant/MerchantHomeView.vue'),
        },
        {
          path: 'apply',
          name: 'merchant-apply',
          component: () => import('../views/merchant/MerchantApplyView.vue'),
        },
      ],
```

- [ ] **Step 8: 运行测试确认通过**

Run: `npm run test`
Expected: PASS（含首页 6 个 + 申请页 7 个）。

- [ ] **Step 9: 类型检查 + Commit**

Run: `npm run type-check` → 无错误。

```bash
cd wudong-web
git add src/utils/merchant.ts src/views/merchant/MerchantHomeView.vue \
  src/views/merchant/MerchantHomeView.spec.ts src/views/merchant/MerchantApplyView.vue \
  src/views/merchant/MerchantApplyView.spec.ts src/router/index.ts
git commit -m "feat(merchant): 商家首页与入驻申请三态"
```

---

## Task 13: 我的民宿列表（上下架 / 编辑 / 删除）

**Files:**
- Modify: `wudong-web/src/api/merchant.ts`（新增 `merchantHotelSetStatus`）
- Modify: `wudong-web/src/mocks/merchant.ts`（新增 `mockHotelSetStatus`）
- Create: `wudong-web/src/views/merchant/MerchantHotelListView.vue`
- Create: `wudong-web/src/views/merchant/MerchantHotelEditView.vue`（**空壳**，仅让路由指向真实存在的文件；Task 14 整文件替换为完整实现）
- Modify: `wudong-web/src/router/index.ts`（追加两条子路由）
- Test: `wudong-web/src/api/merchant.spec.ts`（追加 1 个用例）
- Test: `wudong-web/src/views/merchant/MerchantHotelListView.spec.ts`

**Interfaces:**
- Consumes: `merchantHotelPage/merchantHotelDelete`（Task 7）。
- Produces:
  - `merchantHotelSetStatus(id: number, status: number): Promise<true>`（api + mock 同步新增）
  - 路由：`merchant-hotels`（`'hotels'`）、`merchant-hotel-new`（`'hotels/new'`）

- [ ] **Step 1: 在 `src/api/merchant.spec.ts` 的「真实后端分支」describe 里追加用例**

```ts
    it('上下架提交 id 与 status', async () => {
      const { merchantHotelSetStatus } = await loadApi();
      let body = '';
      vi.stubGlobal('fetch', vi.fn((u: string, i: any) => {
        body = i.body;
        return Promise.resolve(okJson(true));
      }));
      await merchantHotelSetStatus(3, 0);
      expect(body).toBe(JSON.stringify({ id: 3, status: 0 }));
    });
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- src/api/merchant.spec.ts`
Expected: FAIL — `merchantHotelSetStatus` 不存在。

- [ ] **Step 3: 在 `src/mocks/merchant.ts` 追加（放在 `mockHotelDelete` 之后）**

```ts
export const mockHotelSetStatus = (id: number, status: number): true => {
  const index = hotels.findIndex((h) => h.id === Number(id));
  if (index < 0) throw new Error('无权操作该资源');
  hotels[index] = { ...hotels[index], status: Number(status) };
  return true;
};
```

并把 `mockHotelSetStatus` 加入文件顶部的 import 无关（同文件内），确认 `resetMerchantMocks` 不受影响（它重置 `hotels` 数组，无需改动）。

- [ ] **Step 4: 在 `src/api/merchant.ts` 追加导出**

把 `mockHotelSetStatus` 加入 `from '../mocks/merchant'` 的 import 列表，然后追加：

```ts
/** 上架 / 下架（P8 商家可自管状态） */
export const merchantHotelSetStatus = async (
  id: number,
  status: number
): Promise<true> => {
  if (USE_MOCK) return mockHotelSetStatus(id, status);
  return post<true>(`${BASE}/hotel/update`, { id, status });
};
```

- [ ] **Step 5: 写失败测试 `src/views/merchant/MerchantHotelListView.spec.ts`**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MerchantHotelListView from './MerchantHotelListView.vue';
import {
  merchantHotelDelete,
  merchantHotelPage,
  merchantHotelSetStatus,
} from '@/api/merchant';

vi.mock('@/api/merchant', () => ({
  merchantHotelPage: vi.fn(),
  merchantHotelDelete: vi.fn(),
  merchantHotelSetStatus: vi.fn(),
}));

const hotelOn = {
  id: 1,
  name: '乌东苗寨木楼',
  address: '雷山县 · 乌东村一组',
  longitude: 108.1,
  latitude: 26.4,
  styleTags: ['苗寨'],
  facilityTags: ['WiFi'],
  mainImage: '/a.jpg',
  images: [],
  intro: '梯田木楼',
  rating: 4.8,
  reviewCount: 126,
  minPrice: 380,
  checkInTime: '14:00',
  checkOutTime: '12:00',
  petPolicy: '可携带小型宠物',
  hasBreakfast: 1,
  deposit: 100,
  status: 1,
  merchantId: 1,
};
const hotelOff = { ...hotelOn, id: 2, name: '已下架的院子', status: 0 };

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
  vi.mocked(merchantHotelPage).mockReset().mockResolvedValue({
    list: [hotelOn, hotelOff],
    total: 2,
  });
  vi.mocked(merchantHotelDelete).mockReset().mockResolvedValue(true);
  vi.mocked(merchantHotelSetStatus).mockReset().mockResolvedValue(true);
});

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/merchant/hotels', name: 'merchant-hotels', component: MerchantHotelListView },
      { path: '/merchant/hotels/new', name: 'merchant-hotel-new', component: { template: '<div>new</div>' } },
      { path: '/merchant/hotels/:id/edit', name: 'merchant-hotel-edit', component: { template: '<div>edit</div>' } },
      { path: '/merchant/hotels/:id/rooms', name: 'merchant-hotel-rooms', component: { template: '<div>rooms</div>' } },
    ],
  });
  await router.push('/merchant/hotels');
  await router.isReady();
  const wrapper = mount(MerchantHotelListView, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

describe('MerchantHotelListView', () => {
  it('加载并渲染我的民宿与状态', async () => {
    const { wrapper } = await mountView();
    expect(merchantHotelPage).toHaveBeenCalled();
    expect(wrapper.text()).toContain('乌东苗寨木楼');
    expect(wrapper.text()).toContain('已下架的院子');
    expect(wrapper.text()).toContain('已下架');
  });

  it('无民宿时展示空态与新增引导', async () => {
    vi.mocked(merchantHotelPage).mockResolvedValue({ list: [], total: 0 });
    const { wrapper } = await mountView();
    expect(wrapper.text()).toContain('还没有民宿');
  });

  it('点击新增跳转到新建页', async () => {
    const { wrapper, router } = await mountView();
    await wrapper.find('.new-hotel').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.path).toBe('/merchant/hotels/new');
  });

  it('点击编辑进入编辑页', async () => {
    const { wrapper, router } = await mountView();
    await wrapper.findAll('.edit-hotel')[0].trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.path).toBe('/merchant/hotels/1/edit');
  });

  it('点击房型进入房型管理页', async () => {
    const { wrapper, router } = await mountView();
    await wrapper.findAll('.manage-rooms')[0].trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.path).toBe('/merchant/hotels/1/rooms');
  });

  it('下架：调用 setStatus 并刷新列表', async () => {
    vi.mocked(merchantHotelPage)
      .mockResolvedValueOnce({ list: [hotelOn, hotelOff], total: 2 })
      .mockResolvedValueOnce({
        list: [{ ...hotelOn, status: 0 }, hotelOff],
        total: 2,
      });
    const { wrapper } = await mountView();
    await wrapper.findAll('.toggle-status')[0].trigger('click');
    await flushPromises();
    expect(merchantHotelSetStatus).toHaveBeenCalledWith(1, 0);
    expect(merchantHotelPage).toHaveBeenCalledTimes(2);
  });

  it('上架：已下架民宿调用 setStatus(id, 1)', async () => {
    const { wrapper } = await mountView();
    await wrapper.findAll('.toggle-status')[1].trigger('click');
    await flushPromises();
    expect(merchantHotelSetStatus).toHaveBeenCalledWith(2, 1);
  });

  it('删除需二次确认，确认后调用删除并刷新', async () => {
    const { wrapper } = await mountView();
    await wrapper.findAll('.delete-hotel')[0].trigger('click');
    await flushPromises();

    expect(merchantHotelDelete).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('确认删除');

    await wrapper.find('.confirm-delete').trigger('click');
    await flushPromises();
    expect(merchantHotelDelete).toHaveBeenCalledWith(1);
    expect(merchantHotelPage).toHaveBeenCalledTimes(2);
  });

  it('删除失败展示后端 message（有房型时不可删）', async () => {
    vi.mocked(merchantHotelDelete).mockRejectedValue(
      new Error('请先删除该民宿下的房型')
    );
    const { wrapper } = await mountView();
    await wrapper.findAll('.delete-hotel')[0].trigger('click');
    await flushPromises();
    await wrapper.find('.confirm-delete').trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('请先删除该民宿下的房型');
  });

  it('查询失败展示错误', async () => {
    vi.mocked(merchantHotelPage).mockRejectedValue(new Error('仅商家可访问'));
    const { wrapper } = await mountView();
    expect(wrapper.text()).toContain('仅商家可访问');
  });
});
```

- [ ] **Step 6: 运行测试确认失败**

Run: `npm run test -- src/views/merchant/MerchantHotelListView.spec.ts`
Expected: FAIL — 视图不存在。

- [ ] **Step 7: 创建 `src/views/merchant/MerchantHotelListView.vue`**

```vue
<script setup lang="ts">
// 我的民宿：列表 + 状态筛选 + 上下架 + 编辑 + 房型入口 + 二次确认删除。
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  merchantHotelDelete,
  merchantHotelPage,
  merchantHotelSetStatus,
} from '@/api/merchant';
import type { MerchantHotel } from '@/api/types';

const router = useRouter();

const list = ref<MerchantHotel[]>([]);
const loading = ref(true);
const error = ref('');
const name = ref('');
const status = ref<string>('');
/** 待确认删除的民宿 id；非空时该行显示确认按钮 */
const pendingDelete = ref<number | null>(null);
const busy = ref(false);

async function load(): Promise<void> {
  loading.value = true;
  error.value = '';
  try {
    const result = await merchantHotelPage({
      page: 1,
      size: 50,
      name: name.value.trim() || undefined,
      status: status.value === '' ? undefined : Number(status.value),
    });
    list.value = result.list;
  } catch (e) {
    error.value = e instanceof Error ? e.message : '民宿加载失败';
    list.value = [];
  } finally {
    loading.value = false;
  }
}

async function toggleStatus(hotel: MerchantHotel): Promise<void> {
  error.value = '';
  busy.value = true;
  try {
    await merchantHotelSetStatus(hotel.id, Number(hotel.status) === 1 ? 0 : 1);
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : '操作失败';
  } finally {
    busy.value = false;
  }
}

async function confirmDelete(id: number): Promise<void> {
  error.value = '';
  busy.value = true;
  try {
    await merchantHotelDelete(id);
    pendingDelete.value = null;
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : '删除失败';
  } finally {
    busy.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div class="m-card">
      <h2 class="m-card-title">
        我的民宿
        <span class="m-actions">
          <button
            type="button"
            class="m-btn new-hotel"
            @click="router.push({ name: 'merchant-hotel-new' })"
          >
            新增民宿
          </button>
        </span>
      </h2>

      <div class="hotel-filters">
        <input v-model="name" type="text" placeholder="按名称搜索" @keyup.enter="load" />
        <select v-model="status" @change="load">
          <option value="">全部状态</option>
          <option value="1">已上架</option>
          <option value="0">已下架</option>
        </select>
        <button type="button" class="m-btn m-btn-ghost" @click="load">查询</button>
      </div>

      <p v-if="error" class="m-state m-error">{{ error }}</p>

      <div v-if="loading" class="m-state">正在加载民宿…</div>

      <p v-else-if="!list.length" class="m-state">
        还没有民宿，点右上角「新增民宿」创建第一家吧。
      </p>

      <table v-else class="m-table">
        <thead>
          <tr>
            <th>民宿名称</th>
            <th>地址</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hotel in list" :key="hotel.id">
            <td>{{ hotel.name }}</td>
            <td>{{ hotel.address }}</td>
            <td>{{ Number(hotel.status) === 1 ? '已上架' : '已下架' }}</td>
            <td class="row-actions">
              <button
                type="button"
                class="link edit-hotel"
                @click="router.push({ name: 'merchant-hotel-edit', params: { id: hotel.id } })"
              >
                编辑
              </button>
              <button
                type="button"
                class="link manage-rooms"
                @click="router.push({ name: 'merchant-hotel-rooms', params: { id: hotel.id } })"
              >
                房型
              </button>
              <button
                type="button"
                class="link toggle-status"
                :disabled="busy"
                @click="toggleStatus(hotel)"
              >
                {{ Number(hotel.status) === 1 ? '下架' : '上架' }}
              </button>

              <template v-if="pendingDelete === hotel.id">
                <span class="m-hint">确认删除？</span>
                <button
                  type="button"
                  class="link danger confirm-delete"
                  :disabled="busy"
                  @click="confirmDelete(hotel.id)"
                >
                  确认删除
                </button>
                <button type="button" class="link" @click="pendingDelete = null">
                  取消
                </button>
              </template>
              <button
                v-else
                type="button"
                class="link danger delete-hotel"
                @click="pendingDelete = hotel.id"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.hotel-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
.hotel-filters input,
.hotel-filters select {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-family: inherit;
}
.row-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.link {
  border: 0;
  background: transparent;
  color: var(--green-500);
  font-size: 13px;
  padding: 0;
  text-decoration: underline;
}
.link.danger {
  color: var(--gold-600);
}
.link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

- [ ] **Step 8: 在 `src/router/index.ts` 的 `/merchant` `children` 里追加两行**

```ts
        {
          path: 'hotels',
          name: 'merchant-hotels',
          component: () => import('../views/merchant/MerchantHotelListView.vue'),
        },
        {
          path: 'hotels/new',
          name: 'merchant-hotel-new',
          component: () => import('../views/merchant/MerchantHotelEditView.vue'),
        },
```

> `MerchantHotelEditView.vue` 在 Task 14 创建。**本 Task 先创建该文件的空壳**（`<template><div /></template>`），
> 避免路由指向不存在的文件导致构建失败；Task 14 会用完整实现替换它。

- [ ] **Step 9: 运行测试确认通过**

Run: `npm run test`
Expected: PASS（含列表页 10 个用例）。

- [ ] **Step 10: 类型检查 + Commit**

Run: `npm run type-check` → 无错误。

```bash
cd wudong-web
git add src/api/merchant.ts src/api/merchant.spec.ts src/mocks/merchant.ts \
  src/views/merchant/MerchantHotelListView.vue \
  src/views/merchant/MerchantHotelListView.spec.ts \
  src/views/merchant/MerchantHotelEditView.vue src/router/index.ts
git commit -m "feat(merchant): 我的民宿列表（上下架/编辑/房型入口/删除）"
```

---

## Task 14: 民宿新增 / 编辑表单

**Files:**
- Modify: `wudong-web/src/views/merchant/MerchantHotelEditView.vue`（替换空壳为完整实现）
- Modify: `wudong-web/src/router/index.ts`（追加编辑子路由）
- Test: `wudong-web/src/views/merchant/MerchantHotelEditView.spec.ts`

**Interfaces:**
- Consumes: `merchantHotelInfo/merchantHotelSave`（Task 7）、`ImageUploader`/`TagInput`（Task 11）。
- Produces: 路由 `merchant-hotel-edit`（`'hotels/:id/edit'`）。

- [ ] **Step 1: 写失败测试 `src/views/merchant/MerchantHotelEditView.spec.ts`**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MerchantHotelEditView from './MerchantHotelEditView.vue';
import { merchantHotelInfo, merchantHotelSave } from '@/api/merchant';

vi.mock('@/api/merchant', () => ({
  merchantHotelInfo: vi.fn(),
  merchantHotelSave: vi.fn(),
}));

const hotelFixture = {
  id: 7,
  name: '乌东苗寨木楼',
  address: '雷山县 · 乌东村一组',
  longitude: 108.107,
  latitude: 26.403,
  styleTags: ['苗寨', '江景'],
  facilityTags: ['WiFi'],
  mainImage: '/a.jpg',
  images: ['/a.jpg'],
  intro: '梯田木楼',
  rating: 4.8,
  reviewCount: 126,
  minPrice: 380,
  checkInTime: '14:00',
  checkOutTime: '12:00',
  petPolicy: '可携带小型宠物',
  hasBreakfast: 1,
  deposit: 100,
  status: 1,
  merchantId: 1,
};

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
  vi.mocked(merchantHotelInfo).mockReset().mockResolvedValue(hotelFixture);
  vi.mocked(merchantHotelSave)
    .mockReset()
    .mockResolvedValue({ ...hotelFixture, name: '改后的名字' });
});

async function mountView(path = '/merchant/hotels/new') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/merchant/hotels', name: 'merchant-hotels', component: { template: '<div>list</div>' } },
      { path: '/merchant/hotels/new', name: 'merchant-hotel-new', component: MerchantHotelEditView },
      { path: '/merchant/hotels/:id/edit', name: 'merchant-hotel-edit', component: MerchantHotelEditView },
    ],
  });
  await router.push(path);
  await router.isReady();
  const wrapper = mount(MerchantHotelEditView, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

describe('MerchantHotelEditView', () => {
  it('新建态：标题为新增且不请求详情', async () => {
    const { wrapper } = await mountView('/merchant/hotels/new');
    expect(wrapper.text()).toContain('新增民宿');
    expect(merchantHotelInfo).not.toHaveBeenCalled();
  });

  it('编辑态：加载详情并预填表单', async () => {
    const { wrapper } = await mountView('/merchant/hotels/7/edit');
    expect(merchantHotelInfo).toHaveBeenCalledWith(7);
    expect(wrapper.text()).toContain('编辑民宿');
    expect(
      (wrapper.find('.field-name input').element as HTMLInputElement).value
    ).toBe('乌东苗寨木楼');
    expect(
      (wrapper.find('.field-deposit input').element as HTMLInputElement).value
    ).toBe('100');
  });

  it('必填缺失时提示且不提交', async () => {
    const { wrapper } = await mountView('/merchant/hotels/new');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(merchantHotelSave).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('请填写民宿名称与地址');
  });

  it('经纬度为空或 0 时提示且不提交', async () => {
    const { wrapper } = await mountView('/merchant/hotels/new');
    await wrapper.find('.field-name input').setValue('新院子');
    await wrapper.find('.field-address input').setValue('雷山县六组');
    await wrapper.find('.field-longitude input').setValue('');
    await wrapper.find('.field-latitude input').setValue('');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(merchantHotelSave).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('请填写经纬度');

    // 0 同样视为未填写（未动过的默认值不能让民宿落在 (0, 0)）
    await wrapper.find('.field-longitude input').setValue('0');
    await wrapper.find('.field-latitude input').setValue('0');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(merchantHotelSave).not.toHaveBeenCalled();
  });

  it('新建保存：提交不含 id 并返回列表', async () => {
    const { wrapper, router } = await mountView('/merchant/hotels/new');
    await wrapper.find('.field-name input').setValue('新院子');
    await wrapper.find('.field-address input').setValue('雷山县六组');
    await wrapper.find('.field-longitude input').setValue('108.2');
    await wrapper.find('.field-latitude input').setValue('26.5');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(merchantHotelSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: '新院子',
        address: '雷山县六组',
        longitude: 108.2,
        latitude: 26.5,
      })
    );
    expect(vi.mocked(merchantHotelSave).mock.calls[0][0].id).toBeUndefined();
    expect(router.currentRoute.value.path).toBe('/merchant/hotels');
  });

  it('编辑保存：提交带 id', async () => {
    const { wrapper, router } = await mountView('/merchant/hotels/7/edit');
    await wrapper.find('.field-name input').setValue('改后的名字');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(vi.mocked(merchantHotelSave).mock.calls[0][0].id).toBe(7);
    expect(router.currentRoute.value.path).toBe('/merchant/hotels');
  });

  it('保存失败展示后端 message', async () => {
    vi.mocked(merchantHotelSave).mockRejectedValue(
      new Error('您的入驻模块非住宿，无法新增民宿')
    );
    const { wrapper } = await mountView('/merchant/hotels/new');
    await wrapper.find('.field-name input').setValue('新院子');
    await wrapper.find('.field-address input').setValue('雷山县六组');
    // 经纬度必须给非 0 值：否则 submit() 的「不能为空或 0」守卫会先返回，
    // 根本走不到 merchantHotelSave，这条断言永远拿不到后端的 message。
    await wrapper.find('.field-longitude input').setValue('108.2');
    await wrapper.find('.field-latitude input').setValue('26.5');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(wrapper.text()).toContain('您的入驻模块非住宿，无法新增民宿');
  });

  it('详情加载失败展示错误', async () => {
    vi.mocked(merchantHotelInfo).mockRejectedValue(new Error('无权操作该资源'));
    const { wrapper } = await mountView('/merchant/hotels/7/edit');
    expect(wrapper.text()).toContain('无权操作该资源');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- src/views/merchant/MerchantHotelEditView.spec.ts`
Expected: FAIL — 空壳组件没有表单。

- [ ] **Step 3: 用完整实现替换 `src/views/merchant/MerchantHotelEditView.vue`**

```vue
<script setup lang="ts">
// 民宿新增/编辑：同一表单，按路由是否带 id 决定模式。经纬度必填（后端校验），
// 标签与图片用 TagInput / ImageUploader；保存成功回列表。
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { merchantHotelInfo, merchantHotelSave } from '@/api/merchant';
import ImageUploader from '@/components/ImageUploader.vue';
import TagInput from '@/components/TagInput.vue';
import type { HotelForm } from '@/api/types';

const route = useRoute();
const router = useRouter();

/** 数字输入框被清空时 v-model.number 会留下 ''：空/无法解析一律算未填 */
const isUnfilledNumber = (v: unknown): boolean =>
  v === '' || v == null || Number.isNaN(Number(v));

const STYLE_SUGGESTIONS = ['苗寨', '江景', '山景', '观星', '家庭', '经济'];
const FACILITY_SUGGESTIONS = ['WiFi', '空调', '独立卫浴', '电热毯', '儿童设施', '停车位'];

const hotelId = computed(() => {
  const raw = route.params.id;
  return raw ? Number(raw) : undefined;
});
const isEdit = computed(() => hotelId.value !== undefined);

const form = reactive<HotelForm>({
  name: '',
  address: '',
  longitude: 0,
  latitude: 0,
  styleTags: [],
  facilityTags: [],
  mainImage: '',
  images: [],
  intro: '',
  checkInTime: '14:00',
  checkOutTime: '12:00',
  petPolicy: '',
  hasBreakfast: 0,
  deposit: 0,
  status: 1,
});

/** 主图与图集共用 ImageUploader，这里用单元素数组桥接（主图取第 0 张） */
const mainImageList = ref<string[]>([]);
const imageList = ref<string[]>([]);

const loading = ref(false);
const submitting = ref(false);
const error = ref('');

async function load(): Promise<void> {
  if (hotelId.value === undefined) return;
  loading.value = true;
  error.value = '';
  try {
    const info = await merchantHotelInfo(hotelId.value);
    Object.assign(form, {
      id: info.id,
      name: info.name,
      address: info.address,
      longitude: Number(info.longitude),
      latitude: Number(info.latitude),
      styleTags: info.styleTags ?? [],
      facilityTags: info.facilityTags ?? [],
      mainImage: info.mainImage ?? '',
      images: info.images ?? [],
      intro: info.intro ?? '',
      checkInTime: info.checkInTime || '14:00',
      checkOutTime: info.checkOutTime || '12:00',
      petPolicy: info.petPolicy ?? '',
      hasBreakfast: Number(info.hasBreakfast) === 1 ? 1 : 0,
      deposit: Number(info.deposit) || 0,
      status: Number(info.status) === 0 ? 0 : 1,
    });
    mainImageList.value = form.mainImage ? [form.mainImage] : [];
    imageList.value = form.images ? form.images.slice() : [];
  } catch (e) {
    error.value = e instanceof Error ? e.message : '民宿信息加载失败';
  } finally {
    loading.value = false;
  }
}

async function submit(): Promise<void> {
  error.value = '';
  form.mainImage = mainImageList.value[0] ?? '';
  form.images = imageList.value.slice();

  if (!form.name.trim() || !form.address.trim()) {
    error.value = '请填写民宿名称与地址';
    return;
  }
  // 数字输入框被清空时 v-model.number 会留下 ''，而 Number('') === 0：
  // 只看 isFinite 会把空输入当成合法坐标，落库成 (0, 0)。0 在这里一律视为未填写。
  if (
    isUnfilledNumber(form.longitude) ||
    isUnfilledNumber(form.latitude) ||
    (Number(form.longitude) === 0 && Number(form.latitude) === 0)
  ) {
    error.value = '请填写经纬度（不能为空或 0）';
    return;
  }

  submitting.value = true;
  try {
    await merchantHotelSave({
      ...form,
      name: form.name.trim(),
      address: form.address.trim(),
      longitude: Number(form.longitude),
      latitude: Number(form.latitude),
      deposit: Number(form.deposit) || 0,
      hasBreakfast: Number(form.hasBreakfast),
      status: Number(form.status),
      id: hotelId.value,
    });
    await router.push({ name: 'merchant-hotels' });
  } catch (e) {
    error.value = e instanceof Error ? e.message : '保存失败，请稍后重试';
  } finally {
    submitting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="m-card">
    <h2 class="m-card-title">{{ isEdit ? '编辑民宿' : '新增民宿' }}</h2>

    <div v-if="loading" class="m-state">正在加载民宿信息…</div>

    <form v-else @submit.prevent="submit">
      <div class="m-form-grid">
        <div class="m-form-row field-name">
          <label>民宿名称<span class="m-required">*</span></label>
          <input v-model="form.name" type="text" placeholder="如 乌东苗寨木楼" />
        </div>
        <div class="m-form-row field-address">
          <label>地址<span class="m-required">*</span></label>
          <input v-model="form.address" type="text" placeholder="如 雷山县 · 乌东村一组" />
        </div>
        <div class="m-form-row field-longitude">
          <label>经度<span class="m-required">*</span></label>
          <input v-model="form.longitude" type="number" step="0.000001" />
        </div>
        <div class="m-form-row field-latitude">
          <label>纬度<span class="m-required">*</span></label>
          <input v-model="form.latitude" type="number" step="0.000001" />
        </div>
        <div class="m-form-row field-checkInTime">
          <label>入住时间</label>
          <input v-model="form.checkInTime" type="text" placeholder="14:00" />
        </div>
        <div class="m-form-row field-checkOutTime">
          <label>离店时间</label>
          <input v-model="form.checkOutTime" type="text" placeholder="12:00" />
        </div>
        <div class="m-form-row field-hasBreakfast">
          <label>是否含早</label>
          <select v-model.number="form.hasBreakfast">
            <option :value="1">含早餐</option>
            <option :value="0">不含早餐</option>
          </select>
        </div>
        <div class="m-form-row field-deposit">
          <label>押金（元）</label>
          <input v-model.number="form.deposit" type="number" min="0" step="1" />
        </div>
        <div class="m-form-row field-status">
          <label>上架状态</label>
          <select v-model.number="form.status">
            <option :value="1">上架</option>
            <option :value="0">下架</option>
          </select>
        </div>
        <div class="m-form-row field-petPolicy">
          <label>宠物政策</label>
          <input v-model="form.petPolicy" type="text" placeholder="如 可携带小型宠物" />
        </div>
      </div>

      <div class="m-form-row field-styleTags">
        <label>风格标签</label>
        <TagInput v-model="form.styleTags" :suggestions="STYLE_SUGGESTIONS" />
      </div>
      <div class="m-form-row field-facilityTags">
        <label>设施标签</label>
        <TagInput v-model="form.facilityTags" :suggestions="FACILITY_SUGGESTIONS" />
      </div>
      <div class="m-form-row field-mainImage">
        <label>主图</label>
        <ImageUploader v-model="mainImageList" :max="1" label="上传主图" />
      </div>
      <div class="m-form-row field-images">
        <label>图集</label>
        <ImageUploader v-model="imageList" :max="6" label="上传图集" />
      </div>
      <div class="m-form-row field-intro">
        <label>民宿介绍</label>
        <textarea v-model="form.intro" rows="4" placeholder="一句话介绍这家民宿"></textarea>
      </div>

      <p v-if="error" class="m-state m-error">{{ error }}</p>

      <div class="m-form-actions">
        <button class="m-btn" type="submit" :disabled="submitting">
          {{ submitting ? '保存中…' : '保存' }}
        </button>
        <button
          type="button"
          class="m-btn m-btn-ghost"
          @click="router.push({ name: 'merchant-hotels' })"
        >
          取消
        </button>
      </div>
    </form>
  </div>
</template>
```

- [ ] **Step 4: 在 `src/router/index.ts` 的 `/merchant` `children` 里追加一行**

```ts
        {
          path: 'hotels/:id/edit',
          name: 'merchant-hotel-edit',
          component: () => import('../views/merchant/MerchantHotelEditView.vue'),
        },
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npm run test -- src/views/merchant/MerchantHotelEditView.spec.ts`
Expected: PASS（8 个用例）。

- [ ] **Step 6: 类型检查 + Commit**

Run: `npm run type-check` → 无错误。

```bash
cd wudong-web
git add src/views/merchant/MerchantHotelEditView.vue \
  src/views/merchant/MerchantHotelEditView.spec.ts src/router/index.ts
git commit -m "feat(merchant): 民宿新增/编辑表单"
```

---

## Task 15: 房型管理

**Files:**
- Create: `wudong-web/src/views/merchant/MerchantRoomTypeView.vue`
- Create: `wudong-web/src/views/merchant/MerchantCalendarView.vue`（**空壳**，仅让路由指向真实存在的文件；Task 16 整文件替换为完整实现）
- Modify: `wudong-web/src/router/index.ts`（追加**两条**子路由：`merchant-hotel-rooms` 与 `merchant-room-calendar`）
- Test: `wudong-web/src/views/merchant/MerchantRoomTypeView.spec.ts`

**Interfaces:**
- Consumes: `merchantHotelInfo`（Task 7）、`merchantRoomTypePage/merchantRoomTypeSave/merchantRoomTypeDelete`（Task 7）、`ImageUploader`/`TagInput`（Task 11）。
- Produces: 路由 `merchant-hotel-rooms`（`'hotels/:id/rooms'`）与 `merchant-room-calendar`（`'rooms/:id/calendar'`）。

- [ ] **Step 1: 写失败测试 `src/views/merchant/MerchantRoomTypeView.spec.ts`**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MerchantRoomTypeView from './MerchantRoomTypeView.vue';
import {
  merchantHotelInfo,
  merchantRoomTypeDelete,
  merchantRoomTypePage,
  merchantRoomTypeSave,
} from '@/api/merchant';

vi.mock('@/api/merchant', () => ({
  merchantHotelInfo: vi.fn(),
  merchantRoomTypePage: vi.fn(),
  merchantRoomTypeSave: vi.fn(),
  merchantRoomTypeDelete: vi.fn(),
}));

const roomTypeFixture = {
  id: 11,
  hotelId: 7,
  name: '苗寨大床房',
  bedType: '大床',
  area: 25,
  maxGuests: 2,
  facilities: ['WiFi'],
  price: 380,
  stock: 3,
  images: [],
  status: 1,
};

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
  vi.mocked(merchantHotelInfo).mockReset().mockResolvedValue({
    id: 7,
    name: '乌东苗寨木楼',
    address: '雷山县',
    merchantId: 1,
    status: 1,
  } as any);
  vi.mocked(merchantRoomTypePage)
    .mockReset()
    .mockResolvedValue({ list: [roomTypeFixture], total: 1 });
  vi.mocked(merchantRoomTypeSave)
    .mockReset()
    .mockResolvedValue({ ...roomTypeFixture, id: 12 });
  vi.mocked(merchantRoomTypeDelete).mockReset().mockResolvedValue(true);
});

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/merchant/hotels/:id/rooms', name: 'merchant-hotel-rooms', component: MerchantRoomTypeView },
      { path: '/merchant/rooms/:id/calendar', name: 'merchant-room-calendar', component: { template: '<div>calendar</div>' } },
    ],
  });
  await router.push('/merchant/hotels/7/rooms');
  await router.isReady();
  const wrapper = mount(MerchantRoomTypeView, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

describe('MerchantRoomTypeView', () => {
  it('加载民宿名与房型列表', async () => {
    const { wrapper } = await mountView();
    expect(merchantRoomTypePage).toHaveBeenCalledWith(7);
    expect(wrapper.text()).toContain('乌东苗寨木楼');
    expect(wrapper.text()).toContain('苗寨大床房');
    expect(wrapper.text()).toContain('380');
  });

  it('点新增打开空表单', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.new-room-type').trigger('click');
    expect(wrapper.find('.room-type-form').exists()).toBe(true);
    expect(
      (wrapper.find('.field-room-name input').element as HTMLInputElement).value
    ).toBe('');
  });

  it('新增保存后刷新列表并关闭表单', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.new-room-type').trigger('click');
    await wrapper.find('.field-room-name input').setValue('双床房');
    await wrapper.find('.field-room-price input').setValue('520');
    await wrapper.find('.field-room-stock input').setValue('2');
    await wrapper.find('.room-type-form').trigger('submit');
    await flushPromises();

    expect(merchantRoomTypeSave).toHaveBeenCalledWith(
      expect.objectContaining({ hotelId: 7, name: '双床房', price: 520, stock: 2 })
    );
    expect(merchantRoomTypePage).toHaveBeenCalledTimes(2);
    expect(wrapper.find('.room-type-form').exists()).toBe(false);
  });

  it('价格为空或 0 时提示且不提交', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.new-room-type').trigger('click');
    await wrapper.find('.field-room-name input').setValue('免费房');
    await wrapper.find('.field-room-price input').setValue('0');
    await wrapper.find('.room-type-form').trigger('submit');
    await flushPromises();
    expect(merchantRoomTypeSave).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('房型价格必须大于 0');
  });

  it('点编辑预填该房型', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.edit-room-type').trigger('click');
    expect(
      (wrapper.find('.field-room-name input').element as HTMLInputElement).value
    ).toBe('苗寨大床房');
    expect(
      (wrapper.find('.field-room-stock input').element as HTMLInputElement).value
    ).toBe('3');
  });

  it('点房态跳转日历页', async () => {
    const { wrapper, router } = await mountView();
    await wrapper.find('.manage-calendar').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.path).toBe('/merchant/rooms/11/calendar');
  });

  it('删除需二次确认，确认后调用删除并刷新', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.delete-room-type').trigger('click');
    await flushPromises();
    expect(merchantRoomTypeDelete).not.toHaveBeenCalled();
    await wrapper.find('.confirm-delete-room').trigger('click');
    await flushPromises();
    expect(merchantRoomTypeDelete).toHaveBeenCalledWith(11);
    expect(merchantRoomTypePage).toHaveBeenCalledTimes(2);
  });

  it('列表为空时展示空态', async () => {
    vi.mocked(merchantRoomTypePage).mockResolvedValue({ list: [], total: 0 });
    const { wrapper } = await mountView();
    expect(wrapper.text()).toContain('还没有房型');
  });

  it('保存失败展示后端 message', async () => {
    vi.mocked(merchantRoomTypeSave).mockRejectedValue(
      new Error('房间数量至少为 1')
    );
    const { wrapper } = await mountView();
    await wrapper.find('.new-room-type').trigger('click');
    await wrapper.find('.field-room-name input').setValue('双床房');
    await wrapper.find('.field-room-price input').setValue('520');
    await wrapper.find('.room-type-form').trigger('submit');
    await flushPromises();
    expect(wrapper.text()).toContain('房间数量至少为 1');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- src/views/merchant/MerchantRoomTypeView.spec.ts`
Expected: FAIL — 视图不存在。

- [ ] **Step 3: 创建 `src/views/merchant/MerchantRoomTypeView.vue`**

```vue
<script setup lang="ts">
// 某个民宿的房型管理：列表 + 内联新增/编辑表单 + 二次确认删除 + 房态入口。
// 「零间房」等前端可判定的错误就地拦截，其余以后端 message 为准。
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  merchantHotelInfo,
  merchantRoomTypeDelete,
  merchantRoomTypePage,
  merchantRoomTypeSave,
} from '@/api/merchant';
import ImageUploader from '@/components/ImageUploader.vue';
import TagInput from '@/components/TagInput.vue';
import { fmtPrice } from '@/utils/format';
import type { MerchantRoomType, RoomTypeForm } from '@/api/types';

const FACILITY_SUGGESTIONS = ['WiFi', '空调', '独立卫浴', '电热毯', '浴缸', '投影仪'];

const route = useRoute();
const router = useRouter();

const hotelId = computed(() => Number(route.params.id));

const hotelName = ref('');
const list = ref<MerchantRoomType[]>([]);
const loading = ref(true);
const error = ref('');
const busy = ref(false);
const pendingDelete = ref<number | null>(null);

/** 数字输入框被清空时 v-model.number 会留下 ''，这里统一归为 null */
const toNullableNumber = (v: unknown): number | null =>
  v === '' || v == null || Number.isNaN(Number(v)) ? null : Number(v);

/** 表单：null = 关闭；否则为编辑目标（新增时为 undefined id） */
const editing = ref<RoomTypeForm | null>(null);

const blankForm = (): RoomTypeForm => ({
  hotelId: hotelId.value,
  name: '',
  bedType: '',
  area: null,
  maxGuests: 2,
  facilities: [],
  price: 0,
  stock: 1,
  images: [],
  status: 1,
});

async function load(): Promise<void> {
  loading.value = true;
  error.value = '';
  try {
    const [hotel, page] = await Promise.all([
      merchantHotelInfo(hotelId.value),
      merchantRoomTypePage(hotelId.value),
    ]);
    hotelName.value = hotel.name;
    list.value = page.list;
  } catch (e) {
    error.value = e instanceof Error ? e.message : '房型加载失败';
    list.value = [];
  } finally {
    loading.value = false;
  }
}

function startCreate(): void {
  error.value = '';
  editing.value = blankForm();
}

function startEdit(roomType: MerchantRoomType): void {
  error.value = '';
  editing.value = {
    id: roomType.id,
    hotelId: roomType.hotelId,
    name: roomType.name,
    bedType: roomType.bedType ?? '',
    area: roomType.area ?? null,
    maxGuests: Number(roomType.maxGuests) || 2,
    facilities: roomType.facilities ?? [],
    price: Number(roomType.price),
    stock: Number(roomType.stock),
    images: roomType.images ?? [],
    status: Number(roomType.status) === 0 ? 0 : 1,
  };
}

async function submit(): Promise<void> {
  const form = editing.value;
  if (!form) return;
  error.value = '';

  if (!form.name.trim()) {
    error.value = '请填写房型名称';
    return;
  }
  if (!(Number(form.price) > 0)) {
    error.value = '房型价格必须大于 0';
    return;
  }
  if (!(Number(form.stock) >= 1)) {
    error.value = '房间数量至少为 1';
    return;
  }

  busy.value = true;
  try {
    await merchantRoomTypeSave({
      ...form,
      hotelId: hotelId.value,
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      maxGuests: Number(form.maxGuests) || 2,
      area: toNullableNumber(form.area),
      status: Number(form.status),
    });
    editing.value = null;
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : '保存失败，请稍后重试';
  } finally {
    busy.value = false;
  }
}

async function confirmDelete(id: number): Promise<void> {
  error.value = '';
  busy.value = true;
  try {
    await merchantRoomTypeDelete(id);
    pendingDelete.value = null;
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : '删除失败';
  } finally {
    busy.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div class="m-card">
      <h2 class="m-card-title">
        {{ hotelName || '房型管理' }}
        <span class="m-actions">
          <button type="button" class="m-btn new-room-type" @click="startCreate">
            新增房型
          </button>
        </span>
      </h2>

      <p v-if="error" class="m-state m-error">{{ error }}</p>

      <div v-if="loading" class="m-state">正在加载房型…</div>

      <p v-else-if="!list.length" class="m-state">
        还没有房型，点右上角「新增房型」为这家民宿添加房型。
      </p>

      <table v-else class="m-table">
        <thead>
          <tr>
            <th>房型</th>
            <th>床型</th>
            <th>可住</th>
            <th>价格</th>
            <th>房间数</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="roomType in list" :key="roomType.id">
            <td>{{ roomType.name }}</td>
            <td>{{ roomType.bedType || '—' }}</td>
            <td>{{ roomType.maxGuests }} 人</td>
            <td>¥{{ fmtPrice(roomType.price) }}</td>
            <td>{{ roomType.stock }}</td>
            <td>{{ Number(roomType.status) === 1 ? '正常' : '停用' }}</td>
            <td class="row-actions">
              <button type="button" class="link edit-room-type" @click="startEdit(roomType)">
                编辑
              </button>
              <button
                type="button"
                class="link manage-calendar"
                @click="router.push({ name: 'merchant-room-calendar', params: { id: roomType.id }, query: { hotelId } })"
              >
                房态
              </button>

              <template v-if="pendingDelete === roomType.id">
                <span class="m-hint">确认删除？</span>
                <button
                  type="button"
                  class="link danger confirm-delete-room"
                  :disabled="busy"
                  @click="confirmDelete(roomType.id)"
                >
                  确认删除
                </button>
                <button type="button" class="link" @click="pendingDelete = null">取消</button>
              </template>
              <button
                v-else
                type="button"
                class="link danger delete-room-type"
                @click="pendingDelete = roomType.id"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="editing" class="m-card">
      <h2 class="m-card-title">{{ editing.id ? '编辑房型' : '新增房型' }}</h2>
      <form class="room-type-form" @submit.prevent="submit">
        <div class="m-form-grid">
          <div class="m-form-row field-room-name">
            <label>房型名称<span class="m-required">*</span></label>
            <input v-model="editing.name" type="text" placeholder="如 苗寨大床房" />
          </div>
          <div class="m-form-row field-room-bedType">
            <label>床型</label>
            <input v-model="editing.bedType" type="text" placeholder="如 大床 / 双床" />
          </div>
          <div class="m-form-row field-room-price">
            <label>基础价格（元）<span class="m-required">*</span></label>
            <input v-model.number="editing.price" type="number" min="0" step="1" />
          </div>
          <div class="m-form-row field-room-stock">
            <label>房间数量<span class="m-required">*</span></label>
            <input v-model.number="editing.stock" type="number" min="1" step="1" />
          </div>
          <div class="m-form-row field-room-area">
            <label>面积（㎡）</label>
            <input v-model.number="editing.area" type="number" min="0" step="1" />
          </div>
          <div class="m-form-row field-room-maxGuests">
            <label>最多入住</label>
            <input v-model.number="editing.maxGuests" type="number" min="1" step="1" />
          </div>
          <div class="m-form-row field-room-status">
            <label>状态</label>
            <select v-model.number="editing.status">
              <option :value="1">正常</option>
              <option :value="0">停用</option>
            </select>
          </div>
        </div>

        <div class="m-form-row field-room-facilities">
          <label>房间设施</label>
          <TagInput v-model="editing.facilities" :suggestions="FACILITY_SUGGESTIONS" />
        </div>
        <div class="m-form-row field-room-images">
          <label>房型图片</label>
          <ImageUploader v-model="editing.images" :max="4" label="上传房型图片" />
        </div>

        <div class="m-form-actions">
          <button class="m-btn" type="submit" :disabled="busy">
            {{ busy ? '保存中…' : '保存' }}
          </button>
          <button type="button" class="m-btn m-btn-ghost" @click="editing = null">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 操作列与文字按钮。这几个类在 Task 13 的民宿列表里是 <style scoped> 的，
   而 scoped CSS 到不了本组件 —— 所以这里必须自带一份定义，否则编辑/房态/删除
   会退化成浏览器默认按钮、操作列也丢掉 flex 布局（测试只断言 .exists()，抓不到）。 */
.row-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.link {
  border: 0;
  background: transparent;
  color: var(--green-500);
  font-size: 13px;
  padding: 0;
  text-decoration: underline;
}
.link.danger {
  color: var(--gold-600);
}
.link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
```

- [ ] **Step 4: 在 `src/router/index.ts` 的 `/merchant` `children` 里追加两行**

```ts
        {
          path: 'hotels/:id/rooms',
          name: 'merchant-hotel-rooms',
          component: () => import('../views/merchant/MerchantRoomTypeView.vue'),
        },
        {
          path: 'rooms/:id/calendar',
          name: 'merchant-room-calendar',
          component: () => import('../views/merchant/MerchantCalendarView.vue'),
        },
```

> `MerchantCalendarView.vue` 在 Task 16 创建。**本 Task 先创建该文件的空壳**
> （`<template><div /></template>`），Task 16 替换为完整实现。

- [ ] **Step 5: 运行测试确认通过**

Run: `npm run test -- src/views/merchant/MerchantRoomTypeView.spec.ts`
Expected: PASS（9 个用例）。

- [ ] **Step 6: 类型检查 + Commit**

Run: `npm run type-check` → 无错误。

```bash
cd wudong-web
git add src/views/merchant/MerchantRoomTypeView.vue \
  src/views/merchant/MerchantRoomTypeView.spec.ts \
  src/views/merchant/MerchantCalendarView.vue src/router/index.ts
git commit -m "feat(merchant): 房型管理（增改删 + 房态入口）"
```

---

## Task 16: 房态日历（7/30 天 + 批量设价/关房）

**Files:**
- Modify: `wudong-web/src/views/merchant/MerchantCalendarView.vue`（替换空壳）
- Test: `wudong-web/src/views/merchant/MerchantCalendarView.spec.ts`

**Interfaces:**
- Consumes: `merchantRoomTypePage`（Task 7，用来取房型名与基础价）、`merchantCalendarRange/merchantCalendarBatch`（Task 7）、`todayISO/addDaysISO/weekCN`（`src/utils/date.ts`）、`fmtPrice`（`src/utils/format.ts`）。
- Produces: 无新导出；页面以 `route.params.id` 为 roomTypeId。

- [ ] **Step 1: 写失败测试 `src/views/merchant/MerchantCalendarView.spec.ts`**

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createMemoryHistory, createRouter } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import MerchantCalendarView from './MerchantCalendarView.vue';
import { merchantCalendarBatch, merchantCalendarRange, merchantRoomTypePage } from '@/api/merchant';
import { addDaysISO, todayISO } from '@/utils/date';

vi.mock('@/api/merchant', () => ({
  merchantRoomTypePage: vi.fn(),
  merchantCalendarRange: vi.fn(),
  merchantCalendarBatch: vi.fn(),
}));

const TODAY = todayISO();

const rowsFixture = [
  { date: TODAY, price: 380, availableStock: 3, status: 1 },
  { date: addDaysISO(TODAY, 1), price: 420, availableStock: 2, status: 0 },
];

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
  vi.mocked(merchantRoomTypePage).mockReset().mockResolvedValue({
    list: [
      {
        id: 11,
        hotelId: 7,
        name: '苗寨大床房',
        bedType: '大床',
        area: 25,
        maxGuests: 2,
        facilities: [],
        price: 380,
        stock: 3,
        images: [],
        status: 1,
      },
    ],
    total: 1,
  });
  vi.mocked(merchantCalendarRange)
    .mockReset()
    .mockResolvedValue(rowsFixture);
  vi.mocked(merchantCalendarBatch).mockReset().mockResolvedValue({ count: 7 });
});

async function mountView() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/merchant/rooms/:id/calendar', name: 'merchant-room-calendar', component: MerchantCalendarView },
    ],
  });
  await router.push('/merchant/rooms/11/calendar');
  await router.isReady();
  const wrapper = mount(MerchantCalendarView, { global: { plugins: [router] } });
  await flushPromises();
  return { wrapper, router };
}

describe('MerchantCalendarView', () => {
  it('默认查询 7 天并渲染房态行', async () => {
    const { wrapper } = await mountView();
    expect(merchantCalendarRange).toHaveBeenCalledWith(
      11,
      TODAY,
      addDaysISO(TODAY, 6)
    );
    expect(wrapper.text()).toContain('苗寨大床房');
    expect(wrapper.text()).toContain('380.00');
    expect(wrapper.text()).toContain('可订');
    expect(wrapper.text()).toContain('已关房');
  });

  it('切换到 30 天后按新窗口重新查询', async () => {
    const { wrapper } = await mountView();
    const tab30 = wrapper.findAll('.range-tab').find((b) => b.text().includes('30'));
    await tab30!.trigger('click');
    await flushPromises();
    expect(merchantCalendarRange).toHaveBeenLastCalledWith(
      11,
      TODAY,
      addDaysISO(TODAY, 29)
    );
  });

  it('批量设置：提交价格与可售间数后刷新', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.batch-price input').setValue('480');
    await wrapper.find('.batch-stock input').setValue('2');
    await wrapper.find('.batch-form').trigger('submit');
    await flushPromises();

    expect(merchantCalendarBatch).toHaveBeenCalledWith(
      expect.objectContaining({
        roomTypeId: 11,
        startDate: TODAY,
        endDate: addDaysISO(TODAY, 6),
        price: 480,
        availableStock: 2,
      })
    );
    expect(merchantCalendarRange).toHaveBeenCalledTimes(2);
  });

  it('关房勾选后提交 closed=true', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.batch-closed input[type="checkbox"]').setValue(true);
    await wrapper.find('.batch-form').trigger('submit');
    await flushPromises();
    expect(merchantCalendarBatch).toHaveBeenCalledWith(
      expect.objectContaining({ roomTypeId: 11, closed: true })
    );
  });

  it('既不填价格也不勾关房时提示且不提交', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.batch-form').trigger('submit');
    await flushPromises();
    expect(merchantCalendarBatch).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('请填写价格或可售间数，或勾选关房');
  });

  it('按星期筛选：勾选周一后提交 weekDays=[1]', async () => {
    const { wrapper } = await mountView();
    await wrapper.find('.batch-price input').setValue('500');
    const monday = wrapper
      .findAll('.weekday-toggle')
      .find((b) => b.text() === '一');
    await monday!.trigger('click');
    await wrapper.find('.batch-form').trigger('submit');
    await flushPromises();
    expect(merchantCalendarBatch).toHaveBeenCalledWith(
      expect.objectContaining({ weekDays: [1] })
    );
  });

  it('查询失败展示错误', async () => {
    vi.mocked(merchantCalendarRange).mockRejectedValue(new Error('无权操作该资源'));
    const { wrapper } = await mountView();
    expect(wrapper.text()).toContain('无权操作该资源');
  });

  it('批量设置失败展示后端 message', async () => {
    vi.mocked(merchantCalendarBatch).mockRejectedValue(
      new Error('日期区间最多32天')
    );
    const { wrapper } = await mountView();
    await wrapper.find('.batch-price input').setValue('480');
    await wrapper.find('.batch-form').trigger('submit');
    await flushPromises();
    expect(wrapper.text()).toContain('日期区间最多32天');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm run test -- src/views/merchant/MerchantCalendarView.spec.ts`
Expected: FAIL — 空壳组件没有 `.batch-form`。

- [ ] **Step 3: 用完整实现替换 `src/views/merchant/MerchantCalendarView.vue`**

```vue
<script setup lang="ts">
// 房态日历：7/30 天窗口切换 + 逐日房态表 + 批量设置（价格/可售间数/关房，可选星期几）。
// 日期运算统一走 utils/date（本地时区正午基准，避免 UTC 偏移）。
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  merchantCalendarBatch,
  merchantCalendarRange,
  merchantRoomTypePage,
} from '@/api/merchant';
import { addDaysISO, todayISO, weekCN } from '@/utils/date';
import { fmtPrice } from '@/utils/format';
import type { CalendarRow, MerchantRoomType } from '@/api/types';

const route = useRoute();

const roomTypeId = computed(() => Number(route.params.id));
const roomType = ref<MerchantRoomType | null>(null);

const rangeDays = ref<7>(7);
const startDate = ref(todayISO());
const rows = ref<CalendarRow[]>([]);
const loading = ref(true);
const error = ref('');
const notice = ref('');

const endDate = computed(() => addDaysISO(startDate.value, rangeDays.value - 1));

const batch = reactive<{
  startDate: string;
  endDate: string;
  weekDays: number[];
  price: number | null;
  availableStock: number | null;
  closed: boolean;
}>({
  startDate: startDate.value,
  endDate: endDate.value,
  weekDays: [],
  price: null,
  availableStock: null,
  closed: false,
});

const submitting = ref(false);

/** 星期多选按钮顺序：一…六、日（值用 Date#getDay() 的下标） */
const weekdayOptions = [1, 2, 3, 4, 5, 6, 0].map((value) => ({
  value,
  label: weekCN[value],
}));

async function load(): Promise<void> {
  loading.value = true;
  error.value = '';
  try {
    const [page, list] = await Promise.all([
      roomType.value
        ? Promise.resolve({ list: [roomType.value], total: 1 })
        : merchantRoomTypePage(Number(route.query.hotelId) || 0, { size: 50 }),
      merchantCalendarRange(roomTypeId.value, startDate.value, endDate.value),
    ]);
    roomType.value = page.list.find((r) => r.id === roomTypeId.value) ?? null;
    rows.value = list;
  } catch (e) {
    error.value = e instanceof Error ? e.message : '房态加载失败';
    rows.value = [];
  } finally {
    loading.value = false;
  }
}

async function switchRange(days: number): Promise<void> {
  rangeDays.value = days;
  batch.startDate = startDate.value;
  batch.endDate = endDate.value;
  await load();
}

async function shiftWindow(offset: number): Promise<void> {
  startDate.value = addDaysISO(startDate.value, offset);
  batch.startDate = startDate.value;
  batch.endDate = endDate.value;
  await load();
}

function toggleWeekday(value: number): void {
  const index = batch.weekDays.indexOf(value);
  if (index >= 0) batch.weekDays.splice(index, 1);
  else batch.weekDays.push(value);
}

async function submitBatch(): Promise<void> {
  error.value = '';
  notice.value = '';

  if (!batch.closed && batch.price == null && batch.availableStock == null) {
    error.value = '请填写价格或可售间数，或勾选关房';
    return;
  }
  if (!batch.closed && batch.price != null && !(Number(batch.price) > 0)) {
    error.value = '房型价格必须大于 0';
    return;
  }

  submitting.value = true;
  try {
    const result = await merchantCalendarBatch({
      roomTypeId: roomTypeId.value,
      startDate: batch.startDate,
      endDate: batch.endDate,
      weekDays: batch.weekDays.length ? batch.weekDays.slice() : undefined,
      price: batch.closed || batch.price == null ? undefined : Number(batch.price),
      availableStock:
        batch.closed || batch.availableStock == null
          ? undefined
          : Number(batch.availableStock),
      closed: batch.closed,
    });
    notice.value = `已更新 ${result.count} 天房态`;
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : '设置失败，请稍后重试';
  } finally {
    submitting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div class="m-card">
      <h2 class="m-card-title">
        {{ roomType ? `${roomType.name} · 房态` : '房态日历' }}
        <span class="m-actions">
          <button
            v-for="days in [7, 30]"
            :key="days"
            type="button"
            class="range-tab"
            :class="{ active: rangeDays === days }"
            @click="switchRange(days)"
          >
            {{ days }} 天
          </button>
        </span>
      </h2>

      <div class="calendar-window">
        <button type="button" class="m-btn m-btn-ghost" @click="shiftWindow(-7)">
          上一周
        </button>
        <span class="m-hint">{{ startDate }} ~ {{ endDate }}</span>
        <button type="button" class="m-btn m-btn-ghost" @click="shiftWindow(7)">
          下一周
        </button>
      </div>

      <p v-if="error" class="m-state m-error">{{ error }}</p>
      <p v-if="notice" class="m-hint">{{ notice }}</p>

      <div v-if="loading" class="m-state">正在加载房态…</div>

      <table v-else class="m-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>星期</th>
            <th>价格</th>
            <th>可售间数</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.date">
            <td>{{ row.date }}</td>
            <td>周{{ weekCN[new Date(`${row.date}T12:00:00`).getDay()] }}</td>
            <td>¥{{ fmtPrice(row.price) }}</td>
            <td>{{ row.availableStock }}</td>
            <td>{{ Number(row.status) === 1 ? '可订' : '已关房' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="m-card">
      <h2 class="m-card-title">批量设置房态</h2>
      <form class="batch-form" @submit.prevent="submitBatch">
        <div class="m-form-grid">
          <div class="m-form-row batch-start">
            <label>开始日期</label>
            <input v-model="batch.startDate" type="date" />
          </div>
          <div class="m-form-row batch-end">
            <label>结束日期</label>
            <input v-model="batch.endDate" type="date" />
          </div>
          <div class="m-form-row batch-price">
            <label>当日价格（元）</label>
            <input v-model.number="batch.price" type="number" min="0" step="1" placeholder="不填则不改价" />
          </div>
          <div class="m-form-row batch-stock">
            <label>可售间数</label>
            <input
              v-model.number="batch.availableStock"
              type="number"
              min="0"
              step="1"
              placeholder="不超过房型房间数"
            />
          </div>
        </div>

        <div class="m-form-row">
          <label>限定星期（不选表示区间内全部）</label>
          <div class="weekday-row">
            <button
              v-for="item in weekdayOptions"
              :key="item.value"
              type="button"
              class="weekday-toggle"
              :class="{ active: batch.weekDays.includes(item.value) }"
              @click="toggleWeekday(item.value)"
            >
              {{ item.label }}
            </button>
          </div>
        </div>

        <div class="m-form-row batch-closed">
          <label>
            <input v-model="batch.closed" type="checkbox" />
            关房（该区间不可预订）
          </label>
        </div>

        <div class="m-form-actions">
          <button class="m-btn" type="submit" :disabled="submitting">
            {{ submitting ? '提交中…' : '应用到区间' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.range-tab {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 13px;
  color: var(--muted);
}
.range-tab.active {
  border-color: var(--green-700);
  background: var(--green-700);
  color: #fff;
}
.calendar-window {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.weekday-row {
  display: flex;
  gap: 6px;
}
.weekday-toggle {
  width: 34px;
  height: 34px;
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 50%;
  font-size: 13px;
  color: var(--muted);
}
.weekday-toggle.active {
  border-color: var(--green-700);
  background: var(--green-700);
  color: #fff;
}
</style>
```

> **房型名获取**：上面用 `merchantRoomTypePage(Number(route.query.hotelId) || 0, ...)` 取房型，
> `hotelId` 由 Task 15 的房型管理页跳转时通过 query 带过来（`params: { id }, query: { hotelId }`）。
> 本 Task 的 `MerchantRoomTypeView.vue` 无需改动。取不到时只影响标题展示，不影响功能。

- [ ] **Step 4: 运行测试确认通过**

Run: `npm run test`
Expected: PASS（含房态页 8 个用例）。

- [ ] **Step 5: 类型检查 + Commit**

Run: `npm run type-check` → 无错误。

```bash
cd wudong-web
git add src/views/merchant/MerchantCalendarView.vue \
  src/views/merchant/MerchantCalendarView.spec.ts
git commit -m "feat(merchant): 房态日历（7/30 天 + 批量设价/关房）"
```

---

## Task 17: 文档与整链验证

**Files:**
- Modify: `wudong-web/README.md`
- Modify: `docs/`（若仓库根 README 有模块清单，则同步一行；没有则跳过）

**Interfaces:**
- Consumes: 全部前序 Task。
- Produces: 文档与一次端到端人工验证记录。

- [ ] **Step 1: 更新 `wudong-web/README.md`**

在「目录」与「接入指南」之间插入一节（内容按下面原文，若 README 已有同名小节则合并）：

```markdown
## 商家区（B 端）

访客站在顶栏提供「商家中心」入口，路由前缀 `/merchant`，需要登录（未登录跳 `/login?redirect=…`）。

| 路由 | 页面 | 说明 |
|---|---|---|
| `/login` | 登录/注册 | 手机号+密码登录；注册需短信验证码（本地环境后端把验证码放在返回值里，页面自动回填） |
| `/merchant` | 店铺概览 | 店铺信息 + 入驻进度（待审核/已驳回原因） |
| `/merchant/apply` | 入驻申请 | 三态：已入驻 / 审核中 / 可提交（驳回后用上次资料预填） |
| `/merchant/hotels` | 我的民宿 | 名称与状态筛选、上下架、编辑、删除（有房型时后端拒绝） |
| `/merchant/hotels/new`、`/merchant/hotels/:id/edit` | 民宿表单 | 主图/图集上传、标签输入、经纬度、押金、含早、上下架 |
| `/merchant/hotels/:id/rooms` | 房型管理 | 房型增删改、房态入口 |
| `/merchant/rooms/:id/calendar` | 房态日历 | 7/30 天窗口，按区间批量设价/设可售间数/关房，可限定星期几 |

后端接口一律挂在 `/app/accommodation/merchant/**`（前缀显式声明），归属校验集中在
`accommodation/service/merchant-scope.ts`：非正常状态商家 → `仅商家可访问`；非本人民宿/房型 →
`无权操作该资源`（不区分“不存在”与“非本人”，避免探测）。

批量设置房态可直接复用后端 `RoomCalendarService` 的语义：区间内无记录的日期回退到房型基础价与房间数，
`availableStock` 会被截断到房型房间数；单次窗口上限 32 天。

`USE_MOCK=true`（见 `.env.demo`）时商家区走 `src/mocks/merchant.ts` 的内存数据，增删改在本次会话内生效，
无需后端即可演示；演示身份是已入驻的「乌东苗寨木楼」（住宿模块）。
```

- [ ] **Step 2: 全量前端测试**

Run（`wudong-web/`）：`npm run test`
Expected: 全部 PASS。

- [ ] **Step 3: 前端类型检查**

Run：`npm run type-check`
Expected: 无错误。

- [ ] **Step 4: 全量后端测试（先停掉 8001 的 dev 进程）**

Run（`cool-admin-midway/`）：`npm run test`
Expected: 全部 PASS（既有套件 + 本计划的 4 个新套件 + operate 回归）。

> 若既有套件里有与本计划无关的失败（例如其它组未完成的模块），**记录失败清单但不修改它们的代码**，
> 在 Task 完成报告里如实说明。

- [ ] **Step 5: 端到端人工联调（真实后端）**

后端 `cd cool-admin-midway && npm run dev`（8001）；前端 `cd wudong-web && npm run dev`（5173，`.env.development` 的 `VITE_USE_MOCK=false`）。按序验证：

1. 打开 `http://localhost:5173/hotels/:id` 记录某民宿（C 端）当前房型与房态；
2. 顶栏「商家中心」→ 跳 `/login`；用注册流程建一个新账号（本地验证码自动回填）→ 登录成功回到 `/merchant`；
3. `/merchant/apply` 提交入驻申请（模块选「住宿」，三张证件图各上传一张）→ 状态变「待审核」；
4. 用平台管理员在 `cool-admin-vue` 的商家审核页通过该申请（或直接调用 `MerchantService.audit`）；
5. 刷新 `/merchant`：显示店铺信息；进入「我的民宿」新增一家民宿 + 一个房型；
6. 进入房态日历，批量设置未来 7 天价格 → 表格数值随之变化；勾选「关房」提交一天 → 该行显示「已关房」；
7. 回到 C 端 `/hotels/:id`（同一民宿，前提是该民宿确实被 C 端接口按 `status=1` 返回）确认房态展示一致；
8. 「我的民宿」删除该房型后再删除民宿 → 成功（验证 P6/P7）。

把第 5–8 步的截图或结论写回本任务报告。

- [ ] **Step 6: Commit**

```bash
cd wudong-web
git add README.md
git commit -m "docs(merchant): 商家区路由/接口/演示数据说明"
```

---

## Self-Review

**1. Spec coverage**

| Spec 章节 | 覆盖任务 |
|---|---|
| §4 后端新增文件（merchant.ts 控制器、merchant-scope 服务） | Task 1（scope + 控制器骨架）、Task 2/3/4（补齐 11 个端点） |
| §4.2 端点表 `/hotel/page·info·add·update·delete` | Task 1、Task 2 |
| §4.2 端点表 `/room-type/page·add·update·delete` | Task 3 |
| §4.2 端点表 `/calendar/batch·range` | Task 4 |
| §4.3 P1 全部需登录 | Task 1（未登录用例）、Task 3、Task 4 |
| §4.3 P2 非商家/被禁用 → `仅商家可访问` | Task 1 |
| §4.3 P3 非本人 → `无权操作该资源`（与不存在同文案） | Task 1（scope）、Task 2/3/4（各自用例） |
| §4.3 P4 非住宿模块不可新增 | Task 2 |
| §4.3 P5 忽略/覆盖请求体 merchantId | Task 2（新增与更新各一条用例） |
| §4.3 P6 有房型不可删 | Task 2 |
| §4.3 P7 删房型级联清房态 | Task 3 |
| §4.3 P8 商家可自管上下架 | Task 2（status 字段）、Task 13（`merchantHotelSetStatus`） |
| §4.4 校验（价格>0、库存≥1、必填、数组字段） | Task 2、Task 3、Task 4 |
| §5 前端：http 鉴权/登录失效 | Task 6 |
| §5 前端：登录与登录态持久化 | Task 8、Task 10 |
| §5 前端：商家区路由与守卫 | Task 9 |
| §5 前端：入驻申请与进度 | Task 12 |
| §5 前端：民宿/房型/房态管理 | Task 13、Task 14、Task 15、Task 16 |
| §5 前端：图片上传、标签 | Task 11 |
| §10.2b operate `keyWordLikeFields` 属性名 | Task 5（原判为「修复缺陷」，核对后降级为纯回归守卫；见 Task 5 与 spec §10.2b 的修正说明） |
| §5.1 鉴权头 **裸 token**（对 spec 的更正） | 全局约束 + Task 6/8（spec 里写的 `Bearer` 是错的，以本 plan 为准） |
| 演示/mock 能力（`.env.demo`） | Task 7（`mocks/merchant.ts`）、Task 17（README） |

**2. Placeholder scan**：本 plan 无 TBD/TODO；每个代码步骤都给出了可直接粘贴的完整实现。
两处「先建空壳、后续 Task 替换」的说明（Task 13 Step 8 的 `MerchantHotelEditView.vue`、
Task 15 Step 4 的 `MerchantCalendarView.vue`）是为了让路由始终指向真实存在的文件，
空壳内容已明确给出（`<template><div /></template>`），不是未定义内容。

**3. Type consistency**

- 后端：`MerchantScopeService.requireMerchant/requireOwnedHotel/requireOwnedRoomType` 在 Task 1 定义，
  Task 2/3/4 一致引用；`MerchantHotelService` 方法名 `hotelPage/hotelInfo/hotelAdd/hotelUpdate/hotelRemove` 与控制器调用一致；
  `MerchantRoomTypeService` 方法名 `roomTypePage/roomTypeAdd/roomTypeUpdate/roomTypeRemove` 一致；`MerchantCalendarService.range/batch` 一致（不撞 `BaseService`）。
- 控制器方法名 `hotelPage/hotelInfo/hotelAdd/hotelUpdate/hotelDelete`、`roomTypePage/Add/Update/Delete`、
  `calendarRange/calendarBatch` 与 `BaseController` 内置方法（`page/info/add/update/delete`）**均不重名**。
- 前端：`MerchantHotel`/`MerchantRoomType`/`HotelForm`/`RoomTypeForm`/`CalendarBatchForm` 在 Task 7 定义，
  Task 13–16 一致使用；api 函数名在 Task 7 定义、Task 13 追加 `merchantHotelSetStatus`，
  各视图 import 的名字与定义一致。
- 文案一致：后端 12 条固定文案（见全局约束）在测试与前端提示中逐字一致。

**4. 已知偏差（需要知晓）**

- Task 5 的回归测试是**元数据断言**（`curdOption.pageQueryOp`），不是行为测试——jest 里拿不到 admin token
  （测试配置 `initDB: false` 不导入种子管理员）。行为确认放在手工验证与 Task 17 的整体联调里。
- Task 5 声称的「小写 w 缺陷」经核对**不存在**（两个控制器本已正确、历史中从未出现小写写法），
  故该 Task 无生产代码改动、也无 RED，只是把 cool 读取的属性名钉进测试防退化。执行时不要为了凑 TDD 去先改坏代码。
- 房态本期是**展示性数据**：base 的 `order` 模块不反查 `room_calendar`（单向依赖），因此设置房态不会影响下单库存。
- 商家订单/财务不在本期范围（需要 `order` 模块提供商家维度接口，属跨模块工作）。

