<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

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
        <button type="button" class="merchant-entry" @click="goMerchant">商家中心</button>
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
