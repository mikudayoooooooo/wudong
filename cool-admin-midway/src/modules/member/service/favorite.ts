import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { MemberFavoriteEntity } from '../entity/favorite';

/** 收藏目标类型（行/社区模块共用，规格 §5.5） */
export const FAVORITE_TYPES = ['scenic', 'route', 'guide', 'post'];

/**
 * 收藏
 */
@Provide()
export class MemberFavoriteService extends BaseService {
  @InjectEntityModel(MemberFavoriteEntity)
  memberFavoriteEntity: Repository<MemberFavoriteEntity>;

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
    await this.memberFavoriteEntity.insert({ userId, targetType, targetId });
    return { favorited: true };
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
    return { list, total };
  }
}
