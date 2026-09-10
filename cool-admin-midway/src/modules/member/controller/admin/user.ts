import { CoolController, BaseController } from '@cool-midway/core';
import { MemberUserEntity } from '../../entity/user';

/**
 * C端用户管理
 */
@CoolController({
  api: ['page', 'list', 'info', 'update', 'delete'],
  entity: MemberUserEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.gender'],
    keyWordLikeFields: ['a.nickname', 'a.phone'],
  },
})
export class AdminMemberUserController extends BaseController {}
