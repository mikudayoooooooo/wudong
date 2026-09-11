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
    <h2><Icon name="map-pins" :size="16" /> 景区与地点</h2>
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
h2 { margin: 18px 0 10px; }
.cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.sc { display: flex; gap: 12px; padding: 14px; cursor: pointer; }
.icon { font-size: 34px; }
.kind { background: var(--ok-bg); color: var(--ok-text); font-size: 11px; }
.addr { font-size: 12px; color: var(--text-3); margin: 4px 0; }
.foot { display: flex; gap: 10px; font-size: 12px; }
.hot { color: var(--amber-text); font-weight: 700; }
.price { color: var(--orange-700); font-weight: 700; }
</style>
