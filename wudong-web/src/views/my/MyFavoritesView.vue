<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '../../stores/session'
import { favoritePage, favoriteToggle, type FavoriteType } from '../../api/personal'

const router = useRouter()
const session = useSession()
const loading = ref(true)
const list = ref<any[]>([])
const type = ref<FavoriteType | undefined>(undefined)

const TYPE_TABS: { label: string; value?: FavoriteType }[] = [
  { label: '全部' },
  { label: '商品', value: 'product' },
  { label: '民宿', value: 'hotel' },
  { label: '景区', value: 'scenic' },
  { label: '路线', value: 'route' },
  { label: '餐厅', value: 'restaurant' },
  { label: '攻略', value: 'guide' },
  { label: '帖子', value: 'post' },
]

// 目标详情路由（guide 无详情页 → 攻略列表）
const LINKS: Record<string, (id: number) => string> = {
  product: (id) => `/products/${id}`,
  hotel: (id) => `/hotels/${id}`,
  scenic: (id) => `/scenic/${id}`,
  route: (id) => `/route/${id}`,
  restaurant: (id) => `/restaurants/${id}`,
  post: (id) => `/post/${id}`,
  guide: () => `/guide`,
}

const LABELS: Record<string, string> = {
  product: '商品',
  hotel: '民宿',
  scenic: '景区',
  route: '路线',
  restaurant: '餐厅',
  guide: '攻略',
  post: '帖子',
}

const items = computed(() =>
  list.value.map((f) => ({
    ...f,
    label: LABELS[f.targetType] || f.targetType,
    href: LINKS[f.targetType]?.(f.targetId),
  }))
)

async function load() {
  loading.value = true
  try {
    const r = await favoritePage(type.value, 1, 100)
    list.value = r.list || []
  } finally {
    loading.value = false
  }
}

async function onRemove(f: any) {
  if (!window.confirm('取消收藏？')) return
  try {
    await favoriteToggle(f.targetType, f.targetId)
    await load()
  } catch (e: any) {
    alert(e?.message || '操作失败')
  }
}

function go(f: any) {
  if (f.href) router.push(f.href)
}

onMounted(async () => {
  if (!session.isLogged) {
    alert('请先在右上角登录后查看收藏')
    return
  }
  await load()
})
</script>

<template>
  <div class="container page">
    <h2>⭐ 我的收藏</h2>

    <div class="tabs">
      <button
        v-for="t in TYPE_TABS"
        :key="t.label"
        class="tab"
        :class="{ active: type === t.value }"
        @click="type = t.value; load()"
      >
        {{ t.label }}
      </button>
    </div>

    <div v-if="!session.isLogged" class="card empty">请先在右上角登录后查看收藏</div>
    <div v-else-if="loading" class="card empty">加载中…</div>
    <div v-else-if="!items.length" class="card empty">暂无收藏，逛逛喜欢的点亮 ⭐</div>
    <div v-else class="favs">
      <div v-for="f in items" :key="f.id" class="fav card" @click="go(f)">
        <span class="tag">{{ f.label }}</span>
        <span class="name">#{{ f.targetId }}</span>
        <span class="spacer" />
        <button class="mini" @click.stop="onRemove(f)">取消收藏</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabs { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.tab { border: 1px solid var(--line-soft); background: #fff; border-radius: 14px; padding: 4px 14px; cursor: pointer; color: var(--text-2); }
.tab.active { background: var(--orange-500); border-color: var(--orange-500); color: #fff; font-weight: 700; }
.favs { display: flex; flex-direction: column; gap: 8px; }
.fav { display: flex; align-items: center; gap: 10px; padding: 10px 16px; cursor: pointer; }
.fav:hover { border-color: var(--orange-500); }
.tag { background: var(--orange-500); color: #fff; border-radius: 10px; font-size: 12px; padding: 1px 8px; }
.name { color: var(--text-2); font-size: 13px; }
.spacer { flex: 1; }
.mini { border: 1px solid var(--line-soft); background: #fff; border-radius: 12px; padding: 3px 12px; cursor: pointer; font-size: 12px; }
</style>
