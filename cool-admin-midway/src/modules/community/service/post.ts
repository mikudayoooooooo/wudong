import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { CommunityPostEntity } from '../entity/post';
import { CommunityPostFootprintEntity } from '../entity/post-footprint';
import { CommunityTopicEntity } from '../entity/topic';
import { CommunityFollowEntity } from '../entity/follow';
import { MemberUserEntity } from '../../member/entity/user';
import { TravelFootprintService } from '../../travel/service/footprint';
import { SensitiveService } from '../../sensitive/service/sensitive';

/** 每日发帖上限（需求文档 10.6） */
const DAILY_POST_LIMIT = 10;

/**
 * 游记帖子：feed / 详情足迹组装 / 发布机审 / 模式B关联
 */
@Provide()
export class CommunityPostService extends BaseService {
  @InjectEntityModel(CommunityPostEntity)
  postEntity: Repository<CommunityPostEntity>;

  @InjectEntityModel(CommunityPostFootprintEntity)
  postFootprintEntity: Repository<CommunityPostFootprintEntity>;

  @InjectEntityModel(CommunityTopicEntity)
  topicEntity: Repository<CommunityTopicEntity>;

  @InjectEntityModel(CommunityFollowEntity)
  followEntity: Repository<CommunityFollowEntity>;

  @InjectEntityModel(MemberUserEntity)
  memberUserEntity: Repository<MemberUserEntity>;

  @Inject()
  travelFootprintService: TravelFootprintService;

  @Inject()
  sensitiveService: SensitiveService;

  /**
   * 信息流：recommend 热度排序（like*2 + view/10）/ latest 最新 / follow 关注的人
   */
  async feed(userId: number | undefined, tab: string, page: number, size: number) {
    const qb = this.postEntity
      .createQueryBuilder('p')
      .where('p.status = :status', { status: 'normal' });

    if (tab === 'follow') {
      if (!userId) throw new CoolCommException('请先登录');
      const follows = await this.followEntity.find({
        where: { userId: Equal(userId) },
      });
      if (!follows.length) return { list: [], total: 0 };
      qb.andWhere('p.userId IN (:...uids)', {
        uids: follows.map((f) => f.followingId),
      });
    }

    if (tab === 'recommend') {
      qb.orderBy('p.likeCount * 2 + p.viewCount / 10', 'DESC').addOrderBy('p.id', 'DESC');
    } else {
      qb.orderBy('p.id', 'DESC');
    }

    const total = await qb.getCount();
    const rows = await qb
      .skip((Number(page) - 1) * Number(size))
      .take(Number(size))
      .getMany();
    return { list: await this.withAuthors(rows), total };
  }

  /** 补作者简要信息 */
  private async withAuthors(posts: CommunityPostEntity[]) {
    const uids = [...new Set(posts.map((p) => p.userId))];
    const users = uids.length
      ? await this.memberUserEntity
          .createQueryBuilder()
          .where('id IN (:...ids)', { ids: uids })
          .getMany()
      : [];
    const umap = new Map(users.map((u) => [u.id, u]));
    return posts.map((p) => {
      const u = umap.get(p.userId);
      return {
        ...p,
        author: u
          ? { id: u.id, nickname: u.nickname, avatar: u.avatar, bio: u.bio }
          : { id: p.userId, nickname: '已注销', avatar: '👤', bio: '' },
      };
    });
  }

  /**
   * 详情：浏览计数 + 作者 + 话题 + 足迹（模式A聚合 / 模式B路线骨架）
   */
  async detail(id: number, viewerId?: number) {
    const post = await this.postEntity.findOneBy({ id: Number(id) });
    if (!post) throw new CoolCommException('游记不存在');
    if (post.status !== 'normal' && post.userId !== viewerId) {
      throw new CoolCommException('游记不存在');
    }
    await this.postEntity.update({ id: post.id }, { viewCount: post.viewCount + 1 });
    const [withAuthor] = await this.withAuthors([post]);
    const topicIds: number[] = Array.isArray(post.topicIds) ? post.topicIds : [];
    const topicRows = topicIds.length
      ? await this.topicEntity
          .createQueryBuilder()
          .where('id IN (:...ids)', { ids: topicIds })
          .getMany()
      : [];
    const footprint = await this.footprintView(post);
    return { ...withAuthor, topics: topicRows, footprint };
  }

  /**
   * 足迹视图：模式B（有路线骨架与 route 快照）返回全行程 lit/locked；否则模式A近30天核销聚合
   */
  private async footprintView(post: CommunityPostEntity) {
    const snaps = await this.postFootprintEntity.find({
      where: { postId: post.id },
    });
    if (post.linkedRouteId && snaps.some((s) => s.mode === 'route')) {
      const stops = await this.travelFootprintService.routeStopsView(
        post.linkedRouteId
      );
      return {
        mode: 'route',
        routeId: post.linkedRouteId,
        stops: stops.map((s) => {
          const snap = snaps.find(
            (x) => x.mode === 'route' && x.scenicSpotId === s.spotId
          );
          return {
            ...s,
            lit: !!snap && snap.status === 'normal',
            locked: !snap || snap.status !== 'normal',
            memo: snap?.memo,
            photo: snap?.photo,
            dayNo: snap?.dayNo ?? s.dayNo,
          };
        }),
      };
    }
    const litIds = await this.travelFootprintService.userLitSpotIds(post.userId, {
      withinDays: 30,
    });
    return {
      mode: 'auto',
      routeId: null,
      stops: [...litIds].map((id) => ({ spotId: id, lit: true, locked: false })),
    };
  }

  /**
   * 发布：敏感词机审（命中→pending 人工复审）+ 日限 10 篇 + 模式A足迹自动生成
   */
  async addPost(userId: number, param) {
    const title = String(param?.title || '').trim();
    const content = String(param?.content || '');
    if (!title) throw new CoolCommException('请填写标题');
    if (title.length > 100) throw new CoolCommException('标题不能超过 100 字');
    if (content.length > 5000) throw new CoolCommException('正文不能超过 5000 字');
    if (!Array.isArray(param?.images) || param.images.length > 9) {
      throw new CoolCommException('图片最多 9 张');
    }

    // createTime 为 'YYYY-MM-DD HH:mm:ss' 字符串，可直接比较
    const today = new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 10);
    const cntRows = await this.postEntity.manager.query(
      `SELECT COUNT(*) AS n FROM community_post WHERE userId = ? AND createTime >= ?`,
      [userId, `${today} 00:00:00`]
    );
    if (Number(cntRows[0]?.n || 0) >= DAILY_POST_LIMIT) {
      throw new CoolCommException('今日发布已达上限（10 篇）');
    }

    const check = await this.sensitiveService.check(`${title}\n${content}`);
    const status = check.hit ? 'pending' : 'normal';
    const inserted = await this.postEntity.insert({
      userId,
      title,
      content,
      images: param.images.slice(0, 9),
      videoUrl: param?.videoUrl || null,
      videoDuration: param?.videoDuration || null,
      linkedRouteId: null,
      topicIds: Array.isArray(param?.topicIds) ? param.topicIds.map(Number) : [],
      status,
      auditReason: check.hit ? `命中敏感词：${check.words.join('、')}` : null,
    } as any);
    const postId = inserted.identifiers[0].id as number;

    // 话题帖子数维护
    const topicIds: number[] = Array.isArray(param?.topicIds)
      ? param.topicIds.map(Number).filter(Boolean)
      : [];
    for (const tid of topicIds) {
      await this.topicEntity.increment({ id: tid }, 'postCount', 1);
    }

    // 模式A足迹：近 30 天核销地点自动聚合（来自 travel 已核销电子票，作者无法伪造）
    const litIds = await this.travelFootprintService.userLitSpotIds(userId, {
      withinDays: 30,
    });
    if (litIds.size) {
      await this.postFootprintEntity.insert(
        [...litIds].map((spotId) => ({
          postId,
          userId,
          scenicSpotId: spotId,
          mode: 'auto',
          status: 'normal',
          sort: 0,
        }))
      );
    }
    return { id: postId, status };
  }

  /**
   * 模式B：关联路线（作者本人；覆写 route 快照）
   */
  async attachRoute(userId: number, param) {
    const postId = Number(param?.postId);
    const routeId = Number(param?.routeId);
    const post = await this.postEntity.findOneBy({ id: postId });
    if (!post || post.userId !== userId) {
      throw new CoolCommException('游记不存在');
    }
    const stops = Array.isArray(param?.stops) ? param.stops : [];
    // 覆写：删除原 route 快照后写入
    await this.postFootprintEntity.delete({ postId, mode: 'route' });
    if (stops.length) {
      await this.postFootprintEntity.insert(
        stops.map((s, i) => ({
          postId,
          userId,
          scenicSpotId: Number(s.spotId),
          routeId,
          mode: 'route',
          dayNo: s.dayNo ?? null,
          memo: s.memo || null,
          photo: s.photo || null,
          status: 'normal',
          sort: i,
        }))
      );
    }
    await this.postEntity.update({ id: postId }, { linkedRouteId: routeId || null });
    return { id: postId, linkedRouteId: routeId };
  }

  /** 删除本人游记 */
  async removeOwn(userId: number, id: number) {
    const post = await this.postEntity.findOneBy({ id: Number(id) });
    if (!post || post.userId !== userId) {
      throw new CoolCommException('游记不存在');
    }
    await this.postEntity.delete({ id: post.id });
    await this.postFootprintEntity.delete({ postId: post.id });
    return true;
  }
}
