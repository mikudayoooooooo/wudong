<script setup lang="ts">
// 农产品列表页：搜索/分类筛选
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { searchFarmProducts, getFarmProductCategories } from '@/api/food';
import type { FarmProduct } from '@/api/types';

const route = useRoute();
const router = useRouter();

const list = ref<FarmProduct[]>([]);
const categories = ref<any[]>([]);
const loading = ref(false);
const failed = ref(false);

const keyword = ref('');
const selectedCategory = ref<number | undefined>();
const sortBy = ref('new');

const sortOptions = [
  { value: 'new', label: '最新' },
  { value: 'sales_desc', label: '销量' },
  { value: 'price_asc', label: '价格升序' },
  { value: 'price_desc', label: '价格降序' },
];

/** 加载分类 */
const loadCategories = async () => {
  try {
    categories.value = await getFarmProductCategories();
  } catch (e) {
    console.error('加载分类失败', e);
  }
};

/** 搜索农产品 */
const doSearch = async () => {
  loading.value = true;
  failed.value = false;
  try {
    list.value = await searchFarmProducts({
      keyword: keyword.value || undefined,
      categoryId: selectedCategory.value,
      sort: sortBy.value,
    });

    // 同步 URL
    const query: any = {};
    if (keyword.value) query.keyword = keyword.value;
    if (selectedCategory.value) query.categoryId = selectedCategory.value;
    if (sortBy.value !== 'new') query.sort = sortBy.value;
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
  selectedCategory.value = route.query.categoryId ? Number(route.query.categoryId) : undefined;
  sortBy.value = (route.query.sort as string) || 'new';
};

onMounted(async () => {
  parseQuery();
  await loadCategories();
  await doSearch();
});
</script>

<template>
  <main class="container">
    <h1 class="page-title">新鲜农产品</h1>

    <!-- 搜索栏 -->
    <section class="search-bar">
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索农产品..."
        class="search-input"
        @keyup.enter="doSearch"
      />
      <button type="button" class="btn-search" @click="doSearch">搜索</button>
    </section>

    <!-- 筛选栏 -->
    <section class="filter-bar">
      <div class="filter-group">
        <label>分类：</label>
        <button
          type="button"
          :class="{ active: !selectedCategory }"
          @click="selectedCategory = undefined; doSearch()"
        >
          全部
        </button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectedCategory = cat.id; doSearch()"
        >
          {{ cat.name }}
        </button>
      </div>

      <div class="filter-group">
        <label>排序：</label>
        <select v-model="sortBy" @change="doSearch">
          <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </section>

    <!-- 农产品列表 -->
    <section class="product-section">
      <div v-if="loading" class="state-note">正在加载农产品...</div>
      <div v-else-if="failed" class="state-note error">
        农产品加载失败，请稍后重试
        <button type="button" class="retry" @click="doSearch">重新加载</button>
      </div>
      <div v-else-if="list.length" class="product-grid">
        <article v-for="p in list" :key="p.id" class="product-card">
          <img :src="p.coverImage" :alt="p.name" class="product-img" />
          <div class="product-info">
            <h3 class="product-name">{{ p.name }}</h3>
            <div v-if="p.origin" class="origin">产地：{{ p.origin }}</div>
            <div class="product-meta">
              <span class="price">¥{{ p.price }}<span v-if="p.unit">/{{ p.unit }}</span></span>
              <span class="sales">已售 {{ p.sales }}</span>
            </div>
            <button type="button" class="btn-buy" disabled>
              购买（即将上线）
            </button>
          </div>
        </article>
      </div>
      <p v-else class="empty-state">没有符合当前条件的农产品</p>
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
  border: 1px solid #ddd;
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
  background: #f8f8f8;
  border-radius: 4px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 500;
  color: #666;
}

.filter-group button {
  padding: 6px 15px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.filter-group button.active {
  background: var(--green-600);
  color: white;
  border-color: var(--green-600);
}

.filter-group select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 15px;
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.origin {
  font-size: 12px;
  color: var(--green-700);
  margin-bottom: 10px;
  background: #f0f9f0;
  padding: 4px 8px;
  border-radius: 3px;
  display: inline-block;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.price {
  font-size: 18px;
  color: #e74c3c;
  font-weight: bold;
}

.price span {
  font-size: 12px;
  font-weight: normal;
}

.sales {
  font-size: 12px;
  color: #999;
}

.btn-buy {
  width: 100%;
  padding: 8px;
  background: var(--green-600);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: not-allowed;
  opacity: 0.6;
}

.state-note {
  text-align: center;
  padding: 40px;
  color: #666;
}

.state-note.error {
  color: #e74c3c;
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
  color: #999;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
