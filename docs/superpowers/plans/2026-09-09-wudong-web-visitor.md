# 乌东 C 端游客站（wudong-web）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在仓库顶层新建正式 C 端 PC 工程 `wudong-web/`（Vite+Vue3+TS+Pinia+Vue Router），实现住宿浏览 + 运营位展示（首页/列表/详情/房态日历），预订占位「即将上线」；真实后端接口优先、`VITE_USE_MOCK` 显式切换演示数据。

**Architecture:** 独立单页应用，目录按将来可扩展模块组织（`views/<模块>/`、`api/<模块>.ts`）。数据层统一走 `api/`，由 `src/env.ts` 的 `USE_MOCK` 在真实 `fetch` 与 `mocks/` 同构数据间选择，页面不感知数据源。视觉沿用已认可原型（`.superworks/visitor-proto`，苗寨 token）——**原型源码是本计划的视觉/模板基线（只读引用）**，TS 化后迁移到 `wudong-web/src`。

**Tech Stack:** Vite 5 · Vue 3.4 `<script setup>` · TypeScript(strict) · Vue Router 4 · Pinia · Vitest + @vue/test-utils + jsdom · SCSS。

**Spec:** [2026-09-09-wudong-web-visitor-design.md](../specs/2026-09-09-wudong-web-visitor-design.md)
**视觉基线（只读，可随原型保留）:** `.superpowers/visitor-proto/`（`src/App.vue`、`src/style.css`、`src/mock.js`、`src/api.js`）——迁移其结构/样式到 TS 化组件。若该目录不可用，按 spec §7 token 与 §5 交互从零实现。

## Global Constraints

- **只新建 `wudong-web/**`**（+ 本 spec/plan 已在 docs）；不得改动 cool-admin-midway / cool-admin-vue / base / member / 其它模块；不提交 node_modules、dist
- TypeScript `strict`；每 Task 结束 `npm run type-check` 必须 0 error
- **零 UI 组件库**：样式与组件全部手写（Element Plus 等禁用）；苗寨 token 以 spec §7 数值为准
- 数据开关：`USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'`；`api/*` 模块内的选择逻辑唯一，页面不判断数据源
- API 前缀 `/app/**`；dev proxy `/app → http://127.0.0.1:8001`；前端端口 5173
- 真实接口返回结构与 mocks 返回结构**同构**（camelCase；`Hotel.minPrice` 为 number|string|null 需 `Number()` 归一）；页面使用归一后类型
- 预订入口一律禁用占位（无 order/pay）；路由滚动回顶；空态/加载/失败三态齐全
- 每个 Task 末尾 commit（message + trailer `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`）；分支 `feature/wudong-web`

---

## 文件结构总览

```
wudong-web/
├── index.html  package.json  vite.config.ts  vitest.config.ts  tsconfig.json  tsconfig.node.json
├── env.d.ts  .gitignore  .env.development  .env.demo  README.md
└── src/
    ├── main.ts  App.vue
    ├── env.ts                    # USE_MOCK 开关（唯一读 env 处）
    ├── router/index.ts
    ├── stores/hotel.ts           # 列表/筛选状态
    ├── utils/date.ts             # 纯日期工具（单测重点）
    ├── api/
    │   ├── http.ts               # fetch 封装（单测：code 归一/错误）
    │   ├── types.ts
    │   ├── accommodation.ts      # searchHotels/hotelDetail/roomCalendar（real+mock 选择）
    │   └── operate.ts            # banners/announcements（real+mock 选择）
    ├── mocks/
    │   ├── index.ts              # mockHotels/mockRoomTypes + byId
    │   ├── calendar.ts           # buildCalendar 工厂（单测重点）
    │   └── operate.ts            # mockBanners/mockAnnouncements
    ├── styles/tokens.scss  base.scss
    ├── components/
    │   ├── BannerCarousel.vue  Ticker.vue  HotelCard.vue  FilterBar.vue
    │   ├── RoomCard.vue  CalendarTable.vue  ComingSoonTag.vue
    ├── views/
    │   ├── home/HomeView.vue
    │   └── accommodation/HotelListView.vue  HotelDetailView.vue
    └── **/*.spec.ts             # 随实现同目录单测
```

**关键接口（跨 Task 依赖，Task 1/2 定义）：**

- `env.ts`：`export const USE_MOCK: boolean`
- `utils/date.ts`：`todayISO()`, `addDaysISO(dateISO,n)`, `diffDays(aISO,bISO)`, `weekCN: string[]`（0=日…6=六）
- `api/http.ts`：`request<T>(path: string, query?: Record<string, unknown>): Promise<T>`（`code!==1000` 抛 `ApiError`）
- `api/types.ts`：`Hotel`（id/name/address/styleTags/facilityTags/mainImage/images/intro/rating/reviewCount/minPrice/checkInTime/checkOutTime/petPolicy/hasBreakfast）、`RoomType`（id/hotelId/name/bedType/maxGuests/price/stock）、`CalendarRow`（date/price/availableStock/status）、`Banner`、`Announcement`、`HotelDetail { info, roomTypes }`、`HotelQuery { keyword?; styleTags?; rating?; sort? }`
- `api/accommodation.ts`：`searchHotels(q?): Promise<Hotel[]>`、`hotelDetail(id): Promise<HotelDetail>`、`roomCalendar(roomTypeId,start,end): Promise<CalendarRow[]>`（real 调 http `/app/accommodation/hotel/search|detail|room-type/calendar`；mock 走 mocks；统一 `Number(minPrice/price/rating)` 归一）
- `api/operate.ts`：`banners(position='home'): Promise<Banner[]>`、`announcements(): Promise<Announcement[]>`
- `mocks/calendar.ts`：`buildCalendar(roomTypeId, basePrice, stock, start, end): CalendarRow[]`（周末上浮/偶发满房/关房样本，供 demo 与单测）

---

### Task 1: 工程脚手架 + 基建（app 壳 + 首页占位可跑）

**Files:**
- Create: `wudong-web/package.json`、`index.html`、`vite.config.ts`、`vitest.config.ts`、`tsconfig.json`、`tsconfig.node.json`、`env.d.ts`、`.gitignore`、`.env.development`、`.env.demo`
- Create: `src/env.ts`、`src/main.ts`、`src/App.vue`（壳 + header/footer + `<RouterView>`）、`src/router/index.ts`（三条路由先指向占位页）、`src/styles/tokens.scss` + `base.scss`
- Create: `src/views/home/HomeView.vue`（空骨架：section-title + 空态文案）
- Test: `src/env.spec.ts`

**package.json（关键）**:
```jsonc
{
  "name": "wudong-web", "private": true, "type": "module",
  "scripts": {
    "dev": "vite", "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview", "type-check": "vue-tsc --noEmit", "test": "vitest run"
  },
  "dependencies": { "pinia": "^2.1.7", "vue": "^3.4.21", "vue-router": "^4.3.0" },
  "devDependencies": {
    "@types/node": "^20", "@vitejs/plugin-vue": "^5.0.4", "@vue/test-utils": "^2.4.5",
    "jsdom": "^24", "typescript": "~5.4.3", "vite": "^5.2.0", "vitest": "^1.6.0", "vue-tsc": "^2.0.13"
  }
}
```

- [ ] **Step 1: 写失败测试** `src/env.spec.ts`（env 开关解析逻辑是唯一判据）：

```ts
// USE_MOCK 读取逻辑内聚为可测纯函数：env.ts 导出 parseUseMock(v: unknown): boolean
import { describe, expect, it } from 'vitest';
import { parseUseMock } from './env';
describe('parseUseMock', () => {
  it('仅字符串 "true" 为真', () => {
    expect(parseUseMock('true')).toBe(true);
    expect(parseUseMock('false')).toBe(false);
    expect(parseUseMock(undefined)).toBe(false);
    expect(parseUseMock(true)).toBe(false); // 非字符串真值不认
  });
});
```

- [ ] **Step 2: 跑测试确认红**：`npm test` → FAIL（`./env` 不存在/方法缺失）
- [ ] **Step 3: 最小实现**
  - `env.ts`: `export const parseUseMock = (v: unknown): boolean => v === 'true'; export const USE_MOCK = parseUseMock(import.meta.env.VITE_USE_MOCK);`
  - 其余基建文件照常给出（见上方 Files）。`router/index.ts` 用 `createWebHistory`；路由组件暂用 HomeView（另两路由指向 HomeView 占位，Task 5/6 替换）。`App.vue` 含 `.site-header` 品牌/导航（按钮 emit：`router.push`）与 `<RouterView/>`、页脚；导航项 首页`/`、民宿`/hotels`。样式从原型 `.superpowers/visitor-proto/src/style.css` 的 `:root`/`.site-header`/`.container`/`.page` 段迁移到 `tokens.scss`（变量）与 `base.scss`（选择器），home 占位页只写 section-title。
- [ ] **Step 4: 跑测试 + 类型 + 可跑**：`npm test` GREEN；`npm run type-check` 0 error；`npm run build` 通过（vue-tsc 已并入）；`npm run dev` 后 `curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/` = 200
- [ ] **Step 5: Commit**

```bash
git add wudong-web
git commit -m "chore(wudong-web): 工程脚手架 + 路由/样式基建 + env 开关"
```

---

### Task 2: 数据层（http + types + mocks + accommodation/operate api）

**Files:**
- Create: `src/api/http.ts`、`src/api/types.ts`、`src/api/accommodation.ts`、`src/api/operate.ts`
- Create: `src/mocks/index.ts`、`src/mocks/calendar.ts`、`src/mocks/operate.ts`
- Test: `src/api/http.spec.ts`、`src/api/accommodation.spec.ts`、`src/mocks/calendar.spec.ts`

**Interfaces:** 见文件结构总览（Task 2 产出全部 api/mock 签名；Task 4/5/6 的视图只消费这些签名）。

- [ ] **Step 1: 写失败测试**

`src/api/http.spec.ts`（用 `vi.stubGlobal('fetch', ...)` 假 fetch）:
```ts
import { describe, expect, it, vi, afterEach } from 'vitest';
import { request, ApiError } from './http';
afterEach(() => vi.unstubAllGlobals());
describe('request', () => {
  it('code 1000 返回 data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ code: 1000, data: { a: 1 } }) }));
    await expect(request('/x')).resolves.toEqual({ a: 1 });
  });
  it('code!==1000 抛 ApiError 携带 message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ code: 1001, message: '登录失效~' }) }));
    await expect(request('/x')).rejects.toThrow(/登录失效/);
  });
  it('query 拼接到 query string', async () => {
    let url = '';
    vi.stubGlobal('fetch', vi.fn((u: string) => { url = u; return { ok: true, json: async () => ({ code: 1000, data: 1 }) }; }));
    await request('/app/a', { page: 1, kw: '苗 寨' });
    expect(url).toBe('/app/a?page=1&kw=%E8%8B%97%20%E5%AF%A8');
  });
});
```

`src/api/accommodation.spec.ts`（USE_MOCK 路径：模块导入前 stub env? —— 用 mock 工厂直接断言形态与归一）:
```ts
import { describe, expect, it } from 'vitest';
import { mockHotels, roomTypesOf } from '../mocks';
describe('mocks 同构与归一', () => {
  it('hotel 字段满足类型（minPrice/rating 为数字）', () => {
    for (const h of mockHotels) {
      expect(typeof h.id).toBe('number');
      expect(typeof Number(h.minPrice)).toBe('number');
      expect(Number.isNaN(Number(h.minPrice))).toBe(false);
      expect(Array.isArray(h.styleTags)).toBe(true);
    }
  });
  it('roomTypesOf(hotelId) 归属一致', () => {
    const h = mockHotels[0];
    const rts = roomTypesOf(h.id);
    expect(rts.length).toBeGreaterThan(0);
    expect(rts.every((r) => r.hotelId === h.id)).toBe(true);
  });
});
```

`src/mocks/calendar.spec.ts`（工厂核心逻辑——真实日期数学）:
```ts
import { describe, expect, it } from 'vitest';
import { buildCalendar } from './calendar';
describe('buildCalendar', () => {
  it('跨度=end-start+1 天、date 升序、满库存为默认', () => {
    const rows = buildCalendar(1, 380, 3, '2026-09-01', '2026-09-10');
    expect(rows.length).toBe(10);
    expect(rows[0].date).toBe('2026-09-01');
    expect(rows[9].date).toBe('2026-09-10');
    // 常态：price=基础价、可订、满库
    expect(rows[1].price).toBe(380);
    expect(rows[1].availableStock).toBe(3);
    expect(rows[1].status).toBe(1);
  });
  it('含周六上浮与偶发满房/关房样本，且同日期不重复', () => {
    const rows = buildCalendar(1, 380, 3, '2026-09-01', '2026-09-30'); // 30 天样本
    const sat = rows.find((r) => new Date(r.date + 'T12:00:00').getDay() === 6);
    expect(sat && sat.price).toBeGreaterThan(380);
    expect(new Set(rows.map((r) => r.date)).size).toBe(rows.length);
    expect(rows.some((r) => r.availableStock === 0 || r.status === 0)).toBe(true);
  });
});
```

- [ ] **Step 2: 跑测试确认红**：`npm test` → 红（文件缺失）
- [ ] **Step 3: 最小实现**
  - `http.ts`: `request` 用 fetch，先拼 `?query`（encodeURIComponent，跳过 null/''），`res.ok` 与 `json.code===1000` 检查，否则 `throw new ApiError(message, code)`；导出 class
  - `types.ts`: 定义总览所列类型（`minPrice: number | null` 允许 string，见归一；实际统一 `number | null`——api 层负责 Number()）
  - `mocks/index.ts`: 从原型 `mock.js` 的 `mockHotels/mockRoomTypes` 迁移为 TS 常量 + `roomTypesOf(hotelId)`；`mockHotels` 每条含 minPrice=Number
  - `mocks/calendar.ts`: `buildCalendar(roomTypeId, basePrice, stock, startISO, endISO)`：逐日；周六/周日价=base+80/40（周六上浮演示）；第 n 天 `n%9===0` 满房 `availableStock=0`、`n%23===0` 关房 `status=0`；返回 `CalendarRow[]`（price number）
  - `mocks/operate.ts`: banner/公告示例 2~3 条（结构=types）
  - `accommodation.ts`/`operate.ts`: `USE_MOCK ? mock : real(http…)`；**mock 与 real 返回结构都过同一归一**：real search → `(d.list||[]).map(normHotel)`；mock 走 `mocks` 常量。real `roomCalendar` → 后端行 `Number(price)`；mock → `buildCalendar`。real `hotelDetail` → `{ info: normHotel(info), roomTypes: (roomTypes||[]).map(Number price) }`；mock → mocks。`searchHotels(q)` mock 实现支持 keyword/style/rating/sort 过滤（与原型 list 逻辑一致）
- [ ] **Step 4: 跑测试**：`npm test` GREEN（3 个 spec）；`npm run type-check` 0 error
- [ ] **Step 5: Commit**

```bash
git add wudong-web/src
git commit -m "feat(wudong-web): 数据层 http/types/mocks + accommodation/operate api（real+mock 同构）"
```

---

### Task 3: 共享组件（7 个）

**Files:**
- Create: `src/components/BannerCarousel.vue`、`Ticker.vue`、`HotelCard.vue`、`FilterBar.vue`、`RoomCard.vue`、`CalendarTable.vue`、`ComingSoonTag.vue`
- Test: `src/components/BannerCarousel.spec.ts`、`src/components/HotelCard.spec.ts`、`src/components/CalendarTable.spec.ts`

**组件接口（供 Task 4-6 消费）：**
- `BannerCarousel { banners: Banner[] }` emits 自动轮播（4.5s）＋prev/next/圆点；无图给底色
- `Ticker { items: Announcement[] }`（取第一条标题+内容）
- `HotelCard { hotel: Hotel }` emits `click`
- `FilterBar { modelValue: HotelQuery }` emits `update:modelValue` 与 `search`；含关键字 input、风格 chips（props `styles: string[]`）、评分/排序 select
- `RoomCard { room: RoomType; disabled?: boolean }` emits `book`、`viewCalendar`；预订按钮禁用态+ComingSoonTag
- `CalendarTable { rows: CalendarRow[]; loading: boolean }` 表格渲染：日期(中文 `M月D日`)/星期(周X)/价格 ¥N.NN/状态（可订→`剩 N 间`、满→`已满`、status0→`不可订`）；空态文案
- `ComingSoonTag` 纯展示（gold 胶囊 "即将上线"）

**实现约束**：模板与样式从原型对应区块迁移并 scoped（原型 class 参照：`.hero*`、`.ticker`、`.hotel-card`、`.filters/.chip`、`.room-card`、`.calendar-table/.off/.full/.money`、`.badge-coming`）；props/events 见上；组件内不 import api/mocks（纯展示，数据由父级注入）→ 便于单测。

- [ ] **Step 1: 写失败测试**

`src/components/CalendarTable.spec.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import CalendarTable from './CalendarTable.vue';
const rows = [
  { date: '2026-09-10', price: 380, availableStock: 2, status: 1 },
  { date: '2026-09-11', price: 380, availableStock: 0, status: 1 },
  { date: '2026-09-12', price: 380, availableStock: 2, status: 0 }
];
describe('CalendarTable', () => {
  it('渲染 可订/已满/不可订 三态与价格', () => {
    const w = mount(CalendarTable, { props: { rows, loading: false } });
    expect(w.text()).toContain('剩 2 间');
    expect(w.text()).toContain('已满');
    expect(w.text()).toContain('不可订');
    expect(w.text()).toContain('¥380.00');
  });
  it('空态显示文案', () => {
    const w = mount(CalendarTable, { props: { rows: [], loading: false } });
    expect(w.text()).toContain('暂无');
  });
});
```

`src/components/HotelCard.spec.ts`: mount 卡（mock hotel）断言名称/地址/评分/起价文本与 click emit。
`src/components/BannerCarousel.spec.ts`: 给 3 banner，断言当前图 title 与切换按钮存在；`vi.useFakeTimers` 推进后标题轮换。

- [ ] **Step 2: 跑测试确认红**：`npm test` → 组件文件缺失/断言失败
- [ ] **Step 3: 实现 7 组件**（模板/样式按原型迁移 + props 化；scoped styles；图片 onerror 显示占位背景）
- [ ] **Step 4: 跑测试 + 类型**：`npm test` GREEN；`npm run type-check` 0 error
- [ ] **Step 5: Commit**

```bash
git add wudong-web/src/components
git commit -m "feat(wudong-web): 共享组件（轮播/卡片/筛选/房态表等）含渲染单测"
```

---

### Task 4: 首页视图 + hotel store

**Files:**
- Create: `src/stores/hotel.ts`、`src/views/home/HomeView.vue`
- Modify: `src/router/index.ts`（`/` → HomeView 真实实现）
- Test: `src/views/home/HomeView.spec.ts`

**Interfaces:** `stores/hotel.ts` 暴露 `useHotelStore()`：`state { featured: Hotel[]; loadingFeatured: boolean }`、`action loadFeatured()（searchHotels({ size:3, sort:'rating' })，3 条）`。页面只读 store + api/operate。

- [ ] **Step 1: 写失败测试**（注入 mock：`vi.mock('../api/operate')` 与 `vi.mock('../api/accommodation')` 令其返回常量）

```ts
// HomeView.spec.ts
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import HomeView from './HomeView.vue';

vi.mock('../api/operate', () => ({
  banners: vi.fn().mockResolvedValue([{ title: '苗寨金秋', image: 'x.jpg', linkType: 'page', linkValue: '/', position: 'home', sort: 1 }]),
  announcements: vi.fn().mockResolvedValue([{ title: '公告', content: '欢迎来乌东', type: 1, isTop: 1 }])
}));
vi.mock('../api/accommodation', () => ({
  searchHotels: vi.fn().mockResolvedValue([{ id: 1, name: '乌东苗寨木楼', address: '雷山', styleTags: ['苗寨'], facilityTags: [], mainImage: 'a.jpg', images: [], intro: '', rating: 4.8, reviewCount: 1, minPrice: 380, checkInTime: '14:00', checkOutTime: '12:00' }])
}));

describe('HomeView', () => {
  beforeEach(() => setActivePinia(createPinia()));
  it('渲染轮播标题、公告、精选民宿与预订占位', async () => {
    const w = mount(HomeView, { global: { plugins: [createPinia()] } });
    await flushPromises();
    expect(w.text()).toContain('苗寨金秋');
    expect(w.text()).toContain('欢迎来乌东');
    expect(w.text()).toContain('乌东苗寨木楼');
    expect(w.text()).toContain('即将上线');
  });
});
```

- [ ] **Step 2: 红**：`npm test -- HomeView` FAIL
- [ ] **Step 3: 实现**：`stores/hotel.ts`（loadFeatured）；`HomeView.vue`：onMounted `loadHome()`（并行 banners/announcements/loadFeatured）；模板含 Hero（`<BannerCarousel>`）、`<Ticker>`、精选 `<HotelCard @click=去详情>`、ComingSoon CTA 禁用按钮（原型"来乌东住一宿"区块迁移）；loading/失败态提示。路由点击 `router.push('/hotels/:id')` 见 Task 6 先导至列表
- [ ] **Step 4: 绿 + 类型**：`npm test` GREEN；`npm run type-check` 0 error
- [ ] **Step 5: Commit**

```bash
git add wudong-web/src/stores wudong-web/src/views/home
git commit -m "feat(wudong-web): 首页（轮播/公告/精选/预订占位）+ hotel store"
```

---

### Task 5: 民宿列表页（URL 同步筛选）

**Files:**
- Create: `src/views/accommodation/HotelListView.vue`
- Create: `src/utils/query.ts`（`parseHotelQuery(search): HotelQuery`、`toQueryString(q): string`——可测）
- Modify: `src/router/index.ts`（`/hotels` 指向真实页）
- Test: `src/utils/query.spec.ts`、`src/views/accommodation/HotelListView.spec.ts`

**Interfaces:** `query.ts`: `parseHotelQuery('?keyword=a&style=苗寨&rating=4.5&sort=price') → {keyword:'a',styleTags:'苗寨',rating:4.5,sort:'price'}`；`toQueryString` 反向（只含非空字段，encodeURIComponent）。

- [ ] **Step 1: 写失败测试**

```ts
// query.spec.ts
import { describe, expect, it } from 'vitest';
import { parseHotelQuery, toQueryString } from './query';
describe('query 序列化', () => {
  it('parse 返回归一对象', () => {
    expect(parseHotelQuery('?keyword=%E8%8B%97&style=苗寨&rating=4.5&sort=price')).toEqual(
      { keyword: '苗', styleTags: '苗寨', rating: 4.5, sort: 'price' }
    );
  });
  it('toQueryString 忽略空值并编码', () => {
    expect(toQueryString({ keyword: '', styleTags: '苗 寨', rating: undefined, sort: 'rating' }))
      .toBe('styleTags=%E8%8B%97%20%E5%AF%A8&sort=rating');
  });
});
```

`HotelListView.spec.ts`：vi.mock api.searchHotels → 列表两民宿；mount（带 router mock? 直接通过 props/注入 window.location? 用真实 router push）。做法：mount 组件，断言调用过 searchHotels、渲染卡片名称、筛选 chip 点击触发 searchHotels 新参数、空列表展示空态。
- [ ] **Step 2: 红**
- [ ] **Step 3: 实现**：列表页（原型列表区迁移）：顶部 FilterBar（绑定 query），URL 初始化 `parseHotelQuery(route.query)`；变更 → `searchHotels` + `router.replace({ query: toQueryString(q) })`；卡片网格 `<HotelCard @click="goDetail(id)">`；展示条数；空态组件文案；loading 骨架
- [ ] **Step 4: 绿 + 类型 + `curl /hotels` dev 可达**
- [ ] **Step 5: Commit**

```bash
git add wudong-web/src
git commit -m "feat(wudong-web): 民宿列表页 + URL 同步筛选（query 工具含单测）"
```

---

### Task 6: 民宿详情页 + 房态日历面板

**Files:**
- Create: `src/views/accommodation/HotelDetailView.vue`
- Modify: `src/router/index.ts`（`/hotels/:id`）
- Test: `src/views/accommodation/HotelDetailView.spec.ts`（含日历交互）

**行为：** 路由参数 id → `hotelDetail(id)` → info + roomTypes（启用）。房型卡 `RoomCard`：预订禁用+ComingSoonTag；"查看房态"选中房型 → 拉 `roomCalendar(roomTypeId, today, today+range-1)`，`range` 取 `?range=7|30`（默认 30，头按钮切换 7/30）。`CalendarTable` 展示。

- [ ] **Step 1: 写失败测试**

```ts
// HotelDetailView.spec.ts（mock api）
vi.mock('../api/accommodation', () => ({
  hotelDetail: vi.fn().mockResolvedValue({
    info: { id: 9, name: '乌东苗寨木楼', address: '雷山', styleTags: ['苗寨'], facilityTags: ['WiFi'], mainImage: 'a.jpg', intro: '木楼', rating: 4.8, reviewCount: 2, minPrice: 380, checkInTime: '14:00', checkOutTime: '12:00' },
    roomTypes: [
      { id: 1, hotelId: 9, name: '木屋大床房', bedType: '大床', maxGuests: 2, price: 380, stock: 3 },
      { id: 2, hotelId: 9, name: '双床房', bedType: '双床', maxGuests: 2, price: 520, stock: 2 }
    ]
  }),
  roomCalendar: vi.fn().mockResolvedValue([
    { date: '2026-09-10', price: 380, availableStock: 2, status: 1 },
    { date: '2026-09-11', price: 520, availableStock: 0, status: 1 }
  ])
}));
// it: 渲染详情名/两房型；点第 1 房型"查看房态"→ flushPromises 后表含 "¥380.00"/日期；"预订"按钮 disabled 且含即将上线文案
```

（路由注入：`mount(DetailView,{ global:{ plugins:[pinia, { install(app){ app.provide('route', {params:{id:9}, query:{}})} }] } })`——或包一层 `<RouterView>` 真路由；**用真 router 推到 /hotels/9 更稳**，详见 Step 3 注）
- [ ] **Step 2: 红**
- [ ] **Step 3: 实现**：详情视图按原型 detail 区块迁移：详情头图/信息块；房型 `<RoomCard>` 列；日历 `<CalendarTable>` + 7/30 切换（改 range 重新 fetch）；用 `useRoute` 读 `params.id` 与 `query.range`；返回列表按钮 `router.push('/hotels')`；日历失败/loading/空态
- [ ] **Step 4: 绿 + 类型 + 手动：`npm run dev` 开 `/hotels/9`（mock 或真实皆可看到）**
- [ ] **Step 5: Commit**

```bash
git add wudong-web/src
git commit -m "feat(wudong-web): 民宿详情 + 房态日历面板（7/30 天切换）"
```

---

### Task 7: 收尾（真实联调 + 文档 + build 验收）

**Files:**
- Create: `wudong-web/README.md`（启动/代理/mock 开关/目录/接入新模块指南）
- （如 type-check 余留）修正

- [ ] **Step 1: 全量验证**：`npm test`（全绿）；`npm run type-check` 0 error；`npm run build` 通过（产物 dist/）
- [ ] **Step 2: 真实联调**（后端 8001 在 feature/accommodation-operate 上运行且 cool 库已含演示数据时）：`npm run dev`，浏览器/curl 走：
  - `http://localhost:5173/`（真实 banner/公告/精选）
  - `curl "http://localhost:5173/hotels?style=苗寨"`（真实 search 经代理）
  - `/hotels/:id` 详情与日历（真实行，动态定价/满房/关房可见）
  当 8001 未运行或数据为空时，`.env.development` 的 `VITE_USE_MOCK=false` → 页面报错态而非静默 mock；`npm run dev -- --mode demo` 走 mock 数据演示
- [ ] **Step 3: 交付自查清单**：三视图可导航、预订禁用占位、空/加载/失败态、路由滚动回顶、URL 参数可分享恢复、mock/真实两模式可切换、代码仅存在于 wudong-web/**
- [ ] **Step 4: Commit**

```bash
git add wudong-web
git commit -m "docs(wudong-web): README 与收尾（真实联调/build 验收通过）"
```

---

# 测试运行与验收约定（执行者必读）

- 本工程与后端 dev(8001)、管理端(9000) 无端口冲突；`wudong-web` 起 5173。vitest/jsdom 单测不需要后端；真实联调才需 8001
- 类型：每 Task `npm run type-check`（strict）0 error；测试 `npm test`（vitest run，单测只依赖 mock/同构数据）
- mock 数据与真实后端返回必须同构；**api 层负责 `Number()` 归一**，组件只消费 `number`
- 只新增 `wudong-web/**` 文件（+docs 已含）；提交均在分支 `feature/wudong-web`，勿把 cool-admin-*/docs 其它改动带入本分支提交

# 非目标（勿越界）
- 不做登录/收藏/下单/支付/入住码/评价（member 白名单扩展与 order/pay 属 base，未落地）
- 不加 UI 组件库/SSR/移动适配/分页
- 不改后端/管理端/其它仓库目录
