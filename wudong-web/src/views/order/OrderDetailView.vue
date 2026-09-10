<template>
  <div class="order-detail-page">
    <div class="order-header">
      <button @click="$router.back()" class="back-btn">← 返回</button>
      <h1>订单详情</h1>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="order" class="order-content">
      <!-- 订单状态 -->
      <div class="order-status">
        <div class="status-icon">
          <span v-if="order.status === 1">⏰</span>
          <span v-else-if="order.status === 2">✅</span>
          <span v-else-if="order.status === 3">📦</span>
          <span v-else-if="order.status === 4">❌</span>
          <span v-else-if="order.status === 5">💰</span>
        </div>
        <div class="status-text">
          <h2>{{ getStatusText(order.status) }}</h2>
          <p v-if="order.status === 1">请尽快完成支付</p>
        </div>
      </div>

      <!-- 订单信息 -->
      <div class="order-info-card">
        <div class="info-row">
          <span class="label">订单号：</span>
          <span class="value">{{ order.orderNo }}</span>
        </div>
        <div class="info-row">
          <span class="label">下单时间：</span>
          <span class="value">{{ order.createTime }}</span>
        </div>
        <div class="info-row">
          <span class="label">订单金额：</span>
          <span class="value amount">¥{{ order.payAmount }}</span>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="items-section">
        <h3>商品清单</h3>
        <div v-for="item in order.items" :key="item.id" class="order-item">
          <img :src="item.productImage" :alt="item.productName" class="item-image" />
          <div class="item-info">
            <div class="item-name">{{ item.productName }}</div>
            <div class="item-price">¥{{ item.price }} × {{ item.quantity }}</div>
          </div>
          <div class="item-total">¥{{ item.totalAmount }}</div>
        </div>
      </div>

      <!-- 支付按钮 -->
      <div v-if="order.status === 1" class="actions">
        <button @click="handlePay" :disabled="paying" class="pay-btn">
          {{ paying ? '支付中...' : '立即支付' }}
        </button>
        <button @click="handleCancel" class="cancel-btn">取消订单</button>
      </div>
    </div>

    <div v-else class="error">
      <p>订单不存在或已被删除</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { http } from '@/lib/http';

const route = useRoute();

const loading = ref(false);
const order = ref<any>(null);
const paying = ref(false);

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    1: '待支付',
    2: '已支付',
    3: '已完成',
    4: '已取消',
    5: '已退款',
  };
  return statusMap[status] || '未知状态';
};

const loadOrder = async () => {
  loading.value = true;
  try {
    const orderNo = route.params.orderNo as string;
    order.value = await http.get('/app/order/detail', { orderNo });
  } catch (e: any) {
    console.error('加载订单失败', e);
    alert('加载订单失败：' + (e.message || '请稍后重试'));
  } finally {
    loading.value = false;
  }
};

const handlePay = async () => {
  paying.value = true;
  try {
    // 创建支付单
    const payResult = await http.post('/app/pay/create', {
      orderNo: order.value.orderNo,
      channel: 'wechat',
    });

    // 模拟支付成功（真实环境需要调用微信支付SDK）
    await http.post('/app/pay/mock', {
      paymentNo: payResult.paymentNo,
    });

    alert('支付成功！');
    await loadOrder(); // 重新加载订单
  } catch (e: any) {
    alert('支付失败：' + (e.message || '请稍后重试'));
  } finally {
    paying.value = false;
  }
};

const handleCancel = async () => {
  if (!confirm('确定要取消订单吗？')) {
    return;
  }

  try {
    await http.post('/app/order/cancel', { orderNo: order.value.orderNo });
    alert('订单已取消');
    await loadOrder();
  } catch (e: any) {
    alert('取消订单失败：' + (e.message || '请稍后重试'));
  }
};

onMounted(loadOrder);
</script>

<style scoped>
.order-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: #f5f5f5;
}

.order-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #666;
  margin-right: 20px;
}

.order-header h1 {
  font-size: 24px;
  margin: 0;
}

.loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.order-status {
  background: white;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.status-icon {
  font-size: 60px;
}

.status-text h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.status-text p {
  margin: 0;
  color: #666;
}

.order-info-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  color: #666;
}

.value {
  font-weight: 500;
}

.value.amount {
  color: #e74c3c;
  font-size: 20px;
  font-weight: bold;
}

.items-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.items-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 500;
  margin-bottom: 8px;
}

.item-price {
  color: #666;
  font-size: 14px;
}

.item-total {
  font-weight: bold;
  color: #e74c3c;
}

.actions {
  display: flex;
  gap: 15px;
}

.pay-btn,
.cancel-btn {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 500;
}

.pay-btn {
  background: #4CAF50;
  color: white;
}

.pay-btn:hover {
  background: #45a049;
}

.pay-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.error {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
}
</style>
