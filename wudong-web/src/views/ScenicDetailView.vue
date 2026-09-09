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
