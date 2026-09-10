import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PlanCard from '../PlanCard.vue'
import { PLAN_A } from '../script'

const plan = () => JSON.parse(JSON.stringify(PLAN_A))

describe('PlanCard 方案小卡', () => {
  it('渲染名称/总价/首条明细；默认收起', () => {
    const w = mount(PlanCard, { props: { plan: plan() } })
    expect(w.text()).toContain('云上人家')
    expect(w.text()).toContain('¥1398')
    expect(w.text()).not.toContain('10-01 → 10-03')
  })
  it('点击卡片展开明细行与彩蛋 note', async () => {
    const w = mount(PlanCard, { props: { plan: plan(), highlight: true } })
    await w.find('.head').trigger('click')
    expect(w.text()).toContain('10-01 → 10-03')
    expect(w.text()).toContain('腊肉')
  })
  it('点按钮 emit book；已预订态显示标记', async () => {
    const w = mount(PlanCard, { props: { plan: plan(), highlight: true } })
    await w.find('button.book').trigger('click')
    expect(w.emitted('book')).toBeTruthy()
    const w2 = mount(PlanCard, { props: { plan: plan(), highlight: true, booked: true, bookedLabel: 'WD123' } })
    expect(w2.text()).toContain('已预订')
    expect(w2.text()).toContain('WD123')
    expect(w2.find('button.book').exists()).toBe(false)
  })
  it('demo 态显示「演示数据」角标', () => {
    const w = mount(PlanCard, { props: { plan: plan(), demo: true } })
    expect(w.text()).toContain('演示数据')
  })
})
