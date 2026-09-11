<script setup lang="ts">
// 商品详情页：展示商品信息、SKU、评价，支持购买
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { productDetail, getProductReviews } from '@/api/product';
import { addToCart, createOrder } from '@/api/order';
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
    currentImage.value = product.value.coverImage;

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

/** 立即购买 */
const handleBuyNow = async () => {
  if (!product.value) return;

  purchasing.value = true;
  try {
    const order = await createOrder({
      module: 'product',
      orderType: 1,
      items: [
        {
          productId: product.value.id,
          quantity: 1,
          price: product.value.price
        }
      ]
    });
    alert('订单创建成功！订单号：' + order.orderNo);
    // 可以跳转到订单详情页
    // router.push({ name: 'order-detail', params: { orderNo: order.orderNo } });
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
  <main class="container">
    <button type="button" class="btn-back" @click="goBack">← 返回商品列表</button>

    <div v-if="loading" class="state-note">正在加载商品详情...</div>
    <div v-else-if="failed" class="state-note error">
      商品加载失败，请稍后重试
      <button type="button" class="retry" @click="loadProduct">重新加载</button>
    </div>

    <article v-else-if="product" class="product-detail">
      <!-- 商品图片区 -->
      <section class="image-section">
        <div class="main-image">
          <img :src="currentImage" :alt="product.name" />
        </div>
        <div v-if="product.images && product.images.length" class="thumbnail-list">
          <img
            v-for="(img, idx) in product.images"
            :key="idx"
            :src="img"
            :alt="`图片${idx + 1}`"
            :class="{ active: currentImage === img }"
            @click="selectImage(img)"
          />
        </div>
      </section>

      <!-- 商品信息区 -->
      <section class="info-section">
        <h1 class="product-title">{{ product.name }}</h1>

        <div class="price-section">
          <span class="price">¥{{ product.price }}</span>
          <span class="stock">库存：{{ product.stock }}</span>
        </div>

        <div v-if="product.rating" class="rating-section">
          <span class="rating">★ {{ product.rating.toFixed(1) }}</span>
          <span class="review-count">{{ product.reviewCount }} 条评价</span>
          <span class="sales">已售 {{ product.sales }}</span>
        </div>

        <div v-if="product.craftIntro" class="craft-intro">
          <h3>工艺介绍</h3>
          <p>{{ product.craftIntro }}</p>
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

        <p v-if="product.stock <= 0" class="out-of-stock">该商品暂时缺货</p>
      </section>

      <!-- 商品详情 -->
      <section class="description-section">
        <h2>商品详情</h2>
        <div v-if="product.description" class="description-content">
          {{ product.description }}
        </div>
        <p v-else class="no-content">暂无详情信息</p>
      </section>

      <!-- 商品评价 -->
      <section class="reviews-section">
        <h2>用户评价 ({{ reviews.length }})</h2>
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
  background: var(--ind-50);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-back:hover {
  background: var(--ind-100);
}

.product-detail {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.image-section {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.main-image {
  width: 100%;
  height: 400px;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.thumbnail-list img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 2px solid var(--line);
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.thumbnail-list img:hover,
.thumbnail-list img.active {
  border-color: var(--green-600);
}

.info-section {
  padding: 20px 0;
}

.product-title {
  font-size: 24px;
  margin: 0 0 20px;
  color: var(--ink);
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 20px;
  margin-bottom: 15px;
  padding: 15px;
  background: var(--ind-50);
  border-radius: 4px;
}

.price {
  font-size: 32px;
  color: var(--cinnabar);
  font-weight: bold;
}

.stock {
  font-size: 14px;
  color: var(--text-2);
}

.rating-section {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.rating {
  color: var(--cinnabar);
  font-weight: 500;
}

.review-count,
.sales {
  color: var(--text-2);
}

.craft-intro {
  margin-bottom: 25px;
  padding: 15px;
  background: var(--ind-100);
  border-left: 3px solid var(--green-600);
  border-radius: 4px;
}

.craft-intro h3 {
  font-size: 16px;
  margin: 0 0 10px;
  color: var(--green-700);
}

.craft-intro p {
  margin: 0;
  line-height: 1.6;
  color: var(--text-1);
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.action-buttons button {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-buttons button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn-cart {
  background: white;
  color: var(--green-600);
  border: 1px solid var(--green-600) !important;
}

.btn-cart:not(:disabled):hover {
  background: var(--green-50);
}

.btn-buy {
  background: var(--green-600);
  color: white;
}

.btn-buy:not(:disabled):hover {
  background: var(--green-700);
}

.out-of-stock {
  margin-top: 10px;
  color: var(--cinnabar);
  text-align: center;
}

.description-section,
.reviews-section {
  grid-column: 1 / -1;
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid var(--line);
}

.description-section h2,
.reviews-section h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: var(--ink);
}

.description-content {
  line-height: 1.8;
  color: var(--text-1);
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-item {
  padding: 15px;
  background: var(--ind-50);
  border-radius: 8px;
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
  background: var(--green-600);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
  }
}
</style>
