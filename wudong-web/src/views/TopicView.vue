<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTopic, getRoute, getPosts } from '../data/mock'
import Waterfall from '../components/Waterfall.vue'

const routeParam = useRoute()
const router = useRouter()
const topic = computed(() => getTopic(Number(routeParam.params.id)))
const posts = computed(() => getPosts().filter((p) => p.topicIds.includes(topic.value?.id ?? -1)))
const routes = computed(() => (topic.value?.bindRouteIds ?? []).map((id) => getRoute(id)).filter(Boolean))
</script>

<template>
  <div v-if="topic" class="container page">
    <section class="card head">
      <b class="name">{{ topic.name }}</b>
      <span class="intro">{{ topic.intro }} · {{ topic.viewCount.toLocaleString() }} 浏览</span>
      <div v-if="routes.length" class="bind">
        <span class="label">本话题相关路线：</span>
        <a v-for="r in routes" :key="r!.id" class="pill rc" @click="router.push(`/route/${r!.id}`)">
          🗺 {{ r!.title }} · 去订 ›
        </a>
      </div>
    </section>
    <Waterfall :posts="posts" @open="(id) => router.push(`/post/${id}`)" @tag="(rid) => router.push(`/route/${rid}`)" />
  </div>
</template>

<style scoped>
.page { margin-top: 16px; }
.head { padding: 16px 18px; margin-bottom: 14px; }
.name { font-size: 18px; }
.intro { margin-left: 10px; font-size: 12px; color: var(--text-3); }
.bind { margin-top: 10px; font-size: 12px; }
.rc { background: var(--amber-bg); color: var(--amber-text); cursor: pointer; margin-right: 8px; }
</style>
