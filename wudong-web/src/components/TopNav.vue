<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '../stores/session'
import { communityApi } from '../api/community'
import CartBadge from './CartBadge.vue'
import LoginModal from './LoginModal.vue'
import Icon from './Icon.vue'

const router = useRouter()
const session = useSession()
const items = [
  { path: '/', label: '首页' },
  { path: '/route', label: '行·订票' },
  { path: '/hotels', label: '住宿' },
  { path: '/products', label: '非遗商品' },
  { path: '/restaurants', label: '特色餐厅' },
  { path: '/farm-products', label: '新鲜农产品' },
  { path: '/community', label: '社区' },
  { path: '/guide', label: '交通攻略' },
  { path: '/my/tickets', label: '我的票务' },
]
const loginOpen = ref(false)
const menuOpen = ref(false)
const searchKw = ref('')
const searchOpen = ref(false)
const searchResult = ref<{ posts: any[]; topics: any[]; users: any[] }>({ posts: [], topics: [], users: [] })

async function onSearch() {
  if (!searchKw.value.trim()) return
  searchResult.value = await communityApi.search(searchKw.value.trim())
  searchOpen.value = true
}
function goUser(id: number) {
  searchOpen.value = false
  router.push(`/user/${id}`)
}
function goTopic(id: number) {
  searchOpen.value = false
  router.push(`/topic/${id}`)
}
function onUserClick() {
  if (session.isLogged) router.push(`/user/${session.user!.id}`)
  else loginOpen.value = true
}

// 用户菜单（登录后）
const userMenuOpen = ref(false)
const userMenu = [
  { label: '个人主页', path: () => `/user/${session.user!.id}` },
  { label: '我的订单', path: () => '/my/orders' },
  { label: '我的预订', path: () => '/my/reservations' },
  { label: '我的票务', path: () => '/my/tickets' },
  { label: '我的收藏', path: () => '/my/favorites' },
]
function goMenu(m: { label: string; path: () => string }) {
  userMenuOpen.value = false
  router.push(m.path())
}
</script>

<template>
  <nav class="nav">
    <div class="container nav-inner">
      <b class="logo"><span class="seal font-display">乌</span><span class="brand font-display">乌东文旅</span></b>
      <div class="links">
        <RouterLink v-for="it in items" :key="it.path" :to="it.path" class="item">
          {{ it.label }}
        </RouterLink>
      </div>
      <span class="spacer" />
      <span class="search-wrap">
        <Icon name="search" :size="14" class="search-icon" />
        <input
          v-model="searchKw"
          class="search"
          placeholder="搜索路线 / 景区 / 游记 / 话题"
          @keyup.enter="onSearch"
        />
      </span>
      <button class="publish" @click="router.push('/publish')"><Icon name="plus" :size="14" /> 发布</button>
      <CartBadge v-if="session.isLogged" />
      <span class="user" data-testid="nav-user" @click="onUserClick">
        <span class="user-name">{{ session.isLogged ? `${session.user!.avatar} ${session.user!.nickname}` : '登录' }}</span>
      </span>
      <span v-if="session.isLogged" class="user" @click="userMenuOpen = !userMenuOpen"><Icon name="chevron-down" :size="14" /></span>
      <div v-if="session.isLogged && userMenuOpen" class="user-menu card" @mouseleave="userMenuOpen = false">
        <a v-for="m in userMenu" :key="m.label" @click="goMenu(m)">{{ m.label }}</a>
        <a class="logout" @click="userMenuOpen = false; session.logout()">退出</a>
      </div>
      <button class="hamburger" @click="menuOpen = !menuOpen"><Icon name="menu-2" :size="20" /></button>
    </div>
    <div v-if="menuOpen" class="mobile-menu" @mouseleave="menuOpen = false">
      <RouterLink v-for="it in items" :key="it.path" :to="it.path" class="m-item" @click="menuOpen = false">
        {{ it.label }}
      </RouterLink>
    </div>
    <div v-if="searchOpen" class="search-panel card">
      <div class="s-col">
        <b>游记</b>
        <a v-for="p in searchResult.posts" :key="p.id" @click="router.push(`/post/${p.id}`)">{{ p.title }}</a>
        <span v-if="!searchResult.posts.length" class="empty">无结果</span>
      </div>
      <div class="s-col">
        <b>话题</b>
        <a v-for="t in searchResult.topics" :key="t.id" @click="goTopic(t.id)">{{ t.name }}</a>
        <span v-if="!searchResult.topics.length" class="empty">无结果</span>
      </div>
      <div class="s-col">
        <b>用户</b>
        <a v-for="u in searchResult.users" :key="u.id" @click="goUser(u.id)">{{ u.avatar }} {{ u.nickname }}</a>
        <span v-if="!searchResult.users.length" class="empty">无结果</span>
      </div>
      <span class="close-s" @click="searchOpen = false"><Icon name="x" :size="14" /></span>
    </div>
  </nav>
  <LoginModal :open="loginOpen" @close="loginOpen = false" />
</template>

<style scoped>
.nav { background: var(--paper); border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 20; }
.nav-inner { display: flex; align-items: center; gap: 14px; height: 56px; }
.logo { display: flex; align-items: center; gap: 8px; flex-shrink: 0; white-space: nowrap; }
.seal { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 2px; background: var(--cinnabar); color: var(--paper); font-size: 14px; line-height: 1; }
.brand { font-size: 17px; font-weight: 700; color: var(--ind-800); }
.links { display: flex; align-items: center; gap: 14px; min-width: 0; overflow: hidden; }
.item { color: var(--text-2); font-size: 13px; white-space: nowrap; flex-shrink: 0; padding: 2px 0; border-bottom: 2px solid transparent; }
.item.router-link-exact-active { color: var(--ind-700); font-weight: 700; border-bottom-color: var(--cinnabar); }
.spacer { flex: 1; min-width: 8px; }
.search-wrap { position: relative; display: flex; align-items: center; flex-shrink: 1; }
.search-icon { position: absolute; left: 10px; color: var(--text-3); pointer-events: none; }
.search { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 5px 12px 5px 30px; width: 200px; min-width: 120px; outline: none; }
.search:focus { border-color: var(--ind-500); }
.user { font-size: 13px; cursor: pointer; display: inline-flex; align-items: center; flex-shrink: 0; }
.user-name { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-menu { position: absolute; right: 24px; top: 50px; width: 130px; padding: 8px; display: flex; flex-direction: column; z-index: 30; }
.user-menu a { cursor: pointer; color: var(--text-1); font-size: 13px; padding: 5px 8px; border-radius: 2px; }
.user-menu a:hover { background: var(--ind-50); color: var(--ind-700); }
.user-menu .logout { color: var(--text-3); }
.logout { font-size: 12px; color: var(--text-3); cursor: pointer; }
.publish { display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0; background: var(--ind-700); color: var(--paper); border-radius: var(--radius); padding: 5px 14px; font-size: 13px; cursor: pointer; border: none; white-space: nowrap; }
.publish:hover { background: var(--ind-800); }
.hamburger { display: none; align-items: center; justify-content: center; width: 34px; height: 34px; background: transparent; border: 1px solid var(--line); border-radius: var(--radius); color: var(--ind-700); flex-shrink: 0; }
.mobile-menu { position: absolute; left: 0; right: 0; top: 56px; background: var(--paper); border-bottom: 1px solid var(--line); display: flex; flex-direction: column; padding: 4px 16px 8px; z-index: 30; }
.m-item { padding: 11px 0; font-size: 14px; color: var(--text-1); border-bottom: 1px solid var(--line-soft); }
.m-item:last-child { border-bottom: none; }
.m-item.router-link-exact-active { color: var(--ind-700); font-weight: 700; }
.search-panel { position: absolute; right: 24px; top: 58px; width: 520px; padding: 14px; display: flex; gap: 14px; }
.s-col { flex: 1; display: flex; flex-direction: column; gap: 6px; font-size: 12px; }
.s-col b { font-size: 12px; color: var(--text-2); }
.s-col a { cursor: pointer; color: var(--text-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.s-col a:hover { color: var(--ind-700); }
.empty { color: var(--text-3); }
.close-s { position: absolute; top: 8px; right: 10px; cursor: pointer; color: var(--text-3); display: inline-flex; }
@media (max-width: 1180px) {
  .links { display: none; }
  .hamburger { display: inline-flex; }
  .search { width: 150px; }
}
@media (max-width: 720px) {
  .search-wrap { display: none; }
}
</style>
