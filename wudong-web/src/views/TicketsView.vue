<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '../stores/session'
import { useBooking } from '../stores/booking'
import { getETickets, getRoute, getSpot, findTicketType } from '../data/mock'

const router = useRouter()
const session = useSession()
const booking = useBooking()
if (!session.isLogged) session.login() // demo：直接进入则静默登录

const tick = ref(0) // mock 数据为普通数组（非响应式），退票后手动触发重算
const tickets = computed(() => {
  tick.value
  return getETickets(session.user!.id).slice().sort((a, b) => (a.status === 'unused' ? -1 : 1) - (b.status === 'unused' ? -1 : 1))
})
function onRefund(t: { id: number; useDate: string; itemType: 'ticket' | 'route'; itemId: number }): void {
  if (!window.confirm(`确认退票？${titleOf(t)} · ${t.useDate}`)) return
  try {
    booking.refundTicket(t.id)
    tick.value++
  } catch (e) {
    alert((e as Error).message)
  }
}
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
            <a v-if="t.status === 'unused'" class="refund" @click="onRefund(t)">退票</a>
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
.refund { color: var(--text-3); font-size: 11px; cursor: pointer; text-decoration: underline; }
.tear { width: 88px; border-left: 1.5px dashed #ccc; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; position: relative; }
.tear::before, .tear::after { content: ''; position: absolute; left: -7px; width: 12px; height: 12px; border-radius: 50%; background: #f7f7f5; border: 1px solid var(--line); }
.tear::before { top: -7px; } .tear::after { bottom: -7px; }
.qr { width: 54px; height: 54px; border: 3px solid #333; border-radius: 3px; background: repeating-linear-gradient(0deg, #333 0 3px, transparent 3px 6px), repeating-linear-gradient(90deg, #333 0 3px, #fff 3px 6px); }
.used { filter: grayscale(1); opacity: .62; }
.empty { padding: 26px; text-align: center; color: var(--text-3); }
</style>
