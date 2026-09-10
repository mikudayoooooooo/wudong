import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import HeroCarousel from '../HeroCarousel.vue'

const slots = [
  { id: 701, title: '苗寨深度两日游', subtitle: '¥899 起', badge: '🔥 置顶', itemType: 'route', itemId: 1, sort: 1, rotationGroup: 1, intervalSeconds: 5 },
  { id: 702, title: '晨雾梯田摄影一日游', subtitle: '¥299 起', badge: '📷 摄影', itemType: 'route', itemId: 2, sort: 2, rotationGroup: 1, intervalSeconds: 5 },
  { id: 703, title: '芦笙广场 · 节庆进行时', subtitle: '成人票 ¥40', badge: '👪 亲子', itemType: 'scenic', itemId: 6, sort: 3, rotationGroup: 1, intervalSeconds: 5 },
]

vi.mock('../../api/travel', () => ({
  travelApi: { recommendList: vi.fn(async () => slots) },
}))

describe('HeroCarousel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('渲染全部推荐位，第一张可见', async () => {
    const w = mount(HeroCarousel, { props: { autoMs: 99999 } })
    await flushPromises()
    expect(w.findAll('.slide')).toHaveLength(3)
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
    await flushPromises()
    await w.findAll('.dot')[2].trigger('click')
    expect(w.vm.current).toBe(2)
  })
  it('hover 暂停自动轮播', async () => {
    vi.useFakeTimers()
    const w = mount(HeroCarousel, { props: { autoMs: 1000 } })
    await flushPromises()
    await w.find('.carousel').trigger('mouseenter')
    await vi.advanceTimersByTimeAsync(2500)
    expect(w.vm.current).toBe(0)
    vi.useRealTimers()
  })
  it('点击卡片 emit open', async () => {
    const w = mount(HeroCarousel, { props: { autoMs: 99999 } })
    await flushPromises()
    await w.find('.slide.active .card').trigger('click')
    expect(w.emitted('open')![0][0]).toBe('route')
  })
})
