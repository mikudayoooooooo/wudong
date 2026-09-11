<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { travelApi } from '../api/travel'
import BookingModal from '../components/BookingModal.vue'
import { SCENIC_COVERS } from '../data/photos'
import Icon from '../components/Icon.vue'

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
const heroCover = computed(() => (spot.value ? SCENIC_COVERS[spot.value.id] : undefined))

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
  <div v-if="spot" class="detail-page">
    <!-- 页头：全幅 320px 封面，宋体纸色标题压图（规范 §3.3.1） -->
    <section class="detail-hero img-frame" :class="{ 'no-cover': !heroCover }">
      <img v-if="heroCover" :src="heroCover" :alt="spot.name" />
      <div class="hero-mask" aria-hidden="true" />
      <div class="hero-inner">
        <h1 class="font-display">{{ spot.name }}</h1>
        <div class="sub"><Icon name="map-pin" :size="12" /> {{ spot.address }} · <Icon name="clock" :size="12" /> {{ spot.openTime }}</div>
      </div>
    </section>

    <div class="container">
      <section class="summary-card">
        <span class="pill chip">{{ spot.intro }}</span>
      </section>

      <section class="sect">
        <b class="sect-title font-display"><Icon name="ticket" :size="14" /> 票种</b>
        <div class="sect-sub">选择日期与票种下单</div>
        <div class="tk-grid">
          <div v-for="t in tickets" :key="t.id" class="card tk">
            <b>{{ t.name }}</b>
            <div class="price font-display">¥{{ t.price }}</div>
            <div class="stock">总库存 {{ t.totalStock }}</div>
            <button class="btn-primary" @click="onBuy(t.id)">选日期购票</button>
          </div>
          <div v-if="!tickets.length" class="card tk empty">此地点暂无可售票种（餐饮/住宿/体验类）</div>
        </div>
      </section>

      <section v-if="relatedRoutes.length" class="sect">
        <b class="sect-title font-display"><Icon name="map-pins" :size="14" /> 从这出发的路线</b>
        <div class="rr">
          <div v-for="r in relatedRoutes" :key="r.id" class="card rr-card" @click="router.push(`/route/${r.id}`)">
            <Icon name="map-pin" :size="12" /> {{ r.title }} · ¥{{ r.price }}起 ›
          </div>
        </div>
      </section>

      <section class="sect">
        <b class="sect-title font-display"><Icon name="star" :size="14" /> 用户评价</b>
        <div v-for="r in reviews" :key="r.id" class="rv">
          <b>{{ r.avatar }} {{ r.nickname }}</b>
          <span class="stars">{{ '★'.repeat(r.rating) }}</span>
          <p>{{ r.content }}</p>
        </div>
      </section>

      <BookingModal :open="buyTicketId !== null" item-type="ticket" :item-id="buyTicketId ?? 0" @close="buyTicketId = null" />
    </div>
  </div>
</template>

<style scoped>
/* 页头（§3.3.1） */
.detail-hero { position: relative; height: 320px; background: var(--ind-800); }
.detail-hero.no-cover { background: var(--ind-800) url("../assets/pattern/diamond-dark.svg") center/560px repeat; }
.hero-mask { position: absolute; inset: 0; background: rgba(11, 29, 44, .45); }
.hero-inner { position: absolute; left: 0; right: 0; bottom: 24px; max-width: 1200px; margin: 0 auto; padding: 0 16px; color: var(--paper); }
.hero-inner h1 { margin: 0; font-size: 32px; line-height: 1.25; }
.sub { font-size: 12px; color: rgba(251, 247, 238, .85); margin-top: 6px; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }

/* 摘要卡叠压头图（§3.0 B.3） */
.summary-card { margin-top: -24px; position: relative; z-index: 1; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); padding: 12px 18px; }
.chip { background: var(--ind-100); color: var(--ind-700); font-weight: 400; }

/* 正文分节（§3.3.3） */
.sect { border-top: 1px solid var(--line); margin-top: 20px; padding: 20px 0; }
.sect-title { font-size: 15px; color: var(--ind-800); display: flex; align-items: center; gap: 6px; }
.sect-sub { font-size: 12px; color: var(--text-3); margin: 4px 0 12px; }
.tk-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.tk { padding: 12px; text-align: center; }
.tk:hover { border-color: var(--ind-300); }
.tk .price { color: var(--cinnabar); font-size: 18px; font-weight: 700; margin: 4px 0; }
.tk .stock { font-size: 11px; color: var(--text-3); margin-bottom: 8px; }
.tk.empty { display: flex; align-items: center; justify-content: center; color: var(--text-3); }
.rr { display: flex; gap: 10px; flex-wrap: wrap; }
.rr-card { padding: 10px 14px; cursor: pointer; font-size: 13px; }
.rr-card:hover { border-color: var(--ind-300); }
.rv { border-bottom: 1px solid var(--line-soft); padding: 8px 0; font-size: 13px; }
.stars { color: var(--cinnabar); margin-left: 8px; }
.rv p { margin: 4px 0 0; color: var(--text-2); }
@media (max-width: 900px) {
  .hero-inner h1 { font-size: 24px; }
  .tk-grid { grid-template-columns: 1fr 1fr; }
}
</style>
