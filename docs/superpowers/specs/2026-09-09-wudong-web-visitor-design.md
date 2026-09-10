# 乌东文旅 C 端游客站（wudong-web）设计文档

| 项目 | 内容 |
|---|---|
| 文档版本 | V1.0（草案，待评审） |
| 编制日期 | 2026-09-09 |
| 负责模块 | 第 3/6 组协同（住宿 accommodation + 平台运营 operate）——C 端游客 PC 站点 |
| 上游文档 | 《需求规格说明书》§8（住）、§11（运营位）；《2026-09-09-accommodation-operate-design.md》（已交付后端接口契约）；原型 `.superpowers/visitor-proto/`（视觉/交互已认可，作为落地底稿） |
| 交付形态 | **新建独立 C 端 PC 工程 `wudong-web/`**（Vite+Vue3+TS+Pinia+Vue Router）；本阶段仅住宿浏览 + 运营位展示；预订等依赖 base 的能力留占位 |
| 分支 | `feature/wudong-web`，从 `feature/accommodation-operate` 切出（工作区保留后端接口源码便于 8001 联调） |

---

## 1. 背景与目标

后端已交付 accommodation（民宿/房型/房态日历只读接口）与 operate（banner/公告匿名下发）。管理后台页已做（cool-admin-vue）。团队其余成员规划行/社区（travel/community）同类的 C 端站点。本工程统一承载游客 C 端 PC 站点：**本期实现住宿 + 运营位的浏览闭环**，工程结构为将来接入行/社区/衣/食页面预留。

目标：把已认可的原型升级为正式可维护工程（TS 化、组件/路由化、真实接口 + mock 开关），并作为将来 C 端统一站点基座。

## 2. 范围

**本期做（浏览型 MVP）：**
- 首页：运营 banner 轮播 + 公告 + 精选民宿（`operate.banner/announcement`、`accommodation.search`）
- 民宿列表/搜索：关键字、风格标签、评分、排序（`accommodation.search`）
- 民宿详情：信息/标签/设施/入住须知 + 房型列表（`accommodation.detail`）
- 房态日历：按房型查 7/30 天逐日房态（`accommodation.room-type/calendar`）
- 预订入口 = 置灰「即将上线」占位

**不做（本期，依赖 base 或另期）：**
- 登录/注册/个人中心（member 接口存在但本期不接）
- 收藏/评价/下单/支付/入住码（member 白名单 hotel 与 order/pay 均属 base 未落地）
- 衣/食/行/社区页面、小程序/移动适配、SEO/SSR

## 3. 工程与目录

独立工程 `wudong-web/`（仓库顶层新增，与 cool-admin-midway/vue/docs 并列，不入 cool-admin-vue）。

```
wudong-web/
├── index.html
├── package.json / tsconfig.json / vite.config.ts / .env(.development) / .gitignore
├── src/
│   ├── main.ts  App.vue  router/  stores/  api/  components/  views/  assets/  styles/
│   ├── api/
│   │   ├── http.ts            # fetch 封装 + base 前缀(/app) + 错误归一 + code!=1000 抛错
│   │   ├── types.ts           # 领域类型 Hotel/RoomType/CalendarRow/Banner/Announcement…
│   │   ├── accommodation.ts   # searchHotels/hotel/calendar（含 mock 实现）
│   │   └── operate.ts         # banners/announcements（含 mock 实现）
│   ├── mocks/                 # mock 数据集 + mock 工厂（calendar 生成、hotel 列表）
│   ├── views/
│   │   ├── home/HomeView.vue        # /
│   │   ├── accommodation/
│   │   │   ├── HotelListView.vue    # /hotels（?keyword&style&rating&sort&page）
│   │   │   └── HotelDetailView.vue  # /hotels/:id
│   ├── components/            # BannerCarousel/Ticker/HotelCard/FilterBar/RoomCard/CalendarTable/ComingSoonTag…
│   ├── stores/                # hotel.ts(列表/筛选状态，pinia)
│   └── styles/                # tokens.scss(苗寨色板/字体/圆角/阴影) + base.scss
└── test/ 或 __tests__/        # vitest 冒烟（api mock 选择、calendar 生成、视图关键渲染）
```

> 目录划分以 `views/` 为页面、将来扩展模块放 `views/<模块>/`，与 `api/<模块>.ts` 对应；store 不按模块堆叠，当前仅 `hotel` 一个。

## 4. 技术选型与脚本

- Vite 5 + Vue 3.4 (`<script setup>`) + TypeScript(strict) + Vue Router 4 + Pinia
- 无 UI 组件库依赖（沿用原型手写风格，贴合苗寨视觉）；Element Plus 等不加，避免与管理端观感混淆
- scripts：`dev`(5173, proxy `/app`→http://127.0.0.1:8001)、`build`、`preview`、`type-check`(vue-tsc --noEmit)、`test`(vitest run)
- `.env.development`：`VITE_USE_MOCK=false`；`.env.demo`：`VITE_USE_MOCK=true`（演示用 mock 数据无需后端）
- `.gitignore`：node_modules/dist；不要提交大产物

## 5. 页面与交互

### 5.1 路由
| 路由 | 页面 | 参数 |
|---|---|---|
| `/` | 首页 | — |
| `/hotels` | 民宿列表 | `?keyword=&style=&rating=&sort=&page=`（可分享/可刷新） |
| `/hotels/:id` | 民宿详情 | `?range=7|30`（日历跨度） |

### 5.2 首页（/）
- Hero 轮播：`operate.banner(home)`；自动轮播 + 手动箭头/圆点；标题/文案层
- 公告条：`operate.announcement()` 首条（type 可展示标记）
- 精选民宿：`accommodation.search({size:3, sort:'rating'})` 卡片（封面/名称/地址/标签/评分/起价）
- 「来乌东住一宿」CTA 区 → 按钮置灰「预订即将上线」，点击弹轻提示（无后端支持）

### 5.3 列表（/hotels）
- 筛选条：关键字（回车）、风格 chip（可取消）、评分下拉、排序下拉；URL 同步（进/出可恢复）
- 卡片网格（复用 HotelCard）；空态提示 + 无数据时给「联系/占位」文案
- 分页：本期固定 size=20 单次加载、**不做翻页/加载更多**（后端 search 的 total 为过滤后整集计数，语义足够用于展示条数）；分页留二期

### 5.4 详情（/hotels/:id）
- 头图大图 + 名称/地址/评分/入住离店时间/简介
- 标签/设施/宠物/含早等信息区块
- 房型卡列表：床型/可住/间数/价格 + 「预订」(置灰占位) + 「查看房态」
- 房态日历面板：选中房型，7/30 天切换；逐日 `日期|星期|价格|状态(剩N间/已满/不可订)`；未写记录显示基础价/满库（后端回退语义）；请求失败/无数据态给出提示

### 5.5 通用交互/状态
- 加载骨架/轻提示；路由切换滚动回顶
- API 失败统一 toast；图片加载失败给占位底色
- 全站页脚（站点信息 + 备案位占位）

## 6. 数据与 API

- `api/http.ts`：`request(path,{query})` → `GET /app/**`，`code===1000` 返回 `data`，否则抛 `ApiError`；超时与网络错误归一
- `api/*.ts`：封装实体接口，函数返回领域类型（见 types.ts）；**每个 api 模块导出一份 `mock*` 实现对偶**，由统一开关选择：
  - 读取 `import.meta.env.VITE_USE_MOCK === 'true'`（`const USE_MOCK = ...`），true → 走 `mocks/` 内同构数据；false → 真实接口
  - 类型同构：真实与 mock 返回结构一致，页面不感知数据源
- mocks：hotel 3~4 例（风格/评分/起价有区分度）、房型、calendar 工厂（按基础价±周末浮动、偶发满房/关房）、banner/公告；与后端返回字段对齐（camelCase，rating/minPrice 数字）
- 类型：`Hotel`(含 styleTags/facilityTags/mainImage/images/rating/reviewCount/minPrice/checkInTime…)、`RoomType`、`CalendarRow{date,price,availableStock,status}`、`Banner`、`Announcement`

## 7. 视觉规范（苗寨文旅风，随原型已认可）

`styles/tokens.scss` 定义（随同原型数值）：
- 色板：黛绿 `#33523e/#24412f`、森林绿 `#4a7a5c/#7ba384`、米绿底 `#eef5ea/#f6faf3`、橙金点亮 `#e8963e/#f6c26b/#d97f22`、文字 `#24301f/#6b7a66`
- 圆角 `14px`、阴影柔和绿投影、衬线/黑体中文栈
- 桌面优先 ≥1160 容器；移动端不做专项（提示「请用电脑访问完整体验」可后置）

## 8. 测试与质量（本期验收门槛）
- `npm run type-check` 0 error（strict）
- `npm run build` 通过
- vitest 冒烟：mocks 结构合法性、calendar 工厂（日期跨度/周末浮动/满房关房样本）、api mock/real 选择函数；关键组件 `HotelCard/CalendarTable` 渲染（含空态/状态 tag）。业务回归以「build + type-check + 少量组件/纯函数单测」为门槛；浏览器验收交给人工（登录态不需要，匿名接口）。
- ESLint：本期**不引入**（保证 type-check + build + vitest 通过即可），后续接入管理端一致的 lint 时再统一

## 9. 分支/协作
- 分支 `feature/wudong-web`（从 feature/accommodation-operate 切）——提交仅限 `wudong-web/` 目录 + 本 spec（docs）
- 联调：本机 `cool-admin-midway npm run dev`(8001) + `wudong-web npm run dev`(5173 proxy)；后端可处于 feature/accommodation-operate 或已含其接口的任意分支
- 与团队 wudong-web 概念：本工程即计划中的统一 C 端站点基座；行/社区后续在 `views/<travel|community>` 加入，`api/<travel|community>.ts` 平行扩展，不需改目录骨架
- 结束方式：沿用 superpowers 流程（spec 评审 → writing-plans → 逐任务 TDD/验证 → 整体评审）；合 main 由用户决定（先不与 accommodation 分支合并历史冲突）

## 10. 风险与依赖位
- 预订下单/支付（order/pay base）未落地 → 界面占位 + mock 不造下单闭环
- 真实接口的 `minPrice` 计算依赖房型启用数据，空酒店/无启用房型在列表的呈现：本期接受后端语义（minPrice null → 价格显示「咨询」）
- 图片用外网占位（picsum）→ 正式接入需后端 `/upload` 或 OSS；本 spec 标注、不阻塞
- cja 并行区（travel/community/base）不与本工程共享文件，冲突面≈0

## 11. 验收对照（原型能力 → 正式落点）
| 原型已验证能力 | 正式落点 |
|---|---|
| 首页轮播/公告/精选 | §5.2 + api/operate、api/accommodation |
| 列表筛选/卡片 | §5.3 + components/HotelCard/FilterBar |
| 详情/房型 | §5.4 + components/RoomCard |
| 房态日历 7/30 天 | §5.4 + components/CalendarTable + api mock |
| 预订占位 | §5.2/5.4 ComingSoonTag |
| 真实/演示数据切换 | §6 VITE_USE_MOCK 开关（替代原型的自动回退） |
