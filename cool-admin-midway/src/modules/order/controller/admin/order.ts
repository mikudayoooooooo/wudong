import { CoolController, BaseController } from '@cool-midway/core';
import { OrderEntity } from '../../entity/order';

/**
 * 统一订单管理
 */
@CoolController({
  prefix: '/admin/order',
  api: ['page', 'list', 'info', 'update', 'delete'],
  entity: OrderEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.orderType', 'a.module'],
    keyWordLikeFields: ['a.orderNo'],
  },
})
export class AdminOrderController extends BaseController {}
