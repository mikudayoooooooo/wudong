<template>
  <router-link to="/cart" class="cart-badge-icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
    <span v-if="count > 0" class="badge">{{ count > 99 ? '99+' : count }}</span>
  </router-link>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getCartCount } from '@/api/order';

const count = ref(0);
let intervalId: number | null = null;

const loadCount = async () => {
  try {
    count.value = await getCartCount();
  } catch (e) {
    // 未登录或其他错误，静默处理
    count.value = 0;
  }
};

onMounted(() => {
  loadCount();
  // 每30秒更新一次购物车数量
  intervalId = window.setInterval(loadCount, 30000);

  // 监听购物车更新事件
  window.addEventListener('cart-updated', loadCount);
});

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
  window.removeEventListener('cart-updated', loadCount);
});

// 暴露方法供外部调用
defineExpose({
  refresh: loadCount,
});
</script>

<style scoped>
.cart-badge-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: var(--ink);
  text-decoration: none;
  transition: color 0.2s;
}

.cart-badge-icon:hover {
  color: var(--cinnabar);
}

.badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: var(--cinnabar);
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  line-height: 1;
}
</style>
