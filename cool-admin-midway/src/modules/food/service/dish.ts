import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { DishEntity } from '../entity/dish';
import { RestaurantEntity } from '../entity/restaurant';

/**
 * 菜品服务
 */
@Provide()
export class DishService extends BaseService {
  @InjectEntityModel(DishEntity)
  dishEntity: Repository<DishEntity>;

  @InjectEntityModel(RestaurantEntity)
  restaurantEntity: Repository<RestaurantEntity>;

  /**
   * 添加菜品
   */
  async create(merchantId: number, data: any) {
    // 验证餐厅归属
    const restaurant = await this.restaurantEntity.findOneBy({
      id: data.restaurantId,
      merchantId,
    });
    if (!restaurant) {
      throw new CoolCommException('餐厅不存在或无权限');
    }

    return await this.dishEntity.save({
      restaurantId: data.restaurantId,
      name: data.name,
      image: data.image,
      price: data.price,
      category: data.category,
      description: data.description,
      isRecommended: data.isRecommended || 0,
    });
  }
}
