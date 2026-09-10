# 乌东文旅 B 端商家端（商户入驻 + 自管住房商品）设计文档

| 项目 | 内容 |
|---|---|
| 文档版本 | V1.0（草案，待评审） |
| 编制日期 | 2026-09-10 |
| 负责模块 | 第 3 组 住宿 accommodation（商家自管接口）+ 第 6 组 平台管理后台（商家端界面承载） |
| 上游文档 | 《2026-09-09-platform-base-design.md》（merchant/member 契约，已合入 main）；《2026-09-09-accommodation-operate-design.md》§8 后置对接矩阵（D3 商家数据权限回填点）；《2026-09-09-wudong-web-visitor-design.md》（同工程基线） |
| 交付形态 | 后端：accommodation 模块新增**商家 app 接口**（带 merchantId 数据权限）；前端：wudong-web 新增 `/merchant/*` 商家区 + 登录态 |
| 分支 | `feature/wudong-merchant`，自 `origin/feature/wudong-web`（bee95ed，已含 base 全量）切出 |

---

## 1. 背景与目标

平台底座（base）已合入 main：`merchant`（入驻申请/审核/`isMerchant`）、`member`（用户/登录/`role`）、`order`、`pay`、`message`、`cart`、`sensitive` 均有代码。当初 accommodation spec §8 把「商家数据权限」列为**依赖位**（D3：`hotel.merchantId` 本期仅为归属标识，等 merchant base 落地后回填），现在前置条件已满足，可以回填。

同时 accommodation 目前只有两条入口：平台管理端 CRUD（`/admin/accommodation/*`）和 C 端只读（`/app/accommodation/*`）。**商家无法管理自家住房商品**——这是本次要补的缺口。

目标：让住宿类商家能自助入驻、并在 C 端站点内管理自家的民宿/房型/房态，形成 B 端商品闭环。

## 2. 范围

**本期做（商家端闭环）：**

- **入驻**：商家入驻申请（表单 + 材料上传）、申请进度查看（待审/驳回+意见+重新申请）、我的店铺
- **商品自管**（全部限定「自家」）：
  - 民宿：列表、新增、编辑（含上下架）、删除
  - 房型：某民宿下的列表、新增、编辑、删除
  - 房态日历：区间查询、批量设置价格/房态
- **登录态**：登录/注册（手机号+验证码/密码）、token 持久化、路由守卫、登录失效处理

**不做（本期）：**

- 商家订单/预订查看、财务结算（order 无商家维度接口，属跨模块改动，见 §10）
- 房态与下单联动（占态/扣减）——C 端预订仍是占位，无住宿下单链路（见 §10）
- 游客个人中心/收藏/我的订单（登录页只服务商家路径）
- 平台管理端页面（`/admin/accommodation/*`）的改动 —— **完全不动**
- C 端只读接口（`/app/accommodation/hotel/*`、`/app/accommodation/room-type/calendar`）的改动 —— **完全不动**
- 商家账号体系本身（登录、role、审核流）—— base 已交付，只消费不修改

## 3. 前置事实（已核实）

| 事实 | 出处 |
|---|---|
| `POST /app/merchant/apply`、`GET /app/merchant/my`、`GET /app/merchant/application` 已交付 | `merchant/controller/app/merchant.ts` |
| `merchant.module` 白名单：`['product','food','accommodation','travel']` | `merchant/service/merchant.ts` `MERCHANT_MODULES` |
| 审核通过 → 建/启用 merchant 记录 + 回写 `member_user.role=2` + 站内通知 | `MerchantService.audit` |
| `isMerchant(userId)` 返回启用状态的商家记录（数据权限挂接点） | `MerchantService.isMerchant` |
| 登录/注册：`/app/member/login/{smsCode,register,sms,password,refreshToken}`；资料：`/app/member/info/person` | `member/controller/app/*` |
| 文件上传：`POST /app/base/comm/upload`（需登录） | `base/controller/app/comm.ts` |
| `/app/*` 未登录：中间件置 `ctx.status = 401` 并抛 `CoolCommException('登录失效~')`；**实测响应为 HTTP 200 + `{"code":1001,"message":"登录失效~"}`**（错误过滤器覆盖了 status） | `user/middleware/app.ts:56-59` + `curl` 实测 |
| 业务异常（`CoolCommException`）在 app 侧经全局错误处理返回 `code 1001` | 既有 C 端/管理端行为 |
| order 不反查业务表、不占房态 | `order/service/order.ts` 类注释 |

**关键推论**：`登录失效~` 与业务异常的 `code` 都是 1001，前端**不能靠 code 区分**鉴权失败与业务错误，必须结合 message 前缀判定（见 §5.1）。

## 4. 后端设计

### 4.1 新增文件

| 文件 | 作用 |
|---|---|
| `src/modules/accommodation/controller/app/merchant.ts` | 商家自管接口（显式 prefix `/app/accommodation/merchant`） |
| `src/modules/accommodation/service/merchant-scope.ts` | 商家身份解析 + 资源归属校验（单点权限） |

不改动任何既有文件（含 config.ts、既有 service/entity/controller）。

### 4.2 接口清单

全部为 POST（除标注），入参 JSON body；前缀 `/app/accommodation/merchant`。

| 路由 | 作用 | 权限校验 |
|---|---|---|
| `/hotel/page` | 我的民宿分页（keyword/status 过滤） | 强制 `merchantId = self` |
| `/hotel/info`（GET） | 我的民宿详情（编辑页回填） | 归属校验 |
| `/hotel/add` | 新增民宿 | 归属 + `merchant.module === 'accommodation'` |
| `/hotel/update` | 编辑自家民宿（含上下架 `status`） | 归属校验；`merchantId` 不可改 |
| `/hotel/delete` | 删除自家民宿 | 归属校验；**其下有房型则拒绝** |
| `/room-type/page` | 某民宿的房型列表（按 `hotelId`） | `hotelId → hotel.merchantId === self` |
| `/room-type/add` | 新增房型 | 同上 |
| `/room-type/update` | 编辑房型 | `roomType.hotelId → 归属` |
| `/room-type/delete` | 删除房型 | 同上；**级联删该房型的房态记录** |
| `/calendar/batch` | 批量设置价格/房态（复用 `RoomCalendarService.batch`） | `roomTypeId → 归属` |
| `/calendar/range`（GET） | 房态区间查询（复用 `RoomCalendarService.range`） | 同上 |

> **命名坑**：控制器继承 `BaseController`，其自带无参 `page()/list()/info()/add()/update()/delete()` 内置方法，自定义方法**不得与其重名**（否则 TS2416）。故方法名采用 `hotelPage/hotelAdd/...` 形式，路由用装饰器显式指定。

### 4.3 权限规则（`merchant-scope.ts`）

```
resolve(userId) → { merchantId, module }
  1. merchantService.isMerchant(userId) 为空 → CoolCommException('仅商家可访问')
  2. 返回商家的 id 与 module

assertHotelOwned(hotelId, merchantId) → HotelEntity
  hotel 不存在 或 hotel.merchantId !== merchantId → CoolCommException('无权操作该资源')

assertRoomTypeOwned(roomTypeId, merchantId) → RoomTypeEntity
  roomType 不存在 → CoolCommException('房型不存在')
  roomType.hotelId → hotel.merchantId !== merchantId → CoolCommException('无权操作该资源')
```

规则明细：

| 编号 | 规则 |
|---|---|
| P1 | 所有商家接口需登录（app 全局 JWT）；未登录走既有 `登录失效~` 契约 |
| P2 | 商家记录不存在或 `status !== 1` → `仅商家可访问` |
| P3 | 资源不属于自己 → `无权操作该资源`（**与「不存在」同文案，不泄露资源是否存在**） |
| P4 | 新增民宿要求 `merchant.module === 'accommodation'`，否则 `您的入驻模块非住宿，无法新增民宿`；其它模块商家可代管平台挂给它的店，但不能自己开民宿 |
| P5 | 所有写接口**忽略并覆盖** body 中的 `merchantId`（以服务端解析结果为准） |
| P6 | 民宿删除：其下存在房型 → `请先删除该民宿下的房型` |
| P7 | 房型删除：级联删除该房型全部房态记录（`room_calendar`） |
| P8 | 商家可自行上下架自家民宿（`status` 0/1）与停用房型（`room_type.status`） |

### 4.4 校验规则（沿用既有语义）

- 民宿：`name`、`address` 必填；`styleTags/facilityTags/images` 为字符串数组；`checkInTime/checkOutTime` 为 `HH:mm`；`hasBreakfast` 0/1；`status` 0/1
- 房型：`hotelId`、`name`、`price > 0`、`stock >= 0` 必填；`maxGuests >= 1`
- 房态批量：`roomTypeId` 存在、`startDate <= endDate`、严格 `YYYY-MM-DD`、区间 ≤ 32 天（**与 C 端日历窗口上限一致**）；`availableStock` 截断到房型 `stock`
- 房态区间查询：同样 ≤ 32 天上限

### 4.5 与既有关联面的关系

| 面 | 关系 |
|---|---|
| 平台管理端 `/admin/accommodation/*` | 同一批表，**不改代码**；商家新建的民宿平台端立即可见，平台可改任意民宿的 `merchantId` 做归属调整 |
| C 端 `/app/accommodation/hotel/search`、`/detail` | 不改；商家上架的民宿（`status=1`）自动出现在 C 端 |
| C 端房态日历 | 不改；商家设的房态/价格即时反映 |
| merchant 模块 | **只调用** `MerchantService.isMerchant`，不修改 |

## 5. 前端设计（wudong-web）

### 5.1 http 层扩展

- 新增 `getToken/setToken/clearToken`（localStorage，key `wudong_token`）
- `request`（GET）与新增 `post` 均携带 `Authorization: <token>`（**裸 token，不加 `Bearer ` 前缀**——后端中间件是 `jwt.verify(ctx.get('Authorization'))`，见 `cool-admin-midway/test/helper.ts` 的 `auth()`）
- **鉴权失败判定**（关键，见 §3 推论）：HTTP 非 2xx（防御未预期形态）**或**（`code === 1001` 且 `message` 以 `登录失效` 开头）→ 判定为鉴权失败：清 token → 通知注入的 `onUnauthorized` 回调（跳 `/login?redirect=`）；其余非 1000 的 code 一律作业务错误抛出（**不得因业务错误登出用户**）。实测未登录为「HTTP 200 + `登录失效~`」，故 message 判定是主路径
- `onUnauthorized` 由 `main.ts` 注入（避免 http 层 import router 造成循环依赖）
- 新增 `uploadFile(file)` → `POST /app/base/comm/upload`（FormData，不设 Content-Type）
- **不做自动续期**：登录返回的 `refreshToken` 本期不使用，access token 过期即走鉴权失败路径（清 token + 跳登录，回跳原页）。自动续期留二期
- 实现前用真实请求**确认一次**未登录时 `/app/*` 的实际响应形态（status 与 body），据实调整判定顺序

### 5.2 api 层新增（每个都带 mock 对偶，沿用 `VITE_USE_MOCK` 唯一开关）

| 文件 | 接口 |
|---|---|
| `src/api/member.ts` | `sendSmsCode(phone)`、`register`、`loginByPassword`、`loginBySms`、`person` |
| `src/api/merchant.ts` | `apply`、`my`、`application` |
| `src/api/merchantAccommodation.ts` | `myHotels/hotel/updateHotel/addHotel/deleteHotel`、`roomTypes/addRoomType/updateRoomType/deleteRoomType`、`batchCalendar/calendarRange` |

**契约细节（已核实）**：

- `POST /app/member/login/smsCode` 在 `local`/`unittest` 环境**直接返回验证码** `{ code }`，生产环境返回 `{}` → 登录页需兼容两种：响应里带 `code` 时回显提示（本机演示免查日志），否则提示「已发送」
- 登录/注册成功返回 `{ userId, nickname, token, refreshToken, expire, refreshExpire }`；本模块只需 `token`
- 密码规则**前后端一致**：8–20 位且同时含字母和数字（`checkPasswordRule`）→ 注册表单做同样的前端校验，避免只靠后端报错

- mock 使用**内存可变数据集**：可直接增删改民宿/房型/房态，使 `npm run dev -- --mode demo` 不依赖后端即可完整走通商家全流程
- 类型与真实同构（`decimal` 归一为 `number`），页面不感知数据源

### 5.3 状态

`src/stores/auth.ts`：
- state：`token`、`profile`、`merchant`、`application`
- actions：`login(token)`、`logout()`、`loadProfile()`、`loadMerchant()`（并行拉 `merchant.my` 与 `merchant.application`）
- getters：`isLoggedIn`、`isMerchant`
- token 持久化到 localStorage；应用启动时若有 token 则拉一次资料

### 5.4 路由与守卫

| 路由 | 页面 | 守卫 |
|---|---|---|
| `/login` | 登录/注册（`?redirect=`） | 匿名 |
| `/merchant/apply` | 入驻申请表单 | `requiresAuth` |
| `/merchant/status` | 申请进度（待审/驳回+意见+重新申请/已通过引导） | `requiresAuth` |
| `/merchant` | 工作台：我的店铺 + 我的民宿列表 | `requiresAuth` + `requiresMerchant` |
| `/merchant/hotels/new` | 新增民宿 | 同上 |
| `/merchant/hotels/:id/edit` | 编辑民宿（含上下架） | 同上 |
| `/merchant/hotels/:id/rooms` | 房型管理 | 同上 |
| `/merchant/rooms/:roomTypeId/calendar` | 房态日历（区间查看 + 批量设置） | 同上 |

守卫行为：`requiresAuth && !isLoggedIn` → `/login?redirect=<fullPath>`；`requiresMerchant && !isMerchant` → `/merchant/status`。

顶栏新增入口：未登录显示「登录」；已登录显示店铺名 → `/merchant`。C 端既有页面与路由**不改动行为**。

### 5.5 新组件

| 组件 | 作用 |
|---|---|
| `ImageUploader.vue` | 单图/多图上传（上传中/失败/移除/预览），供入驻材料与民宿图片使用 |
| `TagInput.vue` | 风格/设施标签的增删（chips） |
| `MerchantNav.vue` | 商家区侧栏导航（工作台 / 新增民宿 / 入驻进度） |

视觉沿用 `styles/tokens.scss`（苗寨色板），**不引入 UI 组件库**。

## 6. 错误与状态呈现

| 场景 | 呈现 |
|---|---|
| 未登录访问商家页 | 跳登录页并带 `?redirect=`；登录后回跳 |
| 非商家访问工作台 | 自动送「申请进度」页（未申请则顺势引导申请） |
| 申请待审核 / 已驳回 | 进度页明确展示状态；驳回展示审核意见并提供「重新申请」 |
| 业务错误（如「无权操作该资源」） | 页面内提示（toast/inline），**不登出** |
| 重复申请 / 已是商家 | 后端已有文案直出（`您已是商家`/`已存在待审核的入驻申请`） |
| 列表/详情加载失败 | 失败态 + 重试；图片失败给占位底色 |

## 7. 测试与质量门槛

**后端（jest，沿用既有测试基建）**：
- 未登录 → `登录失效~` 契约
- 非商家（无 merchant 记录 / `status=0`）→ `仅商家可访问`
- 他店资源（hotel/roomType/calendar 三类）→ `无权操作该资源`
- 合法操作成功路径（民宿/房型/房态各自增改删查）
- `hotel/add` 时 `merchant.module !== 'accommodation'` → 拒绝
- 删除有房型的民宿 → 拒绝；删除房型 → 房态级联清理
- body 传入伪造 `merchantId` → 被忽略覆盖（写入的是自己的 merchantId）
- 房态批量/区间的日期校验与 32 天上限

**前端（wudong-web）**：
- `npm run type-check` 0 error（strict）
- `npm run build` 通过
- `vitest` 全绿，覆盖：auth store（token 持久化/登出清理）、鉴权失败判定（401 与 1001+登录失效 vs 业务错误不登出）、路由守卫（未登录跳转/非商家跳进度页/回跳 redirect）、api mock/real 选择与参数归一、申请表单必填校验、房态批量提交参数组装、`ImageUploader` 上传成功/失败
- 浏览器人工验收（含 mock 模式全流程）

## 8. 分支与协作

- 分支 `feature/wudong-merchant`，自 `origin/feature/wudong-web`（bee95ed）切出
- 本地 `config.local.ts` 为该机环境覆盖（3307/`cool` 库），**保持未提交**，不入任何 commit
- 提交范围：`cool-admin-midway/src/modules/accommodation/**`、`wudong-web/**`、本 spec 与实施 plan（docs）
- 不修改 base/merchant/member/order 等他人模块，不修改平台管理端

## 9. 验收对照（需求 → 落点）

| 需求 | 落点 |
|---|---|
| 商家入驻申请 | `/merchant/apply` + `POST /app/merchant/apply`（base） |
| 入驻审核结果/进度 | `/merchant/status` + `GET /app/merchant/application` |
| 我的店铺 | `/merchant` + `GET /app/merchant/my` |
| 商家管理自家民宿 | `/merchant/hotels/*` + `/app/accommodation/merchant/hotel/*` |
| 商家管理自家房型 | `/merchant/hotels/:id/rooms` + `/app/accommodation/merchant/room-type/*` |
| 商家管理自家房态/价格 | `/merchant/rooms/:roomTypeId/calendar` + `/app/accommodation/merchant/calendar/*` |
| 商家数据权限 | `merchant-scope.ts`（P1–P8） |

## 10. 风险与依赖位

1. **本地分支曾落后 origin**：已同步（本地 HEAD = bee95ed）。`config.local.ts` 被上游提交了他人本机环境（`zhuwenjin`/`wudong_platform`），本机已改回 3307/`cool` 且保持未提交 —— 后续每次拉取都可能再冲突，注意勿误提交。
2. **operate 模块并集重复（已确认）**：本次 merge 后模块内是两套实现的并集 —— 本组版（`controller/app/operate.ts` + `service/*`，带生效时间窗过滤）与 base 版（`controller/app/{banner,announcement}.ts`，直查仓储、**不过滤时间窗**；`controller/admin/finance.ts`）。两份 spec 对同一能力给了不同 URL 契约（`/app/operate/banner` vs `/app/operate/banner/list`）。**本次处理**：merge 提交只做纯冲突解决、不删任何一方 URL（避免破坏他人契约）；把「base 侧 app 控制器改为复用本组 service 以消除逻辑重复」与「admin 财务双入口去留」列为待办，**需与 cja 对齐后再动**。
2b. **关键字搜索字段名（原判为缺陷，实测不存在，改为回归守卫）**：本条原写「`controller/admin/{banner,announcement}.ts` 的 `pageQueryOp` 把 `keyWordLikeFields` 误写为 `keywordLikeFields`（小写 w）」。执行到 Task 5 前核对发现**该缺陷并不存在**：两个控制器第 9 行都是正确的大写 W 写法，且 `git log -S keywordLikeFields --all` 显示小写形式从未在本仓库代码中出现过（唯一命中是本 spec 与 plan 的描述文字）。
   机制本身是真的、且值得守卫：cool 在 `node_modules/@cool-midway/core/dist/service/mysql.js:366-368` 直接读 `option.keyWordLikeFields` 拼 `orWhere(... like :keyWord)`，`dist/rest/eps.js:55` 也读同一属性——写成小写 w 不会被任何编译或运行时报错拦住，只会让关键字搜索**静默失效**。因此 plan 的 Task 5 保留，但降级为**纯回归守卫**：断言两个控制器的 `pageQueryOp.keyWordLikeFields === ['a.title']`，并反向断言小写形式不存在。无生产代码改动。
3. **房态与订单不联动**：order 不反查业务表，C 端无住宿下单链路 → 本期房态是**展示性数据**，无真实占态，不存在超卖。真实占态（下单锁库存、取消回滚）属二期，需在 accommodation 内新开下单前置校验或提供占用接口。
4. **图片上传**：走 `/app/base/comm/upload`（本地存储模式），需在本机真机验证一次；正式接入 OSS 后再换。
5. **mock 登录态是新概念**：原工程纯匿名，mock 需提供假 token/假商家/可变数据集，须与真实同构，避免 demo 通过而真实失败。
6. **商家订单/财务**：需在 order（cja 的 base 领地）新增带 merchantId 的接口，跨模块改动，建议先与 cja 对齐后再立项。
