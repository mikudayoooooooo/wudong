# base T1：统一订单（order）+ 统一支付（pay）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 落地平台公共底座 B1 交易线——`order` 模块（统一订单主表 + 商品/预订/门票三明细 + 状态机）与 `pay` 模块（支付流水 + 模拟支付），供衣/食/住/行四个业务模块下单复用。

**Architecture:** 两个 cool-admin 模块（`entity` + `service` + `controller/admin` + `controller/app` + `config.ts`）。C 端接口挂 `/app/order/*`、`/app/pay/*` 由脚手架全局 `UserMiddleware` 做 JWT 鉴权；管理端挂 `/admin/order`、`/admin/pay/record`。`pay` 单向依赖 `order`（`markPaid`），`order` 不依赖任何业务模块（金额由调用方快照传入、服务端只做汇总计算）。

**Tech Stack:** Midway.js 3.x + TypeORM 0.3.x（事务用 DataSource.transaction）+ MySQL 8 + Jest/ts-jest（复用 member 已建测试基建）

**Spec:** `docs/superpowers/specs/2026-09-09-platform-base-design.md` §5.3/§5.4/§8（D1-D6 已锁定）

## Global Constraints

- **工作目录**：git 命令在 `code/`（内层 git 仓库）执行；npm/jest 命令在 `code/cool-admin-midway/` 执行。
- **分支**：从 `feature/member` 新建 `feature/base-order`（T2/T3 并行轨道各自从 `feature/member` 切，模块目录互不交叉）。
- **本地环境前提**：MySQL 8 运行于 `127.0.0.1:3307`（docker `wudong-mysql`，root/123456）；测试库 `wudong_platform_test` 由 global-setup 每次重建。
- **表名**（schema.sql verbatim）：`order`、`order_product`、`order_reservation`、`order_ticket`、`payment_record`；列名 camelCase（既定偏差）；无物理外键；`synchronize: true` 自动建表。
- **枚举口径**：orderType 1商品 2餐位 3住宿 4门票 5路线；module ∈ `product|food|accommodation|travel`；order.status 1待支付 2已支付 3已完成 4已取消 5已退款；payStatus 1待支付 2已支付 3已退款；渠道 `wechat|alipay`。
- **金额规则**：明细单价/数量由调用方（业务模块或通用入口）快照传入，`totalAmount=Σ(price×quantity)` 由服务端计算，`payAmount=totalAmount`（本期无优惠）；decimal(10,2) 入库，MySQL 读回为字符串，断言用 `Number()`。
- **单号规则**：orderNo = `YYYYMMDDHHmmssSSS` + 4 位随机（21 字符）；paymentNo = `PAY` + 同规则（24 字符）。
- **响应断言常量**：成功 `body.code===1000`；业务异常 `1001`；未登录 `/app/*` → HTTP 200 + `{code:1001, message:'登录失效~'}`；`/admin/*` 未登录 → HTTP 401。
- **方法命名**：业务分页方法一律命名 `pageList`（规避 BaseService.page 成员冲突，member 48aa48e 教训）。
- **测试手机号段**：order 测试 `13500135xxx`、pay 测试 `13400134xxx`（与 member 测试号段互不重叠）。
- **零新增依赖**：typeorm/moment/lodash 均已有。
- **Git**：`<type>(<scope>): <subject>`；每任务只 add 本任务列出文件；不提交本地环境改动（config.local.ts 等）。
- **测试执行**：`npm run test`（NODE_ENV=unittest，maxWorkers 1）。

---

### Task 1: 分支 + order/pay 模块骨架 + 五张实体（自动建表）

**Files:**
- Create: `code/cool-admin-midway/src/modules/order/config.ts`
- Create: `code/cool-admin-midway/src/modules/order/entity/order.ts`
- Create: `code/cool-admin-midway/src/modules/order/entity/order-product.ts`
- Create: `code/cool-admin-midway/src/modules/order/entity/order-reservation.ts`
- Create: `code/cool-admin-midway/src/modules/order/entity/order-ticket.ts`
- Create: `code/cool-admin-midway/src/modules/pay/config.ts`
- Create: `code/cool-admin-midway/src/modules/pay/entity/record.ts`
- Test: `code/cool-admin-midway/test/base-order-entity.test.ts`

**Interfaces:**
- Consumes: `BaseEntity`/`transformerTime`（base 模块）。
- Produces（后续任务依赖，导出名固定）: `OrderEntity`、`OrderProductEntity`、`OrderReservationEntity`、`OrderTicketEntity`、`PaymentRecordEntity`。

- [ ] **Step 1: 创建分支**

```bash
cd /c/Users/cja/wudong/code
git checkout -b feature/base-order
```

- [ ] **Step 2: 写失败测试**（五张表存在）

创建 `code/cool-admin-midway/test/base-order-entity.test.ts`：

```ts
import * as mysql from 'mysql2/promise';
import { boot, close } from './helper';

const TABLES = [
  'order',
  'order_product',
  'order_reservation',
  'order_ticket',
  'payment_record',
];

describe('order/pay 实体自动建表', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it('五张表存在', async () => {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3307,
      user: 'root',
      password: '123456',
      database: 'wudong_platform_test',
    });
    const [rows]: any = await conn.query(
      `SELECT COUNT(*) AS c FROM information_schema.tables
       WHERE table_schema = 'wudong_platform_test'
         AND table_name IN (?)`,
      [TABLES]
    );
    await conn.end();
    expect(Number(rows[0].c)).toBe(5);
  });
});
```

- [ ] **Step 3: 运行确认失败**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test -- base-order-entity
```
预期：`FAIL`，`Received 0`。

- [ ] **Step 4: 创建模块配置与实体**

`src/modules/order/config.ts`：

```ts
import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块配置
 */
export default () => {
  return {
    name: '统一订单模块',
    description: 'order：全平台统一订单（商品/餐位/住宿/门票/路线）',
    middlewares: [],
    globalMiddlewares: [],
    order: 0,
  } as ModuleConfig;
};
```

`src/modules/order/entity/order.ts`：

```ts
import { BaseEntity, transformerTime } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 统一订单主表
 */
@Entity('order')
export class OrderEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '订单号', length: 32 })
  orderNo: string;

  @Column({ comment: '用户ID' })
  userId: number;

  @Column({
    comment: '订单类型 1商品 2餐位 3住宿 4门票 5路线',
    dict: ['商品', '餐位', '住宿', '门票', '路线'],
    default: 1,
  })
  orderType: number;

  @Column({ comment: '所属模块 product/food/accommodation/travel', length: 20 })
  module: string;

  @Column({
    comment: '订单总额',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  @Column({
    comment: '实付金额',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  payAmount: number;

  @Column({
    comment: '优惠金额',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  discountAmount: number;

  @Column({
    comment: '状态 1待支付 2已支付 3已完成 4已取消 5已退款',
    dict: ['待支付', '已支付', '已完成', '已取消', '已退款'],
    default: 1,
  })
  status: number;

  @Column({
    comment: '支付时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  payTime: Date;

  @Column({
    comment: '完成时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  completeTime: Date;

  @Column({
    comment: '取消时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  cancelTime: Date;

  @Column({ comment: '订单备注', length: 500, nullable: true })
  remark: string;
}
```

`src/modules/order/entity/order-product.ts`：

```ts
import { BaseEntity, transformerTime } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 订单明细-商品（衣）
 */
@Entity('order_product')
export class OrderProductEntity extends BaseEntity {
  @Column({ comment: '订单ID' })
  orderId: number;

  @Column({ comment: '商品ID' })
  productId: number;

  @Column({ comment: 'SKU ID' })
  skuId: number;

  @Column({ comment: '商品名称', length: 200 })
  productName: string;

  @Column({ comment: 'SKU名称', length: 100, nullable: true })
  skuName: string;

  @Column({ comment: '商品图片', length: 500, nullable: true })
  productImage: string;

  @Column({
    comment: '单价',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({ comment: '数量', default: 1 })
  quantity: number;

  @Column({
    comment: '小计',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  @Column({ comment: '收货地址ID', nullable: true })
  addressId: number;

  @Column({ comment: '快递公司', length: 50, nullable: true })
  expressCompany: string;

  @Column({ comment: '快递单号', length: 50, nullable: true })
  expressNo: string;

  @Column({
    comment: '发货时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  shipTime: Date;

  @Column({
    comment: '收货时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  receiveTime: Date;
}
```

`src/modules/order/entity/order-reservation.ts`：

```ts
import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 订单明细-预订（食餐位/住住宿）
 */
@Entity('order_reservation')
export class OrderReservationEntity extends BaseEntity {
  @Column({ comment: '订单ID' })
  orderId: number;

  @Column({ comment: '预订类型 1餐位 2住宿', dict: ['餐位', '住宿'], default: 1 })
  reservationType: number;

  @Column({ comment: '目标ID（餐厅ID/民宿ID）' })
  targetId: number;

  @Column({ comment: '目标名称', length: 200 })
  targetName: string;

  @Column({ comment: '入住/就餐日期', length: 20 })
  checkInDate: string;

  @Column({ comment: '离店日期（住宿用）', length: 20, nullable: true })
  checkOutDate: string;

  @Column({ comment: '入住人/就餐人姓名', length: 50 })
  guestName: string;

  @Column({ comment: '联系电话', length: 11 })
  guestPhone: string;

  @Column({ comment: '人数', default: 1 })
  guestCount: number;

  @Column({ comment: '身份证号（住宿必填）', length: 18, nullable: true })
  idCard: string;

  @Column({ comment: '时段（餐位用）', length: 50, nullable: true })
  timeSlot: string;

  @Column({ comment: '房型ID（住宿用）', nullable: true })
  roomTypeId: number;

  @Column({ comment: '特殊要求', length: 500, nullable: true })
  specialRequest: string;

  @Column({ comment: '入住码/核销码', length: 20, nullable: true })
  checkInCode: string;
}
```

`src/modules/order/entity/order-ticket.ts`：

```ts
import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 订单明细-票（行 门票/路线套餐）
 */
@Entity('order_ticket')
export class OrderTicketEntity extends BaseEntity {
  @Column({ comment: '订单ID' })
  orderId: number;

  @Column({ comment: '票类型 1门票 2路线套餐', dict: ['门票', '路线套餐'], default: 1 })
  ticketType: number;

  @Column({ comment: '目标ID（景区ID/路线ID）' })
  targetId: number;

  @Column({ comment: '目标名称', length: 200 })
  targetName: string;

  @Column({ comment: '票种名称', length: 100 })
  ticketName: string;

  @Column({ comment: '使用日期', length: 20 })
  useDate: string;

  @Column({ comment: '数量', default: 1 })
  quantity: number;

  @Column({
    comment: '单价',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({
    comment: '总价',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  @Column({ comment: '游客信息（JSON数组）', type: 'json', nullable: true })
  visitorInfo: any;
}
```

`src/modules/pay/config.ts`：

```ts
import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块配置
 */
export default () => {
  return {
    name: '统一支付模块',
    description: 'pay：全平台统一支付流水与模拟支付',
    middlewares: [],
    globalMiddlewares: [],
    order: 0,
  } as ModuleConfig;
};
```

`src/modules/pay/entity/record.ts`：

```ts
import { BaseEntity, transformerTime } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 支付记录
 */
@Entity('payment_record')
export class PaymentRecordEntity extends BaseEntity {
  @Column({ comment: '订单ID' })
  orderId: number;

  @Index({ unique: true })
  @Column({ comment: '支付流水号', length: 32 })
  paymentNo: string;

  @Column({ comment: '支付渠道 wechat/alipay', length: 20 })
  payChannel: string;

  @Column({
    comment: '支付金额',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  payAmount: number;

  @Column({
    comment: '支付状态 1待支付 2已支付 3已退款',
    dict: ['待支付', '已支付', '已退款'],
    default: 1,
  })
  payStatus: number;

  @Column({ comment: '第三方交易号', length: 64, nullable: true })
  transactionId: string;

  @Column({
    comment: '支付时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  payTime: Date;

  @Column({
    comment: '退款时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  refundTime: Date;

  @Column({
    comment: '退款金额',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  refundAmount: number;

  @Column({ comment: '支付回调数据', type: 'json', nullable: true })
  callbackData: any;
}
```

- [ ] **Step 5: 运行测试确认通过**

```bash
npm run test -- base-order-entity
```
预期：`PASS`。

- [ ] **Step 6: 提交**

```bash
cd /c/Users/cja/wudong/code
git add cool-admin-midway/src/modules/order cool-admin-midway/src/modules/pay cool-admin-midway/test/base-order-entity.test.ts
git commit -m "feat(base): order/pay 模块骨架与五张订单支付实体（自动建表）"
```

---

### Task 2: 下单链路（OrderService.create + /app/order/create）

**Files:**
- Create: `code/cool-admin-midway/src/modules/order/service/order.ts`
- Create: `code/cool-admin-midway/src/modules/order/controller/app/order.ts`
- Test: `code/cool-admin-midway/test/base-order-create.test.ts`

**Interfaces:**
- Consumes: Task 1 五实体、`BaseEntity` 事务由 `DataSource.transaction` 提供。
- Produces（Task 3/5 依赖，签名固定）:
  - `OrderService.create(userId, { module, orderType, remark?, items }): Promise<{ orderNo, payAmount }>` —— 校验模块/类型/明细，服务端汇总金额，事务写主单+明细；非法 module/类型不匹配/空明细/价格数量非法抛 `CoolCommException`
  - C 端接口（需登录）：`POST /app/order/create`

- [ ] **Step 1: 写失败测试**

创建 `code/cool-admin-midway/test/base-order-create.test.ts`：

```ts
import { auth, boot, close, createHttpRequest, registerAndLogin } from './helper';

const phoneA = '13500135001';

describe('order 下单链路', () => {
  let app;
  let tokenA: string;

  beforeAll(async () => {
    app = await boot();
    tokenA = await registerAndLogin(app, phoneA);
  });

  afterAll(async () => {
    await close(app);
  });

  it('未登录创建订单被拦截（200 + 1001 登录失效）', async () => {
    const res = await createHttpRequest(app).post('/app/order/create').send({});
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('创建商品订单，服务端计算总额', async () => {
    const res = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(tokenA))
      .send({
        module: 'product',
        orderType: 1,
        remark: '尽快发货',
        items: [
          {
            productId: 1,
            skuId: 11,
            productName: '银手镯',
            skuName: '素圈',
            productImage: 'http://img/1.png',
            price: 129.9,
            quantity: 2,
            addressId: 1,
          },
        ],
      });
    expect(res.body.code).toBe(1000);
    expect(res.body.data.orderNo).toBeTruthy();
    expect(Number(res.body.data.payAmount)).toBeCloseTo(259.8);
  });

  it('创建门票订单（travel 模块 orderType=4）', async () => {
    const res = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(tokenA))
      .send({
        module: 'travel',
        orderType: 4,
        items: [
          {
            targetId: 1,
            targetName: '苗寨景区',
            ticketName: '成人票',
            useDate: '2026-10-01',
            price: 80,
            quantity: 3,
            visitorInfo: [{ name: '张三', idCard: '522301199001010011' }],
          },
        ],
      });
    expect(res.body.code).toBe(1000);
    expect(Number(res.body.data.payAmount)).toBe(240);
  });

  it('模块与订单类型不匹配被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(tokenA))
      .send({ module: 'travel', orderType: 1, items: [{ price: 1, quantity: 1 }] });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('订单类型与模块不匹配');
  });

  it('非法模块被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(tokenA))
      .send({ module: 'hotel', orderType: 3, items: [{ price: 1, quantity: 1 }] });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('订单模块不正确');
  });

  it('空明细被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(tokenA))
      .send({ module: 'product', orderType: 1, items: [] });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('订单明细不能为空');
  });

  it('明细价格或数量非法被拒绝', async () => {
    for (const bad of [
      { productId: 1, skuId: 1, productName: 'x', price: 0, quantity: 1 },
      { productId: 1, skuId: 1, productName: 'x', price: 10, quantity: 0 },
    ]) {
      const res = await createHttpRequest(app)
        .post('/app/order/create')
        .set(auth(tokenA))
        .send({ module: 'product', orderType: 1, items: [bad] });
      expect(res.body.code).toBe(1001);
      expect(res.body.message).toBe('订单明细的单价或数量不正确');
    }
  });
});
```

- [ ] **Step 2: 运行确认失败**

```bash
npm run test -- base-order-create
```
预期：`FAIL`（路由 404，`res.body.code` undefined）。

- [ ] **Step 3: 实现 OrderService**

创建 `src/modules/order/service/order.ts`：

```ts
import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import {
  InjectDataSource,
  InjectEntityModel,
} from '@midwayjs/typeorm';
import { DataSource, Equal, Repository } from 'typeorm';
import * as _ from 'lodash';
import * as moment from 'moment';
import { OrderEntity } from '../entity/order';
import { OrderProductEntity } from '../entity/order-product';
import { OrderReservationEntity } from '../entity/order-reservation';
import { OrderTicketEntity } from '../entity/order-ticket';

/** 模块与订单类型白名单：模块 → 允许的 orderType */
const MODULE_TYPES = {
  product: [1],
  food: [2],
  accommodation: [3],
  travel: [4, 5],
};

/** 订单类型 → 明细实体 */
const TYPE_DETAIL = {
  1: OrderProductEntity,
  2: OrderReservationEntity,
  3: OrderReservationEntity,
  4: OrderTicketEntity,
  5: OrderTicketEntity,
};

/** 各明细类型可写入的快照字段白名单 */
const DETAIL_FIELDS = {
  1: ['productId', 'skuId', 'productName', 'skuName', 'productImage', 'addressId'],
  2: [
    'targetId',
    'targetName',
    'checkInDate',
    'checkOutDate',
    'guestName',
    'guestPhone',
    'guestCount',
    'idCard',
    'timeSlot',
    'roomTypeId',
    'specialRequest',
  ],
  3: [
    'targetId',
    'targetName',
    'checkInDate',
    'checkOutDate',
    'guestName',
    'guestPhone',
    'guestCount',
    'idCard',
    'timeSlot',
    'roomTypeId',
    'specialRequest',
  ],
  4: ['targetId', 'targetName', 'ticketName', 'useDate', 'visitorInfo'],
  5: ['targetId', 'targetName', 'ticketName', 'useDate', 'visitorInfo'],
};

/**
 * 统一订单
 * 说明：价格/库存的业务校验由各业务模块在下单链路前置完成后调用本服务；
 * 本服务只负责主单+明细落库与服务端金额汇总，不反查业务表（单向依赖）。
 */
@Provide()
export class OrderService extends BaseService {
  @InjectEntityModel(OrderEntity)
  orderEntity: Repository<OrderEntity>;

  @InjectEntityModel(OrderProductEntity)
  orderProductEntity: Repository<OrderProductEntity>;

  @InjectEntityModel(OrderReservationEntity)
  orderReservationEntity: Repository<OrderReservationEntity>;

  @InjectEntityModel(OrderTicketEntity)
  orderTicketEntity: Repository<OrderTicketEntity>;

  @InjectDataSource()
  dataSource: DataSource;

  /**
   * 创建订单：主单 + 按 orderType 落对应明细，金额服务端汇总
   */
  async create(userId: number, param) {
    const { module, orderType, remark, items } = param || {};
    if (!MODULE_TYPES[module]) {
      throw new CoolCommException('订单模块不正确');
    }
    const type = Number(orderType);
    if (!MODULE_TYPES[module].includes(type)) {
      throw new CoolCommException('订单类型与模块不匹配');
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new CoolCommException('订单明细不能为空');
    }

    let sum = 0;
    const details = [];
    for (const it of items) {
      const price = Number(it?.price);
      const quantity = Number(it?.quantity);
      if (!(price > 0) || !(quantity >= 1)) {
        throw new CoolCommException('订单明细的单价或数量不正确');
      }
      sum += price * quantity;
      const detail = _.pick(it, DETAIL_FIELDS[type]);
      if (type === 2 || type === 3) {
        detail['reservationType'] = type;
      }
      if (type === 4 || type === 5) {
        detail['ticketType'] = type === 4 ? 1 : 2;
      }
      details.push({
        ...detail,
        price,
        quantity,
        totalAmount: Number((price * quantity).toFixed(2)),
      });
    }

    const orderNo = this.genOrderNo();
    const payAmount = Number(sum.toFixed(2));
    await this.dataSource.transaction(async manager => {
      const inserted = await manager.insert(OrderEntity, {
        orderNo,
        userId,
        orderType: type,
        module,
        totalAmount: payAmount,
        payAmount,
        discountAmount: 0,
        status: 1,
        remark,
      });
      const orderId = inserted.identifiers[0].id;
      for (const detail of details) {
        await manager.insert(TYPE_DETAIL[type], { ...detail, orderId });
      }
    });
    return { orderNo, payAmount };
  }

  /**
   * 订单号：YYYYMMDDHHmmssSSS + 4位随机
   */
  genOrderNo() {
    return `${moment().format('YYYYMMDDHHmmssSSS')}${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  }
}
```

- [ ] **Step 4: 实现下单控制器**

创建 `src/modules/order/controller/app/order.ts`：

```ts
import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { OrderService } from '../../service/order';

/**
 * C端统一订单（需登录）
 * 说明：文件名与模块名同名会导致前缀推导重复（/app/order/order），
 * 故显式指定 prefix，保证 URL 与 base 设计一致
 */
@CoolController({ prefix: '/app/order' })
export class AppOrderController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  orderService: OrderService;

  @Post('/create', { summary: '创建订单' })
  async create(@Body() body) {
    return this.ok(await this.orderService.create(this.ctx.user.id, body));
  }
}
```

- [ ] **Step 5: 运行测试确认通过**

```bash
npm run test -- base-order-create
```
预期：`PASS`，7 passed。

- [ ] **Step 6: 提交**

```bash
cd /c/Users/cja/wudong/code
git add cool-admin-midway/src/modules/order/service/order.ts cool-admin-midway/src/modules/order/controller/app/order.ts cool-admin-midway/test/base-order-create.test.ts
git commit -m "feat(base): 统一订单下单链路（事务落主单+三型明细，服务端金额汇总）"
```

---

### Task 3: 订单查询与取消（pageList/detail/cancel）

**Files:**
- Modify: `code/cool-admin-midway/src/modules/order/service/order.ts`（追加 `pageList`/`getByNo`/`cancel`）
- Modify: `code/cool-admin-midway/src/modules/order/controller/app/order.ts`（追加路由）
- Test: `code/cool-admin-midway/test/base-order-query.test.ts`

**Interfaces:**
- Consumes: Task 2 `OrderService.create`。
- Produces（Task 5 依赖）:
  - `OrderService.pageList(userId, status?, page?, size?): Promise<{ list, total }>` —— id 倒序，status 可选过滤
  - `OrderService.getByNo(userId, orderNo): Promise<order & { items }>` —— 主单 + 明细数组；无权访问抛 `CoolCommException('订单不存在')`
  - `OrderService.cancel(userId, orderNo)` —— 仅待支付可取消；否则抛 `CoolCommException('仅待支付订单可取消')`
  - C 端接口：`GET /app/order/page`、`GET /app/order/detail?orderNo=`、`POST /app/order/cancel`

- [ ] **Step 1: 写失败测试**

创建 `code/cool-admin-midway/test/base-order-query.test.ts`：

```ts
import { auth, boot, close, createHttpRequest, registerAndLogin } from './helper';

const phoneA = '13500135003';
const phoneB = '13500135004';

describe('order 查询与取消', () => {
  let app;
  let tokenA: string;
  let tokenB: string;
  let productOrderNo: string;
  let ticketOrderNo: string;

  beforeAll(async () => {
    app = await boot();
    tokenA = await registerAndLogin(app, phoneA);
    tokenB = await registerAndLogin(app, phoneB);

    const p = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(tokenA))
      .send({
        module: 'product',
        orderType: 1,
        items: [
          { productId: 1, skuId: 11, productName: '银手镯', price: 100, quantity: 1 },
        ],
      });
    productOrderNo = p.body.data.orderNo;

    const t = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(tokenA))
      .send({
        module: 'travel',
        orderType: 4,
        items: [
          { targetId: 1, targetName: '苗寨景区', ticketName: '成人票', useDate: '2026-10-01', price: 80, quantity: 1 },
        ],
      });
    ticketOrderNo = t.body.data.orderNo;
  });

  afterAll(async () => {
    await close(app);
  });

  it('pageList 分页、状态过滤与用户隔离', async () => {
    const all = await createHttpRequest(app)
      .get('/app/order/page?page=1&size=10')
      .set(auth(tokenA));
    expect(all.body.code).toBe(1000);
    expect(all.body.data.total).toBe(2);

    const mine = await createHttpRequest(app)
      .get('/app/order/page?page=1&size=10')
      .set(auth(tokenB));
    expect(mine.body.data.total).toBe(0);

    const pending = await createHttpRequest(app)
      .get('/app/order/page?page=1&size=10&status=1')
      .set(auth(tokenA));
    expect(pending.body.data.total).toBe(2);
  });

  it('detail 返回主单与明细，且用户隔离', async () => {
    const ok = await createHttpRequest(app)
      .get(`/app/order/detail?orderNo=${productOrderNo}`)
      .set(auth(tokenA));
    expect(ok.body.code).toBe(1000);
    expect(ok.body.data.orderNo).toBe(productOrderNo);
    expect(ok.body.data.items.length).toBe(1);
    expect(ok.body.data.items[0].productName).toBe('银手镯');

    const deny = await createHttpRequest(app)
      .get(`/app/order/detail?orderNo=${productOrderNo}`)
      .set(auth(tokenB));
    expect(deny.body.code).toBe(1001);
    expect(deny.body.message).toBe('订单不存在');
  });

  it('detail 能返回门票明细快照', async () => {
    const ok = await createHttpRequest(app)
      .get(`/app/order/detail?orderNo=${ticketOrderNo}`)
      .set(auth(tokenA));
    expect(ok.body.data.items[0].ticketName).toBe('成人票');
    expect(ok.body.data.items[0].useDate).toBe('2026-10-01');
  });

  it('仅待支付可取消', async () => {
    const ok = await createHttpRequest(app)
      .post('/app/order/cancel')
      .set(auth(tokenA))
      .send({ orderNo: ticketOrderNo });
    expect(ok.body.code).toBe(1000);

    const again = await createHttpRequest(app)
      .post('/app/order/cancel')
      .set(auth(tokenA))
      .send({ orderNo: ticketOrderNo });
    expect(again.body.code).toBe(1001);
    expect(again.body.message).toBe('仅待支付订单可取消');

    const cancelled = await createHttpRequest(app)
      .get('/app/order/page?page=1&size=10&status=4')
      .set(auth(tokenA));
    expect(cancelled.body.data.total).toBe(1);
  });

  it('取消不存在/他人的订单报订单不存在', async () => {
    const res = await createHttpRequest(app)
      .post('/app/order/cancel')
      .set(auth(tokenB))
      .send({ orderNo: productOrderNo });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('订单不存在');
  });
});
```

- [ ] **Step 2: 运行确认失败**

```bash
npm run test -- base-order-query
```
预期：`FAIL`（page/detail/cancel 路由 404）。

- [ ] **Step 3: 实现查询与取消**

`service/order.ts` 追加：

```ts
  /**
   * 我的订单分页（id 倒序，status 可选过滤）
   */
  async pageList(userId: number, status?: number, page = 1, size = 10) {
    const qb = this.orderEntity
      .createQueryBuilder('a')
      .where('a.userId = :userId', { userId })
      .orderBy('a.id', 'DESC');
    if (status) {
      qb.andWhere('a.status = :status', { status });
    }
    const pageNo = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(size) || 10, 1);
    qb.skip((pageNo - 1) * pageSize).take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total };
  }

  /**
   * 订单详情：主单 + 明细快照
   */
  async getByNo(userId: number, orderNo: string) {
    const order = await this.orderEntity.findOneBy({
      orderNo: Equal(orderNo),
      userId: Equal(userId),
    });
    if (!order) {
      throw new CoolCommException('订单不存在');
    }
    const detailEntity = TYPE_DETAIL[order.orderType];
    const items = await this.dataSource
      .getRepository(detailEntity)
      .find({ where: { orderId: Equal(order.id) }, order: { id: 'ASC' } });
    return { ...order, items };
  }

  /**
   * 取消订单（仅待支付）
   */
  async cancel(userId: number, orderNo: string) {
    const order = await this.orderEntity.findOneBy({
      orderNo: Equal(orderNo),
      userId: Equal(userId),
    });
    if (!order) {
      throw new CoolCommException('订单不存在');
    }
    if (order.status !== 1) {
      throw new CoolCommException('仅待支付订单可取消');
    }
    await this.orderEntity.update(
      { id: order.id },
      { status: 4, cancelTime: new Date() }
    );
    return true;
  }
```

`controller/app/order.ts` 追加路由：

```ts
  @Get('/page', { summary: '我的订单分页' })
  async page(
    @Query('status') status: number,
    @Query('page') page: number,
    @Query('size') size: number
  ) {
    return this.ok(
      await this.orderService.pageList(this.ctx.user.id, status, page, size)
    );
  }

  @Get('/detail', { summary: '订单详情' })
  async detail(@Query('orderNo') orderNo: string) {
    return this.ok(await this.orderService.getByNo(this.ctx.user.id, orderNo));
  }

  @Post('/cancel', { summary: '取消订单' })
  async cancel(@Body('orderNo') orderNo: string) {
    return this.ok(await this.orderService.cancel(this.ctx.user.id, orderNo));
  }
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npm run test -- base-order-query
```
预期：`PASS`，5 passed。

- [ ] **Step 5: 提交**

```bash
cd /c/Users/cja/wudong/code
git add cool-admin-midway/src/modules/order/service/order.ts cool-admin-midway/src/modules/order/controller/app/order.ts cool-admin-midway/test/base-order-query.test.ts
git commit -m "feat(base): 统一订单分页/详情/取消（用户隔离与状态守卫）"
```

---

### Task 4: 状态机（markPaid/markRefunded）+ 管理端 CRUD

**Files:**
- Modify: `code/cool-admin-midway/src/modules/order/service/order.ts`（追加 `markPaid`/`markRefunded`）
- Create: `code/cool-admin-midway/src/modules/order/controller/admin/order.ts`
- Test: `code/cool-admin-midway/test/base-order-state.test.ts`

**Interfaces:**
- Consumes: Task 2/3 全部。
- Produces（Task 5 依赖，签名固定）:
  - `OrderService.markPaid(orderNo): Promise<boolean>` —— 仅待支付可置已支付（status 1→2 + payTime）；否则抛 `CoolCommException('订单不存在或状态已变化')`
  - `OrderService.markRefunded(orderNo): Promise<boolean>` —— 已支付/已完成可置已退款（status 2|3→5）；否则抛同上
  - 管理端接口：`/admin/order` page/list/info/update/delete（`status`/`orderType`/`module` 精确过滤，`orderNo` 模糊）

- [ ] **Step 1: 写失败测试**

创建 `code/cool-admin-midway/test/base-order-state.test.ts`：

```ts
import {
  auth,
  boot,
  close,
  createHttpRequest,
  registerAndLogin,
} from './helper';
import { OrderService } from '../src/modules/order/service/order';

const phone = '13500135005';

describe('order 状态机与管理端', () => {
  let app;
  let token: string;
  let orderNo: string;
  let orderService: OrderService;

  beforeAll(async () => {
    app = await boot();
    orderService = await app
      .getApplicationContext()
      .getAsync(OrderService);
    token = await registerAndLogin(app, phone);
    const res = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(token))
      .send({
        module: 'travel',
        orderType: 5,
        items: [
          { targetId: 2, targetName: '梯田二日', ticketName: '路线套餐', useDate: '2026-10-02', price: 500, quantity: 1 },
        ],
      });
    orderNo = res.body.data.orderNo;
  });

  afterAll(async () => {
    await close(app);
  });

  it('待支付订单不能直接置为已退款', async () => {
    await expect(orderService.markRefunded(orderNo)).rejects.toThrow(
      '订单不存在或状态已变化'
    );
  });

  it('markPaid 将待支付置为已支付', async () => {
    await expect(orderService.markPaid(orderNo)).resolves.toBe(true);
    const detail = await createHttpRequest(app)
      .get(`/app/order/detail?orderNo=${orderNo}`)
      .set(auth(token));
    expect(detail.body.data.status).toBe(2);
    expect(detail.body.data.payTime).toBeTruthy();
  });

  it('重复 markPaid 被拒绝', async () => {
    await expect(orderService.markPaid(orderNo)).rejects.toThrow(
      '订单不存在或状态已变化'
    );
  });

  it('已支付订单不能被用户取消', async () => {
    const res = await createHttpRequest(app)
      .post('/app/order/cancel')
      .set(auth(token))
      .send({ orderNo });
    expect(res.body.code).toBe(1001);
  });

  it('markRefunded 将已支付置为已退款', async () => {
    await expect(orderService.markRefunded(orderNo)).resolves.toBe(true);
    const detail = await createHttpRequest(app)
      .get(`/app/order/detail?orderNo=${orderNo}`)
      .set(auth(token));
    expect(detail.body.data.status).toBe(5);
  });

  it('管理端接口未登录返回401', async () => {
    const res = await createHttpRequest(app).get(
      '/admin/order/page?page=1&size=10'
    );
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 2: 运行确认失败**

```bash
npm run test -- base-order-state
```
预期：`FAIL`（markPaid 未实现 + /admin/order 404）。

- [ ] **Step 3: 实现状态机与管理端控制器**

`service/order.ts` 追加（并把 `In` 加入顶部 typeorm import：`import { DataSource, Equal, In, Repository } from 'typeorm';`）：

```ts
  /**
   * 标记已支付（供 pay 模块回调）：仅待支付可置
   */
  async markPaid(orderNo: string) {
    const ret = await this.orderEntity.update(
      { orderNo: Equal(orderNo), status: 1 },
      { status: 2, payTime: new Date() }
    );
    if (!ret.affected) {
      throw new CoolCommException('订单不存在或状态已变化');
    }
    return true;
  }

  /**
   * 标记已退款（供业务模块退票/退款流程调用）：已支付/已完成可置
   */
  async markRefunded(orderNo: string) {
    const ret = await this.orderEntity.update(
      { orderNo: Equal(orderNo), status: In([2, 3]) },
      { status: 5 }
    );
    if (!ret.affected) {
      throw new CoolCommException('订单不存在或状态已变化');
    }
    return true;
  }
```

创建 `src/modules/order/controller/admin/order.ts`：

```ts
import { CoolController, BaseController } from '@cool-midway/core';
import { OrderEntity } from '../../entity/order';

/**
 * 统一订单管理
 */
@CoolController({
  prefix: '/admin/order',
  api: ['page', 'list', 'info', 'update', 'delete'],
  entity: OrderEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.orderType', 'a.module'],
    keyWordLikeFields: ['a.orderNo'],
  },
})
export class AdminOrderController extends BaseController {}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npm run test -- base-order-state
```
预期：`PASS`，6 passed。

- [ ] **Step 5: 提交**

```bash
cd /c/Users/cja/wudong/code
git add cool-admin-midway/src/modules/order/service/order.ts cool-admin-midway/src/modules/order/controller/admin/order.ts cool-admin-midway/test/base-order-state.test.ts
git commit -m "feat(base): 订单状态机 markPaid/markRefunded 与管理端 CRUD"
```

---

### Task 5: 支付模块（PayService + /app/pay/* + /admin/pay/record）

**Files:**
- Create: `code/cool-admin-midway/src/modules/pay/service/pay.ts`
- Create: `code/cool-admin-midway/src/modules/pay/controller/app/pay.ts`
- Create: `code/cool-admin-midway/src/modules/pay/controller/admin/record.ts`
- Test: `code/cool-admin-midway/test/base-pay.test.ts`

**Interfaces:**
- Consumes: `OrderService`（Task 2-4）、`OrderEntity`（Task 1）、`PaymentRecordEntity`（Task 1）。
- Produces:
  - `PayService.create(userId, orderNo, channel): Promise<{ paymentNo }>` —— 校验归属/待支付/渠道；同订单存在待支付流水则幂等复用
  - `PayService.mockPay(paymentNo): Promise<boolean>` —— 模拟支付成功：流水 1→2 + 交易号 + 支付时间 → `OrderService.markPaid`；**接真实微信支付时只改此方法**
  - `PayService.refund(paymentNo, amount): Promise<boolean>` —— 流水 2→3 + 退款时间/金额；订单状态由业务模块调 `OrderService.markRefunded`
  - `PayService.records(userId, orderNo): Promise<record[]>` —— 本人订单的支付流水
  - C 端接口：`POST /app/pay/create`、`POST /app/pay/mock`、`GET /app/pay/record?orderNo=`
  - 管理端接口：`/admin/pay/record` page/list/info

- [ ] **Step 1: 写失败测试**

创建 `code/cool-admin-midway/test/base-pay.test.ts`：

```ts
import {
  auth,
  boot,
  close,
  createHttpRequest,
  registerAndLogin,
} from './helper';
import { OrderService } from '../src/modules/order/service/order';
import { PayService } from '../src/modules/pay/service/pay';

const phoneC = '13400134001';
const phoneD = '13400134002';

describe('pay 统一支付', () => {
  let app;
  let tokenC: string;
  let tokenD: string;
  let orderNoC: string;
  let paymentNo: string;
  let payService: PayService;
  let orderService: OrderService;

  beforeAll(async () => {
    app = await boot();
    payService = await app.getApplicationContext().getAsync(PayService);
    orderService = await app
      .getApplicationContext()
      .getAsync(OrderService);
    tokenC = await registerAndLogin(app, phoneC);
    tokenD = await registerAndLogin(app, phoneD);
    const res = await createHttpRequest(app)
      .post('/app/order/create')
      .set(auth(tokenC))
      .send({
        module: 'product',
        orderType: 1,
        items: [
          { productId: 2, skuId: 21, productName: '蜡染围巾', price: 50, quantity: 1 },
        ],
      });
    orderNoC = res.body.data.orderNo;
  });

  afterAll(async () => {
    await close(app);
  });

  it('未登录访问支付接口被拦截', async () => {
    const res = await createHttpRequest(app)
      .post('/app/pay/mock')
      .send({ paymentNo: 'x' });
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('支付渠道不正确被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/pay/create')
      .set(auth(tokenC))
      .send({ orderNo: orderNoC, channel: 'wx' });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('支付渠道不正确');
  });

  it('不能为他人订单创建支付单', async () => {
    const res = await createHttpRequest(app)
      .post('/app/pay/create')
      .set(auth(tokenD))
      .send({ orderNo: orderNoC, channel: 'wechat' });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('订单不存在');
  });

  it('创建支付单并幂等复用待支付流水', async () => {
    const first = await createHttpRequest(app)
      .post('/app/pay/create')
      .set(auth(tokenC))
      .send({ orderNo: orderNoC, channel: 'wechat' });
    expect(first.body.code).toBe(1000);
    expect(first.body.data.paymentNo).toBeTruthy();

    const second = await createHttpRequest(app)
      .post('/app/pay/create')
      .set(auth(tokenC))
      .send({ orderNo: orderNoC, channel: 'alipay' });
    expect(second.body.data.paymentNo).toBe(first.body.data.paymentNo);

    paymentNo = first.body.data.paymentNo;
  });

  it('mock 支付成功后流水与订单均为已支付', async () => {
    const res = await createHttpRequest(app)
      .post('/app/pay/mock')
      .set(auth(tokenC))
      .send({ paymentNo });
    expect(res.body.code).toBe(1000);

    const records = await createHttpRequest(app)
      .get(`/app/pay/record?orderNo=${orderNoC}`)
      .set(auth(tokenC));
    expect(records.body.data.length).toBe(1);
    expect(records.body.data[0].payStatus).toBe(2);
    expect(records.body.data[0].payTime).toBeTruthy();
    expect(records.body.data[0].transactionId).toContain('MOCK');

    const order = await createHttpRequest(app)
      .get(`/app/order/detail?orderNo=${orderNoC}`)
      .set(auth(tokenC));
    expect(order.body.data.status).toBe(2);
  });

  it('重复 mock 支付被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/pay/mock')
      .set(auth(tokenC))
      .send({ paymentNo });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('支付单当前状态不可支付');
  });

  it('已支付订单不能再创建支付单', async () => {
    const res = await createHttpRequest(app)
      .post('/app/pay/create')
      .set(auth(tokenC))
      .send({ orderNo: orderNoC, channel: 'wechat' });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('订单当前状态不可支付');
  });

  it('退款金额校验与退款成功', async () => {
    const over = await payService
      .refund(paymentNo, 999)
      .catch(e => e);
    expect(over.message).toBe('退款金额不正确');

    await expect(payService.refund(paymentNo, 50)).resolves.toBe(true);

    const again = await payService.refund(paymentNo, 50).catch(e => e);
    expect(again.message).toBe('仅已支付的支付单可退款');

    const records = await createHttpRequest(app)
      .get(`/app/pay/record?orderNo=${orderNoC}`)
      .set(auth(tokenC));
    expect(records.body.data[0].payStatus).toBe(3);
    expect(Number(records.body.data[0].refundAmount)).toBe(50);
  });

  it('业务模块调 markRefunded 后订单置为已退款', async () => {
    await expect(orderService.markRefunded(orderNoC)).resolves.toBe(true);
    const order = await createHttpRequest(app)
      .get(`/app/order/detail?orderNo=${orderNoC}`)
      .set(auth(tokenC));
    expect(order.body.data.status).toBe(5);
  });

  it('他人不能查看我的支付流水', async () => {
    const res = await createHttpRequest(app)
      .get(`/app/pay/record?orderNo=${orderNoC}`)
      .set(auth(tokenD));
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('订单不存在');
  });

  it('管理端支付流水接口未登录返回401', async () => {
    const res = await createHttpRequest(app).get(
      '/admin/pay/record/page?page=1&size=10'
    );
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 2: 运行确认失败**

```bash
npm run test -- base-pay
```
预期：`FAIL`（路由 404 / PayService 模块不存在）。

- [ ] **Step 3: 实现 PayService**

创建 `src/modules/pay/service/pay.ts`：

```ts
import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import * as moment from 'moment';
import { OrderEntity } from '../../order/entity/order';
import { OrderService } from '../../order/service/order';
import { PaymentRecordEntity } from '../entity/record';

/**
 * 统一支付（模拟）
 * 接真实微信支付时只替换 mockPay 的内部实现（下单→回调），对上层透明
 */
@Provide()
export class PayService extends BaseService {
  @InjectEntityModel(PaymentRecordEntity)
  paymentRecordEntity: Repository<PaymentRecordEntity>;

  @InjectEntityModel(OrderEntity)
  orderEntity: Repository<OrderEntity>;

  @Inject()
  orderService: OrderService;

  /**
   * 创建支付单：校验归属与待支付状态；同订单已有待支付流水则幂等复用
   */
  async create(userId: number, orderNo: string, channel: string) {
    if (!['wechat', 'alipay'].includes(channel)) {
      throw new CoolCommException('支付渠道不正确');
    }
    const order = await this.orderEntity.findOneBy({
      orderNo: Equal(orderNo),
      userId: Equal(userId),
    });
    if (!order) {
      throw new CoolCommException('订单不存在');
    }
    if (order.status !== 1) {
      throw new CoolCommException('订单当前状态不可支付');
    }
    const pending = await this.paymentRecordEntity.findOneBy({
      orderId: order.id,
      payStatus: 1,
    });
    if (pending) {
      return { paymentNo: pending.paymentNo };
    }
    const paymentNo = this.genPaymentNo();
    await this.paymentRecordEntity.insert({
      orderId: order.id,
      paymentNo,
      payChannel: channel,
      payAmount: Number(order.payAmount),
      payStatus: 1,
    });
    return { paymentNo };
  }

  /**
   * 模拟支付成功：流水置已支付 → 订单置已支付
   */
  async mockPay(paymentNo: string) {
    const record = await this.paymentRecordEntity.findOneBy({
      paymentNo: Equal(paymentNo),
    });
    if (!record) {
      throw new CoolCommException('支付单不存在');
    }
    if (record.payStatus !== 1) {
      throw new CoolCommException('支付单当前状态不可支付');
    }
    const order = await this.orderEntity.findOneBy({
      id: Equal(record.orderId),
    });
    if (!order || order.status !== 1) {
      throw new CoolCommException('订单已取消或状态已变化');
    }
    await this.paymentRecordEntity.update(
      { id: record.id },
      {
        payStatus: 2,
        payTime: new Date(),
        transactionId: `MOCK${paymentNo}`,
      }
    );
    await this.orderService.markPaid(order.orderNo);
    return true;
  }

  /**
   * 退款：流水置已退款；订单状态由业务模块调 OrderService.markRefunded
   */
  async refund(paymentNo: string, amount: number) {
    const record = await this.paymentRecordEntity.findOneBy({
      paymentNo: Equal(paymentNo),
    });
    if (!record) {
      throw new CoolCommException('支付单不存在');
    }
    if (record.payStatus !== 2) {
      throw new CoolCommException('仅已支付的支付单可退款');
    }
    const amt = Number(amount);
    if (!(amt > 0) || amt > Number(record.payAmount)) {
      throw new CoolCommException('退款金额不正确');
    }
    await this.paymentRecordEntity.update(
      { id: record.id },
      { payStatus: 3, refundTime: new Date(), refundAmount: amt }
    );
    return true;
  }

  /**
   * 本人订单的支付流水
   */
  async records(userId: number, orderNo: string) {
    const order = await this.orderEntity.findOneBy({
      orderNo: Equal(orderNo),
      userId: Equal(userId),
    });
    if (!order) {
      throw new CoolCommException('订单不存在');
    }
    return this.paymentRecordEntity.find({
      where: { orderId: order.id },
      order: { id: 'DESC' },
    });
  }

  /**
   * 支付流水号：PAY + YYYYMMDDHHmmssSSS + 4位随机
   */
  genPaymentNo() {
    return `PAY${moment().format('YYYYMMDDHHmmssSSS')}${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  }
}
```

- [ ] **Step 4: 实现支付控制器**

创建 `src/modules/pay/controller/app/pay.ts`：

```ts
import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { PayService } from '../../service/pay';

/**
 * C端统一支付（需登录）
 */
@CoolController({ prefix: '/app/pay' })
export class AppPayController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  payService: PayService;

  @Post('/create', { summary: '创建支付单' })
  async create(
    @Body('orderNo') orderNo: string,
    @Body('channel') channel: string
  ) {
    return this.ok(
      await this.payService.create(this.ctx.user.id, orderNo, channel)
    );
  }

  @Post('/mock', { summary: '模拟支付成功' })
  async mock(@Body('paymentNo') paymentNo: string) {
    return this.ok(await this.payService.mockPay(paymentNo));
  }

  @Get('/record', { summary: '订单支付流水' })
  async record(@Query('orderNo') orderNo: string) {
    return this.ok(await this.payService.records(this.ctx.user.id, orderNo));
  }
}
```

创建 `src/modules/pay/controller/admin/record.ts`：

```ts
import { CoolController, BaseController } from '@cool-midway/core';
import { PaymentRecordEntity } from '../../entity/record';

/**
 * 支付流水管理
 */
@CoolController({
  prefix: '/admin/pay/record',
  api: ['page', 'list', 'info'],
  entity: PaymentRecordEntity,
  pageQueryOp: {
    fieldEq: ['a.payStatus', 'a.payChannel'],
    keyWordLikeFields: ['a.paymentNo'],
  },
})
export class AdminPayRecordController extends BaseController {}
```

- [ ] **Step 5: 运行测试确认通过**

```bash
npm run test -- base-pay
```
预期：`PASS`，11 passed。

- [ ] **Step 6: 提交**

```bash
cd /c/Users/cja/wudong/code
git add cool-admin-midway/src/modules/pay cool-admin-midway/test/base-pay.test.ts
git commit -m "feat(base): 统一支付流水与模拟支付（幂等支付单/mockPay/refund）"
```

---

### Task 6: 全量回归 + lint + dev 手动验收

**Files:** 无新增（验收任务）

- [ ] **Step 1: 全量回归**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test
```
预期：member 8 套件 + base 新增 4 套件（entity/create/query/state + pay 共 5 个新文件）全部 PASS。

- [ ] **Step 2: lint**

```bash
npm run lint
```
预期：新增 order/pay 文件 0 错误（脚手架遗留 4 个错误不算）。

- [ ] **Step 3: dev 服务器手动验收**

```bash
npm run dev   # 新终端执行以下命令，端口以启动日志为准（假设 8001）
```

```bash
# 1. 注册拿 token（验证码在响应 data.code 回显）
curl -X POST http://127.0.0.1:8001/app/member/login/smsCode -H "Content-Type: application/json" -d '{"phone":"13800001111"}'
curl -X POST http://127.0.0.1:8001/app/member/login/register -H "Content-Type: application/json" -d '{"phone":"13800001111","smsCode":"<code>","password":"abc123456"}'

# 2. 创建门票订单 → 返回 orderNo/payAmount=240
curl -X POST http://127.0.0.1:8001/app/order/create -H "Content-Type: application/json" -H "Authorization: <token>" -d '{"module":"travel","orderType":4,"items":[{"targetId":1,"targetName":"苗寨景区","ticketName":"成人票","useDate":"2026-10-01","price":80,"quantity":3}]}'

# 3. 创建支付单 → 返回 paymentNo
curl -X POST http://127.0.0.1:8001/app/pay/create -H "Content-Type: application/json" -H "Authorization: <token>" -d '{"orderNo":"<orderNo>","channel":"wechat"}'

# 4. 模拟支付 → 订单详情 status=2 且有 payTime
curl -X POST http://127.0.0.1:8001/app/pay/mock -H "Content-Type: application/json" -H "Authorization: <token>" -d '{"paymentNo":"<paymentNo>"}'
curl "http://127.0.0.1:8001/app/order/detail?orderNo=<orderNo>" -H "Authorization: <token>"

# 5. 未带 token 访问 → 200 + {"code":1001,"message":"登录失效~"}
curl -i http://127.0.0.1:8001/app/order/page?page=1\&size=10

# 6. 管理端未登录 → HTTP 401
curl -i "http://127.0.0.1:8001/admin/order/page?page=1&size=10"
curl -i "http://127.0.0.1:8001/admin/pay/record/page?page=1&size=10"
```

浏览器打开 `http://127.0.0.1:8001/swagger` 确认 order（4 个 C 端 + admin）与 pay（3 个 C 端 + admin）接口可见。验收后 Ctrl+C 停服务器。

- [ ] **Step 4: 推送分支**

```bash
cd /c/Users/cja/wudong/code
git push -u origin feature/base-order
```

---

## 非目标（明确不做）

- 消息通知：mockPay 成功后的 system_message 通知在 T2（message 模块）合入后补一行调用（集成点已记入 base 设计 §5.4）
- 业务侧下单封装：travel/food 等模块的库存校验+下单封装属 B3（它们校验完后调 `OrderService.create`）
- 发货/收货流程：order_product 的 express 字段本期只落库，操作入口归衣模块管理页
- 完成状态推进（status 3）：由核销/确认收货等业务动作驱动，属业务模块
- 真实微信支付/退款回调（mockPay 内部可替换，对上层透明）
- 优惠券与 discountAmount 计算（列已预留，恒 0）

## 验收对照（base 设计 §5.3/§5.4 → 本计划落点）

| 设计要求 | 落点 |
|---|---|
| order + 三明细表 | Task 1 实体 + 建表测试 |
| `OrderService.create` 事务落库 + 服务端金额汇总 | Task 2 |
| `pageList`/`getByNo`/`cancel`（用户隔离 + 状态守卫） | Task 3 |
| `markPaid`/`markRefunded` 状态机 + /admin/order | Task 4 |
| `PayService` create/mockPay/refund/records + /app/pay/* + /admin/pay/record | Task 5 |
| 幂等：支付单复用、重复 mock 拒绝、状态守卫 | Task 5 测试 |
| 单向依赖：order 不反查业务表、pay 只依赖 order | Task 2/5 代码结构 |
