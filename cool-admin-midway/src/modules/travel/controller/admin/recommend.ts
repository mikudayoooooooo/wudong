import { CoolController, BaseController } from '@cool-midway/core';
import { TravelRecommendSlotEntity } from '../../entity/recommend-slot';

/**
 * 推荐位配置管理
 */
@CoolController({
  prefix: '/admin/travel/recommend',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: TravelRecommendSlotEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.position', 'a.rotationGroup'],
    keyWordLikeFields: ['a.title'],
  },
})
export class AdminTravelRecommendController extends BaseController {}
