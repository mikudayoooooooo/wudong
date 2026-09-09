<script setup lang="ts">
// 民宿详情页 + 房态日历面板（7/30 天切换）。
// 数据只读 api/accommodation（USE_MOCK 切换在 api 层）：路由 params.id → hotelDetail(id) → info + roomTypes；
// 每张房型卡 RoomCard（预订禁用占位 ComingSoonTag）；点「查看房态日历」选中房型 → roomCalendar(roomTypeId, today, today+range-1)。
// range 档位以 ?range=7|30 驱动（缺席/非法默认 30，URL 可分享/刷新恢复）：头按钮点击 router.replace 写回 ?range，
// watch(() => route.query.range) 归一档位并重拉所选房型日历 —— 外部导航/历史前进后退同样生效。
// 注意：真实 /detail 的 info.minPrice 恒为 null（携带无关），详情页按房型卡价格展示，绝不读 info.minPrice。
// 加载/失败/空态齐全；日历请求带序号守卫（防慢响应乱序覆盖，Task 5 教训）。
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RoomCard from '@/components/RoomCard.vue';
import CalendarTable from '@/components/CalendarTable.vue';
import { hotelDetail, roomCalendar } from '@/api/accommodation';
import { addDaysISO, todayISO } from '@/utils/date';
import type { CalendarRow, Hotel, RoomType } from '@/api/types';

const route = useRoute();
const router = useRouter();

const RANGE_OPTIONS: Array<7 | 30> = [7, 30];

/** ?range 归一：仅字符串 '7' → 7，缺席/其它一律 30（默认档） */
const normalizeRange = (raw: unknown): 7 | 30 => (raw === '7' ? 7 : 30);

/** 房型 id 随路由参数（详情间切换复用组件时保持最新） */
const hotelId = computed<number>(() => Number(route.params.id));

// 详情
const loading = ref(true);
const failed = ref(false);
const info = ref<Hotel | null>(null);
const roomTypes = ref<RoomType[]>([]);

// 日历
const range = ref<7 | 30>(normalizeRange(route.query.range));
const selectedRoomTypeId = ref<number | null>(null);
const calendarRows = ref<CalendarRow[]>([]);
const calLoading = ref(false);
const calFailed = ref(false);

const selectedRoomType = computed<RoomType | null>(
  () => roomTypes.value.find((r) => r.id === selectedRoomTypeId.value) ?? null
);
const heroImage = computed<string>(() => {
  const h = info.value;
  if (!h) return '';
  return h.mainImage || (h.images && h.images[0]) || '';
});

// ---------- 数据加载 ----------
let detailSeq = 0;
async function loadDetail(): Promise<void> {
  const seq = ++detailSeq;
  loading.value = true;
  failed.value = false;
  try {
    const d = await hotelDetail(hotelId.value);
    if (seq !== detailSeq) return; // 已发新请求，本响应过期丢弃
    info.value = d.info;
    roomTypes.value = d.roomTypes || []; // api 层已只含启用房型
    selectedRoomTypeId.value = null;
    calendarRows.value = [];
  } catch {
    if (seq !== detailSeq) return;
    info.value = null;
    roomTypes.value = [];
    failed.value = true;
  } finally {
    if (seq === detailSeq) loading.value = false;
  }
}

let calSeq = 0;
async function loadCalendar(): Promise<void> {
  const rt = selectedRoomType.value;
  if (!rt) return;
  const seq = ++calSeq;
  calLoading.value = true;
  calFailed.value = false;
  try {
    const start = todayISO();
    const end = addDaysISO(start, range.value - 1);
    const rows = await roomCalendar(rt.id, start, end);
    if (seq !== calSeq) return;
    calendarRows.value = rows || [];
  } catch {
    if (seq !== calSeq) return;
    calendarRows.value = [];
    calFailed.value = true;
  } finally {
    if (seq === calSeq) calLoading.value = false;
  }
}

/** RoomCard「查看房态日历」→ 选中房型并拉取该房型日历 */
function selectRoomType(id: number): void {
  if (selectedRoomTypeId.value === id) {
    // 同房型重复点击：当作刷新日历
    calendarRows.value = [];
    void loadCalendar();
    return;
  }
  selectedRoomTypeId.value = id;
  calendarRows.value = [];
  void loadCalendar();
}

/** 7/30 天切换：写回 ?range（URL 可分享，刷新/转发保持档位）；实际重拉由下方 query watch 统一驱动 */
function changeRange(n: 7 | 30): void {
  if (range.value === n) return; // 已在该档：无需导航/重拉
  void router.replace({ query: { ...route.query, range: String(n) } });
}

onMounted(loadDetail);
// 同组件复用时路由 id 变化（列表/详情间）重新加载
watch(() => route.params.id, loadDetail);
// ?range 变化（本页 chip 点击 → router.replace，或外部导航/历史前进后退）→ 归一档位并重拉所选房型日历。
// calSeq 序号守卫防慢响应乱序（过期响应丢弃）；缺席/非法值归一 30（默认档）。
watch(
  () => route.query.range,
  (raw) => {
    const n = normalizeRange(raw);
    if (n === range.value) return; // 档位未变（如 URL 由缺失归一为 30）：无需重拉
    range.value = n;
    if (selectedRoomType.value) {
      calendarRows.value = [];
      void loadCalendar();
    }
  }
);
</script>

<template>
  <main class="container detail">
    <button type="button" class="back-btn" @click="router.push('/hotels')">← 返回民宿列表</button>

    <div v-if="loading" class="state-note">正在加载民宿详情…</div>

    <div v-else-if="failed" class="state-note error">
      民宿详情加载失败，请稍后重试
      <button type="button" class="retry" @click="loadDetail">重新加载</button>
    </div>

    <template v-else-if="info">
      <div v-if="heroImage" class="detail-hero">
        <img :src="heroImage" :alt="info.name" />
      </div>

      <div class="detail-head">
        <h1>{{ info.name }}</h1>
        <span class="rate">★ {{ info.rating.toFixed(1) }}（{{ info.reviewCount || 0 }} 条评价）</span>
      </div>
      <p class="addr-line">📍 {{ info.address }} · 入住 {{ info.checkInTime }} / 离店 {{ info.checkOutTime }}</p>

      <!-- 简介 / 风格 / 设施 -->
      <section class="intro-box">
        <p class="intro">{{ info.intro }}</p>
        <div class="tags">
          <span v-for="t in info.styleTags || []" :key="`s-${t}`" class="tag">{{ t }}</span>
          <span v-for="t in info.facilityTags || []" :key="`f-${t}`" class="tag tag-facility">{{ t }}</span>
        </div>
      </section>

      <!-- 房型列表：预订统一禁用占位；点查看房态 → 日历 -->
      <section class="section">
        <div class="section-title"><h2>房型与房态</h2></div>
        <div v-if="roomTypes.length" class="room-grid">
          <RoomCard
            v-for="rt in roomTypes"
            :key="rt.id"
            :room="rt"
            disabled
            @viewCalendar="selectRoomType(rt.id)"
          />
        </div>
        <p v-else class="empty-state">该民宿暂无启用房型，敬请期待。</p>
      </section>

      <!-- 房态日历面板（选中房型后显示） -->
      <section v-if="selectedRoomType" class="section">
        <div class="calendar-toolbar">
          <b class="cal-room">{{ selectedRoomType.name }}</b>
          <span class="cal-title">房态日历</span>
          <div class="chips">
            <button
              v-for="n in RANGE_OPTIONS"
              :key="n"
              type="button"
              class="chip"
              :class="{ on: range === n }"
              @click="changeRange(n)"
            >
              {{ n }} 天
            </button>
          </div>
        </div>
        <CalendarTable v-if="!calFailed" :rows="calendarRows" :loading="calLoading" />
        <div v-else class="state-note error">
          房态加载失败，请稍后重试
          <button type="button" class="retry" @click="loadCalendar">重新加载</button>
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
.detail {
  padding-bottom: 8px;
}
.back-btn {
  border: 0;
  background: #fff;
  box-shadow: var(--shadow);
  padding: 8px 14px;
  border-radius: 10px;
  margin-top: 18px;
  color: var(--green-700);
  font-size: 14px;
}
.detail-hero {
  margin-top: 18px;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--green-300), var(--green-100));
}
.detail-hero img {
  display: block;
  width: 100%;
  height: 380px;
  object-fit: cover;
}
.detail-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 20px 0 6px;
}
.detail-head h1 {
  margin: 0;
  font-size: 26px;
  color: var(--green-900);
}
.rate {
  color: var(--gold-600);
  font-weight: 600;
  font-size: 14px;
}
.addr-line {
  color: var(--muted);
  margin: 0 0 14px;
  font-size: 14px;
}
.intro-box {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 16px 18px;
}
.intro-box .intro {
  margin: 0 0 10px;
  line-height: 1.7;
  color: var(--ink);
  font-size: 14px;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag {
  font-size: 12px;
  color: var(--green-700);
  background: var(--green-100);
  border: 1px solid #d6e6cf;
  padding: 2px 8px;
  border-radius: 6px;
}
.tag-facility {
  background: #fff7ec;
  color: var(--gold-600);
  border-color: var(--gold-300);
}
.room-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.empty-state,
.state-note {
  margin: 0;
  padding: 26px 20px;
  text-align: center;
  color: var(--muted);
  font-size: 14px;
  background: #fff;
  border: 1px dashed var(--line);
  border-radius: var(--radius);
}
.state-note.error {
  border-color: #e6b4ad;
  color: var(--gold-600);
}
.retry {
  margin-left: 6px;
  border: 0;
  background: none;
  color: var(--green-500);
  cursor: pointer;
  text-decoration: underline;
  font-size: 13px;
}
/* 日历面板头部：房型名 + 7/30 天切换（CalendarTable 自带 .calendar-panel 边框盒，此处仅标签行） */
.calendar-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 2px;
  font-size: 13px;
  color: var(--muted);
}
.cal-room {
  color: var(--green-900);
  font-size: 14px;
}
.cal-title {
  color: var(--muted);
}
.chips {
  display: flex;
  gap: 8px;
  margin-left: auto;
}
.chip {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 13px;
  color: var(--green-700);
}
.chip.on {
  background: var(--green-700);
  color: #fff;
  border-color: var(--green-700);
}
</style>
