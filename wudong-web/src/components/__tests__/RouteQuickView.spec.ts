import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RouteQuickView from '../RouteQuickView.vue'

describe('RouteQuickView', () => {
  it('展示路线信息、站点迷你地图与按钮', () => {
    const w = mount(RouteQuickView, { props: { routeId: 1 } })
    expect(w.text()).toContain('苗寨深度两日游')
    expect(w.text()).toContain('¥899')
    expect(w.text()).toContain('相关游记')
    expect(w.findAll('button')).toHaveLength(2)
  })
  it('点击预订 emit book', async () => {
    const w = mount(RouteQuickView, { props: { routeId: 1 } })
    await w.findAll('button')[1].trigger('click')
    expect(w.emitted('book')![0]).toEqual([1])
  })
  it('点击关闭 emit close', async () => {
    const w = mount(RouteQuickView, { props: { routeId: 1 } })
    await w.find('.close').trigger('click')
    expect(w.emitted('close')).toBeTruthy()
  })
})
