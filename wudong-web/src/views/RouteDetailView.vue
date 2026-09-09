<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRoute, getInventories, getReviews, getUser, getPosts } from '../data/mock'
import { routeStopsView } from '../lib/footprint'
import FootprintMap from '../components/FootprintMap.vue'
import PostCard from '../components/PostCard.vue'
import SectionHeader from '../components/SectionHeader.vue'

const routeParam = useRoute()
const router = useRouter()
const routeId = computed(() => Number(routeParam.params.id))
const route = computed(() => getRoute(routeId.value))
const stops = computed(() => routeStopsView(routeId.value))
const dates = computed(() => getInventories('route', routeId.value))
const reviews = computed(() => getReviews('route', routeId.value))
const linkedPosts = computed(() => getPosts().filter((p) => p.linkedRouteId === routeId.value))

const chosenDate = ref('')
const people = ref(2)
const stockCls = (sold: number, total: number): string =>
  sold >= total ? 'soldout' : total - sold <= 10 ? 'tight' : ''
const stockText = (inv: { sold: number; total: number }): string =>
  inv.sold >= inv.total ? '满' : `余${inv.total - inv.sold}`

function onBook(): void {
  // BookingModal 在 Task 16 接入；此处先行占位提示
  alert(`已选择 ${chosenDate.value || '请选日期'} × ${people.value} 人（Task 16 接入下单弹窗）`)
}
</script>

<template>
  <div v-if="route" class="container">
    <section class="hero card">
      <div>
        <h2>{{ route.title }}
          <span class="pill chip">{{ route.days }}天{{ route.days > 1 ? '1晚' : '' }}</span>
          <span class="pill chip">{{ route.theme }}</span>
        </h2>
        <div class="sub">⭐ {{ (4.9).toFixed(1) }}（{{ reviews.length * 163 }}条评价）· 已售 {{ route.sales }} · 🔥本周又有 89 人成行</div>
        <div class="includes">含：{{ route.includes.join(' / ') }} · {{ route.departure }}集合</div>
      </div>
      <div class="price-box">
        <div class="p">¥{{ route.price }}<span> 起</span></div>
        <button class="btn-primary" @click="onBook">立即订票</button>
        <div class="tip">💡 {{ route.notice }}</div>
      </div>
    </section>

    <SectionHeader icon="🧭" title="行程地图" sub="亮色站显示真实点亮人数 · 灰站为行程中未解锁" />
    <FootprintMap :stops="stops" variant="chain" :show-counts="true" @select="(id) => router.push(`/scenic/${id}`)" />

    <section class="itinerary card">
      <b>📋 每日行程</b>
      <div v-for="s in stops" :key="s.spotId" class="it-row">
        <span class="pill day">D{{ s.dayNo }}</span>
        <b>{{ s.icon }} {{ s.name }}</b>
        <span class="desc">{{ s.lightCount ? `${s.lightCount} 人点亮过这站` : '🔒 暂无人解锁，等你来' }}</span>
      </div>
      <div class="std">住宿标准：{{ route.hotelStandard }} ｜ 餐饮标准：{{ route.mealStandard }}</div>
    </section>

    <section class="booking card">
      <b>选择出行日期</b>
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

    <SectionHeader icon="📷" title="走过这条线的人" sub="他们的足迹地图" more="进入社区" @more="router.push('/community')" />
    <section class="linked">
      <PostCard v-for="p in linkedPosts" :key="p.id" :post="p" @open="(id) => router.push(`/post/${id}`)" />
      <div v-if="!linkedPosts.length" class="empty card">还没有游记，走完这条线来写第一篇吧</div>
    </section>

    <section class="reviews card">
      <b>⭐ 游客评价（{{ reviews.length }}）</b>
      <div v-for="r in reviews" :key="r.id" class="rv">
        <b>{{ getUser(r.userId)?.avatar }} {{ getUser(r.userId)?.nickname }}</b>
        <span class="stars">{{ '★'.repeat(r.rating) }}</span>
        <p>{{ r.content }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero { display: flex; justify-content: space-between; padding: 16px 18px; margin-top: 16px; }
h2 { margin: 0 0 6px; }
.chip { background: rgba(58,125,92,.12); color: var(--green-600); margin-left: 6px; }
.sub, .includes { font-size: 12px; color: var(--text-2); margin-top: 4px; }
.price-box { text-align: right; }
.p { font-size: 22px; font-weight: 800; color: var(--orange-700); }
.tip { font-size: 10px; color: #aaa; max-width: 220px; margin-top: 6px; }
.itinerary, .booking, .reviews { padding: 14px 16px; margin-top: 12px; }
.it-row { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-bottom: 1px dashed var(--line-soft); font-size: 13px; }
.day { background: var(--amber-bg); color: var(--amber-text); }
.desc { color: var(--text-3); font-size: 12px; }
.std { font-size: 12px; color: var(--text-3); margin-top: 8px; }
.dates { display: flex; gap: 8px; margin: 10px 0; }
.date-cell { border: 1px solid var(--line); border-radius: 8px; text-align: center; padding: 6px 14px; cursor: pointer; font-size: 12px; }
.date-cell span { color: var(--orange-500); display: block; }
.date-cell.tight { border-color: var(--orange-500); }
.date-cell.soldout { color: #bbb; border-style: dashed; cursor: not-allowed; }
.date-cell.soldout span { color: #bbb; }
.date-cell.picked { border-color: var(--green-600); background: var(--ok-bg); }
.people { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.people button { width: 24px; height: 24px; border-radius: 6px; border: 1px solid var(--line); background: #fff; }
.go { width: 100%; margin-top: 12px; }
.linked { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.empty { padding: 24px; text-align: center; color: var(--text-3); }
.rv { border-bottom: 1px dashed var(--line-soft); padding: 8px 0; font-size: 13px; }
.stars { color: var(--orange-500); margin-left: 8px; }
.rv p { margin: 4px 0 0; color: var(--text-2); }
</style>
