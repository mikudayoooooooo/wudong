<script setup lang="ts">
// 民宿详情页 + 房态日历面板（7/30 天切换）。
// 数据只读 api/accommodation（USE_MOCK 切换在 api 层）：路由 params.id → hotelDetail(id) → info + roomTypes；
// 每张房型卡 RoomCard（预订 → 预订弹窗，走公共订单 orderType=3）；点「查看房态日历」选中房型 → roomCalendar(roomTypeId, today, today+range-1)。
// range 档位以 ?range=7|30 驱动（缺席/非法默认 30，URL 可分享/刷新恢复）：头按钮点击 router.replace 写回 ?range，
// watch(() => route.query.range) 归一档位并重拉所选房型日历 —— 外部导航/历史前进后退同样生效。
// 注意：真实 /detail 的 info.minPrice 恒为 null（携带无关），详情页按房型卡价格展示，绝不读 info.minPrice。
// 加载/失败/空态齐全；日历请求带序号守卫（防慢响应乱序覆盖，Task 5 教训）。
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RoomCard from '@/components/RoomCard.vue';
import CalendarTable from '@/components/CalendarTable.vue';
import Icon from '@/components/Icon.vue';
import { hotelDetail, roomCalendar, bookingCreate } from '@/api/accommodation';
import { addDaysISO, todayISO } from '@/utils/date';
import { useSession } from '../../stores/session';
import type { CalendarRow, Hotel, RoomType } from '@/api/types';

const route = useRoute();
const router = useRouter();
const session = useSession();

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

// ---------- 预订（公共订单 orderType=3，最少提前 1 天） ----------
const booking = ref({
  open: false,
  submitting: false,
  roomType: null as RoomType | null,
  checkIn: addDaysISO(todayISO(), 1),
  checkOut: addDaysISO(todayISO(), 2),
  rooms: 1,
  guestName: '',
  guestPhone: '',
});

const nights = computed<number>(() => {
  const ms = new Date(booking.value.checkOut).getTime() - new Date(booking.value.checkIn).getTime();
  const n = Math.round(ms / 86400000);
  return Number.isFinite(n) && n > 0 ? n : 0;
});

const estimate = computed<string>(() => {
  const rt = booking.value.roomType;
  if (!rt || !nights.value) return '-';
  return (Number(rt.price) * nights.value * booking.value.rooms).toFixed(2);
});

function openBooking(rt: RoomType): void {
  if (!session.isLogged) {
    alert('请先在右上角登录后再预订');
    return;
  }
  booking.value.roomType = rt;
  booking.value.checkIn = addDaysISO(todayISO(), 1);
  booking.value.checkOut = addDaysISO(todayISO(), 2);
  booking.value.rooms = 1;
  booking.value.open = true;
}

async function submitBooking(): Promise<void> {
  const rt = booking.value.roomType;
  if (!rt) return;
  if (!nights.value) {
    alert('离店日期需晚于入住日期');
    return;
  }
  booking.value.submitting = true;
  try {
    const r = await bookingCreate({
      roomTypeId: rt.id,
      checkInDate: booking.value.checkIn,
      checkOutDate: booking.value.checkOut,
      rooms: booking.value.rooms,
      guestName: session.user?.nickname || '',
      guestPhone: '',
    });
    alert(`预订成功！订单号 ${r.orderNo}，应付 ¥${r.payAmount}`);
    booking.value.open = false;
    void router.push('/my/orders');
  } catch (e: any) {
    alert(e?.message || '预订失败');
  } finally {
    booking.value.submitting = false;
  }
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
  <main class="detail acc-scope">
    <div v-if="loading" class="state-note">正在加载民宿详情…</div>

    <div v-else-if="failed" class="state-note error">
      民宿详情加载失败，请稍后重试
      <button type="button" class="retry" @click="loadDetail">重新加载</button>
    </div>

    <template v-else-if="info">
      <!-- 页头：全幅 320px 封面，宋体纸色标题压图（规范 §3.3.1） -->
      <section class="detail-hero img-frame" :class="{ 'no-cover': !heroImage }">
        <img v-if="heroImage" :src="heroImage" :alt="info.name" />
        <div class="hero-mask" aria-hidden="true" />
        <div class="hero-inner">
          <h1 class="font-display">{{ info.name }}</h1>
          <div class="sub">
            <span class="rate">★ {{ info.rating.toFixed(1) }}（{{ info.reviewCount || 0 }} 条评价）</span>
            <span><Icon name="map-pin" :size="12" /> {{ info.address }}</span>
            <span>入住 {{ info.checkInTime }} / 离店 {{ info.checkOutTime }}</span>
          </div>
        </div>
      </section>

      <div class="container">
        <button type="button" class="back-btn" @click="router.push('/hotels')">← 返回民宿列表</button>

        <!-- 摘要卡：叠压头图（§3.0 B.3） -->
        <section class="summary-card">
          <p class="intro">{{ info.intro }}</p>
          <div class="tags">
            <span v-for="t in info.styleTags || []" :key="`s-${t}`" class="tag">{{ t }}</span>
            <span v-for="t in info.facilityTags || []" :key="`f-${t}`" class="tag tag-facility">{{ t }}</span>
          </div>
          <p class="stay-info">
            <b>入住信息</b>
            <span>{{ info.hasBreakfast === 1 ? '含早餐' : '不含早餐' }}</span>
            <span>宠物：{{ info.petPolicy || '未提供' }}</span>
          </p>
        </section>

        <!-- 房型列表：预订 → 弹窗走公共订单；点查看房态 → 日历 -->
        <section class="sect">
          <b class="sect-title font-display">房型与房态</b>
          <div v-if="roomTypes.length" class="room-grid">
            <RoomCard
              v-for="rt in roomTypes"
              :key="rt.id"
              :room="rt"
              @book="openBooking(rt)"
              @viewCalendar="selectRoomType(rt.id)"
            />
          </div>
          <p v-else class="empty-state">该民宿暂无启用房型，敬请期待。</p>
        </section>

        <!-- 房态日历面板（选中房型后显示） -->
        <section v-if="selectedRoomType" class="sect">
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
      </div>
    </template>

    <!-- 预订弹窗 -->
    <div v-if="booking.open" class="bk-mask" @click.self="booking.open = false">
      <div class="bk card">
        <h3>预订 · {{ booking.roomType?.name }}</h3>
        <label class="bk-f">
          <span>入住</span>
          <input type="date" v-model="booking.checkIn" :min="addDaysISO(todayISO(), 1)" />
        </label>
        <label class="bk-f">
          <span>离店</span>
          <input type="date" v-model="booking.checkOut" :min="addDaysISO(booking.checkIn, 1)" />
        </label>
        <label class="bk-f">
          <span>间数</span>
          <input type="number" v-model.number="booking.rooms" min="1" max="5" />
        </label>
        <p class="bk-est">
          {{ nights }} 晚 × {{ booking.rooms }} 间 · 预估
          <b>¥{{ estimate }}</b>
          <span class="bk-tip">（库存/价格以下单时房态校验为准）</span>
        </p>
        <div class="bk-acts">
          <button type="button" class="bk-cancel" @click="booking.open = false">取消</button>
          <button type="button" class="bk-ok" :disabled="booking.submitting" @click="submitBooking">
            {{ booking.submitting ? '提交中…' : '提交预订' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.detail {
  padding-bottom: 8px;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px 44px;
}
.back-btn {
  margin: 14px 0 12px;
  border: 1px solid var(--line);
  background: transparent;
  padding: 7px 16px;
  border-radius: var(--radius);
  color: var(--text-2);
  font-size: 13px;
  cursor: pointer;
}
.back-btn:hover {
  border-color: var(--ind-300);
  color: var(--ind-700);
}
/* 页头（§3.3.1）：全幅 320px 封面 + 宋体纸色标题压图 */
.detail-hero {
  position: relative;
  height: 320px;
  overflow: hidden;
  background: var(--ind-800);
}
.detail-hero.no-cover {
  background: var(--ind-800) url("../assets/pattern/diamond-dark.svg") center/560px repeat;
}
.detail-hero img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-mask {
  position: absolute;
  inset: 0;
  background: rgba(11, 29, 44, .45);
}
.hero-inner {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  color: var(--paper);
}
.hero-inner h1 {
  margin: 0;
  font-size: 32px;
  line-height: 1.25;
}
.hero-inner .sub {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  font-size: 12px;
  color: rgba(251, 247, 238, .85);
  margin-top: 6px;
}
.rate {
  color: var(--cinnabar-300);
  font-weight: 600;
}
/* 摘要卡叠压头图（§3.0 B.3） */
.summary-card {
  margin-top: -24px;
  position: relative;
  z-index: 1;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 16px 18px;
}
.summary-card .intro {
  margin: 0 0 10px;
  line-height: 1.7;
  color: var(--ink);
  font-size: 14px;
}
.stay-info {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin: 12px 0 0;
  padding-top: 10px;
  border-top: 1px solid var(--line-soft);
  color: var(--muted);
  font-size: 13px;
}
.stay-info b {
  color: var(--ind-700);
  font-size: 14px;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tag {
  font-size: 12px;
  color: var(--ind-700);
  background: var(--ind-100);
  border: 1px solid var(--line);
  padding: 2px 8px;
  border-radius: var(--radius);
}
.tag-facility {
  background: #fff;
  color: var(--text-2);
}
/* 正文分节（§3.3.3） */
.sect {
  border-top: 1px solid var(--line);
  margin-top: 20px;
  padding: 20px 0;
}
.sect-title {
  display: block;
  font-size: 15px;
  margin-bottom: 12px;
  color: var(--ind-800);
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
  border-color: var(--cinnabar-300);
  color: var(--cinnabar-700);
}
.retry {
  margin-left: 6px;
  border: 0;
  background: none;
  color: var(--ind-700);
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
  color: var(--ind-800);
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
  border-radius: var(--radius);
  padding: 4px 12px;
  font-size: 13px;
  color: var(--text-2);
}
.chip.on {
  background: var(--ind-700);
  color: var(--paper);
  border-color: var(--ind-700);
}

.bk-mask {
  position: fixed;
  inset: 0;
  background: rgba(11, 29, 44, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.bk {
  width: 420px;
  max-width: 92vw;
  padding: 18px;
}
.bk h3 {
  margin: 0 0 12px;
  color: var(--ind-800);
}
.bk-f {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.bk-f span {
  width: 40px;
  font-size: 13px;
  color: var(--muted);
}
.bk-f input {
  flex: 1;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 7px 10px;
}
.bk-est {
  font-size: 13px;
  color: var(--text-2);
}
.bk-est b {
  color: var(--cinnabar);
  font-family: var(--font-display);
  font-size: 16px;
}
.bk-tip {
  color: var(--muted);
  font-size: 12px;
}
.bk-acts {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}
.bk-cancel {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: var(--radius);
  padding: 7px 16px;
  cursor: pointer;
}
.bk-ok {
  background: var(--cinnabar);
  color: var(--paper);
  border: 0;
  border-radius: var(--radius);
  padding: 7px 18px;
  font-weight: 600;
  cursor: pointer;
}
.bk-ok:disabled {
  background: var(--ind-100);
  cursor: not-allowed;
}
</style>
