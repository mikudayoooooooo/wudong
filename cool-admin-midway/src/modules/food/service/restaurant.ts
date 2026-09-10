import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantEntity } from '../entity/restaurant';
import { DishEntity } from '../entity/dish';
import { TimeSlotEntity } from '../entity/time-slot';
import { MerchantService } from '../../merchant/service/merchant';

/**
 * 餐厅服务
 */
@Provide()
export class RestaurantService extends BaseService {
  @InjectEntityModel(RestaurantEntity)
  restaurantEntity: Repository<RestaurantEntity>;

  @InjectEntityModel(DishEntity)
  dishEntity: Repository<DishEntity>;

  @InjectEntityModel(TimeSlotEntity)
  timeSlotEntity: Repository<TimeSlotEntity>;

  @Inject()
  merchantService: MerchantService;

  /**
   * 创建餐厅
   */
  async create(merchantId: number, data: any) {
    const merchant = await this.merchantService.isMerchant(merchantId);
    if (!merchant || merchant.module !== 'food') {
      throw new CoolCommException('无权限或模块不匹配');
    }

    return await this.restaurantEntity.save({
      merchantId,
      name: data.name,
      coverImage: data.coverImage,
      images: data.images,
      address: data.address,
      longitude: data.longitude,
      latitude: data.latitude,
      phone: data.phone,
      businessHours: data.businessHours,
      avgPrice: data.avgPrice,
      specialty: data.specialty,
      description: data.description,
    });
  }

  /**
   * 更新餐厅
   */
  async updateRestaurant(merchantId: number, restaurantId: number, data: any) {
    const restaurant = await this.restaurantEntity.findOneBy({
      id: restaurantId,
      merchantId,
    });
    if (!restaurant) {
      throw new CoolCommException('餐厅不存在或无权限');
    }

    await this.restaurantEntity.update(
      { id: restaurantId },
      {
        name: data.name,
        coverImage: data.coverImage,
        images: data.images,
        address: data.address,
        longitude: data.longitude,
        latitude: data.latitude,
        phone: data.phone,
        businessHours: data.businessHours,
        avgPrice: data.avgPrice,
        specialty: data.specialty,
        description: data.description,
      }
    );

    return true;
  }

  /**
   * C端：获取餐厅列表（仅显示营业中的）
   */
  async getPublicList(params: any) {
    const { page = 1, size = 10, keyword, longitude, latitude, sort } = params;

    const query = this.restaurantEntity
      .createQueryBuilder('restaurant')
      .where('restaurant.status = :status', { status: 1 })
      .select([
        'restaurant.id',
        'restaurant.name',
        'restaurant.coverImage',
        'restaurant.address',
        'restaurant.phone',
        'restaurant.avgPrice',
        'restaurant.rating',
        'restaurant.longitude',
        'restaurant.latitude',
      ]);

    // 关键词搜索
    if (keyword) {
      query.andWhere('restaurant.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    // 排序
    if (sort === 'rating') {
      query.orderBy('restaurant.rating', 'DESC');
    } else if (sort === 'price') {
      query.orderBy('restaurant.avgPrice', 'ASC');
    } else {
      query.orderBy('restaurant.createTime', 'DESC');
    }

    const [list, total] = await query
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();

    // 如果提供了位置信息，计算距离
    if (longitude && latitude) {
      list.forEach((restaurant: any) => {
        restaurant.distance = this.calculateDistance(
          latitude,
          longitude,
          restaurant.latitude,
          restaurant.longitude
        );
      });

      // 按距离排序
      if (sort === 'distance') {
        list.sort((a: any, b: any) => a.distance - b.distance);
      }
    }

    return {
      list,
      pagination: { page, size, total },
    };
  }

  /**
   * 计算两点距离（单位：公里）
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // 地球半径（公里）
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // 保留一位小数
  }

  /**
   * C端：获取餐厅详情
   */
  async getDetail(id: number) {
    const restaurant = await this.restaurantEntity.findOne({
      where: { id, status: 1 },
    });

    if (!restaurant) {
      return null;
    }

    // 增加浏览量
    await this.restaurantEntity.increment({ id }, 'views', 1);

    return restaurant;
  }

  /**
   * 获取餐厅菜品
   */
  async getRestaurantDishes(restaurantId: number) {
    const dishes = await this.dishEntity.find({
      where: { restaurantId, status: 1 },
      order: { sort: 'ASC', createTime: 'DESC' },
    });

    return dishes;
  }

  /**
   * 获取可预订时段
   */
  async getAvailableTimeSlots(restaurantId: number, date: string) {
    const slots = await this.timeSlotEntity.find({
      where: { restaurantId },
      order: { startTime: 'ASC' },
    });

    // TODO: 这里可以进一步查询每个时段的预订情况，返回剩余桌数
    return slots.map(slot => ({
      id: slot.id,
      name: slot.name,
      startTime: slot.startTime,
      endTime: slot.endTime,
      maxTables: slot.maxTables,
      // available: slot.maxTables - bookedCount
    }));
  }
}
