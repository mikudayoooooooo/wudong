<script setup lang="ts">
// 商品列表页：搜索/分类筛选
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { searchProducts, getProductCategories } from '@/api/product';
import { PRODUCT_COVERS } from '@/data/photos';
import type { Product, ProductCategory } from '@/api/types';

const route = useRoute();
const router = useRouter();

const list = ref<Product[]>([]);
const categories = ref<ProductCategory[]>([]);
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
    categories.value = await getProductCategories();
  } catch (e) {
    console.error('加载分类失败', e);
  }
};

/** 搜索商品 */
const doSearch = async () => {
  loading.value = true;
  failed.value = false;
  try {
    list.value = await searchProducts({
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

/** 跳转详情 */
const goDetail = (id: number) => {
  router.push({ name: 'product-detail', params: { id } });
};

onMounted(async () => {
  parseQuery();
  await loadCategories();
  await doSearch();
});
</script>

<template>
  <main class="container">
    <header class="page-head">
      <h1 class="font-display">非遗商品</h1>
      <p class="page-sub">匠人手作 · 寨内自提或快递到家</p>
    </header>

    <!-- 搜索栏 -->
    <section class="search-bar">
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索商品..."
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

    <!-- 商品列表 -->
    <section class="product-section">
      <div v-if="loading" class="state-note">正在加载商品...</div>
      <div v-else-if="failed" class="state-note error">
        商品加载失败，请稍后重试
        <button type="button" class="retry" @click="doSearch">重新加载</button>
      </div>
      <div v-else-if="list.length" class="product-grid">
        <article
          v-for="p in list"
          :key="p.id"
          class="product-card"
          @click="goDetail(p.id)"
        >
          <img v-if="PRODUCT_COVERS[p.id]" :src="PRODUCT_COVERS[p.id]" :alt="p.name" class="product-img" />
          <div v-else class="product-img ph" :class="'ph-' + (p.id % 6)" />
          <div class="product-info">
            <h3 class="product-name">{{ p.name }}</h3>
            <div class="product-meta">
              <span class="price">¥{{ p.price }}</span>
              <span class="sales">已售 {{ p.sales }}</span>
            </div>
            <div v-if="p.rating" class="rating">
              ★ {{ p.rating.toFixed(1) }} ({{ p.reviewCount }})
            </div>
          </div>
        </article>
      </div>
      <p v-else class="empty-state">没有符合当前条件的商品</p>
    </section>
  </main>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-top: 16px;
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
  background: var(--ind-700);
  color: var(--paper);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-search:hover {
  background: var(--ind-800);
}

.filter-bar {
  display: flex;
  gap: 30px;
  padding: 12px 0;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--line);
  flex-wrap: wrap;
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

.filter-group button {
  padding: 6px 15px;
  border: 1px solid var(--line);
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.filter-group button.active {
  background: var(--ind-700);
  color: var(--paper);
  border-color: var(--ind-700);
}

.filter-group select {
  padding: 6px 12px;
  border: 1px solid var(--line);
  border-radius: 4px;
  font-size: 13px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding-bottom: 44px;
}

.product-card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
}

.product-card:hover {
  border-color: var(--ind-300);
}

.product-img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 15px;
  margin: 0 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.price {
  font-size: 18px;
  color: var(--cinnabar);
  font-family: var(--font-display);
  font-weight: 700;
}

.sales {
  font-size: 12px;
  color: var(--text-3);
}

.rating {
  font-size: 12px;
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
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
