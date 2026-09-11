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
  const h = props.variant === 'mini' ? 110 : props.variant === 'overview' ? 260 : 150
  const padX = 56
  const amp = props.variant === 'overview' ? h * 0.26 : h * 0.2
  return props.stops.map((_, i) => ({
    x: n === 1 ? w / 2 : padX + (i * (w - padX * 2)) / (n - 1),
    y: h * 0.56 + (i % 2 === 0 ? -amp : amp),
    w, h,
  }))
})

const viewBox = computed(() => {
  const first = points.value[0]
  return `0 0 ${first?.w ?? 640} ${first?.h ?? 150}`
})

function segmentClass(i: number): string {
  return props.stops[i]?.lit && props.stops[i + 1]?.lit ? 'seg lit' : 'seg locked'
}
</script>

<template>
  <div class="fp-map" :class="variant">
    <div v-if="title" class="fp-title font-display">{{ title }}</div>
    <svg :viewBox="viewBox" class="fp-svg">
      <!-- 手绘风背景（仅 overview）：山脊线 / 梯田弧 / 河流 / 吊脚楼 -->
      <g v-if="variant === 'overview'" class="deco" aria-hidden="true">
        <path class="ridge" d="M-10 44 L70 18 L140 46 L210 24 L290 48 L360 22 L440 46 L520 20 L600 44 L680 26 L760 46 L830 24 L890 40" />
        <path class="ridge faint" d="M-10 62 L60 40 L150 64 L240 42 L330 62 L420 40 L510 62 L610 44 L700 62 L790 42 L890 58" />
        <g class="terrace">
          <path d="M84 196 a34 14 0 0 1 68 0" /><path d="M76 208 a42 20 0 0 1 84 0" /><path d="M68 220 a50 26 0 0 1 100 0" />
        </g>
        <path class="river" d="M-10 238 C120 226 220 248 340 238 C460 228 560 248 680 238 C760 232 830 242 890 236" />
        <path class="river faint" d="M-10 248 C140 240 260 254 400 246 C540 238 640 252 780 246 C830 244 860 248 890 246" />
        <g class="house" transform="translate(748,178)">
          <path d="M0 10 L12 0 L24 10 Z" /><path d="M3 10 v10 h18 v-10" /><path d="M5 20 v6 M19 20 v6 M9 20 v6 M15 20 v6" />
        </g>
      </g>
      <!-- 连线：逐段描色 -->
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
        <circle v-if="s.lit" :r="variant === 'overview' ? 21 : 16" class="halo" />
        <circle :r="variant === 'overview' ? 15 : 11" class="node" />
        <text class="icon" y="4" text-anchor="middle">{{ s.lit ? s.icon : '🔒' }}</text>
        <text class="label" :class="{ 'font-display': variant === 'overview' }" :y="variant === 'overview' ? 34 : 26" text-anchor="middle">{{ s.name }}</text>
        <text v-if="showCount && s.lit && s.lightCount" class="count" :y="variant === 'overview' ? -26 : -18" text-anchor="middle">
          {{ s.lightCount }}人点亮
        </text>
        <text v-if="s.memo" class="memo" :y="-18" text-anchor="middle">{{ s.memo }}</text>
      </g>
    </svg>
    <div v-if="variant !== 'mini'" class="legend">
      <span><i class="sw sw-lit" /> 点亮 = 有核销记录</span><span class="muted"><i class="sw sw-locked" /> 灰段 = 行程中未解锁站点</span>
    </div>
  </div>
</template>

<style scoped>
.fp-map { position: relative; background: var(--paper) url("../assets/pattern/meander-light.svg") center/720px repeat; border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; }
.fp-title { position: absolute; top: 10px; left: 14px; font-size: 13px; font-weight: 700; color: var(--ind-800); z-index: 1; }
.fp-svg { width: 100%; display: block; }

/* ── 手绘风装饰（靛蓝线稿，低存在感） ── */
.deco path { fill: none; stroke: var(--ind-300); stroke-width: 1.5; stroke-linecap: round; opacity: .55; }
.deco .ridge.faint, .deco .river.faint { opacity: .3; }
.deco .terrace path { opacity: .4; }
.deco .house path { stroke: var(--ind-500); stroke-width: 1.5; opacity: .6; }

/* ── 路径 ── */
.seg-path { fill: none; stroke-width: 2.5; stroke-dasharray: 7 5; stroke-linecap: round; }
.seg-path.lit { stroke: var(--cinnabar); }
.seg-path.locked { stroke: var(--ind-300); stroke-dasharray: 3 5; }

/* ── 站点 ── */
.stop { cursor: pointer; }
.node { fill: #fff; stroke: var(--ind-300); stroke-width: 1.5; stroke-dasharray: 3 2; }
.stop.lit .node { fill: var(--cinnabar); stroke: var(--paper); stroke-width: 2; stroke-dasharray: none; }
.halo { fill: none; stroke: var(--cinnabar-300); stroke-width: 1; opacity: .7; transform-origin: center; transform-box: fill-box; animation: fp-pulse 2.6s ease-out infinite; }
@keyframes fp-pulse { 0% { transform: scale(.72); opacity: .8; } 70% { transform: scale(1.12); opacity: 0; } 100% { transform: scale(1.12); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .halo { animation: none; opacity: .5; } }
.icon { font-size: 12px; }
.label { font-size: 10px; fill: var(--text-2); }
.overview .label { font-size: 12px; fill: var(--ind-800); }
.stop.locked .label { fill: var(--text-3); }
.count { font-size: 9px; font-weight: 700; fill: var(--cinnabar-700); }
.memo { font-size: 9px; fill: var(--text-3); }

/* ── 图例 ── */
.legend { display: flex; gap: 16px; font-size: 11px; color: var(--text-2); padding: 2px 14px 10px; }
.legend .muted { color: var(--text-3); }
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.sw { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.sw-lit { background: var(--cinnabar); }
.sw-locked { background: #fff; border: 1.5px dashed var(--ind-300); }
</style>
