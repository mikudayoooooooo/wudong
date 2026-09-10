# accommodation(住) + operate(平台运营位) 模块实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 cool-admin-midway 新增 `accommodation`（民宿/房型/房态日历的管理与 C 端浏览）与 `operate`（banner/announcement 运营位 + finance_record 建表）两个后端模块，全量 jest 通过。

**Architecture:** 完全复用 member 模块已验证的 Cool Admin 范式：`controller/admin|app` 双控制器 + `entity` + 可选 `service`。URL 前缀由文件路径自动推导（源码确认：`controller/admin/hotel.ts → /admin/accommodation/hotel`，模块名自动插第 2 段）。管理端走 Cool 自动 CRUD + `BaseAuthorityMiddleware`（无 token → HTTP 401）；C 端浏览类接口标 `IGNORE_TOKEN` 匿名可读。表由 `synchronize:true` 自动创建。**预订/支付/结算等写闭环不在本期**（等 base order/pay，见 spec §8）。

**Tech Stack:** Midway.js 3 + TypeORM 0.3 + @cool-midway/core + jest(ts-jest, 单 worker) + mysql2(docker wudong-mysql 3307) + moment。

**Spec:** [2026-09-09-accommodation-operate-design.md](../specs/2026-09-09-accommodation-operate-design.md)（plan 以 spec 为准，二者同读）

## Global Constraints

- 只改/新增 `cool-admin-midway/src/modules/accommodation/**` 与 `src/modules/operate/**` 及其 `test/*`；**不得修改** base/user/member 模块（含 member 扩展点，留给 base 轨道）
- 表名沿用 schema.sql verbatim：`hotel`、`room_type`、`room_calendar`、`banner`、`announcement`、`finance_record`
- 字段 camelCase，与 schema snake_case 一一对应；时间字段 `createTime/updateTime` 来自 BaseEntity；`createTime` 等由 TypeORM/Cool hook 自动填充，**mysql2 直插种子时必须显式给 createTime/updateTime**
- JSON 字段统一 `transformerJson`；`'HH:mm'` 与 `'YYYY-MM-DD HH:mm:ss'` 均按字符串存取
- 不建物理外键；仅逻辑关联 + 索引
- URL：管理端 `/admin/<module>/<file>/*`，C 端 `/app/<module>/<file>/*`；C 端匿名浏览方法必须 `@CoolTag(TagTypes.IGNORE_TOKEN)`
- admin CRUD 由 CoolController `api` 自动生成：`add/delete/update/page/list` 为 POST，`info` 为 GET；分页参数 `page/size`
- 测试契约：无 admin token 访问 `/admin/*` → **HTTP 401**；IGNORE_TOKEN 的 `/app/*` → 200 + `code:1000`
- jest 单 worker 串行（`maxWorkers:1`）、`globalSetup` 每次全量 run 重建 `wudong_platform_test`；**跑测试前必须停 dev(8001)**（二者互斥抢 8001）；每 suite `boot()` 一次、`afterAll(close)`
- admin token 在本测试环境不可用（unittest 库无种子管理员），故 admin **写逻辑用 service 直调 + 数据层断言**正测，HTTP 只做 401 契约
- 零新增 npm 依赖；每个 Task 结束做一次可独立验收的测试通过 + 一次 git commit

---

## 文件结构总览

```
cool-admin-midway/src/modules/
├── accommodation/
│   ├── config.ts                          # 模块 name/description
│   ├── entity/hotel.ts  room-type.ts  room-calendar.ts
│   ├── service/room-calendar.ts           # batch/range（日历落库+回退）
│   ├── service/hotel.ts                   # search/detail（C 端浏览）
│   └── controller/
│       ├── admin/hotel.ts  room-type.ts  room-calendar.ts
│       └── app/hotel.ts  room-type.ts
└── operate/
    ├── config.ts
    ├── entity/banner.ts  announcement.ts  finance-record.ts
    ├── service/banner.ts  announcement.ts   # 有效下发过滤
    └── controller/
        ├── admin/banner.ts  announcement.ts  finance-record.ts
        └── app/operate.ts                  # GET /banner、/announcement

cool-admin-midway/test/
├── accommodation-entity.test.ts
├── accommodation-room-calendar.test.ts     # RoomCalendarService.batch/range（service 直调）
├── accommodation-admin.test.ts             # admin 三资源 401 契约
├── accommodation-app.test.ts               # C 端 search/detail/calendar HTTP 正测
├── operate-entity.test.ts
├── operate-admin.test.ts                   # admin 401 契约
└── operate-app.test.ts                     # 匿名下发 HTTP 正测
```

**关键接口签名（跨 Task 依赖）：**

- `RoomCalendarService.batch(param: {roomTypeId:number; startDate:string; endDate:string; weekDays?:number[]; price?:number; availableStock?:number; closed?:boolean}): Promise<{count:number}>` —— 逐日 upsert；closed=true→status=0；availableStock>房型 stock→截断；房型不存在抛 `CoolCommException('房型不存在')`
- `RoomCalendarService.range(roomTypeId:number, startDate:string, endDate:string): Promise<{date; price; availableStock; status}[]>` —— 缺省日期回退 `roomType.price/stock/status`
- `AccommodationHotelService.search(query): Promise<{list; total}>` —— 只查 status=1，含房型最低价与价格过滤/排序（分两阶段查询，无 SQL 聚合歧义）
- `AccommodationHotelService.detail(id): Promise<{info; roomTypes}>`
- `BannerService.bannerList(position?): Promise<BannerEntity[]>`、`AnnouncementService.announcementList(type?): Promise<AnnouncementEntity[]>`

---

### Task 1: accommodation 三实体 + 模块配置 + 自动建表

**Files:**
- Create: `cool-admin-midway/src/modules/accommodation/config.ts`
- Create: `cool-admin-midway/src/modules/accommodation/entity/hotel.ts`
- Create: `cool-admin-midway/src/modules/accommodation/entity/room-type.ts`
- Create: `cool-admin-midway/src/modules/accommodation/entity/room-calendar.ts`
- Test: `cool-admin-midway/test/accommodation-entity.test.ts`

**Interfaces:**
- Produces: `HotelEntity`(`@Entity('hotel')`)、`RoomTypeEntity`(`@Entity('room_type')`)、`RoomCalendarEntity`(`@Entity('room_calendar')`，复合唯一 `uk_room_calendar_roomTypeId_date`)。后续所有 Task 依赖这三类及字段名。

- [ ] **Step 1: 写失败测试**

```ts
import * as mysql from 'mysql2/promise';
import { boot, close } from './helper';

describe('accommodation 实体自动建表', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it('hotel / room_type / room_calendar 三表存在且关键列 camelCase', async () => {
    const conn = await mysql.createConnection({
      host: '127.0.0.1', port: 3307, user: 'root',
      password: '123456', database: 'wudong_platform_test',
    });
    const [tables]: any = await conn.query(
      `SELECT COUNT(*) c FROM information_schema.tables
       WHERE table_schema='wudong_platform_test'
         AND table_name IN ('hotel','room_type','room_calendar')`
    );
    expect(Number(tables[0].c)).toBe(3);
    const [cols]: any = await conn.query(
      `SELECT table_name, column_name FROM information_schema.columns
       WHERE table_schema='wudong_platform_test'
         AND ((table_name='hotel' AND column_name IN ('merchantId','name','styleTags','longitude','status'))
           OR (table_name='room_type' AND column_name IN ('hotelId','price','stock','maxGuests'))
           OR (table_name='room_calendar' AND column_name IN ('roomTypeId','date','availableStock','price','status')))`
    );
    expect(cols.length).toBe(14);
    const [uk]: any = await conn.query(
      `SELECT COUNT(*) c FROM information_schema.statistics
       WHERE table_schema='wudong_platform_test' AND table_name='room_calendar'
         AND index_name='uk_room_calendar_roomTypeId_date' AND non_unique=0`
    );
    expect(Number(uk[0].c)).toBeGreaterThan(0);
    await conn.end();
  });
});
```

- [ ] **Step 2: 跑测试确认红**

Run: `npm test -- accommodation-entity`
Expected: FAIL（`hotel/room_type/room_calendar` 表不存在，`expect(3).toBe(3)` 断言不满足）

- [ ] **Step 3: 最小实现**

`config.ts`:
```ts
import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    name: '住-住宿预订',
    description: 'accommodation：民宿/房型/房态日历管理，C端浏览；预订闭环待 base order/pay',
    middlewares: [],
    globalMiddlewares: [],
    order: 0,
  } as ModuleConfig;
};
```

`entity/hotel.ts`:
```ts
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity, transformerJson } from '../../base/entity/base';

/** 民宿 */
@Entity('hotel')
export class HotelEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商家ID（归属标识）', nullable: true })
  merchantId: number;

  @Column({ comment: '民宿名称', length: 100 })
  name: string;

  @Column({ comment: '地址', length: 200 })
  address: string;

  @Column({ comment: '经度', type: 'decimal', precision: 10, scale: 6 })
  longitude: number;

  @Column({ comment: '纬度', type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({ comment: '风格标签', type: 'json', nullable: true, transformer: transformerJson })
  styleTags: string[];

  @Column({ comment: '设施标签', type: 'json', nullable: true, transformer: transformerJson })
  facilityTags: string[];

  @Column({ comment: '主图', length: 500, nullable: true })
  mainImage: string;

  @Column({ comment: '图片集', type: 'json', nullable: true, transformer: transformerJson })
  images: string[];

  @Column({ comment: '介绍', type: 'text', nullable: true })
  intro: string;

  @Column({ comment: '入住时间', length: 5, default: '14:00' })
  checkInTime: string;

  @Column({ comment: '离店时间', length: 5, default: '12:00' })
  checkOutTime: string;

  @Column({ comment: '宠物政策', length: 200, nullable: true })
  petPolicy: string;

  @Column({ comment: '是否含早餐', dict: ['不含早', '含早'], default: 0 })
  hasBreakfast: number;

  @Column({ comment: '押金', type: 'decimal', precision: 10, scale: 2, default: 0 })
  deposit: number;

  @Column({ comment: '评分', type: 'decimal', precision: 3, scale: 2, default: 5.0 })
  rating: number;

  @Column({ comment: '评价数', default: 0 })
  reviewCount: number;

  @Column({ comment: '状态：1正常 0下架', dict: ['下架', '正常'], default: 1 })
  status: number;
}
```

`entity/room-type.ts`:
```ts
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity, transformerJson } from '../../base/entity/base';

/** 房型 */
@Entity('room_type')
export class RoomTypeEntity extends BaseEntity {
  @Index()
  @Column({ comment: '民宿ID' })
  hotelId: number;

  @Column({ comment: '房型名称', length: 100 })
  name: string;

  @Column({ comment: '床型', length: 50, nullable: true })
  bedType: string;

  @Column({ comment: '面积(㎡)', nullable: true })
  area: number;

  @Column({ comment: '最多入住人数', default: 2 })
  maxGuests: number;

  @Column({ comment: '设施列表', type: 'json', nullable: true, transformer: transformerJson })
  facilities: string[];

  @Column({ comment: '基础价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '房间数量', default: 1 })
  stock: number;

  @Column({ comment: '房型图片', type: 'json', nullable: true, transformer: transformerJson })
  images: string[];

  @Column({ comment: '状态：1正常 0停用', dict: ['停用', '正常'], default: 1 })
  status: number;
}
```

`entity/room-calendar.ts`:
```ts
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

/** 房态日历 */
@Entity('room_calendar')
@Index('uk_room_calendar_roomTypeId_date', ['roomTypeId', 'date'], { unique: true })
export class RoomCalendarEntity extends BaseEntity {
  @Column({ comment: '房型ID' })
  roomTypeId: number;

  @Column({ comment: '日期', type: 'date' })
  date: string;

  @Column({ comment: '当日可售间数', default: 0 })
  availableStock: number;

  @Column({ comment: '当日价格（动态定价）', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '状态：1可订 0不可订', dict: ['不可订', '可订'], default: 1 })
  status: number;
}
```

- [ ] **Step 4: 跑测试确认绿**

Run: `npm test -- accommodation-entity`
Expected: PASS（1 个用例：建表 + 关键列 + 唯一索引全部通过）

- [ ] **Step 5: Commit**

```bash
git add cool-admin-midway/src/modules/accommodation cool-admin-midway/test/accommodation-entity.test.ts
git commit -m "feat(accommodation): 三实体 hotel/room_type/room_calendar + 模块配置，synchronize 自动建表"
```

---

### Task 2: accommodation 管理端三资源装配 + 401 契约

**Files:**
- Create: `cool-admin-midway/src/modules/accommodation/controller/admin/hotel.ts`
- Create: `cool-admin-midway/src/modules/accommodation/controller/admin/room-type.ts`
- Create: `cool-admin-midway/src/modules/accommodation/controller/admin/room-calendar.ts`（Task 3 会在此追加 batch/range 方法）
- Test: `cool-admin-midway/test/accommodation-admin.test.ts`

**Interfaces:**
- Consumes: Task 1 三实体
- Produces: 路由 `/admin/accommodation/hotel|room-type|room-calendar`（POST `/page|add|update|delete|list`，GET `/info`）

- [ ] **Step 1: 写失败测试**

```ts
import { boot, close, createHttpRequest } from './helper';

describe('accommodation 管理端', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it.each([
    '/admin/accommodation/hotel/page?page=1&size=10',
    '/admin/accommodation/room-type/page?page=1&size=10',
    '/admin/accommodation/room-calendar/page?page=1&size=10',
  ])('无 admin token 访问 %s 返回 401（路由已注册且受 admin 鉴权）', async (url) => {
    const res = await createHttpRequest(app).get(url);
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 2: 跑测试确认红**

Run: `npm test -- accommodation-admin`
Expected: FAIL（路由未注册时返回 404 而非 401）

- [ ] **Step 3: 最小实现**

```ts
// controller/admin/hotel.ts
import { CoolController, BaseController } from '@cool-midway/core';
import { HotelEntity } from '../../entity/hotel';

@CoolController({
  api: ['add', 'delete', 'update', 'page', 'list', 'info'],
  entity: HotelEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.merchantId'],
    keyWordLikeFields: ['a.name', 'a.address'],
  },
})
export class AdminAccommodationHotelController extends BaseController {}
```

```ts
// controller/admin/room-type.ts
import { CoolController, BaseController } from '@cool-midway/core';
import { RoomTypeEntity } from '../../entity/room-type';

@CoolController({
  api: ['add', 'delete', 'update', 'page', 'list', 'info'],
  entity: RoomTypeEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.hotelId'],
    keyWordLikeFields: ['a.name'],
  },
})
export class AdminAccommodationRoomTypeController extends BaseController {}
```

```ts
// controller/admin/room-calendar.ts
import { CoolController, BaseController } from '@cool-midway/core';
import { RoomCalendarEntity } from '../../entity/room-calendar';

@CoolController({
  api: ['page', 'info', 'delete'],
  entity: RoomCalendarEntity,
  pageQueryOp: {
    fieldEq: ['a.roomTypeId', 'a.status'],
  },
})
export class AdminAccommodationRoomCalendarController extends BaseController {}
```

- [ ] **Step 4: 跑测试确认绿**

Run: `npm test -- accommodation-admin`
Expected: PASS（3 条路由均 401）

- [ ] **Step 5: Commit**

```bash
git add cool-admin-midway/src/modules/accommodation/controller/admin cool-admin-midway/test/accommodation-admin.test.ts
git commit -m "feat(accommodation): 管理端 hotel/room-type/room-calendar CRUD 装配（admin 401 契约通过）"
```

---

### Task 3: RoomCalendarService（batch/range，动态定价与回退）

**Files:**
- Create: `cool-admin-midway/src/modules/accommodation/service/room-calendar.ts`
- Modify: `cool-admin-midway/src/modules/accommodation/controller/admin/room-calendar.ts`（补 `@Post('/batch')` 与 `@Get('/range')`）
- Test: `cool-admin-midway/test/accommodation-room-calendar.test.ts`

**Interfaces:**
- Consumes: `RoomCalendarEntity`、`RoomTypeEntity`（Task 1）
- Produces: `RoomCalendarService.batch/range`（签名见文件结构总览）；admin 路由 `POST /admin/accommodation/room-calendar/batch`、`GET /admin/accommodation/room-calendar/range`

- [ ] **Step 1: 写失败测试**（service 直调，不经 admin HTTP；种子经 service 仓库注入）

```ts
import { boot, close } from './helper';
import { RoomCalendarService } from '../src/modules/accommodation/service/room-calendar';

describe('accommodation 房态日历服务 batch/range', () => {
  let app;
  let svc: RoomCalendarService;
  let roomTypeId: number;

  beforeAll(async () => {
    app = await boot();
    svc = await app.getApplicationContext().getAsync(RoomCalendarService);
    // 造民宿 + 房型种子（价格 380，3 间），createTime/updateTime 由框架 hook 填充
    const hotel = await svc.hotelEntity.save({
      name: '乌东苗寨木楼', address: '雷山县乌东村', longitude: 108.1, latitude: 26.3,
    } as any);
    const rt = await svc.roomTypeEntity.save({
      hotelId: hotel.id, name: '木屋大床房', price: 380, stock: 3,
    } as any);
    roomTypeId = rt.id;
  });

  afterAll(async () => {
    await close(app);
  });

  it('range 对无记录日期回退房型默认价/满库/可订', async () => {
    const rows = await svc.range(roomTypeId, '2026-10-01', '2026-10-03');
    expect(rows).toHaveLength(3);
    expect(rows[0].date).toBe('2026-10-01');
    expect(String(rows[0].price)).toBe('380.00');
    expect(rows[0].availableStock).toBe(3);
    expect(rows[0].status).toBe(1);
  });

  it('batch 落库、覆盖、关房、库存截断到房型 stock', async () => {
    await svc.batch({
      roomTypeId, startDate: '2026-10-01', endDate: '2026-10-05',
      price: 520, availableStock: 9, // 9 > stock 3 → 截断为 3
    });
    const rows = await svc.range(roomTypeId, '2026-10-01', '2026-10-05');
    expect(String(rows[0].price)).toBe('520.00');
    expect(rows[0].availableStock).toBe(3);

    // 关房 10-03
    await svc.batch({
      roomTypeId, startDate: '2026-10-03', endDate: '2026-10-03', closed: true,
    });
    const closed = await svc.range(roomTypeId, '2026-10-03', '2026-10-03');
    expect(closed[0].status).toBe(0);
  });

  it('batch 支持 weekDays 限调（仅周六 600，其余回退 380）', async () => {
    // 2026-10-10 是周六(day=6)、10-11 周日、10-12 周一
    await svc.batch({
      roomTypeId, startDate: '2026-10-10', endDate: '2026-10-12',
      weekDays: [6], price: 600,
    });
    const rows = await svc.range(roomTypeId, '2026-10-10', '2026-10-12');
    expect(String(rows.find(r => r.date === '2026-10-10')!.price)).toBe('600.00');
    expect(String(rows.find(r => r.date === '2026-10-11')!.price)).toBe('380.00'); // 周日未调
    expect(String(rows.find(r => r.date === '2026-10-12')!.price)).toBe('380.00'); // 周一未调
  });

  it('batch 对不存在房型抛业务异常', async () => {
    await expect(
      svc.batch({ roomTypeId: 999999, startDate: '2026-10-01', endDate: '2026-10-02' })
    ).rejects.toThrow(/房型不存在/);
  });
});
```

- [ ] **Step 2: 跑测试确认红**

Run: `npm test -- accommodation-room-calendar`
Expected: FAIL（`RoomCalendarService` 不存在 → import 报错，用例全红）

- [ ] **Step 3: 最小实现**

`service/room-calendar.ts`:
```ts
import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { RoomCalendarEntity } from '../entity/room-calendar';
import { RoomTypeEntity } from '../entity/room-type';
import { HotelEntity } from '../entity/hotel';

const FMT = 'YYYY-MM-DD';

/**
 * 房态日历：按需落记录 + 查询回退默认（spec D2）
 */
@Provide()
export class RoomCalendarService extends BaseService {
  @InjectEntityModel(RoomCalendarEntity)
  roomCalendarEntity: Repository<RoomCalendarEntity>;

  @InjectEntityModel(RoomTypeEntity)
  roomTypeEntity: Repository<RoomTypeEntity>;

  @InjectEntityModel(HotelEntity)
  hotelEntity: Repository<HotelEntity>;

  /**
   * 批量设置：区间（可选限定星期几 0-6）逐日 upsert。
   * closed=true → 当日 status=0；否则写 price/availableStock 并置可订；
   * availableStock 截断到房型 stock。
   */
  async batch(param: {
    roomTypeId: number; startDate: string; endDate: string;
    weekDays?: number[]; price?: number; availableStock?: number; closed?: boolean;
  }): Promise<{ count: number }> {
    const roomType = await this.roomTypeEntity.findOneBy({ id: param.roomTypeId });
    if (!roomType) {
      throw new CoolCommException('房型不存在');
    }
    const start = moment(param.startDate, FMT);
    const end = moment(param.endDate, FMT);
    const week = (param.weekDays || []).map(Number);

    // 预载区间已有行
    const existingRows = await this.roomCalendarEntity
      .createQueryBuilder('c')
      .where('c.roomTypeId = :id', { id: param.roomTypeId })
      .andWhere('c.date >= :start', { start: param.startDate })
      .andWhere('c.date <= :end', { end: param.endDate })
      .getMany();
    const map: Record<string, RoomCalendarEntity> = {};
    for (const r of existingRows) map[r.date] = r;

    let count = 0;
    const cursor = start.clone();
    while (cursor.isSameOrBefore(end, 'day')) {
      const day = cursor.format(FMT);
      if (week.length === 0 || week.includes(cursor.day())) {
        const row = map[day] || new RoomCalendarEntity();
        row.roomTypeId = param.roomTypeId;
        row.date = day;
        if (param.closed) {
          row.status = 0;
        } else {
          row.status = 1;
          if (param.price != null) row.price = param.price;
          if (param.availableStock != null) {
            row.availableStock = Math.min(Number(param.availableStock), roomType.stock);
          } else if (row.availableStock == null) {
            row.availableStock = roomType.stock;
          }
        }
        await this.roomCalendarEntity.save(row);
        count++;
      }
      cursor.add(1, 'day');
    }
    return { count };
  }

  /**
   * 区间查询（含回退默认：无记录日期 = 房型基础价/满库/房型是否启用）
   */
  async range(
    roomTypeId: number, startDate: string, endDate: string
  ): Promise<{ date: string; price: any; availableStock: number; status: number }[]> {
    const roomType = await this.roomTypeEntity.findOneBy({ id: roomTypeId });
    if (!roomType) {
      throw new CoolCommException('房型不存在');
    }
    const rows = await this.roomCalendarEntity
      .createQueryBuilder('c')
      .where('c.roomTypeId = :id', { id: roomTypeId })
      .andWhere('c.date >= :start', { start: startDate })
      .andWhere('c.date <= :end', { end: endDate })
      .orderBy('c.date', 'ASC')
      .getMany();
    const map: Record<string, RoomCalendarEntity> = {};
    for (const r of rows) map[r.date] = r;

    const out: any[] = [];
    const cursor = moment(startDate, FMT);
    const end = moment(endDate, FMT);
    const rtOn = roomType.status === 1;
    while (cursor.isSameOrBefore(end, 'day')) {
      const day = cursor.format(FMT);
      const r = map[day];
      if (r) {
        out.push({
          date: day,
          price: r.price,
          availableStock: r.availableStock,
          status: r.status === 1 && rtOn ? 1 : 0,
        });
      } else {
        out.push({
          date: day,
          price: roomType.price,
          availableStock: roomType.stock,
          status: rtOn ? 1 : 0,
        });
      }
      cursor.add(1, 'day');
    }
    return out;
  }
}
```

`controller/admin/room-calendar.ts`（替换 Task 2 版本）:
```ts
import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { RoomCalendarEntity } from '../../entity/room-calendar';
import { RoomCalendarService } from '../../service/room-calendar';

@CoolController({
  api: ['page', 'info', 'delete'],
  entity: RoomCalendarEntity,
  pageQueryOp: {
    fieldEq: ['a.roomTypeId', 'a.status'],
  },
})
export class AdminAccommodationRoomCalendarController extends BaseController {
  @Inject()
  roomCalendarService: RoomCalendarService;

  @Post('/batch', { summary: '批量设置房态（动态定价/关房）' })
  async batch(@Body() body) {
    return this.ok(await this.roomCalendarService.batch(body));
  }

  @Get('/range', { summary: '区间查询（含默认回退）' })
  async range(
    @Query('roomTypeId') roomTypeId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.ok(await this.roomCalendarService.range(Number(roomTypeId), startDate, endDate));
  }
}
```

- [ ] **Step 4: 跑测试确认绿**

Run: `npm test -- accommodation-room-calendar`
Expected: PASS（4 个用例：回退默认 / 批量覆盖+截断+关房 / weekDays 限调 / 房型不存在）

- [ ] **Step 5: Commit**

```bash
git add cool-admin-midway/src/modules/accommodation/service cool-admin-midway/src/modules/accommodation/controller/admin/room-calendar.ts cool-admin-midway/test/accommodation-room-calendar.test.ts
git commit -m "feat(accommodation): 房态日历 batch/range 服务（动态定价/关房/默认回退）"
```

---

### Task 4: accommodation C 端浏览（search/detail/calendar，匿名 HTTP）

**Files:**
- Create: `cool-admin-midway/src/modules/accommodation/service/hotel.ts`
- Create: `cool-admin-midway/src/modules/accommodation/controller/app/hotel.ts`
- Create: `cool-admin-midway/src/modules/accommodation/controller/app/room-type.ts`
- Test: `cool-admin-midway/test/accommodation-app.test.ts`

**Interfaces:**
- Consumes: `RoomCalendarService.range`（Task 3）、三实体
- Produces: `GET /app/accommodation/hotel/search`、`GET /app/accommodation/hotel/detail?id=`、`GET /app/accommodation/room-type/calendar?roomTypeId&startDate&endDate`（均匿名 IGNORE_TOKEN）

- [ ] **Step 1: 写失败测试**（mysql2 种子 + HTTP 断言）

```ts
import * as mysql from 'mysql2/promise';
import { boot, close, createHttpRequest } from './helper';

const DB = { host: '127.0.0.1', port: 3307, user: 'root', password: '123456', database: 'wudong_platform_test' };

async function seed() {
  const conn = await mysql.createConnection(DB);
  const t = '2026-09-01 00:00:00';
  // A：上架苗寨木楼（2 个启用房型，最低 380）；B：下架客栈（不应出现在搜索）
  const [h] = await conn.query(
    `INSERT INTO hotel (merchantId,name,address,longitude,latitude,styleTags,facilityTags,mainImage,intro,rating,status,createTime,updateTime) VALUES
     (1,'乌东苗寨木楼','雷山县乌东村',108.10,26.30,'["苗寨","江景"]','["WiFi","空调"]','a.jpg','吊脚楼',4.80,1,?,?),
     (1,'普通客栈','乌东村口',108.11,26.31,'["经济"]','["WiFi"]',NULL,NULL,4.00,0,?,?)`,
    [t, t, t, t]
  );
  const hotelA = (h as any).insertId;
  const [rt] = await conn.query(
    `INSERT INTO room_type (hotelId,name,bedType,maxGuests,price,stock,status,createTime,updateTime) VALUES
     (?, '木屋大床房','大床',2,380.00,3,1,?,?),
     (?, '吊脚楼双床房','双床',2,520.00,2,1,?,?),
     (?, '经济房','单床',1,120.00,5,1,?,?)`,
    [hotelA, t, t, hotelA, t, t, (h as any).insertId + 1, t, t]
  );
  const rtA = (rt as any).insertId; // 第一个房型 id
  // rtA：10-01 剩 2 间 520，10-02 满 0 间；10-03 无记录 → 回退默认
  await conn.query(
    `INSERT INTO room_calendar (roomTypeId,date,availableStock,price,status,createTime,updateTime) VALUES
     (?, '2026-10-01', 2, 520.00, 1, ?, ?),
     (?, '2026-10-02', 0, 520.00, 1, ?, ?)`,
    [rtA, t, t, rtA, t, t]
  );
  await conn.end();
  return { hotelA, hotelB: (h as any).insertId + 1, rtA };
}

describe('accommodation C 端浏览（匿名 IGNORE_TOKEN）', () => {
  let app;
  let ids;

  beforeAll(async () => {
    app = await boot();
    ids = await seed();
  });

  afterAll(async () => {
    await close(app);
  });

  it('search 只返回上架的民宿，且匿名可访问', async () => {
    const res = await createHttpRequest(app).get('/app/accommodation/hotel/search?page=1&size=10');
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1000);
    expect(res.body.data.total).toBe(1);
    expect(res.body.data.list[0].name).toBe('乌东苗寨木楼');
  });

  it('search 支持风格标签过滤与价格带过滤', async () => {
    const tagged = await createHttpRequest(app).get(
      '/app/accommodation/hotel/search?styleTags=江景'
    );
    expect(tagged.body.data.total).toBe(1);

    // 民宿最低房型价 380：≤400 命中，≥500 不命中
    const max400 = await createHttpRequest(app).get(
      '/app/accommodation/hotel/search?maxPrice=400'
    );
    expect(max400.body.data.total).toBe(1);
    expect(String(max400.body.data.list[0].minPrice)).toBe('380.00');

    const min500 = await createHttpRequest(app).get(
      '/app/accommodation/hotel/search?minPrice=500'
    );
    expect(min500.body.data.total).toBe(0);
  });

  it('detail 返回民宿信息与启用房型列表', async () => {
    const res = await createHttpRequest(app).get(
      `/app/accommodation/hotel/detail?id=${ids.hotelA}`
    );
    expect(res.body.code).toBe(1000);
    expect(res.body.data.info.name).toBe('乌东苗寨木楼');
    expect(res.body.data.roomTypes.length).toBe(2);
  });

  it('room-type calendar 匿名返回逐日房态（缺失日回退默认价/满库）', async () => {
    const res = await createHttpRequest(app).get(
      `/app/accommodation/room-type/calendar?roomTypeId=${ids.rtA}&startDate=2026-10-01&endDate=2026-10-03`
    );
    expect(res.body.code).toBe(1000);
    const days = res.body.data;
    expect(days.length).toBe(3);
    expect(days[0].date).toBe('2026-10-01');
    expect(days[2].date).toBe('2026-10-03');
    expect(String(days[2].price)).toBe('380.00'); // 回退房型基础价
    expect(days[1].availableStock).toBe(0); // 已满
  });
});
```

- [ ] **Step 2: 跑测试确认红**

Run: `npm test -- accommodation-app`
Expected: FAIL（控制器/服务不存在 → 路由 404，body.code 非 1000）

- [ ] **Step 3: 最小实现**

`service/hotel.ts`:
```ts
import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { HotelEntity } from '../entity/hotel';
import { RoomTypeEntity } from '../entity/room-type';

/**
 * C 端民宿浏览（搜索/详情）
 */
@Provide()
export class AccommodationHotelService extends BaseService {
  @InjectEntityModel(HotelEntity)
  hotelEntity: Repository<HotelEntity>;

  @InjectEntityModel(RoomTypeEntity)
  roomTypeEntity: Repository<RoomTypeEntity>;

  /**
   * 搜索：status=1 + 标签/评分/关键字，价格用"启用房型最低基础价"做 JS 端过滤（数据量小，
   * 避免 groupBy+having 的 TypeORM 歧义）；minPrice 附在每个结果上。
   */
  async search(query: {
    keyword?: string; styleTags?: string; facilityTags?: string;
    minPrice?: number; maxPrice?: number; rating?: number;
    sort?: string; page?: number; size?: number;
  }) {
    const qb = this.hotelEntity.createQueryBuilder('a').where('a.status = 1');
    if (query.keyword) {
      qb.andWhere('(a.name LIKE :kw OR a.address LIKE :kw)', { kw: `%${query.keyword}%` });
    }
    if (query.styleTags) {
      qb.andWhere('JSON_CONTAINS(a.styleTags, :tag)', { tag: JSON.stringify(query.styleTags) });
    }
    if (query.facilityTags) {
      qb.andWhere('JSON_CONTAINS(a.facilityTags, :fac)', { fac: JSON.stringify(query.facilityTags) });
    }
    if (query.rating) {
      qb.andWhere('a.rating >= :rating', { rating: query.rating });
    }
    if (query.sort === 'rating') {
      qb.orderBy('a.rating', 'DESC');
    } else if (query.sort !== 'price' && query.sort !== 'priceDesc') {
      qb.orderBy('a.id', 'DESC');
    }

    const all = await qb.getMany();
    // 房型最低价 map
    const minMap: Record<number, any> = {};
    if (all.length) {
      const raws: any = await this.roomTypeEntity
        .createQueryBuilder('rt')
        .select('rt.hotelId', 'hotelId')
        .addSelect('MIN(rt.price)', 'minPrice')
        .where('rt.status = 1')
        .andWhere('rt.hotelId IN (:...ids)', { ids: all.map((h: any) => h.id) })
        .groupBy('rt.hotelId')
        .getRawMany();
      for (const r of raws) minMap[Number(r.hotelId)] = r.minPrice;
    }

    const hasPriceFilter = query.minPrice != null || query.maxPrice != null;
    let rows: any[] = all.map((h: any) => ({ ...h, minPrice: minMap[h.id] ?? null }));
    if (hasPriceFilter) {
      rows = rows.filter((h) => {
        if (h.minPrice == null) return false;
        const p = Number(h.minPrice);
        if (query.minPrice != null && p < Number(query.minPrice)) return false;
        if (query.maxPrice != null && p > Number(query.maxPrice)) return false;
        return true;
      });
    }
    if (query.sort === 'price') {
      rows.sort((a, b) => (Number(a.minPrice) || 0) - (Number(b.minPrice) || 0));
    } else if (query.sort === 'priceDesc') {
      rows.sort((a, b) => (Number(b.minPrice) || 0) - (Number(a.minPrice) || 0));
    }

    const total = rows.length;
    const pageNo = Math.max(Number(query.page) || 1, 1);
    const pageSize = Math.max(Number(query.size) || 10, 1);
    return { list: rows.slice((pageNo - 1) * pageSize, pageNo * pageSize), total };
  }

  /**
   * 详情：民宿 + 启用房型（按价升序）
   */
  async detail(id: number) {
    const info = await this.hotelEntity.findOneBy({ id });
    if (!info || info.status !== 1) {
      throw new CoolCommException('民宿不存在或已下架');
    }
    const roomTypes = await this.roomTypeEntity.find({
      where: { hotelId: id, status: 1 },
      order: { price: 'ASC' },
    });
    return { info, roomTypes };
  }
}
```

`controller/app/hotel.ts`:
```ts
import { CoolController, BaseController, CoolUrlTag, TagTypes, CoolTag } from '@cool-midway/core';
import { Get, Inject, Query } from '@midwayjs/core';
import { AccommodationHotelService } from '../../service/hotel';

/**
 * C 端民宿浏览（匿名）
 */
@CoolUrlTag()
@CoolController()
export class AppAccommodationHotelController extends BaseController {
  @Inject()
  hotelService: AccommodationHotelService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/search', { summary: '民宿搜索' })
  async search(@Query() query) {
    return this.ok(await this.hotelService.search(query));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/detail', { summary: '民宿详情（含房型）' })
  async detail(@Query('id') id: number) {
    return this.ok(await this.hotelService.detail(Number(id)));
  }
}
```

`controller/app/room-type.ts`:
```ts
import { CoolController, BaseController, CoolUrlTag, TagTypes, CoolTag } from '@cool-midway/core';
import { Get, Inject, Query } from '@midwayjs/core';
import { RoomCalendarService } from '../../service/room-calendar';

/**
 * C 端房态日历（匿名，缺省回退见 service）
 */
@CoolUrlTag()
@CoolController()
export class AppAccommodationRoomTypeController extends BaseController {
  @Inject()
  roomCalendarService: RoomCalendarService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/calendar', { summary: '房态日历' })
  async calendar(
    @Query('roomTypeId') roomTypeId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.ok(
      await this.roomCalendarService.range(Number(roomTypeId), startDate, endDate)
    );
  }
}
```

- [ ] **Step 4: 跑测试确认绿**

Run: `npm test -- accommodation-app`
Expected: PASS（4 个用例）。若 decimal 返回 `'380.00'` 之外格式，用 `String(value)` 后比对 `'380.00'`（断言已统一 String）

- [ ] **Step 5: Commit**

```bash
git add cool-admin-midway/src/modules/accommodation/service/hotel.ts cool-admin-midway/src/modules/accommodation/controller/app cool-admin-midway/test/accommodation-app.test.ts
git commit -m "feat(accommodation): C端民宿搜索/详情与房态日历匿名浏览接口"
```

---

### Task 5: operate 实体（banner/announcement/finance_record）+ 模块配置

**Files:**
- Create: `cool-admin-midway/src/modules/operate/config.ts`
- Create: `cool-admin-midway/src/modules/operate/entity/banner.ts`
- Create: `cool-admin-midway/src/modules/operate/entity/announcement.ts`
- Create: `cool-admin-midway/src/modules/operate/entity/finance-record.ts`
- Test: `cool-admin-midway/test/operate-entity.test.ts`

**Interfaces:**
- Produces: `BannerEntity`/`AnnouncementEntity`/`FinanceRecordEntity`（表名 verbatim）。后续 operate Task 依赖

- [ ] **Step 1: 写失败测试**

```ts
import * as mysql from 'mysql2/promise';
import { boot, close } from './helper';

describe('operate 实体自动建表', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it('banner / announcement / finance_record 三表存在且关键列 camelCase', async () => {
    const conn = await mysql.createConnection({
      host: '127.0.0.1', port: 3307, user: 'root',
      password: '123456', database: 'wudong_platform_test',
    });
    const [tables]: any = await conn.query(
      `SELECT COUNT(*) c FROM information_schema.tables
       WHERE table_schema='wudong_platform_test'
         AND table_name IN ('banner','announcement','finance_record')`
    );
    expect(Number(tables[0].c)).toBe(3);
    const [cols]: any = await conn.query(
      `SELECT table_name, column_name FROM information_schema.columns
       WHERE table_schema='wudong_platform_test'
         AND ((table_name='banner' AND column_name IN ('title','image','linkType','position','sort','startTime','status'))
           OR (table_name='announcement' AND column_name IN ('title','content','isTop','status','createdBy'))
           OR (table_name='finance_record' AND column_name IN ('orderId','merchantId','commissionRate','settlementStatus')))`
    );
    expect(cols.length).toBe(16);
    await conn.end();
  });
});
```

- [ ] **Step 2: 跑测试确认红**

Run: `npm test -- operate-entity`
Expected: FAIL（三表不存在）

- [ ] **Step 3: 最小实现**

`config.ts`:
```ts
import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    name: '平台运营位',
    description: 'operate：banner/announcement 运营内容管理 + finance_record 预留（模块6 子集）',
    middlewares: [],
    globalMiddlewares: [],
    order: 0,
  } as ModuleConfig;
};
```

`entity/banner.ts`:
```ts
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity, transformerTime } from '../../base/entity/base';

/** 首页轮播/横幅 */
@Entity('banner')
export class BannerEntity extends BaseEntity {
  @Column({ comment: '标题', length: 100 })
  title: string;

  @Column({ comment: '图片URL', length: 500 })
  image: string;

  @Column({ comment: '跳转类型', length: 20, default: 'none' })
  linkType: string;

  @Column({ comment: '跳转地址', length: 500, nullable: true })
  linkValue: string;

  @Index()
  @Column({ comment: '位置：home/product/food/accommodation等', length: 20 })
  position: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '生效开始时间', type: 'varchar', nullable: true, transformer: transformerTime })
  startTime: Date;

  @Column({ comment: '生效结束时间', type: 'varchar', nullable: true, transformer: transformerTime })
  endTime: Date;

  @Column({ comment: '状态：1启用 0禁用', dict: ['禁用', '启用'], default: 1 })
  status: number;
}
```

`entity/announcement.ts`:
```ts
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity, transformerTime } from '../../base/entity/base';

/** 平台公告 */
@Entity('announcement')
export class AnnouncementEntity extends BaseEntity {
  @Column({ comment: '标题', length: 200 })
  title: string;

  @Column({ comment: '内容', type: 'text' })
  content: string;

  @Column({ comment: '类型：1系统 2活动', dict: ['系统公告', '活动公告'], default: 1 })
  type: number;

  @Column({ comment: '生效开始时间', type: 'varchar', nullable: true, transformer: transformerTime })
  startTime: Date;

  @Column({ comment: '生效结束时间', type: 'varchar', nullable: true, transformer: transformerTime })
  endTime: Date;

  @Column({ comment: '是否置顶', dict: ['否', '是'], default: 0 })
  isTop: number;

  @Column({ comment: '状态：1发布 0草稿', dict: ['草稿', '发布'], default: 1 })
  status: number;

  @Column({ comment: '创建人ID', nullable: true })
  createdBy: number;
}
```

`entity/finance-record.ts`:
```ts
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity, transformerTime } from '../../base/entity/base';

/** 财务记录（本期仅建表+只读，结算逻辑 Phase4） */
@Entity('finance_record')
export class FinanceRecordEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单ID' })
  orderId: number;

  @Index()
  @Column({ comment: '商家ID' })
  merchantId: number;

  @Column({ comment: '订单金额', type: 'decimal', precision: 10, scale: 2 })
  orderAmount: number;

  @Column({ comment: '抽佣比例%', type: 'decimal', precision: 5, scale: 2 })
  commissionRate: number;

  @Column({ comment: '平台抽佣', type: 'decimal', precision: 10, scale: 2 })
  commissionAmount: number;

  @Column({ comment: '商家收入', type: 'decimal', precision: 10, scale: 2 })
  merchantIncome: number;

  @Column({ comment: '结算状态：1待结算 2已结算', dict: ['待结算', '已结算'], default: 1 })
  settlementStatus: number;

  @Column({ comment: '结算时间', type: 'varchar', nullable: true, transformer: transformerTime })
  settlementTime: Date;

  @Column({ comment: '结算批次号', length: 50, nullable: true })
  settlementBatch: string;
}
```

- [ ] **Step 4: 跑测试确认绿**

Run: `npm test -- operate-entity`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add cool-admin-midway/src/modules/operate cool-admin-midway/test/operate-entity.test.ts
git commit -m "feat(operate): banner/announcement/finance_record 实体 + 模块配置（自动建表）"
```

---

### Task 6: operate 管理端（CRUD + finance 只读）+ 下发服务

**Files:**
- Create: `cool-admin-midway/src/modules/operate/service/banner.ts`
- Create: `cool-admin-midway/src/modules/operate/service/announcement.ts`
- Create: `cool-admin-midway/src/modules/operate/controller/admin/banner.ts`
- Create: `cool-admin-midway/src/modules/operate/controller/admin/announcement.ts`
- Create: `cool-admin-midway/src/modules/operate/controller/admin/finance-record.ts`
- Test: `cool-admin-midway/test/operate-admin.test.ts`

**Interfaces:**
- Consumes: operate 三实体（Task 5）
- Produces: `BannerService.bannerList(position?)`、`AnnouncementService.announcementList(type?)`；admin 路由 `/admin/operate/banner|announcement|finance-record`

- [ ] **Step 1: 写失败测试**

```ts
import { boot, close, createHttpRequest } from './helper';

describe('operate 管理端', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it.each([
    '/admin/operate/banner/page?page=1&size=10',
    '/admin/operate/announcement/page?page=1&size=10',
    '/admin/operate/finance-record/page?page=1&size=10',
    '/admin/operate/finance-record/info?id=1',
  ])('无 admin token 访问 %s 返回 401（路由已注册且受 admin 鉴权）', async (url) => {
    const res = await createHttpRequest(app).get(url);
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 2: 跑测试确认红**

Run: `npm test -- operate-admin`
Expected: FAIL（404 而非 401）

- [ ] **Step 3: 最小实现**

`service/banner.ts`:
```ts
import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { BannerEntity } from '../entity/banner';

const NOW = () => moment().format('YYYY-MM-DD HH:mm:ss');

/**
 * 轮播图下发
 */
@Provide()
export class BannerService extends BaseService {
  @InjectEntityModel(BannerEntity)
  bannerEntity: Repository<BannerEntity>;

  /** 下发：启用 + 生效时间窗内，按 sort asc */
  async bannerList(position?: string) {
    const qb = this.bannerEntity.createQueryBuilder('a').where('a.status = 1');
    if (position) {
      qb.andWhere('a.position = :position', { position });
    }
    const rows = await qb.orderBy('a.sort', 'ASC').addOrderBy('a.id', 'ASC').getMany();
    const now = NOW();
    return rows.filter(
      (r) => (!r.startTime || String(r.startTime) <= now) && (!r.endTime || String(r.endTime) >= now)
    );
  }
}
```

`service/announcement.ts`:
```ts
import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { AnnouncementEntity } from '../entity/announcement';

const NOW = () => moment().format('YYYY-MM-DD HH:mm:ss');

/**
 * 公告下发
 */
@Provide()
export class AnnouncementService extends BaseService {
  @InjectEntityModel(AnnouncementEntity)
  announcementEntity: Repository<AnnouncementEntity>;

  /** 下发：发布态 + 时间窗内，置顶优先再创建时间倒序 */
  async announcementList(type?: number) {
    const qb = this.announcementEntity.createQueryBuilder('a').where('a.status = 1');
    if (type != null) {
      qb.andWhere('a.type = :type', { type });
    }
    const rows = await qb
      .orderBy('a.isTop', 'DESC')
      .addOrderBy('a.createTime', 'DESC')
      .getMany();
    const now = NOW();
    return rows.filter(
      (r) => (!r.startTime || String(r.startTime) <= now) && (!r.endTime || String(r.endTime) >= now)
    );
  }
}
```

`controller/admin/banner.ts`:
```ts
import { CoolController, BaseController } from '@cool-midway/core';
import { BannerEntity } from '../../entity/banner';

@CoolController({
  api: ['add', 'delete', 'update', 'page', 'list', 'info'],
  entity: BannerEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.position'],
    keyWordLikeFields: ['a.title'],
  },
})
export class AdminOperateBannerController extends BaseController {}
```

`controller/admin/announcement.ts`:
```ts
import { CoolController, BaseController } from '@cool-midway/core';
import { AnnouncementEntity } from '../../entity/announcement';

@CoolController({
  api: ['add', 'delete', 'update', 'page', 'list', 'info'],
  entity: AnnouncementEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.type'],
    keyWordLikeFields: ['a.title'],
  },
})
export class AdminOperateAnnouncementController extends BaseController {}
```

`controller/admin/finance-record.ts`:
```ts
import { CoolController, BaseController } from '@cool-midway/core';
import { FinanceRecordEntity } from '../../entity/finance-record';

/** 财务记录只读（api 不含 add/update/delete） */
@CoolController({
  api: ['page', 'info', 'list'],
  entity: FinanceRecordEntity,
  pageQueryOp: {
    fieldEq: ['a.settlementStatus', 'a.merchantId'],
  },
})
export class AdminOperateFinanceRecordController extends BaseController {}
```

- [ ] **Step 4: 跑测试确认绿**

Run: `npm test -- operate-admin`
Expected: PASS（4 条均 401）

- [ ] **Step 5: Commit**

```bash
git add cool-admin-midway/src/modules/operate cool-admin-midway/test/operate-admin.test.ts
git commit -m "feat(operate): 管理端 banner/announcement CRUD + finance_record 只读 + 下发服务"
```

---

### Task 7: operate C 端匿名下发 HTTP

**Files:**
- Create: `cool-admin-midway/src/modules/operate/controller/app/operate.ts`
- Test: `cool-admin-midway/test/operate-app.test.ts`

**Interfaces:**
- Consumes: `BannerService.bannerList`、`AnnouncementService.announcementList`（Task 6）
- Produces: `GET /app/operate/banner?position=`、`GET /app/operate/announcement?type=`（匿名 IGNORE_TOKEN）

- [ ] **Step 1: 写失败测试**（mysql2 种子 + HTTP）

```ts
import * as mysql from 'mysql2/promise';
import { boot, close, createHttpRequest } from './helper';

async function seed() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1', port: 3307, user: 'root', password: '123456',
    database: 'wudong_platform_test',
  });
  const t = '2026-09-01 00:00:00';
  const f = '2099-12-31 23:59:59';
  // home 位：有效启用 x2（sort 1、2）+ 禁用 x1；startTime/endTime/createTime/updateTime 用 ? 占位
  await conn.query(
    `INSERT INTO banner (title,image,linkType,linkValue,position,sort,startTime,endTime,status,createTime,updateTime) VALUES
     ('苗寨金秋','b1.jpg','page','/x','home',2,?,?,1,?,?),
     ('非遗节','b2.jpg','none',NULL,'home',1,?,?,1,?,?),
     ('禁用条','b3.jpg','none',NULL,'home',3,?,?,0,?,?)`,
    [t, f, t, t, t, f, t, t, t, f, t, t]
  );
  // 公告：置顶发布 x1、草稿 x1、活动发布 x1
  await conn.query(
    `INSERT INTO announcement (title,content,type,startTime,endTime,isTop,status,createdBy,createTime,updateTime) VALUES
     ('系统维护通知','将于夜间维护',1,?,?,1,1,1,?,?),
     ('草稿公告','未发布',1,NULL,NULL,0,0,1,?,?),
     ('活动招募','集市活动',2,?,?,0,1,1,?,?)`,
    [t, f, t, t, t, t, t, f, t, t]
  );
  await conn.end();
}

describe('operate C 端匿名下发', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
    await seed();
  });

  afterAll(async () => {
    await close(app);
  });

  it('banner 匿名下发：home 启用且在时间窗内，按 sort 升序', async () => {
    const res = await createHttpRequest(app).get('/app/operate/banner?position=home');
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1000);
    const list = res.body.data;
    expect(list.length).toBe(2);
    expect(list[0].title).toBe('非遗节'); // sort=1
    expect(list[1].title).toBe('苗寨金秋'); // sort=2
  });

  it('announcement 匿名下发：发布态+时间窗内，置顶优先', async () => {
    const res = await createHttpRequest(app).get('/app/operate/announcement');
    expect(res.body.code).toBe(1000);
    const list = res.body.data;
    expect(list.length).toBe(2); // 草稿被排除
    expect(list[0].title).toBe('系统维护通知'); // isTop=1
  });

  it('announcement 支持 type 过滤', async () => {
    const res = await createHttpRequest(app).get('/app/operate/announcement?type=2');
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('活动招募');
  });
});
```

- [ ] **Step 2: 跑测试确认红**

Run: `npm test -- operate-app`
Expected: FAIL（路由不存在）

- [ ] **Step 3: 最小实现**

`controller/app/operate.ts`:
```ts
import { CoolController, BaseController, CoolUrlTag, TagTypes, CoolTag } from '@cool-midway/core';
import { Get, Inject, Query } from '@midwayjs/core';
import { BannerService } from '../../service/banner';
import { AnnouncementService } from '../../service/announcement';

/**
 * C 端运营位下发（匿名）
 */
@CoolUrlTag()
@CoolController()
export class AppOperateController extends BaseController {
  @Inject()
  bannerService: BannerService;

  @Inject()
  announcementService: AnnouncementService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/banner', { summary: '轮播图下发' })
  async banner(@Query('position') position?: string) {
    return this.ok(await this.bannerService.bannerList(position));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/announcement', { summary: '公告下发' })
  async announcement(@Query('type') type?: number) {
    return this.ok(
      await this.announcementService.announcementList(type != null ? Number(type) : undefined)
    );
  }
}
```

- [ ] **Step 4: 跑测试确认绿**

Run: `npm test -- operate-app`
Expected: PASS（3 个用例）

- [ ] **Step 5: Commit**

```bash
git add cool-admin-midway/src/modules/operate/controller/app cool-admin-midway/test/operate-app.test.ts
git commit -m "feat(operate): C端匿名下发 banner/announcement（生效时间窗+置顶+sort）"
```

---

### Task 8: 全量回归 + lint + 手动验收

**Files:**
- 无新增（收尾验证）

- [ ] **Step 1: 全量测试**（先停 dev 释放 8001）

Run: `npm test`
Expected: 全部 suite PASS（smoke/app-middleware/member-* 既有 + accommodation-* / operate-* 新增）

- [ ] **Step 2: lint**

Run: `npm run lint`
Expected: 0 error（若既有文件有告警不修，仅保证新增文件无 error；不改 base/user/member）

- [ ] **Step 3: 手动验收（重起 dev 后 curl）**

```bash
# 起 dev（后台 npm run dev，等 8001 就绪）
curl -s -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:8001/admin/operate/banner/page?page=1&size=10"    # 401
curl -s "http://127.0.0.1:8001/app/operate/banner?position=home"         # code 1000 data[]
curl -s "http://127.0.0.1:8001/app/accommodation/hotel/search?page=1&size=10"  # code 1000
curl -s "http://127.0.0.1:8001/swagger-ui/index.html" -o /dev/null -w "%{http_code}\n"  # 200
```

- [ ] **Step 4: Commit（若有 lint 修正）**

```bash
git add -A
git commit -m "test(accommodation/operate): 全量回归通过并修正 lint"
```

---

# 测试运行与手动验收约定（执行者必读）

- 跑任意 jest 前**必须停止后端 dev(8001)**：`npm run dev` 的 mwtsc `--keepalive` 子进程会残留占 8001（`TaskStop` 只杀 npm 外壳），用 `netstat -ano | grep :8001` 找 PID 后 `taskkill //PID <pid> //F` 释放
- 数据库：docker 容器 `wudong-mysql`（mysql:8.0）宿主 **3307**，root/123456；dev 库 `cool`，测试库 `wudong_platform_test`（globalSetup 每次重建）；`config.local.ts` 指向 3307（本机专属改动，勿提交）
- TypeORM decimal 列经 mysql2 返回字符串（如 `'380.00'`），断言一律 `String(value)` 后与 `'380.00'` 比较
- HTTP body 约定：成功 `{code:1000,data}`；匿名浏览失败/鉴权按 Global Constraints

# 非目标（本期明确不做，勿越界）

- 预订下单/支付/退款/入住码/取消政策（base order/pay 合入后按 spec §8 接入）
- merchant 身份/数据权限、member 收藏 hotel、民宿评价（base/member 扩展点，spec D6/D7）
- finance_record 写入与结算任务、数据看板、前端页面（cool-admin-vue）——前端另排
- 改 base/user/member 模块、新增 npm 依赖
