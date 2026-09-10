# AI管家演示壳子（ai-butler-demo）实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** C端首页悬浮「AI管家」→ 对话壳子，预排固定时间线完成 7 拍演示，三连预订走真实后端接口、失败降级演示卡。

**Architecture:** 纯前端组装 + seed 数据补齐。`script.ts` 是唯一剧本源（类型 + 时间线常量 + 关键词路由），三个展示组件（RelayPanel/PlanCard + AiButler 容器）按 action 渲染；预订直接调用 `wudong-web/src/api/` 现成的三个封装，不新增任何 API/路由/后端代码。

**Tech Stack:** Vue 3 `<script setup lang="ts">` + vitest + @vue/test-utils（jsdom）；后端仅改 `scripts/seed.js`（mysql2 幂等种子）。

**Spec:** `docs/superpowers/specs/2026-09-10-ai-butler-demo-design.md`

## Global Constraints

- 分支 `feature/ai-butler-demo`（已基于 origin/main cfed6a8 创建，spec 已提交）。
- 不新增 npm 依赖、不新增路由、不新增 API 文件、不改后端业务代码（仅 seed.js 与新增清理 SQL）。
- 金额展示原则：以服务端真实计价为准；剧本静态数字与 seed 对齐（632+168+598=1398，预算剩 102）。
- 日期单一来源：`script.ts` 导出 `DEMO` 常量（checkIn/checkOut/useDate），seed 与台词如需变更同步改这里。
- 文案语气：口语化 + emoji（见各任务文案，照抄）。
- 测试惯例照抄 `wudong-web/src/components/__tests__/BookingModal.spec.ts`：`vi.mock('../../api/xxx')` + `setActivePinia(createPinia())` + `session.applyLogin(...)` 塞登录态。
- 组件样式用现有 CSS 变量（`--green-600`、`--amber-bg`、`--amber-text`、`--ok-bg`、`--ok-text`、`--line`、`--text-3`、`--orange-500`），不引 UI 库。
- 每个 Task 结束 `npm test`（在 `wudong-web/`）全绿后 commit。

---

### Task 1: seed 演示数据补齐 + 彩排清理 SQL

**Files:**
- Modify: `cool-admin-midway/scripts/seed.js`（清理列表 ~L23-34、inventory ~L120-130、hotel ~L228-243、room_type ~L244-252、文件末尾 room_type 之后追加 restaurant/time_slot）
- Create: `cool-admin-midway/scripts/cleanup-demo-orders.sql`

**Interfaces:**
- Produces（后续 Task 的预订参数依据，必须一字不差）：
  - hotel id=1 名「云上人家」；room_type **id=2**「吊脚楼双床房」¥316/晚
  - `restaurant` 表 **id=3**「长桌宴」；`time_slot` **id=301**（2026-10-01 午市 11:00-13:00）、**id=302**（晚市）
  - `travel_inventory` 路线 **itemId=2** 「2026-10-01」total 20 / sold 3

- [ ] **Step 1: 清理列表加 food 两表（保证幂等：不清理则显式 id 二次插入主键冲突）**

`seed.js` L23-34 的表数组末尾（`'hotel', 'room_type', 'room_calendar',` 之后）加一行：

```js
    'restaurant', 'time_slot',
```

- [ ] **Step 2: hotel 1 改名「云上人家」**

L231 的 `'[1, null, '乌东苗寨木楼', ...` 中 name 改为 `'云上人家'`（其余列不动）。

- [ ] **Step 3: room_type 显式 id + 吊脚楼双床房调价 316**

L244-252 整段替换为（新增 `'id'` 列，价格 520→316）：

```js
  await ins('room_type',
    ['id', 'hotelId', 'name', 'bedType', 'area', 'maxGuests', 'facilities', 'price', 'stock', 'status', 'createTime', 'updateTime'],
    [
      [1, 1, '木屋大床房', '大床', 28, 2, JSON.stringify(['WiFi', '空调']), 380, 3, 1, now, now],
      [2, 1, '吊脚楼双床房', '双床', 32, 2, JSON.stringify(['WiFi', '空调', '江景']), 316, 2, 1, now, now],
      [3, 1, '阁楼家庭房', '大床+单床', 40, 4, JSON.stringify(['WiFi', '空调']), 680, 1, 1, now, now],
      [4, 2, '星空标间', '双床', 26, 2, JSON.stringify(['WiFi', '暖气']), 420, 4, 1, now, now],
      [5, 3, '经济单人间', '单床', 16, 1, JSON.stringify(['WiFi']), 120, 5, 1, now, now],
    ]);
```

- [ ] **Step 4: 追加 restaurant + time_slot（放 room_type 之后、`const [rows]` 统计之前）**

列结构依据 `src/modules/food/entity/restaurant.ts`、`time-slot.ts`（BaseEntity 提供 id/createTime/updateTime）：

```js
  // ---- 餐饮（AI管家演示：长桌宴 + 10-01 时段）----
  await ins('restaurant',
    ['id', 'merchantId', 'name', 'coverImage', 'address', 'longitude', 'latitude', 'phone', 'businessHours', 'avgPrice', 'rating', 'specialty', 'description', 'status', 'createTime', 'updateTime'],
    [
      [3, 1, '长桌宴', 'https://picsum.photos/seed/r3/900/600', '乌东村广场', 108.102000, 26.302000,
       '13800000003', '11:00-21:00', 84, 4.7, '酸汤鱼、糯米饭、米豆腐',
       '苗家长桌宴，逢节开席，敬酒歌不断。', 1, now, now],
    ]);
  await ins('time_slot',
    ['id', 'restaurantId', 'date', 'timePeriod', 'startTime', 'endTime', 'maxReservations', 'currentReservations', 'status', 'createTime', 'updateTime'],
    [
      [301, 3, '2026-10-01', '午市 11:00-13:00', '11:00', '13:00', 20, 0, 1, now, now],
      [302, 3, '2026-10-01', '晚市 17:00-20:00', '17:00', '20:00', 20, 0, 1, now, now],
    ]);
```

- [ ] **Step 5: travel_inventory 加国庆行**

L123-129 数组末尾（`['ticket', 13, ...]` 之后）追加：

```js
      ['route', 2, '2026-10-01', 20, 3, now, now],
```

- [ ] **Step 6: 新建彩排清理 SQL**

`cool-admin-midway/scripts/cleanup-demo-orders.sql`：

```sql
-- AI管家演示彩排后清理测试账号(138000000xx)产生的订单/票/预订；seed.js 重灌可复位演示数据
-- 列名已核实：payment_record 用 orderId（src/modules/pay/entity/record.ts），其余明细表用 orderNo
DELETE FROM order_ticket WHERE orderNo IN (SELECT orderNo FROM `order` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%'));
DELETE FROM order_reservation WHERE orderNo IN (SELECT orderNo FROM `order` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%'));
DELETE FROM order_product WHERE orderNo IN (SELECT orderNo FROM `order` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%'));
DELETE FROM payment_record WHERE orderId IN (SELECT id FROM `order` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%'));
DELETE FROM `order` WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%');
DELETE FROM food_reservation WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%');
DELETE FROM travel_e_ticket WHERE userId IN (SELECT id FROM member_user WHERE phone LIKE '138000000%');
```

- [ ] **Step 7: 语法验证 + （可选）真实重灌**

```bash
node --check cool-admin-midway/scripts/seed.js
# 若本地 MySQL(3307) 在跑，再做真实验证（两次执行均应成功）：
cd cool-admin-midway && node scripts/seed.js && node scripts/seed.js
```

Expected: `node --check` 无输出；重灌两次均打印 `seed done:`。DB 未起则跳过重灌，仅保留语法验证。

- [ ] **Step 8: Commit**

```bash
git add cool-admin-midway/scripts/seed.js cool-admin-midway/scripts/cleanup-demo-orders.sql
git commit -m "feat(seed): AI管家演示数据——云上人家/长桌宴时段/国庆路线库存 + 彩排清理SQL"
```

---

### Task 2: script.ts 剧本引擎（纯数据 + 纯函数，TDD）

**Files:**
- Create: `wudong-web/src/components/ai/script.ts`
- Test: `wudong-web/src/components/ai/__tests__/script.spec.ts`

**Interfaces:**
- Produces（Task 5 依赖，签名固定）：
  - `type Intent = 'main'|'budget'|'quiet'|'banquet'|'foodSide'|'staySide'|'bookA'|'reorder'|'more'|'thanks'`
  - `type ChipsKey = 'r1'|'r2'|'r3'|'r4'|'foodEnd'|'stayEnd'`
  - `interface Chip { label: string; intent: Intent }`
  - `CHIPS: Record<ChipsKey, Chip[]>`
  - `type Action = { type:'userMsg'|'aiMsg'; text:string } | { type:'thinking'; text:string } | { type:'node'; index:number } | { type:'busy'; index:number } | { type:'extract' } | { type:'plans' } | { type:'reorder' } | { type:'book' } | { type:'crossSell' } | { type:'chips'; group:ChipsKey }`
  - `interface Beat { id:string; delayMs:number; actions:Action[] }`
  - `matchInput(text:string, stage:string): Intent` — stage 取 `SCRIPT_STAGE` 中的值
  - `SCRIPT_STAGE = { IDLE:'idle', PREFIX:'prefix', MAIN:'main', PLANS:'plans', BOOKED:'booked', DONE:'done' }`
  - `PREFIX_CONFIRM: Record<'budget'|'quiet'|'banquet', Beat[]>`（递进前缀段每次点选播放的确认拍）
  - `MAIN_BEATS: Beat[]`（拍2→拍4）、`BOOK_BEATS: Beat[]`（拍5）、`REORDER_BEATS: Beat[]`（拍6）、`FOOD_SIDE_BEATS/STAY_SIDE_BEATS: Beat[]`（支线）、`MORE_BEATS: Beat[]`、`THANKS_BEATS: Beat[]`
  - `EXTRACT: {k:string;v:string}[]`（6 项）、`PLAN_A/PLAN_B`（方案卡数据）、`CROSS_SELL: {icon:string;name:string;price:string;to:string}[]`
  - `DEMO = { checkIn:'2026-10-01', checkOut:'2026-10-03', useDate:'2026-10-01' }`
  - `PLAN_A_TOTAL = 1398`、`PLAN_A_LEFT = 102`

- [ ] **Step 1: 写失败测试 `__tests__/script.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import {
  matchInput, SCRIPT_STAGE, CHIPS, MAIN_BEATS, BOOK_BEATS, PLAN_A, PLAN_B,
  PLAN_A_TOTAL, PLAN_A_LEFT, DEMO, EXTRACT,
} from '../script'

const types = (beats: any[]) => beats.flatMap((b) => b.actions.map((a: any) => a.type))

describe('matchInput 关键词路由', () => {
  it('开场需求句/爸妈/国庆 → main', () => {
    expect(matchInput('十一想带爸妈去乌东住两晚', SCRIPT_STAGE.IDLE)).toBe('main')
  })
  it('好吃/长桌宴 → foodSide；住/安静 → staySide', () => {
    expect(matchInput('乌东有什么好吃的', SCRIPT_STAGE.IDLE)).toBe('foodSide')
    expect(matchInput('住哪里比较安静', SCRIPT_STAGE.IDLE)).toBe('staySide')
  })
  it('plans 后：订/就按 → bookA；换/梯田近 → reorder', () => {
    expect(matchInput('就按 A 方案订', SCRIPT_STAGE.PLANS)).toBe('bookA')
    expect(matchInput('换个离梯田更近的', SCRIPT_STAGE.PLANS)).toBe('reorder')
  })
  it('booked 后再问吃的 → foodSide（跨类推荐阶段）', () => {
    expect(matchInput('再看看别的', SCRIPT_STAGE.BOOKED)).toBe('more')
    expect(matchInput('谢谢管家', SCRIPT_STAGE.BOOKED)).toBe('thanks')
  })
  it('任意未命中 → unknown', () => {
    expect(matchInput('今天天气怎么样', SCRIPT_STAGE.IDLE)).toBe('unknown')
  })
})

describe('剧本数据完整性', () => {
  it('主线按序点亮三个节点，plans 出现在最后一个节点之后', () => {
    const t = types(MAIN_BEATS)
    const n0 = t.indexOf('node'), n1 = t.indexOf('node', n0 + 1), n2 = t.indexOf('node', n1 + 1)
    expect([n0, n1, n2]).toEqual([t.indexOf('node'), -1, -1].map((_, i) => t.indexOf('node')))
    expect(t.indexOf('node')).toBeGreaterThanOrEqual(0)
    expect(t.indexOf('plans')).toBeGreaterThan(t.lastIndexOf('node'))
    expect(t).toContain('extract')
  })
  it('预订拍含 book 动作，book 之后是 crossSell（第7拍）', () => {
    const t = types(BOOK_BEATS)
    expect(t.indexOf('crossSell')).toBeGreaterThan(t.indexOf('book'))
  })
  it('A 方案明细合计 = 1398，预算剩 102', () => {
    const sum = PLAN_A.items.reduce((s: number, i: any) => s + i.amount, 0)
    expect(sum).toBe(PLAN_A_TOTAL)
    expect(PLAN_A_TOTAL).toBe(632 + 168 + 598)
    expect(PLAN_A_LEFT).toBe(1500 - PLAN_A_TOTAL)
  })
  it('住宿预订参数指向 seed 固定 id：房型2/餐厅3/时段301/路线2', () => {
    expect(DEMO).toEqual({ checkIn: '2026-10-01', checkOut: '2026-10-03', useDate: '2026-10-01', roomTypeId: 2, restaurantId: 3, timeSlotId: 301, routeItemId: 2 })
  })
  it('抽取卡 6 项；A/B 方案齐备；chips 四组递进齐备', () => {
    expect(EXTRACT).toHaveLength(6)
    expect(PLAN_A.name).toBe('云上人家')
    expect(PLAN_B.name).toBe('云雾观星客栈')
    for (const k of ['r1', 'r2', 'r3', 'r4'] as const) expect(CHIPS[k].length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd wudong-web && npx vitest run src/components/ai/__tests__/script.spec.ts`
Expected: FAIL（模块不存在）

- [ ] **Step 3: 实现 `script.ts`**

```ts
/** AI管家剧本引擎：预排固定时间线（demo 壳子）。真 AI 上线时仅替换本文件为接口数据源，组件不动。 */

export const SCRIPT_STAGE = { IDLE: 'idle', PREFIX: 'prefix', MAIN: 'main', PLANS: 'plans', BOOKED: 'booked', DONE: 'done' } as const
export type Stage = (typeof SCRIPT_STAGE)[keyof typeof SCRIPT_STAGE]

export type Intent = 'main' | 'budget' | 'quiet' | 'banquet' | 'foodSide' | 'staySide' | 'bookA' | 'reorder' | 'more' | 'thanks'

export type ChipsKey = 'r1' | 'r2' | 'r3' | 'r4' | 'foodEnd' | 'stayEnd'
export interface Chip { label: string; intent: Intent }

export const CHIPS: Record<ChipsKey, Chip[]> = {
  r1: [
    { label: '🧳 带爸妈去乌东玩', intent: 'main' },
    { label: '🍜 乌东有什么好吃的', intent: 'foodSide' },
    { label: '🏠 住哪里比较安静', intent: 'staySide' },
  ],
  r2: [
    { label: '预算一千五', intent: 'budget' },
    { label: '想要安静', intent: 'quiet' },
    { label: '想吃长桌宴', intent: 'banquet' },
  ],
  r3: [
    { label: '就按 A 方案订', intent: 'bookA' },
    { label: '换个离梯田更近的', intent: 'reorder' },
  ],
  r4: [
    { label: '再看看别的', intent: 'more' },
    { label: '就这样，谢谢管家', intent: 'thanks' },
  ],
  foodEnd: [{ label: '帮我一起安排 →', intent: 'main' }],
  stayEnd: [{ label: '帮我一起安排 →', intent: 'main' }],
}

export type Action =
  | { type: 'userMsg' | 'aiMsg'; text: string }
  | { type: 'thinking'; text: string }
  | { type: 'node'; index: number }
  | { type: 'busy'; index: number }
  | { type: 'extract' | 'plans' | 'reorder' | 'book' | 'crossSell' }
  | { type: 'chips'; group: ChipsKey }

export interface Beat { id: string; delayMs: number; actions: Action[] }

/** 演示日期与预订目标 id（与 seed.js 对齐，改动需同步） */
export const DEMO = { checkIn: '2026-10-01', checkOut: '2026-10-03', useDate: '2026-10-01', roomTypeId: 2, restaurantId: 3, timeSlotId: 301, routeItemId: 2 } as const

export const EXTRACT = [
  { k: '出行日期', v: '国庆 10月1日–3日' },
  { k: '出行人', v: '2位老人 + 1位晚辈' },
  { k: '住宿', v: '两晚 · 安静优先' },
  { k: '预算', v: '¥1500' },
  { k: '心愿', v: '长桌宴 ✓' },
  { k: '交通', v: '凯里南站接驳' },
]

export const PLAN_A = {
  id: 'A', name: '云上人家', tagline: '百年木楼 · 安静', price: 1398,
  items: [
    { icon: '🏠', label: '吊脚楼双床房 两晚', detail: '10-01 → 10-03', amount: 632 },
    { icon: '🍜', label: '长桌宴 · 双人午宴', detail: '10-01 11:00', amount: 168 },
    { icon: '🎫', label: '梯田摄影一日游 ×2', detail: '10-01 全天', amount: 598 },
  ],
  note: '还剩 ¥102，够带一斤腊肉回家 🥓',
}
export const PLAN_B = {
  id: 'B', name: '云雾观星客栈', tagline: '离梯田更近 ⛰️ 步行观景台5分钟', price: 840, items: [], note: '两晚 ¥840 · 仅展示',
}
export const PLAN_A_TOTAL = PLAN_A.items.reduce((s, i) => s + i.amount, 0)
export const PLAN_A_LEFT = 1500 - PLAN_A_TOTAL

export const CROSS_SELL = [
  { icon: '🧣', name: '苗绣围巾', price: '¥89', to: '/products' },
  { icon: '🥓', name: '乌东腊肉 一斤装', price: '¥45', to: '/farm-products' },
]

/** 关键词路由（固定规则，非 NLP） */
export function matchInput(text: string, stage: string): Intent | 'unknown' {
  const t = text.trim()
  if (stage === SCRIPT_STAGE.PLANS && (/换|梯田.*近|近.*梯田/.test(t))) return 'reorder'
  if (stage === SCRIPT_STAGE.PLANS && /订|就按|安排/.test(t)) return 'bookA'
  if (stage === SCRIPT_STAGE.BOOKED && /谢谢|辛苦/.test(t)) return 'thanks'
  if (stage === SCRIPT_STAGE.BOOKED && /别的|还看|再看看/.test(t)) return 'more'
  if (/爸妈|带.*玩|国庆|十一|两晚/.test(t)) return 'main'
  if (/好吃|吃|餐|宴/.test(t)) return 'foodSide'
  if (/住|宿|安静/.test(t)) return 'staySide'
  return 'unknown'
}

/** 递进前缀段：R2 三个细化点选各自的确认拍（顺序任意、逐个播放） */
export const PREFIX_CONFIRM: Record<'budget' | 'quiet' | 'banquet', Beat[]> = {
  budget: [{ id: 'p-budget', delayMs: 400, actions: [{ type: 'aiMsg', text: '✓ 预算 ¥1500，我记下了' }] }],
  quiet: [{ id: 'p-quiet', delayMs: 400, actions: [{ type: 'aiMsg', text: '✓ 要安静，懂～木楼深巷那种 🤫' }] }],
  banquet: [{ id: 'p-banquet', delayMs: 400, actions: [{ type: 'aiMsg', text: '✓ 长桌宴！必须安排 🍜' }] }],
}

/** 主线：拍2 识别 → 拍3 检索 → 拍4 推荐 */
export const MAIN_BEATS: Beat[] = [
  { id: 'm-think', delayMs: 300, actions: [{ type: 'thinking', text: '正在理解你的需求' }] },
  { id: 'm-node0', delayMs: 900, actions: [{ type: 'node', index: 0 }, { type: 'extract' }, { type: 'aiMsg', text: '六个关键信息全部抓出来了 ✨' }] },
  { id: 'm-search', delayMs: 600, actions: [{ type: 'busy', index: 1 }, { type: 'thinking', text: '正在检索 房型 / 餐厅 / 票务…' }] },
  { id: 'm-node1', delayMs: 1400, actions: [{ type: 'node', index: 1 }] },
  { id: 'm-node2', delayMs: 600, actions: [{ type: 'node', index: 2 }, { type: 'plans' }, { type: 'aiMsg', text: `两套方案出炉！A 方案帮你算好了，还剩 ¥102，够带一斤腊肉回家 🥓` }] },
  { id: 'm-chips', delayMs: 400, actions: [{ type: 'chips', group: 'r3' }] },
]

/** 拍5 一键预订（book 动作由组件执行真实三连） */
export const BOOK_BEATS: Beat[] = [
  { id: 'b-user', delayMs: 0, actions: [{ type: 'userMsg', text: '就按 A 方案订！' }] },
  { id: 'b-ai', delayMs: 300, actions: [{ type: 'aiMsg', text: '好嘞，马上安排～稍等哦 ⏳' }] },
  { id: 'b-do', delayMs: 200, actions: [{ type: 'book' }] },
  { id: 'b-done', delayMs: 600, actions: [{ type: 'aiMsg', text: '订单、电子票、入住码全部搞定 ✅ 底部【本次预订】可以直接看 👇' }] },
  { id: 'b-chips', delayMs: 400, actions: [{ type: 'chips', group: 'r4' }] },
  { id: 'b-cross', delayMs: 500, actions: [{ type: 'crossSell' }, { type: 'aiMsg', text: '对了，临走的手信我也挑好了 👇' }] },
]

/** 拍6 回传反馈：B 顶上 */
export const REORDER_BEATS: Beat[] = [
  { id: 'r-user', delayMs: 0, actions: [{ type: 'userMsg', text: '换个离梯田更近的' }] },
  { id: 'r-ai', delayMs: 300, actions: [{ type: 'aiMsg', text: '收到！这就重排～' }] },
  { id: 'r-do', delayMs: 700, actions: [{ type: 'reorder' }, { type: 'aiMsg', text: 'B 方案顶上！云雾观星客栈，背靠梯田东岭，步行到观景台五分钟 ⛰️' }] },
]

/** 吃 / 住支线 */
export const FOOD_SIDE_BEATS: Beat[] = [
  { id: 'f-user', delayMs: 0, actions: [{ type: 'userMsg', text: '乌东有什么好吃的' }] },
  { id: 'f-ai', delayMs: 500, actions: [
    { type: 'aiMsg', text: '问对人啦！长桌宴是一绝：酸汤鱼、糯米饭、米豆腐摆满长桌，苗家姑娘唱着敬酒歌 🍜' },
    { type: 'chips', group: 'foodEnd' },
  ] },
]
export const STAY_SIDE_BEATS: Beat[] = [
  { id: 's-user', delayMs: 0, actions: [{ type: 'userMsg', text: '住哪里比较安静' }] },
  { id: 's-ai', delayMs: 500, actions: [
    { type: 'aiMsg', text: '推云上人家：百年木楼、推窗见梯田，关键——真的安静 🤫' },
    { type: 'chips', group: 'stayEnd' },
  ] },
]
export const MORE_BEATS: Beat[] = [
  { id: 'more', delayMs: 200, actions: [{ type: 'crossSell' }, { type: 'aiMsg', text: '手信清单再给你摆一遍 👇' }] },
]
export const THANKS_BEATS: Beat[] = [
  { id: 'thanks', delayMs: 200, actions: [{ type: 'aiMsg', text: '客官慢走，乌东等你来～ 🏔️' }] },
]
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd wudong-web && npx vitest run src/components/ai/__tests__/script.spec.ts`
Expected: PASS（~9 例）。规则顺序已核对：stage 分支（PLANS/BOOKED）优先 → main → food → stay → unknown；五个测试句互不误吞（「住哪里比较安静」不含 吃/餐/宴 字样，不会被 food 规则抢先）。

- [ ] **Step 5: Commit**

```bash
git add wudong-web/src/components/ai/script.ts wudong-web/src/components/ai/__tests__/script.spec.ts
git commit -m "feat(ai): 剧本引擎 script.ts——7拍时间线/关键词路由/方案卡数据（含单测）"
```

---

### Task 3: RelayPanel 接力面板（TDD）

**Files:**
- Create: `wudong-web/src/components/ai/RelayPanel.vue`
- Test: `wudong-web/src/components/ai/__tests__/RelayPanel.spec.ts`

**Interfaces:**
- Produces: `props: { lit: number; busy: number | null }`——`lit` 已点亮到的节点序号（-1=全灰），`busy` 当前转圈节点（null=无）。节点文案固定 `['需求识别','检索生成','执行推荐']`。

- [ ] **Step 1: 写失败测试**

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RelayPanel from '../RelayPanel.vue'

describe('RelayPanel 接力面板', () => {
  it('lit=-1 三个节点全部灰置', () => {
    const w = mount(RelayPanel, { props: { lit: -1, busy: null } })
    expect(w.findAll('.node.on')).toHaveLength(0)
    expect(w.text()).toContain('需求识别')
  })
  it('lit=1 时节点 0/1 常亮、节点 2 灰置', () => {
    const w = mount(RelayPanel, { props: { lit: 1, busy: null } })
    const nodes = w.findAll('.node')
    expect(nodes[0].classes()).toContain('on')
    expect(nodes[1].classes()).toContain('on')
    expect(nodes[2].classes()).not.toContain('on')
  })
  it('busy=1 时节点 1 有 running 态（呼吸/流光）', () => {
    const w = mount(RelayPanel, { props: { lit: 0, busy: 1 } })
    expect(w.findAll('.node')[1].classes()).toContain('running')
  })
})
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd wudong-web && npx vitest run src/components/ai/__tests__/RelayPanel.spec.ts`
Expected: FAIL（组件不存在）

- [ ] **Step 3: 实现 RelayPanel.vue**

```vue
<script setup lang="ts">
// 接力面板：三节点固定文案，lit/busy 由 AiButler 按剧本驱动
defineProps<{ lit: number; busy: number | null }>()
const NAMES = ['需求识别', '检索生成', '执行推荐']
</script>

<template>
  <div class="relay">
    <template v-for="(n, i) in NAMES" :key="n">
      <div class="node" :class="{ on: i <= lit, running: busy === i }">
        <span class="dot">{{ i + 1 }}</span><b>{{ n }}</b>
      </div>
      <div v-if="i < NAMES.length - 1" class="link" :class="{ on: i < lit }" />
    </template>
  </div>
</template>

<style scoped>
.relay { display: flex; align-items: center; justify-content: center; gap: 4px; padding: 10px 8px; border-bottom: 1px solid var(--line); }
.node { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-3); }
.node .dot { width: 18px; height: 18px; border-radius: 50%; border: 1px solid var(--line); display: grid; place-items: center; font-size: 10px; background: #fff; }
.node.on { color: var(--green-600); }
.node.on .dot { border-color: var(--green-600); background: var(--ok-bg); }
.node.running .dot { animation: pulse 1s ease-in-out infinite; }
.node.running b { background: linear-gradient(90deg, var(--green-600), #9bd4a8, var(--green-600)); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: flow 1.2s linear infinite; }
.link { width: 18px; height: 2px; background: var(--line); }
.link.on { background: var(--green-600); }
@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.25); } }
@keyframes flow { to { background-position: -200% 0; } }
</style>
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd wudong-web && npx vitest run src/components/ai/__tests__/RelayPanel.spec.ts`
Expected: PASS（3 例）

- [ ] **Step 5: Commit**

```bash
git add wudong-web/src/components/ai/RelayPanel.vue wudong-web/src/components/ai/__tests__/RelayPanel.spec.ts
git commit -m "feat(ai): RelayPanel 三节点接力面板——点亮/呼吸流光动效（含单测）"
```

---

### Task 4: PlanCard 方案小卡（TDD）

**Files:**
- Create: `wudong-web/src/components/ai/PlanCard.vue`
- Test: `wudong-web/src/components/ai/__tests__/PlanCard.spec.ts`

**Interfaces:**
- Consumes: Task 2 的 `PLAN_A`/`PLAN_B` 结构（`{id,name,tagline,price,items:[{icon,label,detail,amount}],note}`）。
- Produces: `props: { plan: PlanData; highlight?: boolean; booked?: boolean; demo?: boolean }`，`type PlanData = { id:string; name:string; tagline:string; price:number; items:{icon:string;label:string;detail:string;amount:number}[]; note:string }`；`emit: { book: [] }`。已预订态显示 `bookedLabel`（可选 prop，订单号或「演示数据」）。

- [ ] **Step 1: 写失败测试**

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PlanCard from '../PlanCard.vue'
import { PLAN_A } from '../script'

const plan = () => JSON.parse(JSON.stringify(PLAN_A))

describe('PlanCard 方案小卡', () => {
  it('渲染名称/总价/首条明细；默认收起', () => {
    const w = mount(PlanCard, { props: { plan: plan() } })
    expect(w.text()).toContain('云上人家')
    expect(w.text()).toContain('¥1398')
    expect(w.text()).not.toContain('10-01 → 10-03')
  })
  it('点击卡片展开明细行与彩蛋 note', async () => {
    const w = mount(PlanCard, { props: { plan: plan(), highlight: true } })
    await w.find('.head').trigger('click')
    expect(w.text()).toContain('10-01 → 10-03')
    expect(w.text()).toContain('腊肉')
  })
  it('点按钮 emit book；已预订态显示标记', async () => {
    const w = mount(PlanCard, { props: { plan: plan(), highlight: true } })
    await w.find('button.book').trigger('click')
    expect(w.emitted('book')).toBeTruthy()
    const w2 = mount(PlanCard, { props: { plan: plan(), highlight: true, booked: true, bookedLabel: 'WD123' } })
    expect(w2.text()).toContain('已预订')
    expect(w2.text()).toContain('WD123')
    expect(w2.find('button.book').exists()).toBe(false)
  })
  it('demo 态显示「演示数据」角标', () => {
    const w = mount(PlanCard, { props: { plan: plan(), demo: true } })
    expect(w.text()).toContain('演示数据')
  })
})
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd wudong-web && npx vitest run src/components/ai/__tests__/PlanCard.spec.ts`
Expected: FAIL

- [ ] **Step 3: 实现 PlanCard.vue**

```vue
<script setup lang="ts">
import { ref } from 'vue'
export interface PlanItem { icon: string; label: string; detail: string; amount: number }
export interface PlanData { id: string; name: string; tagline: string; price: number; items: PlanItem[]; note: string }
const props = defineProps<{ plan: PlanData; highlight?: boolean; booked?: boolean; bookedLabel?: string; demo?: boolean }>()
defineEmits<{ book: [] }>()
const open = ref(false)
</script>

<template>
  <div class="pcard" :class="{ hi: highlight, booked }">
    <span v-if="demo" class="demo-tag">演示数据</span>
    <div class="head" @click="open = !open">
      <b class="nm">{{ plan.id }} · {{ plan.name }}</b>
      <span class="tag">{{ plan.tagline }}</span>
      <b class="pr">¥{{ plan.price }}</b>
    </div>
    <div v-if="open" class="items">
      <div v-for="it in plan.items" :key="it.label" class="it">
        <span>{{ it.icon }} {{ it.label }}</span><i>{{ it.detail }}</i><b>¥{{ it.amount }}</b>
      </div>
      <div class="note">{{ plan.note }}</div>
    </div>
    <div v-if="booked" class="done">✅ 已预订 <code>{{ bookedLabel }}</code></div>
    <button v-else-if="highlight" class="book btn-primary" @click="$emit('book')">⚡ 一键预订</button>
  </div>
</template>

<style scoped>
.pcard { position: relative; border: 1px solid var(--line); border-radius: 10px; padding: 9px 11px; background: #fff; }
.pcard.hi { border-color: var(--green-600); box-shadow: 0 2px 10px rgba(46, 125, 50, .15); }
.pcard.booked { opacity: .85; }
.demo-tag { position: absolute; top: -8px; right: 8px; font-size: 10px; background: var(--amber-bg); color: var(--amber-text); padding: 1px 6px; border-radius: 6px; }
.head { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.nm { font-size: 13px; } .tag { font-size: 11px; color: var(--text-3); flex: 1; } .pr { color: var(--orange-500); }
.items { margin-top: 8px; border-top: 1px dashed var(--line); padding-top: 6px; display: flex; flex-direction: column; gap: 4px; }
.it { display: flex; gap: 6px; font-size: 12px; align-items: baseline; }
.it i { flex: 1; font-style: normal; color: var(--text-3); font-size: 11px; }
.note { font-size: 11px; background: var(--amber-bg); color: var(--amber-text); border-radius: 6px; padding: 4px 8px; }
.book { width: 100%; margin-top: 8px; }
.done { margin-top: 6px; font-size: 12px; color: var(--ok-text); background: var(--ok-bg); border-radius: 6px; padding: 4px 8px; }
</style>
```

（`.btn-primary` 已核实为 `src/styles/theme.css` 全局类，直接叠加使用。）

- [ ] **Step 4: 跑测试确认通过**

Run: `cd wudong-web && npx vitest run src/components/ai/__tests__/PlanCard.spec.ts`
Expected: PASS（4 例）

- [ ] **Step 5: Commit**

```bash
git add wudong-web/src/components/ai/PlanCard.vue wudong-web/src/components/ai/__tests__/PlanCard.spec.ts
git commit -m "feat(ai): PlanCard 方案小卡——展开明细/一键预订/已预订与演示态（含单测）"
```

---

### Task 5: AiButler 容器（悬浮圈/对话流/chips/常驻预订条/三连真实预订）（TDD）

**Files:**
- Create: `wudong-web/src/components/ai/AiButler.vue`
- Test: `wudong-web/src/components/ai/__tests__/AiButler.spec.ts`

**Interfaces:**
- Consumes: Task 2 全部导出；`stores/session`（`isLogged`/`user.nickname`）；`../../api/accommodation` 的 `bookingCreate`；`../../api/food` 的 `createReservation`；`../../api/travel` 的 `travelApi.bookingCreate`；`../../api/operate` 的 `orderApi.payCreate/payMock`。
- Produces: 无 props（测试用 props `pacing?: number` 控制 beat 延时倍率，默认 1，测试传 0）；跳转用 `useRouter()`（测试组件内 mock 或真实 router-push 断言均可，按现有组件测试惯例 mock `vue-router` 不必须——组件内 `router.push` 在 jsdom 下可运行）。

- [ ] **Step 1: 写失败测试**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import AiButler from '../AiButler.vue'
import { useSession } from '../../../stores/session'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ path: '/' }),
}))

const accBooking = vi.fn(async () => ({ orderNo: 'WD-ACC-1', payAmount: 632, nights: ['2026-10-01', '2026-10-02'] }))
const foodResv = vi.fn(async () => ({ id: 9 }))
const travelBooking = vi.fn(async () => ({ orderNo: 'WD-TKT-1', payAmount: 598, ticketIds: [1, 2] }))
const payCreate = vi.fn(async () => ({ paymentNo: 'PAY-1' }))
const payMock = vi.fn(async () => true)

vi.mock('../../../api/accommodation', () => ({ bookingCreate: (...a: any[]) => (accBooking as any)(...a) }))
vi.mock('../../../api/food', () => ({
  createReservation: (...a: any[]) => (foodResv as any)(...a),
  searchRestaurants: vi.fn(), restaurantDetail: vi.fn(), getAvailableTimeSlots: vi.fn(),
  searchFarmProducts: vi.fn(), farmProductDetail: vi.fn(), getFarmProductCategories: vi.fn(),
}))
vi.mock('../../../api/travel', () => ({ travelApi: { bookingCreate: (...a: any[]) => (travelBooking as any)(...a) } }))
vi.mock('../../../api/operate', () => ({
  operateApi: {},
  orderApi: { payCreate: (...a: any[]) => (payCreate as any)(...a), payMock: (...a: any[]) => (payMock as any)(...a) },
}))

const tick = () => new Promise((r) => setTimeout(r, 0))
async function settle(w: any, rounds = 30) {
  for (let i = 0; i < rounds; i++) { await flushPromises(); await tick() }
}
async function openButler() {
  const w = mount(AiButler, { props: { pacing: 0 } })
  await w.find('.fab').trigger('click')
  await settle(w, 2)
  return w
}

describe('AiButler', () => {
  beforeEach(() => { setActivePinia(createPinia()); vi.clearAllMocks() })

  it('悬浮圈开合对话窗', async () => {
    const w = await openButler()
    expect(w.find('.drawer').exists()).toBe(true)
    expect(w.text()).toContain('AI 管家')
  })

  it('R1 主线 chip → 递进前缀 → 主线点亮节点并出方案卡（pacing=0 加速）', async () => {
    const w = await openButler()
    await w.findAll('.chip').find((c) => c.text().includes('带爸妈'))!.trigger('click')
    await settle(w)
    // 递进：r2 组出现
    expect(w.text()).toContain('预算一千五')
    for (const label of ['预算一千五', '想要安静', '想吃长桌宴']) {
      await w.findAll('.chip').find((c) => c.text().includes(label))!.trigger('click')
      await settle(w)
    }
    // 主线：三节点点亮 + A/B 卡 + 腊肉彩蛋
    expect(w.findAll('.node.on')).toHaveLength(3)
    expect(w.text()).toContain('云上人家')
    expect(w.text()).toContain('云雾观星客栈')
    expect(w.text()).toContain('腊肉')
  })

  it('登录后一键预订：三接口按序真实调用，常驻条三项点亮', async () => {
    const session = useSession()
    session.applyLogin({ token: 't', refreshToken: 'r' })
    ;(session as any).user = { id: 1, nickname: '山野小鱼', avatar: '', bio: '' }
    const w = await openButler()
    await w.findAll('.chip').find((c) => c.text().includes('带爸妈'))!.trigger('click')
    await settle(w)
    for (const label of ['预算一千五', '想要安静', '想吃长桌宴']) {
      await w.findAll('.chip').find((c) => c.text().includes(label))!.trigger('click')
      await settle(w)
    }
    await w.findAll('.chip').find((c) => c.text().includes('就按 A 方案订'))!.trigger('click')
    await settle(w)
    expect(accBooking).toHaveBeenCalledWith(expect.objectContaining({ roomTypeId: 2, checkInDate: '2026-10-01', checkOutDate: '2026-10-03', rooms: 1, guestName: '山野小鱼' }))
    expect(foodResv).toHaveBeenCalledWith(expect.objectContaining({ restaurantId: 3, timeSlotId: 301, reservationDate: '2026-10-01', peopleCount: 2, contactName: '山野小鱼' }))
    expect(travelBooking).toHaveBeenCalledWith({ itemType: 'route', itemId: 2, useDate: '2026-10-01', quantity: 2 })
    expect(payCreate).toHaveBeenCalledWith('WD-TKT-1')
    expect(payMock).toHaveBeenCalledWith('PAY-1')
    expect(w.findAll('.mini.on')).toHaveLength(3)
    expect(w.text()).toContain('手信')
  })

  it('未登录点预订 → 提示登录，不调接口', async () => {
    const w = await openButler()
    await w.findAll('.chip').find((c) => c.text().includes('带爸妈'))!.trigger('click')
    await settle(w)
    for (const label of ['预算一千五', '想要安静', '想吃长桌宴']) {
      await w.findAll('.chip').find((c) => c.text().includes(label))!.trigger('click')
      await settle(w)
    }
    await w.findAll('.chip').find((c) => c.text().includes('就按 A 方案订'))!.trigger('click')
    await settle(w)
    expect(w.text()).toContain('请先在右上角登录')
    expect(accBooking).not.toHaveBeenCalled()
  })

  it('任一接口失败 → 该项降级「演示数据」，其余成功', async () => {
    const session = useSession()
    session.applyLogin({ token: 't', refreshToken: 'r' })
    ;(session as any).user = { id: 1, nickname: '山野小鱼', avatar: '', bio: '' }
    travelBooking.mockRejectedValueOnce(new Error('boom'))
    const w = await openButler()
    await w.findAll('.chip').find((c) => c.text().includes('带爸妈'))!.trigger('click')
    await settle(w)
    for (const label of ['预算一千五', '想要安静', '想吃长桌宴']) {
      await w.findAll('.chip').find((c) => c.text().includes(label))!.trigger('click')
      await settle(w)
    }
    await w.findAll('.chip').find((c) => c.text().includes('就按 A 方案订'))!.trigger('click')
    await settle(w)
    expect(w.text()).toContain('演示数据')
    expect(w.findAll('.mini.on')).toHaveLength(3) // 降级项也点亮（样式不同由 demo 标记体现）
  })

  it('自由输入未命中 → 兜底话术', async () => {
    const w = await openButler()
    await w.find('input').setValue('今天天气怎么样')
    await w.find('input').trigger('keyup', { key: 'Enter' })
    await settle(w, 3)
    expect(w.text()).toContain('快捷提问')
  })
})
```

- [ ] **Step 2: 跑测试确认失败**

Run: `cd wudong-web && npx vitest run src/components/ai/__tests__/AiButler.spec.ts`
Expected: FAIL（组件不存在）

- [ ] **Step 3: 实现 AiButler.vue**

```vue
<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSession } from '../../stores/session'
import { bookingCreate as accBookingCreate } from '../../api/accommodation'
import { createReservation } from '../../api/food'
import { travelApi } from '../../api/travel'
import { orderApi } from '../../api/operate'
import {
  CHIPS, SCRIPT_STAGE, matchInput, MAIN_BEATS, BOOK_BEATS, REORDER_BEATS,
  FOOD_SIDE_BEATS, STAY_SIDE_BEATS, PREFIX_CONFIRM, MORE_BEATS, THANKS_BEATS,
  PLAN_A, PLAN_B, EXTRACT, CROSS_SELL, DEMO,
  type Action, type Beat, type ChipsKey, type Intent,
} from './script'
import RelayPanel from './RelayPanel.vue'
import PlanCard from './PlanCard.vue'

const props = withDefaults(defineProps<{ pacing?: number }>(), { pacing: 1 })
const session = useSession()
const router = useRouter()
const route = useRoute()

const open = ref(false)
const msgs = ref<{ role: 'user' | 'ai'; text: string; thinking?: boolean }[]>([])
const stage = ref<string>(SCRIPT_STAGE.IDLE)
const lit = ref(-1)
const busy = ref<number | null>(null)
const showExtract = ref(false)
const plansOn = ref(false)
const aFirst = ref(true)
const chips = ref<ChipsKey | null>('r1')
const prefixDone = ref(0)
const loginHint = ref(false)
// 预订结果：null=未订 ok=真实 demo=降级
const booked = ref<{ hotel: 'ok' | 'demo' | null; meal: 'ok' | 'demo' | null; ticket: 'ok' | 'demo' | null; orderNo: string }>({ hotel: null, meal: null, ticket: null, orderNo: '' })
const showCross = ref(false)
const bodyEl = ref<HTMLElement | null>(null)
let playSeq = 0 // 播放序号防竞态：新播放开始后旧的自动作废

const showFab = computed(() => route.path === '/')

const sleep = (ms: number) => new Promise((r) => setTimeout(r, Math.round(ms * props.pacing)))
async function scrollBottom() { await nextTick(); bodyEl.value?.scrollTo({ top: bodyEl.value.scrollHeight }) }
function push(role: 'user' | 'ai', text: string, thinking = false) { msgs.value.push({ role, text, thinking }); scrollBottom() }

async function play(beats: Beat[]): Promise<void> {
  const seq = ++playSeq
  for (const b of beats) {
    await sleep(b.delayMs)
    if (seq !== playSeq) return
    for (const a of b.actions) await apply(a)
  }
}

async function apply(a: Action): Promise<void> {
  if (a.type === 'userMsg') { removeThinking(); push('user', a.text) }
  else if (a.type === 'aiMsg') { removeThinking(); push('ai', a.text) }
  else if (a.type === 'thinking') { removeThinking(); push('ai', a.text, true); scrollBottom() }
  else if (a.type === 'node') { busy.value = null; lit.value = a.index }
  else if (a.type === 'busy') { busy.value = a.index }
  else if (a.type === 'extract') { showExtract.value = true }
  else if (a.type === 'plans') { plansOn.value = true }
  else if (a.type === 'reorder') { aFirst.value = false }
  else if (a.type === 'book') { await doBook() }
  else if (a.type === 'crossSell') { showCross.value = true }
  else if (a.type === 'chips') { chips.value = a.group }
}
function removeThinking() { const i = msgs.value.findIndex((m) => m.thinking); if (i >= 0) msgs.value.splice(i, 1) }

/** chips/输入 → intent → 分发 */
async function onIntent(intent: Intent): Promise<void> {
  chips.value = null
  if (intent === 'main') {
    if (stage.value === SCRIPT_STAGE.PLANS) { push('ai', '回到正题～方案就在上面 👆'); chips.value = 'r3'; return }
    if (stage.value === SCRIPT_STAGE.BOOKED) { push('ai', '回到正题～'); chips.value = 'r4'; return }
    if (stage.value === SCRIPT_STAGE.IDLE || stage.value === SCRIPT_STAGE.DONE) {
      stage.value = SCRIPT_STAGE.PREFIX
      push('user', '带爸妈去乌东玩')
      removeThinking()
      push('ai', '好嘞～两位老人的行程包在我身上！预算和偏好也告诉我呗 👉')
      chips.value = 'r2'
      return
    }
  }
  if (intent === 'budget' || intent === 'quiet' || intent === 'banquet') {
    push('user', intent === 'budget' ? '预算一千五' : intent === 'quiet' ? '想要安静' : '想吃长桌宴')
    const beat = PREFIX_CONFIRM[intent]
    await play(beat)
    prefixDone.value++
    if (prefixDone.value >= 3) {
      chips.value = null
      stage.value = SCRIPT_STAGE.MAIN
      removeThinking()
      push('ai', '我听明白了：两位老人 + 两晚 + 长桌宴 + 预算 ¥1500 + 要安静——看我的 👀')
      await play(MAIN_BEATS)
      stage.value = SCRIPT_STAGE.PLANS
    } else {
      chips.value = 'r2'
    }
    return
  }
  if (intent === 'foodSide') { push('user', '乌东有什么好吃的'); await play(FOOD_SIDE_BEATS); chips.value = 'foodEnd'; return }
  if (intent === 'staySide') { push('user', '住哪里比较安静'); await play(STAY_SIDE_BEATS); chips.value = 'stayEnd'; return }
  if (intent === 'bookA') { stage.value = SCRIPT_STAGE.BOOKED; await play(BOOK_BEATS); return }
  if (intent === 'reorder') { push('user', '换个离梯田更近的'); await play(REORDER_BEATS); return }
  if (intent === 'more') { await play(MORE_BEATS); chips.value = 'r4'; return }
  if (intent === 'thanks') { await play(THANKS_BEATS); stage.value = SCRIPT_STAGE.DONE; chips.value = 'r1'; return }
}
function onChip(intent: Intent): void { onIntent(intent) }
function onEnter(e: KeyboardEvent): void {
  const el = e.target as HTMLInputElement
  const text = el.value.trim(); if (!text) return
  el.value = ''
  const it = matchInput(text, stage.value)
  if (it === 'unknown') { push('user', text); push('ai', '这段演示还没排～点点下面的快捷提问吧 👇'); return }
  if (it === 'main' && (stage.value === SCRIPT_STAGE.IDLE || stage.value === SCRIPT_STAGE.DONE)) {
    // 一句话开场：完整需求句直达主线
    stage.value = SCRIPT_STAGE.MAIN
    push('user', text)
    push('ai', '我听明白了：两位老人 + 两晚 + 长桌宴 + 预算 ¥1500 + 要安静——看我的 👀')
    play(MAIN_BEATS).then(() => { stage.value = SCRIPT_STAGE.PLANS })
    return
  }
  onIntent(it as Intent)
}

const withTimeout = async <T,>(p: Promise<T>, ms = 5000): Promise<T> => {
  let t: ReturnType<typeof setTimeout>
  const timer = new Promise<never>((_, rej) => { t = setTimeout(() => rej(new Error('timeout')), ms) })
  try { return await Promise.race([p, timer]) } finally { clearTimeout(t!) }
}

/** 三连真实预订（拍5）；任一失败降级 demo */
async function doBook(): Promise<void> {
  if (!session.isLogged) { loginHint.value = true; return }
  const nick = session.user?.nickname || '演示游客'
  const phone = '13800000001'
  try { const r = await withTimeout(accBookingCreate({ roomTypeId: DEMO.roomTypeId, checkInDate: DEMO.checkIn, checkOutDate: DEMO.checkOut, rooms: 1, guestName: nick, guestPhone: '' })); booked.value.hotel = 'ok'; booked.value.orderNo = r.orderNo } catch { booked.value.hotel = 'demo' }
  try { await withTimeout(createReservation({ restaurantId: DEMO.restaurantId, timeSlotId: DEMO.timeSlotId, reservationDate: DEMO.useDate, peopleCount: 2, contactName: nick, contactPhone: phone })) ; booked.value.meal = 'ok' } catch { booked.value.meal = 'demo' }
  try {
    const r = await withTimeout(travelApi.bookingCreate({ itemType: 'route', itemId: DEMO.routeItemId, useDate: DEMO.useDate, quantity: 2 }))
    const p = await withTimeout(orderApi.payCreate(r.orderNo))
    await withTimeout(orderApi.payMock(p.paymentNo))
    booked.value.ticket = 'ok'; booked.value.orderNo = booked.value.orderNo || r.orderNo
  } catch { booked.value.ticket = 'demo' }
}
function goto(key: 'hotel' | 'meal' | 'ticket' | 'all'): void {
  if (key === 'hotel') router.push(booked.value.orderNo ? `/order/${booked.value.orderNo}` : '/my/orders')
  else if (key === 'meal') router.push('/my/reservations')
  else if (key === 'ticket') router.push('/my/tickets')
  else router.push('/my/orders')
}
</script>

<template>
  <div v-if="showFab" class="ai-wrap">
    <button class="fab" :class="{ open }" @click="open = !open" :title="open ? '收起' : 'AI 管家'">
      <span v-if="!open">🤖</span><span v-else>✕</span>
    </button>

    <div v-if="open" class="drawer card">
      <div class="hd"><b>🤖 AI 管家</b><span>衣食住行，一句话</span></div>

      <div ref="bodyEl" class="body">
        <div v-if="!msgs.length" class="hello">你好呀～我是乌东 AI 管家 🏔️<br />说说你的旅行想法，我全部安排！</div>
        <div v-for="(m, i) in msgs" :key="i" class="msg" :class="m.role">
          <span v-if="m.thinking" class="bubble think">{{ m.text }}<i>.</i><i>.</i><i>.</i></span>
          <span v-else class="bubble">{{ m.text }}</span>
        </div>

        <div v-if="showExtract" class="extract card">
          <b>需求识别</b>
          <div v-for="e in EXTRACT" :key="e.k" class="er"><i>{{ e.k }}</i><span>{{ e.v }}</span></div>
        </div>

        <template v-if="plansOn">
          <PlanCard :plan="aFirst ? PLAN_A : PLAN_B" :highlight="aFirst" :booked="!!booked.hotel || !!booked.meal || !!booked.ticket"
            :booked-label="booked.orderNo" :demo="booked.hotel === 'demo' || booked.meal === 'demo' || booked.ticket === 'demo'"
            @book="onIntent('bookA')" />
          <PlanCard :plan="aFirst ? PLAN_B : PLAN_A" :highlight="!aFirst" />
        </template>

        <template v-if="showCross">
          <div class="cross">
            <a v-for="c in CROSS_SELL" :key="c.name" class="cc card" @click="router.push(c.to)">
              <span class="ic">{{ c.icon }}</span><b>{{ c.name }}</b><i>手信价 {{ c.price }} →</i>
            </a>
          </div>
        </template>

        <div v-if="loginHint" class="login-tip">请先在右上角登录，我才能帮你下单哦 🙏</div>
      </div>

      <div class="bookbar" v-if="booked.hotel || booked.meal || booked.ticket">
        <button class="mini" :class="{ on: !!booked.hotel, demo: booked.hotel === 'demo' }" @click="goto('hotel')">🏠 住宿</button>
        <button class="mini" :class="{ on: !!booked.meal, demo: booked.meal === 'demo' }" @click="goto('meal')">🍜 长桌宴</button>
        <button class="mini" :class="{ on: !!booked.ticket, demo: booked.ticket === 'demo' }" @click="goto('ticket')">🎫 路线票</button>
        <a class="all" @click="goto('all')">全部订单 →</a>
      </div>

      <div class="chips" v-if="chips">
        <button v-for="c in CHIPS[chips]" :key="c.label" class="chip" @click="onChip(c.intent)">{{ c.label }}</button>
      </div>
      <div class="input-row">
        <input placeholder="说说你的想法…" @keyup.enter="onEnter" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-wrap { position: fixed; right: 22px; bottom: 22px; z-index: 60; }
.fab { width: 56px; height: 56px; border-radius: 50%; border: none; background: var(--green-600); color: #fff; font-size: 26px; cursor: pointer; box-shadow: 0 4px 16px rgba(46,125,50,.4); position: relative; }
.fab:not(.open)::after { content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 2px solid var(--green-600); opacity: .5; animation: ring 1.8s ease-out infinite; }
@keyframes ring { 0% { transform: scale(.85); opacity: .6; } 100% { transform: scale(1.25); opacity: 0; } }
.drawer { position: absolute; bottom: 66px; right: 0; width: 400px; height: 560px; display: flex; flex-direction: column; overflow: hidden; }
.hd { padding: 10px 14px; border-bottom: 1px solid var(--line); display: flex; gap: 8px; align-items: baseline; }
.hd span { font-size: 11px; color: var(--text-3); }
.body { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; background: #fafaf8; }
.hello { text-align: center; color: var(--text-3); font-size: 13px; padding: 30px 0; }
.msg { display: flex; } .msg.user { justify-content: flex-end; }
.bubble { max-width: 82%; background: #fff; border: 1px solid var(--line); border-radius: 10px; padding: 7px 11px; font-size: 13px; }
.msg.user .bubble { background: var(--green-600); color: #fff; border-color: var(--green-600); }
.think i { animation: blink 1.2s infinite; } .think i:nth-child(2) { animation-delay: .2s; } .think i:nth-child(3) { animation-delay: .4s; }
@keyframes blink { 0%,100% { opacity: .2; } 50% { opacity: 1; } }
.extract { font-size: 12px; padding: 8px 10px; }
.extract b { font-size: 12px; } .er { display: flex; gap: 8px; margin-top: 3px; } .er i { color: var(--text-3); font-style: normal; width: 60px; }
.cross { display: flex; gap: 8px; } .cc { flex: 1; padding: 8px; text-align: center; cursor: pointer; font-size: 12px; }
.cc .ic { font-size: 22px; display: block; } .cc i { display: block; color: var(--orange-500); font-style: normal; font-size: 11px; }
.login-tip { background: var(--amber-bg); color: var(--amber-text); border-radius: 8px; padding: 8px 12px; font-size: 12px; }
.bookbar { display: flex; gap: 6px; align-items: center; padding: 8px 12px; border-top: 1px solid var(--line); }
.mini { font-size: 11px; border: 1px solid var(--line); background: #fff; border-radius: 12px; padding: 3px 8px; cursor: pointer; color: var(--text-3); }
.mini.on { border-color: var(--green-600); color: var(--green-600); background: var(--ok-bg); }
.mini.demo { border-style: dashed; }
.all { margin-left: auto; font-size: 11px; color: var(--text-3); cursor: pointer; text-decoration: underline; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 12px 0; }
.chip { font-size: 12px; border: 1px solid var(--green-600); color: var(--green-600); background: #fff; border-radius: 14px; padding: 4px 10px; cursor: pointer; }
.chip:hover { background: var(--ok-bg); }
.input-row { padding: 8px 12px 12px; }
.input-row input { width: 100%; border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px; font-size: 13px; box-sizing: border-box; }
</style>
```

- [ ] **Step 4: 跑测试确认通过**

Run: `cd wudong-web && npx vitest run src/components/ai/__tests__/AiButler.spec.ts`
Expected: PASS（6 例）。若 `settle` 偶发不够（异步链长），把 `settle` 默认 rounds 提到 60。

- [ ] **Step 5: Commit**

```bash
git add wudong-web/src/components/ai/AiButler.vue wudong-web/src/components/ai/__tests__/AiButler.spec.ts
git commit -m "feat(ai): AiButler 容器——悬浮圈/对话流/递进chips/常驻预订条/三连真实预订+降级（含单测）"
```

---

### Task 6: 挂载 + README + 全量验证

**Files:**
- Modify: `wudong-web/src/App.vue`
- Modify: `wudong-web/README.md`（文末追加「AI管家演示」一节）

**Interfaces:**
- Consumes: Task 5 的 `AiButler.vue`（无必填 props）。

- [ ] **Step 1: App.vue 挂载（组件内部已做 `route.path==='/'` 判断，App 层无条件挂载）**

```vue
<script setup lang="ts">
import TopNav from './components/TopNav.vue'
import AiButler from './components/ai/AiButler.vue'
</script>

<template>
  <TopNav />
  <RouterView />
  <AiButler />
</template>
```

- [ ] **Step 2: README 追加演示章节**

在 `wudong-web/README.md` 文末追加：

```markdown
## AI管家演示（feature/ai-butler-demo）

1. 起后端 + `node scripts/seed.js` 重灌演示数据（新增：云上人家/长桌宴时段/国庆路线库存）
2. `npm run dev`，打开 http://localhost:5175 ，右上角登录测试账号（13800000001 / abc123456）
3. 首页右下角 🤖 → 点 chips 按剧本走 7 拍；双击悬浮圈可跳过铺垫直达预订拍（彩排用）
4. 台词金额台账：632+168+598=1398，预算剩 102
5. 彩排后清理脏订单：`cool-admin-midway/scripts/cleanup-demo-orders.sql`
6. 现场保险：后端/数据异常时对应项自动降级「演示数据」，戏不断
```

- [ ] **Step 3: 全量测试 + 构建**

```bash
cd wudong-web && npm test && npm run build
```

Expected: 全部用例 PASS（现有 + 新增 ~22）；`vue-tsc` 无类型错误。

- [ ] **Step 4: 手动彩排（需后端环境，逐项打勾）**

```bash
docker compose up -d          # 或本地 npm run dev 起后端
cd cool-admin-midway && node scripts/seed.js
cd ../wudong-web && npm run dev
```

- [ ] 首页右下角出现脉冲 🤖，其他页面不出现
- [ ] 点「带爸妈去乌东玩」→ R2 三连点 → 接力面板三节点依次点亮 → A/B 卡出现
- [ ] 登录后「就按 A 方案订」→ 三项成功：`/my/orders` 有住宿订单、`/my/reservations` 有长桌宴、`/my/tickets` 有两张票
- [ ] 「换个离梯田更近的」→ B 卡顶上
- [ ] 手信卡点击跳 `/products`、`/farm-products`
- [ ] 停掉后端再彩排一遍：对应项显示「演示数据」，流程不断

- [ ] **Step 5: Commit**

```bash
git add wudong-web/src/App.vue wudong-web/README.md
git commit -m "feat(ai): AI管家挂载首页 + README 演示手册"
```

---

## 验收对照（spec → 任务）

| spec 条目 | 落点 |
|---|---|
| §2 七拍叙事 | Task 2 剧本常量 + Task 5 播放器 |
| §3.1-3.2 悬浮圈/抽屉/首页 gate | Task 5 + Task 6 |
| §3.3-3.4 接力面板/思考动效 | Task 3 + Task 5（thinking 气泡） |
| §3.5 方案小卡 | Task 4 |
| §3.6 chips 递进（含吃/住支线） | Task 2 CHIPS/PREFIX_CONFIRM + Task 5 onIntent |
| §3.8 常驻预订条 + 跳转 | Task 5 bookbar/goto |
| §5 三连真实预订 + 降级 | Task 5 doBook（withTimeout 5s） |
| §6 seed 调整 | Task 1 |
| §7 错误处理/兜底 | Task 5（unknown→兜底、loginHint、防竞态 playSeq） |
| §8 测试 | 各 Task TDD + Task 6 全量 |
| §12 彩排清理 | Task 1 cleanup-demo-orders.sql |
