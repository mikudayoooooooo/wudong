<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { travelApi } from '../api/travel'
import hero1 from '../assets/img/hero/hero-1.jpg'
import hero2 from '../assets/img/hero/hero-2.jpg'
import hero3 from '../assets/img/hero/hero-3.jpg'

const props = withDefaults(defineProps<{ autoMs?: number }>(), { autoMs: 5000 })
const emit = defineEmits<{ open: [itemType: string, itemId: number] }>()

const slots = ref<any[]>([])
const current = ref(0)
let timer: number | undefined

// 本地实景轮播底图（Unsplash License，见 CREDITS.md）；按槽位循环
// position 逐图调过：hero-1 取山脊线、hero-2 取湖面倒影、hero-3 取船头水面
const heroImgs = [
  { src: hero1, pos: 'center 75%' },
  { src: hero2, pos: 'center 55%' },
  { src: hero3, pos: 'center 60%' },
]

function schedule(): void {
  timer = window.setInterval(() => {
    if (!hovering.value && slots.value.length) current.value = (current.value + 1) % slots.value.length
  }, props.autoMs)
}
const hovering = ref(false)

onMounted(async () => {
  slots.value = await travelApi.recommendList('home')
  schedule()
})
onUnmounted(() => clearInterval(timer))

function go(i: number): void {
  current.value = i
}
function shift(delta: number): void {
  current.value = (current.value + delta + slots.value.length) % slots.value.length
}

defineExpose({ current })
</script>

<template>
  <div class="carousel" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <div
      v-for="(s, i) in slots" :key="s.id" class="slide" :class="{ active: i === current }"
      @click="emit('open', s.itemType, s.itemId)"
    >
      <img
        class="slide-img" :src="heroImgs[i % heroImgs.length].src"
        :style="{ objectPosition: heroImgs[i % heroImgs.length].pos }" :alt="s.title" :loading="i === 0 ? 'eager' : 'lazy'"
      />
      <span class="slide-mask" aria-hidden="true" />
      <div class="card">
        <div class="card-inner">
          <span class="pill badge">{{ s.badge }}</span>
          <div class="title font-display">{{ s.title }}</div>
          <div class="subtitle">{{ s.subtitle }}</div>
        </div>
      </div>
    </div>
    <button class="arrow left" @click.stop="shift(-1)">‹</button>
    <button class="arrow right" @click.stop="shift(1)">›</button>
    <div class="dots">
      <i v-for="(s, i) in slots" :key="s.id" class="dot" :class="{ on: i === current }" @click.stop="go(i)" />
    </div>
  </div>
</template>

<style scoped>
.carousel { position: relative; height: 420px; background: var(--ind-950); }
.slide { position: absolute; inset: 0; opacity: 0; transition: opacity .7s; cursor: pointer; background: var(--ind-950); }
.slide.active { opacity: 1; }
.slide-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; transform: translateZ(0); }
/* 平色靛蓝罩（非渐变）：压暗画面保证宋体大标题可读 */
.slide-mask { position: absolute; inset: 0; background: rgba(11, 29, 44, .5); z-index: 1; }
.card { position: relative; height: 100%; display: flex; align-items: flex-end; z-index: 2; }
.card-inner { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 16px 64px; color: var(--paper); }
.badge { background: transparent; border: 1px solid rgba(251, 247, 238, .45); color: var(--paper); width: fit-content; margin-bottom: 14px; }
.title { font-size: 40px; font-weight: 700; line-height: 1.25; max-width: 640px; }
.subtitle { font-size: 14px; opacity: .88; margin-top: 10px; }
.arrow { position: absolute; top: 46%; width: 34px; height: 34px; border-radius: 50%; background: transparent; border: 1px solid rgba(251, 247, 238, .5); color: var(--paper); font-size: 18px; z-index: 2; }
.arrow:hover { background: rgba(251, 247, 238, .15); }
.arrow.left { left: 18px; } .arrow.right { right: 18px; }
.dots { position: absolute; bottom: 22px; left: 0; right: 0; display: flex; gap: 8px; justify-content: center; z-index: 2; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(251, 247, 238, .45); cursor: pointer; }
.dot.on { background: var(--paper); width: 20px; border-radius: 4px; }
@media (max-width: 900px) {
  .carousel { height: 300px; }
  .title { font-size: 28px; }
  .card-inner { padding-bottom: 48px; }
}
</style>
