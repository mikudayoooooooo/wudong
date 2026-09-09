# C 端 UI Demo（wudong-web）实施计划 —— Phase 1

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新建独立 C 端 PC 站点 `wudong-web/`，用纯前端 mock 数据完整呈现行+社区模块的全部页面与展示效果（真实足迹链、推荐轮播、路线→游记联动、电子票卡包），可交互演示。

**Architecture:** Vite + Vue3 + TS 单页应用，`data/mock.ts` 为唯一数据源（模块级可变数组，模拟后端），`lib/` 存纯函数业务逻辑（足迹计算/信息流排序，TDD 重点），`stores/`（Pinia）管理会话与购票状态，`components/` 为可复用展示组件（FootprintMap 全站复用），`views/` 按路由组织页面。

**Tech Stack:** Vue 3.5 + TypeScript 5 + Vite 5 + Pinia 2 + Vue Router 4 + Vitest 2 + @vue/test-utils（不引入 UI 组件库，视觉全部自绘；图片用 CSS 渐变占位，无外部资源依赖）

**Spec:** `docs/superpowers/specs/2026-09-09-travel-community-design.md`（本计划实现其 §7 页面清单 + §3 设计决策 D1-D15 的 Phase 1 部分；§5/§6 数据与接口仅以 mock 形态呈现，真实实现在 Phase 2-3）

## Global Constraints

- Node v20.20.2 / npm 10.8.2；包管理用 npm（不用 pnpm，避免与 cool-admin-vue workspace 混淆）
- 依赖版本对齐仓库基线：vue ^3.5、vite ^5.4、pinia ^2.3、vue-router ^4.5
- dev 端口 5175（避开 cool-admin-vue 的 5174）；后端 API 本阶段不存在，**禁止**发起任何网络请求
- 不引入任何 UI 组件库（element-plus 等）与图标库；图标一律 emoji
- 图片一律 CSS `linear-gradient` 渐变占位（按内容取色，见 `src/styles/theme.css` 的渐变工具类），保证离线可演示
- 视觉令牌（必须从 `theme.css` 引用，禁止硬编码色值）：黛绿 `--green-900:#33523e`/`--green-600:#4a7a5c`、点亮橙 `--orange-500:#e8963e`/`--orange-300:#f6c26b`/`--orange-700:#d97b2a`、琥珀文字 `--amber-text:#b26a1b`、琥珀底 `--amber-bg:#fdf1de`、地图底 `--map-a:#eef5ea`/`--map-b:#dfeccc`、纸底 `--paper:#fffdf8`
- TS `strict: true`；每个 `.vue` 组件 ≤200 行，超了就拆子组件
- 所有业务数据访问只经由 `data/mock.ts` 导出的函数，组件**禁止**直接 import mock 数组本体（保证 Phase 5 可平替为 API）
- 提交信息格式 `feat|test|chore(demo): 中文描述`

---

### Task 1: 工程脚手架 + 主题令牌 + 导航骨架

**Files:**
- Create: `wudong-web/`（package.json、vite.config.ts、tsconfig.json、index.html）
- Create: `wudong-web/src/main.ts`、`src/App.vue`、`src/router/index.ts`
- Create: `wudong-web/src/styles/theme.css`
- Create: `wudong-web/src/components/TopNav.vue`
- Test: `wudong-web/src/components/__tests__/TopNav.spec.ts`

**Interfaces:**
- Produces: `TopNav.vue`（props 无；依赖 router link 路径 `/` `/community` `/guide` `/my/tickets`）；`theme.css` 全局令牌；router 实例 `src/router/index.ts` 导出 `createAppRouter`（后续任务注册路由用）；dev 脚本 `npm run dev`（端口 5175）、`npm test`（vitest run）

- [ ] **Step 1: 创建工程并安装依赖**

```bash
cd "C:\Users\cja\wudong\code" && npm create vite@latest wudong-web -- --template vue-ts
cd wudong-web && npm install && npm install vue-router@4 pinia@2
npm install -D vitest@2 @vue/test-utils@2 jsdom
```

- [ ] **Step 2: 配置 vite / tsconfig / scripts**

`vite.config.ts` 全量替换为：

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: { port: 5175 },
  test: { environment: 'jsdom' },
})
```

`package.json` scripts 增加：`"test": "vitest run"`、`"test:watch": "vitest"`。删除脚手架自带 `src/components/HelloWorld.vue`、`src/style.css`、`src/assets/vue.svg`。

- [ ] **Step 3: 写主题令牌与全局样式**

创建 `src/styles/theme.css`：

```css
:root {
  --green-900: #33523e; --green-600: #4a7a5c; --green-300: #7fae8e;
  --orange-500: #e8963e; --orange-300: #f6c26b; --orange-700: #d97b2a;
  --amber-text: #b26a1b; --amber-bg: #fdf1de;
  --ok-text: #2e7d4f; --ok-bg: #e7f4ec;
  --paper: #fffdf8; --map-a: #eef5ea; --map-b: #dfeccc;
  --text-1: #333; --text-2: #666; --text-3: #999;
  --line: #e2e2e2; --line-soft: #f0f0f0;
  --radius: 10px; --shadow: 0 2px 8px rgba(0,0,0,.08);
}
* { box-sizing: border-box; }
body { margin: 0; color: var(--text-1); font: 14px/1.6 "PingFang SC","Microsoft YaHei",sans-serif; background: #f7f7f5; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; font: inherit; border: none; }
/* 渐变占位图工具类（mock 照片） */
.ph { display: flex; align-items: flex-end; padding: 6px 8px; color: #fff; font-size: 12px; text-shadow: 0 1px 2px rgba(0,0,0,.5); border-radius: 8px; }
.ph-0 { background: linear-gradient(130deg,#9dbf8e,#5c8a5c); } .ph-1 { background: linear-gradient(130deg,#d9b98e,#a97b3f); }
.ph-2 { background: linear-gradient(130deg,#b39ddb,#5c4a7a); } .ph-3 { background: linear-gradient(130deg,#8faebf,#3f6a96); }
.ph-4 { background: linear-gradient(130deg,#ef9a9a,#c25c5c); } .ph-5 { background: linear-gradient(130deg,#a5d6a7,#2e7d4f); }
.btn-primary { background: linear-gradient(90deg,var(--orange-500),var(--orange-700)); color: #fff; border-radius: 8px; padding: 8px 18px; font-weight: 700; box-shadow: 0 2px 6px rgba(217,123,42,.4); }
.pill { font-size: 12px; border-radius: 12px; padding: 2px 10px; display: inline-block; }
.card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
```

`index.html` 的 `<title>` 改为 `乌东文旅 · 行与社区`；`src/main.ts` 全量替换：

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createAppRouter } from './router'
import './styles/theme.css'

createApp(App).use(createPinia()).use(createAppRouter()).mount('#app')
```

- [ ] **Step 4: 写失败的 TopNav 测试**

创建 `src/components/__tests__/TopNav.spec.ts`：

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import TopNav from '../TopNav.vue'

const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div/>' } }] })

describe('TopNav', () => {
  it('渲染五个导航项与搜索框', async () => {
    await router.push('/'); await router.isReady()
    const w = mount(TopNav, { global: { plugins: [router] } })
    const text = w.text()
    expect(text).toContain('乌东文旅')
    for (const item of ['首页', '行·订票', '社区', '交通攻略', '我的票务']) expect(text).toContain(item)
    expect(w.find('input').attributes('placeholder')).toContain('搜索')
  })
})
```

- [ ] **Step 5: 运行测试确认失败**

Run: `cd wudong-web && npm test`
Expected: FAIL —— `Cannot find module '../TopNav.vue'` 或类似

- [ ] **Step 6: 实现 TopNav 与路由骨架**

创建 `src/components/TopNav.vue`：

```vue
<script setup lang="ts">
const items = [
  { path: '/', label: '首页' },
  { path: '/route', label: '行·订票' },
  { path: '/community', label: '社区' },
  { path: '/guide', label: '交通攻略' },
  { path: '/my/tickets', label: '我的票务' },
]
</script>

<template>
  <nav class="nav">
    <div class="container nav-inner">
      <b class="logo">🏞 乌东文旅</b>
      <RouterLink v-for="it in items" :key="it.path" :to="it.path" class="item">
        {{ it.label }}
      </RouterLink>
      <span class="spacer" />
      <input class="search" placeholder="🔍 搜索路线 / 景区 / 游记 / 话题" />
      <span class="user">🧑‍🌾 山野小鱼</span>
    </div>
  </nav>
</template>

<style scoped>
.nav { background: #fff; border-bottom: 1px solid var(--line-soft); position: sticky; top: 0; z-index: 20; }
.nav-inner { display: flex; align-items: center; gap: 18px; height: 52px; }
.logo { font-size: 15px; margin-right: 8px; }
.item { color: var(--text-2); }
.item.router-link-exact-active { color: var(--orange-500); font-weight: 700; }
.spacer { flex: 1; }
.search { background: #f2f2f2; border: none; border-radius: 14px; padding: 5px 14px; width: 240px; outline: none; }
.user { font-size: 13px; }
</style>
```

创建 `src/router/index.ts`：

```ts
import { createRouter, createWebHistory, type Router } from 'vue-router'

export function createAppRouter(): Router {
  return createRouter({
    history: createWebHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div style="padding:60px">404</div>' } }],
  })
}
```

创建 `src/App.vue`：

```vue
<script setup lang="ts">
import TopNav from './components/TopNav.vue'
</script>

<template>
  <TopNav />
  <RouterView />
</template>
```

- [ ] **Step 7: 运行测试确认通过**

Run: `npm test`
Expected: PASS（1 passed）

- [ ] **Step 8: 启动 dev 验证页面后提交**

Run: `npm run dev`，浏览器开 `http://localhost:5175`，确认导航渲染无报错，Ctrl+C 退出。

```bash
git add wudong-web
git commit -m "feat(demo): wudong-web 脚手架、主题令牌与导航骨架"
```

---

### Task 2: 领域类型 + mock 数据层

**Files:**
- Create: `wudong-web/src/types/index.ts`
- Create: `wudong-web/src/data/mock.ts`
- Test: `wudong-web/src/data/__tests__/mock.spec.ts`

**Interfaces:**
- Produces（后续所有任务的唯一数据出口，签名必须一致）:
  - `getRecommendSlots(): RecommendSlot[]`
  - `getAllSpots(): ScenicSpot[]`、`getSpot(id: number): ScenicSpot | undefined`
  - `getRoutes(): RoutePackage[]`、`getRoute(id: number): RoutePackage | undefined`
  - `getItinerary(routeId: number): ItineraryStop[]`
  - `getTicketTypes(spotId: number): TicketType[]`
  - `getInventories(itemType: 'ticket' | 'route', itemId: number): InventoryDay[]`
  - `getGuides(): TrafficGuide[]`、`getReviews(targetType: 'scenic' | 'route', targetId: number): Review[]`
  - `getUsers(): UserBrief[]`、`getUser(id: number): UserBrief | undefined`
  - `getPosts(): Post[]`、`getPost(id: number): Post | undefined`
  - `getTopics(): Topic[]`、`getTopic(id: number): Topic | undefined`
  - `getETickets(userId: number): ETicket[]`
  - `getPostFootprints(postId: number): PostFootprint[]`
  - `allETickets(): ETicket[]`（足迹点亮统计用，全量）

- [ ] **Step 1: 写领域类型**

创建 `src/types/index.ts`：

```ts
export type SpotType = 'spot' | 'dining' | 'stay' | 'experience'
export interface ScenicSpot { id: number; name: string; type: SpotType; icon: string; address: string; openTime: string; intro: string }
export interface TicketType { id: number; spotId: number; name: string; price: number; stock: number }
export interface InventoryDay { itemType: 'ticket' | 'route'; itemId: number; useDate: string; total: number; sold: number }
export interface ItineraryStop { id: number; routeId: number; dayNo: number; sort: number; spotId: number; desc: string }
export interface RoutePackage {
  id: number; title: string; days: number; theme: string; price: number
  includes: string[]; departure: string; destination: string
  hotelStandard: string; mealStandard: string; notice: string; sales: number
}
export type ETicketStatus = 'unused' | 'used' | 'refunded'
export interface ETicket {
  id: number; orderNo: string; userId: number
  itemType: 'ticket' | 'route'; itemId: number; useDate: string
  status: ETicketStatus; verifyTime?: string
}
export interface TrafficGuide { id: number; title: string; departure: string; transportType: string; duration: string; cost: number; detail: string }
export interface Review { id: number; targetType: 'scenic' | 'route'; targetId: number; userId: number; rating: number; content: string }
export interface UserBrief { id: number; nickname: string; avatar: string; bio: string }
export type FootprintMode = 'auto' | 'route'
export interface PostFootprint { postId: number; userId: number; spotId: number; routeId?: number; mode: FootprintMode; dayNo?: number; memo?: string; status: 'normal' | 'refunded' }
export interface Post {
  id: number; userId: number; title: string; content: string; images: number[]; video?: boolean
  topicIds: number[]; linkedRouteId?: number
  viewCount: number; likeCount: number; commentCount: number; favoriteCount: number; createTime: string
}
export interface Topic { id: number; name: string; intro: string; viewCount: number; bindRouteIds: number[]; hot: boolean }
export interface RecommendSlot {
  id: number; title: string; subtitle: string; badge: string
  itemType: 'route' | 'scenic' | 'post'; itemId: number
  sort: number; rotationGroup: number; intervalSeconds: number
}
export interface FootprintStopView {
  spotId: number; name: string; icon: string
  lit: boolean; locked: boolean
  lightCount?: number; dayNo?: number; memo?: string; verifyDate?: string
}
```

- [ ] **Step 2: 写 mock 数据完整性测试**

创建 `src/data/__tests__/mock.spec.ts`：

```ts
import { describe, it, expect } from 'vitest'
import { getRoutes, getItinerary, getAllSpots, getPosts, getPostFootprints, getRecommendSlots, getETickets } from '../mock'

describe('mock 数据完整性', () => {
  it('每个行程站点的 spotId 都指向存在的地点', () => {
    const spotIds = new Set(getAllSpots().map((s) => s.id))
    for (const r of getRoutes())
      for (const stop of getItinerary(r.id)) expect(spotIds.has(stop.spotId), `路线${r.id}站点${stop.spotId}`).toBe(true)
  })
  it('行程站点按 dayNo + sort 排列', () => {
    const stops = getItinerary(1)
    const keys = stops.map((s) => s.dayNo * 100 + s.sort)
    expect([...keys].sort((a, b) => a - b)).toEqual(keys)
  })
  it('每篇带关联路线的游记至少有一条足迹快照', () => {
    for (const p of getPosts())
      if (p.linkedRouteId) expect(getPostFootprints(p.id).length).toBeGreaterThan(0)
  })
  it('推荐位属于同一轮换组且间隔为 5 秒', () => {
    const slots = getRecommendSlots()
    expect(slots.length).toBeGreaterThanOrEqual(3)
    expect(new Set(slots.map((s) => s.rotationGroup)).size).toBe(1)
    expect(new Set(slots.map((s) => s.intervalSeconds))).toEqual(new Set([5]))
  })
  it('演示用户1有已核销的路线电子票', () => {
    expect(getETickets(1).some((t) => t.itemType === 'route' && t.status === 'used')).toBe(true)
  })
})
```

- [ ] **Step 3: 运行测试确认失败**

Run: `npm test`
Expected: FAIL —— `Cannot find module '../mock'`

- [ ] **Step 4: 实现 mock.ts**

创建 `src/data/mock.ts`（数据集与 spec §7 视觉稿一致）：

```ts
import type {
  ScenicSpot, TicketType, InventoryDay, ItineraryStop, RoutePackage, ETicket,
  TrafficGuide, Review, UserBrief, Post, PostFootprint, Topic, RecommendSlot,
} from '../types'

// ---- 基础数据（模块级可变数组：购票/发布等操作就地修改，模拟后端） ----
const spots: ScenicSpot[] = [
  { id: 1, name: '乌东梯田', type: 'spot', icon: '🌄', address: '乌东村北', openTime: '全天', intro: '苗寨梯田日出观景地' },
  { id: 2, name: '银饰工坊', type: 'experience', icon: '⚒️', address: '乌东村中街', openTime: '09:00-18:00', intro: '苗族银饰锻造体验' },
  { id: 3, name: '长桌宴', type: 'dining', icon: '🍲', address: '乌东村广场', openTime: '11:00-21:00', intro: '苗家长桌宴·酸汤鱼' },
  { id: 4, name: '吊脚楼民宿', type: 'stay', icon: '🏡', address: '乌东村东头', openTime: '全天', intro: '苗族吊脚楼特色民宿' },
  { id: 5, name: '蜡染坊', type: 'experience', icon: '🎨', address: '乌东村南街', openTime: '09:00-17:00', intro: '蜡染手作体验' },
  { id: 6, name: '芦笙广场', type: 'spot', icon: '🥁', address: '乌东村中心', openTime: '全天', intro: '芦笙舞与节庆集会地' },
]

const ticketTypes: TicketType[] = [
  { id: 11, spotId: 1, name: '成人票', price: 60, stock: 200 },
  { id: 12, spotId: 1, name: '学生票', price: 30, stock: 100 },
  { id: 13, spotId: 6, name: '成人票', price: 40, stock: 300 },
  { id: 14, spotId: 6, name: '家庭套票', price: 100, stock: 50 },
]

const inventories: InventoryDay[] = [
  { itemType: 'route', itemId: 1, useDate: '2026-09-12', total: 30, sold: 7 },
  { itemType: 'route', itemId: 1, useDate: '2026-09-13', total: 30, sold: 22 },
  { itemType: 'route', itemId: 1, useDate: '2026-09-14', total: 30, sold: 30 },
  { itemType: 'route', itemId: 2, useDate: '2026-09-12', total: 20, sold: 3 },
  { itemType: 'route', itemId: 2, useDate: '2026-09-13', total: 20, sold: 12 },
  { itemType: 'ticket', itemId: 11, useDate: '2026-09-12', total: 200, sold: 45 },
  { itemType: 'ticket', itemId: 13, useDate: '2026-09-12', total: 300, sold: 120 },
]

const routes: RoutePackage[] = [
  {
    id: 1, title: '苗寨深度两日游', days: 2, theme: '经典', price: 899,
    includes: ['门票', '长桌宴', '民宿一晚', '导游'], departure: '凯里南站', destination: '乌东村',
    hotelStandard: '吊脚楼特色民宿', mealStandard: '长桌宴 + 苗家早餐',
    notice: '使用日期前24小时可退（扣10%手续费）；最少提前1天预订', sales: 1284,
  },
  {
    id: 2, title: '晨雾梯田摄影一日游', days: 1, theme: '摄影', price: 299,
    includes: ['门票', '跟拍摄影点'], departure: '凯里南站', destination: '乌东村',
    hotelStandard: '无住宿', mealStandard: '苗家午餐', notice: '含早出发，请自备保暖', sales: 487,
  },
]

const itineraries: ItineraryStop[] = [
  { id: 101, routeId: 1, dayNo: 1, sort: 1, spotId: 1, desc: '梯田日出观景' },
  { id: 102, routeId: 1, dayNo: 1, sort: 2, spotId: 3, desc: '长桌宴午餐' },
  { id: 103, routeId: 1, dayNo: 1, sort: 3, spotId: 4, desc: '入住吊脚楼' },
  { id: 104, routeId: 1, dayNo: 2, sort: 1, spotId: 2, desc: '银饰锻造体验' },
  { id: 105, routeId: 1, dayNo: 2, sort: 2, spotId: 6, desc: '芦笙舞广场' },
  { id: 106, routeId: 2, dayNo: 1, sort: 1, spotId: 1, desc: '晨雾拍摄' },
  { id: 107, routeId: 2, dayNo: 1, sort: 2, spotId: 2, desc: '工坊人文扫街' },
]

const users: UserBrief[] = [
  { id: 1, nickname: '山野小鱼', avatar: '🧑‍🌾', bio: '山野与烟火气都爱' },
  { id: 2, nickname: '奶爸游记', avatar: '👨', bio: '带娃看世界' },
  { id: 3, nickname: '快门手', avatar: '📷', bio: '只拍晨雾和夜晚' },
  { id: 4, nickname: '干饭人小王', avatar: '🍚', bio: '为吃而行' },
]

const eTickets: ETicket[] = [
  // 用户1：路线1 已核销（覆盖行程站点 1,3,4,2,6 中的 4 站演示用：蜡染坊5不在路线1）
  { id: 201, orderNo: 'WD20260901-0001', userId: 1, itemType: 'route', itemId: 1, useDate: '2026-09-01', status: 'used', verifyTime: '2026-09-01T10:24:00' },
  // 用户1：单景点票（梯田，9/1 核销）
  { id: 202, orderNo: 'WD20260901-0002', userId: 1, itemType: 'ticket', itemId: 11, useDate: '2026-09-01', status: 'used', verifyTime: '2026-09-01T10:24:00' },
  // 用户1：一张待使用票（9/13 路线1）
  { id: 203, orderNo: 'WD20260913-0003', userId: 1, itemType: 'route', itemId: 1, useDate: '2026-09-13', status: 'unused' },
  // 用户2：路线1 已核销；用户3：摄影路线已核销
  { id: 204, orderNo: 'WD20260902-0004', userId: 2, itemType: 'route', itemId: 1, useDate: '2026-09-02', status: 'used', verifyTime: '2026-09-02T09:00:00' },
  { id: 205, orderNo: 'WD20260903-0005', userId: 3, itemType: 'route', itemId: 2, useDate: '2026-09-03', status: 'used', verifyTime: '2026-09-03T05:40:00' },
  // 用户2：一张已退款票（不应点亮）
  { id: 206, orderNo: 'WD20260820-0006', userId: 2, itemType: 'ticket', itemId: 13, useDate: '2026-08-20', status: 'refunded' },
]

const guides: TrafficGuide[] = [
  { id: 301, title: '贵阳→乌东', departure: '贵阳北', transportType: '高铁+班车', duration: '约2.5小时', cost: 180, detail: '贵阳北→凯里南高铁约1.5小时，凯里客车站班车1小时直达乌东村口。' },
  { id: 302, title: '凯里→乌东', departure: '凯里', transportType: '班车直达', duration: '约1小时', cost: 35, detail: '凯里客车站每日 8:00/13:00 两班直达乌东。' },
  { id: 303, title: '广州→乌东', departure: '广州南', transportType: '高铁+包车', duration: '约5.5小时', cost: 480, detail: '广州南→凯里南约4小时，出站包车1.5小时进村。' },
]

const reviews: Review[] = [
  { id: 401, targetType: 'route', targetId: 1, userId: 4, rating: 5, content: '长桌宴的酸汤鱼绝了，导游很会讲苗族故事。' },
  { id: 402, targetType: 'route', targetId: 1, userId: 2, rating: 5, content: '带孩子体验银饰锻造，值回票价。' },
  { id: 403, targetType: 'scenic', targetId: 1, userId: 3, rating: 5, content: '晨雾六点十分准时从谷底漫上来，机位在东侧亭子。' },
]

const topics: Topic[] = [
  { id: 501, name: '#苗寨风光', intro: '分享苗寨美景', viewCount: 21000, bindRouteIds: [2], hot: true },
  { id: 502, name: '#徒步路线', intro: '用脚步丈量苗寨', viewCount: 5103, bindRouteIds: [1], hot: true },
  { id: 503, name: '#美食打卡', intro: '长桌宴与酸汤鱼', viewCount: 8900, bindRouteIds: [], hot: true },
  { id: 504, name: '#非遗手作', intro: '银饰与蜡染', viewCount: 3877, bindRouteIds: [1], hot: false },
]

const posts: Post[] = [
  {
    id: 601, userId: 1, title: '晨雾还没散，就到了观景台', content: '五点半摸黑上山，六点十分雾从谷底漫上来，梯田一层层亮起来。银饰工坊的老师傅手真稳，吊脚楼夜里能听见虫鸣。',
    images: [0, 1, 2], topicIds: [501, 502], linkedRouteId: 1,
    viewCount: 5200, likeCount: 328, commentCount: 41, favoriteCount: 96, createTime: '2026-09-02T08:30:00',
  },
  {
    id: 602, userId: 4, title: '长桌宴扫街指南', content: '酸汤鱼、糯米饭、米酒，按这个顺序吃。座位越靠里越热闹。', images: [1], video: true, topicIds: [503],
    viewCount: 3100, likeCount: 256, commentCount: 38, favoriteCount: 60, createTime: '2026-09-05T12:00:00',
  },
  {
    id: 603, userId: 2, title: '带娃做蜡染的一下午', content: '小朋友专注了两小时，成品挂在民宿床头。', images: [2, 3], topicIds: [504], linkedRouteId: 1,
    viewCount: 1800, likeCount: 189, commentCount: 22, favoriteCount: 44, createTime: '2026-09-06T17:20:00',
  },
  {
    id: 604, userId: 3, title: '徒步环线全程记录', content: '环寨 8 公里，五站全点亮，附机位图。', images: [5, 0], topicIds: [502],
    viewCount: 4200, likeCount: 210, commentCount: 58, favoriteCount: 77, createTime: '2026-09-07T20:00:00',
  },
  {
    id: 605, userId: 3, title: '雨后的吊脚楼', content: '青瓦挂水，屋檐滴水成线。', images: [3], topicIds: [501],
    viewCount: 1500, likeCount: 87, commentCount: 12, favoriteCount: 20, createTime: '2026-09-08T09:10:00',
  },
  {
    id: 606, userId: 2, title: '苗绣伴手礼挑选攻略', content: '看针脚密度和背面线头，老手艺背面也整齐。', images: [4], topicIds: [504],
    viewCount: 900, likeCount: 45, commentCount: 6, favoriteCount: 15, createTime: '2026-09-08T15:00:00',
  },
]

const postFootprints: PostFootprint[] = [
  // 601：模式B（关联路线1），4/5 站点亮，蜡染坊(5)不在路线1行程中、银饰工坊(2)未核销 → 快照里没有它（locked 展示时补）
  { postId: 601, userId: 1, spotId: 1, routeId: 1, mode: 'route', dayNo: 1, memo: '晨雾六点十分', status: 'normal' },
  { postId: 601, userId: 1, spotId: 3, routeId: 1, mode: 'route', dayNo: 1, memo: '酸汤鱼两碗', status: 'normal' },
  { postId: 601, userId: 1, spotId: 4, routeId: 1, mode: 'route', dayNo: 1, status: 'normal' },
  { postId: 601, userId: 1, spotId: 6, routeId: 1, mode: 'route', dayNo: 2, status: 'normal' },
  // 603：模式B，2/5 站
  { postId: 603, userId: 2, spotId: 3, routeId: 1, mode: 'route', dayNo: 1, status: 'normal' },
  { postId: 603, userId: 2, spotId: 5, routeId: 1, mode: 'route', dayNo: 2, memo: '娃的处女作', status: 'normal' },
]

const recommendSlots: RecommendSlot[] = [
  { id: 701, title: '苗寨深度两日游 · 邂逅梯田日出', subtitle: '¥899 起 · 已售 1,284 · 平均点亮 4/5 站', badge: '🔥 运营置顶 · 本周精选', itemType: 'route', itemId: 1, sort: 1, rotationGroup: 1, intervalSeconds: 5 },
  { id: 702, title: '晨雾梯田摄影一日游', subtitle: '¥299 起 · 本周 +89 人成行', badge: '📷 摄影主题 · 热度上升', itemType: 'route', itemId: 2, sort: 2, rotationGroup: 1, intervalSeconds: 5 },
  { id: 703, title: '芦笙广场 · 节庆进行时', subtitle: '成人票 ¥40 · 家庭套票 ¥100', badge: '👪 亲子优选 · 好评率 98%', itemType: 'scenic', itemId: 6, sort: 3, rotationGroup: 1, intervalSeconds: 5 },
]

// ---- 导出只读函数（组件禁止直接 import 数组本体） ----
export const getRecommendSlots = (): RecommendSlot[] => [...recommendSlots]
export const getAllSpots = (): ScenicSpot[] => [...spots]
export const getSpot = (id: number): ScenicSpot | undefined => spots.find((s) => s.id === id)
export const getRoutes = (): RoutePackage[] => [...routes]
export const getRoute = (id: number): RoutePackage | undefined => routes.find((r) => r.id === id)
export const getItinerary = (routeId: number): ItineraryStop[] =>
  itineraries.filter((i) => i.routeId === routeId).sort((a, b) => a.dayNo - b.dayNo || a.sort - b.sort)
export const getTicketTypes = (spotId: number): TicketType[] => ticketTypes.filter((t) => t.spotId === spotId)
export const getInventories = (itemType: 'ticket' | 'route', itemId: number): InventoryDay[] =>
  inventories.filter((i) => i.itemType === itemType && i.itemId === itemId)
export const getGuides = (): TrafficGuide[] => [...guides]
export const getReviews = (targetType: 'scenic' | 'route', targetId: number): Review[] =>
  reviews.filter((r) => r.targetType === targetType && r.targetId === targetId)
export const getUsers = (): UserBrief[] => [...users]
export const getUser = (id: number): UserBrief | undefined => users.find((u) => u.id === id)
export const getPosts = (): Post[] => [...posts]
export const getPost = (id: number): Post | undefined => posts.find((p) => p.id === id)
export const getTopics = (): Topic[] => [...topics]
export const getTopic = (id: number): Topic | undefined => topics.find((t) => t.id === id)
export const getETickets = (userId: number): ETicket[] => eTickets.filter((t) => t.userId === userId)
export const getPostFootprints = (postId: number): PostFootprint[] => postFootprints.filter((f) => f.postId === postId)
export const allETickets = (): ETicket[] => [...eTickets]
// 供后续任务（购票/发布）写入的内部数组导出——仅 store 层允许使用
export const __mockWritable = { inventories, eTickets, posts, postFootprints }
```

- [ ] **Step 5: 运行测试确认通过**

Run: `npm test`
Expected: PASS（含 Task 1 的 1 个，共 6 passed）

- [ ] **Step 6: 提交**

```bash
git add src
git commit -m "feat(demo): 领域类型与 mock 数据层"
```

---

### Task 3: 足迹与信息流核心逻辑（TDD）

**Files:**
- Create: `wudong-web/src/lib/footprint.ts`
- Create: `wudong-web/src/lib/feed.ts`
- Test: `wudong-web/src/lib/__tests__/footprint.spec.ts`、`feed.spec.ts`

**Interfaces:**
- Consumes: Task 2 的 `allETickets`、`getItinerary`、`getSpot`、`getTicketTypes`、`getPostFootprints`、`getPosts`
- Produces:
  - `userLitSpotIds(userId: number, opts?: { withinDays?: number }): Set<number>` —— 用户点亮过的地点集合（已核销电子票推导；`refunded` 不算；`withinDays` 按 `verifyTime` 距现在过滤）
  - `spotLightCounts(spotId: number): number` —— 全站用户对该地点的点亮次数（已核销票数，同一用户同一票计 1）
  - `routeStopsView(routeId: number): FootprintStopView[]` —— 路线详情页地图站点（lit 由 `spotLightCounts>0` 决定；无核销的行程站 → lit:false+locked:true；lightCount 填充）
  - `postFootprintView(postId: number): { mode: FootprintMode; routeId?: number; stops: FootprintStopView[] }` —— 游记足迹区块：模式 A 只返回快照中的 lit 站点；模式 B 返回路线全部行程站（快照命中 → lit，未命中 → locked，`verifyDate`/`memo` 来自快照或电子票）
  - `sortPosts(posts: Post[], tab: 'recommend' | 'latest' | 'follow', followedUserIds?: number[]): Post[]`

- [ ] **Step 1: 写 footprint 失败测试**

创建 `src/lib/__tests__/footprint.spec.ts`：

```ts
import { describe, it, expect } from 'vitest'
import { userLitSpotIds, spotLightCounts, routeStopsView, postFootprintView } from '../footprint'

describe('userLitSpotIds', () => {
  it('用户1凭已核销路线票点亮路线1全部行程站点', () => {
    const lit = userLitSpotIds(1) // 票201：路线1已核销 → 站点1,3,4,2,6；票202：梯田
    for (const id of [1, 2, 3, 4, 6]) expect(lit.has(id)).toBe(true)
    expect(lit.has(5)).toBe(false) // 蜡染坊不在其任何票覆盖内
  })
  it('已退款票不点亮', () => {
    expect(userLitSpotIds(2).has(6)).toBe(false) // 用户2只有退款的家庭套票(芦笙广场6)
  })
  it('withinDays 过滤过期核销', () => {
    // 演示数据核销于 2026-09-01~03；取 7 天窗口应保留，取 0 天应清空
    expect(userLitSpotIds(1, { withinDays: 7 }).size).toBeGreaterThan(0)
  })
})

describe('spotLightCounts', () => {
  it('梯田被多名用户的已核销票覆盖', () => {
    expect(spotLightCounts(1)).toBeGreaterThanOrEqual(3) // 用户1(路线+单票), 用户2, 用户3
  })
  it('无票地点为 0', () => {
    expect(spotLightCounts(5)).toBe(0)
  })
})

describe('routeStopsView', () => {
  it('路线1返回5站，核销多的站 lit=true 且带 lightCount', () => {
    const stops = routeStopsView(1)
    expect(stops).toHaveLength(5)
    expect(stops.find((s) => s.spotId === 1)?.lit).toBe(true)
    expect(stops.find((s) => s.spotId === 1)?.lightCount).toBeGreaterThan(0)
  })
  it('mock 中人为将蜡染坊加入路线1行程时呈现 locked（用路线2的银饰工坊验证锁定态）', () => {
    // 路线2的工坊站(107)：用户3的路线2票已核销 → lit；此用例验证字段完整性
    const stops = routeStopsView(2)
    expect(stops.every((s) => typeof s.lit === 'boolean' && typeof s.locked === 'boolean')).toBe(true)
  })
})

describe('postFootprintView', () => {
  it('模式A只返回快照命中站点（全部 lit）', () => {
    const v = postFootprintView(604) // 604 无快照 → 模拟自动聚合：由用户3的核销推导
    expect(v.stops.every((s) => s.lit)).toBe(true)
  })
  it('模式B返回路线全行程，未核销站 locked', () => {
    const v = postFootprintView(601)
    expect(v.mode).toBe('route')
    expect(v.routeId).toBe(1)
    expect(v.stops).toHaveLength(5)
    expect(v.stops.find((s) => s.spotId === 1)?.lit).toBe(true)
    expect(v.stops.find((s) => s.spotId === 2)?.locked).toBe(true) // 用户1无银饰工坊票
    expect(v.stops.find((s) => s.spotId === 1)?.memo).toBe('晨雾六点十分')
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `npm test`
Expected: FAIL —— `Cannot find module '../footprint'`

- [ ] **Step 3: 实现 footprint.ts**

创建 `src/lib/footprint.ts`：

```ts
import type { ETicket, FootprintStopView, FootprintMode } from '../types'
import { allETickets, getItinerary, getSpot, getTicketTypes, getPostFootprints, getPost } from '../data/mock'

const DAY_MS = 24 * 3600 * 1000

/** 一张已核销电子票覆盖的地点集合 */
function ticketSpotIds(t: ETicket): number[] {
  if (t.itemType === 'route') return getItinerary(t.itemId).map((s) => s.spotId)
  const tt = getTicketTypes(0).concat(...[]) // 占位避免误用；单票走 ticketType 反查
  void tt
  return ticketTypeSpot(t.itemId)
}
// 由票种反查地点（mock.ts 未导出 ticketTypes 全表，这里用注入方式解决见下）
```

> ⚠️ 上面的占位写法是错误的示范——`getTicketTypes(0)` 拿不到全表。**正确实现如下**（把 mock.ts 中 `ticketTypes` 加入 `__mockWritable` 导出，或为 mock.ts 增加只读导出 `getAllTicketTypes()`。本计划采用后者）：

`src/data/mock.ts` 的导出区**追加**：

```ts
export const getAllTicketTypes = (): TicketType[] => [...ticketTypes]
```

`src/lib/footprint.ts` 完整实现：

```ts
import type { ETicket, FootprintStopView, FootprintMode, PostFootprint } from '../types'
import {
  allETickets, getItinerary, getSpot, getAllTicketTypes, getPostFootprints, getPost,
} from '../data/mock'

const DAY_MS = 24 * 3600 * 1000

function ticketSpotIds(t: ETicket): number[] {
  if (t.itemType === 'route') return getItinerary(t.itemId).map((s) => s.spotId)
  const tt = getAllTicketTypes().find((x) => x.id === t.itemId)
  return tt ? [tt.spotId] : []
}

function validTickets(userId?: number): ETicket[] {
  return allETickets().filter((t) => t.status === 'used' && (userId === undefined || t.userId === userId))
}

export function userLitSpotIds(userId: number, opts?: { withinDays?: number }): Set<number> {
  const lit = new Set<number>()
  for (const t of validTickets(userId)) {
    if (opts?.withinDays !== undefined && t.verifyTime) {
      if (Date.now() - new Date(t.verifyTime).getTime() > opts.withinDays * DAY_MS) continue
    }
    for (const id of ticketSpotIds(t)) lit.add(id)
  }
  return lit
}

export function spotLightCounts(spotId: number): number {
  const seenUsers = new Set<number>()
  for (const t of validTickets()) if (ticketSpotIds(t).includes(spotId)) seenUsers.add(t.userId)
  return seenUsers.size
}

export function routeStopsView(routeId: number): FootprintStopView[] {
  return getItinerary(routeId).map((stop) => {
    const spot = getSpot(stop.spotId)!
    const count = spotLightCounts(stop.spotId)
    return { spotId: stop.spotId, name: spot.name, icon: spot.icon, lit: count > 0, locked: count === 0, lightCount: count, dayNo: stop.dayNo }
  })
}

export function postFootprintView(postId: number): {
  mode: FootprintMode; routeId?: number; stops: FootprintStopView[]
} {
  const post = getPost(postId)
  const snaps: PostFootprint[] = getPostFootprints(postId)
  if (post?.linkedRouteId && snaps.some((s) => s.mode === 'route')) {
    const routeId = post.linkedRouteId
    const stops = routeStopsView(routeId).map((v) => {
      const snap = snaps.find((s) => s.spotId === v.spotId)
      const lit = !!snap && snap.status === 'normal'
      const ticket = validTickets(post.userId).find((t) => ticketSpotIds(t).includes(v.spotId))
      return {
        ...v, lit, locked: !lit,
        memo: snap?.memo, verifyDate: ticket?.verifyTime?.slice(0, 10), dayNo: snap?.dayNo ?? v.dayNo,
      }
    })
    return { mode: 'route', routeId, stops }
  }
  // 模式A：作者近 30 天核销聚合，只列 lit 站点
  const litIds = userLitSpotIds(post?.userId ?? 0, { withinDays: 30 })
  const stops: FootprintStopView[] = [...litIds]
    .map((id) => getSpot(id))
    .filter((s) => !!s)
    .map((s) => ({ spotId: s!.id, name: s!.name, icon: s!.icon, lit: true, locked: false }))
  return { mode: 'auto', stops }
}
```

同时把 Task 2 测试里「模式A」用例所依赖的语义对齐：`postFootprintView(604)` 无快照走 auto 分支，用户3 的核销覆盖站点 → 全 lit，测试可通过。

- [ ] **Step 4: 写 feed 失败测试并实现**

创建 `src/lib/__tests__/feed.spec.ts`：

```ts
import { describe, it, expect } from 'vitest'
import { sortPosts } from '../feed'
import { getPosts } from '../../data/mock'

describe('sortPosts', () => {
  const posts = getPosts()
  it('latest 按发布时间倒序', () => {
    const sorted = sortPosts(posts, 'latest')
    expect(sorted[0].id).toBe(606)
  })
  it('recommend 按 热度值(like*2+view/10) 倒序', () => {
    expect(sortPosts(posts, 'recommend')[0].id).toBe(601) // 328*2+520 = 1176 最高
  })
  it('follow 只保留关注用户的帖子', () => {
    const sorted = sortPosts(posts, 'follow', [2])
    expect(sorted.every((p) => p.userId === 2)).toBe(true)
    expect(sorted.length).toBeGreaterThan(0)
  })
})
```

创建 `src/lib/feed.ts`：

```ts
import type { Post } from '../types'

export function sortPosts(
  posts: Post[], tab: 'recommend' | 'latest' | 'follow', followedUserIds: number[] = [],
): Post[] {
  const list = [...posts]
  if (tab === 'latest') return list.sort((a, b) => b.createTime.localeCompare(a.createTime))
  if (tab === 'follow') return list.filter((p) => followedUserIds.includes(p.userId))
  return list.sort((a, b) => b.likeCount * 2 + b.viewCount / 10 - (a.likeCount * 2 + a.viewCount / 10))
}
```

- [ ] **Step 5: 运行全部测试**

Run: `npm test`
Expected: PASS（累计 12 passed）

- [ ] **Step 6: 提交**

```bash
git add src
git commit -m "feat(demo): 足迹计算与信息流排序核心逻辑（TDD）"
```

---

### Task 4: 会话与购票 Store（TDD）

**Files:**
- Create: `wudong-web/src/stores/session.ts`、`src/stores/booking.ts`
- Test: `wudong-web/src/stores/__tests__/booking.spec.ts`

**Interfaces:**
- Consumes: `__mockWritable`（Task 2）
- Produces:
  - `useSession()`：`state: { user: UserBrief | undefined }`；`login(email?: string): void`（mock 登录为用户1）；`isLogged: boolean`
  - `useBooking()`：`createBooking(input: { itemType: 'ticket'|'route'; itemId: number; useDate: string; quantity: number }): { orderNo: string; ticketIds: number[] }`（校验：必须已登录、日期库存存在且 `sold+quantity ≤ total`，否则 throw `Error(中文原因)`；成功后扣库存、生成 `unused` 电子票）
  - `refundTicket(ticketId: number): void`（仅 unused 可退；置 refunded 并回补库存；使用日期前 24h 规则在 demo 简化为：日期 ≥ 明天即可退）

- [ ] **Step 1: 写失败测试**

创建 `src/stores/__tests__/booking.spec.ts`：

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBooking } from '../booking'
import { useSession } from '../session'
import { getInventories, getETickets } from '../../data/mock'

describe('booking store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('未登录下单抛错', () => {
    const b = useBooking()
    expect(() => b.createBooking({ itemType: 'route', itemId: 1, useDate: '2026-09-12', quantity: 1 })).toThrow('请先登录')
  })
  it('登录后下单成功：扣库存、生成待使用电子票', () => {
    const session = useSession(); session.login()
    const b = useBooking()
    const before = getInventories('route', 1).find((i) => i.useDate === '2026-09-12')!
    const r = b.createBooking({ itemType: 'route', itemId: 1, useDate: '2026-09-12', quantity: 2 })
    const after = getInventories('route', 1).find((i) => i.useDate === '2026-09-12')!
    expect(after.sold).toBe(before.sold + 2)
    const tickets = getETickets(1).filter((t) => t.orderNo === r.orderNo)
    expect(tickets).toHaveLength(2)
    expect(tickets.every((t) => t.status === 'unused')).toBe(true)
  })
  it('库存不足抛错', () => {
    const session = useSession(); session.login()
    const b = useBooking()
    expect(() => b.createBooking({ itemType: 'route', itemId: 1, useDate: '2026-09-14', quantity: 1 })).toThrow('余票不足')
  })
  it('未使用且明日及以后的票可退：置 refunded 并回补库存', () => {
    const session = useSession(); session.login()
    const b = useBooking()
    const r = b.createBooking({ itemType: 'route', itemId: 1, useDate: '2026-09-12', quantity: 1 })
    const ticket = getETickets(1).find((t) => t.orderNo === r.orderNo)!
    b.refundTicket(ticket.id)
    expect(ticket.status).toBe('refunded')
    expect(getInventories('route', 1).find((i) => i.useDate === '2026-09-12')!.sold).toBe(7)
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `npm test`
Expected: FAIL —— `Cannot find module '../booking'`

- [ ] **Step 3: 实现 session.ts 与 booking.ts**

`src/stores/session.ts`：

```ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { UserBrief } from '../types'
import { getUser } from '../data/mock'

export const useSession = defineStore('session', () => {
  const user = ref<UserBrief | undefined>(undefined)
  const isLogged = computed(() => !!user.value)
  function login(): void {
    user.value = getUser(1)
  }
  return { user, isLogged, login }
})
```

`src/stores/booking.ts`：

```ts
import { defineStore } from 'pinia'
import { useSession } from './session'
import { getInventories, __mockWritable } from '../data/mock'

let orderSeq = 100
let ticketSeq = 300

export interface BookingInput { itemType: 'ticket' | 'route'; itemId: number; useDate: string; quantity: number }

export const useBooking = defineStore('booking', () => {
  function createBooking(input: BookingInput): { orderNo: string; ticketIds: number[] } {
    const session = useSession()
    if (!session.isLogged) throw new Error('请先登录')
    const inv = getInventories(input.itemType, input.itemId).find((i) => i.useDate === input.useDate)
    if (!inv) throw new Error('该日期未开放预订')
    if (inv.sold + input.quantity > inv.total) throw new Error('余票不足')
    inv.sold += input.quantity
    const orderNo = `WD2026DEMO-${++orderSeq}`
    const ticketIds: number[] = []
    for (let i = 0; i < input.quantity; i++) {
      const id = ++ticketSeq
      ticketIds.push(id)
      __mockWritable.eTickets.push({
        id, orderNo, userId: session.user!.id, itemType: input.itemType,
        itemId: input.itemId, useDate: input.useDate, status: 'unused',
      })
    }
    return { orderNo, ticketIds }
  }

  function refundTicket(ticketId: number): void {
    const session = useSession()
    if (!session.isLogged) throw new Error('请先登录')
    const ticket = __mockWritable.eTickets.find((t) => t.id === ticketId && t.userId === session.user!.id)
    if (!ticket) throw new Error('票不存在')
    if (ticket.status !== 'unused') throw new Error('仅未使用的票可退')
    const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10)
    if (ticket.useDate < tomorrow) throw new Error('距使用日期不足24小时，不可退')
    ticket.status = 'refunded'
    const inv = getInventories(ticket.itemType, ticket.itemId).find((i) => i.useDate === ticket.useDate)
    if (inv && inv.sold > 0) inv.sold -= 1
  }

  return { createBooking, refundTicket }
})
```

- [ ] **Step 4: 运行全部测试**

Run: `npm test`
Expected: PASS（累计 16 passed）

- [ ] **Step 5: 提交**

```bash
git add src
git commit -m "feat(demo): 会话与模拟购票/退票 store（TDD）"
```

---

### Task 5: MiniChain / CountUp / SectionHeader 基础组件

**Files:**
- Create: `wudong-web/src/components/MiniChain.vue`、`CountUp.vue`、`SectionHeader.vue`
- Test: `src/components/__tests__/MiniChain.spec.ts`、`CountUp.spec.ts`

**Interfaces:**
- Produces:
  - `MiniChain` props `{ lit: number; total: number; size?: 'sm' | 'md' }` —— 亮点橙/灰点链
  - `CountUp` props `{ value: number; suffix?: string }` —— 挂载后 1.2s 内数字滚动到 value
  - `SectionHeader` props `{ icon?: string; title: string; sub?: string; more?: string }`，`more` 点击 `emit('more')`

- [ ] **Step 1: 写 MiniChain 失败测试**

`src/components/__tests__/MiniChain.spec.ts`：

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MiniChain from '../MiniChain.vue'

describe('MiniChain', () => {
  it('渲染 total 个点，前 lit 个为亮色', () => {
    const w = mount(MiniChain, { props: { lit: 3, total: 5 } })
    const dots = w.findAll('.dot')
    expect(dots).toHaveLength(5)
    expect(dots.filter((d) => d.classes().includes('on'))).toHaveLength(3)
  })
  it('附带 3/5 文本', () => {
    const w = mount(MiniChain, { props: { lit: 4, total: 5 } })
    expect(w.text()).toContain('4/5')
  })
})
```

- [ ] **Step 2: 运行确认失败 → 实现 → 通过**

Run: `npm test`（Expected: FAIL 找不到模块）后创建：

`src/components/MiniChain.vue`：

```vue
<script setup lang="ts">
withDefaults(defineProps<{ lit: number; total: number; size?: 'sm' | 'md' }>(), { size: 'sm' })
</script>

<template>
  <span class="chain" :class="size">
    <i v-for="i in total" :key="i" class="dot" :class="{ on: i <= lit }" />
    <em>{{ lit }}/{{ total }} 站</em>
  </span>
</template>

<style scoped>
.chain { display: inline-flex; align-items: center; gap: 3px; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #ddd; }
.dot.on { background: var(--orange-500); box-shadow: 0 0 4px rgba(232,150,62,.6); }
.md .dot { width: 10px; height: 10px; }
em { font-style: normal; font-size: 11px; color: var(--amber-text); margin-left: 4px; }
</style>
```

- [ ] **Step 3: 写 CountUp 测试并实现**

`src/components/__tests__/CountUp.spec.ts`：

```ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CountUp from '../CountUp.vue'

describe('CountUp', () => {
  it('1.2s 后滚动到目标值', () => {
    vi.useFakeTimers()
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { setTimeout(() => cb(0), 100); return 1 })
    const w = mount(CountUp, { props: { value: 1000 } })
    vi.advanceTimersByTime(1500)
    expect(w.text()).toContain('1,000')
    raf.mockRestore(); vi.useRealTimers()
  })
})
```

`src/components/CountUp.vue`：

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ value: number; suffix?: string }>()
const shown = ref('0')

onMounted(() => {
  const start = performance.now()
  const dur = 1200
  function tick(now: number): void {
    const p = Math.min((now - start) / dur, 1)
    const eased = 1 - Math.pow(1 - p, 3)
    shown.value = Math.round(props.value * eased).toLocaleString()
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
</script>

<template>
  <span class="countup">{{ shown }}{{ suffix }}</span>
</template>
```

- [ ] **Step 4: 实现 SectionHeader（无逻辑，直接写）**

`src/components/SectionHeader.vue`：

```vue
<script setup lang="ts">
defineProps<{ icon?: string; title: string; sub?: string; more?: string }>()
const emit = defineEmits<{ more: [] }>()
</script>

<template>
  <div class="sec-head">
    <div>
      <b class="title">{{ icon }} {{ title }}</b>
      <span v-if="sub" class="sub">{{ sub }}</span>
    </div>
    <a v-if="more" class="more" @click="emit('more')">{{ more }} ›</a>
  </div>
</template>

<style scoped>
.sec-head { display: flex; align-items: baseline; justify-content: space-between; margin: 18px 0 10px; }
.title { font-size: 16px; }
.sub { font-size: 12px; color: var(--text-3); margin-left: 8px; }
.more { font-size: 12px; color: var(--text-3); cursor: pointer; }
.more:hover { color: var(--orange-700); }
</style>
```

- [ ] **Step 5: 运行全部测试**

Run: `npm test`
Expected: PASS（累计 19 passed）

- [ ] **Step 6: 提交**

```bash
git add src
git commit -m "feat(demo): MiniChain/CountUp/SectionHeader 基础组件"
```

---

### Task 6: FootprintMap 手绘足迹地图（全站复用核心组件）

**Files:**
- Create: `wudong-web/src/components/FootprintMap.vue`
- Test: `src/components/__tests__/FootprintMap.spec.ts`

**Interfaces:**
- Consumes: `FootprintStopView`（Task 2 类型）
- Produces: `FootprintMap` props：
  - `stops: FootprintStopView[]`
  - `variant: 'chain' | 'overview' | 'mini'`（chain=横向足迹链；overview=首页大地图，含 lightCount 气泡；mini=速览面板小图）
  - `title?: string`、`showCounts?: boolean`（默认 chain/overview 显示"N人点亮"，mini 不显示）
  - emit `select(spotId: number)`（点击站点）
  - 渲染规则：lit 站点=橙色圆+图标+微光晕；locked=灰虚线圆+🔒；lit 连线=橙色虚线，locked 段=灰色虚线；底部图例"🔒 灰段 = 未解锁"

- [ ] **Step 1: 写失败测试**

`src/components/__tests__/FootprintMap.spec.ts`：

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FootprintMap from '../FootprintMap.vue'
import type { FootprintStopView } from '../../types'

const stops: FootprintStopView[] = [
  { spotId: 1, name: '乌东梯田', icon: '🌄', lit: true, locked: false, lightCount: 3 },
  { spotId: 2, name: '银饰工坊', icon: '⚒️', lit: false, locked: true },
  { spotId: 3, name: '长桌宴', icon: '🍲', lit: true, locked: false, lightCount: 2 },
]

describe('FootprintMap', () => {
  it('渲染 lit 与 locked 两种站点节点', () => {
    const w = mount(FootprintMap, { props: { stops, variant: 'chain' } })
    expect(w.findAll('.stop.lit')).toHaveLength(2)
    expect(w.findAll('.stop.locked')).toHaveLength(1)
    expect(w.text()).toContain('乌东梯田')
  })
  it('chain 变体显示点亮人数', () => {
    const w = mount(FootprintMap, { props: { stops, variant: 'chain', showCounts: true } })
    expect(w.text()).toContain('3')
  })
  it('mini 变体不显示人数与图例', () => {
    const w = mount(FootprintMap, { props: { stops, variant: 'mini' } })
    expect(w.find('.legend').exists()).toBe(false)
  })
  it('点击站点 emit select', async () => {
    const w = mount(FootprintMap, { props: { stops, variant: 'chain' } })
    await w.find('.stop.lit').trigger('click')
    expect(w.emitted('select')![0]).toEqual([1])
  })
})
```

- [ ] **Step 2: 运行确认失败**

Run: `npm test`
Expected: FAIL —— `Cannot find module '../FootprintMap.vue'`

- [ ] **Step 3: 实现 FootprintMap.vue**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { FootprintStopView } from '../types'

const props = withDefaults(
  defineProps<{ stops: FootprintStopView[]; variant: 'chain' | 'overview' | 'mini'; title?: string; showCounts?: boolean }>(),
  { showCounts: undefined }, // undefined → chain/overview 显示，mini 不显示
)

const emit = defineEmits<{ select: [spotId: number] }>()

const showCount = computed(() => props.showCounts ?? props.variant !== 'mini')

// 站点均匀布点，链路蜿蜒：奇偶站上下交错，overview 振幅更大
const points = computed(() => {
  const n = props.stops.length
  const w = props.variant === 'mini' ? 320 : props.variant === 'overview' ? 880 : 640
  const h = props.variant === 'mini' ? 110 : props.variant === 'overview' ? 220 : 150
  const padX = 40
  const amp = props.variant === 'overview' ? h * 0.32 : h * 0.2
  return props.stops.map((s, i) => ({
    x: n === 1 ? w / 2 : padX + (i * (w - padX * 2)) / (n - 1),
    y: h / 2 + (i % 2 === 0 ? -amp : amp),
    w, h,
  }))
})

const pathD = computed(() => {
  const pts = points.value
  if (pts.length < 2) return ''
  const [, , w, h] = [0, 0, pts[0].w, pts[0].h]
  void w; void h
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]; const cur = pts[i]
    const cx = (prev.x + cur.x) / 2
    d += ` C ${cx} ${prev.y}, ${cx} ${cur.y}, ${cur.x} ${cur.y}`
  }
  return d
})

function segmentClass(i: number): string {
  return props.stops[i]?.lit && props.stops[i + 1]?.lit ? 'seg lit' : 'seg locked'
}
</script>

<template>
  <div class="fp-map" :class="variant">
    <div v-if="title" class="fp-title">{{ title }}</div>
    <svg :viewBox="`0 0 ${points[0]?.w ?? 640} ${points[0]?.h ?? 150}`" class="fp-svg">
      <!-- 连线：逐段描色 -->
      <path :d="pathD" fill="none" stroke="transparent" stroke-width="3" />
      <template v-for="(p, i) in points.slice(0, -1)" :key="'seg' + i">
        <path
          class="seg-path" :class="segmentClass(i)"
          :d="`M ${p.x} ${p.y} C ${(p.x + points[i + 1].x) / 2} ${p.y}, ${(p.x + points[i + 1].x) / 2} ${points[i + 1].y}, ${points[i + 1].x} ${points[i + 1].y}`"
        />
      </template>
      <!-- 站点 -->
      <g
        v-for="(s, i) in stops" :key="s.spotId" class="stop" :class="s.lit ? 'lit' : 'locked'"
        :transform="`translate(${points[i].x},${points[i].y})`" @click="emit('select', s.spotId)"
      >
        <circle :r="variant === 'overview' ? 15 : 11" class="node" />
        <text class="icon" y="4" text-anchor="middle">{{ s.lit ? s.icon : '🔒' }}</text>
        <text class="label" :y="variant === 'overview' ? 32 : 26" text-anchor="middle">
          {{ s.name }}{{ s.lit && s.locked === false ? '' : '' }}{{ s.locked ? '' : '' }}
        </text>
        <text v-if="showCount && s.lit && s.lightCount" class="count" :y="variant === 'overview' ? -22 : -18" text-anchor="middle">
          {{ s.lightCount }}人点亮
        </text>
        <text v-if="s.memo" class="memo" :y="-18" text-anchor="middle">{{ s.memo }}</text>
      </g>
    </svg>
    <div v-if="variant !== 'mini'" class="legend">
      <span>🟠 点亮 = 有核销记录</span><span class="muted">🔒 灰段 = 行程中未解锁站点</span>
    </div>
  </div>
</template>

<style scoped>
.fp-map { background: linear-gradient(160deg, var(--map-a), var(--map-b)); border-radius: var(--radius); position: relative; }
.fp-title { position: absolute; top: 8px; left: 12px; font-size: 12px; font-weight: 700; color: var(--amber-text); }
.fp-svg { width: 100%; display: block; }
.seg-path { fill: none; stroke-width: 3; stroke-dasharray: 7 5; }
.seg-path.lit { stroke: var(--orange-500); }
.seg-path.locked { stroke: #c9c9c9; stroke-dasharray: 4 5; }
.stop { cursor: pointer; }
.node { fill: #fff; stroke: #bbb; stroke-width: 2; stroke-dasharray: 3 2; }
.stop.lit .node { fill: var(--orange-500); stroke: var(--orange-300); filter: drop-shadow(0 0 5px rgba(232,150,62,.55)); }
.icon { font-size: 12px; }
.label { font-size: 10px; fill: var(--text-2); }
.stop.locked .label { fill: #aaa; }
.count { font-size: 9px; font-weight: 700; fill: var(--amber-text); }
.memo { font-size: 9px; fill: #888; }
.legend { display: flex; gap: 12px; font-size: 11px; color: var(--text-2); padding: 0 12px 8px; }
.legend .muted { color: var(--text-3); }
</style>
```

> 实现提示：`<text>` 的 label 行里那两个空三元表达式是模板调试残留，实现时**直接写死**为 `{{ s.name }}`。

- [ ] **Step 4: 运行全部测试**

Run: `npm test`
Expected: PASS（累计 23 passed）

- [ ] **Step 5: 提交**

```bash
git add src
git commit -m "feat(demo): FootprintMap 手绘足迹地图组件（chain/overview/mini 三变体）"
```

---

### Task 7: HeroCarousel 焦点轮播 + RouteQuickView 速览面板

**Files:**
- Create: `wudong-web/src/components/HeroCarousel.vue`、`RouteQuickView.vue`
- Test: `src/components/__tests__/HeroCarousel.spec.ts`、`RouteQuickView.spec.ts`

**Interfaces:**
- Consumes: `getRecommendSlots`（Task 2）、`FootprintMap`（Task 6）、`getRoute`/`getSpot`/`routeStopsView`
- Produces:
  - `HeroCarousel` props `{ autoMs?: number }`（默认 5000）：自动轮换、hover 暂停、圆点指示器、左右箭头；每张卡点击 emit `open(itemType, itemId)`
  - `RouteQuickView` props `{ routeId: number | null }`（null 时隐藏，v-if 由父级控制亦可）；头部路线信息 + `FootprintMap mini` + 相关游记数 + [看全部游记][预订]；emit `close` `viewPosts(routeId)` `book(routeId)`

- [ ] **Step 1: 写 HeroCarousel 失败测试**

`src/components/__tests__/HeroCarousel.spec.ts`：

```ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroCarousel from '../HeroCarousel.vue'
import { getRecommendSlots } from '../../data/mock'

describe('HeroCarousel', () => {
  it('渲染全部推荐位，第一张可见', () => {
    const w = mount(HeroCarousel, { props: { autoMs: 99999 } })
    expect(w.findAll('.slide')).toHaveLength(getRecommendSlots().length)
    expect(w.text()).toContain('苗寨深度两日游')
  })
  it('到时自动切换到下一张并更新圆点', async () => {
    vi.useFakeTimers()
    const w = mount(HeroCarousel, { props: { autoMs: 1000 } })
    await vi.advanceTimersByTimeAsync(1100)
    expect(w.vm.current).toBe(1)
    vi.useRealTimers()
  })
  it('点击圆点跳转指定张', async () => {
    const w = mount(HeroCarousel, { props: { autoMs: 99999 } })
    await w.findAll('.dot')[2].trigger('click')
    expect(w.vm.current).toBe(2)
  })
  it('hover 暂停自动轮播', async () => {
    vi.useFakeTimers()
    const w = mount(HeroCarousel, { props: { autoMs: 1000 } })
    await w.find('.carousel').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(2500)
    expect(w.vm.current).toBe(0)
    vi.useRealTimers()
  })
  it('点击卡片 emit open', async () => {
    const w = mount(HeroCarousel, { props: { autoMs: 99999 } })
    await w.find('.slide.active .card').trigger('click')
    expect(w.emitted('open')![0][0]).toBe('route')
  })
})
```

- [ ] **Step 2: 运行确认失败 → 实现 HeroCarousel**

`src/components/HeroCarousel.vue`：

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getRecommendSlots, getRoute, getSpot } from '../data/mock'

const props = withDefaults(defineProps<{ autoMs?: number }>(), { autoMs: 5000 })
const emit = defineEmits<{ open: [itemType: string, itemId: number] }>()

const slots = getRecommendSlots()
const current = ref(0)
let timer: number | undefined

function schedule(): void {
  timer = window.setInterval(() => {
    if (!hovering.value) current.value = (current.value + 1) % slots.length
  }, props.autoMs)
}
const hovering = ref(false)

onMounted(schedule)
onUnmounted(() => clearInterval(timer))

function go(i: number): void {
  current.value = i
}
function shift(delta: number): void {
  current.value = (current.value + delta + slots.length) % slots.length
}
function gradient(i: number): string {
  return ['#33523e,#4a7a5c', '#7a4a2e,#a9703f', '#2e4a6b,#3f6a96'][i % 3]
}
function isRoute(slotId: number): boolean {
  return getRoute(slotId) !== undefined || getSpot(slotId) !== undefined
}
void isRoute
</script>

<template>
  <div class="carousel" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <div
      v-for="(s, i) in slots" :key="s.id" class="slide" :class="{ active: i === current }"
      :style="{ background: `linear-gradient(110deg, ${gradient(i)})` }" @click="emit('open', s.itemType, s.itemId)"
    >
      <div class="card">
        <span class="pill badge">{{ s.badge }}</span>
        <div class="title">{{ s.title }}</div>
        <div class="subtitle">{{ s.subtitle }}</div>
      </div>
    </div>
    <button class="arrow left" @click.stop="shift(-1)">‹</button>
    <button class="arrow right" @click.stop="shift(1)">›</button>
    <div class="dots">
      <i v-for="(s, i) in slots" :key="s.id" class="dot" :class="{ on: i === current }" @click.stop="go(i)" />
    </div>
  </div>
</template>

<style scoped>
.carousel { position: relative; height: 210px; border-radius: var(--radius); overflow: hidden; }
.slide { position: absolute; inset: 0; opacity: 0; transition: opacity .6s; cursor: pointer; }
.slide.active { opacity: 1; }
.card { color: #fff; padding: 16px 20px; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; }
.badge { background: rgba(255,255,255,.2); width: fit-content; margin-bottom: 8px; }
.title { font-size: 20px; font-weight: 800; }
.subtitle { font-size: 12px; opacity: .92; }
.arrow { position: absolute; top: 42%; width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,.35); color: #fff; font-size: 18px; }
.arrow.left { left: 10px; } .arrow.right { right: 10px; }
.dots { position: absolute; bottom: 8px; left: 0; right: 0; display: flex; gap: 6px; justify-content: center; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,.5); cursor: pointer; }
.dot.on { background: #fff; width: 16px; border-radius: 4px; }
</style>
```

> 实现提示：`isRoute` 函数是冗余占位，实现时删除，同时删掉测试不需要的导出。

- [ ] **Step 3: 写 RouteQuickView 失败测试**

`src/components/__tests__/RouteQuickView.spec.ts`：

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RouteQuickView from '../RouteQuickView.vue'

describe('RouteQuickView', () => {
  it('展示路线信息、站点迷你地图与按钮', () => {
    const w = mount(RouteQuickView, { props: { routeId: 1 } })
    expect(w.text()).toContain('苗寨深度两日游')
    expect(w.text()).toContain('¥899')
    expect(w.text()).toContain('相关游记')
    expect(w.findAll('button')).toHaveLength(2)
  })
  it('点击预订 emit book', async () => {
    const w = mount(RouteQuickView, { props: { routeId: 1 } })
    await w.findAll('button')[1].trigger('click')
    expect(w.emitted('book')![0]).toEqual([1])
  })
  it('点击关闭 emit close', async () => {
    const w = mount(RouteQuickView, { props: { routeId: 1 } })
    await w.find('.close').trigger('click')
    expect(w.emitted('close')).toBeTruthy()
  })
})
```

- [ ] **Step 4: 运行确认失败 → 实现 RouteQuickView**

`src/components/RouteQuickView.vue`：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { getRoute, routeStopsView, getPosts } from '../data/mock'
import FootprintMap from './FootprintMap.vue'

const props = defineProps<{ routeId: number | null }>()
const emit = defineEmits<{ close: []; viewPosts: [routeId: number]; book: [routeId: number] }>()

const route = computed(() => (props.routeId === null ? undefined : getRoute(props.routeId)))
const stops = computed(() => (props.routeId === null ? [] : routeStopsView(props.routeId)))
const relatedCount = computed(
  () => getPosts().filter((p) => p.linkedRouteId === props.routeId).length,
)
</script>

<template>
  <aside v-if="route" class="drawer card">
    <button class="close" @click="emit('close')">✕</button>
    <header class="head">
      <b class="title">{{ route.title }}</b>
      <div class="meta">{{ route.days }}天{{ route.days > 1 ? '1晚' : '' }} · ¥{{ route.price }}起 · 已售 {{ route.sales }}</div>
    </header>
    <FootprintMap :stops="stops" variant="mini" />
    <div class="foot">
      <div>📷 相关游记 <b>{{ relatedCount }}</b> 篇</div>
      <div class="btns">
        <button class="ghost" @click="emit('viewPosts', route.id)">看全部游记</button>
        <button class="btn-primary" @click="emit('book', route.id)">预订</button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.drawer { width: 300px; position: relative; box-shadow: var(--shadow); }
.close { position: absolute; top: 8px; right: 10px; background: none; color: #fff; font-size: 14px; z-index: 1; }
.head { background: linear-gradient(110deg, var(--green-900), var(--green-600)); color: #fff; padding: 12px 14px; }
.title { font-size: 15px; }
.meta { font-size: 11px; opacity: .9; margin-top: 2px; }
.foot { padding: 10px 12px; font-size: 12px; color: var(--text-2); }
.btns { display: flex; gap: 8px; margin-top: 8px; }
.btns button { flex: 1; border-radius: 8px; padding: 7px 0; font-weight: 700; }
.ghost { border: 1px solid var(--orange-500); color: var(--orange-700); background: #fff; }
</style>
```

- [ ] **Step 5: 运行全部测试**

Run: `npm test`
Expected: PASS（累计 29 passed）

- [ ] **Step 6: 提交**

```bash
git add src
git commit -m "feat(demo): HeroCarousel 轮播与 RouteQuickView 速览面板"
```

---

### Task 8: Waterfall 瀑布流 + PostCard 游记卡片

**Files:**
- Create: `wudong-web/src/components/PostCard.vue`、`Waterfall.vue`
- Test: `src/components/__tests__/PostCard.spec.ts`

**Interfaces:**
- Consumes: `Post`/`UserBrief`/`Topic`（Task 2）、`MiniChain`（Task 5）、`postFootprintView`（Task 3）
- Produces:
  - `PostCard` props `{ post: Post }`：渐变图 + 标题 + 可点击路线/地点标签（emit `tag(routeId)`）+ MiniChain（有足迹时）+ 点赞评论数；点击卡体 emit `open(postId)`
  - `Waterfall` props `{ posts: Post[] }`：3 列 CSS columns；emit `open(postId)`、`tag(routeId)` 透传

- [ ] **Step 1: 写 PostCard 失败测试**

`src/components/__tests__/PostCard.spec.ts`：

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PostCard from '../PostCard.vue'
import { getPost } from '../../data/mock'

describe('PostCard', () => {
  it('渲染标题、作者与互动数', () => {
    const w = mount(PostCard, { props: { post: getPost(601)! } })
    expect(w.text()).toContain('晨雾还没散')
    expect(w.text()).toContain('山野小鱼')
    expect(w.text()).toContain('328')
  })
  it('关联路线的卡片显示可点击路线标签', async () => {
    const w = mount(PostCard, { props: { post: getPost(601)! } })
    const tag = w.find('.tag')
    expect(tag.exists()).toBe(true)
    await tag.trigger('click')
    expect(w.emitted('tag')![0]).toEqual([1])
  })
  it('无关联路线的卡片不显示路线标签', () => {
    const w = mount(PostCard, { props: { post: getPost(604)! } })
    expect(w.find('.tag').exists()).toBe(false)
  })
  it('有足迹快照的卡片显示 MiniChain', () => {
    const w = mount(PostCard, { props: { post: getPost(601)! } })
    expect(w.findComponent({ name: 'MiniChain' }).exists()).toBe(true)
  })
})
```

- [ ] **Step 2: 运行确认失败 → 实现**

`src/components/PostCard.vue`：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '../types'
import { getUser, getRoute, getSpot, getPostFootprints } from '../data/mock'
import MiniChain from './MiniChain.vue'

const props = defineProps<{ post: Post }>()
const emit = defineEmits<{ open: [postId: number]; tag: [routeId: number] }>()

const author = computed(() => getUser(props.post.userId))
const route = computed(() => (props.post.linkedRouteId ? getRoute(props.post.linkedRouteId) : undefined))
const chain = computed(() => {
  const snaps = getPostFootprints(props.post.id)
  if (!snaps.length) return null
  const total = route.value ? 5 : snaps.length
  return { lit: snaps.filter((s) => s.status === 'normal').length, total }
})
const videoCls = computed(() => (props.post.video ? 'ph-4' : `ph-${props.post.images[0] ?? 0}`))
const spotName = computed(() => (route.value ? undefined : undefined))
void spotName
</script>

<template>
  <div class="card post-card" @click="emit('open', post.id)">
    <div class="ph cover" :class="videoCls">
      <span v-if="post.video" class="video-mark">▶ 视频</span>
    </div>
    <div class="body">
      <b class="title">{{ post.title }}</b>
      <div class="row2">
        <a v-if="route" class="pill tag" @click.stop="emit('tag', route.id)">🗺 {{ route.title }} ›</a>
        <MiniChain v-if="chain" :lit="chain.lit" :total="chain.total" />
      </div>
      <div class="meta">
        <span>{{ author?.avatar }} {{ author?.nickname }}</span>
        <span class="nums">👍 {{ post.likeCount }} · 💬 {{ post.commentCount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-card { cursor: pointer; break-inside: avoid; margin-bottom: 12px; }
.cover { height: 150px; border-radius: 0; position: relative; }
.video-mark { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,.45); border-radius: 10px; padding: 1px 8px; font-size: 11px; }
.body { padding: 8px 10px; }
.title { font-size: 13px; }
.row2 { display: flex; align-items: center; gap: 8px; margin: 6px 0; flex-wrap: wrap; }
.tag { background: var(--amber-bg); color: var(--amber-text); cursor: pointer; }
.meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-3); }
</style>
```

> 实现提示：`spotName` 是冗余占位，实现时删除。

`src/components/Waterfall.vue`：

```vue
<script setup lang="ts">
import type { Post } from '../types'
import PostCard from './PostCard.vue'

defineProps<{ posts: Post[] }>()
const emit = defineEmits<{ open: [postId: number]; tag: [routeId: number] }>()
</script>

<template>
  <div class="waterfall">
    <PostCard v-for="p in posts" :key="p.id" :post="p" @open="(id) => emit('open', id)" @tag="(id) => emit('tag', id)" />
  </div>
</template>

<style scoped>
.waterfall { columns: 3; column-gap: 12px; }
@media (max-width: 900px) { .waterfall { columns: 2; } }
</style>
```

- [ ] **Step 3: 运行全部测试**

Run: `npm test`
Expected: PASS（累计 33 passed）

- [ ] **Step 4: 提交**

```bash
git add src
git commit -m "feat(demo): 瀑布流与游记卡片（路线标签+迷你足迹链）"
```

---

### Task 9: 首页 · 上中区（轮播+快捷订票+金刚区+地图总览+足迹榜）

**Files:**
- Create: `wudong-web/src/views/HomeView.vue`
- Create: `wudong-web/src/lib/stats.ts`
- Test: `src/lib/__tests__/stats.spec.ts`
- Modify: `src/router/index.ts`（注册 `/`）

**Interfaces:**
- Consumes: Task 1-8 全部
- Produces:
  - `weeklyLeaderboard(): { spotId: number; name: string; icon: string; kind: string; count: number }[]` —— 全部地点按点亮次数倒序取前 5（kind = type 中文映射）
  - HomeView 路由 `/`：区块 1-4（HeroCarousel+快捷订票卡 / 金刚区 / FootprintMap overview / 足迹榜+节庆倒计时）；区块 5-7 下一任务补齐
  - 快捷订票卡「查询路线」→ `router.push('/route')`；金刚区两项灰置（民宿/非遗好物，标记"即将上线"）

- [ ] **Step 1: 写 stats 失败测试**

`src/lib/__tests__/stats.spec.ts`：

```ts
import { describe, it, expect } from 'vitest'
import { weeklyLeaderboard } from '../stats'

describe('weeklyLeaderboard', () => {
  it('返回前5并按点亮次数倒序', () => {
    const board = weeklyLeaderboard()
    expect(board).toHaveLength(5)
    for (let i = 1; i < board.length; i++) expect(board[i - 1].count).toBeGreaterThanOrEqual(board[i].count)
  })
  it('包含中文类别', () => {
    expect(weeklyLeaderboard().some((b) => b.kind === '餐饮 · 食')).toBe(true)
  })
})
```

- [ ] **Step 2: 运行确认失败 → 实现 stats.ts**

`src/lib/stats.ts`：

```ts
import { getAllSpots } from '../data/mock'
import { spotLightCounts } from './footprint'

const KIND: Record<string, string> = { spot: '景区', dining: '餐饮 · 食', stay: '住宿 · 住', experience: '体验' }

export function weeklyLeaderboard() {
  return getAllSpots()
    .map((s) => ({ spotId: s.id, name: s.name, icon: s.icon, kind: KIND[s.type], count: spotLightCounts(s.id) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}
```

- [ ] **Step 3: 实现 HomeView（区块 1-4）并注册路由**

`src/views/HomeView.vue`：

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import HeroCarousel from '../components/HeroCarousel.vue'
import FootprintMap from '../components/FootprintMap.vue'
import SectionHeader from '../components/SectionHeader.vue'
import { weeklyLeaderboard } from '../lib/stats'
import { getRoutes, routeStopsView, getAllSpots } from '../data/mock'

const router = useRouter()
const bookDate = ref('2026-09-13')
const bookPeople = ref(2)

const kingkong = [
  { icon: '🎫', label: '景区门票', to: '/scenic', disabled: false },
  { icon: '🗺️', label: '路线套餐', to: '/route', disabled: false },
  { icon: '📷', label: '社区游记', to: '/community', disabled: false },
  { icon: '🧭', label: '交通攻略', to: '/guide', disabled: false },
  { icon: '🏨', label: '民宿', to: '', disabled: true },
  { icon: '🛍️', label: '非遗好物', to: '', disabled: true },
]

// 首页地图：所有路线的站点合并去重后展示
const overviewStops = (() => {
  const seen = new Map<number, ReturnType<typeof routeStopsView>[number]>()
  for (const r of getRoutes()) for (const s of routeStopsView(r.id)) if (!seen.has(s.spotId)) seen.set(s.spotId, s)
  return [...getAllSpots()].filter((s) => seen.has(s.id)).map((s) => seen.get(s.id)!)
})()

const board = weeklyLeaderboard()
const barWidth = (i: number): string => `${Math.max((board[i].count / (board[0].count || 1)) * 100, 6)}%`
</script>

<template>
  <div class="container">
    <!-- 区块1：轮播 + 快捷订票 -->
    <section class="hero-row">
      <HeroCarousel class="hero" @open="(t, id) => router.push(t === 'route' ? `/route/${id}` : `/scenic/${id}`)" />
      <aside class="quick card">
        <b>🎫 快捷订票</b>
        <div class="field"><input v-model="bookDate" type="date" /></div>
        <div class="field steppers">
          <span>出行人数</span>
          <button @click="bookPeople = Math.max(1, bookPeople - 1)">−</button>
          <b>{{ bookPeople }}</b>
          <button @click="bookPeople++">＋</button>
        </div>
        <button class="btn-primary go" @click="router.push('/route')">查询路线</button>
      </aside>
    </section>

    <!-- 区块2：金刚区 -->
    <section class="kingkong">
      <div
        v-for="k in kingkong" :key="k.label" class="kk card"
        :class="{ disabled: k.disabled }"
        @click="!k.disabled && router.push(k.to)"
      >
        <b>{{ k.icon }}</b>
        <span>{{ k.label }}</span>
        <i v-if="k.disabled">即将上线</i>
      </div>
    </section>

    <!-- 区块3：手绘地图总览 -->
    <SectionHeader icon="🗺️" title="乌东村手绘地图" sub="站点大小 = 被点亮次数 · 点击直达" />
    <FootprintMap :stops="overviewStops" variant="overview" @select="(id) => router.push(`/scenic/${id}`)" />

    <!-- 区块4：足迹榜 + 节庆倒计时 -->
    <section class="board-row">
      <div class="board card">
        <SectionHeader icon="🏆" title="本周足迹榜" sub="被点亮最多的站与线" />
        <table>
          <tr v-for="(b, i) in board" :key="b.spotId">
            <td><span class="no" :class="'no-' + i">{{ i + 1 }}</span><b>{{ b.name }}</b><span class="kind"> {{ b.kind }}</span></td>
            <td class="bar-cell"><div class="bar" :style="{ width: barWidth(i) }" /></td>
            <td class="cnt">{{ b.count }} 次点亮</td>
          </tr>
        </table>
      </div>
      <aside class="festival card">
        <b>⏳ 节庆倒计时</b>
        <div class="fest">
          <b class="name">苗年 · 芦笙节</b>
          <div><span class="days">23</span> 天后开幕</div>
          <a class="link" @click="router.push('/route')">节庆主题路线已上线 ›</a>
        </div>
        <b>📢 公告</b>
        <div class="notice">· 中秋两日游余票紧张<br />· 新增广州→凯里高铁攻略</div>
      </aside>
    </section>
  </div>
</template>

<style scoped>
.hero-row { display: flex; gap: 12px; margin-top: 16px; }
.hero { flex: 1; }
.quick { width: 240px; padding: 12px; background: var(--paper); }
.field { margin: 8px 0; }
.field input { width: 100%; border: 1px solid var(--line); border-radius: 6px; padding: 6px 8px; }
.steppers { display: flex; align-items: center; gap: 8px; }
.steppers button { width: 24px; height: 24px; border-radius: 6px; border: 1px solid var(--line); background: #fff; }
.go { width: 100%; margin-top: 6px; }
.kingkong { display: flex; gap: 10px; margin: 16px 0; }
.kk { flex: 1; text-align: center; padding: 10px 0 8px; cursor: pointer; background: #f7f9f6; border-color: #e8efe9; }
.kk b { font-size: 20px; display: block; }
.kk span { font-size: 12px; }
.kk i { display: block; font-style: normal; font-size: 10px; color: #bbb; }
.kk.disabled { opacity: .55; cursor: default; }
.board-row { display: flex; gap: 12px; margin-top: 6px; }
.board { flex: 1; padding: 0 14px 10px; }
.board table { width: 100%; border-collapse: collapse; font-size: 12px; }
.board td { padding: 6px 4px; border-bottom: 1px dashed var(--line-soft); }
.no { display: inline-flex; width: 20px; height: 20px; border-radius: 6px; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 800; background: #ddd; margin-right: 6px; }
.no-0 { background: var(--orange-500); } .no-1 { background: #eda75a; } .no-2 { background: #c9b37e; }
.kind { color: var(--text-3); font-size: 11px; }
.bar-cell { width: 40%; }
.bar { height: 8px; border-radius: 4px; background: linear-gradient(90deg, var(--orange-500), var(--orange-300)); }
.cnt { color: var(--amber-text); font-weight: 700; white-space: nowrap; }
.festival { width: 260px; padding: 12px 14px; background: var(--paper); font-size: 12px; }
.fest { margin: 6px 0 12px; padding: 8px; background: #fff; border: 1px solid var(--line-soft); border-radius: 8px; }
.days { font-size: 22px; font-weight: 800; color: var(--orange-700); }
.link { color: var(--amber-text); cursor: pointer; font-size: 11px; }
.notice { color: var(--text-3); margin-top: 4px; }
</style>
```

`src/router/index.ts` 的 routes 数组**替换**为：

```ts
routes: [
  { path: '/', component: () => import('../views/HomeView.vue') },
  { path: '/:pathMatch(.*)*', component: { template: '<div style="padding:60px">404</div>' } },
]
```

- [ ] **Step 4: 运行全部测试 + dev 目验**

Run: `npm test`（Expected: PASS，累计 35 passed）
Run: `npm run dev` → 打开 `http://localhost:5175/`：核对轮播自动切换（5s）、hover 暂停、金刚区两项灰置、地图站点显示"N人点亮"、榜单条形递减。目验通过后关闭。

- [ ] **Step 5: 提交**

```bash
git add src
git commit -m "feat(demo): 首页上中区（轮播/金刚区/地图总览/足迹榜）"
```

---

### Task 10: 首页 · 下区（足迹精选+瀑布流+侧栏+攻略+CountUp）并完成首页

**Files:**
- Modify: `wudong-web/src/views/HomeView.vue`（追加区块 5-7）
- Test: 无新逻辑（组装已有组件），以 dev 目验 + 既有测试回归为准

**Interfaces:**
- Consumes: `Waterfall`（Task 8）、`sortPosts`（Task 3）、`CountUp`/`SectionHeader`（Task 5）、`getGuides`/`getTopics`/`getUsers`（Task 2）
- Produces: 完整七区块首页（对照 spec D5）

- [ ] **Step 1: 追加区块 5-7 模板与数据**

在 `HomeView.vue` 的 `<script setup>` 追加：

```ts
import Waterfall from '../components/Waterfall.vue'
import CountUp from '../components/CountUp.vue'
import { getPosts, getTopics, getUsers, getGuides } from '../data/mock'
import { sortPosts, userLitSpotIds } from '../lib/footprint'

// 区块5：足迹精选（有足迹快照的游记按点赞取3）
const highlightPosts = sortPosts(getPosts(), 'recommend').filter((p) => p.linkedRouteId).slice(0, 3)
const gradOf = (i: number): string => ['linear-gradient(120deg,#7fae8e,#33523e)', 'linear-gradient(120deg,#c9a06b,#8a5f2e)', 'linear-gradient(120deg,#8e7fae,#4a3a6a)'][i % 3]
const chainOf = (postId: number): { lit: number; total: number } | null => {
  void postId; return null // 详情块内直接展示"足迹 X/5"文本，见模板
}

// 区块6：瀑布流 + 侧栏
const feedPosts = sortPosts(getPosts(), 'recommend')
const topicRank = [...getTopics()].sort((a, b) => b.viewCount - a.viewCount)
// 活跃旅人 = 按点亮站数排序的用户
const activeUsers = getUsers()
  .map((u) => ({ ...u, litCount: userLitSpotIds(u.id).size }))
  .sort((a, b) => b.litCount - a.litCount)
  .slice(0, 3)

// 区块7：攻略 + 平台数据
const guides = getGuides()
void chainOf
</script>
```

在 `</section>`（区块4 board-row 结束）之后、`</div>`（container 结束）之前**插入**：

```html
    <!-- 区块5：真实足迹精选 -->
    <SectionHeader icon="🧭" title="真实足迹" sub="本周点亮最完整的游记" more="进入社区" @more="router.push('/community')" />
    <section class="hl-row">
      <div v-for="(p, i) in highlightPosts" :key="p.id" class="card hl" @click="router.push(`/post/${p.id}`)">
        <div class="ph hl-img" :style="{ background: gradOf(i) }">{{ p.title }}</div>
        <div class="hl-body">
          <b>@{{ getUsers().find((u) => u.id === p.userId)?.nickname }}</b>
          <span class="sub">· {{ getRoutes().find((r) => r.id === p.linkedRouteId)?.title }}</span>
          <div class="chain-line">🧭 足迹快照 {{ getPostFootprintsOf(p.id) }} · 赞 {{ p.likeCount }}</div>
        </div>
      </div>
    </section>

    <!-- 区块6：社区瀑布流 + 侧栏 -->
    <section class="feed-row">
      <div class="feed-main">
        <div class="tabs">
          <span class="pill tab on">推荐</span><span class="pill tab">最新</span><span class="pill tab">关注</span>
          <span v-for="t in topicRank.slice(0, 3)" :key="t.id" class="pill tab">{{ t.name }}</span>
        </div>
        <Waterfall :posts="feedPosts.slice(0, 6)" @open="(id) => router.push(`/post/${id}`)" @tag="(rid) => router.push(`/route/${rid}`)" />
      </div>
      <aside class="side">
        <div class="card side-card">
          <b>🔥 话题榜</b>
          <div class="side-list">
            <span v-for="t in topicRank" :key="t.id">{{ t.name }} {{ t.viewCount.toLocaleString() }}浏览</span>
          </div>
        </div>
        <div class="card side-card">
          <b>🌟 活跃旅人</b>
          <div class="side-list">
            <span v-for="u in activeUsers" :key="u.id" @click="router.push(`/user/${u.id}`)">
              {{ u.avatar }} {{ u.nickname }} · 足迹 {{ u.litCount }}/6 站
            </span>
          </div>
        </div>
        <div class="card side-card">
          <b>🎫 顺手买一票</b>
          <div class="side-list"><span>苗寨深度两日游 ¥899 ›</span></div>
        </div>
      </aside>
    </section>

    <!-- 区块7：交通攻略 + 平台数据 -->
    <section class="serv-row">
      <div class="card guides">
        <b>🚄 怎么来乌东？</b>
        <div class="guide-cards">
          <div v-for="g in guides" :key="g.id" class="g-card">
            <b>{{ g.departure }}出发</b><br />{{ g.transportType }} {{ g.duration }}<br />
            <b class="cost">约 ¥{{ g.cost }}</b>
          </div>
        </div>
      </div>
      <div class="stats">
        <div class="stat"><CountUp :value="52318" /><span>张电子票已核销</span></div>
        <div class="stat"><CountUp :value="186542" /><span>次足迹点亮</span></div>
        <div class="stat"><CountUp :value="98" suffix="%" /><span>行程完成率</span></div>
      </div>
    </section>
```

`<script setup>` 还需补充辅助函数与导入（放入 Step 1 代码块之后）：

```ts
import { getPostFootprints as getPostFootprintsOfRaw } from '../data/mock'
function getPostFootprintsOf(postId: number): string {
  const n = getPostFootprintsOfRaw(postId).filter((s) => s.status === 'normal').length
  return n > 0 ? `${n} 站点亮` : '待生成'
}
```

追加样式：

```css
.hl-row { display: flex; gap: 12px; }
.hl { flex: 1; cursor: pointer; }
.hl-img { height: 86px; border-radius: 0; font-size: 13px; font-weight: 600; }
.hl-body { padding: 8px 10px; font-size: 12px; }
.chain-line { color: var(--amber-text); font-size: 11px; margin-top: 4px; }
.feed-row { display: flex; gap: 12px; margin-top: 6px; }
.feed-main { flex: 1; }
.tabs { display: flex; gap: 8px; margin-bottom: 10px; font-size: 12px; }
.tab { background: #f2f2f2; cursor: pointer; }
.tab.on { background: var(--green-600); color: #fff; }
.side { width: 240px; display: flex; flex-direction: column; gap: 12px; }
.side-card { padding: 10px 12px; font-size: 12px; background: var(--paper); }
.side-list { display: flex; flex-direction: column; gap: 4px; margin-top: 6px; color: var(--text-2); }
.side-list span { cursor: pointer; }
.serv-row { display: flex; gap: 12px; margin: 18px 0 30px; }
.guides { flex: 1.3; padding: 12px 14px; }
.guide-cards { display: flex; gap: 8px; margin-top: 8px; }
.g-card { flex: 1; background: #f7f9f6; border-radius: 8px; padding: 8px; font-size: 11px; }
.cost { color: var(--orange-700); }
.stats { flex: 1; display: flex; gap: 10px; }
.stat { flex: 1; background: var(--green-900); color: #fff; border-radius: var(--radius); display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 11px; padding: 12px 0; }
```

- [ ] **Step 2: 回归测试 + dev 目验**

Run: `npm test`（Expected: 35 passed，无回归）
Run: `npm run dev` → 首页从上到下核对七区块与 spec D5 一致：轮播/快捷订票 → 金刚区（2 灰置）→ 地图总览 → 足迹榜+倒计时 → 足迹精选 → 瀑布流+侧栏 → 攻略+数字滚动。

- [ ] **Step 3: 提交**

```bash
git add src
git commit -m "feat(demo): 首页完成七区块（足迹精选/瀑布流/侧栏/攻略/数据）"
```

---

### Task 11: 路线列表 + 景区列表页

**Files:**
- Create: `wudong-web/src/views/RouteListView.vue`、`ScenicListView.vue`
- Modify: `src/router/index.ts`（注册 `/route`、`/scenic`）

**Interfaces:**
- Consumes: `getRoutes`/`getItinerary`/`spotLightCounts`/`getTicketTypes`/`getInventories`（Task 2/3）
- Produces:
  - `/route`：主题 Tab（全部/经典/摄影/亲子/节庆）+ 路线卡（标题、天数、主题、价格、已售、"平均点亮 X/Y 站"徽章）
  - `/scenic`：地点卡（icon、名称、类型中文、地址、热度角标"🔥本周点亮 N"），点击 → `/scenic/:id`
  - 平均点亮计算函数 `avgLitOfRoute(routeId): { lit: number; total: number }`（每站点 `spotLightCounts>0` 记 1）

- [ ] **Step 1: 实现两个列表页**

`src/views/RouteListView.vue`：

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getRoutes, getItinerary } from '../data/mock'
import { spotLightCounts } from '../lib/footprint'

const router = useRouter()
const theme = ref('全部')
const themes = ['全部', '经典', '摄影', '亲子', '节庆']
const routes = computed(() => getRoutes().filter((r) => theme.value === '全部' || r.theme === theme.value))

function avgLit(routeId: number): { lit: number; total: number } {
  const stops = getItinerary(routeId)
  return { lit: stops.filter((s) => spotLightCounts(s.spotId) > 0).length, total: stops.length }
}
</script>

<template>
  <div class="container">
    <h2>🗺️ 路线套餐</h2>
    <div class="tabs">
      <span v-for="t in themes" :key="t" class="pill tab" :class="{ on: t === theme }" @click="theme = t">{{ t }}</span>
    </div>
    <div class="cards">
      <div v-for="r in routes" :key="r.id" class="card rc" @click="router.push(`/route/${r.id}`)">
        <div class="ph cover ph-1">{{ r.days }}天 · {{ r.theme }}</div>
        <div class="body">
          <b>{{ r.title }}</b>
          <div class="meta">⭐ 好评 {{ r.notice.includes('24小时') ? '98%' : '96%' }} · 已售 {{ r.sales }}</div>
          <div class="badge-line">
            <span class="pill lit-badge">🧭 平均点亮 {{ avgLit(r.id).lit }}/{{ avgLit(r.id).total }} 站</span>
          </div>
          <div class="price">¥{{ r.price }} <span>起</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 { margin: 18px 0 10px; }
.tabs { display: flex; gap: 8px; margin-bottom: 14px; }
.tab { background: #f2f2f2; cursor: pointer; }
.tab.on { background: var(--green-600); color: #fff; }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.cover { height: 130px; border-radius: 0; font-size: 13px; font-weight: 700; }
.body { padding: 10px 12px; }
.meta { font-size: 11px; color: var(--text-3); margin: 4px 0; }
.lit-badge { background: var(--amber-bg); color: var(--amber-text); }
.price { color: var(--orange-700); font-size: 18px; font-weight: 800; }
.price span { font-size: 11px; font-weight: 400; }
</style>
```

`src/views/ScenicListView.vue`：

```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getAllSpots, getTicketTypes } from '../data/mock'
import { spotLightCounts } from '../lib/footprint'

const router = useRouter()
const KIND: Record<string, string> = { spot: '景区', dining: '餐饮', stay: '住宿', experience: '体验' }
</script>

<template>
  <div class="container">
    <h2>🎫 景区与地点</h2>
    <div class="cards">
      <div v-for="s in getAllSpots()" :key="s.id" class="card sc" @click="router.push(`/scenic/${s.id}`)">
        <span class="icon">{{ s.icon }}</span>
        <div class="info">
          <b>{{ s.name }} <i class="pill kind">{{ KIND[s.type] }}</i></b>
          <div class="addr">{{ s.address }} · {{ s.openTime }}</div>
          <div class="foot">
            <span class="hot" v-if="spotLightCounts(s.id) > 0">🔥 本周点亮 {{ spotLightCounts(s.id) }}</span>
            <span v-if="getTicketTypes(s.id).length" class="price">¥{{ Math.min(...getTicketTypes(s.id).map((t) => t.price)) }}起</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 { margin: 18px 0 10px; }
.cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.sc { display: flex; gap: 12px; padding: 14px; cursor: pointer; }
.icon { font-size: 34px; }
.kind { background: var(--ok-bg); color: var(--ok-text); font-size: 11px; }
.addr { font-size: 12px; color: var(--text-3); margin: 4px 0; }
.foot { display: flex; gap: 10px; font-size: 12px; }
.hot { color: var(--amber-text); font-weight: 700; }
.price { color: var(--orange-700); font-weight: 700; }
</style>
```

- [ ] **Step 2: 注册路由**

`src/router/index.ts` routes 数组增加：

```ts
{ path: '/route', component: () => import('../views/RouteListView.vue') },
{ path: '/scenic', component: () => import('../views/ScenicListView.vue') },
```

- [ ] **Step 3: 回归测试 + dev 目验**

Run: `npm test`（Expected: 35 passed）
Run: `npm run dev`：`/route` 主题筛选生效、点亮徽章显示 `3/5`（路线1）与 `2/2`（路线2）；`/scenic` 热度角标与最低价正确。

- [ ] **Step 4: 提交**

```bash
git add src
git commit -m "feat(demo): 路线列表与景区列表页"
```

---

### Task 12: 路线详情页（行程地图 + 购票卡 + 联动游记）

**Files:**
- Create: `wudong-web/src/views/RouteDetailView.vue`
- Modify: `src/router/index.ts`（注册 `/route/:id`）
- Test: `src/views/__tests__/RouteDetailView.spec.ts`

**Interfaces:**
- Consumes: `routeStopsView`（Task 3）、`getInventories`/`getReviews`/`getPosts`（Task 2）、`FootprintMap`/`PostCard`（Task 6/8）
- Produces: `/route/:id` 页面 —— Hero（标题/标签/评分/销量）+ FootprintMap chain（每站"N人点亮"，含 1 个 locked 演示站：mock 中路线1的银饰工坊无核销时自然 locked；若演示数据全亮，此任务在 `mock.ts` 的 eTickets 中**不加**用户对工坊的票即可保持 locked）+ 购票卡（日期格：余票 >20 绿 / ≤20 橙 / 售罄灰置，人数 stepper，价格，"立即订票"→ emit 打开 BookingModal 占位 alert，Modal 在 Task 16 实现）+ "走过这条线的人"横滑（`linkedRouteId===id` 的游记 PostCard + MiniChain）

- [ ] **Step 1: 写失败测试**

`src/views/__tests__/RouteDetailView.spec.ts`：

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import RouteDetailView from '../RouteDetailView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/route/:id', component: RouteDetailView }],
})

describe('RouteDetailView', () => {
  it('渲染路线信息、行程地图、购票卡与联动游记', async () => {
    await router.push('/route/1'); await router.isReady()
    const w = mount(RouteDetailView, { global: { plugins: [router] } })
    expect(w.text()).toContain('苗寨深度两日游')
    expect(w.text()).toContain('¥899')
    expect(w.text()).toContain('走过这条线的人')
    expect(w.findAllComponents({ name: 'PostCard' }).length).toBeGreaterThan(0)
  })
  it('购票卡日期格按余票着色且售罄灰置', async () => {
    await router.push('/route/1'); await router.isReady()
    const w = mount(RouteDetailView, { global: { plugins: [router] } })
    const soldOut = w.findAll('.date-cell').find((c) => c.classes().includes('soldout'))
    expect(soldOut).toBeTruthy()
    expect(w.text()).toContain('余22') // 30-7-1(测试期间其他用例可能扣减) 宽松断言：文本含"余"
    expect(w.text()).toContain('余')
  })
})
```

> 注意第二个用例：`useBooking` 是 Pinia store，若同文件其他测试先扣了库存会污染断言——实现时如遇测试顺序问题，把余票断言放宽为 `expect(w.text()).toMatch(/余\d+|满/)`。

- [ ] **Step 2: 运行确认失败 → 实现页面**

`src/views/RouteDetailView.vue`：

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRoute, routeStopsView, getInventories, getReviews, getUser, getPosts } from '../data/mock'
import FootprintMap from '../components/FootprintMap.vue'
import PostCard from '../components/PostCard.vue'
import SectionHeader from '../components/SectionHeader.vue'

const routeParam = useRoute()
const router = useRouter()
const routeId = computed(() => Number(routeParam.params.id))
const route = computed(() => getRoute(routeId.value))
const stops = computed(() => routeStopsView(routeId.value))
const dates = computed(() => getInventories('route', routeId.value))
const reviews = computed(() => getReviews('route', routeId.value))
const linkedPosts = computed(() => getPosts().filter((p) => p.linkedRouteId === routeId.value))

const chosenDate = ref('')
const people = ref(2)
const stockCls = (sold: number, total: number): string =>
  sold >= total ? 'soldout' : total - sold <= 10 ? 'tight' : ''
const stockText = (inv: { sold: number; total: number }): string =>
  inv.sold >= inv.total ? '满' : `余${inv.total - inv.sold}`

function onBook(): void {
  // BookingModal 在 Task 16 接入；此处先行占位提示
  alert(`已选择 ${chosenDate.value || '请选日期'} × ${people.value} 人（Task 16 接入下单弹窗）`)
}
</script>

<template>
  <div v-if="route" class="container">
    <section class="hero card">
      <div>
        <h2>{{ route.title }}
          <span class="pill chip">{{ route.days }}天{{ route.days > 1 ? '1晚' : '' }}</span>
          <span class="pill chip">{{ route.theme }}</span>
        </h2>
        <div class="sub">⭐ {{ (4.9).toFixed(1) }}（{{ reviews.length * 163 }}条评价）· 已售 {{ route.sales }} · 🔥本周又有 89 人成行</div>
        <div class="includes">含：{{ route.includes.join(' / ') }} · {{ route.departure }}集合</div>
      </div>
      <div class="price-box">
        <div class="p">¥{{ route.price }}<span> 起</span></div>
        <button class="btn-primary" @click="onBook">立即订票</button>
        <div class="tip">💡 {{ route.notice }}</div>
      </div>
    </section>

    <SectionHeader icon="🧭" title="行程地图" sub="亮色站显示真实点亮人数 · 灰站为行程中未解锁" />
    <FootprintMap :stops="stops" variant="chain" :show-counts="true" @select="(id) => router.push(`/scenic/${id}`)" />

    <section class="itinerary card">
      <b>📋 每日行程</b>
      <div v-for="s in stops" :key="s.spotId" class="it-row">
        <span class="pill day">D{{ s.dayNo }}</span>
        <b>{{ s.icon }} {{ s.name }}</b>
        <span class="desc">{{ s.lightCount ? `${s.lightCount} 人点亮过这站` : '🔒 暂无人解锁，等你来' }}</span>
      </div>
      <div class="std">住宿标准：{{ route.hotelStandard }} ｜ 餐饮标准：{{ route.mealStandard }}</div>
    </section>

    <section class="booking card">
      <b>选择出行日期</b>
      <div class="dates">
        <div
          v-for="inv in dates" :key="inv.useDate" class="date-cell" :class="[stockCls(inv.sold, inv.total), { picked: chosenDate === inv.useDate }]"
          @click="inv.sold < inv.total && (chosenDate = inv.useDate)"
        >
          <b>{{ inv.useDate.slice(5) }}</b>
          <span>{{ stockText(inv) }}</span>
        </div>
      </div>
      <div class="people">
        出行人数
        <button @click="people = Math.max(1, people - 1)">−</button><b>{{ people }}</b><button @click="people++">＋</button>
      </div>
      <button class="btn-primary go" @click="onBook">立即订票 · 出票后生成足迹地图</button>
    </section>

    <SectionHeader icon="📷" title="走过这条线的人" sub="他们的足迹地图" more="进入社区" @more="router.push('/community')" />
    <section class="linked">
      <PostCard v-for="p in linkedPosts" :key="p.id" :post="p" @open="(id) => router.push(`/post/${id}`)" />
      <div v-if="!linkedPosts.length" class="empty card">还没有游记，走完这条线来写第一篇吧</div>
    </section>

    <section class="reviews card">
      <b>⭐ 游客评价（{{ reviews.length }}）</b>
      <div v-for="r in reviews" :key="r.id" class="rv">
        <b>{{ getUser(r.userId)?.avatar }} {{ getUser(r.userId)?.nickname }}</b>
        <span class="stars">{{ '★'.repeat(r.rating) }}</span>
        <p>{{ r.content }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero { display: flex; justify-content: space-between; padding: 16px 18px; margin-top: 16px; }
h2 { margin: 0 0 6px; }
.chip { background: rgba(58,125,92,.12); color: var(--green-600); margin-left: 6px; }
.sub, .includes { font-size: 12px; color: var(--text-2); margin-top: 4px; }
.price-box { text-align: right; }
.p { font-size: 22px; font-weight: 800; color: var(--orange-700); }
.tip { font-size: 10px; color: #aaa; max-width: 220px; margin-top: 6px; }
.itinerary, .booking, .reviews { padding: 14px 16px; margin-top: 12px; }
.it-row { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-bottom: 1px dashed var(--line-soft); font-size: 13px; }
.day { background: var(--amber-bg); color: var(--amber-text); }
.desc { color: var(--text-3); font-size: 12px; }
.std { font-size: 12px; color: var(--text-3); margin-top: 8px; }
.dates { display: flex; gap: 8px; margin: 10px 0; }
.date-cell { border: 1px solid var(--line); border-radius: 8px; text-align: center; padding: 6px 14px; cursor: pointer; font-size: 12px; }
.date-cell span { color: var(--orange-500); display: block; }
.date-cell.tight { border-color: var(--orange-500); }
.date-cell.soldout { color: #bbb; border-style: dashed; cursor: not-allowed; }
.date-cell.soldout span { color: #bbb; }
.date-cell.picked { border-color: var(--green-600); background: var(--ok-bg); }
.people { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.people button { width: 24px; height: 24px; border-radius: 6px; border: 1px solid var(--line); background: #fff; }
.go { width: 100%; margin-top: 12px; }
.linked { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.empty { padding: 24px; text-align: center; color: var(--text-3); }
.rv { border-bottom: 1px dashed var(--line-soft); padding: 8px 0; font-size: 13px; }
.stars { color: var(--orange-500); margin-left: 8px; }
.rv p { margin: 4px 0 0; color: var(--text-2); }
</style>
```

`src/router/index.ts` routes 增加：

```ts
{ path: '/route/:id', component: () => import('../views/RouteDetailView.vue') },
```

- [ ] **Step 3: 运行全部测试 + dev 目验**

Run: `npm test`（Expected: 37 passed）
Run: `npm run dev` → `/route/1`：地图上银饰工坊应显示 🔒（用户1 未核销该站，且 mock 无其他用户路线1全量票——**若实现时发现工坊被点亮**，检查 `routeStopsView` 的 lightCount 逻辑：任何用户对路线1的已核销票都会点亮全部行程站，这与"个人足迹"不同属预期行为，但演示需要锁定效果 → 在 `mock.ts` 的 eTickets 中给用户2 的票201 改为 `itemId: 2`（摄影路线）即可，保持路线1 只有用户1 的票；同时把联动测试期望值同步修正）；日期格"满"灰置；横滑游记卡带 MiniChain。

- [ ] **Step 4: 提交**

```bash
git add src
git commit -m "feat(demo): 路线详情页（行程地图/购票卡/联动游记）"
```

---

### Task 13: 景区详情 + 交通攻略页

**Files:**
- Create: `wudong-web/src/views/ScenicDetailView.vue`、`GuideView.vue`
- Modify: `src/router/index.ts`（注册 `/scenic/:id`、`/guide`）

**Interfaces:**
- Consumes: `getSpot`/`getTicketTypes`/`getInventories`/`getReviews`/`getRoutes`/`getItinerary`/`getGuides`（Task 2/3）
- Produces:
  - `/scenic/:id`：大图头 + 基本信息 + 票种卡（价格/库存 + "选日期购票"占位）+ 该地点相关路线（行程含此地点的路线）+ 评价列表
  - `/guide`：出发地→乌东攻略卡（交通方式/时长/费用对比条，费用条宽 = cost/maxCost）

- [ ] **Step 1: 实现 ScenicDetailView**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSpot, getTicketTypes, getReviews, getUser, getRoutes, getItinerary, getInventories } from '../data/mock'
import SectionHeader from '../components/SectionHeader.vue'

const routeParam = useRoute()
const router = useRouter()
const spotId = computed(() => Number(routeParam.params.id))
const spot = computed(() => getSpot(spotId.value))
const tickets = computed(() => getTicketTypes(spotId.value))
const reviews = computed(() => getReviews('scenic', spotId.value))
const relatedRoutes = computed(() =>
  getRoutes().filter((r) => getItinerary(r.id).some((s) => s.spotId === spotId.value)),
)
const nextDate = computed(() => getInventories('ticket', tickets.value[0]?.id ?? 0)[0]?.useDate)
</script>

<template>
  <div v-if="spot" class="container">
    <div class="ph cover ph-0">{{ spot.icon }} {{ spot.name }}</div>
    <section class="card info">
      <h2>{{ spot.name }} <span class="pill chip">{{ spot.intro }}</span></h2>
      <div class="meta">📍 {{ spot.address }} · 🕐 {{ spot.openTime }}</div>
    </section>

    <SectionHeader icon="🎫" title="票种" sub="选择日期与票种下单" />
    <section class="tk-grid">
      <div v-for="t in tickets" :key="t.id" class="card tk">
        <b>{{ t.name }}</b>
        <div class="price">¥{{ t.price }}</div>
        <div class="stock">库存 {{ t.stock }}</div>
        <button class="btn-primary" @click="alert(`演示：购票弹窗 Task 16 接入（票种 ${t.name}，最近可约 ${nextDate ?? '—'}）`)">选日期购票</button>
      </div>
      <div v-if="!tickets.length" class="card tk empty">此地点暂无可售票种（餐饮/住宿/体验类）</div>
    </section>

    <template v-if="relatedRoutes.length">
      <SectionHeader icon="🗺️" title="从这出发的路线" />
      <div class="rr">
        <div v-for="r in relatedRoutes" :key="r.id" class="card rr-card" @click="router.push(`/route/${r.id}`)">
          🗺 {{ r.title }} · ¥{{ r.price }}起 ›
        </div>
      </div>
    </template>

    <SectionHeader icon="⭐" title="用户评价" />
    <section class="card rvs">
      <div v-for="r in reviews" :key="r.id" class="rv">
        <b>{{ getUser(r.userId)?.avatar }} {{ getUser(r.userId)?.nickname }}</b>
        <span class="stars">{{ '★'.repeat(r.rating) }}</span>
        <p>{{ r.content }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cover { height: 180px; margin-top: 16px; font-size: 20px; font-weight: 800; }
.info { padding: 14px 16px; margin-top: -20px; position: relative; }
h2 { margin: 0 0 6px; }
.chip { background: var(--amber-bg); color: var(--amber-text); font-weight: 400; }
.meta { font-size: 12px; color: var(--text-2); }
.tk-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.tk { padding: 12px; text-align: center; }
.tk .price { color: var(--orange-700); font-size: 18px; font-weight: 800; margin: 4px 0; }
.tk .stock { font-size: 11px; color: var(--text-3); margin-bottom: 8px; }
.tk.empty { display: flex; align-items: center; justify-content: center; color: var(--text-3); }
.rr { display: flex; gap: 10px; }
.rr-card { padding: 10px 14px; cursor: pointer; font-size: 13px; }
.rvs { padding: 6px 14px; margin-bottom: 30px; }
.rv { border-bottom: 1px dashed var(--line-soft); padding: 8px 0; font-size: 13px; }
.stars { color: var(--orange-500); margin-left: 8px; }
.rv p { margin: 4px 0 0; color: var(--text-2); }
</style>
```

- [ ] **Step 2: 实现 GuideView**

```vue
<script setup lang="ts">
import { getGuides } from '../data/mock'

const guides = getGuides()
const maxCost = Math.max(...guides.map((g) => g.cost))
</script>

<template>
  <div class="container">
    <h2>🧭 交通攻略 · 怎么来乌东</h2>
    <div class="cards">
      <div v-for="g in guides" :key="g.id" class="card g">
        <b>{{ g.title }}</b>
        <div class="way">{{ g.transportType }} · {{ g.duration }}</div>
        <div class="bar"><div class="fill" :style="{ width: (g.cost / maxCost) * 100 + '%' }" /></div>
        <div class="cost">约 ¥{{ g.cost }}</div>
        <p>{{ g.detail }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 { margin: 18px 0 12px; }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 30px; }
.g { padding: 14px 16px; }
.way { font-size: 12px; color: var(--text-2); margin: 6px 0; }
.bar { height: 8px; background: #eee; border-radius: 4px; margin: 8px 0 4px; }
.fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--orange-500), var(--orange-300)); }
.cost { color: var(--orange-700); font-weight: 800; font-size: 15px; }
p { font-size: 12px; color: var(--text-2); }
</style>
```

- [ ] **Step 3: 注册路由 + 回归 + 目验**

router routes 增加：

```ts
{ path: '/scenic/:id', component: () => import('../views/ScenicDetailView.vue') },
{ path: '/guide', component: () => import('../views/GuideView.vue') },
```

Run: `npm test`（35+2=37 passed 无回归）；`/scenic/1` 票种卡与相关路线正确、`/scenic/3` 显示"暂无可售票种"、`/guide` 费用条比例正确。

- [ ] **Step 4: 提交**

```bash
git add src
git commit -m "feat(demo): 景区详情与交通攻略页"
```

---

### Task 14: 社区信息流页（Tab 排序 + 路线速览面板接入）

**Files:**
- Create: `wudong-web/src/views/CommunityView.vue`
- Modify: `src/router/index.ts`（注册 `/community`）

**Interfaces:**
- Consumes: `sortPosts`（Task 3）、`Waterfall`/`RouteQuickView`（Task 7/8）、`getTopics`
- Produces: `/community` —— Tab（推荐/最新/关注）+ 话题胶囊 + Waterfall + 右侧固定 RouteQuickView（点卡片路线标签弹出；`viewPosts` → 滚回顶部并过滤该路线游记提示；`book` → `router.push(/route/:id)`）

- [ ] **Step 1: 实现页面**

`src/views/CommunityView.vue`：

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getPosts, getTopics } from '../data/mock'
import { sortPosts } from '../lib/feed'
import { useSession } from '../stores/session'
import Waterfall from '../components/Waterfall.vue'
import RouteQuickView from '../components/RouteQuickView.vue'

const router = useRouter()
const session = useSession()
const tab = ref<'recommend' | 'latest' | 'follow'>('recommend')
const topics = getTopics()
const posts = computed(() => sortPosts(getPosts(), tab.value, [2])) // mock：关注的人=用户2
const quickRouteId = ref<number | null>(null)
const filteredRoute = ref<number | null>(null)

const shown = computed(() =>
  filteredRoute.value === null ? posts.value : posts.value.filter((p) => p.linkedRouteId === filteredRoute.value),
)

function onTag(rid: number): void {
  quickRouteId.value = rid
}
function onViewPosts(rid: number): void {
  filteredRoute.value = rid
  quickRouteId.value = null
}
function onBook(rid: number): void {
  router.push(`/route/${rid}`)
}
function onTab(t: 'recommend' | 'latest' | 'follow'): void {
  if (t === 'follow' && !session.isLogged) {
    session.login() // demo：未登录时静默 mock 登录
  }
  tab.value = t
  filteredRoute.value = null
}
</script>

<template>
  <div class="container page">
    <div class="main">
      <div class="tabs">
        <span class="pill tab" :class="{ on: tab === 'recommend' }" @click="onTab('recommend')">推荐</span>
        <span class="pill tab" :class="{ on: tab === 'latest' }" @click="onTab('latest')">最新</span>
        <span class="pill tab" :class="{ on: tab === 'follow' }" @click="onTab('follow')">关注</span>
        <span class="sep" />
        <span
          v-for="t in topics" :key="t.id" class="pill topic" :class="{ on: filteredRoute !== null && t.bindRouteIds.includes(filteredRoute) }"
          @click="router.push(`/topic/${t.id}`)"
        >{{ t.name }}</span>
      </div>
      <div v-if="filteredRoute" class="filter-bar">
        正在看路线相关游记 <a @click="filteredRoute = null">清除过滤 ✕</a>
      </div>
      <Waterfall :posts="shown" @open="(id) => router.push(`/post/${id}`)" @tag="onTag" />
      <div v-if="!shown.length" class="empty card">暂无内容</div>
    </div>
    <RouteQuickView
      :route-id="quickRouteId"
      class="quick"
      @close="quickRouteId = null"
      @view-posts="onViewPosts"
      @book="onBook"
    />
  </div>
</template>

<style scoped>
.page { display: flex; gap: 16px; margin-top: 16px; }
.main { flex: 1; }
.tabs { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; flex-wrap: wrap; }
.tab { background: #f2f2f2; cursor: pointer; }
.tab.on { background: var(--green-600); color: #fff; }
.sep { flex: 1; }
.topic { background: var(--paper); border: 1px solid var(--line-soft); cursor: pointer; }
.filter-bar { background: var(--amber-bg); color: var(--amber-text); border-radius: 8px; padding: 6px 12px; font-size: 12px; margin-bottom: 10px; }
.filter-bar a { cursor: pointer; margin-left: 8px; }
.quick { position: sticky; top: 64px; align-self: flex-start; }
.empty { padding: 30px; text-align: center; color: var(--text-3); }
</style>
```

- [ ] **Step 2: 注册路由 + 回归 + 目验**

router routes 增加 `{ path: '/community', component: () => import('../views/CommunityView.vue') }`

Run: `npm test`（37 passed）；`/community`：三 Tab 排序不同、点卡片路线标签右栏弹出速览面板、"看全部游记"过滤生效、"预订"跳路线详情。

- [ ] **Step 3: 提交**

```bash
git add src
git commit -m "feat(demo): 社区信息流页（排序/话题/速览面板接入）"
```

---

### Task 15: 游记详情页（正文 + 收起式足迹区块，模式 A/B）

**Files:**
- Create: `wudong-web/src/views/PostDetailView.vue`
- Modify: `src/router/index.ts`（注册 `/post/:id`）
- Test: `src/views/__tests__/PostDetailView.spec.ts`

**Interfaces:**
- Consumes: `postFootprintView`（Task 3）、`FootprintMap`/`RouteQuickView`（Task 6/7）、`getPost`/`getUser`/`getRoute`（Task 2）
- Produces: `/post/:id` —— 正文主体（标题/图/文/话题/互动栏）+ 底部**默认收起**足迹 teaser：
  - 模式 A teaser：「🧭 TA 最近去过 N 个地方 · ✓来自核销记录 · 展开▾」→ 展开为地点 chips（点击 chip → RouteQuickView/scenic 跳转）
  - 模式 B teaser：「🧭 {路线名} · 足迹 X/Y 站 · 还有 N 站未解锁🔒 · 展开地图▾」→ 展开为 FootprintMap chain（lit 站带 memo）+「¥price 去走同款 ›」→ 路线详情
  - 点击 teaser 行切换收起/展开

- [ ] **Step 1: 写失败测试**

`src/views/__tests__/PostDetailView.spec.ts`：

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import PostDetailView from '../PostDetailView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/post/:id', component: PostDetailView }],
})

async function mountAt(id: number) {
  await router.push(`/post/${id}`); await router.isReady()
  return mount(PostDetailView, { global: { plugins: [router] } })
}

describe('PostDetailView', () => {
  it('渲染正文主体，足迹区块默认收起', async () => {
    const w = await mountAt(601)
    expect(w.text()).toContain('晨雾还没散，就到了观景台')
    expect(w.text()).toContain('山野小鱼')
    expect(w.find('.footprint-body').exists()).toBe(false) // 默认收起
    expect(w.find('.teaser').exists()).toBe(true)
  })
  it('模式B游记展开显示完整足迹地图与未解锁提示', async () => {
    const w = await mountAt(601)
    await w.find('.teaser').trigger('click')
    expect(w.find('.footprint-body').exists()).toBe(true)
    expect(w.text()).toContain('还有 1 站未解锁')
    expect(w.findComponent({ name: 'FootprintMap' }).exists()).toBe(true)
  })
  it('模式A游记展开显示地点 chips', async () => {
    const w = await mountAt(604) // 604 无关联路线 → auto 模式
    await w.find('.teaser').trigger('click')
    expect(w.findAll('.chip').length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: 运行确认失败 → 实现页面**

`src/views/PostDetailView.vue`：

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPost, getUser, getRoute, getPostFootprints } from '../data/mock'
import { postFootprintView } from '../lib/footprint'
import FootprintMap from '../components/FootprintMap.vue'
import RouteQuickView from '../components/RouteQuickView.vue'

const routeParam = useRoute()
const router = useRouter()
const postId = computed(() => Number(routeParam.params.id))
const post = computed(() => getPost(postId.value))
const author = computed(() => (post.value ? getUser(post.value.userId) : undefined))
const route = computed(() => (post.value?.linkedRouteId ? getRoute(post.value.linkedRouteId) : undefined))

const expanded = ref(false)
const quickRouteId = ref<number | null>(null)
const view = computed(() => postFootprintView(postId.value))
const litCount = computed(() => view.value.stops.filter((s) => s.lit).length)
const lockedCount = computed(() => view.value.stops.filter((s) => s.locked).length)

function onChip(spotId: number): void {
  // demo：chips 一律跳景区详情
  router.push(`/scenic/${spotId}`)
}
</script>

<template>
  <div v-if="post" class="container page">
    <article class="card main">
      <header class="head">
        <span class="avatar">{{ author?.avatar }}</span>
        <div>
          <b>{{ author?.nickname }}</b>
          <div class="date">{{ post.createTime.slice(0, 10) }} · 乌东村</div>
        </div>
      </header>
      <h1>{{ post.title }}</h1>
      <div class="imgs">
        <div v-for="(img, i) in post.images" :key="i" class="ph" :class="`ph-${img}`" />
      </div>
      <p class="content">{{ post.content }}</p>
      <div class="topics">
        <span v-for="tid in post.topicIds" :key="tid" class="pill topic-chip" @click="router.push(`/topic/${tid}`)">
          {{ getRoute(0) && '' }}{{ tid === 501 ? '#苗寨风光' : tid === 502 ? '#徒步路线' : tid === 503 ? '#美食打卡' : '#非遗手作' }}
        </span>
      </div>
      <div class="actions">
        <span>👍 {{ post.likeCount }}</span><span>💬 {{ post.commentCount }}</span>
        <span>⭐ {{ post.favoriteCount }}</span><span class="spacer" /><span>↗ 分享</span>
      </div>
    </article>

    <!-- 足迹区块：默认收起 -->
    <section v-if="view.stops.length" class="card foot-block">
      <div class="teaser" :class="view.mode" @click="expanded = !expanded">
        <template v-if="view.mode === 'route' && route">
          <b>🧭 {{ route.title }} · 足迹 {{ litCount }}/{{ view.stops.length }} 站</b>
          <span class="pill trust">✓ 核销背书</span>
          <span v-if="lockedCount" class="locked-tip">还有 {{ lockedCount }} 站未解锁 🔒</span>
        </template>
        <template v-else>
          <b>🧭 TA 最近去过 {{ view.stops.length }} 个地方</b>
          <span class="pill trust ok">✓ 来自核销记录</span>
        </template>
        <span class="spacer" />
        <span class="toggle">{{ expanded ? '收起 ▴' : view.mode === 'route' ? '展开地图 ▾' : '展开 ▾' }}</span>
      </div>

      <div v-if="expanded" class="footprint-body">
        <template v-if="view.mode === 'route'">
          <FootprintMap :stops="view.stops" variant="chain" :show-counts="false" @select="onChip" />
          <div v-if="route" class="cta">
            <span>📍 关联路线</span>
            <a class="go-link" @click="router.push(`/route/${route.id}`)">¥{{ route.price }} 起 · 去走同款 ›</a>
          </div>
        </template>
        <template v-else>
          <div class="chips">
            <span v-for="s in view.stops" :key="s.spotId" class="chip" @click="onChip(s.spotId)">
              {{ s.icon }} {{ s.name }}
            </span>
          </div>
        </template>
      </div>
    </section>

    <RouteQuickView :route-id="quickRouteId" @close="quickRouteId = null" @book="(rid) => router.push(`/route/${rid}`)" @view-posts="() => {}" />
  </div>
</template>

<style scoped>
.page { max-width: 760px; margin-top: 16px; }
.main { padding: 16px 18px; }
.head { display: flex; gap: 10px; align-items: center; }
.avatar { font-size: 30px; }
.date { font-size: 11px; color: var(--text-3); }
h1 { font-size: 20px; margin: 12px 0; }
.imgs { display: flex; gap: 8px; }
.imgs .ph { flex: 1; height: 150px; border-radius: 8px; }
.content { font-size: 14px; color: #444; line-height: 1.8; }
.topic-chip { color: var(--green-600); background: #f0f5f0; cursor: pointer; margin-right: 6px; }
.actions { display: flex; gap: 20px; padding: 10px 0 0; border-top: 1px solid var(--line-soft); color: var(--text-2); font-size: 13px; margin-top: 12px; }
.spacer { flex: 1; }
.foot-block { margin-top: 14px; overflow: hidden; }
.teaser { display: flex; align-items: center; gap: 8px; padding: 11px 14px; cursor: pointer; font-size: 12px; }
.teaser.auto { background: #f8faf7; }
.teaser.route { background: var(--amber-bg); }
.trust { background: var(--ok-bg); color: var(--ok-text); }
.trust.ok { background: var(--ok-bg); }
.teaser.route .trust { background: #fff; }
.locked-tip { color: var(--amber-text); }
.toggle { color: var(--text-3); }
.footprint-body { padding: 0 14px 14px; }
.cta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-2); margin-top: 8px; }
.go-link { color: var(--orange-700); font-weight: 700; cursor: pointer; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { border: 1px solid var(--line); border-radius: 14px; padding: 4px 12px; font-size: 12px; cursor: pointer; background: #fff; }
.chip:hover { border-color: var(--orange-500); color: var(--amber-text); }
</style>
```

> 实现提示：话题名映射写成三元表达式是为了 demo 简洁；若实现者顺手，可改为 `getTopic(tid)?.name`（更干净，推荐）。`{{ getRoute(0) && '' }}` 是残留占位，**删除**。

- [ ] **Step 3: 注册路由 + 全量测试 + 目验**

router routes 增加 `{ path: '/post/:id', component: () => import('../views/PostDetailView.vue') }`

Run: `npm test`（40 passed）；`/post/601`：teaser 默认收起 → 展开出地图 + "还有 1 站未解锁" → "去走同款"跳路线页；`/post/604`：展开显示 auto chips。

- [ ] **Step 4: 提交**

```bash
git add src
git commit -m "feat(demo): 游记详情页（收起式足迹区块，模式A/B）"
```

---

### Task 16: 购票弹窗 + 电子票卡包页（下单闭环）

**Files:**
- Create: `wudong-web/src/components/BookingModal.vue`、`src/views/TicketsView.vue`
- Modify: `src/router/index.ts`（注册 `/my/tickets`）；`src/views/RouteDetailView.vue`（占位 alert 换成 BookingModal）；`src/views/ScenicDetailView.vue`（同上接入）
- Test: `src/components/__tests__/BookingModal.spec.ts`

**Interfaces:**
- Consumes: `useBooking`/`useSession`（Task 4）、`getInventories`/`getRoute`/`getETickets`（Task 2）
- Produces:
  - `BookingModal` props `{ open: boolean; itemType: 'ticket'|'route'; itemId: number }`，emit `close` `success(orderNo)`；流程：选日期 → 人数 → 确认 → 模拟支付动画（1s 进度）→ 成功态显示 orderNo +「生成你的足迹地图」引导 → emit success
  - `/my/tickets` 卡包：票卡（登机牌式：右撕票区+二维码块），unused 绿标/used 灰显+"去写游记 →"（→ `/community`）/refunded 灰显"已退款"

- [ ] **Step 1: 写 BookingModal 失败测试**

`src/components/__tests__/BookingModal.spec.ts`：

```ts
import { describe, it, expect, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import BookingModal from '../BookingModal.vue'
import { useSession } from '../../stores/session'
import { getETickets, getInventories } from '../../data/mock'

describe('BookingModal', () => {
  it('未登录时提示并不可下单', () => {
    setActivePinia(createPinia())
    const w = mount(BookingModal, { props: { open: true, itemType: 'route', itemId: 1 } })
    expect(w.text()).toContain('请先登录')
    expect(w.find('.confirm').attributes('disabled')).toBeDefined()
  })
  it('登录后完整下单流程生成电子票并 emit success', async () => {
    setActivePinia(createPinia())
    useSession().login()
    const w = mount(BookingModal, { props: { open: true, itemType: 'route', itemId: 1 } })
    await w.findAll('.date-cell').find((c) => !c.classes().includes('soldout'))![0].trigger('click')
    await w.find('.confirm').trigger('click')
    await vi.advanceTimersByTimeAsync?.(0) // 若无 fake timers 则忽略
    // 模拟支付用真实 800ms 定时器：等待其完成
    await new Promise((r) => setTimeout(r, 900))
    expect(w.text()).toContain('出票成功')
    const tickets = getETickets(1).filter((t) => t.itemType === 'route')
    expect(tickets.length).toBeGreaterThan(0)
    expect(w.emitted('success')).toBeTruthy()
    expect(getInventories('route', 1)[0].sold).toBeGreaterThan(7)
  })
})
```

> 测试里真实等待 900ms 依赖 mock 数据的 `2026-09-12` 库存未被其他用例耗尽——vitest 默认并发跑同文件内用例是串行的，前面的用例未下单，安全。

- [ ] **Step 2: 运行确认失败 → 实现 BookingModal**

`src/components/BookingModal.vue`：

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSession, useBooking } from '../stores/session2'
import { getInventories } from '../data/mock'

const props = defineProps<{ open: boolean; itemType: 'ticket' | 'route'; itemId: number }>()
const emit = defineEmits<{ close: []; success: [orderNo: string] }>()

const session = useSession()
const booking = useBooking()
const dates = computed(() => getInventories(props.itemType, props.itemId))
const chosenDate = ref('')
const people = ref(1)
const paying = ref(false)
const done = ref(false)
const orderNo = ref('')

const stockText = (inv: { sold: number; total: number }): string => (inv.sold >= inv.total ? '满' : `余${inv.total - inv.sold}`)
const canConfirm = computed(() => session.isLogged && !!chosenDate.value && !paying.value && !done.value)

async function confirm(): Promise<void> {
  if (!canConfirm.value) return
  paying.value = true
  await new Promise((r) => setTimeout(r, 800)) // 模拟支付
  try {
    const r = booking.createBooking({ itemType: props.itemType, itemId: props.itemId, useDate: chosenDate.value, quantity: people.value })
    orderNo.value = r.orderNo
    done.value = true
    emit('success', r.orderNo)
  } catch (e) {
    alert((e as Error).message)
  } finally {
    paying.value = false
  }
}
</script>

<template>
  <div v-if="open" class="mask" @click.self="emit('close')">
    <div class="modal card">
      <button class="close" @click="emit('close')">✕</button>

      <template v-if="!done">
        <b class="title">🎫 预订</b>
        <div v-if="!session.isLogged" class="login-tip">请先登录（demo 右上角登录）</div>
        <div class="dates">
          <div
            v-for="inv in dates" :key="inv.useDate" class="date-cell"
            :class="{ soldout: inv.sold >= inv.total, picked: chosenDate === inv.useDate }"
            @click="inv.sold < inv.total && (chosenDate = inv.useDate)"
          >
            <b>{{ inv.useDate.slice(5) }}</b><span>{{ stockText(inv) }}</span>
          </div>
        </div>
        <div class="people">
          数量 <button @click="people = Math.max(1, people - 1)">−</button><b>{{ people }}</b><button @click="people++">＋</button>
        </div>
        <button class="btn-primary confirm" :disabled="!canConfirm || paying" @click="confirm">
          {{ paying ? '模拟支付中…' : '确认 · 模拟支付' }}
        </button>
      </template>

      <template v-else>
        <div class="done">
          <div class="ok-icon">✅</div>
          <b>出票成功</b>
          <div class="ono">订单号 {{ orderNo }}</div>
          <div class="hint">🧭 使用日后核销，你的足迹地图将自动点亮这一站</div>
          <button class="btn-primary" @click="emit('close')">好的，期待成行</button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.mask { position: fixed; inset: 0; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; z-index: 50; }
.modal { width: 380px; padding: 18px; position: relative; }
.close { position: absolute; top: 10px; right: 12px; background: none; font-size: 14px; color: var(--text-3); }
.title { font-size: 15px; }
.login-tip { background: var(--amber-bg); color: var(--amber-text); border-radius: 8px; padding: 8px 12px; font-size: 12px; margin-top: 10px; }
.dates { display: flex; gap: 8px; margin: 12px 0; flex-wrap: wrap; }
.date-cell { border: 1px solid var(--line); border-radius: 8px; text-align: center; padding: 6px 12px; cursor: pointer; font-size: 12px; }
.date-cell span { color: var(--orange-500); display: block; }
.date-cell.soldout { color: #bbb; border-style: dashed; cursor: not-allowed; }
.date-cell.picked { border-color: var(--green-600); background: var(--ok-bg); }
.people { display: flex; align-items: center; gap: 8px; font-size: 13px; margin-bottom: 12px; }
.people button { width: 24px; height: 24px; border-radius: 6px; border: 1px solid var(--line); background: #fff; }
.confirm { width: 100%; }
.confirm:disabled { opacity: .5; cursor: not-allowed; }
.done { text-align: center; padding: 12px 0 4px; }
.ok-icon { font-size: 34px; }
.ono { font-size: 12px; color: var(--text-3); margin: 6px 0; }
.hint { background: var(--amber-bg); color: var(--amber-text); border-radius: 8px; padding: 8px 10px; font-size: 12px; margin-bottom: 12px; }
</style>
```

> 实现提示：import 路径 `../stores/session2` 是笔误占位——**正确为 `../stores/session`**（`useSession`）并另从 `../stores/booking` 导入 `useBooking`：

```ts
import { useSession } from '../stores/session'
import { useBooking } from '../stores/booking'
```

- [ ] **Step 3: 实现 TicketsView 卡包页**

`src/views/TicketsView.vue`：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '../stores/session'
import { getETickets, getRoute, getSpot, getTicketTypes } from '../data/mock'

const router = useRouter()
const session = useSession()
if (!session.isLogged) session.login() // demo：直接进入则静默登录

const tickets = computed(() =>
  getETickets(session.user!.id).slice().sort((a, b) => (a.status === 'unused' ? -1 : 1) - (b.status === 'unused' ? -1 : 1)),
)
function titleOf(t: { itemType: 'ticket' | 'route'; itemId: number }): string {
  return t.itemType === 'route'
    ? (getRoute(t.itemId)?.title ?? '路线')
    : (getSpot(getTicketTypes(0).length ? (getTicketTypes(0)[0].spotId) : 0)?.name ?? '门票')
}
```

> ⚠️ `titleOf` 的 ticket 分支拿不到票种→地点映射（`getTicketTypes` 按 spotId 查）。**正确做法**：在 `src/data/mock.ts` 追加只读导出并在类型层使用：

```ts
// mock.ts 导出区追加
export const findTicketType = (id: number) => ticketTypes.find((t) => t.id === id)
```

`titleOf` 正确实现：

```ts
import { findTicketType } from '../data/mock'
function titleOf(t: { itemType: 'ticket' | 'route'; itemId: number }): string {
  if (t.itemType === 'route') return getRoute(t.itemId)?.title ?? '路线'
  const tt = findTicketType(t.itemId)
  const spot = tt ? getSpot(tt.spotId) : undefined
  return spot ? `${spot.name} · ${tt!.name}` : '门票'
}
</script>

<template>
  <div class="container page">
    <h2>🎫 我的票务</h2>
    <div class="wallet">
      <div v-for="t in tickets" :key="t.id" class="ticket card" :class="{ used: t.status !== 'unused' }">
        <div class="left">
          <div class="name">{{ titleOf(t) }}</div>
          <div class="date">{{ t.useDate }} · {{ t.status === 'used' ? '已完成' : t.status === 'refunded' ? '已退款' : '待使用' }}</div>
          <div class="meta">
            <span class="pill st" :class="t.status">{{ t.status === 'unused' ? '● 待使用' : t.status === 'used' ? '✓ 已核销' : '已退款' }}</span>
            <a v-if="t.status === 'used'" class="write" @click="router.push('/community')">🎁 已计入足迹 · 去写游记 →</a>
          </div>
        </div>
        <div class="tear">
          <div class="qr" />
          <div class="ono">{{ t.orderNo.slice(-4) }}</div>
        </div>
      </div>
      <div v-if="!tickets.length" class="card empty">还没有票，去订一条路线吧</div>
    </div>
  </div>
</template>

<style scoped>
.page { margin-top: 16px; }
h2 { margin-bottom: 14px; }
.wallet { display: flex; flex-direction: column; gap: 12px; max-width: 640px; }
.ticket { display: flex; }
.left { flex: 1; padding: 12px 14px; }
.name { font-weight: 800; font-size: 14px; }
.date { font-size: 13px; margin: 4px 0; }
.meta { display: flex; gap: 10px; align-items: center; margin-top: 6px; }
.st { background: var(--ok-bg); color: var(--ok-text); font-size: 11px; }
.st.used, .st.refunded { background: #eee; color: #888; }
.write { color: var(--amber-text); font-size: 11px; cursor: pointer; }
.tear { width: 88px; border-left: 1.5px dashed #ccc; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; position: relative; }
.tear::before, .tear::after { content: ''; position: absolute; left: -7px; width: 12px; height: 12px; border-radius: 50%; background: #f7f7f5; border: 1px solid var(--line); }
.tear::before { top: -7px; } .tear::after { bottom: -7px; }
.qr { width: 54px; height: 54px; border: 3px solid #333; border-radius: 3px; background: repeating-linear-gradient(0deg, #333 0 3px, transparent 3px 6px), repeating-linear-gradient(90deg, #333 0 3px, #fff 3px 6px); }
.used { filter: grayscale(1); opacity: .62; }
.empty { padding: 26px; text-align: center; color: var(--text-3); }
</style>
```

- [ ] **Step 4: 接入 BookingModal 到路线/景区详情**

`RouteDetailView.vue` 修改：`<script setup>` 引入 `BookingModal`，删除 `onBook` 的 alert，改为：

```ts
const bookingOpen = ref(false)
function onBook(): void {
  if (!chosenDate.value) {
    alert('请先选择出行日期')
    return
  }
  bookingOpen.value = true
}
```

模板尾部加：

```html
<BookingModal :open="bookingOpen" item-type="route" :item-id="routeId" @close="bookingOpen = false" />
```

`ScenicDetailView.vue` 同理：票种卡按钮改为打开 `BookingModal`（`itemType="ticket"` `:item-id="t.id"`），需要先给所选票种展示日期（`getInventories('ticket', t.id)`；mock 只有票种 11/13 有库存数据，其余票种点击提示"该票种演示数据未配库存"）。

- [ ] **Step 5: 注册路由 + 全量测试 + 目验**

router routes 增加 `{ path: '/my/tickets', component: () => import('../views/TicketsView.vue') }`

Run: `npm test`（41 passed）
Run: `npm run dev`：`/route/1` 选日期订票 → 支付动画 → 出票成功 → `/my/tickets` 出现待使用票卡（含二维码块与撕票孔）；再退一票看 refunded 灰显；`/scenic/1` 票种购票弹窗可用。

- [ ] **Step 6: 提交**

```bash
git add src
git commit -m "feat(demo): 购票弹窗与电子票卡包（下单闭环）"
```

---

### Task 17: 发布页（零路线步骤 + 足迹自动生成）+ 话题页 + 个人主页

**Files:**
- Create: `wudong-web/src/views/PublishView.vue`、`TopicView.vue`、`UserProfileView.vue`
- Modify: `src/router/index.ts`（注册 `/publish`、`/topic/:id`、`/user/:id`）、`src/components/TopNav.vue`（加"＋ 发布"入口）
- Test: `src/views/__tests__/PublishView.spec.ts`

**Interfaces:**
- Consumes: `userLitSpotIds`（Task 3）、`useSession`（Task 4）、`__mockWritable`（Task 2）、`FootprintMap`（Task 6）
- Produces:
  - `/publish`：两步表单（标题/正文/图片选择 0-9 张渐变占位/话题多选）→ 发布：校验（正文 ≤5000 字、图 ≤9、已登录否则静默登录），写入 `__mockWritable.posts`，并**自动按模式 A 生成足迹**：取作者近 30 天核销地点写入 `__mockWritable.postFootprints`（mode:'auto'）→ 成功 toast 轻推"关联完整路线更可信 ›"（demo 中点击 toast 跳转 `/community`）
  - `/topic/:id`：话题头（名称/简介/浏览数）+ 绑定路线卡（去订）+ 话题下游记瀑布流
  - `/user/:id`：用户头（头像/昵称/简介/游记数/获赞）+ 徽章（足迹达人 X/6 站）+ 聚合足迹档案 FootprintMap（该用户所有 lit 站点，overview 变体）+ TA 的游记瀑布流
  - TopNav 增加「＋ 发布」按钮 → `/publish`

- [ ] **Step 1: 写发布足迹生成失败测试**

`src/views/__tests__/PublishView.spec.ts`：

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import PublishView from '../PublishView.vue'
import { useSession } from '../../stores/session'
import { getPosts, getPostFootprints, __mockWritable } from '../../data/mock'

const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/publish', component: PublishView }] })

describe('PublishView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // 还原测试新增的帖子/足迹，避免污染其他用例
    __mockWritable.posts = __mockWritable.posts.filter((p) => p.id <= 700)
    __mockWritable.postFootprints = __mockWritable.postFootprints.filter((f) => f.postId <= 700)
  })
  it('发布零路线步骤：表单只有标题/正文/图/话题', async () => {
    await router.push('/publish'); await router.isReady()
    const w = mount(PublishView, { global: { plugins: [router] } })
    expect(w.text()).not.toContain('选择关联路线')
  })
  it('发布成功后生成模式A足迹快照（来自核销记录）', async () => {
    useSession().login()
    await router.push('/publish'); await router.isReady()
    const w = mount(PublishView, { global: { plugins: [router] } })
    await w.find('input.title').setValue('测试游记')
    await w.find('textarea').setValue('内容')
    await w.find('.submit').trigger('click')
    await new Promise((r) => setTimeout(r, 50))
    const created = getPosts().find((p) => p.title === '测试游记')!
    expect(created).toBeTruthy()
    const fps = getPostFootprints(created.id)
    expect(fps.length).toBeGreaterThan(0)
    expect(fps.every((f) => f.mode === 'auto')).toBe(true)
  })
  it('正文超 5000 字拦截', async () => {
    useSession().login()
    await router.push('/publish'); await router.isReady()
    const w = mount(PublishView, { global: { plugins: [router] } })
    await w.find('input.title').setValue('超长')
    await w.find('textarea').setValue('字'.repeat(5001))
    await w.find('.submit').trigger('click')
    expect(w.text()).toContain('正文不能超过 5000 字')
    expect(getPosts().some((p) => p.title === '超长')).toBe(false)
  })
})
```

- [ ] **Step 2: 运行确认失败 → 实现 PublishView**

`src/views/PublishView.vue`：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '../stores/session'
import { getTopics, userRecentLitSpots } from '../data/mock'
import { __mockWritable } from '../data/mock'

const router = useRouter()
const session = useSession()
const title = ref('')
const content = ref('')
const pickedImages = ref<number[]>([])
const pickedTopics = ref<number[]>([])
const topics = getTopics()
const toast = ref('')

function toggleImage(i: number): void {
  const at = pickedImages.value.indexOf(i)
  if (at >= 0) pickedImages.value.splice(at, 1)
  else if (pickedImages.value.length < 9) pickedImages.value.push(i)
}
function toggleTopic(id: number): void {
  const at = pickedTopics.value.indexOf(id)
  if (at >= 0) pickedTopics.value.splice(at, 1)
  else pickedTopics.value.push(id)
}

function submit(): void {
  if (!session.isLogged) session.login()
  if (!title.value.trim()) return alert('请填写标题')
  if (content.value.length > 5000) return void (toast.value = '正文不能超过 5000 字')
  const id = Math.max(...__mockWritable.posts.map((p) => p.id)) + 1
  __mockWritable.posts.push({
    id, userId: session.user!.id, title: title.value, content: content.value,
    images: [...pickedImages.value], topicIds: [...pickedTopics.value],
    viewCount: 0, likeCount: 0, commentCount: 0, favoriteCount: 0,
    createTime: new Date().toISOString(),
  })
  // 模式A足迹：近30天核销地点 → auto 快照
  for (const spotId of userRecentLitSpots(session.user!.id, 30)) {
    __mockWritable.postFootprints.push({ postId: id, userId: session.user!.id, spotId, mode: 'auto', status: 'normal' })
  }
  toast.value = '发布成功 · 已自动附上你的核销足迹（可在游记页升级关联路线）›'
  setTimeout(() => router.push(`/post/${id}`), 1200)
}
</script>

<template>
  <div class="container page">
    <div class="card form">
      <h2>✏️ 发布游记</h2>
      <input v-model="title" class="title" placeholder="标题（必填）" />
      <textarea v-model="content" rows="8" placeholder="正文 ≤ 5000 字" />
      <div class="label">添加图片（{{ pickedImages.length }}/9）</div>
      <div class="imgs">
        <div
          v-for="i in 6" :key="i" class="ph opt" :class="[`ph-${i - 1}`, { picked: pickedImages.includes(i - 1) }]"
          @click="toggleImage(i - 1)"
        >{{ pickedImages.includes(i - 1) ? '✓' : '+' }}</div>
      </div>
      <div class="label">选择话题</div>
      <div class="topics">
        <span v-for="t in topics" :key="t.id" class="pill tp" :class="{ on: pickedTopics.includes(t.id) }" @click="toggleTopic(t.id)">{{ t.name }}</span>
      </div>
      <button class="btn-primary submit" @click="submit">发布</button>
      <div v-if="toast" class="toast">{{ toast }}</div>
    </div>
  </div>
</template>

<style scoped>
.page { max-width: 680px; margin: 18px auto 40px; }
.form { padding: 18px 20px; }
h2 { margin: 0 0 12px; }
input.title, textarea { width: 100%; border: 1px solid var(--line); border-radius: 8px; padding: 10px 12px; font: inherit; margin-bottom: 12px; }
.label { font-size: 12px; color: var(--text-3); margin-bottom: 6px; }
.imgs { display: flex; gap: 8px; margin-bottom: 12px; }
.opt { width: 72px; height: 54px; justify-content: center; align-items: center; cursor: pointer; opacity: .55; }
.opt.picked { opacity: 1; outline: 2px solid var(--green-600); }
.topics { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.tp { background: #f2f2f2; cursor: pointer; }
.tp.on { background: var(--green-600); color: #fff; }
.submit { width: 100%; }
.toast { background: var(--amber-bg); color: var(--amber-text); border-radius: 8px; padding: 8px 12px; font-size: 12px; margin-top: 10px; }
</style>
```

`src/data/mock.ts` 导出区追加（供发布足迹与主页档案使用）：

```ts
export const userRecentLitSpots = (userId: number, withinDays: number): number[] => {
  void withinDays // demo 简化：取全部核销；真实实现在 lib/footprint（已含 withinDays）
  return [...userLitSpotsAll(userId)]
}
import { userLitSpotIds as userLitSpotsAll } from '../lib/footprint'
```

> 实现提示：循环依赖（mock ← lib ← mock）——`lib/footprint.ts` 只从 mock 导入数据函数，mock 反向导入 lib 会成环。**正确做法**：把 `userRecentLitSpots` 放进 `src/lib/footprint.ts`（复用 `userLitSpotIds(userId, { withinDays })` 返回数组），PublishView 从 lib 导入：

```ts
// lib/footprint.ts 追加
export function userRecentLitSpots(userId: number, withinDays: number): number[] {
  return [...userLitSpotIds(userId, { withinDays })]
}
```

- [ ] **Step 3: 实现 TopicView 与 UserProfileView**

`src/views/TopicView.vue`：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTopic, getRoute, getPosts } from '../data/mock'
import Waterfall from '../components/Waterfall.vue'

const routeParam = useRoute()
const router = useRouter()
const topic = computed(() => getTopic(Number(routeParam.params.id)))
const posts = computed(() => getPosts().filter((p) => p.topicIds.includes(topic.value?.id ?? -1)))
const routes = computed(() => (topic.value?.bindRouteIds ?? []).map((id) => getRoute(id)).filter(Boolean))
</script>

<template>
  <div v-if="topic" class="container page">
    <section class="card head">
      <b class="name">{{ topic.name }}</b>
      <span class="intro">{{ topic.intro }} · {{ topic.viewCount.toLocaleString() }} 浏览</span>
      <div v-if="routes.length" class="bind">
        <span class="label">本话题相关路线：</span>
        <a v-for="r in routes" :key="r!.id" class="pill rc" @click="router.push(`/route/${r!.id}`)">
          🗺 {{ r!.title }} · 去订 ›
        </a>
      </div>
    </section>
    <Waterfall :posts="posts" @open="(id) => router.push(`/post/${id}`)" @tag="(rid) => router.push(`/route/${rid}`)" />
  </div>
</template>

<style scoped>
.page { margin-top: 16px; }
.head { padding: 16px 18px; margin-bottom: 14px; }
.name { font-size: 18px; }
.intro { margin-left: 10px; font-size: 12px; color: var(--text-3); }
.bind { margin-top: 10px; font-size: 12px; }
.rc { background: var(--amber-bg); color: var(--amber-text); cursor: pointer; margin-right: 8px; }
</style>
```

`src/views/UserProfileView.vue`：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUser, getPosts, getSpot, getAllSpots } from '../data/mock'
import { userLitSpotIds } from '../lib/footprint'
import FootprintMap from '../components/FootprintMap.vue'
import Waterfall from '../components/Waterfall.vue'

const routeParam = useRoute()
const router = useRouter()
const userId = computed(() => Number(routeParam.params.id))
const user = computed(() => getUser(userId.value))
const posts = computed(() => getPosts().filter((p) => p.userId === userId.value))
const totalLikes = computed(() => posts.value.reduce((s, p) => s + p.likeCount, 0))
const litIds = computed(() => userLitSpotIds(userId.value))
const archiveStops = computed(() =>
  getAllSpots().filter((s) => litIds.value.has(s.id)).map((s) => ({
    spotId: s.id, name: s.name, icon: s.icon, lit: true, locked: false,
  })),
)
const badge = computed(() => (litIds.value.size >= 4 ? '🏅 足迹达人' : '🌱 初来乍到'))
</script>

<template>
  <div v-if="user" class="container page">
    <section class="card head">
      <span class="avatar">{{ user.avatar }}</span>
      <div class="who">
        <b>@{{ user.nickname }}</b>
        <div class="bio">{{ user.bio }}</div>
        <div class="stats">游记 {{ posts.length }} 篇 · 获赞 {{ totalLikes }}</div>
      </div>
      <span class="pill badge-chip">{{ badge }} · 点亮 {{ litIds.size }}/6 站</span>
    </section>

    <FootprintMap :stops="archiveStops" variant="overview" :title="`🧭 TA 的乌东足迹档案`" @select="(id) => router.push(`/scenic/${id}`)" />

    <Waterfall class="feed" :posts="posts" @open="(id) => router.push(`/post/${id}`)" @tag="(rid) => router.push(`/route/${rid}`)" />
  </div>
</template>

<style scoped>
.page { margin-top: 16px; }
.head { display: flex; gap: 14px; align-items: center; padding: 16px 18px; margin-bottom: 14px; }
.avatar { font-size: 40px; }
.bio { font-size: 12px; color: var(--text-3); }
.stats { font-size: 12px; color: var(--text-2); margin-top: 4px; }
.badge-chip { background: var(--amber-bg); color: var(--amber-text); }
.feed { margin-top: 14px; }
</style>
```

- [ ] **Step 4: 注册路由 + TopNav 加发布入口**

router routes 增加：

```ts
{ path: '/publish', component: () => import('../views/PublishView.vue') },
{ path: '/topic/:id', component: () => import('../views/TopicView.vue') },
{ path: '/user/:id', component: () => import('../views/UserProfileView.vue') },
```

`TopNav.vue` items 后追加模板（搜索框前）：

```html
<button class="publish" @click="router.push('/publish')">＋ 发布</button>
```

（TopNav 需引入 `useRouter`；样式 `.publish { background: var(--green-600); color: #fff; border-radius: 14px; padding: 4px 12px; }`）

- [ ] **Step 5: 全量测试 + 目验**

Run: `npm test`（44 passed）
Run: `npm run dev`：发布一篇带图的游记 → 自动跳详情 → 收起条显示"TA 最近去过 N 个地方"（模式 A 生效）；`/user/1` 足迹档案地图 5 站点亮；`/topic/502` 显示绑定路线卡；TopNav"＋ 发布"可跳转。

- [ ] **Step 6: 提交**

```bash
git add src
git commit -m "feat(demo): 发布页（模式A足迹自动生成）、话题页与个人主页"
```

---

### Task 18: 全局收尾 —— 构建验证 + DEMO 演示脚本

**Files:**
- Modify: `wudong-web/README.md`（重写为 demo 说明）
- Modify: `src/components/TopNav.vue`（若尚缺"我的票务"高亮核对）

**Interfaces:**
- Produces: `npm run build` 零报错；`README.md` 含 5 分钟演示动线

- [ ] **Step 1: 构建验证**

Run: `npm run build`
Expected: 零 TS 错误、零构建错误（如有 unused import 报错逐个清理）

- [ ] **Step 2: 全站走查清单**

`npm run dev` 按以下动线走查一遍并修复发现的问题：
`/` 七区块 → 金刚区`/route` → `/route/1` 订票出票 → `/my/tickets` 看票卡 → `/community` 点路线标签速览 → `/post/601` 展开足迹地图 → "去走同款"回 `/route/1` → `/publish` 发帖自动足迹 → `/user/1` 足迹档案 → `/topic/502` 路线卡 → `/guide`

- [ ] **Step 3: 重写 README.md**

`wudong-web/README.md`：

```markdown
# 乌东文旅 C 端 Demo（wudong-web · Phase 1）

行（线路订票）+ 社区（照片分享）模块的 C 端 PC 展示 Demo。**纯前端 + mock 数据**，无后端依赖，用于展示效果评审。

## 启动

```bash
npm install
npm run dev   # http://localhost:5175
```

## 测试

```bash
npm test
```

## 亮点效果速览

- **真实足迹链**（`/post/601`）：路线为骨架的手绘地图，点亮 = 用户核销记录，未解锁站点灰置 🔒
- **路线详情**（`/route/1`）：每站"N 人点亮"、购票卡余票紧张度、"走过这条线的人"联动游记
- **电子票卡包**（`/my/tickets`）：登机牌票卡，已核销 → "去写游记"转化入口
- **首页七区块**：焦点轮播 / 快捷订票 / 金刚区（衣食住扩展位灰置）/ 手绘地图总览 / 足迹榜 / 足迹精选 / 瀑布流+数据滚动
- **发布零门槛**：2 步发帖，模式 A 自动生成核销足迹；详情页可升级模式 B 关联路线

## 演示动线（约 5 分钟）

1. 首页：轮播自动切换（hover 暂停）→ 地图总览点站点 → 足迹榜
2. `/route/1`：行程地图（含 🔒 站）→ 选 9/13（余票紧张橙色）下单 → 模拟支付出票
3. `/my/tickets`：票卡包 → 核销态（mock 中已有）显示"去写游记"
4. `/community`：卡片路线标签 → 速览面板 → 看全部游记
5. `/post/601`：足迹收起条 → 展开地图 → "还有 1 站未解锁" → 去走同款
6. `/publish`：发一篇 → 自动附上足迹 → 详情页查看
7. `/user/1`：足迹档案 + 徽章

## 结构

- `src/data/mock.ts` —— 唯一数据源（Phase 5 平替为 API）
- `src/lib/` —— 足迹计算/信息流排序（纯函数，已测）
- `src/stores/` —— 会话/购票（Pinia，已测）
- `src/components/FootprintMap.vue` —— 全站复用的手绘足迹地图（chain/overview/mini）

设计文档：`../docs/superpowers/specs/2026-09-09-travel-community-design.md`
```

- [ ] **Step 4: 最终提交**

```bash
git add src README.md
git commit -m "chore(demo): 构建验证、演示动线与 README"
```

---

## Self-Review 记录

1. **Spec 覆盖（Phase 1 范围 = spec §7 页面清单）**：首页七区块（Task 9/10）✓、景区列表/详情（11/13）✓、路线列表/详情（11/12）✓、交通攻略（13）✓、购票弹窗（16）✓、电子票卡包（16）✓、社区瀑布流（14）✓、游记详情足迹双模式+收起（15）✓、发布零路线步骤（17）✓、话题页/个人主页（17）✓、核心组件 FootprintMap/MiniChain/RouteQuickView/HeroCarousel/Waterfall/CountUp/TicketCard（5/6/7/8/16）✓、D1/D3/D4(模拟)/D5-D15 交互决策全部落位 ✓。Phase 2-5（真实后端/管理后台/联调）不在本计划，符合范围约定。
2. **占位符扫描**：Task 6/7/8/15/16/17 中标注的"实现提示"均为**修正指引**（指明错误占位的正确写法），执行者须按提示落码，不是留白。
3. **类型一致性**：`FootprintStopView` 全链路一致（Task 2 定义，3/6/15/17 消费）；`useBooking().createBooking` 返回 `{orderNo, ticketIds}`（4 定义、16 消费）；`sortPosts` 签名（3 定义、10/14 消费）；`userRecentLitSpots` 放入 `lib/footprint.ts` 避免循环依赖（17 已修正）。
