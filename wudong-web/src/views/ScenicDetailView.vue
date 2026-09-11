<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { travelApi } from '../api/travel'
import SectionHeader from '../components/SectionHeader.vue'
import BookingModal from '../components/BookingModal.vue'

const routeParam = useRoute()
const router = useRouter()
const spotId = computed(() => Number(routeParam.params.id))
const spot = ref<any>(null)

watch(
  spotId,
  async (id) => {
    spot.value = null
    if (id) spot.value = await travelApi.scenicDetail(id)
  },
  { immediate: true }
)

const tickets = computed(() => spot.value?.tickets || [])
const reviews = computed(() => spot.value?.reviews || [])
const relatedRoutes = computed(() => spot.value?.relatedRoutes || [])

const buyTicketId = ref<number | null>(null)
async function onBuy(ticketId: number): Promise<void> {
  const inv = await travelApi.inventoryList('ticket', ticketId)
  if (!inv.length) {
    alert('该票种暂未配置日期库存')
    return
  }
  buyTicketId.value = ticketId
}
</script>

<template>
  <div v-if="spot" class="container">
    <div class="ph cover ph-0">📍 {{ spot.name }}</div>
    <section class="card info">
      <h2>{{ spot.name }} <span class="pill chip">{{ spot.intro }}</span></h2>
      <div class="meta">📍 {{ spot.address }} · 🕐 {{ spot.openTime }}</div>
    </section>

    <SectionHeader icon="ticket" title="票种" sub="选择日期与票种下单" />
    <section class="tk-grid">
      <div v-for="t in tickets" :key="t.id" class="card tk">
        <b>{{ t.name }}</b>
        <div class="price">¥{{ t.price }}</div>
        <div class="stock">总库存 {{ t.totalStock }}</div>
        <button class="btn-primary" @click="onBuy(t.id)">选日期购票</button>
      </div>
      <div v-if="!tickets.length" class="card tk empty">此地点暂无可售票种（餐饮/住宿/体验类）</div>
    </section>

    <template v-if="relatedRoutes.length">
      <SectionHeader icon="map-pins" title="从这出发的路线" />
      <div class="rr">
        <div v-for="r in relatedRoutes" :key="r.id" class="card rr-card" @click="router.push(`/route/${r.id}`)">
          🗺 {{ r.title }} · ¥{{ r.price }}起 ›
        </div>
      </div>
    </template>

    <SectionHeader icon="star" title="用户评价" />
    <section class="card rvs">
      <div v-for="r in reviews" :key="r.id" class="rv">
        <b>{{ r.avatar }} {{ r.nickname }}</b>
        <span class="stars">{{ '★'.repeat(r.rating) }}</span>
        <p>{{ r.content }}</p>
      </div>
    </section>

    <BookingModal :open="buyTicketId !== null" item-type="ticket" :item-id="buyTicketId ?? 0" @close="buyTicketId = null" />
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
