import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TravelETicketEntity } from '../entity/e-ticket';
import { TravelTicketTypeEntity } from '../entity/ticket-type';
import { TravelRouteItineraryEntity } from '../entity/route-itinerary';

const DAY_MS = 24 * 3600 * 1000;

/**
 * 足迹统计服务（行→社区联动的数据基座）
 * 点亮 100% 由已核销电子票驱动：route 票覆盖行程全部站点，ticket 票经票种映射到景区
 * community 模块注入本服务生成足迹快照/档案，保证作者无法伪造
 */
@Provide()
export class TravelFootprintService {
  @InjectEntityModel(TravelETicketEntity)
  eTicketEntity: Repository<TravelETicketEntity>;

  @InjectEntityModel(TravelTicketTypeEntity)
  ticketTypeEntity: Repository<TravelTicketTypeEntity>;

  @InjectEntityModel(TravelRouteItineraryEntity)
  itineraryEntity: Repository<TravelRouteItineraryEntity>;

  /** 票覆盖的站点ID集合 */
  private async ticketSpotIds(t: TravelETicketEntity): Promise<number[]> {
    if (t.itemType === 'route') {
      const stops = await this.itineraryEntity.find({
        where: { routeId: t.itemId },
      });
      return stops.map((s) => s.scenicSpotId);
    }
    const tt = await this.ticketTypeEntity.findOneBy({ id: t.itemId });
    return tt ? [tt.scenicSpotId] : [];
  }

  /** 用户已核销（可选时间窗）点亮的站点集合 */
  async userLitSpotIds(
    userId: number,
    opts?: { withinDays?: number }
  ): Promise<Set<number>> {
    const lit = new Set<number>();
    const tickets = await this.eTicketEntity.find({
      where: { userId, status: 'used' },
    });
    for (const t of tickets) {
      if (opts?.withinDays !== undefined && t.verifyTime) {
        const vt = new Date(
          String(t.verifyTime).replace(' ', 'T')
        ).getTime();
        if (Date.now() - vt > opts.withinDays * DAY_MS) continue;
      }
      for (const id of await this.ticketSpotIds(t)) lit.add(id);
    }
    return lit;
  }

  /** 站点被多少名用户点亮（按用户去重） */
  async spotLightCounts(spotId: number): Promise<number> {
    const tickets = await this.eTicketEntity.find({ where: { status: 'used' } });
    const seenUsers = new Set<number>();
    for (const t of tickets) {
      if ((await this.ticketSpotIds(t)).includes(spotId)) {
        seenUsers.add(t.userId);
      }
    }
    return seenUsers.size;
  }

  /** 路线各站点的视图数据（行程站 + 点亮人数 + lit/locked） */
  async routeStopsView(routeId: number) {
    const stops = await this.itineraryEntity.find({
      where: { routeId },
      order: { dayNo: 'ASC', sort: 'ASC' },
    });
    const result = [];
    for (const s of stops) {
      const count = await this.spotLightCounts(s.scenicSpotId);
      result.push({
        spotId: s.scenicSpotId,
        dayNo: s.dayNo,
        description: s.description,
        lit: count > 0,
        locked: count === 0,
        lightCount: count,
      });
    }
    return result;
  }
}
