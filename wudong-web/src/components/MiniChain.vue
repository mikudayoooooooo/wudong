<script setup lang="ts">
withDefaults(defineProps<{ lit: number; total: number; size?: 'sm' | 'md' }>(), { size: 'sm' })
</script>

<template>
  <span class="chain" :class="size">
    <i v-for="i in total" :key="i" class="dot" :class="{ on: i <= lit }" />
    <em>{{ lit }}/{{ total }} 站</em>
  </span>
</template>

<style scoped>
.chain { display: inline-flex; align-items: center; gap: 3px; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #ddd; }
.dot.on { background: var(--orange-500); box-shadow: 0 0 4px rgba(232,150,62,.6); }
.md .dot { width: 10px; height: 10px; }
em { font-style: normal; font-size: 11px; color: var(--amber-text); margin-left: 4px; }
</style>
