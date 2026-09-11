<template>
  <div class="cart-page">
    <!-- 顶部导航 -->
    <div class="cart-header">
      <button @click="$router.back()" class="back-btn">← 返回</button>
      <h1>购物车</h1>
      <div class="header-actions">
        <button v-if="cartItems.length > 0" @click="handleClearCart" class="clear-btn">
          清空购物车
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 购物车为空 -->
    <div v-else-if="cartItems.length === 0" class="empty-cart">
      <div class="empty-icon"><Icon name="shopping-cart" :size="40" /></div>
      <p>购物车空空如也</p>
      <button @click="$router.push('/products')" class="go-shopping-btn">
        去逛逛
      </button>
    </div>

    <!-- 购物车列表 -->
    <div v-else class="cart-content">
      <!-- 商品列表 -->
      <div class="cart-items">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="cart-item"
          :class="{ unavailable: !item.isAvailable }"
        >
          <!-- 商品图片 -->
          <div class="item-image">
            <img v-if="itemImg(item)" :src="itemImg(item)" :alt="item.itemName" />
            <div v-else class="ph" :class="'ph-' + ((item.itemId || 0) % 6)" style="width:100%;height:100%;border-radius:4px" />
            <span v-if="!item.isAvailable" class="unavailable-badge">已下架</span>
          </div>

          <!-- 商品信息 -->
          <div class="item-info">
            <h3>{{ item.itemName }}</h3>
            <div class="item-type">
              {{ item.itemType === 1 ? '非遗商品' : '农产品' }}
            </div>
            <div class="item-price">
              <span class="current-price">¥{{ item.currentPrice }}</span>
              <span v-if="item.price !== item.currentPrice" class="old-price">
                ¥{{ item.price }}
              </span>
            </div>
            <div v-if="item.currentStock < item.quantity" class="stock-warning">
              库存仅剩 {{ item.currentStock }} 件
            </div>
          </div>

          <!-- 数量控制 -->
          <div class="item-quantity">
            <button
              @click="decreaseQuantity(item)"
              :disabled="item.quantity <= 1 || !item.isAvailable"
              class="quantity-btn"
            >
              -
            </button>
            <input
              type="number"
              v-model.number="item.quantity"
              @change="updateItemQuantity(item)"
              :disabled="!item.isAvailable"
              min="1"
              :max="item.currentStock"
              class="quantity-input"
            />
            <button
              @click="increaseQuantity(item)"
              :disabled="item.quantity >= item.currentStock || !item.isAvailable"
              class="quantity-btn"
            >
              +
            </button>
          </div>

          <!-- 小计 -->
          <div class="item-subtotal">
            ¥{{ (item.currentPrice * item.quantity).toFixed(2) }}
          </div>

          <!-- 删除按钮 -->
          <button @click="removeItem(item.id)" class="remove-btn" aria-label="删除">
            <Icon name="trash" :size="14" />
          </button>
        </div>
      </div>

      <!-- 结算区域 -->
      <div class="checkout-section">
        <!-- 收货地址 -->
        <div class="address-section">
          <h3>收货地址</h3>
          <div v-if="addresses.length === 0" class="no-address">
            <p>暂无收货地址</p>
            <button @click="showAddressForm = true" class="add-address-btn">
              + 添加地址
            </button>
          </div>
          <div v-else class="address-list">
            <div
              v-for="addr in addresses"
              :key="addr.id"
              @click="selectedAddressId = addr.id"
              class="address-item"
              :class="{ selected: selectedAddressId === addr.id }"
            >
              <div class="address-info">
                <div class="address-contact">
                  {{ addr.contact }} {{ addr.phone }}
                  <span v-if="addr.isDefault" class="default-badge">默认</span>
                </div>
                <div class="address-detail">
                  {{ addr.province }} {{ addr.city }} {{ addr.district }}
                  {{ addr.address }}
                </div>
              </div>
              <div class="address-radio">
                <span v-if="selectedAddressId === addr.id">✓</span>
              </div>
            </div>
            <button @click="showAddressForm = true" class="add-address-btn">
              + 添加新地址
            </button>
          </div>
        </div>

        <!-- 订单备注 -->
        <div class="remark-section">
          <label>订单备注</label>
          <textarea
            v-model="remark"
            placeholder="选填，请填写您的特殊需求"
            rows="3"
            maxlength="200"
          ></textarea>
        </div>

        <!-- 总价 -->
        <div class="total-section">
          <div class="total-row">
            <span>商品总数：</span>
            <span>{{ totalCount }} 件</span>
          </div>
          <div class="total-row total-amount">
            <span>合计：</span>
            <span class="amount">¥{{ totalAmount.toFixed(2) }}</span>
          </div>
        </div>

        <!-- 结算按钮 -->
        <button
          @click="handleCheckout"
          :disabled="!canCheckout || submitting"
          class="checkout-btn"
        >
          {{ submitting ? '提交中...' : '结算' }}
        </button>
      </div>
    </div>

    <!-- 添加地址弹窗 -->
    <div v-if="showAddressForm" class="modal-overlay" @click.self="showAddressForm = false">
      <div class="address-form-modal">
        <h3>添加收货地址</h3>
        <form @submit.prevent="submitAddress">
          <div class="form-group">
            <label>收货人</label>
            <input v-model="addressForm.contact" required placeholder="请输入收货人姓名" />
          </div>
          <div class="form-group">
            <label>手机号</label>
            <input
              v-model="addressForm.phone"
              required
              pattern="1[3-9]\d{9}"
              placeholder="请输入11位手机号"
            />
          </div>
          <div class="form-group">
            <label>省份</label>
            <input v-model="addressForm.province" required placeholder="如：贵州省" />
          </div>
          <div class="form-group">
            <label>城市</label>
            <input v-model="addressForm.city" required placeholder="如：黔东南州" />
          </div>
          <div class="form-group">
            <label>区县</label>
            <input v-model="addressForm.district" required placeholder="如：雷山县" />
          </div>
          <div class="form-group">
            <label>详细地址</label>
            <textarea
              v-model="addressForm.address"
              required
              placeholder="请输入详细地址"
              rows="2"
            ></textarea>
          </div>
          <div class="form-group checkbox">
            <label>
              <input type="checkbox" v-model="addressForm.isDefault" />
              设为默认地址
            </label>
          </div>
          <div class="form-actions">
            <button type="button" @click="showAddressForm = false" class="cancel-btn">
              取消
            </button>
            <button type="submit" class="submit-btn">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Icon from '../../components/Icon.vue';
import { PRODUCT_COVERS, FARM_COVERS } from '@/data/photos';
import {
  getCartList,
  updateCartQuantity,
  removeCartItem,
  clearCart,
  createOrderFromCart,
} from '@/api/order';
import { http } from '@/lib/http';

const router = useRouter();

/** 购物车商品封面：本地实景优先（itemType 1-非遗商品 2-农产品）；未命中用纹样占位 */
const itemImg = (item: any): string | undefined =>
  item.itemType === 1 ? PRODUCT_COVERS[item.itemId] : item.itemType === 2 ? FARM_COVERS[item.itemId] : undefined;

// 购物车数据
const loading = ref(false);
const cartItems = ref<any[]>([]);
const totalAmount = ref(0);
const totalCount = ref(0);

// 地址相关
const addresses = ref<any[]>([]);
const selectedAddressId = ref<number | null>(null);
const showAddressForm = ref(false);
const addressForm = ref({
  contact: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  address: '',
  isDefault: false,
});

// 订单备注
const remark = ref('');

// 提交状态
const submitting = ref(false);

// 是否可以结算
const canCheckout = computed(() => {
  return (
    cartItems.value.length > 0 &&
    cartItems.value.every(item => item.isAvailable) &&
    selectedAddressId.value !== null
  );
});

/** 加载购物车 */
const loadCart = async () => {
  loading.value = true;
  try {
    const data = await getCartList();
    cartItems.value = data.items || [];
    totalAmount.value = data.totalAmount || 0;
    totalCount.value = data.totalCount || 0;
  } catch (e: any) {
    console.error('加载购物车失败', e);
    alert('加载购物车失败：' + (e.message || '请稍后重试'));
  } finally {
    loading.value = false;
  }
};

/** 加载地址列表 */
const loadAddresses = async () => {
  try {
    const result = await http.post('/app/user/address/list');
    addresses.value = result || [];

    // 自动选择默认地址
    const defaultAddr = addresses.value.find(addr => addr.isDefault);
    if (defaultAddr) {
      selectedAddressId.value = defaultAddr.id;
    } else if (addresses.value.length > 0) {
      selectedAddressId.value = addresses.value[0].id;
    }
  } catch (e) {
    console.error('加载地址失败', e);
  }
};

/** 减少数量 */
const decreaseQuantity = async (item: any) => {
  if (item.quantity > 1) {
    item.quantity--;
    await updateItemQuantity(item);
  }
};

/** 增加数量 */
const increaseQuantity = async (item: any) => {
  if (item.quantity < item.currentStock) {
    item.quantity++;
    await updateItemQuantity(item);
  }
};

/** 更新商品数量 */
const updateItemQuantity = async (item: any) => {
  if (item.quantity < 1) {
    item.quantity = 1;
  }
  if (item.quantity > item.currentStock) {
    item.quantity = item.currentStock;
    alert(`库存仅剩 ${item.currentStock} 件`);
  }

  try {
    await updateCartQuantity(item.id, item.quantity);
    await loadCart(); // 重新加载购物车更新总价
  } catch (e: any) {
    alert('更新失败：' + (e.message || '请稍后重试'));
    await loadCart(); // 失败后重新加载恢复
  }
};

/** 移除商品 */
const removeItem = async (id: number) => {
  if (!confirm('确定要移除该商品吗？')) {
    return;
  }

  try {
    await removeCartItem(id);
    await loadCart();
  } catch (e: any) {
    alert('删除失败：' + (e.message || '请稍后重试'));
  }
};

/** 清空购物车 */
const handleClearCart = async () => {
  if (!confirm('确定要清空购物车吗？')) {
    return;
  }

  try {
    await clearCart();
    await loadCart();
  } catch (e: any) {
    alert('清空失败：' + (e.message || '请稍后重试'));
  }
};

/** 提交地址 */
const submitAddress = async () => {
  try {
    await http.post('/app/user/address/add', addressForm.value);
    alert('地址添加成功');
    showAddressForm.value = false;

    // 重置表单
    addressForm.value = {
      contact: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      address: '',
      isDefault: false,
    };

    // 重新加载地址
    await loadAddresses();
  } catch (e: any) {
    alert('添加地址失败：' + (e.message || '请稍后重试'));
  }
};

/** 结算 */
const handleCheckout = async () => {
  if (!selectedAddressId.value) {
    alert('请选择收货地址');
    return;
  }

  // 检查是否有不可用商品
  const unavailableItems = cartItems.value.filter(item => !item.isAvailable);
  if (unavailableItems.length > 0) {
    alert('购物车中有已下架商品，请先移除');
    return;
  }

  submitting.value = true;
  try {
    const result = await createOrderFromCart(selectedAddressId.value, remark.value);
    alert('订单创建成功！订单号：' + result.orderNo);

    // 跳转到订单详情或支付页
    router.push(`/order/${result.orderNo}`);
  } catch (e: any) {
    if (e.message?.includes('登录')) {
      alert('请先登录');
      router.push('/login');
    } else {
      alert('创建订单失败：' + (e.message || '请稍后重试'));
    }
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  loadCart();
  loadAddresses();
});
</script>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: var(--ind-50);
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: none;
}

.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: var(--text-2);
}

.cart-header h1 {
  font-size: 24px;
  margin: 0;
  flex: 1;
  text-align: center;
}

.clear-btn {
  padding: 8px 16px;
  background: var(--ind-50);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-2);
}

.clear-btn:hover {
  background: var(--ind-100);
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

/* 空购物车 */
.empty-cart {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 8px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.go-shopping-btn {
  padding: 12px 40px;
  background: var(--cinnabar);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

/* 购物车内容 */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
}

/* 商品列表 */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: none;
}

.cart-item.unavailable {
  opacity: 0.6;
  background: var(--ind-50);
}

.item-image {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.unavailable-badge {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(11, 29, 44, 0.7);
  color: white;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 4px 0 4px 0;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: var(--ink);
}

.item-type {
  font-size: 12px;
  color: var(--text-3);
  margin-bottom: 8px;
}

.item-price {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.current-price {
  font-size: 18px;
  color: var(--cinnabar);
  font-weight: bold;
}

.old-price {
  font-size: 14px;
  color: var(--text-3);
  text-decoration: line-through;
}

.stock-warning {
  margin-top: 8px;
  color: var(--cinnabar);
  font-size: 12px;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--line);
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 60px;
  height: 32px;
  text-align: center;
  border: 1px solid var(--line);
  border-radius: 4px;
}

.item-subtotal {
  font-size: 18px;
  font-weight: bold;
  color: var(--cinnabar);
  min-width: 100px;
  text-align: right;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.6;
}

.remove-btn:hover {
  opacity: 1;
}

/* 结算区域 */
.checkout-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: none;
  position: sticky;
  top: 20px;
  height: fit-content;
}

.address-section,
.remark-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
}

.address-section h3,
.remark-section label {
  font-size: 16px;
  margin-bottom: 15px;
  display: block;
}

.no-address {
  text-align: center;
  padding: 20px;
  color: var(--text-3);
}

.add-address-btn {
  width: 100%;
  padding: 10px;
  background: var(--ind-50);
  border: 1px dashed var(--line);
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-2);
  margin-top: 10px;
}

.add-address-btn:hover {
  background: var(--ind-100);
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.address-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border: 2px solid var(--line);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.address-item:hover {
  border-color: var(--cinnabar);
}

.address-item.selected {
  border-color: var(--cinnabar);
  background: var(--ind-100);
}

.address-info {
  flex: 1;
}

.address-contact {
  font-weight: bold;
  margin-bottom: 8px;
}

.default-badge {
  background: var(--cinnabar);
  color: white;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  margin-left: 8px;
}

.address-detail {
  font-size: 14px;
  color: var(--text-2);
}

.address-radio {
  font-size: 20px;
  color: var(--cinnabar);
}

.remark-section textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--line);
  border-radius: 4px;
  font-family: inherit;
  resize: vertical;
}

.total-section {
  margin-bottom: 20px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14px;
}

.total-row.total-amount {
  font-size: 18px;
  font-weight: bold;
  border-top: 2px solid var(--line);
  padding-top: 15px;
}

.total-row .amount {
  color: var(--cinnabar);
  font-size: 24px;
}

.checkout-btn {
  width: 100%;
  padding: 15px;
  background: var(--cinnabar);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
}

.checkout-btn:hover {
  background: var(--cinnabar-700);
}

.checkout-btn:disabled {
  background: var(--ind-100);
  cursor: not-allowed;
}

/* 地址弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(11, 29, 44, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.address-form-modal {
  background: white;
  padding: 24px;
  border-radius: var(--radius);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.address-form-modal h3 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--line);
  border-radius: 4px;
  font-family: inherit;
}

.form-group.checkbox {
  display: flex;
  align-items: center;
}

.form-group.checkbox label {
  margin-bottom: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  /* 弹窗内容超高时操作行钉在底部，保存按钮不再被裁出可视区 */
  position: sticky;
  bottom: 0;
  background: #fff;
  padding: 12px 0 2px;
}

.form-actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.cancel-btn {
  background: var(--ind-50);
  color: var(--text-2);
}

.submit-btn {
  background: var(--cinnabar);
  color: white;
}

/* 响应式 */
@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .checkout-section {
    position: static;
  }

  .cart-item {
    flex-wrap: wrap;
    gap: 10px;
  }

  .item-info {
    width: 100%;
  }

  .item-quantity,
  .item-subtotal {
    width: auto;
  }
}
</style>
