import {
  BaseController,
  CoolController,
  CoolTag,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { CommunityCommentEntity } from '../../entity/comment';
import { CommunityPostEntity } from '../../entity/post';
import { CommunityMessageEntity } from '../../entity/message';
import { SensitiveService } from '../../../sensitive/service/sensitive';

/**
 * C端评论：列表匿名，发布需登录（敏感词过滤 + 计数 + 站内互动消息）
 */
@CoolUrlTag()
@CoolController()
export class AppCommunityCommentController extends BaseController {
  @InjectEntityModel(CommunityCommentEntity)
  commentEntity: Repository<CommunityCommentEntity>;

  @InjectEntityModel(CommunityPostEntity)
  postEntity: Repository<CommunityPostEntity>;

  @InjectEntityModel(CommunityMessageEntity)
  messageEntity: Repository<CommunityMessageEntity>;

  @Inject()
  sensitiveService: SensitiveService;

  @Inject()
  ctx;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '评论列表（二级）' })
  async pageList(@Query('postId') postId: number) {
    const rows = await this.commentEntity.find({
      where: { postId: Number(postId), status: 1 },
      order: { id: 'ASC' },
    });
    const roots = rows.filter((r) => !r.parentId);
    const list = roots.map((r) => ({
      ...r,
      replies: rows.filter((c) => c.parentId === r.id),
    }));
    return this.ok(list);
  }

  @Post('/add', { summary: '发布评论' })
  async addItem(@Body() body) {
    const userId = this.ctx.user.id;
    const postId = Number(body?.postId);
    const content = String(body?.content || '');
    const post = await this.postEntity.findOneBy({ id: postId, status: 'normal' });
    if (!post) return this.fail('游记不存在');
    if (!content.trim()) return this.fail('请填写评论内容');
    if (content.length > 500) return this.fail('评论不能超过 500 字');
    const check = await this.sensitiveService.check(content);
    if (check.hit) return this.fail('评论包含敏感词，请修改后重试');
    const parentId = body?.parentId ? Number(body.parentId) : null;
    if (parentId) {
      const parent = await this.commentEntity.findOneBy({ id: parentId });
      if (!parent || parent.postId !== postId) return this.fail('父评论不存在');
    }
    const inserted = await this.commentEntity.insert({
      postId,
      userId,
      content,
      parentId,
      status: 1,
    });
    await this.postEntity.increment({ id: postId }, 'commentCount', 1);
    // 互动消息（不通知本人）
    if (post.userId !== userId) {
      await this.messageEntity.insert({
        userId: post.userId,
        type: 'comment',
        refType: 'post',
        refId: postId,
        content: `你的游记《${post.title}》收到了新评论`,
        isRead: 0,
      });
    }
    return this.ok({ id: inserted.identifiers[0].id });
  }

  /** 点赞评论（供 like.ts 之外的内部调用不适用——评论点赞在 like.ts 统一处理） */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/count', { summary: '游记评论数' })
  async count(@Query('postId') postId: number) {
    const n = await this.commentEntity.count({
      where: { postId: Equal(Number(postId)), status: 1 },
    });
    return this.ok(n);
  }
}
