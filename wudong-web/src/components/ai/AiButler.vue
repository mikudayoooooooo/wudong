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
async function scrollBottom() { await nextTick(); bodyEl.value?.scrollTo?.({ top: bodyEl.value.scrollHeight }) }
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
      <RelayPanel :lit="lit" :busy="busy" />

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
