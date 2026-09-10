<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{ value: number; suffix?: string }>()
const shown = ref('0')

onMounted(() => {
  const start = performance.now()
  const dur = 1200
  function tick(now: number): void {
    const p = Math.min((now - start) / dur, 1)
    const eased = 1 - Math.pow(1 - p, 3)
    shown.value = Math.round(props.value * eased).toLocaleString()
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
</script>

<template>
  <span class="countup">{{ shown }}{{ suffix }}</span>
</template>
