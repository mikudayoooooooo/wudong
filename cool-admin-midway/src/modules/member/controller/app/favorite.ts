import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { MemberFavoriteService } from '../../service/favorite';

/**
 * 收藏（需登录）
 */
@CoolController()
export class AppMemberFavoriteController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  memberFavoriteService: MemberFavoriteService;

  @Post('/toggle', { summary: '收藏/取消收藏' })
  async toggle(
    @Body('targetType') targetType: string,
    @Body('targetId') targetId: number
  ) {
    return this.ok(
      await this.memberFavoriteService.toggle(
        this.ctx.user.id,
        targetType,
        targetId
      )
    );
  }

  @Get('/check', { summary: '是否已收藏' })
  async check(
    @Query('targetType') targetType: string,
    @Query('targetId') targetId: number
  ) {
    return this.ok(
      await this.memberFavoriteService.check(
        this.ctx.user.id,
        targetType,
        targetId
      )
    );
  }

  // 注：BaseController 自带无参 page()/list() 内置 CRUD 方法，此处自定义方法
  // 不能与其重名（TS2416 导致启动失败），故命名 pageList，路由仍为 GET /page
  @Get('/page', { summary: '我的收藏' })
  async pageList(
    @Query('targetType') targetType: string,
    @Query('page') page: number,
    @Query('size') size: number
  ) {
    return this.ok(
      await this.memberFavoriteService.pageList(
        this.ctx.user.id,
        targetType,
        page,
        size
      )
    );
  }
}
