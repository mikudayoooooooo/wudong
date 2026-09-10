import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { HotelEntity } from '../entity/hotel';
import { RoomTypeEntity } from '../entity/room-type';
import { RoomCalendarEntity } from '../entity/room-calendar';
import { OrderService } from '../../order/service/order';

/**
 * 住宿预订服务（C端）
 * 业务侧：房态校验（room_calendar 逐日可用/关房，缺行回退房型默认库存）
 * → 服务端按日计价（动态定价优先，回退房型价）→ 公共订单 OrderService(module='accommodation', orderType=3)
 * 金额 = Σ(每晚价) × 间数
 */
@Provide()
export class AccommodationBookingService extends BaseService {
  @InjectEntityModel(HotelEntity)
  hotelEntity: Repository<HotelEntity>;

  @InjectEntityModel(RoomTypeEntity)
  roomTypeEntity: Repository<RoomTypeEntity>;

  @InjectEntityModel(RoomCalendarEntity)
  roomCalendarEntity: Repository<RoomCalendarEntity>;

  @Inject()
  orderService: OrderService;

  /** 日期区间（含头不含尾）：checkIn..checkOut-1 每晚 */
  private nightDates(checkIn: string, checkOut: string): string[] {
    const nights: string[] = [];
    let cur = new Date(`${checkIn}T00:00:00+08:00`).getTime();
    const end = new Date(`${checkOut}T00:00:00+08:00`).getTime();
    while (cur < end) {
      nights.push(new Date(cur).toISOString().slice(0, 10));
      cur += 24 * 3600 * 1000;
    }
    return nights;
  }

  async create(userId: number, param: any) {
    const roomTypeId = Number(param?.roomTypeId);
    const checkIn = String(param?.checkInDate || '');
    const checkOut = String(param?.checkOutDate || '');
    const rooms = Number(param?.rooms || 1);
    if (!Number.isInteger(rooms) || rooms < 1 || rooms > 5) {
      throw new CoolCommException('预订间数需为 1-5');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) {
      throw new CoolCommException('入住/离店日期格式不正确');
    }
    // 最少提前 1 天入住
    const today = new Date().toISOString().slice(0, 10);
    if (checkIn <= today) {
      throw new CoolCommException('请至少提前 1 天预订');
    }
    const nights = this.nightDates(checkIn, checkOut);
    if (!nights.length) {
      throw new CoolCommException('离店日期需晚于入住日期');
    }

    const rt = await this.roomTypeEntity.findOneBy({ id: roomTypeId, status: 1 });
    if (!rt) throw new CoolCommException('房型不存在或已下架');
    const hotel = await this.hotelEntity.findOneBy({ id: rt.hotelId, status: 1 });
    if (!hotel) throw new CoolCommException('民宿不存在或已下架');

    // 逐晚房态校验与定价（room_calendar 行存在以行为准；缺行回退房型默认）
    const rows = await this.roomCalendarEntity.find({
      where: { roomTypeId },
    });
    const rowMap = new Map(rows.map((r) => [r.date, r]));
    let total = 0;
    const fallbackDates: string[] = [];
    for (const d of nights) {
      const row = rowMap.get(d);
      if (row) {
        if (row.status !== 1) throw new CoolCommException(`${d} 该房型不可订`);
        if (row.availableStock < rooms) throw new CoolCommException(`${d} 房量不足`);
        total += Number(row.price) * rooms;
      } else {
        if (rt.stock < rooms) throw new CoolCommException('房量不足');
        total += Number(rt.price) * rooms;
        fallbackDates.push(d);
      }
    }
    total = Number(total.toFixed(2));

    // 库存占用：有日历行的日期扣行库存；缺行日期扣房型默认库存
    for (const d of nights) {
      const row = rowMap.get(d);
      if (row) {
        await this.roomCalendarEntity
          .createQueryBuilder()
          .update(RoomCalendarEntity)
          .set({ availableStock: () => `availableStock - ${rooms}` })
          .where('id = :id AND availableStock >= :q', { id: row.id, q: rooms })
          .execute();
      }
    }
    if (fallbackDates.length) {
      await this.roomTypeEntity
        .createQueryBuilder()
        .update(RoomTypeEntity)
        .set({ stock: () => `stock - ${rooms}` })
        .where('id = :id AND stock >= :q', { id: rt.id, q: rooms })
        .execute();
    }

    // 公共订单（失败回补库存）
    try {
      const r = await this.orderService.create(userId, {
        module: 'accommodation',
        orderType: 3,
        items: [
          {
            targetId: rt.id,
            targetName: hotel.name,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            guestName: String(param?.guestName || userId),
            guestPhone: String(param?.guestPhone || ''),
            guestCount: Number(param?.guestCount || 2),
            roomTypeId: rt.id,
            specialRequest: param?.specialRequest || null,
            price: total,
            quantity: 1,
          },
        ],
        remark: param?.remark,
      });
      return { orderNo: r.orderNo, payAmount: r.payAmount, nights: nights.length };
    } catch (err) {
      // 回补：日历行 +1；缺行日期回补房型默认库存
      for (const d of nights) {
        const row = rowMap.get(d);
        if (row) {
          await this.roomCalendarEntity.increment(
            { id: row.id },
            'availableStock',
            rooms
          );
        }
      }
      if (fallbackDates.length) {
        await this.roomTypeEntity.increment({ id: rt.id }, 'stock', rooms);
      }
      throw err;
    }
  }
}
