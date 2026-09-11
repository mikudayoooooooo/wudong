import { Body, Inject, Post } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { Context } from '@midwayjs/koa';
import { FarmProductEntity } from '../../entity/farm-product';
import { FarmProductService } from '../../service/farm-product';
import { MerchantAdminScopeService } from '../../../merchant/service/admin-scope';

/**
 * 商家端-农产品管理
 * 数据权限：绑定 merchant.adminUserId 的账号只看本商家；平台管理员不受限
 */
@CoolController({
  prefix: '/admin/food/farm-product',
  api: ['page', 'list', 'info', 'update', 'delete'],
  entity: FarmProductEntity,
  // 注意：EPS 构建期会零参调用本函数，ctx 缺席时只返回静态配置（启动不崩）；请求期才注入商家 where
  pageQueryOp: async (ctx?: any, app?: any) => {
    const base = {
      fieldEq: ['a.status', 'a.categoryId'],
      keyWordLikeFields: ['a.name'],
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
export class AdminFarmProductController extends BaseController {
  @Inject()
  farmProductService: FarmProductService;

  @Inject()
  ctx: Context;

  /**
   * 创建农产品
   */
  @Post('/create', { summary: '创建农产品' })
  async create(@Body() data: any) {
    const merchantId = this.ctx.admin.userId;
    return this.ok(await this.farmProductService.create(merchantId, data));
  }

  /**
   * 上下架
   */
  @Post('/updateStatus', { summary: '上下架农产品' })
  async updateStatus(@Body() body: { id: number; status: number }) {
    const merchantId = this.ctx.admin.userId;
    await this.farmProductService.updateStatus(
      merchantId,
      body.id,
      body.status
    );
    return this.ok();
  }
}
