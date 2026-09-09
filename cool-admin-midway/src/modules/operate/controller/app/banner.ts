import {
  CoolController,
  CoolTag,
  CoolUrlTag,
  BaseController,
  TagTypes,
} from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Get, Query } from '@midwayjs/core';
import { Repository } from 'typeorm';
import { BannerEntity } from '../../entity/banner';

/**
 * C端轮播图（匿名可看）
 * 注意：IGNORE_TOKEN 标签按"推导前缀+路由"注册，自定义路由控制器不要显式
 * 覆盖 prefix（会与推导前缀分裂导致鉴权拦截）；文件名即资源名，路由 /list
 */
@CoolUrlTag()
@CoolController()
export class AppOperateBannerController extends BaseController {
  @InjectEntityModel(BannerEntity)
  bannerEntity: Repository<BannerEntity>;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '轮播图列表（按位置）' })
  async pageList(@Query('position') position: string) {
    const list = await this.bannerEntity.find({
      where: { position: position || 'home', status: 1 },
      order: { sort: 'ASC', id: 'DESC' },
    });
    return this.ok(list);
  }
}
