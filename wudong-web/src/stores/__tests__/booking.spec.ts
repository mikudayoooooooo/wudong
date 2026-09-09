import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBooking } from '../booking'
import { useSession } from '../session'
import { getInventories, getETickets, __mockWritable } from '../../data/mock'
import type { InventoryDay, ETicket } from '../../types'

// mock.ts 为模块级可变状态：快照初始值，每个用例前还原，保证用例相互独立
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v))
const pristineInventories: InventoryDay[] = clone(__mockWritable.inventories)
const pristineTickets: ETicket[] = clone(__mockWritable.eTickets)

describe('booking store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    __mockWritable.inventories.splice(0, __mockWritable.inventories.length, ...clone(pristineInventories))
    __mockWritable.eTickets.splice(0, __mockWritable.eTickets.length, ...clone(pristineTickets))
  })

  it('未登录下单抛错', () => {
    const b = useBooking()
    expect(() => b.createBooking({ itemType: 'route', itemId: 1, useDate: '2026-09-12', quantity: 1 })).toThrow('请先登录')
  })
  it('登录后下单成功：扣库存、生成待使用电子票', () => {
    const session = useSession(); session.login()
    const b = useBooking()
    const soldBefore = getInventories('route', 1).find((i) => i.useDate === '2026-09-12')!.sold
    const r = b.createBooking({ itemType: 'route', itemId: 1, useDate: '2026-09-12', quantity: 2 })
    const after = getInventories('route', 1).find((i) => i.useDate === '2026-09-12')!
    expect(after.sold).toBe(soldBefore + 2)
    const tickets = getETickets(1).filter((t) => t.orderNo === r.orderNo)
    expect(tickets).toHaveLength(2)
    expect(tickets.every((t) => t.status === 'unused')).toBe(true)
  })
  it('库存不足抛错', () => {
    const session = useSession(); session.login()
    const b = useBooking()
    expect(() => b.createBooking({ itemType: 'route', itemId: 1, useDate: '2026-09-14', quantity: 1 })).toThrow('余票不足')
  })
  it('未使用且明日及以后的票可退：置 refunded 并回补库存', () => {
    const session = useSession(); session.login()
    const b = useBooking()
    const r = b.createBooking({ itemType: 'route', itemId: 1, useDate: '2026-09-12', quantity: 1 })
    const ticket = getETickets(1).find((t) => t.orderNo === r.orderNo)!
    b.refundTicket(ticket.id)
    expect(ticket.status).toBe('refunded')
    expect(getInventories('route', 1).find((i) => i.useDate === '2026-09-12')!.sold).toBe(7)
  })
})
