# 行（线路订票）+ 社区（照片分享）模块设计文档

| 项目 | 内容 |
|---|---|
| 文档版本 | V1.0 |
| 编制日期 | 2026-09-09 |
| 负责模块 | 第 4 组（行-线路订票）+ 第 5 组（社区-照片分享） |
| 上游文档 | 《乌东文旅"衣食住行"综合服务平台需求规格说明书》V1.0、《数据库设计文档》、《API 接口设计文档》、《组员开发文档-完整版》 |
| 交付形态 | 三部分：后端业务模块（cool-admin-midway）、管理后台页面（cool-admin-vue）、新建 C 端 PC 站点（wudong-web） |

---

## 1. 背景与目标

负责行、社区两个模块的开发。除满足需求规格说明书对本模块的全部功能要求外，另规划一组**超出文档的展示效果**作为亮点：

1. **真实足迹链**：以路线为骨架的手绘地图足迹可视化，点亮凭证 = 用户的已核销订单/电子票，作者无法伪造
2. **行↔社区双向联动**：核销记录为游记背书（行→社区），游记/话题为路线导流（社区→行）
3. **电子票卡包**：登机牌风格票卡，已核销票引导"去写游记"，完单转化为社区内容
4. **运营可配置的推荐位轮播**：焦点轮播内容由管理后台推荐位配置驱动

## 2. 实施范围与阶段

| 阶段 | 内容 | 交付物 |
|---|---|---|
| **Phase 1** | **C 端 UI Demo（纯前端，mock 数据）** | `wudong-web/` 工程，全部页面与展示效果可交互演示 |
| Phase 2 | 后端 member + travel 模块 | 实体/CRUD/app 接口/模拟支付/核销/审核 |
| Phase 3 | 后端 community 模块 | 帖子/互动/话题/关注/审核/敏感词/足迹生成 |
| Phase 4 | 管理后台页面（两模块） | cool-admin-vue 内 travel/community 管理页 |
| Phase 5 | C 端对接真实 API + 联调 | 替换 mock 为真实接口 |

> Phase 1 为第一优先级：先用 mock 数据验证全部展示效果，效果确认后再开发后端。

## 3. 已确认的设计决策

以下决策已在设计评审（可视化 mockup 评审）中确认：

| # | 决策 |
|---|---|
| D1 | 架构采用三工程并列：后端双业务模块 + 管理后台扩展 + 新建独立 C 端工程 `wudong-web` |
| D2 | C 端为 PC 桌面端优先（1280px+），不做两端响应式 |
| D3 | 链路数据只用本模块（行）数据；衣/食/住在足迹链与金刚区中留灰置扩展位 |
| D4 | 订单采用文档表结构 + **模拟支付**（不接真实微信支付） |
| D5 | 首页 7 区块节奏：焦点轮播+快捷订票卡 / 金刚区 / 手绘地图总览 / 本周足迹榜+节庆倒计时 / 真实足迹精选 / 社区瀑布流+侧栏 / 交通攻略+平台数据 countup |
| D6 | 推荐形态：首页焦点轮播（运营置顶驱动）+ 路线→游记联动；不做个性化推荐 |
| D7 | 足迹链可视化为**手绘地图形态**（SVG 路径 + 站点光点 + CSS 动画），首页地图总览与游记足迹链共用组件 |
| D8 | 路线详情页显示每站点"N 人点亮"（核销统计）；"走过这条线的人"游记横滑卡片带迷你足迹链 |
| D9 | 电子票卡包为登机牌风格票卡；已核销票灰显并出现"去写游记 →"入口 |
| D10 | 发布游记零路线步骤（文字+图片+话题 2 步发布）；足迹为详情页底部**默认收起**的附属区块 |
| D11 | 足迹区块双模式：A 自动聚合（近 30 天核销记录，零操作）；B 可选一键关联路线（完整足迹链 + 🔒 灰置未去站点） |
| D12 | 点亮 100% 由核销订单驱动；`post_footprint` 快照表定格；退票后快照保留但"已退款"灰显 |
| D13 | 信息流卡片保留迷你足迹链圆点与可点击路线标签 → 弹出路线/地点速览面板 |
| D14 | 个人主页展示跨游记聚合的足迹档案地图 + 徽章；话题页可绑定路线卡 |
| D15 | 社区与路线内容不冲突：正文永远是主角，足迹/商业元素均为附属区块 |

## 4. 架构

```
wudong/code/
├── cool-admin-midway/          后端（Midway.js 3.x + TypeORM + MySQL + Redis）
│   └── src/modules/
│       ├── member/             【新增】C 端用户公共模块（注册/登录/JWT 鉴权/模拟短信）
│       ├── travel/             【新增】行模块（admin + app 双控制器）
│       └── community/          【新增】社区模块（admin + app 双控制器）
├── cool-admin-vue/             管理后台（Phase 4 扩展 travel/community 管理页）
└── wudong-web/                 【新建】C 端 PC 站点（Vite + Vue3 + TS + Pinia + Vue Router）
```

- 后端遵循 cool-admin 模块惯例：`controller/admin`（管理接口，走 admin 鉴权）+ `controller/app`（C 端接口，走 member JWT 鉴权）
- **与文档的偏差备案**：文档示例 URL 前缀为 `/api/travel/*`，实际按 cool-admin 惯例为 `/admin/travel/*`（管理）与 `/app/travel/*`（C 端）；字段命名随框架 camelCase，语义与文档一致
- C 端开发期用 Vite proxy 代理后端 7001 端口；Phase 1 demo 阶段无后端依赖

## 5. 数据模型

### 5.1 member（C 端用户公共模块）

**member_user**：id、phone（唯一）、password（bcrypt）、nickname、avatar、gender、bio、status、last_login_time、create_time/update_time
**member_sms_code**（模拟短信）：id、phone、code、expire_time、used

> 注册：手机号+验证码（模拟短信：验证码固定/日志输出）；密码规则 8-20 位含字母数字（同文档 5.1）；登录：密码或验证码，签发 JWT。

### 5.2 travel（行模块）

| 表 | 关键字段 |
|---|---|
| `travel_scenic_spot` | name、**type（spot 景点 / dining 餐饮 / stay 住宿 / experience 体验，为衣食住预留）**、address、longitude、latitude、open_time、intro、main_image、status |
| `travel_ticket_type` | scenic_spot_id、name（成人/儿童/学生/家庭套票）、price、total_stock、validity_rule、status |
| `travel_route_package` | title、days（1/2/多日）、theme（亲子/摄影/研学/节庆）、price、includes（包含项目）、departure、destination、hotel_standard、meal_standard、notice、main_image、detail（富文本）、sales、status |
| `travel_route_itinerary` | route_id、day_no、sort、description、scenic_spot_id（站点）、meal、stay、transport |
| `travel_inventory` | **item_type（ticket/route）、item_id、use_date、total、sold**（门票按使用日期、路线按出发日期区分库存，同文档 9.6） |
| `travel_e_ticket` | order_id、item_type、item_id、use_date、qr_code、**status（unused/used/refunded —— 核销状态即点亮凭证）**、verify_time、verify_admin_id |
| `travel_traffic_guide` | title、departure、destination、transport_type、duration、cost、detail、image、sort、status |
| `travel_review` | order_id、**target_type（scenic/route）**、target_id、user_id、rating、content、images、merchant_reply、reply_time、status |
| `travel_recommend_slot` | position（首页焦点轮播等）、title、item_type（route/scenic/post）、item_id、sort、rotation_group、interval_seconds、status（运营配置，驱动 D6 轮播） |

### 5.3 community（社区模块）

| 表 | 关键字段 |
|---|---|
| `community_post` | user_id、title、content（≤5000 字）、images（JSON ≤9）、video_url、video_duration（≤60s）、**linked_route_id（模式 B）**、view_count、like_count、comment_count、favorite_count、**status（pending 审核中 / normal 正常 / offline 已下架）**、audit_reason |
| `community_post_footprint` | post_id、user_id、scenic_spot_id、route_id（模式 B 骨架）、order_id（凭证）、mode（auto 自动聚合 / route 关联路线）、day_no、memo（一句话）、photo、**status（normal / refunded 退票灰显）**、sort —— **快照表：发布时/关联时定格** |
| `community_comment` | post_id、user_id、content（≤500 字）、parent_id（二级回复）、like_count、status |
| `community_topic` | name、intro、follower_count、post_count、is_hot、is_recommend、sort、status、**bind_route_ids（话题绑定路线，JSON）** |
| `community_topic_follow` | topic_id、user_id |
| `community_follow` | user_id、following_id |
| `community_like` | user_id、target_type（post/comment）、target_id |
| `community_report` | user_id、target_type、target_id、reason、status（pending/handled/rejected）、handle_result |
| `community_sensitive_word` | word、status（DFA 过滤：命中→pending 人工复审，未命中→机审通过；同文档 10.6） |
| `community_message` | user_id（接收者）、type（like/comment/follow/system）、ref_type、ref_id、content、is_read |

### 5.4 订单（行模块范围，结构对齐文档公共订单）

| 表 | 关键字段 |
|---|---|
| `order` | order_no（唯一）、user_id、**order_type（4 门票 / 5 路线）**、module='travel'、total_amount、pay_amount、discount_amount、**status（1 待支付 / 2 已支付 / 3 已完成 / 4 已取消 / 5 已退款）**、pay_time、complete_time、cancel_time、remark |
| `order_ticket` | order_id、item_type（ticket/route）、item_id、use_date、quantity、unit_price、contact_name、contact_phone、tourists（JSON 出行人信息） |

**模拟支付**：app 端 `POST /app/travel/pay/mock`（校验归属与待支付状态）→ 订单置为已支付 → 按数量生成电子票。**退票规则**（文档 9.6）：使用日期前 24h 可退扣 10% 手续费，24h 内不可退；退票后电子票置 refunded，对应 `travel_inventory.sold` 回补，足迹快照保留但灰显。

### 5.5 收藏（跨两模块复用）

**user_favorite**：user_id、target_type（scenic/route/guide/post）、target_id、create_time（唯一约束 user+type+target）

## 6. 接口设计（摘要）

C 端接口（`/app/*`，member JWT 鉴权，浏览类可匿名）与文档 API 设计文档语义一致，前缀按 4.偏差备案：

- **travel/app**：scenic list/detail、route list/detail（含 itinerary+点亮统计）、inventory?date=、booking create、pay/mock、refund、e-ticket my/cancel、guide list/detail、review list/create、favorite
- **community/app**：post feed（推荐/最新/关注）、post create（含敏感词机审）、post detail（含 footprint + view 计数）、footprint attach-route（模式 B）、like、comment（二级）、favorite、topic list/detail/follow、follow、user profile（含聚合足迹档案）、message list、report、**search（游记/话题/用户，DB 检索 + 关键词高亮）**
- **admin**：两模块各实体的 CRUD（cool-admin CrudController 自动生成）+ 核销 verify、退票审核、游记审核通过/拒绝、举报处理、敏感词管理、推荐位配置（轮播分组/排序/间隔）

**推荐位**：`travel_recommend_slot`（admin 配置：位置（首页焦点轮播）、标题、item_type、item_id、sort、rotation_group、interval_seconds、status）——驱动 D6 的轮播内容。

## 7. C 端页面清单（wudong-web）

| 路由 | 页面 | 核心效果 |
|---|---|---|
| `/` | 首页 | D5 七区块；轮播悬停暂停+箭头；地图悬停 tooltip；countup |
| `/scenic`、`/scenic/:id` | 景区列表/详情 | 热度趋势角标；票种列表；"从这出发的路线" |
| `/route`、`/route/:id` | 路线列表/详情 | 行程手绘地图（N 人点亮 + 🔒 扩展位）；购票卡（日期+余票紧张度）；"走过这条线的人"横滑 |
| `/guide`、`/guide/:id` | 交通攻略 | 出发地→乌东路线对比卡 |
| 购票弹窗 | 下单流程 | 日期选择→人数→出行人→模拟支付→出票动画→"生成你的足迹地图"引导 |
| `/my/tickets` | 电子票卡包 | D9 登机牌票卡 + 核销灰显 + "去写游记" |
| `/community` | 信息流瀑布流 | 大图瀑布流；卡片迷你点链+路线标签→速览面板；推荐/最新/关注 Tab |
| `/post/:id` | 游记详情 | 正文主体 + 底部足迹区块（D10/D11：默认收起，模式 A/B） |
| `/publish` | 发布 | 零路线步骤；发布成功 toast 轻推关联路线 |
| `/topic/:id` | 话题页 | 话题聚合 + 绑定路线卡 |
| `/user/:id` | 个人主页 | 足迹档案地图 + 徽章（足迹达人/点亮数） |
| `/login` | 登录/注册 | demo 可 mock |

**核心组件**：`FootprintMap`（SVG 手绘足迹链，首页/路线页/详情页/主页复用）、`RouteQuickView`（速览面板）、`MiniChain`（迷你点链）、`TicketCard`、`HeroCarousel`、`Waterfall`、`CountUp`。

**视觉基调**：苗寨主题——黛绿（#33523e/#4a7a5c）+ 橙金点亮色（#e8963e/#f6c26b）+ 手绘地图米绿底（#eef5ea）。

## 8. 管理后台页面清单（Phase 4，cool-admin-vue）

- **travel**：景区管理、票种管理（含日期库存批量设置）、路线套餐管理（含行程编辑器）、交通攻略管理、订单管理（核销扫码/手动输号、退票审核）、评价管理（回复/隐藏）、推荐位配置
- **community**：内容审核（待审列表/通过/拒绝+原因）、游记管理（状态/举报数筛选、下架、删除）、评论管理、话题管理（置顶/推荐/绑定路线）、举报处理、敏感词库

## 9. 验收对照表（文档要求 → 本设计落点）

| 文档要求 | 落点 |
|---|---|
| 9.2 行模块全部实体 | §5.2 八表（含补充的 review/inventory） |
| 9.3 行小程序端功能 11 项 | §7 路线/景区/购票/卡包/攻略页面 + 收藏评价接口 |
| 9.4 行 PC 端功能 | §7（行程规划参考为文档允许的"后续扩展"，不在本期） |
| 9.5 行管理后台 8 项 | §8 travel 页面 |
| 9.6 行业务规则（日期库存/提前 1 天/退票 24h-10%） | §5.2 inventory + §5.4 退票规则 + 下单校验 |
| 10.2 社区全部实体 | §5.3 十表（含补充的 topic_follow/message/sensitive_word） |
| 10.3 社区小程序端功能 10 项 | §7 社区页面 + 消息/举报/搜索（DB 检索） |
| 10.4 社区 PC 端功能 4 项 | §7 瀑布流/详情/话题页/主页 |
| 10.5 社区管理后台 7 项 | §8 community 页面（热门内容推荐=推荐位配置） |
| 10.6 社区业务规则（字数/图片/视频/审核/敏感词/日限 10 篇） | §5.3 字段约束 + 机审流程 + 发布校验 |
| 5.1 用户体系（注册/密码规则） | §5.1 member 模块 |
| 5.3/5.4 订单与支付 | §5.4（支付为模拟，偏差已在 §5.4 注明） |
| 5.8.2 PC 端首页 | §7 首页七区块 |
| 三端验收/集成验收 | Phase 2-5 覆盖；Phase 1 demo 先行验证展示效果 |

## 10. 非目标与扩展位

- 不接真实微信支付（模拟支付）、不接真实短信、不做真实 OSS（本地静态目录 + 缩略图可后置）
- 衣/食/住接入：`scenic_spot.type` 已预留 dining/stay/experience 类型；足迹链灰置扩展位、金刚区"即将上线"位、首页地图图例均已预留，接入时无需改表结构
- AI 行程规划参考（文档 9.4 允许后续扩展）、个性化推荐（D6 明确不做）
