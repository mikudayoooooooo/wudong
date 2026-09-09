import { defineStore } from 'pinia'
import { useSession } from './session'
import { getInventories, __mockWritable } from '../data/mock'

let orderSeq = 100
let ticketSeq = 300

export interface BookingInput { itemType: 'ticket' | 'route'; itemId: number; useDate: string; quantity: number }

export const useBooking = defineStore('booking', () => {
  function createBooking(input: BookingInput): { orderNo: string; ticketIds: number[] } {
    const session = useSession()
    if (!session.isLogged) throw new Error('请先登录')
    const inv = getInventories(input.itemType, input.itemId).find((i) => i.useDate === input.useDate)
    if (!inv) throw new Error('该日期未开放预订')
    if (inv.sold + input.quantity > inv.total) throw new Error('余票不足')
    inv.sold += input.quantity
    const orderNo = `WD2026DEMO-${++orderSeq}`
    const ticketIds: number[] = []
    for (let i = 0; i < input.quantity; i++) {
      const id = ++ticketSeq
      ticketIds.push(id)
      __mockWritable.eTickets.push({
        id, orderNo, userId: session.user!.id, itemType: input.itemType,
        itemId: input.itemId, useDate: input.useDate, status: 'unused',
      })
    }
    return { orderNo, ticketIds }
  }

  function refundTicket(ticketId: number): void {
    const session = useSession()
    if (!session.isLogged) throw new Error('请先登录')
    const ticket = __mockWritable.eTickets.find((t) => t.id === ticketId && t.userId === session.user!.id)
    if (!ticket) throw new Error('票不存在')
    if (ticket.status !== 'unused') throw new Error('仅未使用的票可退')
    const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10)
    if (ticket.useDate < tomorrow) throw new Error('距使用日期不足24小时，不可退')
    ticket.status = 'refunded'
    const inv = getInventories(ticket.itemType, ticket.itemId).find((i) => i.useDate === ticket.useDate)
    if (inv && inv.sold > 0) inv.sold -= 1
  }

  return { createBooking, refundTicket }
})
