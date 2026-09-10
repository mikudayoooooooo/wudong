import { CoolController, BaseController } from '@cool-midway/core';
import { OrderEntity } from '../../entity/order';
import { MerchantAdminScopeService } from '../../../merchant/service/admin-scope';

/**
 * 统一订单管理
 * 数据权限：绑定了 merchant.adminUserId 的管理端账号只能看到本商家订单；平台管理员不受限
 */
@CoolController({
  prefix: '/admin/order',
  api: ['page', 'list', 'info', 'update', 'delete'],
  entity: OrderEntity,
  pageQueryOp: async (ctx, app) => ({
    fieldEq: ['a.status', 'a.orderType', 'a.module'],
    keyWordLikeFields: ['a.orderNo'],
    where: await app
      .getApplicationContext()
      .getAsync(MerchantAdminScopeService)
      .then(s => s.whereFor(ctx.admin?.userId)),
  }),
  listQueryOp: async (ctx, app) => ({
    where: await app
      .getApplicationContext()
      .getAsync(MerchantAdminScopeService)
      .then(s => s.whereFor(ctx.admin?.userId)),
  }),
})
export class AdminOrderController extends BaseController {}
