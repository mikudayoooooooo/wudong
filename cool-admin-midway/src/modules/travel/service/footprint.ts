import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TravelETicketEntity } from '../entity/e-ticket';
import { TravelTicketTypeEntity } from '../entity/ticket-type';
import { TravelRouteItineraryEntity } from '../entity/route-itinerary';

const DAY_MS = 24 * 3600 * 1000;

interface Graph {
  /** spotId → 点亮用户集合 */
  spotUsers: Map<number, Set<number>>;
  /** userId → 点亮站点集合 */
  userSpots: Map<number, Set<number>>;
  /** ticketId → 核销时间（withinDays 过滤用） */
  ticketVerify: { userId: number; verifyTime?: string; spots: number[] }[];
}

/**
 * 足迹统计服务（行→社区联动的数据基座）
 * 点亮 100% 由已核销电子票驱动：route 票覆盖行程全部站点，ticket 票经票种映射到景区
 * community 模块注入本服务生成足迹快照/档案，保证作者无法伪造
 *
 * 性能：全量聚合只需 3 次查询（票/行程/票种），内存计算，避免 N+1
 */
@Provide()
export class TravelFootprintService {
  @InjectEntityModel(TravelETicketEntity)
  eTicketEntity: Repository<TravelETicketEntity>;

  @InjectEntityModel(TravelTicketTypeEntity)
  ticketTypeEntity: Repository<TravelTicketTypeEntity>;

  @InjectEntityModel(TravelRouteItineraryEntity)
  itineraryEntity: Repository<TravelRouteItineraryEntity>;

  /** 构建点亮图谱：3 次查询 + 内存聚合 */
  private async buildGraph(): Promise<Graph> {
    const [tickets, itineraries, ticketTypes] = await Promise.all([
      this.eTicketEntity.find({ where: { status: 'used' } }),
      this.itineraryEntity.find(),
      this.ticketTypeEntity.find(),
    ]);

    const routeSpots = new Map<number, number[]>();
    for (const it of itineraries) {
      const arr = routeSpots.get(it.routeId) || [];
      arr.push(it.scenicSpotId);
      routeSpots.set(it.routeId, arr);
    }
    const ticketSpot = new Map(ticketTypes.map((t) => [t.id, t.scenicSpotId]));

    const spotUsers = new Map<number, Set<number>>();
    const userSpots = new Map<number, Set<number>>();
    const ticketVerify: Graph['ticketVerify'] = [];

    for (const t of tickets) {
      const spots =
        t.itemType === 'route'
          ? routeSpots.get(t.itemId) || []
          : ticketSpot.has(t.itemId)
            ? [ticketSpot.get(t.itemId)!]
            : [];
      ticketVerify.push({ userId: t.userId, verifyTime: t.verifyTime as string, spots });
      for (const s of spots) {
        if (!spotUsers.has(s)) spotUsers.set(s, new Set());
        spotUsers.get(s)!.add(t.userId);
        if (!userSpots.has(t.userId)) userSpots.set(t.userId, new Set());
        userSpots.get(t.userId)!.add(s);
      }
    }
    return { spotUsers, userSpots, ticketVerify };
  }

  /** 用户已核销（可选时间窗）点亮的站点集合 */
  async userLitSpotIds(
    userId: number,
    opts?: { withinDays?: number }
  ): Promise<Set<number>> {
    const { userSpots, ticketVerify } = await this.buildGraph();
    const lit = new Set<number>();
    if (opts?.withinDays === undefined) {
      for (const s of userSpots.get(userId) || []) lit.add(s);
      return lit;
    }
    // 时间窗过滤：按票级核销时间逐票判断
    for (const t of ticketVerify) {
      if (t.userId !== userId) continue;
      if (t.verifyTime) {
        const vt = new Date(String(t.verifyTime).replace(' ', 'T')).getTime();
        if (Date.now() - vt > opts.withinDays * DAY_MS) continue;
      }
      for (const s of t.spots) lit.add(s);
    }
    return lit;
  }

  /** 全站各景点的点亮人数（一次聚合） */
  async spotLightCountsMap(): Promise<Map<number, number>> {
    const { spotUsers } = await this.buildGraph();
    const m = new Map<number, number>();
    for (const [s, users] of spotUsers) m.set(s, users.size);
    return m;
  }

  /** 单站点亮人数 */
  async spotLightCounts(spotId: number): Promise<number> {
    return (await this.spotLightCountsMap()).get(spotId) || 0;
  }

  /** 路线各站点的视图数据（行程站 + 点亮人数 + lit/locked） */
  async routeStopsView(routeId: number) {
    const stops = await this.itineraryEntity.find({
      where: { routeId },
      order: { dayNo: 'ASC', sort: 'ASC' },
    });
    const counts = await this.spotLightCountsMap();
    return stops.map((stop) => {
      const count = counts.get(stop.scenicSpotId) || 0;
      return {
        spotId: stop.scenicSpotId,
        dayNo: stop.dayNo,
        description: stop.description,
        lit: count > 0,
        locked: count === 0,
        lightCount: count,
      };
    });
  }
}
