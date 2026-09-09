import { CoolController, BaseController } from '@cool-midway/core';
import { TravelRouteItineraryEntity } from '../../entity/route-itinerary';

/**
 * 路线行程管理
 */
@CoolController({
  prefix: '/admin/travel/itinerary',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: TravelRouteItineraryEntity,
  pageQueryOp: {
    fieldEq: ['a.routeId', 'a.dayNo'],
  },
})
export class AdminTravelItineraryController extends BaseController {}
