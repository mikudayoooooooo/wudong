<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { travelApi } from '../api/travel'

const guides = ref<any[]>([])
const maxCost = ref(1)

onMounted(async () => {
  guides.value = await travelApi.guideList()
  maxCost.value = Math.max(...guides.value.map((g) => Number(g.cost)), 1)
})
</script>

<template>
  <div class="container">
    <h2 class="font-display"><Icon name="compass" :size="20" /> 交通攻略 · 怎么来乌东</h2>
    <div class="cards">
      <div v-for="g in guides" :key="g.id" class="card g">
        <b>{{ g.title }}</b>
        <div class="way">{{ g.transportType }} · {{ g.duration }}</div>
        <div class="bar"><div class="fill" :style="{ width: (g.cost / maxCost) * 100 + '%' }" /></div>
        <div class="cost">约 ¥{{ g.cost }}</div>
        <p>{{ g.detail }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 { margin: 18px 0 12px; }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 30px; }
.g { padding: 14px 16px; }
.way { font-size: 12px; color: var(--text-2); margin: 6px 0; }
.bar { height: 8px; background: var(--line); border-radius: 4px; margin: 8px 0 4px; }
.fill { height: 100%; border-radius: 4px; background: var(--ind-500); }
.cost { color: var(--orange-700); font-weight: 800; font-size: 15px; }
p { font-size: 12px; color: var(--text-2); }
</style>
