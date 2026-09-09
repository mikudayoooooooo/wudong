<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getAllSpots, getTicketTypes } from '../data/mock'
import { spotLightCounts } from '../lib/footprint'

const router = useRouter()
const KIND: Record<string, string> = { spot: '景区', dining: '餐饮', stay: '住宿', experience: '体验' }
</script>

<template>
  <div class="container">
    <h2>🎫 景区与地点</h2>
    <div class="cards">
      <div v-for="s in getAllSpots()" :key="s.id" class="card sc" @click="router.push(`/scenic/${s.id}`)">
        <span class="icon">{{ s.icon }}</span>
        <div class="info">
          <b>{{ s.name }} <i class="pill kind">{{ KIND[s.type] }}</i></b>
          <div class="addr">{{ s.address }} · {{ s.openTime }}</div>
          <div class="foot">
            <span class="hot" v-if="spotLightCounts(s.id) > 0">🔥 本周点亮 {{ spotLightCounts(s.id) }}</span>
            <span v-if="getTicketTypes(s.id).length" class="price">¥{{ Math.min(...getTicketTypes(s.id).map((t) => t.price)) }}起</span>
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
