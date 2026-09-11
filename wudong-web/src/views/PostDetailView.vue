<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute as useRouteParam, useRouter } from 'vue-router'
import { communityApi } from '../api/community'
import { travelApi } from '../api/travel'
import FootprintMap from '../components/FootprintMap.vue'
import RouteQuickView from '../components/RouteQuickView.vue'
import { postPhoto } from '../data/photos'
import Icon from '../components/Icon.vue'

const routeParam = useRouteParam()
const router = useRouter()
const postId = computed(() => Number(routeParam.params.id))
const post = ref<any>(null)

watch(
  postId,
  async (id) => {
    post.value = null
    if (!id) return
    post.value = await communityApi.postDetail(id)
    if (post.value?.linkedRouteId) {
      const r = await travelApi.routeDetail(post.value.linkedRouteId)
      post.value.routeTitle = r?.title
      post.value.routePrice = r?.price
    }
  },
  { immediate: true }
)

const author = computed(() => post.value?.author)
const route = computed(() =>
  post.value?.linkedRouteId
    ? { id: post.value.linkedRouteId, title: post.value.routeTitle, price: post.value.routePrice }
    : undefined
)

const expanded = ref(false)
const quickRouteId = ref<number | null>(null)
const view = computed(() => post.value?.footprint || { mode: 'auto', stops: [] })
const litCount = computed(() => view.value.stops.filter((s: any) => s.lit).length)
const lockedCount = computed(() => view.value.stops.filter((s: any) => s.locked).length)

function onChip(spotId: number): void {
  // demo：chips 一律跳景区详情
  router.push(`/scenic/${spotId}`)
}
</script>

<template>
  <div v-if="post" class="container page">
    <article class="card main">
      <header class="head">
        <span class="avatar">{{ author?.avatar }}</span>
        <div>
          <b>{{ author?.nickname }}</b>
          <div class="date">{{ post.createTime.slice(0, 10) }} · 乌东村</div>
        </div>
      </header>
      <h1>{{ post.title }}</h1>
      <div class="imgs">
        <template v-for="(img, i) in post.images" :key="i">
          <div v-if="postPhoto(img)" class="img-frame post-img"><img :src="postPhoto(img)" :alt="post.title" loading="lazy" /></div>
          <div v-else class="ph" :class="`ph-${img}`" />
        </template>
      </div>
      <p class="content">{{ post.content }}</p>
      <div class="topics">
        <span v-for="t in post.topics" :key="t.id" class="pill topic-chip" @click="router.push(`/topic/${t.id}`)">
          {{ t.name }}
        </span>
      </div>
      <div class="actions">
        <span><Icon name="heart" :size="13" /> {{ post.likeCount }}</span><span><Icon name="message-circle" :size="13" /> {{ post.commentCount }}</span>
        <span><Icon name="star-filled" :size="13" /> {{ post.favoriteCount }}</span><span class="spacer" /><span><Icon name="share" :size="13" /> 分享</span>
      </div>
    </article>

    <!-- 足迹区块：默认收起 -->
    <section v-if="view.stops.length" class="card foot-block">
      <div class="teaser" :class="view.mode" @click="expanded = !expanded">
        <template v-if="view.mode === 'route' && route">
          <b><Icon name="compass" :size="13" /> {{ route.title }} · 足迹 {{ litCount }}/{{ view.stops.length }} 站</b>
          <span class="pill trust">✓ 核销背书</span>
          <span v-if="lockedCount" class="locked-tip">还有 {{ lockedCount }} 站未解锁</span>
        </template>
        <template v-else>
          <b><Icon name="compass" :size="13" /> TA 最近去过 {{ view.stops.length }} 个地方</b>
          <span class="pill trust ok">✓ 来自核销记录</span>
        </template>
        <span class="spacer" />
        <span class="toggle">{{ expanded ? '收起 ▴' : view.mode === 'route' ? '展开地图 ▾' : '展开 ▾' }}</span>
      </div>

      <div v-if="expanded" class="footprint-body">
        <template v-if="view.mode === 'route'">
          <FootprintMap :stops="view.stops" variant="chain" :show-counts="false" @select="onChip" />
          <div v-if="route" class="cta">
            <span><Icon name="map-pin" :size="13" /> 关联路线</span>
            <a class="go-link" @click="router.push(`/route/${route.id}`)">¥{{ route.price }} 起 · 去走同款 ›</a>
          </div>
        </template>
        <template v-else>
          <div class="chips">
            <span v-for="s in view.stops" :key="s.spotId" class="chip" @click="onChip(s.spotId)">
              {{ s.icon }} {{ s.name }}
            </span>
          </div>
        </template>
      </div>
    </section>

    <RouteQuickView :route-id="quickRouteId" @close="quickRouteId = null" @book="(rid) => router.push(`/route/${rid}`)" @view-posts="() => {}" />
  </div>
</template>

<style scoped>
.page { max-width: 760px; margin-top: 16px; }
.main { padding: 16px 18px; }
.head { display: flex; gap: 10px; align-items: center; }
.avatar { font-size: 30px; }
.date { font-size: 11px; color: var(--text-3); }
h1 { font-size: 20px; margin: 12px 0; }
.imgs { display: flex; gap: 8px; }
.imgs .ph { flex: 1; height: 150px; border-radius: var(--radius); }
.imgs .post-img { flex: 1; height: 180px; border-radius: var(--radius); }
.content { font-size: 14px; color: var(--ink); line-height: 1.8; }
.topic-chip { color: var(--green-600); background: var(--ind-100); cursor: pointer; margin-right: 6px; }
.actions { display: flex; gap: 20px; padding: 10px 0 0; border-top: 1px solid var(--line-soft); color: var(--text-2); font-size: 13px; margin-top: 12px; }
.spacer { flex: 1; }
.foot-block { margin-top: 14px; overflow: hidden; }
.teaser { display: flex; align-items: center; gap: 8px; padding: 11px 14px; cursor: pointer; font-size: 12px; }
.teaser.auto { background: var(--ind-100); }
.teaser.route { background: var(--amber-bg); }
.trust { background: var(--ok-bg); color: var(--ok-text); }
.trust.ok { background: var(--ok-bg); }
.teaser.route .trust { background: #fff; }
.locked-tip { color: var(--amber-text); }
.toggle { color: var(--text-3); }
.footprint-body { padding: 0 14px 14px; }
.cta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-2); margin-top: 8px; }
.go-link { color: var(--orange-700); font-weight: 700; cursor: pointer; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { border: 1px solid var(--line); border-radius: 14px; padding: 4px 12px; font-size: 12px; cursor: pointer; background: #fff; }
.chip:hover { border-color: var(--orange-500); color: var(--amber-text); }
</style>
