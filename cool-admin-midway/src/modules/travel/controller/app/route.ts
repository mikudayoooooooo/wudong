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
    return this.ok(list);
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
    return this.ok({ ...route, stops: stopsView, inventories, reviews });
  }
}
