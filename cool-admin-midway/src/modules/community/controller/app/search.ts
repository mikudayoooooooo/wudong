import {
  BaseController,
  CoolController,
  CoolTag,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { Get, Query } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CommunityPostEntity } from '../../entity/post';
import { CommunityTopicEntity } from '../../entity/topic';
import { MemberUserEntity } from '../../../member/entity/user';

/**
 * C端搜索（匿名）：游记/话题/用户 DB LIKE 检索
 */
@CoolUrlTag()
@CoolController()
export class AppCommunitySearchController extends BaseController {
  @InjectEntityModel(CommunityPostEntity)
  postEntity: Repository<CommunityPostEntity>;

  @InjectEntityModel(CommunityTopicEntity)
  topicEntity: Repository<CommunityTopicEntity>;

  @InjectEntityModel(MemberUserEntity)
  memberUserEntity: Repository<MemberUserEntity>;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '综合搜索' })
  async pageList(@Query('keyword') keyword: string) {
    const kw = String(keyword || '').trim();
    if (!kw) return this.ok({ posts: [], topics: [], users: [] });
    const posts = await this.postEntity.find({
      where: [
        { title: Like(`%${kw}%`), status: 'normal' },
        { content: Like(`%${kw}%`), status: 'normal' },
      ],
      order: { id: 'DESC' },
      take: 20,
    });
    const topics = await this.topicEntity.find({
      where: [
        { name: Like(`%${kw}%`), status: 1 },
        { intro: Like(`%${kw}%`), status: 1 },
      ],
      take: 10,
    });
    const users = await this.memberUserEntity.find({
      where: [{ nickname: Like(`%${kw}%`) }],
      take: 10,
    });
    return this.ok({
      posts: posts.map((p) => ({ id: p.id, title: p.title, userId: p.userId })),
      topics: topics.map((t) => ({ id: t.id, name: t.name, intro: t.intro })),
      users: users.map((u) => ({
        id: u.id,
        nickname: u.nickname,
        avatar: u.avatar,
        bio: u.bio,
      })),
    });
  }
}
