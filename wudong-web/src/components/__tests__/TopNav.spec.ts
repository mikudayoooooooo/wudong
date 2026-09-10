import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import TopNav from '../TopNav.vue'

const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div/>' } }] })

describe('TopNav', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('渲染五个导航项与搜索框', async () => {
    await router.push('/'); await router.isReady()
    const w = mount(TopNav, { global: { plugins: [router] } })
    const text = w.text()
    expect(text).toContain('乌东文旅')
    for (const item of ['首页', '行·订票', '社区', '交通攻略', '我的票务']) expect(text).toContain(item)
    expect(w.find('input').attributes('placeholder')).toContain('搜索')
  })
})
