<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

// spec §5.4：未登录显示「登录」；已登录显示店铺名。店铺信息只有进过商家区
// （或刚登录）才有，此时回落到「商家中心」——不在这里额外拉接口，避免给 C 端
// 游客页引入请求（token 过期时会被顺带踢到登录页）。
const merchantLabel = computed(() => {
  if (!auth.isLoggedIn) return '登录';
  return auth.merchant?.shopName || '商家中心';
});

// 导航项（按钮式，router.push 切换）；民宿及其详情（/hotels*）同组高亮
const navItems = [
  { label: '首页', path: '/' },
  { label: '民宿', path: '/hotels' },
];

function isActive(itemPath: string): boolean {
  return itemPath === '/' ? route.path === '/' : route.path.startsWith(itemPath);
}

function goMerchant(): void {
  router.push('/merchant');
}
</script>

<template>
  <div class="page">
    <header class="site-header">
      <div class="container">
        <div class="brand"><span class="logo">乌</span>云上乌东 · 苗寨</div>
        <nav class="nav">
          <button
            v-for="item in navItems"
            :key="item.path"
            type="button"
            :class="{ active: isActive(item.path) }"
            @click="router.push(item.path)"
          >
            {{ item.label }}
          </button>
        </nav>
        <button type="button" class="merchant-entry" @click="goMerchant">
          {{ merchantLabel }}
        </button>
        <span class="badge-coming">在线预订 · 即将上线</span>
      </div>
    </header>

    <RouterView />

    <footer class="site-footer container">乌东文旅 · 衣 食 住 行 社区 — 云上苗寨游客站</footer>
  </div>
</template>

<style scoped>
.merchant-entry {
  border: 1px solid var(--green-700);
  background: #fff;
  color: var(--green-700);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 13px;
}
.merchant-entry:hover {
  background: var(--green-700);
  color: #fff;
}
</style>
