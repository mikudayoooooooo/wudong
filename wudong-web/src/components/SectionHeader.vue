<script setup lang="ts">
import Icon from './Icon.vue'

const props = defineProps<{ icon?: string; title: string; sub?: string; more?: string }>()
const emit = defineEmits<{ more: [] }>()

// icon 传 Tabler 图标名（如 ticket）则用图标组件；兼容旧的 emoji 直出
const isIconName = (v?: string): boolean => !!v && /^[a-z0-9-]+$/.test(v)
</script>

<template>
  <div class="sec-head">
    <div class="left">
      <Icon v-if="isIconName(props.icon)" :name="props.icon!" :size="18" class="sec-icon" />
      <span v-else-if="props.icon">{{ props.icon }} </span>
      <b class="title font-display">{{ title }}</b>
      <span v-if="sub" class="sub">{{ sub }}</span>
    </div>
    <a v-if="more" class="more" @click="emit('more')">{{ more }} ›</a>
  </div>
</template>

<style scoped>
.sec-head { display: flex; align-items: baseline; justify-content: space-between; margin: 22px 0 12px; padding-bottom: 8px; border-bottom: 1px solid var(--line); }
.left { display: flex; align-items: baseline; gap: 6px; }
.sec-icon { color: var(--ind-700); align-self: center; }
.title { font-size: 17px; color: var(--ind-800); }
.sub { font-size: 12px; color: var(--text-3); margin-left: 4px; }
.more { font-size: 12px; color: var(--text-3); cursor: pointer; }
.more:hover { color: var(--cinnabar-700); }
</style>
