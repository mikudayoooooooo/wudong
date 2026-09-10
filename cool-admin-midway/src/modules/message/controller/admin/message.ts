import { CoolController, BaseController } from '@cool-midway/core';
import { SystemMessageEntity } from '../../entity/system-message';

/**
 * 消息管理（平台群发：add 时 userId 留空即全员）
 */
@CoolController({
  prefix: '/admin/message',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: SystemMessageEntity,
  pageQueryOp: {
    fieldEq: ['a.type', 'a.isRead'],
    keyWordLikeFields: ['a.title'],
  },
})
export class AdminMessageController extends BaseController {}
