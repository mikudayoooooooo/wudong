<script setup lang="ts">
import { computed } from 'vue'
import type { FootprintStopView } from '../types'

const props = withDefaults(
  defineProps<{ stops: FootprintStopView[]; variant: 'chain' | 'overview' | 'mini'; title?: string; showCounts?: boolean }>(),
  { showCounts: undefined }, // undefined → chain/overview 显示，mini 不显示
)

const emit = defineEmits<{ select: [spotId: number] }>()

const showCount = computed(() => props.showCounts ?? props.variant !== 'mini')

// 站点均匀布点，链路蜿蜒：奇偶站上下交错，overview 振幅更大
const points = computed(() => {
  const n = props.stops.length
  const w = props.variant === 'mini' ? 320 : props.variant === 'overview' ? 880 : 640
  const h = props.variant === 'mini' ? 110 : props.variant === 'overview' ? 220 : 150
  const padX = 40
  const amp = props.variant === 'overview' ? h * 0.32 : h * 0.2
  return props.stops.map((_, i) => ({
    x: n === 1 ? w / 2 : padX + (i * (w - padX * 2)) / (n - 1),
    y: h / 2 + (i % 2 === 0 ? -amp : amp),
    w, h,
  }))
})

const viewBox = computed(() => {
  const first = points.value[0]
  return `0 0 ${first?.w ?? 640} ${first?.h ?? 150}`
})

const pathD = computed(() => {
  const pts = points.value
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]; const cur = pts[i]
    const cx = (prev.x + cur.x) / 2
    d += ` C ${cx} ${prev.y}, ${cx} ${cur.y}, ${cur.x} ${cur.y}`
  }
  return d
})

function segmentClass(i: number): string {
  return props.stops[i]?.lit && props.stops[i + 1]?.lit ? 'seg lit' : 'seg locked'
}
</script>

<template>
  <div class="fp-map" :class="variant">
    <div v-if="title" class="fp-title">{{ title }}</div>
    <svg :viewBox="viewBox" class="fp-svg">
      <!-- 连线：逐段描色 -->
      <path :d="pathD" fill="none" stroke="transparent" stroke-width="3" />
      <template v-for="(p, i) in points.slice(0, -1)" :key="'seg' + i">
        <path
          class="seg-path" :class="segmentClass(i)"
          :d="`M ${p.x} ${p.y} C ${(p.x + points[i + 1].x) / 2} ${p.y}, ${(p.x + points[i + 1].x) / 2} ${points[i + 1].y}, ${points[i + 1].x} ${points[i + 1].y}`"
        />
      </template>
      <!-- 站点 -->
      <g
        v-for="(s, i) in stops" :key="s.spotId" class="stop" :class="s.lit ? 'lit' : 'locked'"
        :transform="`translate(${points[i].x},${points[i].y})`" @click="emit('select', s.spotId)"
      >
        <circle :r="variant === 'overview' ? 15 : 11" class="node" />
        <text class="icon" y="4" text-anchor="middle">{{ s.lit ? s.icon : '🔒' }}</text>
        <text class="label" :y="variant === 'overview' ? 32 : 26" text-anchor="middle">{{ s.name }}</text>
        <text v-if="showCount && s.lit && s.lightCount" class="count" :y="variant === 'overview' ? -22 : -18" text-anchor="middle">
          {{ s.lightCount }}人点亮
        </text>
        <text v-if="s.memo" class="memo" :y="-18" text-anchor="middle">{{ s.memo }}</text>
      </g>
    </svg>
    <div v-if="variant !== 'mini'" class="legend">
      <span>🟠 点亮 = 有核销记录</span><span class="muted">🔒 灰段 = 行程中未解锁站点</span>
    </div>
  </div>
</template>

<style scoped>
.fp-map { background: linear-gradient(160deg, var(--map-a), var(--map-b)); border-radius: var(--radius); position: relative; }
.fp-title { position: absolute; top: 8px; left: 12px; font-size: 12px; font-weight: 700; color: var(--amber-text); }
.fp-svg { width: 100%; display: block; }
.seg-path { fill: none; stroke-width: 3; stroke-dasharray: 7 5; }
.seg-path.lit { stroke: var(--orange-500); }
.seg-path.locked { stroke: #c9c9c9; stroke-dasharray: 4 5; }
.stop { cursor: pointer; }
.node { fill: #fff; stroke: #bbb; stroke-width: 2; stroke-dasharray: 3 2; }
.stop.lit .node { fill: var(--orange-500); stroke: var(--orange-300); filter: drop-shadow(0 0 5px rgba(232,150,62,.55)); }
.icon { font-size: 12px; }
.label { font-size: 10px; fill: var(--text-2); }
.stop.locked .label { fill: #aaa; }
.count { font-size: 9px; font-weight: 700; fill: var(--amber-text); }
.memo { font-size: 9px; fill: #888; }
.legend { display: flex; gap: 12px; font-size: 11px; color: var(--text-2); padding: 0 12px 8px; }
.legend .muted { color: var(--text-3); }
</style>
