import { Body, Inject, Post } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { Context } from '@midwayjs/koa';
import { RestaurantEntity } from '../../entity/restaurant';
import { RestaurantService } from '../../service/restaurant';
import { MerchantAdminScopeService } from '../../../merchant/service/admin-scope';

/**
 * 商家端-餐厅管理
 * 数据权限：绑定 merchant.adminUserId 的账号只看本商家；平台管理员不受限
 */
@CoolController({
  prefix: '/admin/food/restaurant',
  api: ['page', 'list', 'info', 'update', 'delete'],
  entity: RestaurantEntity,
  // 注意：EPS 构建期会零参调用本函数，ctx 缺席时只返回静态配置（启动不崩）；请求期才注入商家 where
  pageQueryOp: async (ctx?: any, app?: any) => {
    const base = {
      fieldEq: ['a.status'],
      keyWordLikeFields: ['a.name', 'a.phone'],
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
export class AdminRestaurantController extends BaseController {
  @Inject()
  restaurantService: RestaurantService;

  @Inject()
  ctx: Context;

  /**
   * 创建餐厅
   */
  @Post('/create', { summary: '创建餐厅' })
  async create(@Body() data: any) {
    const merchantId = this.ctx.admin.userId;
    return this.ok(await this.restaurantService.create(merchantId, data));
  }
}
