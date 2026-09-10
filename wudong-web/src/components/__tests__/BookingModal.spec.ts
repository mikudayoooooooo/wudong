import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import BookingModal from '../BookingModal.vue'
import { useSession } from '../../stores/session'

const inventoryList = vi.fn(async () => [
  { itemType: 'route', itemId: 1, useDate: '2030-09-12', total: 30, sold: 7 },
  { itemType: 'route', itemId: 1, useDate: '2030-09-14', total: 30, sold: 30 },
])
const bookingCreate = vi.fn(async () => ({ orderNo: 'WD2030TEST-001', payAmount: 899, ticketIds: [1] }))
const payCreate = vi.fn(async () => ({ paymentNo: 'PAY1' }))
const payMock = vi.fn(async () => true)

vi.mock('../../api/travel', () => ({
  travelApi: { inventoryList: (...a: any[]) => inventoryList(...(a as any)), bookingCreate: (...a: any[]) => bookingCreate(...(a as any)) },
}))
vi.mock('../../api/operate', () => ({
  operateApi: {},
  orderApi: {
    payCreate: (...a: any[]) => payCreate(...(a as any)),
    payMock: (...a: any[]) => payMock(...(a as any)),
  },
}))

describe('BookingModal（真实下单链）', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })
  it('未登录时提示并不可下单', async () => {
    const w = mount(BookingModal, { props: { open: true, itemType: 'route', itemId: 1 } })
    await flushPromises()
    expect(w.text()).toContain('请先登录')
    expect(w.find('.confirm').attributes('disabled')).toBeDefined()
  })
  it('登录后完整下单：booking → payCreate → payMock → 出票成功', async () => {
    setActivePinia(createPinia())
    const session = useSession()
    await session.loginByPassword('13800000001', 'abc123456').catch(() => {})
    // 单测环境不连后端：直接塞登录态
    session.applyLogin({ token: 't', refreshToken: 'r' })
    ;(session as any).user = { id: 1, nickname: '山野小鱼', avatar: '🧑‍🌾', bio: '' }

    const w = mount(BookingModal, { props: { open: true, itemType: 'route', itemId: 1 } })
    await flushPromises()
    const cell = w.findAll('.date-cell').find((c) => !c.classes().includes('soldout'))
    expect(cell).toBeTruthy()
    await cell!.trigger('click')
    await w.find('.confirm').trigger('click')
    await flushPromises()
    expect(w.text()).toContain('出票成功')
    expect(bookingCreate).toHaveBeenCalledWith({
      itemType: 'route', itemId: 1, useDate: '2030-09-12', quantity: 1,
    })
    // channel 默认值由真实 api 层补齐，mock 下仅收到 orderNo
    expect(payCreate).toHaveBeenCalledWith('WD2030TEST-001')
    expect(payMock).toHaveBeenCalledWith('PAY1')
    expect(w.emitted('success')).toBeTruthy()
  })
})
