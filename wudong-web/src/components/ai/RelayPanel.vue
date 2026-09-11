<script setup lang="ts">
// 接力面板：三节点固定文案，lit/busy 由 AiButler 按剧本驱动
defineProps<{ lit: number; busy: number | null }>()
const NAMES = ['需求识别', '检索生成', '执行推荐']
</script>

<template>
  <div class="relay">
    <template v-for="(n, i) in NAMES" :key="n">
      <div class="node" :class="{ on: i <= lit, running: busy === i }">
        <span class="dot">{{ i + 1 }}</span><b>{{ n }}</b>
      </div>
      <div v-if="i < NAMES.length - 1" class="link" :class="{ on: i < lit }" />
    </template>
  </div>
</template>

<style scoped>
.relay { display: flex; align-items: center; justify-content: center; gap: 4px; padding: 10px 8px; border-bottom: 1px solid var(--line); }
.node { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-3); }
.node .dot { width: 18px; height: 18px; border-radius: 50%; border: 1px solid var(--line); display: grid; place-items: center; font-size: 10px; background: #fff; }
.node.on { color: var(--green-600); }
.node.on .dot { border-color: var(--green-600); background: var(--ok-bg); }
.node.running .dot { animation: pulse 1s ease-in-out infinite; }
.node.running b { color: var(--ind-500); animation: breath 1.2s ease-in-out infinite; }
.link { width: 18px; height: 2px; background: var(--line); }
.link.on { background: var(--green-600); }
@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.25); } }
@keyframes flow { to { background-position: -200% 0; } }
</style>
