<script setup lang="ts">
// 商家区外壳：进入时确保已加载会员/店铺信息；侧边导航只显示当前身份可用的入口。
import { computed, onMounted } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const navItems = computed(() => {
  const items = [{ label: '店铺概览', name: 'merchant-home' }];
  if (auth.isMerchant) {
    items.push({ label: '我的民宿', name: 'merchant-hotels' });
  } else {
    items.push({ label: '入驻申请', name: 'merchant-apply' });
  }
  return items;
});

const activeName = computed(() => {
  if (route.name === 'merchant-apply') return 'merchant-apply';
  if (route.name === 'merchant-hotels') return 'merchant-hotels';
  return 'merchant-home';
});

function go(name: string): void {
  router.push({ name });
}

function logout(): void {
  auth.logout();
  router.push('/');
}

onMounted(async () => {
  if (auth.isLoggedIn && !auth.member) {
    try {
      await auth.loadProfile();
    } catch {
      // 鉴权失败由 http 层的 unauthorized 回调统一处理（清 token + 跳登录）
    }
  }
});
</script>

<template>
  <div class="merchant-page">
    <aside class="merchant-aside">
      <div class="merchant-shop">
        <div class="merchant-shop-name">
          {{ auth.merchant?.shopName || '尚未入驻' }}
        </div>
        <div class="merchant-shop-meta">
          {{ auth.member?.phone || '' }}
          <span v-if="auth.merchant && Number(auth.merchant.status) === 1" class="tag tag-on">
            营业中
          </span>
          <span v-else-if="auth.merchant" class="tag tag-off">已禁用</span>
          <span v-else class="tag tag-off">未入驻</span>
        </div>
      </div>

      <nav class="merchant-nav">
        <button
          v-for="item in navItems"
          :key="item.name"
          type="button"
          :class="{ active: activeName === item.name }"
          @click="go(item.name)"
        >
          {{ item.label }}
        </button>
      </nav>

      <button type="button" class="merchant-logout" @click="logout">退出登录</button>
    </aside>

    <section class="merchant-main">
      <RouterView />
    </section>
  </div>
</template>
