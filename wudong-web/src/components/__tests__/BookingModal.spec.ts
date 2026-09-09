import { describe, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import BookingModal from '../BookingModal.vue'
import { useSession } from '../../stores/session'
import { getETickets, getInventories } from '../../data/mock'

describe('BookingModal', () => {
  it('未登录时提示并不可下单', () => {
    setActivePinia(createPinia())
    const w = mount(BookingModal, { props: { open: true, itemType: 'route', itemId: 1 } })
    expect(w.text()).toContain('请先登录')
    expect(w.find('.confirm').attributes('disabled')).toBeDefined()
  })
  it('登录后完整下单流程生成电子票并 emit success', async () => {
    setActivePinia(createPinia())
    useSession().login()
    const w = mount(BookingModal, { props: { open: true, itemType: 'route', itemId: 1 } })
    const cell = w.findAll('.date-cell').find((c) => !c.classes().includes('soldout'))
    expect(cell).toBeTruthy()
    await cell!.trigger('click')
    await w.find('.confirm').trigger('click')
    // 模拟支付用真实 800ms 定时器：等待其完成
    await new Promise((r) => setTimeout(r, 900))
    expect(w.text()).toContain('出票成功')
    const tickets = getETickets(1).filter((t) => t.itemType === 'route')
    expect(tickets.length).toBeGreaterThan(0)
    expect(w.emitted('success')).toBeTruthy()
    expect(getInventories('route', 1)[0].sold).toBeGreaterThan(7)
  })
})
