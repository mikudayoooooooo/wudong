<script setup lang="ts">
import { computed } from 'vue'
import MiniChain from './MiniChain.vue'
import { postPhoto } from '../data/photos'
import Icon from './Icon.vue'

/** post：后端 feed/detail 行（含 author、footprintLit/footprintTotal、routeTitle 可选） */
const props = defineProps<{ post: any }>()
const emit = defineEmits<{ open: [postId: number]; tag: [routeId: number] }>()

const author = computed(() => props.post.author || { avatar: '👤', nickname: '已注销' })
const chain = computed(() => {
  const lit = Number(props.post.footprintLit ?? 0)
  const total = Number(props.post.footprintTotal ?? 0)
  if (!total) return null
  return { lit, total }
})
// 封面：优先本地实景图（images[0] 索引池），视频帖/缺索引用纹样占位
const cover = computed(() => (props.post.video ? undefined : postPhoto(props.post.images?.[0])))
const videoCls = computed(() => (props.post.video ? 'ph-4' : `ph-${props.post.images?.[0] ?? 0}`))
</script>

<template>
  <div class="card post-card" @click="emit('open', post.id)">
    <div v-if="cover" class="cover img-frame">
      <img :src="cover" :alt="post.title" loading="lazy" />
    </div>
    <div v-else class="ph cover" :class="videoCls">
      <span v-if="post.video" class="video-mark">▶ 视频</span>
    </div>
    <div class="body">
      <b class="title">{{ post.title }}</b>
      <div class="row2">
        <a v-if="post.linkedRouteId" class="pill tag" @click.stop="emit('tag', post.linkedRouteId)"><Icon name="map-pin" :size="12" /> {{ post.routeTitle || '关联路线' }} ›</a>
        <MiniChain v-if="chain" :lit="chain.lit" :total="chain.total" />
      </div>
      <div class="meta">
        <span>{{ author.avatar }} {{ author.nickname }}</span>
        <span class="nums"><Icon name="heart" :size="12" /> {{ post.likeCount }} · <Icon name="message-circle" :size="12" /> {{ post.commentCount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-card { cursor: pointer; break-inside: avoid; margin-bottom: 12px; }
.cover { height: 150px; border-radius: 0; position: relative; }
.video-mark { position: absolute; top: 8px; right: 8px; background: rgba(11, 29, 44, .55); border-radius: 10px; padding: 1px 8px; font-size: 11px; }
.body { padding: 8px 10px; }
.title { font-size: 13px; }
.row2 { display: flex; align-items: center; gap: 8px; margin: 6px 0; flex-wrap: wrap; }
.tag { background: var(--amber-bg); color: var(--amber-text); cursor: pointer; }
.meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-3); }
</style>
