<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { communityApi } from '../api/community'
import { travelApi, type StopView } from '../api/travel'
import FootprintMap from '../components/FootprintMap.vue'
import Waterfall from '../components/Waterfall.vue'
import Icon from '../components/Icon.vue'
import avatarShan from '../assets/avatar/avatar-shan.svg'
import avatarShui from '../assets/avatar/avatar-shui.svg'
import avatarMiao from '../assets/avatar/avatar-miao.svg'
import avatarXiu from '../assets/avatar/avatar-xiu.svg'
import avatarYin from '../assets/avatar/avatar-yin.svg'
import avatarA from '../assets/avatar/avatar-a.svg'

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
/* 首字头像（规范 §3.4）：昵称首字匹配本地 SVG，未命中按字符码散列取一，无远程图 */
const AVATAR_MAP: Record<string, string> = { 山: avatarShan, 水: avatarShui, 苗: avatarMiao, 绣: avatarXiu, 银: avatarYin, 阿: avatarA }
const avatarSvg = computed(() => {
  const name = profile.value?.nickname || ''
  if (!name) return avatarShan
  return AVATAR_MAP[name.charAt(0)] || Object.values(AVATAR_MAP)[name.charCodeAt(0) % 6]
})
</script>

<template>
  <div v-if="profile" class="container page">
    <section class="card head">
      <img class="avatar-img" :src="avatarSvg" :alt="profile.nickname" />
      <div class="who">
        <b>@{{ profile.nickname }}</b>
        <div class="bio">{{ profile.bio }}</div>
        <div class="stats">游记 {{ profile.postCount }} 篇 · 获赞 {{ totalLikes }}</div>
      </div>
      <span class="pill badge-chip"><Icon name="sparkles" :size="12" /> {{ badge }} · 点亮 {{ litCount }}/6 站</span>
    </section>

    <FootprintMap :stops="archiveStops" variant="overview" title="TA 的乌东足迹档案" @select="(id) => router.push(`/scenic/${id}`)" />

    <Waterfall class="feed" :posts="posts" @open="(id) => router.push(`/post/${id}`)" @tag="(rid) => router.push(`/route/${rid}`)" />
  </div>
</template>

<style scoped>
.page { margin-top: 16px; }
.head { display: flex; gap: 14px; align-items: center; padding: 16px 18px; margin-bottom: 14px; }
.avatar-img { width: 56px; height: 56px; border-radius: var(--radius); flex-shrink: 0; }
.bio { font-size: 12px; color: var(--text-3); }
.stats { font-size: 12px; color: var(--text-2); margin-top: 4px; }
.badge-chip { background: var(--cinnabar-100); color: var(--cinnabar-700); }
.feed { margin-top: 14px; }
</style>
