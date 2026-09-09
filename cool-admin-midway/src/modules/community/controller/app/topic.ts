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
import { CommunityTopicEntity } from '../../entity/topic';
import { CommunityTopicFollowEntity } from '../../entity/topic-follow';
import { CommunityPostEntity } from '../../entity/post';
import { CommunityPostService } from '../../service/post';

/**
 * C端话题：列表/详情匿名，关注需登录
 */
@CoolUrlTag()
@CoolController()
export class AppCommunityTopicController extends BaseController {
  @InjectEntityModel(CommunityTopicEntity)
  topicEntity: Repository<CommunityTopicEntity>;

  @InjectEntityModel(CommunityTopicFollowEntity)
  topicFollowEntity: Repository<CommunityTopicFollowEntity>;

  @InjectEntityModel(CommunityPostEntity)
  postEntity: Repository<CommunityPostEntity>;

  @Inject()
  postService: CommunityPostService;

  @Inject()
  ctx;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '话题列表' })
  async pageList() {
    const list = await this.topicEntity.find({
      where: { status: 1 },
      order: { isHot: 'DESC', sort: 'ASC', id: 'DESC' },
    });
    return this.ok(list);
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/detail', { summary: '话题详情（附话题下游记）' })
  async detail(@Query('id') id: number) {
    const topic = await this.topicEntity.findOneBy({
      id: Number(id),
      status: 1,
    });
    if (!topic) return this.ok(null);
    const posts = await this.postEntity.find({
      where: { status: 'normal' },
      order: { id: 'DESC' },
    });
    const hit = posts.filter((p) =>
      Array.isArray(p.topicIds)
        ? p.topicIds.map(Number).includes(topic.id)
        : false
    );
    const { list } = await this.postService.feed(this.ctx.user?.id, 'latest', 1, 50);
    const feedMap = new Map((list as any[]).map((p) => [p.id, p]));
    return this.ok({
      ...topic,
      posts: hit.map((p) => feedMap.get(p.id) || p),
    });
  }

  @Post('/follow', { summary: '关注/取关话题' })
  async follow(@Body('topicId') topicId: number) {
    const userId = this.ctx.user.id;
    const tid = Number(topicId);
    const topic = await this.topicEntity.findOneBy({ id: tid });
    if (!topic) return this.fail('话题不存在');
    const exist = await this.topicFollowEntity.findOneBy({
      topicId: Equal(tid),
      userId: Equal(userId),
    });
    if (exist) {
      await this.topicFollowEntity.delete({ id: exist.id });
      await this.topicEntity.decrement({ id: tid }, 'followerCount', 1);
      return this.ok({ followed: false });
    }
    await this.topicFollowEntity.insert({ topicId: tid, userId });
    await this.topicEntity.increment({ id: tid }, 'followerCount', 1);
    return this.ok({ followed: true });
  }
}
