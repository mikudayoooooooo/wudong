import { CoolController, BaseController } from '@cool-midway/core';
import { TravelRoutePackageEntity } from '../../entity/route-package';

/**
 * 路线套餐管理
 */
@CoolController({
  prefix: '/admin/travel/route',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: TravelRoutePackageEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.theme', 'a.days'],
    keyWordLikeFields: ['a.title'],
  },
})
export class AdminTravelRouteController extends BaseController {}
