<template>
  <div class="farm-product-detail">
    <!-- 顶部导航 -->
    <div class="detail-header">
      <button @click="goBack" class="back-btn">← 返回农产品列表</button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 加载失败 -->
    <div v-else-if="failed" class="error">
      <p>商品加载失败，请稍后重试</p>
      <button @click="loadProduct" class="retry-btn">重试</button>
    </div>

    <!-- 商品详情 -->
    <div v-else-if="product" class="detail-content">
      <!-- 商品信息卡片 -->
      <div class="product-card">
        <!-- 商品图片 -->
        <div class="product-image-section">
          <img :src="currentImage" :alt="product.name" class="main-image" />
          <div v-if="product.images && product.images.length > 0" class="image-thumbnails">
            <img
              v-for="(img, idx) in product.images"
              :key="idx"
              :src="img"
              :alt="`${product.name} ${idx + 1}`"
              @click="selectImage(img)"
              :class="{ active: currentImage === img }"
              class="thumbnail"
            />
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="product-info-section">
          <h1 class="product-name">{{ product.name }}</h1>

          <div class="product-meta">
            <span class="origin" v-if="product.origin">产地：{{ product.origin }}</span>
            <span class="unit">单位：{{ product.unit }}</span>
          </div>

          <div class="price-section">
            <span class="price">¥{{ product.price }}</span>
            <span class="unit-label">/ {{ product.unit }}</span>
          </div>

          <div class="stock-info">
            <span v-if="product.stock > 0" class="in-stock">
              库存：{{ product.stock }} {{ product.unit }}
            </span>
            <span v-else class="out-of-stock">暂无库存</span>
          </div>

          <!-- 数量选择 -->
          <div class="quantity-section">
            <label>购买数量：</label>
            <div class="quantity-control">
              <button @click="decreaseQuantity" :disabled="quantity <= 1" class="qty-btn">-</button>
              <input
                type="number"
                v-model.number="quantity"
                min="1"
                :max="product.stock"
                class="qty-input"
              />
              <button
                @click="increaseQuantity"
                :disabled="quantity >= product.stock"
                class="qty-btn"
              >
                +
              </button>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <button
              @click="handleAddToCart"
              :disabled="product.stock <= 0 || purchasing"
              class="add-to-cart-btn"
            >
              {{ purchasing ? '加入中...' : '加入购物车' }}
            </button>
            <button
              @click="handleBuyNow"
              :disabled="product.stock <= 0 || purchasing"
              class="buy-now-btn"
            >
              立即购买
            </button>
          </div>
        </div>
      </div>

      <!-- 商品详情描述 -->
      <div v-if="product.description" class="product-description">
        <h2>产品详情</h2>
        <div class="description-content">{{ product.description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { farmProductDetail } from '@/api/food';
import { addToCart } from '@/api/order';
import type { FarmProduct } from '@/api/types';

const route = useRoute();
const router = useRouter();

const product = ref<FarmProduct | null>(null);
const loading = ref(false);
const failed = ref(false);
const currentImage = ref('');
const purchasing = ref(false);
const quantity = ref(1);

/** 加载农产品详情 */
const loadProduct = async () => {
  loading.value = true;
  failed.value = false;
  try {
    const id = Number(route.params.id);
    const p = await farmProductDetail(id);
    product.value = p;
    currentImage.value = p.coverImage;
  } catch (e) {
    console.error('加载农产品失败', e);
    failed.value = true;
  } finally {
    loading.value = false;
  }
};

/** 减少数量 */
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

/** 增加数量 */
const increaseQuantity = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++;
  }
};

/** 加入购物车 */
const handleAddToCart = async () => {
  if (!product.value) return;

  purchasing.value = true;
  try {
    // itemId, itemType=2(农产品), quantity
    await addToCart(product.value.id, 2, quantity.value);
    alert('已加入购物车！');

    // 触发购物车更新事件
    window.dispatchEvent(new Event('cart-updated'));
  } catch (e: any) {
    if (e.message?.includes('登录')) {
      alert('请先登录后再购买');
      router.push('/login');
    } else {
      alert('加入购物车失败：' + (e.message || '请稍后重试'));
    }
  } finally {
    purchasing.value = false;
  }
};

/** 立即购买（跳转到购物车结算） */
const handleBuyNow = async () => {
  await handleAddToCart();
  if (!purchasing.value) {
    router.push('/cart');
  }
};

/** 切换图片 */
const selectImage = (img: string) => {
  currentImage.value = img;
};

/** 返回列表 */
const goBack = () => {
  router.push({ name: 'farm-products' });
};

onMounted(() => {
  loadProduct();
});
</script>

<style scoped>
.farm-product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: var(--ind-50);
}

.detail-header {
  margin-bottom: 20px;
}

.back-btn {
  padding: 10px 20px;
  background: white;
  border: 1px solid var(--line);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.back-btn:hover {
  background: var(--ind-50);
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--ind-50);
  border-top: 4px solid var(--cinnabar);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
}

.retry-btn {
  margin-top: 20px;
  padding: 10px 30px;
  background: var(--cinnabar);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* 商品卡片 */
.product-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: none;
  margin-bottom: 20px;
}

.product-image-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--line);
}

.image-thumbnails {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}

.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.thumbnail:hover {
  border-color: var(--cinnabar);
}

.thumbnail.active {
  border-color: var(--cinnabar);
}

.product-info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-name {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
  color: var(--ink);
}

.product-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: var(--text-2);
}

.origin {
  color: var(--cinnabar);
  font-weight: 500;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price {
  font-size: 36px;
  font-weight: bold;
  color: var(--cinnabar);
}

.unit-label {
  font-size: 16px;
  color: var(--text-3);
}

.stock-info {
  font-size: 14px;
}

.in-stock {
  color: var(--cinnabar);
}

.out-of-stock {
  color: var(--cinnabar);
  font-weight: bold;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.quantity-section label {
  font-weight: 500;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--line);
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-btn:hover:not(:disabled) {
  background: var(--ind-50);
}

.qty-input {
  width: 80px;
  height: 36px;
  text-align: center;
  border: 1px solid var(--line);
  border-radius: 4px;
  font-size: 16px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.add-to-cart-btn,
.buy-now-btn {
  flex: 1;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-to-cart-btn {
  background: #fff;
  color: var(--cinnabar);
  border: 2px solid var(--cinnabar);
}

.add-to-cart-btn:hover:not(:disabled) {
  background: var(--ind-100);
}

.buy-now-btn {
  background: var(--cinnabar);
  color: white;
}

.buy-now-btn:hover:not(:disabled) {
  background: var(--cinnabar-700);
}

.add-to-cart-btn:disabled,
.buy-now-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 商品描述 */
.product-description {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: none;
}

.product-description h2 {
  font-size: 24px;
  margin: 0 0 20px 0;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--ind-50);
}

.description-content {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-2);
  white-space: pre-wrap;
}

/* 响应式 */
@media (max-width: 768px) {
  .product-card {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .main-image {
    height: 300px;
  }

  .product-name {
    font-size: 22px;
  }

  .price {
    font-size: 28px;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
