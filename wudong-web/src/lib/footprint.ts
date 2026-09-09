import type { ETicket, FootprintStopView, FootprintMode, PostFootprint } from '../types'
import {
  allETickets, getItinerary, getSpot, getAllTicketTypes, getPostFootprints, getPost,
} from '../data/mock'

const DAY_MS = 24 * 3600 * 1000

function ticketSpotIds(t: ETicket): number[] {
  if (t.itemType === 'route') return getItinerary(t.itemId).map((s) => s.spotId)
  const tt = getAllTicketTypes().find((x) => x.id === t.itemId)
  return tt ? [tt.spotId] : []
}

function validTickets(userId?: number): ETicket[] {
  return allETickets().filter((t) => t.status === 'used' && (userId === undefined || t.userId === userId))
}

export function userLitSpotIds(userId: number, opts?: { withinDays?: number }): Set<number> {
  const lit = new Set<number>()
  for (const t of validTickets(userId)) {
    if (opts?.withinDays !== undefined && t.verifyTime) {
      if (Date.now() - new Date(t.verifyTime).getTime() > opts.withinDays * DAY_MS) continue
    }
    for (const id of ticketSpotIds(t)) lit.add(id)
  }
  return lit
}

export function userRecentLitSpots(userId: number, withinDays: number): number[] {
  return [...userLitSpotIds(userId, { withinDays })]
}

export function spotLightCounts(spotId: number): number {
  const seenUsers = new Set<number>()
  for (const t of validTickets()) if (ticketSpotIds(t).includes(spotId)) seenUsers.add(t.userId)
  return seenUsers.size
}

export function routeStopsView(routeId: number): FootprintStopView[] {
  return getItinerary(routeId).map((stop) => {
    const spot = getSpot(stop.spotId)!
    const count = spotLightCounts(stop.spotId)
    return { spotId: stop.spotId, name: spot.name, icon: spot.icon, lit: count > 0, locked: count === 0, lightCount: count, dayNo: stop.dayNo }
  })
}

export function postFootprintView(postId: number): {
  mode: FootprintMode; routeId?: number; stops: FootprintStopView[]
} {
  const post = getPost(postId)
  const snaps: PostFootprint[] = getPostFootprints(postId)
  if (post?.linkedRouteId && snaps.some((s) => s.mode === 'route')) {
    const routeId = post.linkedRouteId
    const stops = routeStopsView(routeId).map((v) => {
      const snap = snaps.find((s) => s.spotId === v.spotId)
      const lit = !!snap && snap.status === 'normal'
      const ticket = validTickets(post.userId).find((t) => ticketSpotIds(t).includes(v.spotId))
      return {
        ...v, lit, locked: !lit,
        memo: snap?.memo, verifyDate: ticket?.verifyTime?.slice(0, 10), dayNo: snap?.dayNo ?? v.dayNo,
      }
    })
    return { mode: 'route', routeId, stops }
  }
  // 模式A：作者近 30 天核销聚合，只列 lit 站点
  const litIds = userLitSpotIds(post?.userId ?? 0, { withinDays: 30 })
  const stops: FootprintStopView[] = [...litIds]
    .map((id) => getSpot(id))
    .filter((s) => !!s)
    .map((s) => ({ spotId: s!.id, name: s!.name, icon: s!.icon, lit: true, locked: false }))
  return { mode: 'auto', stops }
}
