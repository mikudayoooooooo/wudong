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
