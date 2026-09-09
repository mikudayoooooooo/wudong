import {
  CoolController,
  CoolTag,
  CoolUrlTag,
  BaseController,
  TagTypes,
} from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Get } from '@midwayjs/core';
import { Repository } from 'typeorm';
import { AnnouncementEntity } from '../../entity/announcement';

/**
 * C端公告（匿名可看）
 */
@CoolUrlTag()
@CoolController()
export class AppOperateAnnouncementController extends BaseController {
  @InjectEntityModel(AnnouncementEntity)
  announcementEntity: Repository<AnnouncementEntity>;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '公告列表' })
  async pageList() {
    const list = await this.announcementEntity.find({
      where: { status: 1 },
      order: { isTop: 'DESC', id: 'DESC' },
    });
    return this.ok(list);
  }
}
