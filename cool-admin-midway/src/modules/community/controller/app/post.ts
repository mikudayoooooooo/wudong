import {
  BaseController,
  CoolController,
  CoolTag,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { CommunityPostService } from '../../service/post';

/**
 * C端游记（feed/浏览匿名；发布/删除需登录）
 */
@CoolUrlTag()
@CoolController()
export class AppCommunityPostController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  postService: CommunityPostService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/feed', { summary: '信息流' })
  async feed(
    @Query('tab') tab: string,
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('linkedRouteId') linkedRouteId: number
  ) {
    return this.ok(
      await this.postService.feed(
        this.ctx.user?.id,
        tab || 'recommend',
        Number(page) || 1,
        Math.min(Number(size) || 10, 50),
        linkedRouteId ? Number(linkedRouteId) : undefined
      )
    );
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/detail', { summary: '游记详情' })
  async detail(@Query('id') id: number) {
    return this.ok(await this.postService.detail(Number(id), this.ctx.user?.id));
  }

  @Post('/add', { summary: '发布游记' })
  async addItem(@Body() body) {
    return this.ok(await this.postService.addPost(this.ctx.user.id, body));
  }

  @Post('/attachRoute', { summary: '关联路线（模式B足迹）' })
  async attachRoute(@Body() body) {
    return this.ok(await this.postService.attachRoute(this.ctx.user.id, body));
  }

  @Post('/delete', { summary: '删除本人游记' })
  async remove(@Body('id') id: number) {
    return this.ok(await this.postService.removeOwn(this.ctx.user.id, Number(id)));
  }
}
