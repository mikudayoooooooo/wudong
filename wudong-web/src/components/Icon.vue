<script setup lang="ts">
/**
 * 全站统一图标组件（Tabler Icons, MIT，本地化于 src/assets/icons）。
 * 用法：<Icon name="ticket" :size="18" />，颜色跟随 currentColor，由 CSS 控制。
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 16 })

const modules = import.meta.glob('../assets/icons/*.svg', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>

const svg = computed(() => {
  const raw = modules[`../assets/icons/${props.name}.svg`]
  if (!raw) return ''
  return raw.replace('<svg ', `<svg width="${props.size}" height="${props.size}" aria-hidden="true" `)
})
</script>

<template>
  <span class="icon" v-html="svg" />
</template>

<style scoped>
.icon { display: inline-flex; align-items: center; justify-content: center; vertical-align: -0.15em; line-height: 0; }
.icon :deep(svg) { display: block; }
</style>
