<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { travelApi } from '../api/travel'
import Icon from '../components/Icon.vue'

const router = useRouter()
const KIND: Record<string, string> = { spot: '景区', dining: '餐饮', stay: '住宿', experience: '体验' }
const spots = ref<any[]>([])

onMounted(async () => {
  spots.value = await travelApi.scenicList()
})
</script>

<template>
  <div class="container">
    <header class="page-head">
      <h1 class="font-display"><Icon name="map-pins" :size="20" /> 景区与地点</h1>
      <p class="page-sub">乌东村及周边景点 · 点击查看详情</p>
    </header>
    <div class="cards">
      <div v-for="s in spots" :key="s.id" class="card sc" @click="router.push(`/scenic/${s.id}`)">
        <span class="icon"><Icon name="map-pin" :size="16" /></span>
        <div class="info">
          <b>{{ s.name }} <i class="pill kind">{{ KIND[s.type] }}</i></b>
          <div class="addr">{{ s.address }} · {{ s.openTime }}</div>
          <div class="foot">
            <span v-if="s.intro" class="hot">{{ s.intro }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 16px; padding-bottom: 44px; }
.sc { display: flex; gap: 12px; padding: 14px; cursor: pointer; }
.sc:hover { border-color: var(--ind-300); }
.icon { display: grid; place-items: center; width: 36px; height: 36px; border: 1px solid var(--line); border-radius: var(--radius); color: var(--ind-700); flex-shrink: 0; }
.kind { background: var(--ok-bg); color: var(--ok-text); font-size: 11px; }
.addr { font-size: 12px; color: var(--text-3); margin: 4px 0; }
.foot { display: flex; gap: 10px; font-size: 12px; }
.hot { color: var(--cinnabar-700); font-weight: 700; }
@media (max-width: 900px) {
  .cards { grid-template-columns: 1fr; }
}
</style>
