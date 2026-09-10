import { Provide, Inject } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { In, Repository } from 'typeorm';
import { ReservationEntity } from '../entity/reservation';
import { RestaurantEntity } from '../entity/restaurant';
import { TimeSlotEntity } from '../entity/time-slot';
import { OrderEntity } from '../../order/entity/order';
import { OrderService } from '../../order/service/order';
import { PayService } from '../../pay/service/pay';
import { PaymentRecordEntity } from '../../pay/entity/record';

/**
 * 餐位预订服务
 * 业务侧负责时段容量校验；订单与支付走公共 order/pay 模块
 * （OrderService.create(module='food', orderType=2)，明细落 order_reservation）
 */
@Provide()
export class ReservationService extends BaseService {
  @InjectEntityModel(ReservationEntity)
  reservationEntity: Repository<ReservationEntity>;

  @InjectEntityModel(RestaurantEntity)
  restaurantEntity: Repository<RestaurantEntity>;

  @InjectEntityModel(TimeSlotEntity)
  timeSlotEntity: Repository<TimeSlotEntity>;

  @InjectEntityModel(OrderEntity)
  orderEntity: Repository<OrderEntity>;

  @InjectEntityModel(PaymentRecordEntity)
  paymentRecordEntity: Repository<PaymentRecordEntity>;

  @Inject()
  orderService: OrderService;

  @Inject()
  payService: PayService;

  /** 修复原实现的坏关系查询：手动组装餐厅/时段展示信息 */
  private async withRefs(rows: ReservationEntity[]) {
    const rids = [...new Set(rows.map((r) => r.restaurantId))];
    const tids = [...new Set(rows.map((r) => r.timeSlotId))];
    const restaurants = rids.length
      ? await this.restaurantEntity.createQueryBuilder().where('id IN (:...ids)', { ids: rids }).getMany()
      : [];
    const slots = tids.length
      ? await this.timeSlotEntity.createQueryBuilder().where('id IN (:...ids)', { ids: tids }).getMany()
      : [];
    const rmap = new Map(restaurants.map((r) => [r.id, r]));
    const smap = new Map(slots.map((s) => [s.id, s]));
    return rows.map((r) => ({
      ...r,
      restaurantName: rmap.get(r.restaurantId)?.name,
      restaurantAddress: rmap.get(r.restaurantId)?.address,
      timePeriod: smap.get(r.timeSlotId)?.timePeriod,
      slotStart: smap.get(r.timeSlotId)?.startTime,
      slotEnd: smap.get(r.timeSlotId)?.endTime,
    }));
  }

  /**
   * 创建预订：容量校验 → 公共订单（服务端按人均价计价）→ 业务预订记录
   */
  async create(data: any) {
    const {
      userId,
      restaurantId,
      timeSlotId,
      reservationDate,
      peopleCount,
      contactName,
      contactPhone,
      remark,
    } = data;

    const guests = Number(peopleCount);
    if (!(guests >= 1 && guests <= 50)) {
      throw new CoolCommException('用餐人数需为 1-50');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(reservationDate || ''))) {
      throw new CoolCommException('预订日期格式不正确');
    }
    if (!contactName || !contactPhone) {
      throw new CoolCommException('请填写联系人信息');
    }

    // 验证餐厅是否存在
    const restaurant = await this.restaurantEntity.findOneBy({
      id: restaurantId,
      status: 1,
    });
    if (!restaurant) {
      throw new CoolCommException('餐厅不存在或已关闭');
    }
    if (!(Number(restaurant.avgPrice) > 0)) {
      throw new CoolCommException('该餐厅暂未开放预订');
    }

    // 验证时段是否存在
    const timeSlot = await this.timeSlotEntity.findOneBy({
      id: timeSlotId,
      restaurantId,
    });
    if (!timeSlot) {
      throw new CoolCommException('时段不存在');
    }

    // 检查该时段是否已满（待确认+已确认均占用容量）
    const existingCount = await this.reservationEntity.count({
      where: {
        restaurantId,
        timeSlotId,
        reservationDate,
        status: In([0, 1]),
      },
    });

    if (existingCount >= timeSlot.maxReservations) {
      throw new CoolCommException('该时段已约满');
    }

    // 公共订单：服务端按人均价计价（不信任前端）
    let orderNo: string;
    let payAmount: number;
    try {
      const r = await this.orderService.create(
        userId,
        {
          module: 'food',
          orderType: 2,
          items: [
            {
              targetId: restaurant.id,
              targetName: restaurant.name,
              checkInDate: reservationDate,
              guestName: contactName,
              guestPhone: contactPhone,
              guestCount: guests,
              timeSlot: `${timeSlot.timePeriod} ${timeSlot.startTime}-${timeSlot.endTime}`,
              price: Number(restaurant.avgPrice),
              quantity: guests,
            },
          ],
          remark,
        },
        restaurant.merchantId
      );
      orderNo = r.orderNo;
      payAmount = r.payAmount;
    } catch (err) {
      throw err;
    }

    // 业务预订记录（关联订单号）
    const reservation = await this.reservationEntity.save({
      userId,
      restaurantId,
      timeSlotId,
      reservationDate,
      peopleCount: guests,
      contactName,
      contactPhone,
      remark,
      orderNo,
      status: 0, // 待确认（支付到账 + 商家确认后置 1）
    } as any);

    return { ...reservation, payAmount };
  }

  /**
   * 获取用户预订列表
   */
  async getUserReservations(
    userId: number,
    page = 1,
    size = 10,
    status?: number
  ) {
    const query = this.reservationEntity
      .createQueryBuilder('reservation')
      .where('reservation.userId = :userId', { userId })
      .orderBy('reservation.createTime', 'DESC');

    if (status !== undefined) {
      query.andWhere('reservation.status = :status', { status });
    }

    const [list, total] = await query
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();

    return {
      list: await this.withRefs(list),
      pagination: { page, size, total },
    };
  }

  /**
   * 取消预订：
   * - 订单待支付 → 取消订单（释放时段容量）
   * - 订单已支付 → 全额退款 + 订单置已退款 + 释放容量
   */
  async cancelReservation(userId: number, reservationId: number) {
    const reservation = await this.reservationEntity.findOneBy({
      id: reservationId,
      userId,
    });

    if (!reservation) {
      throw new CoolCommException('预订不存在');
    }

    if (reservation.status !== 0 && reservation.status !== 1) {
      throw new CoolCommException('该预订无法取消');
    }

    if (reservation.orderNo) {
      const order = await this.orderEntity.findOneBy({
        orderNo: reservation.orderNo,
      });
      if (order && order.status === 1) {
        await this.orderService.cancel(userId, reservation.orderNo);
      } else if (order && [2, 3].includes(order.status)) {
        const paid = await this.paymentRecordEntity.findOneBy({
          orderId: order.id,
          payStatus: 2,
        });
        if (paid) {
          await this.payService.refund(paid.paymentNo, Number(order.payAmount));
        }
        await this.orderService.markRefunded(reservation.orderNo);
      }
    }

    await this.reservationEntity.update(
      { id: reservationId },
      {
        status: 2,
        cancelTime: new Date(),
      }
    );

    return true;
  }

  /**
   * 获取预订详情
   */
  async getDetail(userId: number, reservationId: number) {
    const reservation = await this.reservationEntity
      .createQueryBuilder('reservation')
      .where('reservation.id = :id', { id: reservationId })
      .andWhere('reservation.userId = :userId', { userId })
      .getOne();

    if (!reservation) return null;
    const [row] = await this.withRefs([reservation]);
    return row;
  }

  /**
   * 商家确认预订
   */
  async confirmReservation(merchantId: number, reservationId: number) {
    const reservation = await this.reservationEntity.findOne({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new CoolCommException('预订不存在');
    }

    const restaurant = await this.restaurantEntity.findOneBy({ id: reservation.restaurantId });
    if (!restaurant || restaurant.merchantId !== merchantId) {
      throw new CoolCommException('无权限操作');
    }

    if (reservation.status !== 0) {
      throw new CoolCommException('预订状态异常');
    }

    await this.reservationEntity.update(
      { id: reservationId },
      {
        status: 1,
        confirmTime: new Date(),
      }
    );

    return true;
  }
}
