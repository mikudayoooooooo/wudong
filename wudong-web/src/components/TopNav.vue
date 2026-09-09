<script setup lang="ts">
const items = [
  { path: '/', label: '首页' },
  { path: '/route', label: '行·订票' },
  { path: '/community', label: '社区' },
  { path: '/guide', label: '交通攻略' },
  { path: '/my/tickets', label: '我的票务' },
]
</script>

<template>
  <nav class="nav">
    <div class="container nav-inner">
      <b class="logo">🏞 乌东文旅</b>
      <RouterLink v-for="it in items" :key="it.path" :to="it.path" class="item">
        {{ it.label }}
      </RouterLink>
      <span class="spacer" />
      <input class="search" placeholder="🔍 搜索路线 / 景区 / 游记 / 话题" />
      <span class="user">🧑‍🌾 山野小鱼</span>
    </div>
  </nav>
</template>

<style scoped>
.nav { background: #fff; border-bottom: 1px solid var(--line-soft); position: sticky; top: 0; z-index: 20; }
.nav-inner { display: flex; align-items: center; gap: 18px; height: 52px; }
.logo { font-size: 15px; margin-right: 8px; }
.item { color: var(--text-2); }
.item.router-link-exact-active { color: var(--orange-500); font-weight: 700; }
.spacer { flex: 1; }
.search { background: #f2f2f2; border: none; border-radius: 14px; padding: 5px 14px; width: 240px; outline: none; }
.user { font-size: 13px; }
</style>
