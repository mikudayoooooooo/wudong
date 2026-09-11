<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { communityApi } from '../api/community'
import { travelApi } from '../api/travel'
import Waterfall from '../components/Waterfall.vue'
import Icon from '../components/Icon.vue'

const routeParam = useRoute()
const router = useRouter()
const topic = ref<any>(null)
const routeTitleMap = ref(new Map<number, string>())
const routeTitle = (id: number) => routeTitleMap.value.get(id) || '路线'

watch(
  () => Number(routeParam.params.id),
  async (id) => {
    topic.value = await communityApi.topicDetail(id)
  },
  { immediate: true }
)
travelApi.routeList().then((rs) => {
  routeTitleMap.value = new Map(rs.map((r) => [r.id, r.title]))
})

const posts = computed(() =>
  (topic.value?.posts || []).map((p: any) => ({
    ...p,
    routeTitle: p.linkedRouteId ? routeTitleMap.value.get(p.linkedRouteId) : undefined,
  }))
)
const routes = computed(() =>
  (topic.value?.bindRouteIds || []).map((id: number) => ({ id }))
)
</script>

<template>
  <div v-if="topic" class="container page">
    <header class="page-head">
      <h1 class="font-display">{{ topic.name }}</h1>
      <p class="page-sub">{{ topic.intro }} · {{ topic.viewCount.toLocaleString() }} 浏览</p>
    </header>
    <div v-if="routes.length" class="bind">
      <span class="label">本话题相关路线：</span>
      <a v-for="r in routes" :key="r.id" class="pill rc" @click="router.push(`/route/${r.id}`)">
        <Icon name="map-pin" :size="12" /> {{ routeTitle(r.id) }} · 去订 ›
      </a>
    </div>
    <Waterfall :posts="posts" @open="(id) => router.push(`/post/${id}`)" @tag="(rid) => router.push(`/route/${rid}`)" />
  </div>
</template>

<style scoped>
.page { margin-top: 16px; }
.bind { margin: 14px 0; font-size: 12px; }
.rc { background: var(--cinnabar-100); color: var(--cinnabar-700); cursor: pointer; margin-right: 8px; }
</style>
