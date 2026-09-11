<script setup lang="ts">
// 餐厅列表页：搜索/排序
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { searchRestaurants } from '@/api/food';
import type { Restaurant } from '@/api/types';

const route = useRoute();
const router = useRouter();

const list = ref<Restaurant[]>([]);
const loading = ref(false);
const failed = ref(false);

const keyword = ref('');
const sortBy = ref('rating');

const sortOptions = [
  { value: 'rating', label: '评分最高' },
  { value: 'distance', label: '距离最近' },
  { value: 'price', label: '人均最低' },
];

/** 搜索餐厅 */
const doSearch = async () => {
  loading.value = true;
  failed.value = false;
  try {
    // 可以获取用户位置，这里暂时不传
    list.value = await searchRestaurants({
      keyword: keyword.value || undefined,
      sort: sortBy.value,
    });

    // 同步 URL
    const query: any = {};
    if (keyword.value) query.keyword = keyword.value;
    if (sortBy.value !== 'rating') query.sort = sortBy.value;
    router.replace({ query });
  } catch (e) {
    console.error('搜索失败', e);
    failed.value = true;
  } finally {
    loading.value = false;
  }
};

/** 从 URL 解析筛选条件 */
const parseQuery = () => {
  keyword.value = (route.query.keyword as string) || '';
  sortBy.value = (route.query.sort as string) || 'rating';
};

/** 跳转详情 */
const goDetail = (id: number) => {
  router.push({ name: 'restaurant-detail', params: { id } });
};

onMounted(async () => {
  parseQuery();
  await doSearch();
});
</script>

<template>
  <main class="container">
    <h1 class="page-title">特色餐厅</h1>

    <!-- 搜索栏 -->
    <section class="search-bar">
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索餐厅..."
        class="search-input"
        @keyup.enter="doSearch"
      />
      <button type="button" class="btn-search" @click="doSearch">搜索</button>
    </section>

    <!-- 排序栏 -->
    <section class="filter-bar">
      <div class="filter-group">
        <label>排序：</label>
        <select v-model="sortBy" @change="doSearch">
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </section>

    <!-- 餐厅列表 -->
    <section class="restaurant-section">
      <div v-if="loading" class="state-note">正在加载餐厅...</div>
      <div v-else-if="failed" class="state-note error">
        餐厅加载失败，请稍后重试
        <button type="button" class="retry" @click="doSearch">重新加载</button>
      </div>
      <div v-else-if="list.length" class="restaurant-list">
        <article
          v-for="r in list"
          :key="r.id"
          class="restaurant-card"
          @click="goDetail(r.id)"
        >
          <img :src="r.coverImage" :alt="r.name" class="restaurant-img" />
          <div class="restaurant-info">
            <h3 class="restaurant-name">{{ r.name }}</h3>
            <p v-if="r.specialty" class="specialty">{{ r.specialty }}</p>
            <div class="meta-row">
              <span class="rating">⭐ {{ r.rating.toFixed(1) }}</span>
              <span class="avg-price">人均 ¥{{ r.avgPrice }}</span>
              <span v-if="r.distance" class="distance">{{ r.distance }}km</span>
            </div>
            <p class="address">📍 {{ r.address }}</p>
            <p v-if="r.businessHours" class="hours">🕐 {{ r.businessHours }}</p>
          </div>
        </article>
      </div>
      <p v-else class="empty-state">没有符合当前条件的餐厅</p>
    </section>
  </main>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 28px;
  color: var(--green-900);
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid var(--line);
  border-radius: 4px;
  font-size: 14px;
}

.btn-search {
  padding: 10px 30px;
  background: var(--green-600);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-search:hover {
  background: var(--green-700);
}

.filter-bar {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  padding: 15px;
  background: var(--ind-50);
  border-radius: 4px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 500;
  color: var(--text-2);
}

.filter-group select {
  padding: 6px 12px;
  border: 1px solid var(--line);
  border-radius: 4px;
  font-size: 13px;
}

.restaurant-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.restaurant-card {
  display: flex;
  gap: 20px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.restaurant-card:hover {
  transform: translateY(-2px);
  box-shadow: none;
}

.restaurant-img {
  width: 250px;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.restaurant-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.restaurant-name {
  font-size: 20px;
  margin: 0;
  color: var(--ink);
}

.specialty {
  margin: 0;
  color: var(--green-700);
  font-size: 14px;
}

.meta-row {
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 14px;
}

.rating {
  color: var(--cinnabar);
  font-weight: 500;
}

.avg-price {
  color: var(--cinnabar);
  font-weight: 500;
}

.distance {
  color: var(--text-2);
}

.address,
.hours {
  margin: 0;
  font-size: 13px;
  color: var(--text-2);
}

.state-note {
  text-align: center;
  padding: 40px;
  color: var(--text-2);
}

.state-note.error {
  color: var(--cinnabar);
}

.retry {
  margin-left: 10px;
  padding: 5px 15px;
  background: var(--green-600);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: var(--text-3);
}

@media (max-width: 768px) {
  .restaurant-card {
    flex-direction: column;
  }

  .restaurant-img {
    width: 100%;
  }
}
</style>
