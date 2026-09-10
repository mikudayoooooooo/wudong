import {
  BaseController,
  CoolController,
  CoolTag,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Get, Query } from '@midwayjs/core';
import { Repository } from 'typeorm';
import { TravelInventoryEntity } from '../../entity/inventory';

/**
 * C端日期库存（匿名）
 */
@CoolUrlTag()
@CoolController()
export class AppTravelInventoryController extends BaseController {
  @InjectEntityModel(TravelInventoryEntity)
  inventoryEntity: Repository<TravelInventoryEntity>;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '库存列表' })
  async pageList(
    @Query('itemType') itemType: string,
    @Query('itemId') itemId: number
  ) {
    const list = await this.inventoryEntity.find({
      where: { itemType, itemId: Number(itemId) },
      order: { useDate: 'ASC' },
    });
    return this.ok(list);
  }
}
