import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import { DataSource, Equal, In, Repository } from 'typeorm';
import { MemberFavoriteEntity } from '../entity/favorite';
import { ProductEntity } from '../../product/entity/product';
import { RestaurantEntity } from '../../food/entity/restaurant';
import { HotelEntity } from '../../accommodation/entity/hotel';
import { TravelScenicSpotEntity } from '../../travel/entity/scenic-spot';
import { TravelRoutePackageEntity } from '../../travel/entity/route-package';
import { TravelTrafficGuideEntity } from '../../travel/entity/traffic-guide';
import { CommunityPostEntity } from '../../community/entity/post';

/** 收藏目标类型（全平台共用，需求文档与行/社区 spec 的并集） */
export const FAVORITE_TYPES = [
  'product',
  'restaurant',
  'hotel',
  'scenic',
  'route',
  'guide',
  'post',
];

/** 类型 → 实体与名称字段（列表回填 targetName 用；仅实体级引用，无服务级依赖） */
const TARGET_META: Record<string, { entity: any; field: string }> = {
  product: { entity: ProductEntity, field: 'name' },
  restaurant: { entity: RestaurantEntity, field: 'name' },
  hotel: { entity: HotelEntity, field: 'name' },
  scenic: { entity: TravelScenicSpotEntity, field: 'name' },
  route: { entity: TravelRoutePackageEntity, field: 'title' },
  guide: { entity: TravelTrafficGuideEntity, field: 'title' },
  post: { entity: CommunityPostEntity, field: 'title' },
};

/**
 * 收藏
 */
@Provide()
export class MemberFavoriteService extends BaseService {
  @InjectEntityModel(MemberFavoriteEntity)
  memberFavoriteEntity: Repository<MemberFavoriteEntity>;

  @InjectDataSource()
  dataSource: DataSource;

  /**
   * 收藏/取消收藏（幂等切换）
   */
  async toggle(userId: number, targetType: string, targetId: number) {
    if (!FAVORITE_TYPES.includes(targetType)) {
      throw new CoolCommException('收藏类型不正确');
    }
    const exist = await this.memberFavoriteEntity.findOneBy({
      userId: Equal(userId),
      targetType,
      targetId,
    });
    if (exist) {
      await this.memberFavoriteEntity.delete({ id: exist.id });
      return { favorited: false };
    }
    try {
      // 并发语义：双击/并发下可能同时通过存在性检查都走 insert，唯一索引
      // uk_user_target 挡住重复行；败方捕获重复键后按最终落库状态（已收藏）幂等返回
      await this.memberFavoriteEntity.insert({ userId, targetType, targetId });
      return { favorited: true };
    } catch (err: any) {
      if (err?.code === 'ER_DUP_ENTRY' || err?.errno === 1062) {
        return { favorited: true };
      }
      throw err;
    }
  }

  /**
   * 是否已收藏
   */
  async check(userId: number, targetType: string, targetId: number) {
    const exist = await this.memberFavoriteEntity.findOneBy({
      userId: Equal(userId),
      targetType,
      targetId,
    });
    return !!exist;
  }

  /**
   * 我的收藏（分页，可按类型筛选）
   *
   * 注：方法名 pageList——BaseService 内置分页方法名为 page(query, option)，
   * 自定义 page 会产生 TS2416 覆写冲突，故改名规避（跨模块以代码为准）。
   */
  async pageList(userId: number, targetType?: string, page = 1, size = 10) {
    const qb = this.memberFavoriteEntity
      .createQueryBuilder('a')
      .where('a.userId = :userId', { userId })
      .orderBy('a.id', 'DESC');
    if (targetType) {
      qb.andWhere('a.targetType = :targetType', { targetType });
    }
    const pageNo = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(size) || 10, 1);
    qb.skip((pageNo - 1) * pageSize).take(pageSize);
    const [list, total] = await qb.getManyAndCount();

    // 按类型批量回填目标名称（已删除的目标置「已失效」）
    const idsByType = new Map<string, number[]>();
    for (const item of list) {
      const ids = idsByType.get(item.targetType) || [];
      ids.push(item.targetId);
      idsByType.set(item.targetType, ids);
    }
    const names = new Map<string, string>();
    for (const [type, ids] of idsByType) {
      const meta = TARGET_META[type];
      if (!meta) continue;
      const rows: any[] = await this.dataSource
        .getRepository(meta.entity)
        .find({ where: { id: In(ids) } });
      for (const row of rows) {
        names.set(`${type}:${row.id}`, row[meta.field]);
      }
    }
    const withNames = list.map((item) => ({
      ...item,
      targetName: names.get(`${item.targetType}:${item.targetId}`) ?? '已失效',
    }));

    return { list: withNames, total };
  }
}
