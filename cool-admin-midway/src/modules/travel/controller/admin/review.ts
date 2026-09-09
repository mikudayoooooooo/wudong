import { CoolController, BaseController } from '@cool-midway/core';
import { TravelReviewEntity } from '../../entity/review';

/**
 * 评价管理（商家回复走 update）
 */
@CoolController({
  prefix: '/admin/travel/review',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: TravelReviewEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.targetType', 'a.targetId'],
    keyWordLikeFields: ['a.content'],
  },
})
export class AdminTravelReviewController extends BaseController {}
