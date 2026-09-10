<script setup lang="ts">
// 房态日历：7/30 天窗口切换 + 逐日房态表 + 批量设置（价格/可售间数/关房，可选星期几）。
// 日期运算统一走 utils/date（本地时区正午基准，避免 UTC 偏移）。
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  merchantCalendarBatch,
  merchantCalendarRange,
  merchantRoomTypePage,
} from '@/api/merchant';
import { addDaysISO, todayISO, weekCN } from '@/utils/date';
import { fmtPrice } from '@/utils/format';
import type { CalendarRow, MerchantRoomType } from '@/api/types';

const route = useRoute();

const roomTypeId = computed(() => Number(route.params.id));
const roomType = ref<MerchantRoomType | null>(null);

const rangeDays = ref(7);
const startDate = ref(todayISO());
const rows = ref<CalendarRow[]>([]);
const loading = ref(true);
const error = ref('');
const notice = ref('');
/** 请求序号：每次 load 自增；响应回来仅当仍是最新请求才写回（防切窗/刷新时慢响应乱序覆盖） */
let reqSeq = 0;

const endDate = computed(() => addDaysISO(startDate.value, rangeDays.value - 1));

const batch = reactive<{
  startDate: string;
  endDate: string;
  weekDays: number[];
  price: number | null;
  availableStock: number | null;
  closed: boolean;
}>({
  startDate: startDate.value,
  endDate: endDate.value,
  weekDays: [],
  price: null,
  availableStock: null,
  closed: false,
});

const submitting = ref(false);

/** 星期多选按钮顺序：一…六、日（值用 Date#getDay() 的下标） */
const weekdayOptions = [1, 2, 3, 4, 5, 6, 0].map((value) => ({
  value,
  label: weekCN[value],
}));

async function load(): Promise<void> {
  const seq = ++reqSeq;
  loading.value = true;
  error.value = '';
  try {
    const [page, list] = await Promise.all([
      roomType.value
        ? Promise.resolve({ list: [roomType.value], total: 1 })
        : merchantRoomTypePage(Number(route.query.hotelId) || 0, { size: 50 }),
      merchantCalendarRange(roomTypeId.value, startDate.value, endDate.value),
    ]);
    if (seq !== reqSeq) return; // 已发新请求，本响应过期，丢弃（不改 rows / roomType）
    roomType.value = page.list.find((r) => r.id === roomTypeId.value) ?? null;
    rows.value = list;
  } catch (e) {
    if (seq !== reqSeq) return; // 过期请求的错误同样丢弃
    error.value = e instanceof Error ? e.message : '房态加载失败';
    rows.value = [];
  } finally {
    if (seq === reqSeq) loading.value = false; // 仅最新请求控制 loading
  }
}

async function switchRange(days: number): Promise<void> {
  rangeDays.value = days;
  batch.startDate = startDate.value;
  batch.endDate = endDate.value;
  await load();
}

async function shiftWindow(offset: number): Promise<void> {
  startDate.value = addDaysISO(startDate.value, offset);
  batch.startDate = startDate.value;
  batch.endDate = endDate.value;
  await load();
}

function toggleWeekday(value: number): void {
  const index = batch.weekDays.indexOf(value);
  if (index >= 0) batch.weekDays.splice(index, 1);
  else batch.weekDays.push(value);
}

async function submitBatch(): Promise<void> {
  error.value = '';
  notice.value = '';

  if (!batch.closed && batch.price == null && batch.availableStock == null) {
    error.value = '请填写价格或可售间数，或勾选关房';
    return;
  }
  if (!batch.closed && batch.price != null && !(Number(batch.price) > 0)) {
    error.value = '房型价格必须大于 0';
    return;
  }

  submitting.value = true;
  try {
    const result = await merchantCalendarBatch({
      roomTypeId: roomTypeId.value,
      startDate: batch.startDate,
      endDate: batch.endDate,
      weekDays: batch.weekDays.length ? batch.weekDays.slice() : undefined,
      price: batch.closed || batch.price == null ? undefined : Number(batch.price),
      availableStock:
        batch.closed || batch.availableStock == null
          ? undefined
          : Number(batch.availableStock),
      closed: batch.closed,
    });
    notice.value = `已更新 ${result.count} 天房态`;
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : '设置失败，请稍后重试';
  } finally {
    submitting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div class="m-card">
      <h2 class="m-card-title">
        {{ roomType ? `${roomType.name} · 房态` : '房态日历' }}
        <span class="m-actions">
          <button
            v-for="days in [7, 30]"
            :key="days"
            type="button"
            class="range-tab"
            :class="{ active: rangeDays === days }"
            @click="switchRange(days)"
          >
            {{ days }} 天
          </button>
        </span>
      </h2>

      <div class="calendar-window">
        <button type="button" class="m-btn m-btn-ghost" @click="shiftWindow(-7)">
          上一周
        </button>
        <span class="m-hint">{{ startDate }} ~ {{ endDate }}</span>
        <button type="button" class="m-btn m-btn-ghost" @click="shiftWindow(7)">
          下一周
        </button>
      </div>

      <p v-if="error" class="m-state m-error">{{ error }}</p>
      <p v-if="notice" class="m-hint">{{ notice }}</p>

      <div v-if="loading" class="m-state">正在加载房态…</div>

      <table v-else class="m-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>星期</th>
            <th>价格</th>
            <th>可售间数</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.date">
            <td>{{ row.date }}</td>
            <td>周{{ weekCN[new Date(`${row.date}T12:00:00`).getDay()] }}</td>
            <td>¥{{ fmtPrice(row.price) }}</td>
            <td>{{ row.availableStock }}</td>
            <td>{{ Number(row.status) === 1 ? '可订' : '已关房' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="m-card">
      <h2 class="m-card-title">批量设置房态</h2>
      <form class="batch-form" @submit.prevent="submitBatch">
        <div class="m-form-grid">
          <div class="m-form-row batch-start">
            <label>开始日期</label>
            <input v-model="batch.startDate" type="date" />
          </div>
          <div class="m-form-row batch-end">
            <label>结束日期</label>
            <input v-model="batch.endDate" type="date" />
          </div>
          <div class="m-form-row batch-price">
            <label>当日价格（元）</label>
            <input v-model.number="batch.price" type="number" min="0" step="1" placeholder="不填则不改价" />
          </div>
          <div class="m-form-row batch-stock">
            <label>可售间数</label>
            <input
              v-model.number="batch.availableStock"
              type="number"
              min="0"
              step="1"
              placeholder="不超过房型房间数"
            />
          </div>
        </div>

        <div class="m-form-row">
          <label>限定星期（不选表示区间内全部）</label>
          <div class="weekday-row">
            <button
              v-for="item in weekdayOptions"
              :key="item.value"
              type="button"
              class="weekday-toggle"
              :class="{ active: batch.weekDays.includes(item.value) }"
              @click="toggleWeekday(item.value)"
            >
              {{ item.label }}
            </button>
          </div>
        </div>

        <div class="m-form-row batch-closed">
          <label>
            <input v-model="batch.closed" type="checkbox" />
            关房（该区间不可预订）
          </label>
        </div>

        <div class="m-form-actions">
          <button class="m-btn" type="submit" :disabled="submitting">
            {{ submitting ? '提交中…' : '应用到区间' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.range-tab {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 999px;
  padding: 5px 14px;
  font-size: 13px;
  color: var(--muted);
}
.range-tab.active {
  border-color: var(--green-700);
  background: var(--green-700);
  color: #fff;
}
.calendar-window {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.weekday-row {
  display: flex;
  gap: 6px;
}
.weekday-toggle {
  width: 34px;
  height: 34px;
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 50%;
  font-size: 13px;
  color: var(--muted);
}
.weekday-toggle.active {
  border-color: var(--green-700);
  background: var(--green-700);
  color: #fff;
}
</style>
