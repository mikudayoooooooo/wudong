import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import RouteDetailView from '../RouteDetailView.vue'

const routeDetail = vi.fn(async () => ({
  id: 1,
  title: '苗寨深度两日游',
  days: 2,
  theme: '经典',
  price: '899.00',
  includes: ['门票', '长桌宴'],
  departure: '凯里南站',
  hotelStandard: '吊脚楼民宿',
  mealStandard: '长桌宴',
  notice: '提前1天预订',
  sales: 1284,
  stops: [
    { spotId: 1, name: '乌东梯田', icon: '📍', dayNo: 1, lit: true, locked: false, lightCount: 3 },
    { spotId: 2, name: '银饰工坊', icon: '📍', dayNo: 2, lit: false, locked: true, lightCount: 0 },
  ],
  inventories: [
    { itemType: 'route', itemId: 1, useDate: '2030-09-12', total: 30, sold: 8 },
    { itemType: 'route', itemId: 1, useDate: '2030-09-13', total: 30, sold: 22 },
    { itemType: 'route', itemId: 1, useDate: '2030-09-14', total: 30, sold: 30 },
  ],
  reviews: [{ id: 1, userId: 4, rating: 5, content: '酸汤鱼绝了', nickname: '干饭人小王', avatar: '🍚' }],
}))
const feed = vi.fn(async () => ({
  list: [
    { id: 601, title: '晨雾还没散', likeCount: 328, commentCount: 41, images: [1], linkedRouteId: 1, routeTitle: '苗寨深度两日游', author: { id: 1, nickname: '山野小鱼', avatar: '🧑‍🌾' }, footprintLit: 4, footprintTotal: 5 },
  ],
  total: 1,
}))

vi.mock('../../api/travel', () => ({
  travelApi: { routeDetail: (...a: any[]) => routeDetail(...(a as any)) },
}))
vi.mock('../../api/community', () => ({
  communityApi: { feed: (...a: any[]) => feed(...(a as any)) },
}))

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/route/:id', component: RouteDetailView }],
})

describe('RouteDetailView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })
  it('渲染路线信息、行程地图、购票卡与联动游记', async () => {
    await router.push('/route/1'); await router.isReady()
    const w = mount(RouteDetailView, { global: { plugins: [router] } })
    await flushPromises()
    expect(w.text()).toContain('苗寨深度两日游')
    expect(w.text()).toContain('¥899.00')
    expect(w.text()).toContain('走过这条线的人')
    expect(w.findAllComponents({ name: 'PostCard' }).length).toBe(1)
  })
  it('购票卡日期格按余票着色且售罄灰置', async () => {
    await router.push('/route/1'); await router.isReady()
    const w = mount(RouteDetailView, { global: { plugins: [router] } })
    await flushPromises()
    const soldOut = w.findAll('.date-cell').find((c) => c.classes().includes('soldout'))
    expect(soldOut).toBeTruthy()
    expect(w.text()).toMatch(/余\d+|满/)
  })
  it('评价展示后端嵌入的作者信息', async () => {
    await router.push('/route/1'); await router.isReady()
    const w = mount(RouteDetailView, { global: { plugins: [router] } })
    await flushPromises()
    expect(w.text()).toContain('干饭人小王')
  })
})
