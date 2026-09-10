import { Provide, Inject } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationEntity } from '../entity/reservation';
import { RestaurantEntity } from '../entity/restaurant';
import { TimeSlotEntity } from '../entity/time-slot';

/**
 * 预订服务
 */
@Provide()
export class ReservationService extends BaseService {
  @InjectEntityModel(ReservationEntity)
  reservationEntity: Repository<ReservationEntity>;

  @InjectEntityModel(RestaurantEntity)
  restaurantEntity: Repository<RestaurantEntity>;

  @InjectEntityModel(TimeSlotEntity)
  timeSlotEntity: Repository<TimeSlotEntity>;

  /**
   * 创建预订
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

    // 验证餐厅是否存在
    const restaurant = await this.restaurantEntity.findOneBy({
      id: restaurantId,
      status: 1,
    });
    if (!restaurant) {
      throw new CoolCommException('餐厅不存在或已关闭');
    }

    // 验证时段是否存在
    const timeSlot = await this.timeSlotEntity.findOneBy({
      id: timeSlotId,
      restaurantId,
    });
    if (!timeSlot) {
      throw new CoolCommException('时段不存在');
    }

    // 检查该时段是否已满
    const existingCount = await this.reservationEntity.count({
      where: {
        restaurantId,
        timeSlotId,
        reservationDate,
        status: 1, // 只统计已确认的
      },
    });

    if (existingCount >= timeSlot.maxTables) {
      throw new CoolCommException('该时段已约满');
    }

    // 创建预订
    const reservation = await this.reservationEntity.save({
      userId,
      restaurantId,
      timeSlotId,
      reservationDate,
      peopleCount,
      contactName,
      contactPhone,
      remark,
      status: 0, // 待确认
    });

    return reservation;
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
      .leftJoinAndSelect('reservation.restaurant', 'restaurant')
      .leftJoinAndSelect('reservation.timeSlot', 'timeSlot')
      .orderBy('reservation.createTime', 'DESC');

    if (status !== undefined) {
      query.andWhere('reservation.status = :status', { status });
    }

    const [list, total] = await query
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();

    return {
      list,
      pagination: { page, size, total },
    };
  }

  /**
   * 取消预订
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
      .leftJoinAndSelect('reservation.restaurant', 'restaurant')
      .leftJoinAndSelect('reservation.timeSlot', 'timeSlot')
      .getOne();

    return reservation;
  }

  /**
   * 商家确认预订
   */
  async confirmReservation(merchantId: number, reservationId: number) {
    const reservation = await this.reservationEntity.findOne({
      where: { id: reservationId },
      relations: ['restaurant'],
    });

    if (!reservation) {
      throw new CoolCommException('预订不存在');
    }

    if (reservation.restaurant.merchantId !== merchantId) {
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
