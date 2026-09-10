<script setup lang="ts">
defineProps<{ icon?: string; title: string; sub?: string; more?: string }>()
const emit = defineEmits<{ more: [] }>()
</script>

<template>
  <div class="sec-head">
    <div>
      <b class="title">{{ icon }} {{ title }}</b>
      <span v-if="sub" class="sub">{{ sub }}</span>
    </div>
    <a v-if="more" class="more" @click="emit('more')">{{ more }} ›</a>
  </div>
</template>

<style scoped>
.sec-head { display: flex; align-items: baseline; justify-content: space-between; margin: 18px 0 10px; }
.title { font-size: 16px; }
.sub { font-size: 12px; color: var(--text-3); margin-left: 8px; }
.more { font-size: 12px; color: var(--text-3); cursor: pointer; }
.more:hover { color: var(--orange-700); }
</style>
