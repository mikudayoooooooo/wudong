import { CoolController, BaseController } from '@cool-midway/core';
import { CommunityCommentEntity } from '../../entity/comment';

/**
 * 评论管理
 */
@CoolController({
  prefix: '/admin/community/comment',
  api: ['page', 'list', 'info', 'update', 'delete'],
  entity: CommunityCommentEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.postId', 'a.userId'],
    keyWordLikeFields: ['a.content'],
  },
})
export class AdminCommunityCommentController extends BaseController {}
