<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getRecommendSlots } from '../data/mock'

const props = withDefaults(defineProps<{ autoMs?: number }>(), { autoMs: 5000 })
const emit = defineEmits<{ open: [itemType: string, itemId: number] }>()

const slots = getRecommendSlots()
const current = ref(0)
let timer: number | undefined

function schedule(): void {
  timer = window.setInterval(() => {
    if (!hovering.value) current.value = (current.value + 1) % slots.length
  }, props.autoMs)
}
const hovering = ref(false)

onMounted(schedule)
onUnmounted(() => clearInterval(timer))

function go(i: number): void {
  current.value = i
}
function shift(delta: number): void {
  current.value = (current.value + delta + slots.length) % slots.length
}
function gradient(i: number): string {
  return ['#33523e,#4a7a5c', '#7a4a2e,#a9703f', '#2e4a6b,#3f6a96'][i % 3]
}

defineExpose({ current })
</script>

<template>
  <div class="carousel" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <div
      v-for="(s, i) in slots" :key="s.id" class="slide" :class="{ active: i === current }"
      :style="{ background: `linear-gradient(110deg, ${gradient(i)})` }" @click="emit('open', s.itemType, s.itemId)"
    >
      <div class="card">
        <span class="pill badge">{{ s.badge }}</span>
        <div class="title">{{ s.title }}</div>
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
.carousel { position: relative; height: 210px; border-radius: var(--radius); overflow: hidden; }
.slide { position: absolute; inset: 0; opacity: 0; transition: opacity .6s; cursor: pointer; }
.slide.active { opacity: 1; }
.card { color: #fff; padding: 16px 20px; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; }
.badge { background: rgba(255,255,255,.2); width: fit-content; margin-bottom: 8px; }
.title { font-size: 20px; font-weight: 800; }
.subtitle { font-size: 12px; opacity: .92; }
.arrow { position: absolute; top: 42%; width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,.35); color: #fff; font-size: 18px; }
.arrow.left { left: 10px; } .arrow.right { right: 10px; }
.dots { position: absolute; bottom: 8px; left: 0; right: 0; display: flex; gap: 6px; justify-content: center; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,.5); cursor: pointer; }
.dot.on { background: #fff; width: 16px; border-radius: 4px; }
</style>
