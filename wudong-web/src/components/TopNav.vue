<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '../stores/session'
import { communityApi } from '../api/community'
import LoginModal from './LoginModal.vue'

const router = useRouter()
const session = useSession()
const items = [
  { path: '/', label: '首页' },
  { path: '/route', label: '行·订票' },
  { path: '/hotels', label: '住宿' },
  { path: '/community', label: '社区' },
  { path: '/guide', label: '交通攻略' },
  { path: '/my/tickets', label: '我的票务' },
]
const loginOpen = ref(false)
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
</script>

<template>
  <nav class="nav">
    <div class="container nav-inner">
      <b class="logo">🏞 乌东文旅</b>
      <RouterLink v-for="it in items" :key="it.path" :to="it.path" class="item">
        {{ it.label }}
      </RouterLink>
      <span class="spacer" />
      <input
        v-model="searchKw"
        class="search"
        placeholder="🔍 搜索路线 / 景区 / 游记 / 话题"
        @keyup.enter="onSearch"
      />
      <button class="publish" @click="router.push('/publish')">＋ 发布</button>
      <span class="user" data-testid="nav-user" @click="onUserClick">
        {{ session.isLogged ? `${session.user!.avatar} ${session.user!.nickname}` : '登录' }}
      </span>
      <span v-if="session.isLogged" class="logout" @click="session.logout()">退出</span>
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
      <span class="close-s" @click="searchOpen = false">✕</span>
    </div>
  </nav>
  <LoginModal :open="loginOpen" @close="loginOpen = false" />
</template>

<style scoped>
.nav { background: #fff; border-bottom: 1px solid var(--line-soft); position: sticky; top: 0; z-index: 20; }
.nav-inner { display: flex; align-items: center; gap: 18px; height: 52px; }
.logo { font-size: 15px; margin-right: 8px; }
.item { color: var(--text-2); }
.item.router-link-exact-active { color: var(--orange-500); font-weight: 700; }
.spacer { flex: 1; }
.search { background: #f2f2f2; border: none; border-radius: 14px; padding: 5px 14px; width: 240px; outline: none; }
.user { font-size: 13px; cursor: pointer; }
.logout { font-size: 12px; color: var(--text-3); cursor: pointer; }
.publish { background: var(--green-600); color: #fff; border-radius: 14px; padding: 4px 12px; font-size: 13px; cursor: pointer; border: none; }
.search-panel { position: absolute; right: 24px; top: 56px; width: 520px; padding: 14px; display: flex; gap: 14px; }
.s-col { flex: 1; display: flex; flex-direction: column; gap: 6px; font-size: 12px; }
.s-col b { font-size: 12px; color: var(--text-2); }
.s-col a { cursor: pointer; color: var(--text-1); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.s-col a:hover { color: var(--orange-500); }
.empty { color: var(--text-3); }
.close-s { position: absolute; top: 6px; right: 10px; cursor: pointer; color: var(--text-3); font-size: 12px; }
</style>
