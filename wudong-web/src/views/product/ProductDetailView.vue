<script setup lang="ts">
// 商品详情页：展示商品信息、SKU、评价，支持购买
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { productDetail, getProductReviews } from '@/api/product';
import { addToCart } from '@/api/order';
import { PRODUCT_COVERS } from '@/data/photos';
import type { ProductDetail } from '@/api/types';

const route = useRoute();
const router = useRouter();

const product = ref<ProductDetail | null>(null);
const reviews = ref<any[]>([]);
const loading = ref(false);
const failed = ref(false);
const currentImage = ref('');
const purchasing = ref(false);

/** 加载商品详情 */
const loadProduct = async () => {
  loading.value = true;
  failed.value = false;
  try {
    const id = Number(route.params.id);
    product.value = await productDetail(id);
    currentImage.value = PRODUCT_COVERS[product.value.id] || product.value.coverImage;

    // 加载评价
    const reviewData = await getProductReviews(id);
    reviews.value = reviewData.list || [];
  } catch (e) {
    console.error('加载商品失败', e);
    failed.value = true;
  } finally {
    loading.value = false;
  }
};

/** 加入购物车 */
const handleAddToCart = async () => {
  if (!product.value) return;

  purchasing.value = true;
  try {
    await addToCart(product.value.id, 1, 1); // itemId, itemType=1(非遗商品), quantity=1
    alert('已加入购物车！');
  } catch (e: any) {
    if (e.message?.includes('登录')) {
      alert('请先登录后再购买');
    } else {
      alert('加入购物车失败：' + (e.message || '请稍后重试'));
    }
  } finally {
    purchasing.value = false;
  }
};

/** 立即购买（加购后去结算；后端 /app/order/create 直创缺 skuId 支持暂不可用，统一走购物车） */
const handleBuyNow = async () => {
  if (!product.value) return;

  purchasing.value = true;
  try {
    await addToCart(product.value.id, 1, 1); // itemType=1(非遗商品)
    router.push('/cart');
  } catch (e: any) {
    if (e.message?.includes('登录')) {
      alert('请先登录后再购买');
    } else {
      alert('购买失败：' + (e.message || '请稍后重试'));
    }
  } finally {
    purchasing.value = false;
  }
};

/** 切换图片 */
const selectImage = (img: string) => {
  currentImage.value = img;
};

/** 返回列表 */
const goBack = () => {
  router.push({ name: 'products' });
};

onMounted(() => {
  loadProduct();
});
</script>

<template>
  <main>
    <div v-if="loading" class="state-note">正在加载商品详情...</div>
    <div v-else-if="failed" class="state-note error">
      商品加载失败，请稍后重试
      <button type="button" class="retry" @click="loadProduct">重新加载</button>
    </div>

    <template v-else-if="product">
      <!-- 页头：全幅 320px 主图，宋体纸色标题压图（规范 §3.3.1） -->
      <section class="detail-hero img-frame" :class="{ 'no-cover': !currentImage }">
        <img v-if="currentImage" :src="currentImage" :alt="product.name" />
        <div class="hero-mask" aria-hidden="true" />
        <div class="hero-inner">
          <h1 class="font-display">{{ product.name }}</h1>
          <div v-if="product.rating" class="sub">
            ★ {{ product.rating.toFixed(1) }} · {{ product.reviewCount }} 条评价 · 已售 {{ product.sales }}
          </div>
        </div>
      </section>

      <div class="container">
        <button type="button" class="btn-back" @click="goBack">← 返回商品列表</button>

        <!-- 摘要卡：叠压头图（§3.0 B.3） -->
        <section class="summary-card">
          <div class="price-block">
            <span class="price font-display">¥{{ product.price }}</span>
            <span class="stock">库存：{{ product.stock }}</span>
          </div>
          <div class="action-buttons">
            <button
              type="button"
              class="btn-cart"
              :disabled="purchasing || product.stock <= 0"
              @click="handleAddToCart"
            >
              {{ purchasing ? '处理中...' : '加入购物车' }}
            </button>
            <button
              type="button"
              class="btn-buy"
              :disabled="purchasing || product.stock <= 0"
              @click="handleBuyNow"
            >
              {{ purchasing ? '处理中...' : '立即购买' }}
            </button>
          </div>
        </section>
        <p v-if="product.stock <= 0" class="out-of-stock">该商品暂时缺货</p>

        <div v-if="product.images && product.images.length > 1" class="thumbnail-list">
          <img
            v-for="(img, idx) in product.images"
            :key="idx"
            :src="img"
            :alt="`图片${idx + 1}`"
            :class="{ active: currentImage === img }"
            @click="selectImage(img)"
          />
        </div>

        <section v-if="product.craftIntro" class="sect">
          <b class="sect-title font-display">工艺介绍</b>
          <p class="craft-intro">{{ product.craftIntro }}</p>
        </section>

        <section class="sect">
          <b class="sect-title font-display">商品详情</b>
          <div v-if="product.description" class="description-content">
            {{ product.description }}
          </div>
          <p v-else class="no-content">暂无详情信息</p>
        </section>

        <section class="sect">
          <b class="sect-title font-display">用户评价 ({{ reviews.length }})</b>
          <div v-if="reviews.length" class="review-list">
            <article v-for="review in reviews" :key="review.id" class="review-item">
              <div class="review-header">
                <span class="user-name">{{ review.user?.nickname || '匿名用户' }}</span>
                <span class="rating">★ {{ review.rating }}</span>
              </div>
              <p class="review-content">{{ review.content }}</p>
              <div v-if="review.images && review.images.length" class="review-images">
                <img v-for="(img, idx) in review.images" :key="idx" :src="img" :alt="`评价图${idx}`" />
              </div>
              <time class="review-time">{{ new Date(review.createTime).toLocaleDateString() }}</time>
            </article>
          </div>
          <p v-else class="no-content">暂无评价</p>
        </section>
      </div>
    </template>
  </main>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px 44px;
}

.btn-back {
  margin: 14px 0 12px;
  padding: 7px 16px;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 13px;
  color: var(--text-2);
}

.btn-back:hover {
  border-color: var(--ind-300);
  color: var(--ind-700);
}

/* 页头（§3.3.1）：全幅主图 + 宋体纸色标题压图 */
.detail-hero {
  position: relative;
  height: 320px;
  background: var(--ind-800);
}

.detail-hero.no-cover {
  background: var(--ind-800) url("../assets/pattern/diamond-dark.svg") center/560px repeat;
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
  font-size: 12px;
  color: rgba(251, 247, 238, .85);
  margin-top: 6px;
}

/* 摘要卡叠压头图（§3.0 B.3） */
.summary-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: -24px;
  position: relative;
  z-index: 1;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 14px 18px;
}

.price-block {
  display: flex;
  align-items: baseline;
  gap: 14px;
}

.price {
  font-size: 26px;
  color: var(--cinnabar);
  font-weight: 700;
}

.stock {
  font-size: 13px;
  color: var(--text-2);
}

.thumbnail-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.thumbnail-list img {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border: 2px solid var(--line);
  border-radius: var(--radius);
  cursor: pointer;
}

.thumbnail-list img:hover,
.thumbnail-list img.active {
  border-color: var(--ind-700);
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

.craft-intro {
  margin: 0;
  padding: 12px 14px;
  background: var(--ind-50);
  border-left: 3px solid var(--ind-700);
  border-radius: var(--radius);
  line-height: 1.6;
  color: var(--text-1);
}

.description-content {
  line-height: 1.8;
  color: var(--text-1);
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-buttons button {
  padding: 11px 26px;
  border: 1px solid var(--ind-700);
  border-radius: var(--radius);
  font-size: 14px;
  cursor: pointer;
}

.action-buttons button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn-cart {
  background: #fff;
  color: var(--ind-700);
}

.btn-cart:not(:disabled):hover {
  background: var(--ind-50);
  border-color: var(--ind-300);
}

.btn-buy {
  background: var(--cinnabar);
  color: var(--paper);
  border-color: var(--cinnabar);
}

.btn-buy:not(:disabled):hover {
  background: var(--cinnabar-700);
}

.out-of-stock {
  margin-top: 10px;
  color: var(--cinnabar);
  text-align: center;
}

.review-list {
  display: flex;
  flex-direction: column;
}

.review-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--line-soft);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.user-name {
  font-weight: 500;
  color: var(--ink);
}

.rating {
  color: var(--cinnabar);
  font-weight: 500;
}

.review-content {
  margin: 10px 0;
  line-height: 1.6;
  color: var(--text-1);
}

.review-images {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.review-images img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.review-time {
  font-size: 12px;
  color: var(--text-3);
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
  background: var(--ind-700);
  color: var(--paper);
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
}

@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
  }
}
</style>
