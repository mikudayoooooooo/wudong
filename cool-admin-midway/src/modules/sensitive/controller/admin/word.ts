import { CoolController, BaseController } from '@cool-midway/core';
import { SensitiveWordEntity } from '../../entity/word';

/**
 * 敏感词管理
 */
@CoolController({
  prefix: '/admin/sensitive/word',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: SensitiveWordEntity,
  pageQueryOp: {
    fieldEq: ['a.status'],
    keyWordLikeFields: ['a.word'],
  },
})
export class AdminSensitiveWordController extends BaseController {}
