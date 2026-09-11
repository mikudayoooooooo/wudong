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
    <h2 class="font-display"><Icon name="map-pins" :size="20" /> 路线套餐</h2>
    <div class="tabs">
      <span v-for="t in themes" :key="t" class="pill tab" :class="{ on: t === theme }" @click="theme = t">{{ t }}</span>
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
          <div class="meta">⭐ 好评 {{ r.notice.includes('24小时') ? '98%' : '96%' }} · 已售 {{ r.sales }}</div>
          <div class="badge-line">
            <span class="pill lit-badge">🧭 平均点亮 {{ avgLit(r).lit }}/{{ avgLit(r).total }} 站</span>
          </div>
          <div class="price">¥{{ r.price }} <span>起</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 { margin: 18px 0 10px; }
.tabs { display: flex; gap: 8px; margin-bottom: 14px; }
.tab { background: var(--ind-50); cursor: pointer; }
.tab.on { background: var(--green-600); color: #fff; }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.cover { height: 150px; border-radius: 0; font-size: 13px; font-weight: 700; }
.cover-tag { position: absolute; left: 10px; bottom: 8px; z-index: 1; color: var(--paper); }
.body { padding: 10px 12px; }
.meta { font-size: 11px; color: var(--text-3); margin: 4px 0; }
.lit-badge { background: var(--amber-bg); color: var(--amber-text); }
.price { color: var(--orange-700); font-size: 18px; font-weight: 800; }
.price span { font-size: 11px; font-weight: 400; }
</style>
