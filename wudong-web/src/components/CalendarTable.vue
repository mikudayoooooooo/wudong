<script setup lang="ts">
import type { CalendarRow } from '@/api/types';

defineProps<{ rows: CalendarRow[]; loading: boolean }>();

const WEEK = ['日', '一', '二', '三', '四', '五', '六'];

/** 2026-09-10 → 9月10日 */
function dayCN(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}
/** 2026-09-10 → 周四 */
function weekCN(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return `周${WEEK[d.getDay()]}`;
}
</script>

<template>
  <div class="calendar-panel">
    <div class="calendar-wrap">
      <div v-if="loading" class="state-note">加载中…</div>
      <div v-else-if="!rows.length" class="state-note">暂无房态数据，请稍后再试</div>
      <table v-else class="calendar-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>星期</th>
            <th>价格(元)</th>
            <th>可订</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in rows" :key="c.date">
            <td>{{ dayCN(c.date) }}</td>
            <td>{{ weekCN(c.date) }}</td>
            <td class="money">¥{{ c.price.toFixed(2) }}</td>
            <td>
              <template v-if="c.status === 1">
                <span v-if="c.availableStock > 0">剩 {{ c.availableStock }} 间</span>
                <span v-else class="full">已满</span>
              </template>
              <span v-else class="off">不可订</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.calendar-panel {
  margin-top: 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: #fff;
  overflow: hidden;
}
.calendar-wrap {
  max-height: 320px;
  overflow: auto;
}
.state-note {
  padding: 26px 16px;
  text-align: center;
  color: var(--muted);
  font-size: 13px;
}
.calendar-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.calendar-table th,
.calendar-table td {
  padding: 8px 10px;
  border-bottom: 1px solid #f0f3ec;
  text-align: center;
}
.calendar-table th {
  background: var(--green-100);
  color: var(--green-700);
  font-weight: 600;
  position: sticky;
  top: 0;
}
.calendar-table .off {
  color: #c0392b;
}
.calendar-table .full {
  color: var(--muted);
}
.money {
  color: var(--gold-600);
  font-weight: 600;
}
</style>
