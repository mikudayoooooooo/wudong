import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FootprintMap from '../FootprintMap.vue'
import type { FootprintStopView } from '../../types'

const stops: FootprintStopView[] = [
  { spotId: 1, name: '乌东梯田', icon: '🌄', lit: true, locked: false, lightCount: 3 },
  { spotId: 2, name: '银饰工坊', icon: '⚒️', lit: false, locked: true },
  { spotId: 3, name: '长桌宴', icon: '🍲', lit: true, locked: false, lightCount: 2 },
]

describe('FootprintMap', () => {
  it('渲染 lit 与 locked 两种站点节点', () => {
    const w = mount(FootprintMap, { props: { stops, variant: 'chain' } })
    expect(w.findAll('.stop.lit')).toHaveLength(2)
    expect(w.findAll('.stop.locked')).toHaveLength(1)
    expect(w.text()).toContain('乌东梯田')
  })
  it('chain 变体显示点亮人数', () => {
    const w = mount(FootprintMap, { props: { stops, variant: 'chain', showCounts: true } })
    expect(w.text()).toContain('3')
  })
  it('mini 变体不显示人数与图例', () => {
    const w = mount(FootprintMap, { props: { stops, variant: 'mini' } })
    expect(w.find('.legend').exists()).toBe(false)
  })
  it('点击站点 emit select', async () => {
    const w = mount(FootprintMap, { props: { stops, variant: 'chain' } })
    await w.find('.stop.lit').trigger('click')
    expect(w.emitted('select')![0]).toEqual([1])
  })
})
