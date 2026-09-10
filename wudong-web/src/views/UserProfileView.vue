<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { communityApi } from '../api/community'
import { travelApi, type StopView } from '../api/travel'
import FootprintMap from '../components/FootprintMap.vue'
import Waterfall from '../components/Waterfall.vue'

const routeParam = useRoute()
const router = useRouter()
const userId = computed(() => Number(routeParam.params.id))
const profile = ref<any>(null)
const routeTitleMap = ref(new Map<number, string>())

watch(
  userId,
  async (id) => {
    profile.value = await communityApi.userProfile(id)
  },
  { immediate: true }
)
travelApi.routeList().then((rs) => {
  routeTitleMap.value = new Map(rs.map((r) => [r.id, r.title]))
})

const posts = computed(() =>
  (profile.value?.posts || []).map((p: any) => ({
    ...p,
    author: { id: profile.value.id, nickname: profile.value.nickname, avatar: profile.value.avatar },
    routeTitle: p.linkedRouteId ? routeTitleMap.value.get(p.linkedRouteId) : undefined,
  }))
)
const totalLikes = computed(() => profile.value?.likeCount ?? 0)
const badge = computed(() => profile.value?.badge || '初来乍到')
const litCount = computed(() => profile.value?.litCount ?? 0)
const archiveStops = computed<StopView[]>(() =>
  (profile.value?.litSpotIds || []).map((id: number) => ({
    spotId: id, lit: true, locked: false,
  }))
)
</script>

<template>
  <div v-if="profile" class="container page">
    <section class="card head">
      <span class="avatar">{{ profile.avatar }}</span>
      <div class="who">
        <b>@{{ profile.nickname }}</b>
        <div class="bio">{{ profile.bio }}</div>
        <div class="stats">游记 {{ profile.postCount }} 篇 · 获赞 {{ totalLikes }}</div>
      </div>
      <span class="pill badge-chip">🏅 {{ badge }} · 点亮 {{ litCount }}/6 站</span>
    </section>

    <FootprintMap :stops="archiveStops" variant="overview" title="🧭 TA 的乌东足迹档案" @select="(id) => router.push(`/scenic/${id}`)" />

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
