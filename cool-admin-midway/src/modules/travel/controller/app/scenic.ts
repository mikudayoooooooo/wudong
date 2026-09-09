import {
  BaseController,
  CoolController,
  CoolTag,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Get, Query } from '@midwayjs/core';
import { Repository } from 'typeorm';
import { TravelScenicSpotEntity } from '../../entity/scenic-spot';
import { TravelTicketTypeEntity } from '../../entity/ticket-type';
import { TravelRouteItineraryEntity } from '../../entity/route-itinerary';
import { TravelRoutePackageEntity } from '../../entity/route-package';

/**
 * C端景区（匿名可浏览；detail 附票种与相关路线）
 */
@CoolUrlTag()
@CoolController()
export class AppTravelScenicController extends BaseController {
  @InjectEntityModel(TravelScenicSpotEntity)
  scenicSpotEntity: Repository<TravelScenicSpotEntity>;

  @InjectEntityModel(TravelTicketTypeEntity)
  ticketTypeEntity: Repository<TravelTicketTypeEntity>;

  @InjectEntityModel(TravelRouteItineraryEntity)
  itineraryEntity: Repository<TravelRouteItineraryEntity>;

  @InjectEntityModel(TravelRoutePackageEntity)
  routePackageEntity: Repository<TravelRoutePackageEntity>;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '景区列表' })
  async pageList(@Query('type') type: string) {
    const where: any = { status: 1 };
    if (type) where.type = type;
    const list = await this.scenicSpotEntity.find({
      where,
      order: { id: 'ASC' },
    });
    return this.ok(list);
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/detail', { summary: '景区详情' })
  async detail(@Query('id') id: number) {
    const spot = await this.scenicSpotEntity.findOneBy({
      id: Number(id),
      status: 1,
    });
    if (!spot) return this.ok(null);
    const tickets = await this.ticketTypeEntity.find({
      where: { scenicSpotId: spot.id, status: 1 },
    });
    // 行程中包含该景区的路线
    const itins = await this.itineraryEntity.find({
      where: { scenicSpotId: spot.id },
    });
    const routeIds = [...new Set(itins.map((i) => i.routeId))];
    const routes = routeIds.length
      ? await this.routePackageEntity.find({
          where: routeIds.map((routeId) => ({ id: routeId, status: 1 })) as any,
        })
      : [];
    return this.ok({ ...spot, tickets, relatedRoutes: routes });
  }
}
