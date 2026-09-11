<template>
  <div class="farm-product-detail">
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
    <template v-else-if="product">
      <!-- 页头：全幅 320px 主图，宋体纸色标题压图（规范 §3.3.1） -->
      <section class="detail-hero img-frame" :class="{ 'no-cover': !heroCover }">
        <img v-if="heroCover" :src="heroCover" :alt="product.name" />
        <div class="hero-mask" aria-hidden="true" />
        <div class="hero-inner">
          <h1 class="font-display">{{ product.name }}</h1>
          <div class="sub">
            <span v-if="product.origin">产地：{{ product.origin }}</span>
            <span>单位：{{ product.unit }}</span>
          </div>
        </div>
      </section>

      <div class="container">
        <div class="detail-header">
          <button @click="goBack" class="back-btn">← 返回农产品列表</button>
        </div>

        <!-- 摘要卡：叠压头图（§3.0 B.3） -->
        <div class="summary-card">
          <div class="price-block">
            <span class="price font-display">¥{{ product.price }}</span>
            <span class="unit-label">/ {{ product.unit }}</span>
            <span v-if="product.stock > 0" class="in-stock">库存：{{ product.stock }} {{ product.unit }}</span>
            <span v-else class="out-of-stock">暂无库存</span>
          </div>

          <!-- 数量 + 操作 -->
          <div class="buy-block">
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

        <div v-if="product.images && product.images.length > 1" class="image-thumbnails">
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

        <!-- 商品详情描述 -->
        <section v-if="product.description" class="sect">
          <b class="sect-title font-display">产品详情</b>
          <div class="description-content">{{ product.description }}</div>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { farmProductDetail } from '@/api/food';
import { addToCart } from '@/api/order';
import { FARM_COVERS } from '@/data/photos';
import type { FarmProduct } from '@/api/types';

const route = useRoute();
const router = useRouter();

const product = ref<FarmProduct | null>(null);
const loading = ref(false);
const failed = ref(false);
const currentImage = ref('');
const purchasing = ref(false);
const quantity = ref(1);
const heroCover = computed(() => (product.value ? FARM_COVERS[product.value.id] : ''));

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

/** 加入购物车，返回是否成功 */
const handleAddToCart = async (): Promise<boolean> => {
  if (!product.value) return false;

  purchasing.value = true;
  try {
    // itemId, itemType=2(农产品), quantity
    await addToCart(product.value.id, 2, quantity.value);
    alert('已加入购物车！');

    // 触发购物车更新事件
    window.dispatchEvent(new Event('cart-updated'));
    return true;
  } catch (e: any) {
    // /login 路由不存在，保持当前页仅提示；登录走顶栏入口
    alert(e.message?.includes('登录') ? '请先登录后再购买' : '加入购物车失败：' + (e.message || '请稍后重试'));
    return false;
  } finally {
    purchasing.value = false;
  }
};

/** 立即购买（加购成功后跳转到购物车结算） */
const handleBuyNow = async () => {
  const ok = await handleAddToCart();
  if (ok) {
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
  min-height: 100vh;
  background: var(--paper);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px 44px;
}

.detail-header {
  margin: 14px 0 12px;
}

.back-btn {
  padding: 7px 16px;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 13px;
  color: var(--text-2);
}

.back-btn:hover {
  border-color: var(--ind-300);
  color: var(--ind-700);
}

/* 页头（§3.3.1）：全幅主图 + 宋体纸色标题压图 */
.detail-hero {
  position: relative;
  height: 320px;
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
  display: flex;
  gap: 16px;
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
  flex-wrap: wrap;
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
  gap: 10px;
}

.buy-block {
  display: flex;
  align-items: center;
  gap: 16px;
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
.image-thumbnails {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-top: 12px;
}

.thumbnail {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius);
  border: 2px solid var(--line);
  cursor: pointer;
}

.thumbnail:hover,
.thumbnail.active {
  border-color: var(--ind-700);
}

.price-block .price {
  font-size: 26px;
  font-weight: 700;
  color: var(--cinnabar);
}

.unit-label {
  font-size: 14px;
  color: var(--text-3);
}

.in-stock {
  font-size: 13px;
  color: var(--text-2);
}

.out-of-stock {
  font-size: 13px;
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
  width: 32px;
  height: 32px;
  border: 1px solid var(--line);
  background: white;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 16px;
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
  width: 64px;
  height: 32px;
  text-align: center;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  font-size: 15px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.add-to-cart-btn,
.buy-now-btn {
  padding: 10px 24px;
  border: 1px solid var(--ind-700);
  border-radius: var(--radius);
  font-size: 14px;
  cursor: pointer;
}

.add-to-cart-btn {
  background: #fff;
  color: var(--ind-700);
}

.add-to-cart-btn:hover:not(:disabled) {
  background: var(--ind-50);
  border-color: var(--ind-300);
}

.buy-now-btn {
  background: var(--cinnabar);
  color: var(--paper);
  border-color: var(--cinnabar);
}

.buy-now-btn:hover:not(:disabled) {
  background: var(--cinnabar-700);
}

.add-to-cart-btn:disabled,
.buy-now-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.description-content {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-2);
  white-space: pre-wrap;
}

/* 响应式 */
@media (max-width: 768px) {
  .hero-inner h1 {
    font-size: 24px;
  }

  .summary-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .price {
    font-size: 28px;
  }

  .buy-block {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
}
</style>
