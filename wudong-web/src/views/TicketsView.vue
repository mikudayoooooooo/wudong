<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '../stores/session'
import { travelApi } from '../api/travel'
import Icon from '../components/Icon.vue'

const router = useRouter()
const session = useSession()
const loading = ref(true)
const raw = ref<any[]>([])
const tick = ref(0)

async function load() {
  loading.value = true
  try {
    raw.value = await travelApi.ticketMy()
  } finally {
    loading.value = false
  }
}
onMounted(async () => {
  if (!session.isLogged) {
    // 未登录先跳登录（右上角弹窗语义），回来再取票
    alert('请先在右上角登录后查看票务')
    return
  }
  await load()
})

const tickets = computed(() => {
  tick.value
  return [...raw.value].sort((a, b) => {
    const rank = (s: string) => (s === 'unused' ? 0 : s === 'used' ? 1 : 2)
    return rank(a.status) - rank(b.status)
  })
})

function titleOf(t: any): string {
  return t.itemType === 'route' ? t.itemName || '路线' : `${t.spotName || ''} · ${t.ticketName || '门票'}`.trim()
}
async function onRefund(t: any): Promise<void> {
  if (!window.confirm(`确认整单退票？${titleOf(t)} · ${t.useDate}`)) return
  try {
    const r = await travelApi.ticketRefund(t.orderNo)
    alert(`已退款 ¥${r.refundAmount}（扣除 10% 手续费），共 ${r.ticketCount} 张`)
    await load()
  } catch (e: any) {
    alert(e?.message || '退票失败')
  }
}
</script>

<template>
  <div class="container page">
    <h2 class="font-display"><Icon name="ticket" :size="20" /> 我的票务</h2>
    <div v-if="!session.isLogged" class="card empty">请先在右上角登录后查看票务</div>
    <div v-else-if="loading" class="card empty">加载中…</div>
    <div v-else class="wallet">
      <div v-for="t in tickets" :key="t.id" class="ticket card" :class="{ used: t.effectiveStatus !== 'unused' }">
        <div class="left">
          <div class="name">{{ titleOf(t) }}</div>
          <div class="date">{{ t.useDate }} · {{ t.effectiveStatus === 'used' ? '已完成' : t.effectiveStatus === 'refunded' ? '已退款' : t.effectiveStatus === 'unpaid' ? '待支付' : '待使用' }}</div>
          <div class="meta">
            <span class="pill st" :class="t.effectiveStatus">
              {{ t.effectiveStatus === 'unused' ? '● 待使用' : t.effectiveStatus === 'used' ? '✓ 已核销' : t.effectiveStatus === 'unpaid' ? '待支付' : '已退款' }}
            </span>
            <a v-if="t.effectiveStatus === 'unpaid'" class="refund" @click="router.push(`/route/${t.itemId}`)">去支付 ›</a>
            <a v-if="t.effectiveStatus === 'unused'" class="refund" @click="onRefund(t)">退票</a>
            <a v-if="t.effectiveStatus === 'used'" class="write" @click="router.push('/publish')"><Icon name="gift" :size="12" /> 已计入足迹 · 去写游记 ›</a>
          </div>
        </div>
        <div class="tear">
          <div class="qr" />
          <div class="ono">{{ t.qrCode.slice(-4) }}</div>
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
.st.used, .st.refunded { background: var(--line); color: var(--text-3); }
.write { color: var(--amber-text); font-size: 11px; cursor: pointer; }
.refund { color: var(--text-3); font-size: 11px; cursor: pointer; text-decoration: underline; }
.tear { width: 88px; border-left: 1.5px dashed var(--ind-100); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; position: relative; }
.tear::before, .tear::after { content: ''; position: absolute; left: -7px; width: 12px; height: 12px; border-radius: 50%; background: var(--ind-50); border: 1px solid var(--line); }
.tear::before { top: -7px; } .tear::after { bottom: -7px; }
.qr { width: 54px; height: 54px; border: 3px solid #333; border-radius: 3px; background: repeating-linear-gradient(0deg, #333 0 3px, transparent 3px 6px), repeating-linear-gradient(90deg, #333 0 3px, #fff 3px 6px); }
.used { filter: grayscale(1); opacity: .62; }
.empty { padding: 26px; text-align: center; color: var(--text-3); }
</style>
