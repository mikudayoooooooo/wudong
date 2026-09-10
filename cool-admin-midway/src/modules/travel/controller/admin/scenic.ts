import { CoolController, BaseController } from '@cool-midway/core';
import { TravelScenicSpotEntity } from '../../entity/scenic-spot';

/**
 * 景区管理
 */
@CoolController({
  prefix: '/admin/travel/scenic',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: TravelScenicSpotEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.type'],
    keyWordLikeFields: ['a.name', 'a.address'],
  },
})
export class AdminTravelScenicController extends BaseController {}
