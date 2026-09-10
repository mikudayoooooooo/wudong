import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RouteQuickView from '../RouteQuickView.vue'

vi.mock('../../api/travel', () => ({
  travelApi: {
    routeDetail: vi.fn(async () => ({
      id: 1,
      title: '苗寨深度两日游',
      days: 2,
      price: 899,
      sales: 1284,
      stops: [
        { spotId: 1, name: '乌东梯田', lit: true, locked: false, lightCount: 3 },
        { spotId: 2, name: '银饰工坊', lit: true, locked: false, lightCount: 3 },
      ],
    })),
  },
}))
vi.mock('../../api/community', () => ({
  communityApi: {
    feed: vi.fn(async () => ({ list: [], total: 2 })),
  },
}))

describe('RouteQuickView', () => {
  it('展示路线信息、站点迷你地图与按钮', async () => {
    const w = mount(RouteQuickView, { props: { routeId: 1 } })
    await flushPromises()
    expect(w.text()).toContain('苗寨深度两日游')
    expect(w.text()).toContain('¥899')
    expect(w.text()).toContain('相关游记')
    expect(w.findAll('button')).toHaveLength(2)
  })
  it('点击预订 emit book', async () => {
    const w = mount(RouteQuickView, { props: { routeId: 1 } })
    await flushPromises()
    await w.findAll('button')[1].trigger('click')
    expect(w.emitted('book')![0]).toEqual([1])
  })
  it('点击关闭 emit close', async () => {
    const w = mount(RouteQuickView, { props: { routeId: 1 } })
    await flushPromises()
    await w.find('.close').trigger('click')
    expect(w.emitted('close')).toBeTruthy()
  })
})
