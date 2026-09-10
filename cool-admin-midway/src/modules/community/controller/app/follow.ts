import { BaseController, CoolController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { CommunityFollowEntity } from '../../entity/follow';
import { MemberUserEntity } from '../../../member/entity/user';
import { CommunityMessageEntity } from '../../entity/message';

/**
 * C端用户关注（幂等切换 + 关注列表）
 */
@CoolController()
export class AppCommunityFollowController extends BaseController {
  @InjectEntityModel(CommunityFollowEntity)
  followEntity: Repository<CommunityFollowEntity>;

  @InjectEntityModel(MemberUserEntity)
  memberUserEntity: Repository<MemberUserEntity>;

  @InjectEntityModel(CommunityMessageEntity)
  messageEntity: Repository<CommunityMessageEntity>;

  @Inject()
  ctx;

  @Post('/toggle', { summary: '关注/取关用户' })
  async toggle(@Body('followingId') followingId: number) {
    const userId = this.ctx.user.id;
    const target = Number(followingId);
    if (target === userId) return this.fail('不能关注自己');
    const exist = await this.followEntity.findOneBy({
      userId: Equal(userId),
      followingId: Equal(target),
    });
    if (exist) {
      await this.followEntity.delete({ id: exist.id });
      return this.ok({ followed: false });
    }
    try {
      await this.followEntity.insert({ userId, followingId: target });
    } catch (err: any) {
      if (err?.code !== 'ER_DUP_ENTRY' && err?.errno !== 1062) throw err;
    }
    const me = await this.memberUserEntity.findOneBy({ id: userId });
    await this.messageEntity.insert({
      userId: target,
      type: 'follow',
      refType: 'user',
      refId: userId,
      content: `${me?.nickname || '有人'} 关注了你`,
      isRead: 0,
    });
    return this.ok({ followed: true });
  }

  @Get('/list', { summary: '我的关注列表' })
  async pageList(@Query('userId') userId: number) {
    const uid = Number(userId) || this.ctx.user.id;
    const rows = await this.followEntity.find({
      where: { userId: Equal(uid) },
      order: { id: 'DESC' },
    });
    const ids = rows.map((r) => r.followingId);
    const users = ids.length
      ? await this.memberUserEntity
          .createQueryBuilder()
          .where('id IN (:...ids)', { ids })
          .getMany()
      : [];
    return this.ok(
      users.map((u) => ({
        id: u.id,
        nickname: u.nickname,
        avatar: u.avatar,
        bio: u.bio,
      }))
    );
  }
}
