# 平台公共底座（base 层）完整设计

**日期**：2026-09-09
**依据**：`docs/docs/组员开发文档-完整版.md`（6 模块 + 7 公共服务）、`docs/database/schema.sql`（47 表）、`docs/docs/数据库设计文档.md`、`docs/docs/API接口设计文档.md`（约 134 接口）
**范围**：**全部 6 个小组共用**的公共模块层；各业务模块（衣/食/住/行/社区）只做自己的业务表与控制器
**状态**：已评审通过（2026-09-09，§8 决策全按推荐锁定；§9 并行实施方案）

---

## 1. 背景与问题

当前仓库只按 `2026-09-09-travel-community-design.md` 落地了**行+社区两个业务模块的范围**（member 已完成，travel/community 待开发）。但需求文档是 6 模块平台：

| 组 | 模块 | 主要功能 |
|---|---|---|
| 1 | 衣-非遗商品 | 商品分类、SKU、购物车、订单、评价 |
| 2 | 食-餐饮美食 | 餐厅展示、餐位预订、农产品销售 |
| 3 | 住-住宿预订 | 民宿管理、房型房态、在线预订 |
| 4 | 行-线路订票 | 门票销售、路线套餐、电子票核销 |
| 5 | 社区-照片分享 | 游记发布、评论互动、话题关注 |
| 6 | 平台管理后台 | 用户管理、数据统计、内容审核、财务结算 |

需求文档明确：**各模块互不重叠，通过公共服务通信**。公共服务 7 项：用户认证、统一订单、统一支付、购物车、文件上传、消息通知、搜索。若不先把公共底座设计好，各组会各自造用户/订单/消息轮子，后期无法合并。

## 2. 现状盘点：需求公共层 vs 仓库现状

| 需求公共层（schema.sql） | 现状 | 归宿 |
|---|---|---|
| `user`（含 role 1游客/2商家/3管理员） | ✅ `member_user`（缺 role、lastLoginIp） | member 模块，小幅扩展 |
| `user_address` 收货地址 | ✅ 脚手架 user 模块自带（entity/address.ts + /app/user/address） | 直接用，不重建 |
| `order` 统一订单主表 | ❌（现 spec 把 order 划给 travel） | **新建 order 模块** |
| `order_product` / `order_reservation` / `order_ticket` 三明细 | ❌ | order 模块 |
| `payment_record` 支付记录 | ❌ | **新建 pay 模块**（模拟支付，D4 已定） |
| `cart` 购物车 | ❌ | **新建 cart 模块** |
| `favorite`（target_type：product/restaurant/hotel/scenic/post） | ✅ `user_favorite`（白名单仅 scenic/route/guide/post） | member 模块，白名单取并集 |
| `system_message` 消息中心 | ❌（spec 的 community_message 是社区互动消息，另一回事） | **新建 message 模块** |
| `merchant` + `merchant_application` | ❌ | **新建 merchant 模块** |
| `banner` + `announcement` 运营位 | ❌（spec 的 travel_recommend_slot 是 travel 私有推荐位，不冲突） | **新建 operate 模块** |
| `finance_record` 财务结算 | ❌ | operate 模块（表先建，结算逻辑 Phase 4） |
| `sensitive_word` 敏感词 | ❌（spec 划给 community） | **新建 sensitive 模块**（公共化，见决策 D3） |
| `admin_user`/`role`/`permission`/`operation_log` | ✅ cool-admin base 自带（sys_user/sys_role/sys_menu/sys_log） | 零开发 |
| 用户认证服务 | ✅ member（注册/登录/JWT/模拟短信） | 已完成 |
| 文件上传服务 | ✅ 脚手架自带（/upload 静态目录 + base 上传接口） | 直接用 |
| 搜索服务 | ❌ | 各业务模块 DB LIKE 检索起步（spec 社区已定 DB 检索），不建公共搜索模块（YAGNI） |

## 3. 既定偏差（沿用 travel-community spec §4，全平台一致）

1. **字段命名 camelCase**（脚手架无 snake_case 策略）：`created_at→createTime`、`user_id→userId`、`target_type→targetType`…语义与需求文档一致
2. **URL 前缀**：需求文档 `/api/*` → 实际 `/app/<module>/*`（C 端，member JWT）与 `/admin/<module>/*`（管理端，admin JWT）
3. **不建物理外键**（schema.sql 有 FOREIGN KEY，按脚手架惯例只做逻辑关联 + 索引）
4. **表由 `synchronize: true` 自动创建**，不手写迁移；表名沿用需求文档（verbatim）
5. 时间字段统一 BaseEntity 的 createTime/updateTime + `transformerTime`
6. **不许修改 base/user/member 模块**（member 只允许本设计列出的扩展点）

## 4. 模块划分总图

```
cool-admin-midway/src/modules/
├── base/        cool-admin 自带 RBAC/日志/参数（admin_user/role/permission/operation_log）✅
├── user/        cool-admin 自带 C 端示例（微信登录 + user_address 收货地址）✅ 保持原样
├── member/      ✅ 已完成：C端用户 member_user/member_sms_code/user_favorite + 认证/资料/收藏
│                  扩展点：role 字段、收藏白名单并集（见 §5.1）
├── merchant/    【新】商家中心：merchant、merchant_application + 入驻/审核/身份服务
├── order/       【新】统一订单：order + order_product/order_reservation/order_ticket + OrderService
├── pay/         【新】统一支付（模拟）：payment_record + PayService
├── cart/        【新】购物车：cart + CartService
├── message/     【新】消息中心：system_message + MessageService
├── operate/     【新】平台运营：banner、announcement、finance_record
├── sensitive/   【新】敏感词：sensitive_word + DFA 过滤服务
├── travel/      行模块（第4组，spec §5.2，order 部分按 §7 修订）
└── community/   社区模块（第5组，spec §5.3）
```

## 5. 各模块详细设计

### 5.1 member（已有，两处扩展）

- **扩展 1**：`member_user` 加 `role TINYINT DEFAULT 1`（1游客 2商家；管理员归 admin 侧 sys_user，两套体系不混）。商家入驻审核通过后由 merchant 模块回写 `role=2`。（对应需求文档 user.role，见决策 D1）
- **扩展 2**：`FAVORITE_TYPES` 取需求文档与现 spec 的并集：`['product', 'restaurant', 'hotel', 'scenic', 'route', 'guide', 'post']`（一行改动，向后兼容）
- 其余保持不变；`last_login_ip` 列暂不加（决策 D6）

### 5.2 merchant（商家中心）

**表**（schema.sql verbatim → camelCase）：

- `merchant`：userId、username（唯一）、shopName、module（product/food/accommodation/travel）、contactName、contactPhone、idCard、businessLicense、status（1正常 0禁用）、joinedAt
- `merchant_application`：userId、shopName、module、contactName、contactPhone、idCard、idCardFront、idCardBack、businessLicense、otherMaterials（JSON）、status（1待审核 2已通过 3已驳回）、auditResult、auditBy、auditTime

**服务**：`MerchantService`
- `apply(userId, param)` —— 提交入驻申请（校验重复申请、member_user 存在）
- `audit(applicationId, pass, auditResult, adminId)` —— 审核；通过 → 建 merchant 记录 + 回写 member_user.role=2 + system_message 通知
- `isMerchant(userId): Promise<merchant | null>` —— 各业务模块做数据权限过滤（"管理自家商品"）用

**接口**：
- C 端（需登录）：`POST /app/merchant/apply`、`GET /app/merchant/my`（我的店铺）、`GET /app/merchant/application`（申请进度）
- 管理端：`/admin/merchant/*`（page/list/info/update/delete）、`/admin/merchant/application/*`（page/info/audit）

### 5.3 order（统一订单）

**表**：`order` 主表 + 三张明细表（schema.sql verbatim → camelCase）

- `order`：orderNo（唯一）、userId、orderType（1商品 2餐位 3住宿 4门票 5路线）、module（product/food/accommodation/travel）、totalAmount、payAmount、discountAmount、status（1待支付 2已支付 3已完成 4已取消 5已退款）、payTime、completeTime、cancelTime、remark
- `order_product`（衣）：orderId、productId、skuId、productName、skuName、productImage、price、quantity、totalAmount、addressId、expressCompany、expressNo、shipTime、receiveTime
- `order_reservation`（食/住）：orderId、reservationType（1餐位 2住宿）、targetId、targetName、checkInDate、checkOutDate、guestName、guestPhone、guestCount、idCard、timeSlot、roomTypeId、specialRequest、checkInCode
- `order_ticket`（行）：orderId、ticketType（1门票 2路线套餐）、targetId、targetName、ticketName、useDate、quantity、price、totalAmount、visitorInfo（JSON）

**服务**：`OrderService`
- `create(userId, { module, orderType, items, remark }): Promise<{ orderNo, payAmount }>` —— 事务内建主单 + 按 module 落对应明细；**金额由服务端按业务模块回调价计算，不信任前端**
- `getByNo(userId, orderNo)`、`page(userId, status?, page, size)`、`cancel(userId, orderNo)`（仅待支付可取消）
- `markPaid(orderNo, payNo)` —— 供 pay 模块回调：置已支付 + payTime
- `markRefunded(orderNo)` —— 供业务模块退票/退款流程调用
- 库存/房态/票档的校验与扣减**由各业务模块在下单前自行完成**（order 模块不反查业务表，保持单向依赖）

**接口**：
- C 端（需登录）：`POST /app/order/create`、`GET /app/order/page`、`GET /app/order/detail?orderNo=`、`POST /app/order/cancel`
- 管理端：`/admin/order/*`（page/list/info + 发货 update，第6组/各组共用）

### 5.4 pay（统一支付，模拟）

**表**：`payment_record`：orderId、paymentNo（唯一）、payChannel（wechat/alipay，模拟）、payAmount、payStatus（1待支付 2已支付 3已退款）、transactionId、payTime、refundTime、refundAmount、callbackData（JSON）

**服务**：`PayService`
- `create(userId, orderNo, channel): Promise<{ paymentNo }>` —— 校验订单归属与待支付状态
- `mockPay(paymentNo)` —— **模拟支付成功**：流水置已支付 → 调 `OrderService.markPaid` → 发 system_message（type=order）；后续接真实微信支付只改此方法内部
- `refund(paymentNo, amount)` —— 流水置已退款 + refundTime

**接口**（需登录）：`POST /app/pay/create`、`POST /app/pay/mock`、`GET /app/pay/record?orderNo=`
> spec §5.4 的 `POST /app/travel/pay/mock` 由本模块统一承担（修订见 §7）

### 5.5 cart（购物车）

**表**：`cart`：userId、productId、skuId、quantity、checked（1/0）；唯一约束 `(userId, skuId)`

**接口**（需登录）：`POST /app/cart/add`、`POST /app/cart/update`（数量/勾选）、`POST /app/cart/delete`、`GET /app/cart/list`
> 说明：cart 表结构绑 product/sku（衣模块专用），公共归口仅为统一"购物车服务"名分；食/住/行为直接预订型，不走购物车（与需求文档一致）

### 5.6 message（消息中心）

**表**：`system_message`：userId（NULL=全员消息）、type（order/system/activity/interact）、title、content、linkType、linkValue、isRead

**服务**：`MessageService`
- `send(userId | null, type, title, content, link?)` —— null 为全员广播（全员消息不逐条复制，查询时 `userId IS NULL OR userId = me`）
- `page(userId, type?, page, size)`、`unreadCount(userId)`、`markRead(userId, ids)`

**接口**：C 端（需登录）`GET /app/message/page`、`GET /app/message/unreadCount`、`POST /app/message/read`；管理端 `/admin/message/*`（第6组群发）
> 社区的 community_message（like/comment/follow 互动）仍归 community 模块，不并入（spec §5.3 不变）

### 5.7 operate（平台运营，第6组）

**表**：
- `banner`：title、image、linkType（page/url/none）、linkValue、position（home/product/food…）、sort、startTime、endTime、status
- `announcement`：title、content、type（1系统 2活动）、startTime、endTime、isTop、status、createdBy
- `finance_record`：orderId、merchantId、orderAmount、commissionRate、commissionAmount、merchantIncome、settlementStatus（1待结算 2已结算）、settlementTime、settlementBatch（表本期只建不用，结算逻辑 Phase 4）

**接口**：C 端（匿名浏览，IGNORE_TOKEN）`GET /app/operate/banner?position=`、`GET /app/operate/announcement`；管理端 `/admin/operate/*` 三表标准 CRUD

### 5.8 sensitive（敏感词，DFA）

**表**：`sensitive_word`：word、status（1启用 0禁用）

**服务**：`SensitiveService.check(text): { hit: boolean, words: string[] }`（DFA；命中→调用方置"待人工复审"，与 spec §5.3 机审流程一致）
**接口**：仅管理端 `/admin/sensitive/word/*` CRUD；C 端无接口（服务被 community/商品评价内嵌调用）

## 6. 各组复用矩阵（谁的模块用什么）

| 组 | 业务模块 | 复用的 base 能力 |
|---|---|---|
| 1 衣 | product/category/sku/review/inheritor | member（认证/收藏 product）、merchant（商家身份）、**order（order_product）**、**pay**、**cart**、message、sensitive（评价）、脚手架 address（收货地址） |
| 2 食 | restaurant/dish/time_slot/farm_product* | member、merchant、**order（order_reservation）**、**pay**、message |
| 3 住 | hotel/room_type/room_calendar | member、merchant、**order（order_reservation）**、**pay**、message |
| 4 行 | spec §5.2 九表 | member、merchant（可选）、**order（order_ticket，替代 spec §5.4 私有 order）**、**pay（替代 /app/travel/pay/mock）**、message、favorite |
| 5 社区 | spec §5.3 十表 | member、favorite（post）、message（community_message 自留）、**sensitive** |
| 6 平台 | 管理页面 + 统计 | base RBAC、merchant 审核、operate、finance、/admin/order、/admin/message |

## 7. 对已有 spec 的修订点（`2026-09-09-travel-community-design.md`）

| 位置 | 原文 | 修订 |
|---|---|---|
| §5.4 | `order`/`order_ticket` 归 travel 模块 | order 主表与三明细归**公共 order 模块**；travel 只保留 `travel_inventory`/`travel_e_ticket` 等，下单走 `OrderService.create(module='travel')` |
| §5.4 | `POST /app/travel/pay/mock` | 改由 **pay 模块** `POST /app/pay/mock` 统一承担；travel 退票规则（24h/10%）仍在 travel 模块实现，调用 `OrderService.markRefunded` |
| §5.5 | user_favorite target_type 四类 | 白名单扩为七类并集（product/restaurant/hotel/scenic/route/guide/post） |
| §5.3 | sensitive_word 表在 community | 表与服务移至公共 **sensitive 模块**，community 引用（表名不变） |
| §5.1 | member_user 无 role | 加 `role` 列（见决策 D1） |

## 8. 已确认的设计决策（2026-09-09 评审通过，全按推荐）

| # | 决策 | 结论 |
|---|---|---|
| D1 | member_user 加 role 字段？ | **加**（1游客 2商家，商家审核通过回写；管理员归 admin 侧 sys_user） |
| D2 | order 三明细放公共 order 模块？ | **是**（金额计算、状态机只写一遍，业务模块单向依赖 order） |
| D3 | sensitive 公共化还是留在 community？ | **公共化**（商品评价/商家入驻同样需要过滤） |
| D4 | cart 独立模块还是并入 order？ | **独立模块**（对应需求文档独立公共服务） |
| D5 | base 谁开发？ | **第4组（cja）继续做**，其他组业务模块在 order/pay 合入后启动 |
| D6 | member_user 补 lastLoginIp / birthday / region？ | **本期不加**（synchronize 支持随时补列） |

## 9. 并行实施方案

### 9.1 依赖关系（谁依赖谁）

```
member 扩展（role 列 + FAVORITE_TYPES 并集）──┐
message（MessageService 契约冻结）──────────┼──→ merchant（回写 role、审核通知）
member ──────────────────────────────────┼──→ order（OrderService 契约冻结）──→ pay（调 markPaid/markRefunded + 通知）
（无依赖）cart / operate / sensitive ────────┘
```

- 运行时硬依赖只有两条：`merchant → member.role`、`pay → order.markPaid`；对 message 的通知调用可按冻结契约先行（`send(userId|null, type, title, content, link?)`）
- 所有模块**零新增 npm 依赖**（typeorm/moment 已有），无 package.json 冲突点

### 9.2 三条并行轨道

| 轨道 | 模块 | 说明 |
|---|---|---|
| **T1 交易线** | order → pay | 先 order 后 pay（pay 的集成测试需要 order 在场）；order 可先行的部分：实体+CRUD+C端下单/取消 |
| **T2 商家线** | merchant + message | message 先行半天（简单），merchant 的通知直接落真实现 |
| **T3 独立线** | cart + operate + sensitive + member 扩展 | 四个小件互相独立，可穿插或最后收尾 |

- 轨道间**无交叉文件**：各模块只写自己的 `src/modules/<x>/` + 自己的 `test/<x>-*.test.ts`；模块目录即边界，git 冲突面≈0
- 会话/人力分配建议：T1 一个会话，T2 一个会话，T3 穿插在任何一轨收尾后做（约 1 天量）

### 9.3 并行开发纪律（避免合并互踩）

1. 分支从 `feature/member`（或 PR #5 合入后的 main）切出，一轨一分支：`feature/base-order`、`feature/base-merchant` 等
2. 测试手机号段按模块划分（order 用 135xxx、merchant 用 134xxx…），避免撞号
3. 服务契约以本文档 §5 签名为准，改契约必须先改文档再动代码
4. 合入顺序 = 依赖顺序：T1 的 order 先合 → pay 合；T2/T3 任意顺序
5. **控制器 URL 用显式 `prefix`**（如 `@CoolController({ prefix: '/app/order' })`）：文件名与模块目录同名时，cool-admin 会按文件路径推导出重复前缀（/app/order/order），实际路由以显式 prefix 为准，但 swagger 会多出一条派生的幽灵路径（仅文档展示问题，真实请求 404）；此外 `BaseController` 自带无参 `page()/list()` 等内置方法，控制器自定义方法不可与其重名（方法名用 `pageList`，路由仍可写 `/page`）

### 9.4 实施阶段

| 阶段 | 内容 | 前置 |
|---|---|---|
| B0 ✅ | member 模块（认证/资料/收藏/管理端） | 已完成（PR #5） |
| B1 | **T1+T2 并行：order+pay ∥ merchant+message** —— 交易底座，合入后各组业务模块开工 | B0 |
| B2 | **T3：cart + operate + sensitive + member 扩展**（与 B1 并行亦可） | 无硬前置 |
| B3 | travel（第4组）/ community（第5组）业务模块 | B1 合入 |
| Phase 4 | cool-admin-vue 管理页（含第6组统计/财务/审核页） | B1+B2 |

## 10. 非目标

- 真实微信支付/短信（pay.mock 与 member 模拟短信已留切换点）
- 公共搜索服务（ES 等；各组 DB LIKE 起步，需求文档未强制）
- 微信小程序端（需求文档三端中的小程序端未立项，当前只有 wudong-web PC C 端）
- 财务结算的定时任务与对账逻辑（表先建，逻辑 Phase 4）
- member 与脚手架 user 模块的合并（两者并存：user 模块提供微信登录与收货地址，member 提供 C 端主认证；合并需评审另议）
