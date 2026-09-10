import { CoolController, BaseController } from '@cool-midway/core';
import { CommunityTopicEntity } from '../../entity/topic';

/**
 * 话题管理
 */
@CoolController({
  prefix: '/admin/community/topic',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: CommunityTopicEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.isHot', 'a.isRecommend'],
    keyWordLikeFields: ['a.name', 'a.intro'],
  },
})
export class AdminCommunityTopicController extends BaseController {}
