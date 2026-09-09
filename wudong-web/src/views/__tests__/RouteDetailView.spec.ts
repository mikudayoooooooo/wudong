import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import RouteDetailView from '../RouteDetailView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/route/:id', component: RouteDetailView }],
})

describe('RouteDetailView', () => {
  it('渲染路线信息、行程地图、购票卡与联动游记', async () => {
    await router.push('/route/1'); await router.isReady()
    const w = mount(RouteDetailView, { global: { plugins: [router] } })
    expect(w.text()).toContain('苗寨深度两日游')
    expect(w.text()).toContain('¥899')
    expect(w.text()).toContain('走过这条线的人')
    expect(w.findAllComponents({ name: 'PostCard' }).length).toBeGreaterThan(0)
  })
  it('购票卡日期格按余票着色且售罄灰置', async () => {
    await router.push('/route/1'); await router.isReady()
    const w = mount(RouteDetailView, { global: { plugins: [router] } })
    const soldOut = w.findAll('.date-cell').find((c) => c.classes().includes('soldout'))
    expect(soldOut).toBeTruthy()
    expect(w.text()).toMatch(/余\d+|满/)
  })
})
