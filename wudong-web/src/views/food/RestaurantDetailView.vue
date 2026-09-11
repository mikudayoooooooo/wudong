<script setup lang="ts">
// 餐厅详情页：展示餐厅信息、菜品列表、餐位预订
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { restaurantDetail, getAvailableTimeSlots, createReservation } from '@/api/food';
import Icon from '@/components/Icon.vue';
import { RESTAURANT_COVERS } from '@/data/photos';
import type { RestaurantDetail } from '@/api/types';

const route = useRoute();
const router = useRouter();

const detail = ref<RestaurantDetail | null>(null);
const loading = ref(false);
const failed = ref(false);

/** 加载餐厅详情 */
const loadRestaurant = async () => {
  loading.value = true;
  failed.value = false;
  try {
    const id = Number(route.params.id);
    detail.value = await restaurantDetail(id);
  } catch (e) {
    console.error('加载餐厅失败', e);
    failed.value = true;
  } finally {
    loading.value = false;
  }
};

/** 返回列表 */
const goBack = () => {
  router.push({ name: 'restaurants' });
};

/** 预订弹窗 */
const booking = ref({
  open: false,
  loading: false,
  slots: [] as any[],
  slotsLoading: false,
  date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  timeSlotId: 0,
  peopleCount: 2,
  contactName: '',
  contactPhone: '',
});

async function openBooking() {
  booking.value.open = true;
  booking.value.timeSlotId = 0;
  await loadSlots();
}

async function loadSlots() {
  booking.value.slotsLoading = true;
  booking.value.timeSlotId = 0;
  try {
    booking.value.slots = await getAvailableTimeSlots(
      Number(route.params.id),
      booking.value.date
    );
  } catch {
    booking.value.slots = [];
  } finally {
    booking.value.slotsLoading = false;
  }
}

async function submitBooking() {
  const b = booking.value;
  if (!b.timeSlotId) {
    alert('请选择预订时段');
    return;
  }
  if (!b.contactName || !b.contactPhone) {
    alert('请填写联系人和电话');
    return;
  }
  b.loading = true;
  try {
    await createReservation({
      restaurantId: Number(route.params.id),
      timeSlotId: b.timeSlotId,
      reservationDate: b.date,
      peopleCount: b.peopleCount,
      contactName: b.contactName,
      contactPhone: b.contactPhone,
    });
    alert('预订成功！可在「我的预订」中查看');
    b.open = false;
    router.push('/my/reservations');
  } catch (e: any) {
    alert(e?.message || '预订失败');
  } finally {
    b.loading = false;
  }
}

onMounted(() => {
  loadRestaurant();
});
</script>

<template>
  <main class="container">
    <button type="button" class="btn-back" @click="goBack">← 返回餐厅列表</button>

    <div v-if="loading" class="state-note">正在加载餐厅详情...</div>
    <div v-else-if="failed" class="state-note error">
      餐厅加载失败，请稍后重试
      <button type="button" class="retry" @click="loadRestaurant">重新加载</button>
    </div>

    <article v-else-if="detail" class="restaurant-detail">
      <!-- 餐厅基本信息 -->
      <section class="info-section">
        <img :src="RESTAURANT_COVERS[detail.info.id] || detail.info.coverImage" :alt="detail.info.name" class="cover-image" />

        <div class="info-content">
          <h1 class="restaurant-name">{{ detail.info.name }}</h1>

          <div v-if="detail.info.specialty" class="specialty">
            <strong>特色：</strong>{{ detail.info.specialty }}
          </div>

          <div class="meta-grid">
            <div class="meta-item">
              <span class="label">评分</span>
              <span class="value">★ {{ detail.info.rating.toFixed(1) }}</span>
            </div>
            <div class="meta-item">
              <span class="label">人均</span>
              <span class="value">¥{{ detail.info.avgPrice }}</span>
            </div>
            <div v-if="detail.info.businessHours" class="meta-item">
              <span class="label">营业时间</span>
              <span class="value">{{ detail.info.businessHours }}</span>
            </div>
          </div>

          <div class="contact-info">
            <p class="address"><Icon name="map-pin" :size="12" /> {{ detail.info.address }}</p>
            <p v-if="detail.info.phone" class="phone"><Icon name="phone" :size="12" /> {{ detail.info.phone }}</p>
          </div>

          <button type="button" class="btn-reserve" @click="openBooking">
            立即预订
          </button>
        </div>
      </section>

      <!-- 菜品列表 -->
      <section class="dishes-section">
        <h2>推荐菜品</h2>
        <div v-if="detail.dishes && detail.dishes.length" class="dish-grid">
          <article v-for="dish in detail.dishes" :key="dish.id" class="dish-card">
            <img
              v-if="dish.image"
              :src="dish.image"
              :alt="dish.name"
              class="dish-img"
            />
            <div class="dish-info">
              <h3 class="dish-name">{{ dish.name }}</h3>
              <p v-if="dish.description" class="dish-desc">{{ dish.description }}</p>
              <div class="dish-meta">
                <span class="dish-price">¥{{ dish.price }}</span>
                <span v-if="dish.isRecommend" class="badge">推荐</span>
              </div>
            </div>
          </article>
        </div>
        <p v-else class="no-content">暂无菜品信息</p>
      </section>
    </article>

    <!-- 预订弹窗 -->
    <div v-if="booking.open" class="booking-mask" @click.self="booking.open = false">
      <div class="booking card">
        <h3>预订餐位</h3>
        <label class="f">
          <span>日期</span>
          <input type="date" v-model="booking.date" :min="new Date().toISOString().slice(0, 10)" @change="loadSlots" />
        </label>
        <label class="f">
          <span>时段</span>
          <select v-model="booking.timeSlotId">
            <option :value="0" disabled>{{ booking.slotsLoading ? '时段加载中…' : '请选择时段' }}</option>
            <option v-for="s in booking.slots" :key="s.id" :value="s.id">
              {{ s.timePeriod || s.name || `时段 #${s.id}` }}{{ s.remain != null ? `（余 ${s.remain}）` : '' }}
            </option>
          </select>
        </label>
        <label class="f">
          <span>人数</span>
          <input type="number" v-model.number="booking.peopleCount" min="1" max="20" />
        </label>
        <label class="f">
          <span>联系人</span>
          <input v-model="booking.contactName" maxlength="20" placeholder="姓名" />
        </label>
        <label class="f">
          <span>电话</span>
          <input v-model="booking.contactPhone" maxlength="11" placeholder="手机号" />
        </label>
        <div class="d-acts">
          <button class="mini" @click="booking.open = false">取消</button>
          <button class="mini primary" :disabled="booking.loading" @click="submitBooking">
            {{ booking.loading ? '提交中…' : '提交预订' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.btn-back {
  margin-bottom: 20px;
  padding: 8px 20px;
  background: var(--ind-50);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-back:hover {
  background: var(--ind-100);
}

.info-section {
  display: grid;
  grid-template-columns: 500px 1fr;
  gap: 30px;
  margin-bottom: 40px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: none;
}

.cover-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 8px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.restaurant-name {
  font-size: 28px;
  margin: 0;
  color: var(--ink);
}

.specialty {
  padding: 10px 15px;
  background: var(--ind-100);
  border-left: 3px solid var(--green-600);
  border-radius: 4px;
  color: var(--text-1);
  font-size: 14px;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.meta-item .label {
  font-size: 13px;
  color: var(--text-3);
}

.meta-item .value {
  font-size: 16px;
  font-weight: 500;
  color: var(--ink);
}

.contact-info {
  padding: 15px;
  background: var(--ind-50);
  border-radius: 4px;
}

.address,
.phone {
  margin: 5px 0;
  font-size: 14px;
  color: var(--text-1);
}

.btn-reserve {
  padding: 15px;
  background: var(--green-600);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: not-allowed;
  opacity: 0.6;
  margin-top: 10px;
}

.dishes-section {
  margin-top: 40px;
}

.dishes-section h2 {
  font-size: 22px;
  margin-bottom: 20px;
  color: var(--ink);
}

.dish-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.dish-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.dish-card:hover {
  transform: translateY(-4px);
  box-shadow: none;
}

.dish-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.dish-info {
  padding: 15px;
}

.dish-name {
  font-size: 16px;
  margin: 0 0 8px;
  color: var(--ink);
}

.dish-desc {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dish-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dish-price {
  font-size: 18px;
  color: var(--cinnabar);
  font-weight: bold;
}

.badge {
  padding: 3px 8px;
  background: var(--green-600);
  color: white;
  font-size: 11px;
  border-radius: 3px;
}

.no-content {
  text-align: center;
  padding: 40px;
  color: var(--text-3);
}

.state-note {
  text-align: center;
  padding: 60px;
  color: var(--text-2);
}

.state-note.error {
  color: var(--cinnabar);
}

.retry {
  margin-left: 10px;
  padding: 8px 20px;
  background: var(--green-600);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .info-section {
    grid-template-columns: 1fr;
  }

  .dish-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.booking-mask {
  position: fixed;
  inset: 0;
  background: rgba(11, 29, 44, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.booking {
  width: 420px;
  max-width: 92vw;
  padding: 18px;
}
.booking h3 {
  margin-bottom: 12px;
}
.booking .f {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.booking .f span {
  width: 42px;
  font-size: 13px;
  color: var(--text-2);
}
.booking .f input,
.booking .f select {
  flex: 1;
  border: 1px solid var(--line-soft);
  border-radius: 8px;
  padding: 7px 10px;
}
.d-acts {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}
.mini {
  border: 1px solid var(--line-soft);
  background: #fff;
  border-radius: 12px;
  padding: 5px 14px;
  cursor: pointer;
  font-size: 13px;
}
.mini.primary {
  background: var(--green-600);
  color: #fff;
  border-color: var(--green-600);
}
</style>
