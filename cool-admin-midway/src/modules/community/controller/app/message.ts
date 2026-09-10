import { BaseController, CoolController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, IsNull, Repository } from 'typeorm';
import { CommunityMessageEntity } from '../../entity/message';

/**
 * C端互动消息（like/comment/follow）
 */
@CoolController()
export class AppCommunityMessageController extends BaseController {
  @InjectEntityModel(CommunityMessageEntity)
  messageEntity: Repository<CommunityMessageEntity>;

  @Inject()
  ctx;

  @Get('/page', { summary: '我的消息分页' })
  async pageList(
    @Query('type') type: string,
    @Query('page') page: number,
    @Query('size') size: number
  ) {
    const p = Math.max(1, Number(page) || 1);
    const s = Math.min(Number(size) || 10, 50);
    const qb = this.messageEntity
      .createQueryBuilder('m')
      .where('(m.userId = :uid OR m.userId IS NULL)', { uid: this.ctx.user.id })
      .andWhere(type ? 'm.type = :type' : '1=1', { type })
      .orderBy('m.id', 'DESC')
      .skip((p - 1) * s)
      .take(s);
    const [list, total] = await qb.getManyAndCount();
    return this.ok({ list, total });
  }

  @Get('/unreadCount', { summary: '未读数' })
  async unreadCount() {
    const n = await this.messageEntity.count({
      where: [
        { userId: Equal(this.ctx.user.id), isRead: 0 },
        { userId: IsNull(), isRead: 0 },
      ],
    });
    return this.ok(n);
  }

  @Post('/read', { summary: '标记已读' })
  async markRead(@Body('ids') ids: number[]) {
    const list = Array.isArray(ids) ? ids.map(Number).filter(Boolean) : [];
    if (!list.length) return this.ok(true);
    await this.messageEntity.update(
      {
        id: list.length ? list : undefined,
        userId: Equal(this.ctx.user.id),
      } as any,
      { isRead: 1 }
    );
    return this.ok(true);
  }
}
