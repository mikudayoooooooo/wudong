import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import PostDetailView from '../PostDetailView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/post/:id', component: PostDetailView }],
})

async function mountAt(id: number) {
  await router.push(`/post/${id}`); await router.isReady()
  return mount(PostDetailView, { global: { plugins: [router] } })
}

describe('PostDetailView', () => {
  it('渲染正文主体，足迹区块默认收起', async () => {
    const w = await mountAt(601)
    expect(w.text()).toContain('晨雾还没散，就到了观景台')
    expect(w.text()).toContain('山野小鱼')
    expect(w.find('.footprint-body').exists()).toBe(false) // 默认收起
    expect(w.find('.teaser').exists()).toBe(true)
  })
  it('模式B游记展开显示完整足迹地图与未解锁提示', async () => {
    const w = await mountAt(601)
    await w.find('.teaser').trigger('click')
    expect(w.find('.footprint-body').exists()).toBe(true)
    expect(w.text()).toContain('还有 1 站未解锁')
    expect(w.findComponent({ name: 'FootprintMap' }).exists()).toBe(true)
  })
  it('模式A游记展开显示地点 chips', async () => {
    const w = await mountAt(604) // 604 无关联路线 → auto 模式
    await w.find('.teaser').trigger('click')
    expect(w.findAll('.chip').length).toBeGreaterThan(0)
  })
})
