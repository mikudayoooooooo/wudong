import { CoolController, BaseController } from '@cool-midway/core';
import { PaymentRecordEntity } from '../../entity/record';
import { MerchantAdminScopeService } from '../../../merchant/service/admin-scope';

/**
 * 支付流水管理（只读）
 * 数据权限：绑定了 merchant.adminUserId 的管理端账号只能看到本商家流水；平台管理员不受限
 */
@CoolController({
  prefix: '/admin/pay/record',
  api: ['page', 'list', 'info'],
  entity: PaymentRecordEntity,
  pageQueryOp: async (ctx, app) => ({
    fieldEq: ['a.payStatus', 'a.payChannel'],
    keyWordLikeFields: ['a.paymentNo'],
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
export class AdminPayRecordController extends BaseController {}
