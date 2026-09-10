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
import { TravelRecommendSlotEntity } from '../../entity/recommend-slot';

/**
 * C端推荐位（匿名；驱动首页焦点轮播等运营位）
 */
@CoolUrlTag()
@CoolController()
export class AppTravelRecommendController extends BaseController {
  @InjectEntityModel(TravelRecommendSlotEntity)
  recommendSlotEntity: Repository<TravelRecommendSlotEntity>;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '推荐位列表' })
  async pageList(@Query('position') position: string) {
    const list = await this.recommendSlotEntity.find({
      where: { position: position || 'home', status: 1 },
      order: { sort: 'ASC', id: 'DESC' },
    });
    return this.ok(list);
  }
}
