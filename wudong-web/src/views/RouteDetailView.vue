<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute as useRouteParam, useRouter } from 'vue-router'
import { travelApi, type RouteDetail } from '../api/travel'
import { communityApi } from '../api/community'
import { ROUTE_COVERS } from '../data/photos'
import FootprintMap from '../components/FootprintMap.vue'
import PostCard from '../components/PostCard.vue'
import SectionHeader from '../components/SectionHeader.vue'
import BookingModal from '../components/BookingModal.vue'
import Icon from '../components/Icon.vue'

const routeParam = useRouteParam()
const router = useRouter()
const routeId = computed(() => Number(routeParam.params.id))
const route = ref<RouteDetail | null>(null)
const linkedPosts = ref<any[]>([])

watch(
  routeId,
  async (id) => {
    route.value = null
    if (!id) return
    route.value = await travelApi.routeDetail(id)
    const feed = await communityApi.feed('latest', 1, 6, id)
    // 附路线标题给卡片标签
    linkedPosts.value = feed.list.map((p) => ({ ...p, routeTitle: route.value?.title }))
  },
  { immediate: true }
)

const stops = computed(() => route.value?.stops || [])
const dates = computed(() => route.value?.inventories || [])
const reviews = computed(() => route.value?.reviews || [])

const chosenDate = ref('')
const people = ref(2)
const stockCls = (sold: number, total: number): string =>
  sold >= total ? 'soldout' : total - sold <= 10 ? 'tight' : ''
const stockText = (inv: { sold: number; total: number }): string =>
  inv.sold >= inv.total ? '满' : `余${inv.total - inv.sold}`

const bookingOpen = ref(false)
function onBook(): void {
  if (!chosenDate.value) {
    alert('请先选择出行日期')
    return
  }
  bookingOpen.value = true
}

const heroCover = computed(() => (route.value ? ROUTE_COVERS[route.value.id] : undefined))
</script>

<template>
  <div v-if="route" class="detail-page">
    <!-- 页头：全幅 320px 封面，宋体纸色标题压图（规范 §3.3.1） -->
    <section class="detail-hero img-frame" :class="{ 'no-cover': !heroCover }">
      <img v-if="heroCover" :src="heroCover" :alt="route.title" />
      <div class="hero-mask" aria-hidden="true" />
      <div class="hero-inner">
        <h1 class="font-display">
          {{ route.title }}
          <span class="pill chip">{{ route.days }}天{{ route.days > 1 ? '1晚' : '' }}</span>
          <span class="pill chip">{{ route.theme }}</span>
        </h1>
        <div class="sub">★ {{ (4.9).toFixed(1) }}（{{ reviews.length * 163 }}条评价）· 已售 {{ route.sales }} · 本周又有 89 人成行</div>
      </div>
    </section>

    <div class="container">
      <!-- 摘要卡：向上叠压头图（§3.0 B.3） -->
      <section class="summary-card">
        <div class="includes">含：{{ route.includes.join(' / ') }} · {{ route.departure }}集合</div>
        <div class="price-box">
          <div class="p font-display">¥{{ route.price }}<span> 起</span></div>
          <button class="btn-primary" @click="onBook">立即订票</button>
        </div>
      </section>
      <div class="tip"><Icon name="info-circle" :size="13" /> {{ route.notice }}</div>

      <SectionHeader icon="compass" title="行程地图" sub="亮色站显示真实点亮人数 · 灰站为行程中未解锁" />
      <FootprintMap :stops="stops" variant="chain" :show-counts="true" @select="(id) => router.push(`/scenic/${id}`)" />

      <section class="sect">
        <b class="sect-title font-display"><Icon name="calendar-time" :size="14" /> 每日行程</b>
        <div v-for="s in stops" :key="s.spotId" class="it-row">
          <span class="pill day">D{{ s.dayNo }}</span>
          <b>{{ s.icon }} {{ s.name }}</b>
          <span class="desc">{{ s.lightCount ? `${s.lightCount} 人点亮过这站` : '暂无人解锁 · 等你来' }}</span>
        </div>
        <div class="std">住宿标准：{{ route.hotelStandard }} ｜ 餐饮标准：{{ route.mealStandard }}</div>
      </section>

      <section class="sect">
        <b class="sect-title font-display">选择出行日期</b>
        <div class="dates">
          <div
            v-for="inv in dates" :key="inv.useDate" class="date-cell" :class="[stockCls(inv.sold, inv.total), { picked: chosenDate === inv.useDate }]"
            @click="inv.sold < inv.total && (chosenDate = inv.useDate)"
          >
            <b>{{ inv.useDate.slice(5) }}</b>
            <span>{{ stockText(inv) }}</span>
          </div>
        </div>
        <div class="people">
          出行人数
          <button @click="people = Math.max(1, people - 1)">−</button><b>{{ people }}</b><button @click="people++">＋</button>
        </div>
        <button class="btn-primary go" @click="onBook">立即订票 · 出票后生成足迹地图</button>
      </section>

      <SectionHeader icon="camera" title="走过这条线的人" sub="他们的足迹地图" more="进入社区" @more="router.push('/community')" />
      <section class="linked">
        <PostCard v-for="p in linkedPosts" :key="p.id" :post="p" @open="(id) => router.push(`/post/${id}`)" />
        <div v-if="!linkedPosts.length" class="empty card">还没有游记，走完这条线来写第一篇吧</div>
      </section>

      <section class="sect">
        <b class="sect-title font-display"><Icon name="star-filled" :size="13" /> 游客评价（{{ reviews.length }}）</b>
        <div v-for="r in reviews" :key="r.id" class="rv">
          <b>{{ r.avatar }} {{ r.nickname }}</b>
          <span class="stars">{{ '★'.repeat(r.rating) }}</span>
          <p>{{ r.content }}</p>
        </div>
      </section>

      <BookingModal :open="bookingOpen" item-type="route" :item-id="routeId" @close="bookingOpen = false" />
    </div>
  </div>
</template>

<style scoped>
/* 页头（§3.3.1）：全幅 320px 封面 + 纸色宋体标题压图 */
.detail-hero { position: relative; height: 320px; background: var(--ind-800); }
.detail-hero.no-cover { background: var(--ind-800) url("../assets/pattern/diamond-dark.svg") center/560px repeat; }
.hero-mask { position: absolute; inset: 0; background: rgba(11, 29, 44, .45); }
.hero-inner { position: absolute; left: 0; right: 0; bottom: 24px; max-width: 1200px; margin: 0 auto; padding: 0 16px; color: var(--paper); }
.hero-inner h1 { margin: 0; font-size: 32px; line-height: 1.25; }
.chip { background: transparent; border: 1px solid rgba(251, 247, 238, .45); color: var(--paper); margin-left: 6px; }
.sub { font-size: 12px; color: rgba(251, 247, 238, .85); margin-top: 6px; }

/* 摘要卡叠压头图（§3.0 B.3） */
.summary-card { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-top: -24px; position: relative; z-index: 1; background: var(--paper); border: 1px solid var(--line); border-radius: var(--radius); padding: 14px 18px; }
.includes { font-size: 12px; color: var(--text-2); }
.price-box { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
.p { font-size: 24px; color: var(--cinnabar); font-weight: 700; }
.p span { font-size: 11px; font-weight: 400; }
.tip { font-size: 11px; color: var(--text-3); margin: 8px 0 0; }

/* 正文分节（§3.3.3）：发丝线分节，去卡片化 */
.sect { border-top: 1px solid var(--line); margin-top: 20px; padding: 20px 0; }
.sect-title { font-size: 15px; color: var(--ind-800); display: flex; align-items: center; gap: 6px; }
.it-row { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-bottom: 1px solid var(--line-soft); font-size: 13px; }
.day { background: var(--cinnabar-100); color: var(--cinnabar-700); }
.desc { color: var(--text-3); font-size: 12px; }
.std { font-size: 12px; color: var(--text-3); margin-top: 8px; }
.dates { display: flex; gap: 8px; margin: 12px 0; flex-wrap: wrap; }
.date-cell { border: 1px solid var(--line); border-radius: var(--radius); text-align: center; padding: 6px 14px; cursor: pointer; font-size: 12px; }
.date-cell span { color: var(--cinnabar); display: block; }
.date-cell.tight { border-color: var(--cinnabar); }
.date-cell.soldout { color: var(--text-3); border-style: dashed; cursor: not-allowed; }
.date-cell.soldout span { color: var(--text-3); }
.date-cell.picked { border-color: var(--ind-700); background: var(--ind-50); }
.people { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.people button { width: 24px; height: 24px; border-radius: var(--radius); border: 1px solid var(--line); background: #fff; }
.go { width: 100%; margin-top: 12px; }
.linked { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
.empty { padding: 24px; text-align: center; color: var(--text-3); }
.rv { border-bottom: 1px solid var(--line-soft); padding: 8px 0; font-size: 13px; }
.stars { color: var(--cinnabar); margin-left: 8px; }
.rv p { margin: 4px 0 0; color: var(--text-2); }
@media (max-width: 900px) {
  .hero-inner h1 { font-size: 24px; }
  .summary-card { flex-direction: column; align-items: flex-start; }
  .linked { grid-template-columns: 1fr; }
}
</style>
