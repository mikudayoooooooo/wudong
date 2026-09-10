import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { PaymentRecordEntity } from '../../entity/record';
import { MerchantAdminScopeService } from '../../../merchant/service/admin-scope';
import { PayService } from '../../service/pay';

/**
 * 支付流水管理（只读 + 退款审批）
 * 数据权限：绑定了 merchant.adminUserId 的管理端账号只能看到本商家流水；平台管理员不受限
 */
@CoolController({
  prefix: '/admin/pay/record',
  api: ['page', 'list', 'info'],
  entity: PaymentRecordEntity,
  // 注意：EPS 构建期会零参调用本函数，ctx 缺席时只返回静态配置（启动不崩）；请求期才注入商家 where
  pageQueryOp: async (ctx?: any, app?: any) => {
    const base = {
      fieldEq: ['a.payStatus', 'a.payChannel'],
      keyWordLikeFields: ['a.paymentNo'],
    };
    if (!ctx) {
      return base;
    }
    const scope = await (ctx.requestContext ?? app.getApplicationContext())
      .getAsync(MerchantAdminScopeService)
      .then(s => s.whereFor(ctx.admin?.userId));
    return { ...base, where: scope };
  },
  listQueryOp: async (ctx?: any, app?: any) => {
    if (!ctx) {
      return {};
    }
    return {
      where: await (ctx.requestContext ?? app.getApplicationContext())
        .getAsync(MerchantAdminScopeService)
        .then(s => s.whereFor(ctx.admin?.userId)),
    };
  },
})
export class AdminPayRecordController extends BaseController {
  @Inject()
  payService: PayService;

  @Post('/refund', { summary: '退款审批' })
  async refund(@Body() body) {
    return this.ok(
      await this.payService.refundApprove(Number(body?.id), body?.amount)
    );
  }
}
