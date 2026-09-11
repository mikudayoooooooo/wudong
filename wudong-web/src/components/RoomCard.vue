<script setup lang="ts">
import ComingSoonTag from './ComingSoonTag.vue';
import { fmtPrice } from '@/utils/format';
import type { RoomType } from '@/api/types';

defineProps<{ room: RoomType; disabled?: boolean }>();
const emit = defineEmits<{
  (e: 'book'): void;
  (e: 'viewCalendar'): void;
}>();
</script>

<template>
  <article class="room-card">
    <header class="room-head">
      <h4>{{ room.name }}</h4>
      <ComingSoonTag v-if="disabled" />
    </header>
    <div class="facts">
      <span>床型：{{ room.bedType || '-' }}</span>
      <span>可住 {{ room.maxGuests }} 人</span>
      <span>共 {{ room.stock }} 间</span>
      <span class="price">¥{{ fmtPrice(room.price) }}</span>
    </div>
    <div class="room-actions">
      <button type="button" class="btn-primary" :disabled="disabled" @click="emit('book')">预订</button>
      <button type="button" class="btn-ghost" @click="emit('viewCalendar')">查看房态日历</button>
    </div>
  </article>
</template>

<style scoped>
.room-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.room-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.room-head h4 {
  margin: 0;
  color: var(--green-900);
  font-size: 16px;
}
.facts {
  font-size: 13px;
  color: var(--muted);
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
}
.facts .price {
  color: var(--cinnabar);
  font-weight: 700;
}
.room-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.btn-primary {
  background: var(--cinnabar);
  color: #fff;
  border: 0;
  padding: 9px 18px;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
}
.btn-primary:disabled {
  background: var(--ind-100);
  color: var(--text-3);
  cursor: not-allowed;
}
.btn-ghost {
  border: 1px solid var(--line);
  background: #fff;
  padding: 9px 16px;
  border-radius: var(--radius);
  color: var(--green-700);
  cursor: pointer;
}
</style>
