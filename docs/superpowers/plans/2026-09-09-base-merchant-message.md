# base T2：商家中心（merchant）+ 消息中心（message）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 落地 base 设计 §5.2/§5.6——`message` 模块（system_message + MessageService）与 `merchant` 模块（merchant + merchant_application + 入驻/审核/身份服务），完成 D1 决策的 `member_user.role` 扩展与 pay 支付成功通知集成点。

**Architecture:** 两个 cool-admin 模块。C 端 `/app/merchant/*`、`/app/message/*` 走全局 UserMiddleware JWT；管理端 `/admin/merchant/*`、`/admin/message/*` 走 admin 鉴权。`merchant` 单向依赖 `member`（role 回写）与 `message`（审核通知）；`pay` 补一行 `MessageService.send` 通知（T1 预留集成点）。

**Tech Stack:** 同 T1（Midway 3.x + TypeORM + Jest 集成测试，零新增依赖）

**Spec:** `docs/superpowers/specs/2026-09-09-platform-base-design.md` §5.2/§5.6/§8-D1/§9.3

## Global Constraints

- 沿用 T1 全部约束（表名 verbatim、camelCase、无物理外键、`pageList` 命名、显式 `prefix`、响应断言常量、`mwts` 格式）。
- **分支**：本会话顺序执行，`feature/base-merchant` 从 `feature/base-order` 切出（并行会话执行 T2 时才从 `feature/member` 切，且跳过 Task 5 的 pay 集成）。
- **枚举口径**：merchant.module ∈ `product|food|accommodation|travel`；merchant.status 1正常 0禁用；application.status 1待审核 2已通过 3已驳回；member_user.role 1游客 2商家；message.type ∈ `order|system|activity|interact`。
- **商家账号规则**：`username = 'm' + userId`（每用户一家店铺，重复入驻走更新）。
- **全员消息**：`system_message.userId = NULL` 表示全员广播，查询 `userId IS NULL OR userId = me`，不逐条复制。
- **测试手机号段**：member role `13900139xxx`、message `13300133xxx`、merchant `13200132xxx`、pay×message 集成 `13100131xxx`。

---

### Task 1: 分支 + member_user.role 扩展（D1）

**Files:**
- Modify: `cool-admin-midway/src/modules/member/entity/user.ts`（加 `role` 列）
- Test: `cool-admin-midway/test/base-member-role.test.ts`

**Interfaces:**
- Produces: `MemberUserEntity.role: number`（1游客 2商家，默认 1）——Task 4 审核回写依赖。

- [ ] **Step 1: 失败测试**——注册后 `GET /app/member/info/person` 断言 `data.role === 1`（当前无 role 字段 → undefined 失败）
- [ ] **Step 2: 实体加列**

```ts
@Column({ comment: '角色 1游客 2商家', dict: ['游客', '商家'], default: 1 })
role: number;
```

- [ ] **Step 3: 测试通过**（synchronize 自动补列）→ **Step 4: 提交** `feat(base): member_user 增加 role 字段（D1，商家审核回写用）`

---

### Task 2: message 模块（system_message + MessageService + 接口）

**Files:**
- Create: `src/modules/message/config.ts`、`entity/system-message.ts`、`service/message.ts`
- Create: `controller/app/message.ts`、`controller/admin/message.ts`
- Test: `test/base-message.test.ts`

**Interfaces:**
- Produces（Task 4/5 依赖，签名固定）:
  - `MessageService.send(userId: number | null, type, title, content, link?): Promise<boolean>` —— userId=null 全员；type 白名单校验；link 可选 `{ linkType, linkValue }`
  - `MessageService.pageList(userId, type?, page?, size?): Promise<{ list, total }>` —— `userId IS NULL OR userId = me`，id 倒序
  - `MessageService.unreadCount(userId): Promise<number>`
  - `MessageService.markRead(userId, ids: number[]): Promise<boolean>` —— 仅能标记自己的
- C 端（需登录）：`GET /app/message/page`、`GET /app/message/unreadCount`、`POST /app/message/read`（body `{ ids }`）
- 管理端：`/admin/message` page/list/info/add/update/delete（add 时 userId 不填即全员）

**实体**：`system_message`：userId（nullable）、type、title(200)、content(text)、linkType(20, nullable)、linkValue(500, nullable)、isRead（0/1，default 0）

- [ ] **Step 1: 失败测试**（`13300133001` 注册；svc.send 定向+全员各一条 → pageList total 2、type 过滤、unreadCount 2、markRead 后 0；他人 token 标记不改我的；`/admin/message/page` 401）
- [ ] **Step 2: 实现**（参照 T1 模式：`@CoolController({ prefix: '/app/message' })`）
- [ ] **Step 3: 通过** → **Step 4: 提交** `feat(base): 消息中心 system_message 与 MessageService（全员广播/未读数/已读）`

---

### Task 3: merchant 实体 + 入驻申请链路

**Files:**
- Create: `src/modules/merchant/config.ts`、`entity/merchant.ts`、`entity/merchant-application.ts`
- Create: `service/merchant.ts`、`controller/app/merchant.ts`
- Test: `test/base-merchant.test.ts`

**Interfaces:**
- Produces（Task 4 依赖）:
  - `MerchantService.apply(userId, param): Promise<boolean>` —— 必填校验（shopName/module/contactName/contactPhone/idCard/idCardFront/idCardBack/businessLicense）；已是商家抛 `您已是商家`；有待审申请抛 `已存在待审核的入驻申请`；驳回后可重新申请
  - `MerchantService.my(userId): Promise<merchant | null>`
  - `MerchantService.latestApplication(userId): Promise<application | null>`
- C 端（需登录）：`POST /app/merchant/apply`、`GET /app/merchant/my`、`GET /app/merchant/application`

**实体**（schema.sql verbatim → camelCase）：
- `merchant`：userId、username(unique)、shopName(100)、module(20)、contactName(50)、contactPhone(11)、idCard(18, nullable)、businessLicense(500, nullable)、status（1正常 0禁用，default 1）、joinedAt（transformerTime, nullable）
- `merchant_application`：userId、shopName、module、contactName、contactPhone、idCard、idCardFront(500)、idCardBack(500)、businessLicense(500)、otherMaterials(json, nullable)、status（1待审核 2已通过 3已驳回，default 1）、auditResult(500, nullable)、auditBy(nullable)、auditTime（transformerTime, nullable）

- [ ] **Step 1: 失败测试**（`13200132001`：两表存在；缺字段被拒；apply 成功；重复申请被拒；`my`/`application` 返回申请中状态）
- [ ] **Step 2: 实现**
- [ ] **Step 3: 通过** → **Step 4: 提交** `feat(base): 商家入驻申请（merchant/merchant_application 实体与 C 端申请链路）`

---

### Task 4: 入驻审核 + 商家管理端 + 通知/回写

**Files:**
- Modify: `src/modules/merchant/service/merchant.ts`（追加 `audit`/`isMerchant`）
- Create: `controller/admin/merchant.ts`、`controller/admin/application.ts`
- Modify: `test/base-merchant.test.ts`（追加审核用例）

**Interfaces:**
- Produces:
  - `MerchantService.audit(applicationId, pass, auditResult, adminId): Promise<boolean>` —— 非待审抛 `该申请已审核`；通过 → 按 userId upsert merchant（username=`m${userId}`，joinedAt=now）+ 回写 `member_user.role=2` + `messageService.send(userId,'system','入驻审核通过',...)`；驳回 → status=3 + 未通过通知
  - `MerchantService.isMerchant(userId): Promise<merchant | null>` —— 各业务模块数据权限过滤入口
- 管理端：`/admin/merchant`（CRUD，fieldEq status/module，keyWordLike shopName/contactPhone/username）；`/admin/merchant/application`（page/list/info + 自定义 `POST /audit`，body `{ id, pass, auditResult }`，adminId 取 admin 侧 `ctx.admin.id`？——unittest 无 admin 会话，审核用例走 service 层直调，admin 路由仅验 401）

**测试追加**（同一用户贯穿）：svc.audit 通过 → `my` 返回店铺且 status=1、`person` 接口 `role===2`、message page 有"入驻审核通过"；重复 audit 抛已审核；驳回分支：新用户申请 → audit(false,'材料不全') → application status=3 + 收到未通过通知 → 可重新申请；`isMerchant` 通过用户 true/新用户 null；两个 admin 路由 401。

- [ ] **Step 1: 失败测试** → **Step 2: 实现** → **Step 3: 通过** → **Step 4: 提交** `feat(base): 商家入驻审核（回写 member role + 站内通知）与管理端`

---

### Task 5: pay 支付成功通知集成 + 全量收尾

**Files:**
- Modify: `src/modules/pay/service/pay.ts`（mockPay 追加 send）
- Create: `test/base-pay-message.test.ts`

**集成**：`mockPay` 在 `markPaid` 之后：

```ts
await this.messageService.send(
  order.userId,
  'order',
  '支付成功',
  `订单 ${order.orderNo} 支付成功`
);
```

**测试**（`13100131001`）：下单→支付→mockPay → `/app/message/page` 出现 type=order 的"支付成功"；随后全量回归 + `npx mwts check src/modules/member src/modules/message src/modules/merchant src/modules/pay` + dev 手动验收（申请入驻→管理审核走 service 演示或 swagger 检查 6 条新路由存在→支付后收到订单消息）→ push。

- [ ] **Step 1: 失败测试** → **Step 2: 实现** → **Step 3: 全量回归 + lint** → **Step 4: dev 验收** → **Step 5: 提交并推送** `feat(base): 支付成功站内通知（pay×message 集成）`

---

## 非目标

- 商家端独立的商品/订单管理界面（业务模块 B3 各自实现，用 `isMerchant` 做数据权限）
- 消息推送渠道（站内信 only；短信/微信通知后续按需）
- 全员消息的已读状态按用户记录（本期已读即全局已读，读模型简单化；需求文档未细化）
- 申请材料 OSS 转存（上传走脚手架 /upload，URL 直存）

## 验收对照（base 设计 §5.2/§5.6 → 本计划落点）

| 设计要求 | 落点 |
|---|---|
| merchant + merchant_application 表 | Task 3 实体 |
| `apply`/`my`/`latestApplication` + C 端三接口 | Task 3 |
| `audit`（upsert merchant + role 回写 + 通知）/`isMerchant` + 管理端 | Task 4 |
| system_message + `send`/`pageList`/`unreadCount`/`markRead` + 接口 | Task 2 |
| member_user.role（D1） | Task 1 |
| pay 集成点（§5.4 通知） | Task 5 |
