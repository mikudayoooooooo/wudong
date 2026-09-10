import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
  CoolTag,
} from '@cool-midway/core';
import { Get, Inject, Query } from '@midwayjs/core';
import { BannerService } from '../../service/banner';
import { AnnouncementService } from '../../service/announcement';

/**
 * C 端运营位下发（匿名）
 * 注：控制器文件名 operate 与模块目录 operate 同名，Cool 按文件路径推导会得到
 * 冗余前缀 /app/operate/operate，故显式固定前缀为 /app/operate。
 */
@CoolUrlTag()
@CoolController('/app/operate')
export class AppOperateController extends BaseController {
  @Inject()
  bannerService: BannerService;

  @Inject()
  announcementService: AnnouncementService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/banner/list', { summary: '轮播图下发' })
  async banner(@Query('position') position?: string) {
    return this.ok(await this.bannerService.bannerList(position));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/announcement/list', { summary: '公告下发' })
  async announcement(@Query('type') type?: number) {
    return this.ok(
      await this.announcementService.announcementList(
        type != null ? Number(type) : undefined
      )
    );
  }
}
