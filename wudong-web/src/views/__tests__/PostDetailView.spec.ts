import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import PostDetailView from '../PostDetailView.vue'

const postDetail = vi.fn(async () => ({
  id: 601,
  userId: 1,
  title: '晨雾还没散，就到了观景台',
  content: '五点半摸黑上山',
  images: [1, 2, 3],
  createTime: '2026-09-02 08:30:00',
  likeCount: 328,
  commentCount: 41,
  favoriteCount: 96,
  linkedRouteId: 1,
  author: { id: 1, nickname: '山野小鱼', avatar: '🧑‍🌾', bio: '' },
  topics: [{ id: 501, name: '#苗寨风光' }],
  footprint: {
    mode: 'route',
    routeId: 1,
    stops: [
      { spotId: 1, name: '乌东梯田', lit: true, locked: false, memo: '晨雾六点十分', dayNo: 1 },
      { spotId: 2, name: '银饰工坊', lit: false, locked: true, dayNo: 2 },
    ],
  },
}))
const routeDetail = vi.fn(async () => ({ id: 1, title: '苗寨深度两日游', price: 899 }))

vi.mock('../../api/community', () => ({
  communityApi: { postDetail: (...a: any[]) => (postDetail as any)(...a) },
}))
vi.mock('../../api/travel', () => ({
  travelApi: { routeDetail: (...a: any[]) => (routeDetail as any)(...a) },
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/post/:id', component: PostDetailView }],
})

const wrappers: any[] = []
async function mountAt(id: number) {
  await router.push(`/post/${id}`); await router.isReady()
  const w = mount(PostDetailView, { global: { plugins: [router] } })
  wrappers.push(w)
  await flushPromises()
  return w
}

afterEach(() => {
  // 卸载旧实例：否则其路由 watcher 会在后续用例抢跑 mockOnce
  wrappers.forEach((w) => w.unmount())
  wrappers.length = 0
})

describe('PostDetailView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })
  it('渲染正文主体，足迹区块默认收起', async () => {
    const w = await mountAt(601)
    expect(w.text()).toContain('晨雾还没散，就到了观景台')
    expect(w.text()).toContain('山野小鱼')
    expect(w.find('.footprint-body').exists()).toBe(false)
    expect(w.find('.teaser').exists()).toBe(true)
  })
  it('模式B展开显示完整足迹地图与未解锁提示', async () => {
    const w = await mountAt(601)
    await w.find('.teaser').trigger('click')
    expect(w.find('.footprint-body').exists()).toBe(true)
    expect(w.text()).toContain('还有 1 站未解锁')
    expect(w.findComponent({ name: 'FootprintMap' }).exists()).toBe(true)
    expect(w.text()).toContain('¥899 起 · 去走同款')
  })
  it('模式A游记展开显示地点 chips', async () => {
    postDetail.mockResolvedValueOnce({
      id: 604, userId: 3, title: '雨后的吊脚楼', content: 'x', images: [1],
      createTime: '2026-09-05 17:40:00', likeCount: 87, commentCount: 12, favoriteCount: 18,
      linkedRouteId: null, author: { id: 3, nickname: '快门手', avatar: '📷', bio: '' },
      topics: [],
      footprint: { mode: 'auto', routeId: null, stops: [{ spotId: 1, lit: true, locked: false }, { spotId: 6, lit: true, locked: false }] },
    } as any)
    const w = await mountAt(604)
    await w.find('.teaser').trigger('click')
    expect(w.findAll('.chip').length).toBeGreaterThan(0)
  })
})
