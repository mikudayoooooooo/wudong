<script setup lang="ts">
import { ref, watch } from 'vue'
import { travelApi } from '../api/travel'
import { communityApi } from '../api/community'
import FootprintMap from './FootprintMap.vue'
import Icon from './Icon.vue'

const props = defineProps<{ routeId: number | null }>()
const emit = defineEmits<{ close: []; viewPosts: [routeId: number]; book: [routeId: number] }>()

const route = ref<any>(null)
const relatedCount = ref(0)

watch(
  () => props.routeId,
  async (id) => {
    route.value = null
    if (id === null) return
    route.value = await travelApi.routeDetail(id)
    const feed = await communityApi.feed('latest', 1, 50, id)
    relatedCount.value = feed.total
  },
  { immediate: true }
)
</script>

<template>
  <aside v-if="route" class="drawer card">
    <i class="close" @click="emit('close')"><Icon name="x" :size="14" /></i>
    <header class="head">
      <b class="title">{{ route.title }}</b>
      <div class="meta">{{ route.days }}天{{ route.days > 1 ? '1晚' : '' }} · ¥{{ route.price }}起 · 已售 {{ route.sales }}</div>
    </header>
    <FootprintMap :stops="route.stops || []" variant="mini" />
    <div class="foot">
      <div><Icon name="photo" :size="13" /> 相关游记 <b>{{ relatedCount }}</b> 篇</div>
      <div class="btns">
        <button class="ghost" @click="emit('viewPosts', route.id)">看全部游记</button>
        <button class="btn-primary" @click="emit('book', route.id)">预订</button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.drawer { width: 300px; position: relative; border: 1px solid var(--line); }
.close { position: absolute; top: 8px; right: 10px; background: none; color: #fff; font-size: 14px; z-index: 1; cursor: pointer; }
.head { background: var(--ind-800); color: #fff; padding: 12px 14px; }
.title { font-size: 15px; }
.meta { font-size: 11px; opacity: .9; margin-top: 2px; }
.foot { padding: 10px 12px; font-size: 12px; color: var(--text-2); }
.btns { display: flex; gap: 8px; margin-top: 8px; }
.btns button { flex: 1; border-radius: 8px; padding: 7px 0; font-weight: 700; }
.ghost { border: 1px solid var(--orange-500); color: var(--orange-700); background: #fff; }
</style>
