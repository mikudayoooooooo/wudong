import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { MessageService } from '../../service/message';

/**
 * C端消息中心（需登录）
 */
@CoolController({ prefix: '/app/message' })
export class AppMessageController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  messageService: MessageService;

  @Get('/page', { summary: '我的消息分页' })
  async pageList(
    @Query('type') type: string,
    @Query('page') page: number,
    @Query('size') size: number
  ) {
    return this.ok(
      await this.messageService.pageList(this.ctx.user.id, type, page, size)
    );
  }

  @Get('/unreadCount', { summary: '未读消息数' })
  async unreadCount() {
    return this.ok(await this.messageService.unreadCount(this.ctx.user.id));
  }

  @Post('/read', { summary: '标记已读' })
  async read(@Body('ids') ids: number[]) {
    return this.ok(await this.messageService.markRead(this.ctx.user.id, ids));
  }
}
