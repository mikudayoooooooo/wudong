<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSession } from '../stores/session'
import { useBooking } from '../stores/booking'
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
