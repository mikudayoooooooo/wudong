<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { travelApi, type RouteDetail } from '../api/travel'
import Icon from '@/components/Icon.vue'
import { ROUTE_COVERS } from '../data/photos'

const router = useRouter()
const theme = ref('全部')
const themes = ['全部', '经典', '摄影', '亲子', '节庆']
const all = ref<RouteDetail[]>([])
const routes = computed(() => all.value.filter((r) => theme.value === '全部' || r.theme === theme.value))

onMounted(async () => {
  all.value = await travelApi.routeList()
})

function avgLit(r: RouteDetail): { lit: number; total: number } {
  const stops = r.stops || []
  return { lit: stops.filter((s) => s.lit).length, total: stops.length }
}
</script>

<template>
  <div class="container">
    <header class="page-head">
      <h1 class="font-display"><Icon name="map-pins" :size="20" /> 路线套餐</h1>
      <p class="page-sub">主题线路 · 含门票、食宿与向导</p>
    </header>
    <div class="filter-row">
      <span v-for="t in themes" :key="t" class="chip" :class="{ on: t === theme }" @click="theme = t">{{ t }}</span>
    </div>
    <div class="cards">
      <div v-for="r in routes" :key="r.id" class="card rc" @click="router.push(`/route/${r.id}`)">
        <div v-if="ROUTE_COVERS[r.id]" class="cover img-frame">
          <img :src="ROUTE_COVERS[r.id]" :alt="r.title" loading="lazy" />
          <span class="cover-tag">{{ r.days }}天 · {{ r.theme }}</span>
        </div>
        <div v-else class="ph cover ph-1">{{ r.days }}天 · {{ r.theme }}</div>
        <div class="body">
          <b>{{ r.title }}</b>
          <div class="meta">★ 好评 {{ r.notice.includes('24小时') ? '98%' : '96%' }} · 已售 {{ r.sales }}</div>
          <div class="badge-line">
            <span class="pill lit-badge"><Icon name="compass" :size="12" /> 平均点亮 {{ avgLit(r).lit }}/{{ avgLit(r).total }} 站</span>
          </div>
          <div class="price">¥{{ r.price }} <span>起</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; padding-bottom: 44px; }
.card:hover { border-color: var(--ind-300); }
.cover { aspect-ratio: 16 / 10; border-radius: 0; font-size: 13px; font-weight: 700; }
.cover-tag { position: absolute; left: 10px; bottom: 8px; z-index: 1; color: var(--paper); }
.body { padding: 10px 12px; }
.body b { font-size: 15px; }
.meta { font-size: 11px; color: var(--text-3); margin: 4px 0; }
.lit-badge { background: var(--cinnabar-100); color: var(--cinnabar-700); }
.price { color: var(--cinnabar); font-family: var(--font-display); font-size: 18px; font-weight: 700; }
.price span { font-size: 11px; font-weight: 400; }
@media (max-width: 900px) {
  .cards { grid-template-columns: 1fr; }
}
</style>
