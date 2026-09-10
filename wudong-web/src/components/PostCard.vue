<script setup lang="ts">
import { computed } from 'vue'
import MiniChain from './MiniChain.vue'

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
const videoCls = computed(() => (props.post.video ? 'ph-4' : `ph-${props.post.images?.[0] ?? 0}`))
</script>

<template>
  <div class="card post-card" @click="emit('open', post.id)">
    <div class="ph cover" :class="videoCls">
      <span v-if="post.video" class="video-mark">▶ 视频</span>
    </div>
    <div class="body">
      <b class="title">{{ post.title }}</b>
      <div class="row2">
        <a v-if="post.linkedRouteId" class="pill tag" @click.stop="emit('tag', post.linkedRouteId)">🗺 {{ post.routeTitle || '关联路线' }} ›</a>
        <MiniChain v-if="chain" :lit="chain.lit" :total="chain.total" />
      </div>
      <div class="meta">
        <span>{{ author.avatar }} {{ author.nickname }}</span>
        <span class="nums">👍 {{ post.likeCount }} · 💬 {{ post.commentCount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-card { cursor: pointer; break-inside: avoid; margin-bottom: 12px; }
.cover { height: 150px; border-radius: 0; position: relative; }
.video-mark { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,.45); border-radius: 10px; padding: 1px 8px; font-size: 11px; }
.body { padding: 8px 10px; }
.title { font-size: 13px; }
.row2 { display: flex; align-items: center; gap: 8px; margin: 6px 0; flex-wrap: wrap; }
.tag { background: var(--amber-bg); color: var(--amber-text); cursor: pointer; }
.meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-3); }
</style>
