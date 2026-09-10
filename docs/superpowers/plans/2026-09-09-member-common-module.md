# member 公共模块（C 端用户）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 cool-admin-midway 脚手架上新增 `member` 模块——C 端用户公共模块（注册/登录/JWT 鉴权/模拟短信/个人资料/跨模块收藏），供行（travel）与社区（community）模块共用。

**Architecture:** 遵循 cool-admin 8.x 模块惯例（`entity` + `service` + `controller/admin` + `controller/app` + `config.ts`），C 端接口挂 `/app/member/*` 前缀由脚手架全局 `UserMiddleware` 做 JWT 鉴权，管理端 CRUD 挂 `/admin/member/user/*` 走 admin 鉴权。表由 TypeORM `synchronize: true` 自动创建，无需手写迁移。

**Tech Stack:** Midway.js 3.x + TypeORM 0.3.x + MySQL 8 + Jest/ts-jest（`@midwayjs/mock` 集成测试）+ bcryptjs

**Spec:** `docs/superpowers/specs/2026-09-09-travel-community-design.md`（本计划实现其 §5.1 member、§5.5 user_favorite，以及 §6 中 member 相关接口；travel/community/order 属后续 Phase，不在本计划）

## Global Constraints

- **工作目录**：git 命令在 `code/`（内层 git 仓库，当前分支 `lv`）执行；npm/jest 命令在 `code/cool-admin-midway/` 执行。
- **分支**：从 `lv` 新建 `feature/member` 分支（Task 1 完成）。
- **本地环境前提**：MySQL 8 运行于 `127.0.0.1:3307`（docker 容器 `wudong-mysql`，账号 `root/123456`；本机 3306 是另一个不同密码的原生 MySQL80，**不可用**；测试基建支持 `DB_PORT` 环境变量覆盖）；Node >= 18。
- **URL 与命名**：C 端 `/app/member/*`、管理端 `/admin/member/user/*`（spec §4 偏差备案：文档示例 `/api/*` → cool-admin 惯例）；实体字段 camelCase（随框架）。
- **表名**（spec §5.1/§5.5，verbatim）：`member_user`、`member_sms_code`、`user_favorite`。列名 = 属性名（脚手架无 snake_case 命名策略），如 `createTime`、`expireTime`、`lastLoginTime`。
- **密码**：bcrypt 哈希（`bcryptjs@2.4.3`，cost 10）；规则 = 8-20 位且同时包含字母和数字（spec §5.1"密码规则 8-20 位含字母数字"）。
- **手机号**：正则 `/^1[3-9]\d{9}$/`。
- **JWT**：**复用 `module.user.jwt` 配置**（secret/expire/refreshExpire）。原因：脚手架全局 `UserMiddleware`（`src/modules/user/middleware/app.ts`）以该秘钥校验所有 `/app/*` 请求，member 签发的 token 用同一秘钥即可被无缝校验；token payload 为 `{ id: <member_user.id>, isRefresh }`，请求头 `Authorization: <token>`（无 Bearer 前缀，随脚手架）。**不得修改 user 模块**。
- **模拟短信**（spec §5.1"模拟短信：验证码固定/日志输出"）：随机 6 位数字验证码存 `member_sms_code` 表，有效期 300 秒，`logger.warn` 输出；`local`/`unittest` 环境下接口响应回显验证码（`data.code`），其余环境返回空对象。
- **收藏类型**（spec §5.5 verbatim）：`scenic` / `route` / `guide` / `post`；唯一约束 `(userId, targetType, targetId)`。
- **响应断言常量**（已核实 `@cool-midway/core`，并经 docker 生产容器实测）：成功 `body.code === 1000`；业务异常（`CoolCommException`）`body.code === 1001`（HTTP 仍 200）；未登录访问受保护 `/app/*` 接口 → HTTP 200 且 `body.code === 1001`、`message === '登录失效~'`（全局 UserMiddleware 拦截后异常被过滤器归一化，**不是** HTTP 401）；管理端 `/admin/*` 未登录 → HTTP 401。
- **参数校验**：Service 内手动校验并 `throw new CoolCommException('<中文提示>')`（与脚手架 user 模块一致），不引入 `@midwayjs/validate` DTO。
- **Git**：提交信息格式 `<type>(<scope>): <subject>`（开发文档规范）。每个任务只 `git add` 本任务列出的文件；**不提交**仓库中已存在的未提交本地环境改动（`cool-admin-midway/src/config/config.local.ts`、`config.prod.ts`、`cool-admin-vue/Dockerfile`、`docker-compose.yml`）。
- **测试执行**：`npm run test`（脚本已设 `NODE_ENV=unittest`）；jest 配置 `maxWorkers: 1` 防止多 worker 并发建表竞态。所有测试数据手机号以 `13x` 开头且各测试文件使用互不相同的前缀号段。

---

### Task 1: 分支 + 集成测试基建（jest 冒烟验证）

**Files:**
- Create: `code/cool-admin-midway/src/config/config.unittest.ts`
- Create: `code/cool-admin-midway/test/global-setup.js`
- Create: `code/cool-admin-midway/test/helper.ts`
- Create: `code/cool-admin-midway/test/smoke.test.ts`
- Modify: `code/cool-admin-midway/jest.config.js`

**Interfaces:**
- Consumes: 脚手架既有接口 `GET /app/user/login/captcha`（`TagTypes.IGNORE_TOKEN`，无需鉴权）。
- Produces: 后续所有测试任务依赖的基建——`boot()`（启动完整应用）、`auth(token)`（请求头）、`close`、`createHttpRequest`（均从 `test/helper.ts` 导出）；unittest 数据库 `wudong_platform_test`（每次测试运行前重建）。

> **背景**：`test/README.md` 声称 cool-admin 与 jest 不兼容，但脚手架 dev 脚本本身就是通过 `mwtsc --run @midwayjs/mock/app.js` 启动应用的，且 package.json 自带完整 jest 依赖链。本任务用冒烟测试实证可行性。
> **降级预案（仅当冒烟测试无法通过时启用）**：若 `createApp` 在 jest 下无法启动或路由前缀推导错误（`/app/user/login/captcha` 返回 404），停止 HTTP 级测试路线：保留本任务除 smoke.test.ts 外的全部文件，后续任务的测试改为通过 `app.getApplicationContext().getAsync(XxxService)` 直接调 Service 断言业务逻辑（DI 与路由无关，必然可用），并在每个 controller 任务追加"启动 dev 服务器用 curl 验证路由"步骤。两种情况下 Task 2 起的实施步骤均不变。

- [ ] **Step 1: 创建分支**

```bash
cd /c/Users/cja/wudong/code
git checkout -b feature/member
git add docs/superpowers/plans/2026-09-09-member-common-module.md
git commit -m "docs(member): member 公共模块实施计划"
```

- [ ] **Step 2: 创建 unittest 环境配置**

创建 `code/cool-admin-midway/src/config/config.unittest.ts`（与 config.local.ts 同构，仅换测试库并关闭 eps/菜单初始化）：

```ts
import { CoolConfig } from '@cool-midway/core';
import { MidwayConfig } from '@midwayjs/core';
import { TenantSubscriber } from '../modules/base/db/tenant';

/**
 * 自动化测试 npm run test 读取的配置文件
 * 数据库由 test/global-setup.js 在每次测试运行前重建
 */
export default {
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '127.0.0.1',
        port: 3307,
        username: 'root',
        password: '123456',
        database: 'wudong_platform_test',
        // 测试库每次重建，允许自动建表
        synchronize: true,
        // 打印日志
        logging: false,
        // 字符集
        charset: 'utf8mb4',
        // 关闭查询缓存
        cache: false,
        // 实体路径
        entities: ['**/modules/*/entity'],
        // 订阅者
        subscribers: [TenantSubscriber],
      },
    },
  },
  cool: {
    // 测试环境关闭 eps
    eps: false,
    // 自动导入模块数据库
    initDB: true,
    // 判断是否初始化的方式
    initJudge: 'db',
    // 不导入菜单
    initMenu: false,
  } as CoolConfig,
} as MidwayConfig;
```

- [ ] **Step 3: 创建测试全局 setup（重建测试库）**

创建 `code/cool-admin-midway/test/global-setup.js`：

```js
const mysql = require('mysql2/promise');

/**
 * jest globalSetup：每次运行测试前重建测试库，保证用例可重复执行
 * 连接参数与 src/config/config.unittest.ts 保持一致
 */
module.exports = async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '123456',
  });
  await conn.query('DROP DATABASE IF EXISTS wudong_platform_test');
  await conn.query(
    'CREATE DATABASE wudong_platform_test DEFAULT CHARACTER SET utf8mb4'
  );
  await conn.end();
};
```

- [ ] **Step 4: 更新 jest.config.js**

将 `code/cool-admin-midway/jest.config.js` 整体替换为：

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/test/fixtures'],
  coveragePathIgnorePatterns: ['<rootDir>/test/'],
  globalSetup: '<rootDir>/test/global-setup.js',
  // 单 worker 串行执行，避免并发 synchronize 建表竞态
  maxWorkers: 1,
  // 应用启动 + 建表较慢，放宽单用例超时
  testTimeout: 120000,
};
```

- [ ] **Step 5: 创建测试工具 helper.ts**

创建 `code/cool-admin-midway/test/helper.ts`：

```ts
import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

export { close, createHttpRequest };

/** 启动完整应用（unittest 环境自动读取 src/config/config.unittest.ts） */
export async function boot() {
  return createApp(Framework);
}

/** 携带 C 端 token 的请求头（脚手架中间件直接读取裸 token，无 Bearer 前缀） */
export function auth(token: string) {
  return { Authorization: token };
}
```

- [ ] **Step 6: 写冒烟测试**

创建 `code/cool-admin-midway/test/smoke.test.ts`：

```ts
import { boot, close, createHttpRequest } from './helper';

describe('测试基建冒烟', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it('应用可启动，脚手架接口可访问（/app/user/login/captcha）', async () => {
    const res = await createHttpRequest(app).get(
      '/app/user/login/captcha?width=100&height=40'
    );
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1000);
  });
});
```

- [ ] **Step 7: 运行冒烟测试**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test
```

预期：`PASS test/smoke.test.ts`，1 passed。
若失败且属于"降级预案"描述的情形（createApp 无法启动 / 路由 404）：按 Task 1 顶部降级预案执行——删除 smoke.test.ts，后续任务改用 Service 级测试，然后直接进入 Step 8。

- [ ] **Step 8: 提交**

```bash
cd /c/Users/cja/wudong/code
git add cool-admin-midway/src/config/config.unittest.ts cool-admin-midway/test/global-setup.js cool-admin-midway/test/helper.ts cool-admin-midway/test/smoke.test.ts cool-admin-midway/jest.config.js
git commit -m "test(member): jest 集成测试基建与冒烟验证"
```

---

### Task 2: member 模块骨架与三张实体（自动建表）

**Files:**
- Create: `code/cool-admin-midway/src/modules/member/config.ts`
- Create: `code/cool-admin-midway/src/modules/member/entity/user.ts`
- Create: `code/cool-admin-midway/src/modules/member/entity/sms-code.ts`
- Create: `code/cool-admin-midway/src/modules/member/entity/favorite.ts`
- Test: `code/cool-admin-midway/test/member-entity.test.ts`

**Interfaces:**
- Consumes: `BaseEntity` 与 `transformerTime`（来自 `src/modules/base/entity/base.ts`，提供 id/createTime/updateTime/tenantId）。
- Produces（后续任务的依赖，导出名固定）:
  - `MemberUserEntity`（表 `member_user`）：`phone: string`、`password: string`、`nickname: string`、`avatar: string`、`gender: number`、`bio: string`、`status: number`（0 禁用/1 正常）、`lastLoginTime: Date`
  - `MemberSmsCodeEntity`（表 `member_sms_code`）：`phone: string`、`code: string`、`expireTime: Date`、`used: number`
  - `MemberFavoriteEntity`（表 `user_favorite`）：`userId: number`、`targetType: string`、`targetId: number`
  - 配置键 `module.member.sms.expireSeconds`（= 300）

- [ ] **Step 1: 写失败测试**

创建 `code/cool-admin-midway/test/member-entity.test.ts`：

```ts
import * as mysql from 'mysql2/promise';
import { boot, close } from './helper';

describe('member 实体自动建表', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it('member_user / member_sms_code / user_favorite 三张表存在', async () => {
    // 应用启动（synchronize: true）应自动创建三张表，用原生连接直接查 information_schema
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
         AND table_name IN ('member_user', 'member_sms_code', 'user_favorite')`
    );
    await conn.end();
    expect(Number(rows[0].c)).toBe(3);
  });
});
```

- [ ] **Step 2: 运行确认失败**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test -- member-entity
```

预期：`FAIL`，表数量为 0（`Received 0`）。应用本身能启动（member 模块目录尚不存在，不影响）。

- [ ] **Step 3: 创建模块配置**

创建 `code/cool-admin-midway/src/modules/member/config.ts`：

```ts
import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块配置
 */
export default () => {
  return {
    // 模块名称
    name: 'C端用户公共模块',
    // 模块描述
    description: 'member：注册/登录/JWT鉴权/模拟短信/收藏，行与社区模块共用',
    // 中间件，只对本模块有效
    middlewares: [],
    // 全局 /app/* 鉴权沿用 user 模块的 UserMiddleware，此处不重复注册
    globalMiddlewares: [],
    // 模块加载顺序，默认为0，值越大越优先加载
    order: 0,
    // 模拟短信
    sms: {
      // 验证码有效期，单位秒
      expireSeconds: 5 * 60,
    },
  } as ModuleConfig;
};
```

- [ ] **Step 4: 创建 member_user 实体**

创建 `code/cool-admin-midway/src/modules/member/entity/user.ts`：

```ts
import { BaseEntity, transformerTime } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * C端用户
 */
@Entity('member_user')
export class MemberUserEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '手机号', length: 11 })
  phone: string;

  @Column({ comment: '密码（bcrypt）', length: 100, nullable: true })
  password: string;

  @Column({ comment: '昵称', length: 50, nullable: true })
  nickname: string;

  @Column({ comment: '头像', length: 500, nullable: true })
  avatar: string;

  @Column({ comment: '性别', dict: ['未知', '男', '女'], default: 0 })
  gender: number;

  @Column({ comment: '个人简介', length: 200, nullable: true })
  bio: string;

  @Column({ comment: '状态', dict: ['禁用', '正常'], default: 1 })
  status: number;

  @Column({
    comment: '最后登录时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  lastLoginTime: Date;
}
```

- [ ] **Step 5: 创建 member_sms_code 实体**

创建 `code/cool-admin-midway/src/modules/member/entity/sms-code.ts`：

```ts
import { BaseEntity, transformerTime } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 模拟短信验证码
 */
@Entity('member_sms_code')
export class MemberSmsCodeEntity extends BaseEntity {
  @Index()
  @Column({ comment: '手机号', length: 11 })
  phone: string;

  @Column({ comment: '验证码', length: 10 })
  code: string;

  @Column({
    comment: '过期时间',
    type: 'varchar',
    transformer: transformerTime,
  })
  expireTime: Date;

  @Column({ comment: '是否已使用 0未使用 1已使用', default: 0 })
  used: number;
}
```

- [ ] **Step 6: 创建 user_favorite 实体**

创建 `code/cool-admin-midway/src/modules/member/entity/favorite.ts`：

```ts
import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 收藏（行/社区模块共用）
 */
@Entity('user_favorite')
@Index('uk_user_target', ['userId', 'targetType', 'targetId'], { unique: true })
export class MemberFavoriteEntity extends BaseEntity {
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({
    comment: '目标类型',
    dict: ['景区', '路线', '攻略', '游记'],
    length: 20,
  })
  targetType: string;

  @Column({ comment: '目标ID' })
  targetId: number;
}
```

- [ ] **Step 7: 运行测试确认通过**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test -- member-entity
```

预期：`PASS`（应用启动时 synchronize 自动建出三张表）。

- [ ] **Step 8: 提交**

```bash
cd /c/Users/cja/wudong/code
git add cool-admin-midway/src/modules/member/config.ts cool-admin-midway/src/modules/member/entity/user.ts cool-admin-midway/src/modules/member/entity/sms-code.ts cool-admin-midway/src/modules/member/entity/favorite.ts cool-admin-midway/test/member-entity.test.ts
git commit -m "feat(member): member 模块骨架与 member_user/member_sms_code/user_favorite 实体"
```

---

### Task 3: 模拟短信服务 MemberSmsService

**Files:**
- Create: `code/cool-admin-midway/src/modules/member/service/sms.ts`
- Test: `code/cool-admin-midway/test/member-sms.test.ts`

**Interfaces:**
- Consumes: `MemberSmsCodeEntity`（Task 2）、配置键 `module.member.sms.expireSeconds`（Task 2）。
- Produces（Task 4/5 依赖，签名固定）:
  - `MemberSmsService.checkPhone(phone: string): void` —— 格式非法时抛 `CoolCommException('手机号格式不正确')`
  - `MemberSmsService.sendCode(phone: string): Promise<{ code?: string }>` —— 作废旧码、发新码（6 位数字、300 秒过期）、`logger.warn` 输出；`local`/`unittest` 环境返回 `{ code }`，其余返回 `{}`
  - `MemberSmsService.verify(phone: string, code: string): Promise<boolean>` —— 最新未使用码比对（含过期判断），通过则置 `used=1`；失败抛 `CoolCommException('验证码错误或已过期')`

- [ ] **Step 1: 写失败测试**

创建 `code/cool-admin-midway/test/member-sms.test.ts`：

```ts
import * as mysql from 'mysql2/promise';
import { boot, close } from './helper';
import { MemberSmsService } from '../src/modules/member/service/sms';

describe('member 模拟短信服务', () => {
  let app;
  let svc: MemberSmsService;
  const phone = '13800138001';

  beforeAll(async () => {
    app = await boot();
    svc = await app.getApplicationContext().getAsync(MemberSmsService);
  });

  afterAll(async () => {
    await close(app);
  });

  it('手机号格式非法时抛异常', async () => {
    await expect(svc.sendCode('12345')).rejects.toThrow('手机号格式不正确');
  });

  it('发送后可验证，且验证码一次性', async () => {
    // unittest 环境响应回显验证码
    const { code } = await svc.sendCode(phone);
    expect(code).toBeTruthy();
    await expect(svc.verify(phone, code)).resolves.toBe(true);
    // 已使用，第二次验证失败
    await expect(svc.verify(phone, code)).rejects.toThrow('验证码错误或已过期');
  });

  it('错误验证码不通过', async () => {
    await svc.sendCode(phone);
    await expect(svc.verify(phone, '000000')).rejects.toThrow(
      '验证码错误或已过期'
    );
  });

  it('重复发送后旧验证码作废', async () => {
    const first = await svc.sendCode(phone);
    const second = await svc.sendCode(phone);
    await expect(svc.verify(phone, first.code)).rejects.toThrow(
      '验证码错误或已过期'
    );
    await expect(svc.verify(phone, second.code)).resolves.toBe(true);
  });

  it('过期验证码不通过', async () => {
    await svc.sendCode(phone);
    // 直接把该手机号未使用的验证码改为已过期
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3307,
      user: 'root',
      password: '123456',
      database: 'wudong_platform_test',
    });
    await conn.query(
      "UPDATE member_sms_code SET expireTime = '2000-01-01 00:00:00' WHERE phone = ? AND used = 0",
      [phone]
    );
    await conn.end();
    await expect(svc.verify(phone, '123456')).rejects.toThrow(
      '验证码错误或已过期'
    );
  });
});
```

- [ ] **Step 2: 运行确认失败**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test -- member-sms
```

预期：`FAIL`，编译错误 `Cannot find module '../src/modules/member/service/sms'`。

- [ ] **Step 3: 实现服务**

创建 `code/cool-admin-midway/src/modules/member/service/sms.ts`：

```ts
import { Config, Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { MemberSmsCodeEntity } from '../entity/sms-code';

/**
 * 模拟短信验证码（不接真实短信，验证码入库并输出到日志）
 */
@Provide()
export class MemberSmsService extends BaseService {
  @InjectEntityModel(MemberSmsCodeEntity)
  memberSmsCodeEntity: Repository<MemberSmsCodeEntity>;

  @Config('module.member.sms')
  smsConfig;

  @Inject()
  logger;

  /**
   * 手机号格式校验
   */
  checkPhone(phone: string) {
    if (!/^1[3-9]\d{9}$/.test(phone || '')) {
      throw new CoolCommException('手机号格式不正确');
    }
  }

  /**
   * 发送验证码（模拟）：旧验证码全部作废，新验证码入库 + 日志输出
   * local/unittest 环境返回验证码本身，便于演示与自动化测试
   */
  async sendCode(phone: string) {
    this.checkPhone(phone);
    // 作废旧验证码
    await this.memberSmsCodeEntity.update({ phone, used: 0 }, { used: 1 });
    // 随机6位验证码
    const code = String(Math.floor(100000 + Math.random() * 900000));
    await this.memberSmsCodeEntity.insert({
      phone,
      code,
      expireTime: moment()
        .add(this.smsConfig.expireSeconds, 'seconds')
        .toDate(),
    });
    this.logger.warn(`【模拟短信】向 ${phone} 发送验证码：${code}`);
    const env = process.env.NODE_ENV;
    if (env === 'local' || env === 'unittest') {
      return { code };
    }
    return {};
  }

  /**
   * 校验验证码：取该手机号最新一条未使用的比对，通过则置为已使用
   */
  async verify(phone: string, code: string) {
    this.checkPhone(phone);
    const sms = await this.memberSmsCodeEntity.findOne({
      where: { phone, used: 0 },
      order: { id: 'DESC' },
    });
    if (
      !sms ||
      sms.code !== String(code) ||
      moment(sms.expireTime).isBefore(moment())
    ) {
      throw new CoolCommException('验证码错误或已过期');
    }
    await this.memberSmsCodeEntity.update({ id: sms.id }, { used: 1 });
    return true;
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test -- member-sms
```

预期：`PASS`，5 passed。

- [ ] **Step 5: 提交**

```bash
cd /c/Users/cja/wudong/code
git add cool-admin-midway/src/modules/member/service/sms.ts cool-admin-midway/test/member-sms.test.ts
git commit -m "feat(member): 模拟短信验证码服务（入库+日志，local/unittest 回显）"
```

---

### Task 4: 注册与登录（bcrypt + JWT）

**Files:**
- Create: `code/cool-admin-midway/src/modules/member/service/login.ts`
- Create: `code/cool-admin-midway/src/modules/member/controller/app/login.ts`
- Modify: `code/cool-admin-midway/test/helper.ts`（追加 `registerAndLogin`）
- Modify: `code/cool-admin-midway/package.json`（追加 bcryptjs 依赖）
- Test: `code/cool-admin-midway/test/member-login.test.ts`

**Interfaces:**
- Consumes: `MemberSmsService`（Task 3：`checkPhone`/`sendCode`/`verify`）、`MemberUserEntity`（Task 2）、`module.user.jwt` 配置（脚手架既有：`{ expire, refreshExpire, secret }`）。
- Produces（Task 5 依赖）:
  - `checkPasswordRule(password: string): void` —— 从 `service/login.ts` 导出；不合规抛 `CoolCommException('密码须为8-20位，且同时包含字母和数字')`
  - `MemberLoginService`：`smsCode(phone)`、`register(phone, smsCode, password, nickname?)`、`password(phone, password)`、`sms(phone, smsCode)`、`refreshToken(refreshToken)`；`register` 返回 `{ userId, expire, token, refreshExpire, refreshToken }`，登录类返回 `{ userId, nickname, expire, token, refreshExpire, refreshToken }`
  - C 端接口（全部 `IGNORE_TOKEN` 免鉴权）：`POST /app/member/login/smsCode`、`/register`、`/sms`、`/password`、`/refreshToken`

- [ ] **Step 1: 安装 bcryptjs**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm i bcryptjs@2.4.3
npm i -D @types/bcryptjs@2.4.6
```

- [ ] **Step 2: 写失败测试**

创建 `code/cool-admin-midway/test/member-login.test.ts`：

```ts
import { boot, close, createHttpRequest } from './helper';

const phone = '13900139001';
const password = 'abc123456';

describe('member 注册/登录', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  /** 请求模拟短信并取回显验证码（unittest 环境专用） */
  async function getSmsCode(p: string) {
    const res = await createHttpRequest(app)
      .post('/app/member/login/smsCode')
      .send({ phone: p });
    expect(res.body.code).toBe(1000);
    return res.body.data.code as string;
  }

  it('未注册手机号不能验证码登录', async () => {
    const code = await getSmsCode('13900139099');
    const res = await createHttpRequest(app)
      .post('/app/member/login/sms')
      .send({ phone: '13900139099', smsCode: code });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('该手机号未注册');
  });

  it('注册成功即登录并返回token', async () => {
    const code = await getSmsCode(phone);
    const res = await createHttpRequest(app)
      .post('/app/member/login/register')
      .send({ phone, smsCode: code, password });
    expect(res.body.code).toBe(1000);
    expect(res.body.data.userId).toBeGreaterThan(0);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.refreshToken).toBeTruthy();
  });

  it('密码不符合规则被拒绝（过短/无字母/无数字/过长）', async () => {
    const p = '13900139002';
    const code = await getSmsCode(p);
    for (const bad of ['12345678', 'abcdefgh', 'abc123', 'abc123456789012345678']) {
      const res = await createHttpRequest(app)
        .post('/app/member/login/register')
        .send({ phone: p, smsCode: code, password: bad });
      expect(res.body.code).toBe(1001);
      expect(res.body.message).toBe('密码须为8-20位，且同时包含字母和数字');
    }
  });

  it('重复注册被拒绝', async () => {
    const code = await getSmsCode(phone);
    const res = await createHttpRequest(app)
      .post('/app/member/login/register')
      .send({ phone, smsCode: code, password });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('该手机号已注册，请直接登录');
  });

  it('错误验证码不能注册', async () => {
    const res = await createHttpRequest(app)
      .post('/app/member/login/register')
      .send({ phone: '13900139003', smsCode: '000000', password });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('验证码错误或已过期');
  });

  it('密码登录成功，昵称含默认"游客"', async () => {
    const res = await createHttpRequest(app)
      .post('/app/member/login/password')
      .send({ phone, password });
    expect(res.body.code).toBe(1000);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.nickname).toContain('游客');
  });

  it('密码错误被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/member/login/password')
      .send({ phone, password: 'wrong12345' });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('账号或密码错误');
  });

  it('验证码登录成功', async () => {
    const code = await getSmsCode(phone);
    const res = await createHttpRequest(app)
      .post('/app/member/login/sms')
      .send({ phone, smsCode: code });
    expect(res.body.code).toBe(1000);
    expect(res.body.data.token).toBeTruthy();
  });

  it('accessToken 不能当 refreshToken 使用', async () => {
    const login = await createHttpRequest(app)
      .post('/app/member/login/password')
      .send({ phone, password });
    const res = await createHttpRequest(app)
      .post('/app/member/login/refreshToken')
      .send({ refreshToken: login.body.data.token });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('刷新token失败，请检查refreshToken是否正确或过期');
  });

  it('refreshToken 可换取新token', async () => {
    const login = await createHttpRequest(app)
      .post('/app/member/login/password')
      .send({ phone, password });
    const res = await createHttpRequest(app)
      .post('/app/member/login/refreshToken')
      .send({ refreshToken: login.body.data.refreshToken });
    expect(res.body.code).toBe(1000);
    expect(res.body.data.token).toBeTruthy();
  });
});
```

同时向 `code/cool-admin-midway/test/helper.ts` 追加（文件末尾）：

```ts
/** 注册一个测试用户并返回 token（依赖 Task 4 的 /app/member/login/* 接口） */
export async function registerAndLogin(
  app,
  phone: string,
  password = 'abc123456'
) {
  const sms = await createHttpRequest(app)
    .post('/app/member/login/smsCode')
    .send({ phone });
  const register = await createHttpRequest(app)
    .post('/app/member/login/register')
    .send({ phone, smsCode: sms.body.data.code, password });
  expect(register.body.code).toBe(1000);
  return register.body.data.token as string;
}
```

- [ ] **Step 3: 运行确认失败**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test -- member-login
```

预期：`FAIL`——路由尚未注册，全部 HTTP 用例因 404 而断言失败（`res.body.code` 为 undefined）。

- [ ] **Step 4: 实现登录服务**

创建 `code/cool-admin-midway/src/modules/member/service/login.ts`：

```ts
import { Config, Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { MemberUserEntity } from '../entity/user';
import { MemberSmsService } from './sms';

/**
 * C端用户密码规则：8-20位，且同时包含字母和数字（规格 §5.1）
 */
export function checkPasswordRule(password: string) {
  if (!/^(?=.*[A-Za-z])(?=.*\d)[\s\S]{8,20}$/.test(password || '')) {
    throw new CoolCommException('密码须为8-20位，且同时包含字母和数字');
  }
}

/**
 * 注册/登录（JWT 配置复用 user 模块，由全局 UserMiddleware 校验）
 */
@Provide()
export class MemberLoginService extends BaseService {
  @InjectEntityModel(MemberUserEntity)
  memberUserEntity: Repository<MemberUserEntity>;

  @Inject()
  memberSmsService: MemberSmsService;

  @Config('module.user.jwt')
  jwtConfig;

  /**
   * 发送验证码（模拟）
   */
  async smsCode(phone: string) {
    return this.memberSmsService.sendCode(phone);
  }

  /**
   * 注册（手机号+验证码+密码），成功即登录
   */
  async register(
    phone: string,
    smsCode: string,
    password: string,
    nickname?: string
  ) {
    this.memberSmsService.checkPhone(phone);
    checkPasswordRule(password);
    const exist = await this.memberUserEntity.findOneBy({
      phone: Equal(phone),
    });
    if (exist) {
      throw new CoolCommException('该手机号已注册，请直接登录');
    }
    await this.memberSmsService.verify(phone, smsCode);
    const result = await this.memberUserEntity.insert({
      phone,
      password: bcrypt.hashSync(password, 10),
      nickname: nickname || `游客${phone.slice(-4)}`,
      status: 1,
      lastLoginTime: new Date(),
    });
    const userId = result.identifiers[0].id;
    return { userId, ...(await this.token({ id: userId })) };
  }

  /**
   * 密码登录
   */
  async password(phone: string, password: string) {
    const user = await this.memberUserEntity.findOneBy({
      phone: Equal(phone),
    });
    if (!user || !bcrypt.compareSync(password || '', user.password || '')) {
      throw new CoolCommException('账号或密码错误');
    }
    if (user.status !== 1) {
      throw new CoolCommException('账号已被禁用');
    }
    return this.loginSuccess(user);
  }

  /**
   * 验证码登录
   */
  async sms(phone: string, smsCode: string) {
    await this.memberSmsService.verify(phone, smsCode);
    const user = await this.memberUserEntity.findOneBy({
      phone: Equal(phone),
    });
    if (!user) {
      throw new CoolCommException('该手机号未注册');
    }
    if (user.status !== 1) {
      throw new CoolCommException('账号已被禁用');
    }
    return this.loginSuccess(user);
  }

  /**
   * 刷新token
   */
  async refreshToken(refreshToken: string) {
    let userId;
    try {
      const info = jwt.verify(refreshToken, this.jwtConfig.secret);
      if (!info['isRefresh']) {
        throw new Error('token类型非refreshToken');
      }
      userId = info['id'];
    } catch (e) {
      throw new CoolCommException(
        '刷新token失败，请检查refreshToken是否正确或过期'
      );
    }
    const user = await this.memberUserEntity.findOneBy({ id: Equal(userId) });
    if (!user || user.status !== 1) {
      throw new CoolCommException(
        '刷新token失败，请检查refreshToken是否正确或过期'
      );
    }
    return this.token({ id: user.id });
  }

  /**
   * 登录成功：更新最后登录时间并签发token
   */
  async loginSuccess(user: MemberUserEntity) {
    await this.memberUserEntity.update(
      { id: user.id },
      { lastLoginTime: new Date() }
    );
    return {
      userId: user.id,
      nickname: user.nickname,
      ...(await this.token({ id: user.id })),
    };
  }

  /**
   * 签发 token
   */
  async token(info) {
    const { expire, refreshExpire } = this.jwtConfig;
    return {
      expire,
      token: await this.generateToken(info, false),
      refreshExpire,
      refreshToken: await this.generateToken(info, true),
    };
  }

  /**
   * 生成token（isRefresh=true 的为刷新token，不能直接用于鉴权）
   */
  async generateToken(info, isRefresh = false) {
    const { expire, refreshExpire, secret } = this.jwtConfig;
    return jwt.sign({ isRefresh, ...info }, secret, {
      expiresIn: isRefresh ? refreshExpire : expire,
    });
  }
}
```

- [ ] **Step 5: 实现登录控制器**

创建 `code/cool-admin-midway/src/modules/member/controller/app/login.ts`：

```ts
import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
  CoolTag,
} from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { MemberLoginService } from '../../service/login';

/**
 * C端登录/注册
 */
@CoolUrlTag()
@CoolController()
export class AppMemberLoginController extends BaseController {
  @Inject()
  memberLoginService: MemberLoginService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/smsCode', { summary: '发送验证码（模拟短信）' })
  async smsCode(@Body('phone') phone: string) {
    return this.ok(await this.memberLoginService.smsCode(phone));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/register', { summary: '注册（手机号+验证码+密码）' })
  async register(
    @Body('phone') phone: string,
    @Body('smsCode') smsCode: string,
    @Body('password') password: string,
    @Body('nickname') nickname: string
  ) {
    return this.ok(
      await this.memberLoginService.register(phone, smsCode, password, nickname)
    );
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/sms', { summary: '验证码登录' })
  async sms(@Body('phone') phone: string, @Body('smsCode') smsCode: string) {
    return this.ok(await this.memberLoginService.sms(phone, smsCode));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/password', { summary: '密码登录' })
  async password(
    @Body('phone') phone: string,
    @Body('password') password: string
  ) {
    return this.ok(await this.memberLoginService.password(phone, password));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/refreshToken', { summary: '刷新token' })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.ok(await this.memberLoginService.refreshToken(refreshToken));
  }
}
```

- [ ] **Step 6: 运行测试确认通过**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test -- member-login
```

预期：`PASS`，10 passed。

- [ ] **Step 7: 全量回归（确认未破坏既有测试）**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test
```

预期：smoke、member-entity、member-sms、member-login 全部 PASS。

- [ ] **Step 8: 提交**

```bash
cd /c/Users/cja/wudong/code
git add cool-admin-midway/src/modules/member/service/login.ts cool-admin-midway/src/modules/member/controller/app/login.ts cool-admin-midway/test/helper.ts cool-admin-midway/test/member-login.test.ts cool-admin-midway/package.json cool-admin-midway/package-lock.json
git commit -m "feat(member): 注册/密码登录/验证码登录/refreshToken（bcrypt + 复用 user 模块 JWT）"
```

---

### Task 5: 个人资料服务与接口

**Files:**
- Create: `code/cool-admin-midway/src/modules/member/service/info.ts`
- Create: `code/cool-admin-midway/src/modules/member/controller/app/info.ts`
- Test: `code/cool-admin-midway/test/member-info.test.ts`

**Interfaces:**
- Consumes: `MemberSmsService.verify`（Task 3）、`checkPasswordRule`（Task 4，从 `../service/login` 导入）、`registerAndLogin`（Task 4 加入 helper）、`MemberUserEntity`（Task 2）、`ctx.user.id`（全局 UserMiddleware 解析 token 后注入）。
- Produces（Task 6 及后续 Phase 依赖）:
  - `MemberInfoService.person(userId)` —— 返回用户信息（已删除 `password` 字段）；用户不存在抛 `CoolCommException('用户不存在')`
  - `MemberInfoService.updatePerson(userId, param)` —— 仅白名单 `['nickname', 'avatar', 'gender', 'bio']`；白名单为空抛 `CoolCommException('无可更新的字段')`
  - `MemberInfoService.updatePassword(userId, password, smsCode)` —— 验证码 + 密码规则校验后 bcrypt 重置
  - C 端接口（**需登录**）：`GET /app/member/info/person`、`POST /app/member/info/updatePerson`、`POST /app/member/info/updatePassword`

- [ ] **Step 1: 写失败测试**

创建 `code/cool-admin-midway/test/member-info.test.ts`：

```ts
import { auth, boot, close, createHttpRequest, registerAndLogin } from './helper';

const phone = '13700137001';
const password = 'abc123456';

describe('member 个人资料', () => {
  let app;
  let token: string;

  beforeAll(async () => {
    app = await boot();
    token = await registerAndLogin(app, phone, password);
  });

  afterAll(async () => {
    await close(app);
  });

  it('未登录访问受保护接口被拦截（生产真值：200 + 1001 登录失效，非 HTTP 401）', async () => {
    const res = await createHttpRequest(app).get('/app/member/info/person');
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('person 返回资料且不含密码字段', async () => {
    const res = await createHttpRequest(app)
      .get('/app/member/info/person')
      .set(auth(token));
    expect(res.body.code).toBe(1000);
    expect(res.body.data.phone).toBe(phone);
    expect(res.body.data.password).toBeUndefined();
    expect(res.body.data.nickname).toContain('游客');
  });

  it('updatePerson 只更新白名单字段', async () => {
    const res = await createHttpRequest(app)
      .post('/app/member/info/updatePerson')
      .set(auth(token))
      .send({
        nickname: '苗岭阿妹',
        bio: '喜欢徒步',
        gender: 2,
        phone: '19999999999',
        status: 0,
      });
    expect(res.body.code).toBe(1000);
    const person = await createHttpRequest(app)
      .get('/app/member/info/person')
      .set(auth(token));
    expect(person.body.data.nickname).toBe('苗岭阿妹');
    expect(person.body.data.bio).toBe('喜欢徒步');
    expect(person.body.data.gender).toBe(2);
    // 白名单外的字段不被篡改
    expect(person.body.data.phone).toBe(phone);
    expect(person.body.data.status).toBe(1);
  });

  it('验证码重置密码后新密码可登录、旧密码失效', async () => {
    const sms = await createHttpRequest(app)
      .post('/app/member/login/smsCode')
      .send({ phone });
    const res = await createHttpRequest(app)
      .post('/app/member/info/updatePassword')
      .set(auth(token))
      .send({ password: 'xyz987654', smsCode: sms.body.data.code });
    expect(res.body.code).toBe(1000);

    const newLogin = await createHttpRequest(app)
      .post('/app/member/login/password')
      .send({ phone, password: 'xyz987654' });
    expect(newLogin.body.code).toBe(1000);

    const oldLogin = await createHttpRequest(app)
      .post('/app/member/login/password')
      .send({ phone, password });
    expect(oldLogin.body.code).toBe(1001);
  });
});
```

- [ ] **Step 2: 运行确认失败**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test -- member-info
```

预期：`FAIL`——路由尚未注册，全部用例因 404 而断言失败（含"未登录访问被拦截"用例，此时返回的是 404）。

- [ ] **Step 3: 实现资料服务**

创建 `code/cool-admin-midway/src/modules/member/service/info.ts`：

```ts
import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import * as _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import { MemberUserEntity } from '../entity/user';
import { MemberSmsService } from './sms';
import { checkPasswordRule } from './login';

/**
 * C端用户资料
 */
@Provide()
export class MemberInfoService extends BaseService {
  @InjectEntityModel(MemberUserEntity)
  memberUserEntity: Repository<MemberUserEntity>;

  @Inject()
  memberSmsService: MemberSmsService;

  /**
   * 获取用户信息（不含密码）
   */
  async person(userId: number) {
    const info = await this.memberUserEntity.findOneBy({
      id: Equal(userId),
    });
    if (!info) {
      throw new CoolCommException('用户不存在');
    }
    delete info.password;
    return info;
  }

  /**
   * 更新资料（仅允许昵称/头像/性别/简介）
   */
  async updatePerson(userId: number, param) {
    const data = _.pick(param || {}, ['nickname', 'avatar', 'gender', 'bio']);
    if (_.isEmpty(data)) {
      throw new CoolCommException('无可更新的字段');
    }
    await this.memberUserEntity.update({ id: Equal(userId) }, data);
    return true;
  }

  /**
   * 通过短信验证码重置密码
   */
  async updatePassword(userId: number, password: string, smsCode: string) {
    checkPasswordRule(password);
    const user = await this.memberUserEntity.findOneBy({
      id: Equal(userId),
    });
    if (!user) {
      throw new CoolCommException('用户不存在');
    }
    await this.memberSmsService.verify(user.phone, smsCode);
    await this.memberUserEntity.update(
      { id: userId },
      { password: bcrypt.hashSync(password, 10) }
    );
    return true;
  }
}
```

- [ ] **Step 4: 实现资料控制器**

创建 `code/cool-admin-midway/src/modules/member/controller/app/info.ts`：

```ts
import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post } from '@midwayjs/core';
import { MemberInfoService } from '../../service/info';

/**
 * C端用户资料（需登录，无 IGNORE_TOKEN 标签即走 JWT 校验）
 */
@CoolController()
export class AppMemberInfoController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  memberInfoService: MemberInfoService;

  @Get('/person', { summary: '获取当前用户信息' })
  async person() {
    return this.ok(await this.memberInfoService.person(this.ctx.user.id));
  }

  @Post('/updatePerson', { summary: '更新资料' })
  async updatePerson(@Body() body) {
    return this.ok(
      await this.memberInfoService.updatePerson(this.ctx.user.id, body)
    );
  }

  @Post('/updatePassword', { summary: '验证码重置密码' })
  async updatePassword(
    @Body('password') password: string,
    @Body('smsCode') smsCode: string
  ) {
    return this.ok(
      await this.memberInfoService.updatePassword(
        this.ctx.user.id,
        password,
        smsCode
      )
    );
  }
}
```

- [ ] **Step 5: 运行测试确认通过**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test -- member-info
```

预期：`PASS`，4 passed。

- [ ] **Step 6: 提交**

```bash
cd /c/Users/cja/wudong/code
git add cool-admin-midway/src/modules/member/service/info.ts cool-admin-midway/src/modules/member/controller/app/info.ts cool-admin-midway/test/member-info.test.ts
git commit -m "feat(member): 个人资料查询/白名单更新/验证码重置密码"
```

---

### Task 6: 收藏服务与接口（user_favorite，跨模块复用）

**Files:**
- Create: `code/cool-admin-midway/src/modules/member/service/favorite.ts`
- Create: `code/cool-admin-midway/src/modules/member/controller/app/favorite.ts`
- Test: `code/cool-admin-midway/test/member-favorite.test.ts`

**Interfaces:**
- Consumes: `MemberFavoriteEntity`（Task 2）、`registerAndLogin`（Task 4 加入 helper）。
- Produces（Phase 2/3 travel、community 模块依赖）:
  - `FAVORITE_TYPES = ['scenic', 'route', 'guide', 'post']`（从 `service/favorite.ts` 导出）
  - `MemberFavoriteService.toggle(userId, targetType, targetId): Promise<{ favorited: boolean }>` —— 幂等切换；类型非法抛 `CoolCommException('收藏类型不正确')`
  - `MemberFavoriteService.check(userId, targetType, targetId): Promise<boolean>`
  - `MemberFavoriteService.page(userId, targetType?, page?, size?): Promise<{ list, total }>` —— 按 `targetType` 可选过滤，`id` 倒序
  - C 端接口（**需登录**）：`POST /app/member/favorite/toggle`、`GET /app/member/favorite/check`、`GET /app/member/favorite/page`

- [ ] **Step 1: 写失败测试**

创建 `code/cool-admin-midway/test/member-favorite.test.ts`：

```ts
import {
  auth,
  boot,
  close,
  createHttpRequest,
  registerAndLogin,
} from './helper';

const phoneA = '13600136001';
const phoneB = '13600136002';

describe('member 收藏', () => {
  let app;
  let tokenA: string;
  let tokenB: string;

  beforeAll(async () => {
    app = await boot();
    tokenA = await registerAndLogin(app, phoneA);
    tokenB = await registerAndLogin(app, phoneB);
  });

  afterAll(async () => {
    await close(app);
  });

  it('未登录访问被拦截（生产真值：200 + 1001 登录失效，非 HTTP 401）', async () => {
    const res = await createHttpRequest(app).get(
      '/app/member/favorite/page?page=1&size=10'
    );
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('toggle 收藏与取消（幂等切换）', async () => {
    const on = await createHttpRequest(app)
      .post('/app/member/favorite/toggle')
      .set(auth(tokenA))
      .send({ targetType: 'route', targetId: 101 });
    expect(on.body.code).toBe(1000);
    expect(on.body.data.favorited).toBe(true);

    const off = await createHttpRequest(app)
      .post('/app/member/favorite/toggle')
      .set(auth(tokenA))
      .send({ targetType: 'route', targetId: 101 });
    expect(off.body.code).toBe(1000);
    expect(off.body.data.favorited).toBe(false);

    const again = await createHttpRequest(app)
      .post('/app/member/favorite/toggle')
      .set(auth(tokenA))
      .send({ targetType: 'route', targetId: 101 });
    expect(again.body.data.favorited).toBe(true);
  });

  it('check 反映收藏状态', async () => {
    await createHttpRequest(app)
      .post('/app/member/favorite/toggle')
      .set(auth(tokenA))
      .send({ targetType: 'scenic', targetId: 202 });
    const yes = await createHttpRequest(app)
      .get('/app/member/favorite/check?targetType=scenic&targetId=202')
      .set(auth(tokenA));
    expect(yes.body.data).toBe(true);
    const no = await createHttpRequest(app)
      .get('/app/member/favorite/check?targetType=scenic&targetId=203')
      .set(auth(tokenA));
    expect(no.body.data).toBe(false);
  });

  it('非法 targetType 被拒绝', async () => {
    const res = await createHttpRequest(app)
      .post('/app/member/favorite/toggle')
      .set(auth(tokenA))
      .send({ targetType: 'hotel', targetId: 1 });
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('收藏类型不正确');
  });

  it('page 分页返回且用户间隔离，支持类型筛选', async () => {
    // A 收藏 3 条（route x2, post x1）
    const items = [
      { targetType: 'route', targetId: 301 },
      { targetType: 'route', targetId: 302 },
      { targetType: 'post', targetId: 303 },
    ];
    for (const it of items) {
      await createHttpRequest(app)
        .post('/app/member/favorite/toggle')
        .set(auth(tokenA))
        .send(it);
    }
    // B 收藏 1 条，验证隔离
    await createHttpRequest(app)
      .post('/app/member/favorite/toggle')
      .set(auth(tokenB))
      .send({ targetType: 'route', targetId: 301 });

    const all = await createHttpRequest(app)
      .get('/app/member/favorite/page?page=1&size=10')
      .set(auth(tokenA));
    expect(all.body.code).toBe(1000);
    // A 此前已收藏 route:101（toggle 用例末态）与 scenic:202（check 用例），再加 3 条 = 5
    expect(all.body.data.total).toBe(5);
    expect(all.body.data.list.length).toBe(5);

    const routes = await createHttpRequest(app)
      .get('/app/member/favorite/page?page=1&size=10&targetType=route')
      .set(auth(tokenA));
    expect(routes.body.data.total).toBe(3); // 101、301、302
    expect(
      routes.body.data.list.every((it: any) => it.targetType === 'route')
    ).toBe(true);

    const mineB = await createHttpRequest(app)
      .get('/app/member/favorite/page?page=1&size=10')
      .set(auth(tokenB));
    expect(mineB.body.data.total).toBe(1); // B 只能看到自己的
  });
});
```

- [ ] **Step 2: 运行确认失败**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test -- member-favorite
```

预期：`FAIL`——路由尚未注册，全部用例因 404 而断言失败（含"未登录访问被拦截"用例，此时返回的是 404）。

- [ ] **Step 3: 实现收藏服务**

创建 `code/cool-admin-midway/src/modules/member/service/favorite.ts`：

```ts
import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { MemberFavoriteEntity } from '../entity/favorite';

/** 收藏目标类型（行/社区模块共用，规格 §5.5） */
export const FAVORITE_TYPES = ['scenic', 'route', 'guide', 'post'];

/**
 * 收藏
 */
@Provide()
export class MemberFavoriteService extends BaseService {
  @InjectEntityModel(MemberFavoriteEntity)
  memberFavoriteEntity: Repository<MemberFavoriteEntity>;

  /**
   * 收藏/取消收藏（幂等切换）
   */
  async toggle(userId: number, targetType: string, targetId: number) {
    if (!FAVORITE_TYPES.includes(targetType)) {
      throw new CoolCommException('收藏类型不正确');
    }
    const exist = await this.memberFavoriteEntity.findOneBy({
      userId: Equal(userId),
      targetType,
      targetId,
    });
    if (exist) {
      await this.memberFavoriteEntity.delete({ id: exist.id });
      return { favorited: false };
    }
    await this.memberFavoriteEntity.insert({ userId, targetType, targetId });
    return { favorited: true };
  }

  /**
   * 是否已收藏
   */
  async check(userId: number, targetType: string, targetId: number) {
    const exist = await this.memberFavoriteEntity.findOneBy({
      userId: Equal(userId),
      targetType,
      targetId,
    });
    return !!exist;
  }

  /**
   * 我的收藏（分页，可按类型筛选）
   */
  async page(userId: number, targetType?: string, page = 1, size = 10) {
    const qb = this.memberFavoriteEntity
      .createQueryBuilder('a')
      .where('a.userId = :userId', { userId })
      .orderBy('a.id', 'DESC');
    if (targetType) {
      qb.andWhere('a.targetType = :targetType', { targetType });
    }
    const pageNo = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(size) || 10, 1);
    qb.skip((pageNo - 1) * pageSize).take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total };
  }
}
```

- [ ] **Step 4: 实现收藏控制器**

创建 `code/cool-admin-midway/src/modules/member/controller/app/favorite.ts`：

```ts
import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { MemberFavoriteService } from '../../service/favorite';

/**
 * 收藏（需登录）
 */
@CoolController()
export class AppMemberFavoriteController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  memberFavoriteService: MemberFavoriteService;

  @Post('/toggle', { summary: '收藏/取消收藏' })
  async toggle(
    @Body('targetType') targetType: string,
    @Body('targetId') targetId: number
  ) {
    return this.ok(
      await this.memberFavoriteService.toggle(
        this.ctx.user.id,
        targetType,
        targetId
      )
    );
  }

  @Get('/check', { summary: '是否已收藏' })
  async check(
    @Query('targetType') targetType: string,
    @Query('targetId') targetId: number
  ) {
    return this.ok(
      await this.memberFavoriteService.check(
        this.ctx.user.id,
        targetType,
        targetId
      )
    );
  }

  @Get('/page', { summary: '我的收藏' })
  async page(
    @Query('targetType') targetType: string,
    @Query('page') page: number,
    @Query('size') size: number
  ) {
    return this.ok(
      await this.memberFavoriteService.page(
        this.ctx.user.id,
        targetType,
        page,
        size
      )
    );
  }
}
```

- [ ] **Step 5: 运行测试确认通过**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test -- member-favorite
```

预期：`PASS`，5 passed。

- [ ] **Step 6: 提交**

```bash
cd /c/Users/cja/wudong/code
git add cool-admin-midway/src/modules/member/service/favorite.ts cool-admin-midway/src/modules/member/controller/app/favorite.ts cool-admin-midway/test/member-favorite.test.ts
git commit -m "feat(member): 收藏 toggle/check/page（user_favorite 跨模块复用）"
```

---

### Task 7: 管理端用户 CRUD（/admin/member/user）

**Files:**
- Create: `code/cool-admin-midway/src/modules/member/controller/admin/user.ts`
- Test: `code/cool-admin-midway/test/member-admin.test.ts`

**Interfaces:**
- Consumes: `MemberUserEntity`（Task 2）、`@CoolController` 自动 CRUD（脚手架框架能力，参考 `src/modules/user/controller/admin/info.ts`）。
- Produces（Phase 4 管理后台页面依赖）: 管理端接口（走 admin JWT 鉴权）——`GET /admin/member/user/page`、`GET /admin/member/user/list`、`GET /admin/member/user/info`、`POST /admin/member/user/update`、`POST /admin/member/user/delete`；支持 `status`/`gender` 精确过滤与 `nickname`/`phone` 关键字模糊搜索。不提供 `add`（C 端用户由注册产生）。

- [ ] **Step 1: 写失败测试**

创建 `code/cool-admin-midway/test/member-admin.test.ts`：

```ts
import { boot, close, createHttpRequest } from './helper';

describe('member 管理端', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it('无 admin token 访问返回401（路由已注册且受 admin 鉴权保护）', async () => {
    const res = await createHttpRequest(app).get(
      '/admin/member/user/page?page=1&size=10'
    );
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 2: 运行确认失败**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test -- member-admin
```

预期：`FAIL`——路由未注册，返回 404 而非 401。

- [ ] **Step 3: 实现管理端控制器**

创建 `code/cool-admin-midway/src/modules/member/controller/admin/user.ts`：

```ts
import { CoolController, BaseController } from '@cool-midway/core';
import { MemberUserEntity } from '../../entity/user';

/**
 * C端用户管理
 */
@CoolController({
  api: ['page', 'list', 'info', 'update', 'delete'],
  entity: MemberUserEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.gender'],
    keyWordLikeFields: ['a.nickname', 'a.phone'],
  },
})
export class AdminMemberUserController extends BaseController {}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test -- member-admin
```

预期：`PASS`，1 passed。

- [ ] **Step 5: 提交**

```bash
cd /c/Users/cja/wudong/code
git add cool-admin-midway/src/modules/member/controller/admin/user.ts cool-admin-midway/test/member-admin.test.ts
git commit -m "feat(member): 管理端用户 CRUD（page/list/info/update/delete）"
```

---

### Task 8: 全量回归 + lint + dev 服务器手动验收

**Files:**
- Modify: `code/cool-admin-midway/test/README.md`（记录集成测试方案）

**Interfaces:**
- Consumes: 前序全部任务的接口与测试。
- Produces: 绿色的全量测试、通过 lint 的代码、可手动执行的开发服务器验收清单、更新后的测试说明文档。

- [ ] **Step 1: 全量测试回归**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run test
```

预期：7 个测试文件（smoke、member-entity、member-sms、member-login、member-info、member-favorite、member-admin）全部 PASS。若有失败：修复后重跑，不得跳过。

- [ ] **Step 2: lint**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run lint
```

预期：无错误（mwts check）。若有格式问题：`npm run lint:fix` 后复查，并把被 fix 的文件一并提交。

- [ ] **Step 3: 更新 test/README.md**

将 `code/cool-admin-midway/test/README.md` 整体替换为：

```markdown
# 测试方式

脚手架默认注释称 cool-admin 与 jest 不兼容、推荐 Apifox 手工测试。
本项目已启用 **jest + @midwayjs/mock 集成测试**（`createApp` 启动完整应用，
与 dev 脚本 `mwtsc --run @midwayjs/mock/app.js` 同源），冒烟验证见 `test/smoke.test.ts`。

## 运行

```bash
# 前提：本地 MySQL 8 运行于 127.0.0.1:3307（docker wudong-mysql，root/123456）
npm run test
```

- `NODE_ENV=unittest`：读取 `src/config/config.unittest.ts`，连接测试库 `wudong_platform_test`
- `test/global-setup.js`：每次运行前 DROP/CREATE 测试库，用例可重复执行
- `jest.config.js` 设 `maxWorkers: 1` 串行执行，避免并发 synchronize 建表竞态
- 测试专用：`member_sms_code` 模拟短信在 unittest 环境回显验证码（`data.code`），供用例直接取用

## 约定

- 成功响应 `body.code === 1000`；业务异常 `body.code === 1001`
- 未登录访问受保护 `/app/*` 接口 → HTTP 200 + `{code:1001, message:'登录失效~'}`（异常过滤器归一化；`/admin/*` 为 HTTP 401）
- C 端 token 放在 `Authorization` 请求头（无 Bearer 前缀）
```

- [ ] **Step 4: dev 服务器手动验收（swagger）**

```bash
cd /c/Users/cja/wudong/code/cool-admin-midway
npm run dev
```

等待启动完成（控制台输出监听端口，默认从 8001 起取第一个空闲端口；以下命令假设 8001，实际以日志为准，新开一个终端执行）：

```bash
# 1. 发送模拟短信 → 响应 data.code 为 6 位验证码，控制台同时输出【模拟短信】日志
curl -X POST http://127.0.0.1:8001/app/member/login/smsCode -H "Content-Type: application/json" -d '{"phone":"13811112222"}'

# 2. 注册（把 <code> 换成上一步返回的验证码）→ 返回 userId/token/refreshToken
curl -X POST http://127.0.0.1:8001/app/member/login/register -H "Content-Type: application/json" -d '{"phone":"13811112222","smsCode":"<code>","password":"abc123456"}'

# 3. 密码登录
curl -X POST http://127.0.0.1:8001/app/member/login/password -H "Content-Type: application/json" -d '{"phone":"13811112222","password":"abc123456"}'

# 4. 未带 token 访问受保护接口 → 200 + {"code":1001,"message":"登录失效~"}（拦截生效，生产真值非 401）
curl -i http://127.0.0.1:8001/app/member/info/person

# 5. 带 token 访问（<token> 换成第 3 步返回值）→ 返回资料且无 password 字段
curl http://127.0.0.1:8001/app/member/info/person -H "Authorization: <token>"

# 6. 收藏切换
curl -X POST http://127.0.0.1:8001/app/member/favorite/toggle -H "Content-Type: application/json" -H "Authorization: <token>" -d '{"targetType":"scenic","targetId":1}'

# 7. 未带 admin token 访问管理端 → HTTP 401
curl -i "http://127.0.0.1:8001/admin/member/user/page?page=1&size=10"
```

预期：每条命令结果与注释一致。浏览器打开 `http://127.0.0.1:8001/swagger-ui/index.html` 确认 member 分组接口可见。验收完成后 Ctrl+C 停掉 dev 服务器。

- [ ] **Step 5: 提交**

```bash
cd /c/Users/cja/wudong/code
git add cool-admin-midway/test/README.md
git commit -m "test(member): 全量回归通过并更新测试说明文档"
```

---

## 非目标（明确不做）

- `order`/`order_ticket` 订单表与支付（spec §5.4 归属 travel 模块范围，Phase 2 后续任务）
- `travel`、`community` 业务模块，`wudong-web` C 端工程，cool-admin-vue 管理页面（Phase 1/3/4）
- 真实短信、微信登录（member 模块不引入；脚手架 user 模块的微信能力保持原样不动）
- 用户注销（logoff）、头像上传转存（依赖上传插件，后续按需加）
- 验证码发送频控（模拟短信场景，YAGNI；表结构已支持按手机号查询历史）

## 验收对照（spec → 本计划落点）

| spec 要求 | 落点 |
|---|---|
| §5.1 member_user 表 | Task 2 实体 + Task 2 测试（自动建表） |
| §5.1 member_sms_code 表（模拟短信） | Task 2 实体 + Task 3 服务/测试 |
| §5.1 注册：手机号+验证码 | Task 4 `POST /app/member/login/register` |
| §5.1 密码规则 8-20 位含字母数字 | Task 4 `checkPasswordRule` + 测试 4 组反例 |
| §5.1 登录：密码或验证码，签发 JWT | Task 4 `/password`、`/sms`、`/refreshToken` |
| §4 C 端 JWT 鉴权（/app/*） | 复用全局 UserMiddleware；Task 5/6 未登录拦截测试 + Task 1 金丝雀 |
| §5.5 user_favorite（跨两模块复用，唯一约束） | Task 2 实体（uk_user_target）+ Task 6 服务/测试 |
| §6 admin 侧用户管理接口 | Task 7 `/admin/member/user/*` |
