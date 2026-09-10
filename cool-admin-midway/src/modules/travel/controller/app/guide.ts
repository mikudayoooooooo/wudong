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
import { TravelTrafficGuideEntity } from '../../entity/traffic-guide';

/**
 * C端交通攻略（匿名可浏览）
 */
@CoolUrlTag()
@CoolController()
export class AppTravelGuideController extends BaseController {
  @InjectEntityModel(TravelTrafficGuideEntity)
  guideEntity: Repository<TravelTrafficGuideEntity>;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '攻略列表' })
  async pageList() {
    const list = await this.guideEntity.find({
      where: { status: 1 },
      order: { sort: 'ASC', id: 'DESC' },
    });
    return this.ok(list);
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/detail', { summary: '攻略详情' })
  async detail(@Query('id') id: number) {
    return this.ok(
      await this.guideEntity.findOneBy({ id: Number(id), status: 1 })
    );
  }
}
