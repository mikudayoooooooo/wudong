<script setup lang="ts">
import { computed } from 'vue'
import { getRoute, getPosts } from '../data/mock'
import { routeStopsView } from '../lib/footprint'
import FootprintMap from './FootprintMap.vue'

const props = defineProps<{ routeId: number | null }>()
const emit = defineEmits<{ close: []; viewPosts: [routeId: number]; book: [routeId: number] }>()

const route = computed(() => (props.routeId === null ? undefined : getRoute(props.routeId)))
const stops = computed(() => (props.routeId === null ? [] : routeStopsView(props.routeId)))
const relatedCount = computed(
  () => getPosts().filter((p) => p.linkedRouteId === props.routeId).length,
)
</script>

<template>
  <aside v-if="route" class="drawer card">
    <i class="close" @click="emit('close')">✕</i>
    <header class="head">
      <b class="title">{{ route.title }}</b>
      <div class="meta">{{ route.days }}天{{ route.days > 1 ? '1晚' : '' }} · ¥{{ route.price }}起 · 已售 {{ route.sales }}</div>
    </header>
    <FootprintMap :stops="stops" variant="mini" />
    <div class="foot">
      <div>📷 相关游记 <b>{{ relatedCount }}</b> 篇</div>
      <div class="btns">
        <button class="ghost" @click="emit('viewPosts', route.id)">看全部游记</button>
        <button class="btn-primary" @click="emit('book', route.id)">预订</button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.drawer { width: 300px; position: relative; box-shadow: var(--shadow); }
.close { position: absolute; top: 8px; right: 10px; background: none; color: #fff; font-size: 14px; z-index: 1; cursor: pointer; }
.head { background: linear-gradient(110deg, var(--green-900), var(--green-600)); color: #fff; padding: 12px 14px; }
.title { font-size: 15px; }
.meta { font-size: 11px; opacity: .9; margin-top: 2px; }
.foot { padding: 10px 12px; font-size: 12px; color: var(--text-2); }
.btns { display: flex; gap: 8px; margin-top: 8px; }
.btns button { flex: 1; border-radius: 8px; padding: 7px 0; font-weight: 700; }
.ghost { border: 1px solid var(--orange-500); color: var(--orange-700); background: #fff; }
</style>
