import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { Context } from '@midwayjs/koa';
import { ProductEntity } from '../../entity/product';
import { ProductService } from '../../service/product';

/**
 * 商家端-商品管理
 */
@CoolController({
  prefix: '/admin/product',
  api: ['page', 'list', 'info', 'update', 'delete'],
  entity: ProductEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.categoryId'],
    keyWordLikeFields: ['a.name'],
    // 自动过滤：只显示当前商家的商品
    where: async ctx => {
      return [
        ['a.merchantId = :merchantId', { merchantId: ctx.admin.userId }],
      ];
    },
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
