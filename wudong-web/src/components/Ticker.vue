<script setup lang="ts">
import { computed } from 'vue';
import type { Announcement } from '@/api/types';

const props = defineProps<{ items: Announcement[] }>();

// 公告条仅展示第一条标题 + 内容（与原型一致）
const title = computed(() => props.items[0]?.title ?? '');
const content = computed(() => props.items[0]?.content ?? '');
</script>

<template>
  <div v-if="items.length" class="ticker">
    <span class="tag">公告</span>
    <span class="text">{{ title }} — {{ content }}</span>
  </div>
</template>

<style scoped>
.ticker {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 10px 16px;
  margin-top: 18px;
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
}
.ticker .tag {
  background: var(--gold-300);
  color: #fff;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  flex-shrink: 0;
}
.ticker .text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
