import {
  BaseController,
  CoolController,
  CoolTag,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Get, Inject, Query } from '@midwayjs/core';
import { Like, Repository } from 'typeorm';
import { TravelRoutePackageEntity } from '../../entity/route-package';
import { TravelRouteItineraryEntity } from '../../entity/route-itinerary';
import { TravelScenicSpotEntity } from '../../entity/scenic-spot';
import { TravelInventoryEntity } from '../../entity/inventory';
import { TravelReviewEntity } from '../../entity/review';
import { TravelFootprintService } from '../../service/footprint';
import { MemberUserEntity } from '../../../member/entity/user';

/**
 * C端路线（匿名可浏览；detail 附行程点亮/库存/评价）
 */
@CoolUrlTag()
@CoolController()
export class AppTravelRouteController extends BaseController {
  @InjectEntityModel(TravelRoutePackageEntity)
  routePackageEntity: Repository<TravelRoutePackageEntity>;

  @InjectEntityModel(TravelRouteItineraryEntity)
  itineraryEntity: Repository<TravelRouteItineraryEntity>;

  @InjectEntityModel(TravelScenicSpotEntity)
  scenicSpotEntity: Repository<TravelScenicSpotEntity>;

  @InjectEntityModel(TravelInventoryEntity)
  inventoryEntity: Repository<TravelInventoryEntity>;

  @InjectEntityModel(TravelReviewEntity)
  reviewEntity: Repository<TravelReviewEntity>;

  @InjectEntityModel(MemberUserEntity)
  memberUserEntity: Repository<MemberUserEntity>;

  @Inject()
  footprintService: TravelFootprintService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '路线列表' })
  async pageList(
    @Query('theme') theme: string,
    @Query('days') days: number,
    @Query('keyword') keyword: string
  ) {
    const where: any = { status: 1 };
    if (theme) where.theme = theme;
    if (days) where.days = Number(days);
    if (keyword) where.title = Like(`%${keyword}%`);
    const list = await this.routePackageEntity.find({
      where,
      order: { sales: 'DESC', id: 'DESC' },
    });
    // 附行程站点点亮视图（列表页"平均点亮 x/y 站"）
    const stopsMap = await this.footprintService.routesStopsView(
      list.map((r) => r.id)
    );
    return this.ok(
      list.map((r) => ({ ...r, stops: stopsMap.get(r.id) || [] }))
    );
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/detail', { summary: '路线详情' })
  async detail(@Query('id') id: number) {
    const route = await this.routePackageEntity.findOneBy({
      id: Number(id),
      status: 1,
    });
    if (!route) return this.ok(null);
    // 行程站 + 点亮人数（真实核销统计）
    const stops = await this.footprintService.routeStopsView(route.id);
    const spotIds = stops.map((s) => s.spotId);
    const spots = spotIds.length
      ? await this.scenicSpotEntity
          .createQueryBuilder()
          .where('id IN (:...ids)', { ids: spotIds })
          .getMany()
      : [];
    const spotMap = new Map(spots.map((s) => [s.id, s]));
    const stopsView = stops.map((s) => ({
      ...s,
      name: spotMap.get(s.spotId)?.name,
      icon: '📍',
      type: spotMap.get(s.spotId)?.type,
    }));
    const inventories = await this.inventoryEntity.find({
      where: { itemType: 'route', itemId: route.id },
      order: { useDate: 'ASC' },
    });
    const reviews = await this.reviewEntity.find({
      where: { targetType: 'route', targetId: route.id, status: 1 },
      order: { id: 'DESC' },
    });
    // 评价附用户摘要
    const ruids = [...new Set(reviews.map((r) => r.userId))];
    const users = ruids.length
      ? await this.memberUserEntity
          .createQueryBuilder()
          .where('id IN (:...ids)', { ids: ruids })
          .getMany()
      : [];
    const umap = new Map(users.map((u) => [u.id, u]));
    const reviewsView = reviews.map((r) => ({
      ...r,
      nickname: umap.get(r.userId)?.nickname || '游客',
      avatar: umap.get(r.userId)?.avatar || '👤',
    }));
    return this.ok({ ...route, stops: stopsView, inventories, reviews: reviewsView });
  }
}
