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
const heroImgs = [hero1, hero2, hero3]

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
      :style="{ backgroundImage: `url(${heroImgs[i % heroImgs.length]})` }" @click="emit('open', s.itemType, s.itemId)"
    >
      <div class="card">
        <span class="pill badge">{{ s.badge }}</span>
        <div class="title font-display">{{ s.title }}</div>
        <div class="subtitle">{{ s.subtitle }}</div>
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
.carousel { position: relative; height: 240px; border-radius: var(--radius); overflow: hidden; background: var(--ind-800); }
.slide { position: absolute; inset: 0; opacity: 0; transition: opacity .6s; cursor: pointer; background-size: cover; background-position: center; }
.slide.active { opacity: 1; }
/* 平色靛蓝罩保证文字可读（非渐变，符合零渐变纪律） */
.slide::before { content: ""; position: absolute; inset: 0; background: rgba(11, 29, 44, .32); }
.card { position: relative; color: var(--paper); padding: 18px 22px; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; }
.badge { background: rgba(251, 247, 238, .18); color: var(--paper); width: fit-content; margin-bottom: 8px; }
.title { font-size: 24px; font-weight: 700; }
.subtitle { font-size: 12px; opacity: .92; margin-top: 2px; }
.arrow { position: absolute; top: 45%; width: 30px; height: 30px; border-radius: 50%; background: rgba(251, 247, 238, .28); color: var(--paper); font-size: 18px; z-index: 2; }
.arrow.left { left: 10px; } .arrow.right { right: 10px; }
.dots { position: absolute; bottom: 10px; left: 0; right: 0; display: flex; gap: 6px; justify-content: center; z-index: 2; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(251, 247, 238, .5); cursor: pointer; }
.dot.on { background: var(--paper); width: 16px; border-radius: 4px; }
</style>
