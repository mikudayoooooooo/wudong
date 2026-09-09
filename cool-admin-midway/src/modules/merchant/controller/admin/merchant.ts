import { CoolController, BaseController } from '@cool-midway/core';
import { MerchantEntity } from '../../entity/merchant';

/**
 * 商家管理
 */
@CoolController({
  prefix: '/admin/merchant',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: MerchantEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.module'],
    keyWordLikeFields: ['a.shopName', 'a.contactPhone', 'a.username'],
  },
})
export class AdminMerchantController extends BaseController {}
