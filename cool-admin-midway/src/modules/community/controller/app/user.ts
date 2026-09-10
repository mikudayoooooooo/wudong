import {
  BaseController,
  CoolController,
  CoolTag,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { Get, Inject, Query } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { MemberUserEntity } from '../../../member/entity/user';
import { CommunityPostEntity } from '../../entity/post';
import { TravelFootprintService } from '../../../travel/service/footprint';

/**
 * C端社区个人主页（匿名可浏览）：聚合足迹档案 + 徽章 + TA 的游记
 */
@CoolUrlTag()
@CoolController()
export class AppCommunityUserController extends BaseController {
  @InjectEntityModel(MemberUserEntity)
  memberUserEntity: Repository<MemberUserEntity>;

  @InjectEntityModel(CommunityPostEntity)
  postEntity: Repository<CommunityPostEntity>;

  @Inject()
  travelFootprintService: TravelFootprintService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/profile', { summary: '用户主页数据' })
  async profile(@Query('id') id: number) {
    const uid = Number(id);
    const user = await this.memberUserEntity.findOneBy({ id: uid });
    if (!user) return this.ok(null);
    const posts = await this.postEntity.find({
      where: { userId: uid, status: 'normal' },
      order: { id: 'DESC' },
    });
    const litIds = await this.travelFootprintService.userLitSpotIds(uid);
    return this.ok({
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      bio: user.bio,
      postCount: posts.length,
      likeCount: posts.reduce((s, p) => s + p.likeCount, 0),
      badge: litIds.size >= 4 ? '足迹达人' : '初来乍到',
      litCount: litIds.size,
      litSpotIds: [...litIds],
      posts,
    });
  }
}
