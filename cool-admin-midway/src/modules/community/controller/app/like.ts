import { BaseController, CoolController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { CommunityLikeEntity } from '../../entity/like';
import { CommunityPostEntity } from '../../entity/post';
import { CommunityCommentEntity } from '../../entity/comment';
import { CommunityMessageEntity } from '../../entity/message';

/**
 * C端点赞（post/comment，幂等切换）
 */
@CoolController()
export class AppCommunityLikeController extends BaseController {
  @InjectEntityModel(CommunityLikeEntity)
  likeEntity: Repository<CommunityLikeEntity>;

  @InjectEntityModel(CommunityPostEntity)
  postEntity: Repository<CommunityPostEntity>;

  @InjectEntityModel(CommunityCommentEntity)
  commentEntity: Repository<CommunityCommentEntity>;

  @InjectEntityModel(CommunityMessageEntity)
  messageEntity: Repository<CommunityMessageEntity>;

  @Inject()
  ctx;

  @Post('/toggle', { summary: '点赞/取消' })
  async toggle(@Body() body) {
    const userId = this.ctx.user.id;
    const targetType = String(body?.targetType);
    const targetId = Number(body?.targetId);
    if (!['post', 'comment'].includes(targetType)) {
      return this.fail('点赞目标类型不正确');
    }
    const exist = await this.likeEntity.findOneBy({
      userId: Equal(userId),
      targetType,
      targetId,
    });
    const delta = exist ? -1 : 1;
    if (exist) {
      await this.likeEntity.delete({ id: exist.id });
    } else {
      try {
        await this.likeEntity.insert({ userId, targetType, targetId });
      } catch (err: any) {
        if (err?.code !== 'ER_DUP_ENTRY' && err?.errno !== 1062) throw err;
      }
    }
    let count = 0;
    if (targetType === 'post') {
      const post = await this.postEntity.findOneBy({ id: targetId });
      if (post) {
        await this.postEntity.decrement({ id: targetId }, 'likeCount', -delta);
        count = post.likeCount + delta;
        if (delta === 1 && post.userId !== userId) {
          await this.messageEntity.insert({
            userId: post.userId,
            type: 'like',
            refType: 'post',
            refId: targetId,
            content: `你的游记《${post.title}》收到了新的点赞`,
            isRead: 0,
          });
        }
      }
    } else {
      const comment = await this.commentEntity.findOneBy({ id: targetId });
      if (comment) {
        await this.commentEntity.decrement(
          { id: targetId },
          'likeCount',
          -delta
        );
        count = comment.likeCount + delta;
      }
    }
    return this.ok({ liked: !exist, count });
  }
}
