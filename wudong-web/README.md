# wudong-web · 乌东文旅 C 端游客站（住宿浏览 MVP）

面向访客的「云上乌东 · 苗寨」静态游客站：首页（banner/公告/精选民宿）、民宿列表（URL 同步筛选）、民宿详情 + 房态日历面板（7/30 天切换，`?range` 可分享）。**本期只做浏览，预订按钮统一禁用占位（"即将上线"）**，不做登录/收藏/下单/入住码/评价。

技术栈：Vite 5 + Vue 3（`<script setup lang="ts">`）+ TypeScript（strict）+ Vue Router 4 + Pinia + Vitest（jsdom 单测）+ SCSS。无 UI 组件库、无 SSR。

---

## 前置要求

- Node.js（建议 ≥ 18）+ npm。无其它全局依赖；mocks 演示数据内置于仓库，单测/`--mode demo` 无需后端。

## 安装 / 运行

```bash
npm install        # 安装依赖（首次）
npm run dev        # 起开发服务器
```

- **默认端口 5173**。若本仓库同机的「原型」占用了 5173（vite 端口被占会自动 +1），wudong-web 会自动落在 **5174**，看启动日志确认实际端口。
- dev 代理：`/app/**` → `http://127.0.0.1:8001`（见 `vite.config.ts` `server.proxy`），真实数据走 accommodation/operate C 端接口，无需 CORS。

### 数据源开关（mock / 真实）

数据层唯一判据是 `src/env.ts` 的 `USE_MOCK`，读取环境变量 `VITE_USE_MOCK`：

| 启动方式 | `VITE_USE_MOCK` | 数据源 |
|---|---|---|
| `npm run dev` | `false`（`.env.development`） | 真实后端 8001（经 `/app` 代理）。后端未运行/空数据时页面展示**失败态**（不会静默切 mock） |
| `npm run dev -- --mode demo` | `true`（`.env.demo`） | 内置 `src/mocks/` 演示数据，无需后端 |

> mock 与真实后端返回结构**同构**；`api/*` 层负责把 `rating/price/minPrice` 等统一 `Number()` 归一，组件只消费 number。**改 mock 需保持与真实后端同构。**

## Scripts

| 命令 | 说明 |
|---|---|
| `npm run dev` | 起 dev server（5173/5174） |
| `npm run type-check` | `vue-tsc --noEmit`，strict 类型检查，须 0 error |
| `npm test` | `vitest run`，全量单测（仅依赖 mock/同构数据，不需后端） |
| `npm run build` | 类型检查 + 产物构建到 `dist/` |
| `npm run preview` | 预览 `dist/` 产物 |

## 目录地图

```
wudong-web/
├── index.html / vite.config.ts / vitest.config.ts / tsconfig*.json / env.d.ts
├── .env.development          # npm run dev → VITE_USE_MOCK=false（真实后端）
├── .env.demo                 # --mode demo → VITE_USE_MOCK=true（内置 mocks）
├── src/
│   ├── main.ts / App.vue     # 入口；壳（header 导航 / footer / <RouterView>）
│   ├── router/index.ts       # 路由表 + scrollBehavior 回顶（/、/hotels、/hotels/:id）
│   ├── env.ts                # USE_MOCK 唯一读点（mock/真实选择处）
│   ├── stores/hotel.ts       # Pinia：精选民宿加载
│   ├── api/                  # 数据层：函数签名 + mock/real 同构选择 + Number 归一
│   │   ├── http.ts           # fetch 封装（code===1000 → data，否则抛 ApiError）
│   │   ├── types.ts          # Hotel / RoomType / CalendarRow / Banner / Announcement / HotelQuery 等
│   │   ├── accommodation.ts  # searchHotels / hotelDetail / roomCalendar
│   │   └── operate.ts        # banners / announcements
│   ├── mocks/                # 内置演示数据（mock 侧实现，与真实返回同构）
│   │   ├── index.ts          # mockHotels / hotelById / roomTypesOf 等
│   │   ├── calendar.ts       # buildCalendar 房态日历工厂
│   │   └── operate.ts        # mockBanners / mockAnnouncements
│   ├── utils/
│   │   ├── query.ts          # URL 筛选序列化/反序列化
│   │   └── date.ts           # 纯日期工具（todayISO / addDaysISO / diffDays / weekCN）
│   ├── components/           # 共享组件：BannerCarousel Ticker HotelCard FilterBar RoomCard
│   │   │                     #   ComingSoonTag CalendarTable（含 props/事件契约）
│   ├── views/
│   │   ├── home/HomeView.vue            # 首页：banner/公告/精选 + 预订占位 CTA
│   │   └── accommodation/               # 住宿模块页面
│   │       ├── HotelListView.vue        # 列表 + URL 同步筛选
│   │       └── HotelDetailView.vue      # 详情 + 房态日历（?range=7|30）
│   ├── styles/               # tokens.scss（设计变量）/ base.scss
│   └── **/*.spec.ts          # 与实现同目录的单测（vitest jsdom）
```

## 如何新增一个模块 / 页面

以「新模块 X」为例（沿用现有 accommodation 模式）：

1. **页面**：在 `src/views/<模块>/` 建页面（如 `<Module>List.vue`、`<Module>Detail.vue`）。页面只消费 `api/*` 返回的归一数据 + 组件 props/事件，不感知 mock/real 差异。
2. **路由**：在 `src/router/index.ts` 的 `routes` 数组**追加**一行（串行追加，勿整文件重写）。
3. **数据层**：建 `src/api/<模块>.ts`，每个函数写 `if (USE_MOCK) return mock…; return request<T>('/app/<模块>/…', …)`，并对返回做与现有一致的归一；类型加到 `src/api/types.ts`。
4. **mocks（如需 demo/单测）**：建 `src/mocks/<模块>.ts`，结构必须与真实后端返回**同构**；若后端已真实提供，也可不建 mock、demo 模式该区显示失败态。
5. **导航**：如需出现在站点头部，在 `src/App.vue` 的 `navItems` 增加一项。
6. **单测**：与实现同目录放 `<Module>.spec.ts`，用 `vi.mock('@/api/…')`（key 用 `@/` 别名）mock 数据层，跑 `npm test`。

> 约定：提交只含 `wudong-web/**`；测试/类型须全绿后再交。

## 本期范围（scope）

- 已落地：浏览类 MVP —— 首页运营位（banner/公告）与精选、民宿搜索/筛选（列表 URL 同步）、民宿详情 + 房态日历（真实动态定价/满房/关房可见），URL（`?styleTags`/`?range` 等）可分享。
- 占位：预订按钮统一禁用 +「即将上线」（member 白名单扩展、order/pay、入住码、评价未落地）。
- 对接后端：`accommodation`（民宿/房态 C 端浏览接口）与 `operate`（banner/公告下发）模块，`/app/**` 代理至 8001。
