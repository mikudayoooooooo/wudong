import { CoolController, BaseController } from '@cool-midway/core';
import { TravelTrafficGuideEntity } from '../../entity/traffic-guide';

/**
 * 交通攻略管理
 */
@CoolController({
  prefix: '/admin/travel/guide',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: TravelTrafficGuideEntity,
  pageQueryOp: {
    fieldEq: ['a.status'],
    keyWordLikeFields: ['a.title', 'a.departure'],
  },
})
export class AdminTravelGuideController extends BaseController {}
