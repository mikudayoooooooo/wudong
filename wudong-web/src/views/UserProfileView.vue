<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUser, getPosts, getAllSpots } from '../data/mock'
import { userLitSpotIds } from '../lib/footprint'
import FootprintMap from '../components/FootprintMap.vue'
import Waterfall from '../components/Waterfall.vue'

const routeParam = useRoute()
const router = useRouter()
const userId = computed(() => Number(routeParam.params.id))
const user = computed(() => getUser(userId.value))
const posts = computed(() => getPosts().filter((p) => p.userId === userId.value))
const totalLikes = computed(() => posts.value.reduce((s, p) => s + p.likeCount, 0))
const litIds = computed(() => userLitSpotIds(userId.value))
const archiveStops = computed(() =>
  getAllSpots().filter((s) => litIds.value.has(s.id)).map((s) => ({
    spotId: s.id, name: s.name, icon: s.icon, lit: true, locked: false,
  })),
)
const badge = computed(() => (litIds.value.size >= 4 ? '🏅 足迹达人' : '🌱 初来乍到'))
</script>

<template>
  <div v-if="user" class="container page">
    <section class="card head">
      <span class="avatar">{{ user.avatar }}</span>
      <div class="who">
        <b>@{{ user.nickname }}</b>
        <div class="bio">{{ user.bio }}</div>
        <div class="stats">游记 {{ posts.length }} 篇 · 获赞 {{ totalLikes }}</div>
      </div>
      <span class="pill badge-chip">{{ badge }} · 点亮 {{ litIds.size }}/6 站</span>
    </section>

    <FootprintMap :stops="archiveStops" variant="overview" :title="`🧭 TA 的乌东足迹档案`" @select="(id) => router.push(`/scenic/${id}`)" />

    <Waterfall class="feed" :posts="posts" @open="(id) => router.push(`/post/${id}`)" @tag="(rid) => router.push(`/route/${rid}`)" />
  </div>
</template>

<style scoped>
.page { margin-top: 16px; }
.head { display: flex; gap: 14px; align-items: center; padding: 16px 18px; margin-bottom: 14px; }
.avatar { font-size: 40px; }
.bio { font-size: 12px; color: var(--text-3); }
.stats { font-size: 12px; color: var(--text-2); margin-top: 4px; }
.badge-chip { background: var(--amber-bg); color: var(--amber-text); }
.feed { margin-top: 14px; }
</style>
