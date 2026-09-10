<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { communityApi } from '../api/community'
import { travelApi } from '../api/travel'
import { useSession } from '../stores/session'
import Waterfall from '../components/Waterfall.vue'
import RouteQuickView from '../components/RouteQuickView.vue'

const router = useRouter()
const session = useSession()
const tab = ref<'recommend' | 'latest' | 'follow'>('recommend')
const topics = ref<any[]>([])
const posts = ref<any[]>([])
const routeTitleMap = ref(new Map<number, string>())
const quickRouteId = ref<number | null>(null)
const filteredRoute = ref<number | null>(null)

async function load() {
  const [feed, topicList, routes] = await Promise.all([
    communityApi.feed(tab.value, 1, 30, filteredRoute.value ?? undefined),
    communityApi.topicList(),
    travelApi.routeList(),
  ])
  posts.value = feed.list.map((p) => ({
    ...p,
    routeTitle: p.linkedRouteId ? routes.find((r) => r.id === p.linkedRouteId)?.title : undefined,
  }))
  topics.value = topicList
  routeTitleMap.value = new Map(routes.map((r) => [r.id, r.title]))
}

onMounted(load)

async function onTab(t: 'recommend' | 'latest' | 'follow') {
  if (t === 'follow' && !session.isLogged) {
    alert('关注流需要登录（右上角登录）')
    return
  }
  tab.value = t
  filteredRoute.value = null
  await load()
}

const shown = computed(() => posts.value)

function onTag(rid: number): void {
  quickRouteId.value = rid
}
async function onViewPosts(rid: number): Promise<void> {
  filteredRoute.value = rid
  quickRouteId.value = null
  await load()
}
function onBook(rid: number): void {
  router.push(`/route/${rid}`)
}
async function clearFilter(): Promise<void> {
  filteredRoute.value = null
  await load()
}
</script>

<template>
  <div class="container page">
    <div class="main">
      <div class="tabs">
        <span class="pill tab" :class="{ on: tab === 'recommend' }" @click="onTab('recommend')">推荐</span>
        <span class="pill tab" :class="{ on: tab === 'latest' }" @click="onTab('latest')">最新</span>
        <span class="pill tab" :class="{ on: tab === 'follow' }" @click="onTab('follow')">关注</span>
        <span class="sep" />
        <span
          v-for="t in topics" :key="t.id" class="pill topic" :class="{ on: filteredRoute !== null && t.bindRouteIds.includes(filteredRoute) }"
          @click="router.push(`/topic/${t.id}`)"
        >{{ t.name }}</span>
      </div>
      <div v-if="filteredRoute" class="filter-bar">
        正在看路线相关游记 <a @click="clearFilter">清除过滤 ✕</a>
      </div>
      <Waterfall :posts="shown" @open="(id) => router.push(`/post/${id}`)" @tag="onTag" />
      <div v-if="!shown.length" class="empty card">暂无内容</div>
    </div>
    <RouteQuickView
      :route-id="quickRouteId"
      class="quick"
      @close="quickRouteId = null"
      @view-posts="onViewPosts"
      @book="onBook"
    />
  </div>
</template>

<style scoped>
.page { display: flex; gap: 16px; margin-top: 16px; }
.main { flex: 1; }
.tabs { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; flex-wrap: wrap; }
.tab { background: #f2f2f2; cursor: pointer; }
.tab.on { background: var(--green-600); color: #fff; }
.sep { flex: 1; }
.topic { background: var(--paper); border: 1px solid var(--line-soft); cursor: pointer; }
.filter-bar { background: var(--amber-bg); color: var(--amber-text); border-radius: 8px; padding: 6px 12px; font-size: 12px; margin-bottom: 10px; }
.filter-bar a { cursor: pointer; margin-left: 8px; }
.quick { position: sticky; top: 64px; align-self: flex-start; }
.empty { padding: 30px; text-align: center; color: var(--text-3); }
</style>
