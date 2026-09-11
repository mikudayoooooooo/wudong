<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSession } from '../../stores/session'
import { getMyReservations, cancelReservation } from '../../api/order'
import Icon from '../../components/Icon.vue'

const session = useSession()
const loading = ref(true)
const list = ref<any[]>([])

const STATUS_DICT: Record<number, { label: string; cls: string }> = {
  0: { label: '待确认', cls: 'st-warn' },
  1: { label: '已确认', cls: 'st-ok' },
  2: { label: '已取消', cls: 'st-off' },
  3: { label: '已完成', cls: 'st-ok' },
}

async function load() {
  loading.value = true
  try {
    const r = await getMyReservations(undefined, 1, 50)
    list.value = r.list || []
  } finally {
    loading.value = false
  }
}

async function onCancel(r: any) {
  if (!window.confirm(`确认取消 ${r.reservationDate} 的预订？`)) return
  try {
    await cancelReservation(r.id)
    await load()
  } catch (e: any) {
    alert(e?.message || '取消失败')
  }
}

onMounted(async () => {
  if (!session.isLogged) {
    alert('请先在右上角登录后查看预订')
    return
  }
  await load()
})
</script>

<template>
  <div class="container page">
    <h2><Icon name="tools-kitchen-2" :size="16" /> 我的餐位预订</h2>

    <div v-if="!session.isLogged" class="card empty"><Icon name="tools-kitchen-2" :size="16" /> 请先在右上角登录后查看预订</div>
    <div v-else-if="loading" class="card empty">加载中…</div>
    <div v-else-if="!list.length" class="card empty"><Icon name="tools-kitchen-2" :size="16" /> 暂无预订，去「特色餐厅」挑一家试试</div>
    <div v-else class="reservations">
      <div v-for="r in list" :key="r.id" class="res">
        <div class="row1">
          <b>{{ r.restaurantName || `餐厅 #${r.restaurantId}` }}</b>
          <span :class="STATUS_DICT[r.status]?.cls">{{ STATUS_DICT[r.status]?.label ?? r.status }}</span>
        </div>
        <div class="row2">
          <span><Icon name="calendar" :size="12" /> {{ r.reservationDate }}</span>
          <span><Icon name="users" :size="12" /> {{ r.guestCount }} 人</span>
          <span>联系人：{{ r.contactName }}</span>
        </div>
        <div class="row3">
          <span class="no" v-if="r.orderNo">订单 {{ r.orderNo }}</span>
          <span v-else></span>
          <button
            v-if="r.status === 0 || r.status === 1"
            class="mini"
            @click="onCancel(r)"
          >取消预订</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reservations { display: flex; flex-direction: column; }
.res { padding: 12px 4px; border-bottom: 1px solid var(--line-soft); }
.row1 { display: flex; justify-content: space-between; align-items: center; }
.row2 { display: flex; gap: 16px; margin: 6px 0; font-size: 13px; color: var(--text-2); }
.row3 { display: flex; justify-content: space-between; align-items: center; }
.row3 .no { color: var(--text-3); font-size: 12px; }
.st-warn { color: var(--cinnabar-700); background: var(--cinnabar-100); font-weight: 700; font-size: 12px; padding: 2px 8px; border-radius: 2px; }
.st-ok { color: var(--ind-700); background: var(--ind-100); font-weight: 700; font-size: 12px; padding: 2px 8px; border-radius: 2px; }
.st-off { color: var(--text-3); font-size: 12px; padding: 2px 8px; border-radius: 2px; }
.mini { border: 1px solid var(--line-soft); background: #fff; border-radius: var(--radius); padding: 3px 12px; cursor: pointer; font-size: 12px; }
</style>
