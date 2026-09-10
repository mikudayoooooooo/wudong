import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mount, flushPromises } from '@vue/test-utils'
import AiButler from '../AiButler.vue'
import { useSession } from '../../../stores/session'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ path: '/' }),
}))

const accBooking = vi.fn(async () => ({ orderNo: 'WD-ACC-1', payAmount: 632, nights: ['2026-10-01', '2026-10-02'] }))
const foodResv = vi.fn(async () => ({ id: 9 }))
const travelBooking = vi.fn(async () => ({ orderNo: 'WD-TKT-1', payAmount: 598, ticketIds: [1, 2] }))
const payCreate = vi.fn(async () => ({ paymentNo: 'PAY-1' }))
const payMock = vi.fn(async () => true)

vi.mock('../../../api/accommodation', () => ({ bookingCreate: (...a: any[]) => (accBooking as any)(...a) }))
vi.mock('../../../api/food', () => ({
  createReservation: (...a: any[]) => (foodResv as any)(...a),
  searchRestaurants: vi.fn(), restaurantDetail: vi.fn(), getAvailableTimeSlots: vi.fn(),
  searchFarmProducts: vi.fn(), farmProductDetail: vi.fn(), getFarmProductCategories: vi.fn(),
}))
vi.mock('../../../api/travel', () => ({ travelApi: { bookingCreate: (...a: any[]) => (travelBooking as any)(...a) } }))
vi.mock('../../../api/operate', () => ({
  operateApi: {},
  orderApi: { payCreate: (...a: any[]) => (payCreate as any)(...a), payMock: (...a: any[]) => (payMock as any)(...a) },
}))

const tick = () => new Promise((r) => setTimeout(r, 0))
async function settle(w: any, rounds = 30) {
  for (let i = 0; i < rounds; i++) { await flushPromises(); await tick() }
}
async function openButler() {
  const w = mount(AiButler, { props: { pacing: 0 } })
  await w.find('.fab').trigger('click')
  await settle(w, 2)
  return w
}

describe('AiButler', () => {
  beforeEach(() => { setActivePinia(createPinia()); vi.clearAllMocks() })

  it('悬浮圈开合对话窗', async () => {
    const w = await openButler()
    expect(w.find('.drawer').exists()).toBe(true)
    expect(w.text()).toContain('AI 管家')
  })

  it('R1 主线 chip → 递进前缀 → 主线点亮节点并出方案卡（pacing=0 加速）', async () => {
    const w = await openButler()
    await w.findAll('.chip').find((c) => c.text().includes('带爸妈'))!.trigger('click')
    await settle(w)
    // 递进：r2 组出现
    expect(w.text()).toContain('预算一千五')
    for (const label of ['预算一千五', '想要安静', '想吃长桌宴']) {
      await w.findAll('.chip').find((c) => c.text().includes(label))!.trigger('click')
      await settle(w)
    }
    // 主线：三节点点亮 + A/B 卡 + 腊肉彩蛋
    expect(w.findAll('.node.on')).toHaveLength(3)
    expect(w.text()).toContain('云上人家')
    expect(w.text()).toContain('云雾观星客栈')
    expect(w.text()).toContain('腊肉')
  })

  it('登录后一键预订：三接口按序真实调用，常驻条三项点亮', async () => {
    const session = useSession()
    session.applyLogin({ token: 't', refreshToken: 'r' })
    ;(session as any).user = { id: 1, nickname: '山野小鱼', avatar: '', bio: '' }
    const w = await openButler()
    await w.findAll('.chip').find((c) => c.text().includes('带爸妈'))!.trigger('click')
    await settle(w)
    for (const label of ['预算一千五', '想要安静', '想吃长桌宴']) {
      await w.findAll('.chip').find((c) => c.text().includes(label))!.trigger('click')
      await settle(w)
    }
    await w.findAll('.chip').find((c) => c.text().includes('就按 A 方案订'))!.trigger('click')
    await settle(w)
    expect(accBooking).toHaveBeenCalledWith(expect.objectContaining({ roomTypeId: 2, checkInDate: '2026-10-01', checkOutDate: '2026-10-03', rooms: 1, guestName: '山野小鱼' }))
    expect(foodResv).toHaveBeenCalledWith(expect.objectContaining({ restaurantId: 3, timeSlotId: 301, reservationDate: '2026-10-01', peopleCount: 2, contactName: '山野小鱼' }))
    expect(travelBooking).toHaveBeenCalledWith({ itemType: 'route', itemId: 2, useDate: '2026-10-01', quantity: 2 })
    expect(payCreate).toHaveBeenCalledWith('WD-TKT-1')
    expect(payMock).toHaveBeenCalledWith('PAY-1')
    expect(w.findAll('.mini.on')).toHaveLength(3)
    expect(w.text()).toContain('手信')
  })

  it('未登录点预订 → 提示登录，不调接口', async () => {
    const w = await openButler()
    await w.findAll('.chip').find((c) => c.text().includes('带爸妈'))!.trigger('click')
    await settle(w)
    for (const label of ['预算一千五', '想要安静', '想吃长桌宴']) {
      await w.findAll('.chip').find((c) => c.text().includes(label))!.trigger('click')
      await settle(w)
    }
    await w.findAll('.chip').find((c) => c.text().includes('就按 A 方案订'))!.trigger('click')
    await settle(w)
    expect(w.text()).toContain('请先在右上角登录')
    expect(accBooking).not.toHaveBeenCalled()
  })

  it('任一接口失败 → 该项降级「演示数据」，其余成功', async () => {
    const session = useSession()
    session.applyLogin({ token: 't', refreshToken: 'r' })
    ;(session as any).user = { id: 1, nickname: '山野小鱼', avatar: '', bio: '' }
    travelBooking.mockRejectedValueOnce(new Error('boom'))
    const w = await openButler()
    await w.findAll('.chip').find((c) => c.text().includes('带爸妈'))!.trigger('click')
    await settle(w)
    for (const label of ['预算一千五', '想要安静', '想吃长桌宴']) {
      await w.findAll('.chip').find((c) => c.text().includes(label))!.trigger('click')
      await settle(w)
    }
    await w.findAll('.chip').find((c) => c.text().includes('就按 A 方案订'))!.trigger('click')
    await settle(w)
    expect(w.text()).toContain('演示数据')
    expect(w.findAll('.mini.on')).toHaveLength(3) // 降级项也点亮（样式不同由 demo 标记体现）
  })

  it('自由输入未命中 → 兜底话术', async () => {
    const w = await openButler()
    await w.find('input').setValue('今天天气怎么样')
    await w.find('input').trigger('keyup', { key: 'Enter' })
    await settle(w, 3)
    expect(w.text()).toContain('快捷提问')
  })
})
