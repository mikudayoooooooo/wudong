import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { RoomCalendarEntity } from '../entity/room-calendar';
import { RoomTypeEntity } from '../entity/room-type';
import { HotelEntity } from '../entity/hotel';

const FMT = 'YYYY-MM-DD';

/**
 * 房态日历：按需落记录 + 查询回退默认（spec D2）
 */
@Provide()
export class RoomCalendarService extends BaseService {
  @InjectEntityModel(RoomCalendarEntity)
  roomCalendarEntity: Repository<RoomCalendarEntity>;

  @InjectEntityModel(RoomTypeEntity)
  roomTypeEntity: Repository<RoomTypeEntity>;

  @InjectEntityModel(HotelEntity)
  hotelEntity: Repository<HotelEntity>;

  /**
   * 批量设置：区间（可选限定星期几 0-6）逐日 upsert。
   * closed=true → 当日 status=0；否则写 price/availableStock 并置可订；
   * availableStock 截断到房型 stock。
   */
  async batch(param: {
    roomTypeId: number;
    startDate: string;
    endDate: string;
    weekDays?: number[];
    price?: number;
    availableStock?: number;
    closed?: boolean;
  }): Promise<{ count: number }> {
    const roomType = await this.roomTypeEntity.findOneBy({
      id: param.roomTypeId,
    });
    if (!roomType) {
      throw new CoolCommException('房型不存在');
    }
    const start = moment(param.startDate, FMT);
    const end = moment(param.endDate, FMT);
    const week = (param.weekDays || []).map(Number);

    // 预载区间已有行
    const existingRows = await this.roomCalendarEntity
      .createQueryBuilder('c')
      .where('c.roomTypeId = :id', { id: param.roomTypeId })
      .andWhere('c.date >= :start', { start: param.startDate })
      .andWhere('c.date <= :end', { end: param.endDate })
      .getMany();
    const map: Record<string, RoomCalendarEntity> = {};
    for (const r of existingRows) map[r.date] = r;

    let count = 0;
    const cursor = start.clone();
    while (cursor.isSameOrBefore(end, 'day')) {
      const day = cursor.format(FMT);
      if (week.length === 0 || week.includes(cursor.day())) {
        const row = map[day] || new RoomCalendarEntity();
        row.roomTypeId = param.roomTypeId;
        row.date = day;
        if (param.closed) {
          row.status = 0;
          // 新建/历史 closed 行补默认价与库存，保证结构完整可复开
          if (row.price == null) row.price = roomType.price;
          if (row.availableStock == null) row.availableStock = roomType.stock;
        } else {
          row.status = 1;
          if (param.price != null) row.price = param.price;
          if (param.availableStock != null) {
            row.availableStock = Math.min(
              Number(param.availableStock),
              roomType.stock
            );
          } else if (row.availableStock == null) {
            row.availableStock = roomType.stock;
          }
        }
        await this.roomCalendarEntity.save(row);
        count++;
      }
      cursor.add(1, 'day');
    }
    return { count };
  }

  /**
   * 区间查询（含回退默认：无记录日期 = 房型基础价/满库/房型是否启用）
   */
  async range(
    roomTypeId: number,
    startDate: string,
    endDate: string
  ): Promise<
    { date: string; price: any; availableStock: number; status: number }[]
  > {
    const roomType = await this.roomTypeEntity.findOneBy({ id: roomTypeId });
    if (!roomType) {
      throw new CoolCommException('房型不存在');
    }
    const rows = await this.roomCalendarEntity
      .createQueryBuilder('c')
      .where('c.roomTypeId = :id', { id: roomTypeId })
      .andWhere('c.date >= :start', { start: startDate })
      .andWhere('c.date <= :end', { end: endDate })
      .orderBy('c.date', 'ASC')
      .getMany();
    const map: Record<string, RoomCalendarEntity> = {};
    for (const r of rows) map[r.date] = r;

    const out: any[] = [];
    const cursor = moment(startDate, FMT);
    const end = moment(endDate, FMT);
    const rtOn = roomType.status === 1;
    while (cursor.isSameOrBefore(end, 'day')) {
      const day = cursor.format(FMT);
      const r = map[day];
      if (r) {
        out.push({
          date: day,
          price: r.price,
          availableStock: r.availableStock,
          status: r.status === 1 && rtOn ? 1 : 0,
        });
      } else {
        out.push({
          date: day,
          price: roomType.price,
          availableStock: roomType.stock,
          status: rtOn ? 1 : 0,
        });
      }
      cursor.add(1, 'day');
    }
    return out;
  }
}
