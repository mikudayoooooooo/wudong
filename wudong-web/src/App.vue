<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const navItems = [
  { label: '首页', path: '/' },
  { label: '民宿', path: '/hotels' },
  { label: '非遗商品', path: '/products' },
  { label: '特色餐厅', path: '/restaurants' },
  { label: '新鲜农产品', path: '/farm-products' },
];

function isActive(itemPath: string): boolean {
  return itemPath === '/' ? route.path === '/' : route.path.startsWith(itemPath);
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
        <span class="badge-coming">在线预订 · 即将上线</span>
      </div>
    </header>

    <RouterView />

    <footer class="site-footer container">乌东文旅 · 衣 食 住 行 社区 — 云上苗寨游客站</footer>
  </div>
</template>
