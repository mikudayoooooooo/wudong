import { CoolController, BaseController } from '@cool-midway/core';
import { MessageTemplateEntity } from '../../entity/template';

/**
 * 消息模板管理
 */
@CoolController({
  prefix: '/admin/messageTemplate',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: MessageTemplateEntity,
  pageQueryOp: {
    fieldEq: ['a.type', 'a.status'],
    keyWordLikeFields: ['a.code', 'a.name'],
  },
})
export class AdminMessageTemplateController extends BaseController {}
