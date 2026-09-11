import { CoolController, BaseController } from '@cool-midway/core';
import { Get, Inject } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { OrderEntity } from '../../entity/order';
import { MerchantAdminScopeService } from '../../../merchant/service/admin-scope';
import { OrderStatsService } from '../../service/stats';

/**
 * 统一订单管理
 * 数据权限：绑定了 merchant.adminUserId 的管理端账号只能看到本商家订单；平台管理员不受限
 */
@CoolController({
  prefix: '/admin/order',
  api: ['page', 'list', 'info', 'update', 'delete'],
  entity: OrderEntity,
  // 注意：EPS 构建期会零参调用本函数，ctx 缺席时只返回静态配置（启动不崩）；请求期才注入商家 where
  pageQueryOp: async (ctx?: any, app?: any) => {
    const base = {
      fieldEq: ['a.status', 'a.orderType', 'a.module'],
      keyWordLikeFields: ['a.orderNo'],
    };
    if (!ctx) {
      return base;
    }
    const scope = await (ctx.requestContext ?? app.getApplicationContext())
      .getAsync(MerchantAdminScopeService)
      .then(s => s.whereFor(ctx.admin?.userId));
    return { ...base, where: scope };
  },
})
export class AdminOrderController extends BaseController {
  @Inject()
  ctx: Context;

  @Inject()
  orderStatsService: OrderStatsService;

  @Get('/stats', { summary: '工作台看板统计（真实聚合；商家账号只统计本商家）' })
  async stats() {
    return this.ok(
      await this.orderStatsService.adminStats(this.ctx.admin?.userId)
    );
  }
}
