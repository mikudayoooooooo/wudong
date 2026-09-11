import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { Context } from '@midwayjs/koa';
import { ProductEntity } from '../../entity/product';
import { ProductService } from '../../service/product';
import { MerchantAdminScopeService } from '../../../merchant/service/admin-scope';

/**
 * 商家端-商品管理
 * 数据权限：绑定 merchant.adminUserId 的账号只看本商家；平台管理员不受限
 */
@CoolController({
  prefix: '/admin/product/goods',
  api: ['page', 'list', 'info', 'update', 'delete'],
  entity: ProductEntity,
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
export class AdminProductController extends BaseController {
  @Inject()
  productService: ProductService;

  @Inject()
  ctx: Context;

  /**
   * 创建商品
   */
  @Post('/create', { summary: '创建商品' })
  async create(@Body() data: any) {
    const merchantId = this.ctx.admin.userId;
    const result = await this.productService.create(merchantId, data);
    return this.ok(result);
  }

  /**
   * 上下架
   */
  @Post('/updateStatus', { summary: '上下架商品' })
  async updateStatus(@Body() body: { id: number; status: number }) {
    const merchantId = this.ctx.admin.userId;
    await this.productService.updateStatus(merchantId, body.id, body.status);
    return this.ok();
  }
}
