<script setup lang="ts">
// 餐厅详情页：展示餐厅信息、菜品列表
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { restaurantDetail } from '@/api/food';
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
        <img :src="detail.info.coverImage" :alt="detail.info.name" class="cover-image" />

        <div class="info-content">
          <h1 class="restaurant-name">{{ detail.info.name }}</h1>

          <div v-if="detail.info.specialty" class="specialty">
            <strong>特色：</strong>{{ detail.info.specialty }}
          </div>

          <div class="meta-grid">
            <div class="meta-item">
              <span class="label">评分</span>
              <span class="value">⭐ {{ detail.info.rating.toFixed(1) }}</span>
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
            <p class="address">📍 {{ detail.info.address }}</p>
            <p v-if="detail.info.phone" class="phone">📞 {{ detail.info.phone }}</p>
          </div>

          <button type="button" class="btn-reserve" disabled>
            立即预订（即将上线）
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
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-back:hover {
  background: #e0e0e0;
}

.info-section {
  display: grid;
  grid-template-columns: 500px 1fr;
  gap: 30px;
  margin-bottom: 40px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  color: #333;
}

.specialty {
  padding: 10px 15px;
  background: #f0f9f0;
  border-left: 3px solid var(--green-600);
  border-radius: 4px;
  color: #555;
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
  color: #999;
}

.meta-item .value {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.contact-info {
  padding: 15px;
  background: #f8f8f8;
  border-radius: 4px;
}

.address,
.phone {
  margin: 5px 0;
  font-size: 14px;
  color: #555;
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
  color: #333;
}

.dish-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.dish-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.dish-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  color: #333;
}

.dish-desc {
  margin: 0 0 10px;
  font-size: 13px;
  color: #666;
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
  color: #e74c3c;
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
  color: #999;
}

.state-note {
  text-align: center;
  padding: 60px;
  color: #666;
}

.state-note.error {
  color: #e74c3c;
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
</style>
