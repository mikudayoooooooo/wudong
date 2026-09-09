import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroCarousel from '../HeroCarousel.vue'
import { getRecommendSlots } from '../../data/mock'

describe('HeroCarousel', () => {
  it('渲染全部推荐位，第一张可见', () => {
    const w = mount(HeroCarousel, { props: { autoMs: 99999 } })
    expect(w.findAll('.slide')).toHaveLength(getRecommendSlots().length)
    expect(w.text()).toContain('苗寨深度两日游')
  })
  it('到时自动切换到下一张并更新圆点', async () => {
    vi.useFakeTimers()
    const w = mount(HeroCarousel, { props: { autoMs: 1000 } })
    await vi.advanceTimersByTimeAsync(1100)
    expect(w.vm.current).toBe(1)
    vi.useRealTimers()
  })
  it('点击圆点跳转指定张', async () => {
    const w = mount(HeroCarousel, { props: { autoMs: 99999 } })
    await w.findAll('.dot')[2].trigger('click')
    expect(w.vm.current).toBe(2)
  })
  it('hover 暂停自动轮播', async () => {
    vi.useFakeTimers()
    const w = mount(HeroCarousel, { props: { autoMs: 1000 } })
    await w.find('.carousel').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(2500)
    expect(w.vm.current).toBe(0)
    vi.useRealTimers()
  })
  it('点击卡片 emit open', async () => {
    const w = mount(HeroCarousel, { props: { autoMs: 99999 } })
    await w.find('.slide.active .card').trigger('click')
    expect(w.emitted('open')![0][0]).toBe('route')
  })
})
