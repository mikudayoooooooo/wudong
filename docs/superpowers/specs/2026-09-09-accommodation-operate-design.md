# 住（住宿预订）+ 平台运营位（operate）模块设计文档

| 项目 | 内容 |
|---|---|
| 文档版本 | V1.0（草案，待评审） |
| 编制日期 | 2026-09-09 |
| 负责模块 | 第 3 组（住-住宿预订，模块3）+ 第 6 组（平台管理后台-运营位 operate，模块6 子集） |
| 上游文档 | 《需求规格说明书》§8/§11、《schema.sql》模块3/模块6、《API接口设计文档》、《2026-09-09-platform-base-design.md》（cja，base 层契约）、《组员开发文档-完整版》 |
| 交付形态 | **本次仅后端**：cool-admin-midway 新增 `accommodation` + `operate` 两个业务模块（entity/controller/service + jest）。cool-admin-vue 管理页与 C 端页面**另排**（用户决策） |
| 边界约束 | **只做不依赖 base 平台底座（order/pay/merchant/message/sensitive）的前置**；挂到 base 的闭环一律留依赖位，base 合入后再接 |

---

## 1. 背景与目标

`member`（C端用户/认证/收藏）已完成并入 main（PR#5）；cja 的 base 平台底座（order/pay/merchant/cart/message/operate/sensitive）目前**只有 spec、无代码**（`docs/superpowers/specs/2026-09-09-platform-base-design.md`，feature/member 分支 ed6b17d）。

按 platform-base 的复用矩阵与依赖图，本次交付只覆盖**不依赖 base 的前置**，两类：

1. **accommodation（模块3 住）**：民宿房源/房型/房态日历的建模、管理、浏览查询（`hotel` / `room_type` / `room_calendar` 三张自有表）。
2. **operate（模块6 平台后台-运营位）**：`banner` / `announcement`（+ `finance_record` 仅建表预留），这是模块6 中不依赖任何 base、且归属第6组的公共运营能力（platform-base §5.7 明确 operate 属第6组）。

其余与模块3/6 相关的预订/支付/结算/审核/统计闭环，均在 §8「后置对接」给出依赖矩阵与签名契约，等 base 合入后按 §8 接入，避免本期与 cja 并行区冲突。

## 2. 范围裁剪（对照 platform-base 归属）

| 实体/能力 | schema/需求归属 | platform-base 归属 | 本次是否做 |
|---|---|---|---|
| `hotel`/`room_type`/`room_calendar` | 模块3 | 第3组（住） | ✅ 做 |
| 民宿搜索/详情/房态日历（读） | 模块3 C端 | 第3组 | ✅ 做 |
| 民宿/房型/房态管理（写） | 模块3 后台 | 第3组 | ✅ 做 |
| 预订下单/支付/取消/退款/入住码 | 模块3 | **order(order_reservation)+pay（base）** | ⏸ 后置 |
| 民宿评价（离店30天内） | 模块3 | 依赖 order 完成 + sensitive | ⏸ 后置 |
| 收藏民宿 | 模块3 | member `FAVORITE_TYPES` 并集含 hotel | ⏸ 后置（base 扩展） |
| 入住率/房价/订单统计 | 模块3/6 看板 | 依赖订单数据 | ⏸ 后置 |
| `banner`/`announcement` | 模块6 首页运营 | **operate（第6组）** | ✅ 做 |
| `finance_record` 建表+只读 | 模块6 财务 | operate（第6组），结算 Phase4 | ✅ 建表+只读（无写入） |
| 游客账号管理/封禁 | 模块6 | member admin user | ✅ 已有（main） |
| 管理员/角色/菜单/操作日志 | 模块6 | cool-admin base `sys_*` | ✅ 零开发（框架自带） |
| 商家账号/入驻审核 | 模块6 | **merchant（base）** | ⏸ 后置 |
| 消息中心群发 | 模块6 | **message（base）** | ⏸ 后置 |
| 敏感词库 | 模块6 系统设置 | **sensitive（base）** | ⏸ 后置 |
| 全局订单/退款审批 | 模块6 | **order（base）** | ⏸ 后置 |
| 数据看板/财务结算/导出 | 模块6 | 依赖上述数据 | ⏸ 后置 |
| 推荐位管理 | 模块6 首页运营 | 各业务模块私有 recommend_slot（travel 已有） | ⏸ 后置/各模块 |

## 3. 已确认/建议决策

| # | 决策 | 结论 |
|---|---|---|
| D1 | 本期边界 | 只交付可**浏览/管理**房源房态与运营位；预订→支付→结算的写闭环全部等待 base（见 §8），不自己造 order/pay 轮子 |
| D2 | 房态日历落库策略 | **按需落记录 + 查询回退默认**：未写过的日期视为 `price=roomType.price`、`availableStock=roomType.stock`、`status=1 可订`；`batch` 接口负责铺量/改价/关房。避免强制预生成 90 天记录 |
| D3 | `hotel.merchantId` 归属 | 本期仅为**归属标识**（管理端可编辑，查询按它过滤）；「商家只看自家」的数据权限等 merchant base 落地后由 merchant 模块回填/校验 |
| D4 | 时间字段 | `check_in_time`/`check_out_time`（'HH:mm'）用 `varchar` 存储，避免 typeorm/MySQL timezone 对 TIME 的干扰；JSON 一律 `transformerJson` |
| D5 | `finance_record` | 仅实体 + 管理端只读 page/info；无创建来源（来源=order 完成自动生成，Phase4 结算逻辑），本期不做结算任务 |
| D6 | 民宿搜索语义 | DB `LIKE` + JSON 标签筛选 + 价格/评分过滤排序起步；不做 ES/精确地理检索（需求未强制）。酒店可用性（date/人数）不作为列表硬过滤，在详情/房态日历处按日期校验 |
| D7 | 民宿评价/收藏 | 评价需「已完成订单」凭证、收藏需 member 白名单含 `hotel`，均为 base 依赖，本期不实现（落点见 §8） |
| D8 | operate 归属 | `operate` 虽列在 base spec 范围内，但明确归**第6组（用户）**实现；cja base 轨道不建同名实体，避免重复 |

### 既定偏差（沿用 travel spec §4 / platform-base §3，全平台一致）

- 字段命名 **camelCase**（`created_at→createTime`…），表名沿用 schema.sql **verbatim**（`hotel`/`room_type`/`room_calendar`/`banner`/`announcement`/`finance_record`）
- URL 前缀：文档 `/api/*` → 实际 **`/app/<module>/*`**（C 端，member JWT，浏览类 IGNORE_TOKEN）与 **`/admin/<module>/*`**（管理端，admin JWT）；与 member 实测一致（`/admin/member/user/page`、`/app/member/info/person`）
- **不建物理外键**（逻辑关联 + 索引）；表由 `synchronize: true` 自动创建
- 时间字段统一 `BaseEntity` 的 `createTime/updateTime`（transformerTime）；租户字段跟随基类
- **不得修改** base/user/member 模块（member 仅允许 platform-base §5.1 列出的两处扩展点，由 base 轨道执行）

## 4. 架构

```
cool-admin-midway/src/modules/
├── accommodation/        【本次新增】住-住宿预订（模块3）
│   ├── entity/  hotel.ts、room-type.ts、room-calendar.ts
│   ├── controller/
│   │   ├── admin/        hotel.ts、room-type.ts、room-calendar.ts
│   │   └── app/          hotel.ts（搜索/详情/日历，匿名浏览）
│   ├── service/          hotel.ts、room-type.ts、room-calendar.ts
│   └── config.ts         name='住-住宿预订'
└── operate/              【本次新增】平台运营位（模块6 子集）
    ├── entity/  banner.ts、announcement.ts、finance-record.ts
    ├── controller/admin/  banner.ts、announcement.ts、finance-record.ts（只读）
    ├── controller/app/    operate.ts（banner/announcement 匿名下发）
    └── config.ts         name='平台运营'
```

- admin 控制器走 `@CoolController({ api, entity, pageQueryOp }) extends BaseController` 自动 CRUD（`add/update/delete/page/list/info`），同 member 的 `AdminMemberUserController`
- app 控制器走 `@CoolUrlTag() + @CoolController() extends BaseController`，浏览接口方法加 `@CoolTag(TagTypes.IGNORE_TOKEN)`（同 member login）

## 5. 数据模型

> 字段为 schema.sql 对应表转 camelCase 的实体定义；`*` = BaseEntity 提供。

### 5.1 accommodation

**`hotel`（民宿）**

| 字段 | 类型 | 说明 |
|---|---|---|
| merchantId | number | 商家ID（归属标识，D3） |
| name | string(100) | 民宿名称 |
| address | string(200) | 地址 |
| longitude / latitude | decimal(10,6) | 坐标 |
| styleTags / facilityTags | json[] | 风格标签 / 设施标签（WiFi/空调/独立卫浴/苗族特色…） |
| mainImage | string | 主图 |
| images | json[] | 图片集（主图轮播） |
| intro | text | 介绍 |
| checkInTime / checkOutTime | varchar 'HH:mm' | 入住/离店时间（默认 14:00 / 12:00） |
| petPolicy | string(200) | 宠物政策 |
| hasBreakfast | number(dict 无/含早) | 是否含早餐 |
| deposit | decimal(10,2) | 押金 |
| rating / reviewCount | decimal(3,2) / int | 评分/评价数（评价链路后置后回写，本期可编辑或只读 5.0/0） |
| status | number(dict 禁用/正常) | 上下架：1正常 0禁用 |

索引：merchantId、经纬度（logic，无物理 FK）。

**`room_type`（房型）**

| 字段 | 类型 | 说明 |
|---|---|---|
| hotelId | number | 民宿ID（逻辑关联） |
| name | string(100) | 房型名（如 苗族木屋大床房） |
| bedType | string(50) | 床型（大床/双床…） |
| area | int | 面积㎡ |
| maxGuests | int(默认2) | 最多入住人数 |
| facilities | json[] | 设施列表 |
| price | decimal(10,2) | 基础价格（日历缺省回退值） |
| stock | int(默认1) | 房间数量（日历 availableStock 上限） |
| images | json[] | 房型图片 |
| status | number(dict 停用/正常) | 1正常 0停用 |

索引：hotelId。

**`room_calendar`（房态日历）**

| 字段 | 类型 | 说明 |
|---|---|---|
| roomTypeId | number | 房型ID |
| date | date | 日期 |
| availableStock | int | 当日可售间数（≤ roomType.stock） |
| price | decimal(10,2) | 当日价格（动态定价，缺省回退 roomType.price） |
| status | number(dict 不可订/可订) | 1可订 0不可订（关房） |

唯一索引 `(roomTypeId, date)`。查询回退规则见 D2：无记录日期 = 基础价/满库/可订。

### 5.2 operate

**`banner`（轮播图）**

| 字段 | 类型 | 说明 |
|---|---|---|
| title | string(100) | 标题 |
| image | string(500) | 图片URL |
| linkType | string(20) dict none/page/url | 跳转类型 |
| linkValue | string(500) | 跳转地址 |
| position | string(20) | 位置：home/product/food/accommodation… |
| sort | int | 排序（小→大） |
| startTime / endTime | datetime | 生效区间（可空=长期） |
| status | number(dict 禁用/启用) | 1启用 0禁用 |

索引：position、status。

**`announcement`（公告）**

| 字段 | 类型 | 说明 |
|---|---|---|
| title | string(200) | 标题 |
| content | text | 内容 |
| type | number(dict 系统公告/活动公告) | 1系统 2活动 |
| startTime / endTime | datetime | 生效区间（可空=长期） |
| isTop | number(dict 否/是) | 是否置顶 |
| status | number(dict 草稿/发布) | 1发布 0草稿 |
| createdBy | number | 创建人ID（admin_user，仅存数） |

索引：status、type。

**`finance_record`（财务记录，仅建表+只读）**

| 字段 | 类型 | 说明 |
|---|---|---|
| orderId / merchantId | number | 关联订单/商家（逻辑） |
| orderAmount | decimal(10,2) | 订单金额 |
| commissionRate | decimal(5,2) | 抽佣比例% |
| commissionAmount / merchantIncome | decimal(10,2) | 平台抽佣 / 商家收入 |
| settlementStatus | number(dict 待结算/已结算) | 1待结算 2已结算 |
| settlementTime / settlementBatch | datetime / varchar | 结算时间/批次号 |

无创建来源（D5）；仅提供 admin 只读查询。

## 6. 接口设计

> admin 自动 CRUD 采用 Cool `api` 与 `pageQueryOp`；自定义方法手动实现。匿名浏览接口 `@CoolTag(TagTypes.IGNORE_TOKEN)`。

### 6.1 accommodation · admin（/admin/accommodation/*）

| 接口 | 说明 |
|---|---|
| `GET/POST .../hotel/page\|list\|info\|add\|update\|delete` | 民宿 CRUD；page 过滤：status、merchantId（fieldEq），关键字：name/address（keyWordLike） |
| `GET/POST .../roomType/page\|list\|info\|add\|update\|delete` | 房型 CRUD；page 过滤：hotelId、status |
| `GET/POST .../roomCalendar/page\|info\|delete` | 日历明细查询/删除（过滤 roomTypeId、日期区间） |
| `POST .../roomCalendar/batch` | **批量设置**：`{roomTypeId, startDate, endDate, weekDays?, price?, availableStock?, closed?}`；对区间（可选限定星期几 0-6）逐日 upsert；`closed=true` → status=0 关房；否则写 price/availableStock 并置可订。用于铺 90 天房态/动态定价/节假日调价/整段关房 |
| `GET .../roomCalendar/range` | 服务端范围查询（回退默认），返回 `[{date, price, availableStock, status}]`；管理端日历预览用 |

### 6.2 accommodation · app（/app/accommodation/*，匿名可读）

| 接口 | 说明 |
|---|---|
| `GET /app/accommodation/hotel/search` | 民宿搜索：`keyword? styleTags? facilityTags? minPrice? maxPrice? rating? sort(price/rating/默认)? page size`；仅 status=正常；返回摘要+rating+reviewCount+经纬度（前端地图用）。静态筛选（D6） |
| `GET /app/accommodation/hotel/detail` | 民宿详情 `?id=&startDate?&endDate?`：基础信息+标签+图片+入住须知（checkInTime/checkOutTime/petPolicy/hasBreakfast/deposit）；启用房型列表；带日期时每房型附「该区间是否有可订日历」提示 |
| `GET /app/accommodation/roomType/calendar` | 房态日历 `?roomTypeId=&startDate=&endDate=`（窗口≤32天）：逐日 `{date, price, availableStock, status}`；无记录回退默认（D2）；超卖回退与关房均如实返回 |

### 6.3 operate · admin（/admin/operate/*）

| 接口 | 说明 |
|---|---|
| `GET/POST .../banner/page\|list\|info\|add\|update\|delete` | 轮播 CRUD；page 过滤 status/position；列表按 sort asc、createTime desc |
| `GET/POST .../announcement/page\|list\|info\|add\|update\|delete` | 公告 CRUD；page 过滤 status/type；发布列表按 isTop desc、createTime desc |
| `GET .../financeRecord/page\|info\|list` | 财务记录**只读**（api 不含 add/update/delete）；过滤 settlementStatus/merchantId/orderId（D5） |

### 6.4 operate · app（/app/operate/*，匿名）

| 接口 | 说明 |
|---|---|
| `GET /app/operate/banner?position=` | 下发启用且生效时间窗内轮播，按 sort asc（首页/各模块位） |
| `GET /app/operate/announcement?type=` | 下发发布态且生效中公告，置顶优先+时间倒序（可空 type=全部） |

## 7. 业务规则（本次实现内）

1. 上下架联动：`hotel.status` 单独维护，不做级联；`roomType` 停用后其日历对外视为不可订（查询处过滤 roomType.status=1）
2. 日历一致性：`batch` 时 `availableStock > roomType.stock` 则截断到 stock；`closed` 优先级最高（status=0），不覆盖 price 也可表达"关房"
3. 操作幂等：`batch` 逐日 upsert，重复调用覆盖同日期记录（唯一键 `roomTypeId+date`）
4. 动态定价：日价覆盖基础价；C端日历展示以日价优先，缺省回退基础价
5. 有效下发：banner/announcement 均要求 status 启用 且 `now ∈ [startTime,endTime]`（时间为空则恒有效）

## 8. 后置对接矩阵（base 合入后，按 platform-base §5 契约接入）

| 待接入能力 | 依赖 base 契约 | 接入点（预留） |
|---|---|---|
| 民宿预订下单 | `OrderService.create(userId,{module:'accommodation',orderType:3,items,…})` → 落 `order_reservation`（reservationType=2、roomTypeId、checkIn/checkOut、guestName/guestPhone/idCard） | C端房间卡「预订」按钮跳订单流程；先校验房态再下单 |
| 取消政策 | 需求§8.6：入住前3天免费、1-3天扣30%、当天不可退 | 订单状态机 `cancel`/退款金额计算（住宿侧业务方法，供 order 回调） |
| 入住码 | `order_reservation.checkInCode` | 支付成功后由 pay 回调生成/展示 |
| 支付 | `PayService.create/mockPay` | 订单后接支付、支付成功通知房态扣减 |
| 库存扣减/回补 | 下单成功扣 `room_calendar.availableStock`，取消/退款回补 | 住宿侧在 OrderService.create 前自检自扣（order 模块单向依赖原则） |
| 房态占用触发 | base 到位后商家后台与 C端实时可用 | batch/自动 |
| 民宿评价 | 需 order 已完成 + 离店≤30天 + sensitive 过滤 | 新 `accommodation` review 方法或复用公共 review（评审再定） |
| 收藏民宿 | member `FAVORITE_TYPES` 并集 + hotel（base §5.1 扩展2） | 收藏按钮接 member favorite 服务 |
| 商家数据权限 | merchant `isMerchant(userId)` | hotel/roomType 写接口按 `hotel.merchantId=商户自身` 过滤 |
| 通知 | `MessageService.send` | 预订成功/商家新订单 system_message |
| finance_record 写入 | order 完成 → 按抽佣比例生成 | operate 模块提供内部写入方法，供 order/merchant 调用 |

## 9. 验收对照表（需求 → 落点）

| 需求 | 本次落点 | 备注 |
|---|---|---|
| §8.2 民宿/房型/房态日历实体 | §5.1 三实体（synchronize 建表） | hotel 表名 verbatim |
| §8.3/8.4 民宿搜索/列表/详情/地图数据 | §6.2 search/detail（含经纬度） | 列表地图由前端渲染 |
| §8.3 房态日历未来30天 | §6.2 roomType/calendar（range） | 匿名可读 |
| §8.5 民宿管理/房型管理/房态日历管理（批量、动态定价） | §6.1 hotel/roomType/roomCalendar CRUD+batch | 90天铺/改由 batch |
| §8.5 订单管理/评价管理/数据统计 | 后置 | 依赖 order/review 数据（§8） |
| §8.6 业务规则（预付/取消政策/身份证/30天评价） | 后置（随订单闭环） | — |
| §11.3.1 游客账号列表/封禁 | member admin user（已有） | 后端在 main |
| §11.3.2 商家入驻审核 | 后置（merchant base） | — |
| §11.3.4 轮播图管理/公告管理 | §6.3 banner/announcement | 本次核心交付 |
| §11.3.4 推荐位管理 | 后置（各模块私有 recommend_slot） | travel 已设计 |
| §11.3.5 消息中心 | 后置（message base） | — |
| §11.3.6 财务结算 | `finance_record` 建表 + 只读（§6.3）；生成后置 | D5 |
| §11.3.7 全局订单/退款审批 | 后置（order base） | — |
| §11.3.8 系统设置/敏感词 | 后置（sensitive/param） | — |
| §11.4 商家后台框架 | 后置（member/merchant + 前端另排） | — |
| §11.3.3 数据看板 | 后置（依赖各业务数据） | — |

## 10. 非目标（本期明确不做）

- 不做任何订单/支付/退款代码（等 base order/pay，§8）
- 不做商家身份体系与数据权限（merchant base）
- 不做消息/敏感词/财务结算任务（message/sensitive base；finance 逻辑 Phase4）
- 不做民宿评价与收藏 hotel（依赖完成订单与 member 扩展）
- 不做统计看板、数据导出、地图渲染、前端页面（另排）
- 不建推荐位通用表（各业务模块私有）
- 零新增 npm 依赖；不改 base/user/member 模块

## 11. 建议实施阶段（评审通过后转 plan）

| 阶段 | 内容 | 前置 |
|---|---|---|
| C0 | accommodation 三实体 + admin CRUD（hotel/roomType/roomCalendar）+ batch/range | 无 |
| C1 | accommodation app 只读（search/detail/calendar） | C0 |
| C2 | operate 实体 + admin CRUD + finance 只读 | 无（可与 C0/C1 并行） |
| C3 | operate app 匿名下发 | C2 |
| C4 | 全量回归 + lint + dev 手动验收 | C1/C3 |

> 轨道 C0/C1 与 C2/C3 无交叉文件，可并行；jest 用例与表同生。
