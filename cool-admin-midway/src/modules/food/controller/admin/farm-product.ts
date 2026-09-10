import { Body, Inject, Post } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { Context } from '@midwayjs/koa';
import { FarmProductEntity } from '../../entity/farm-product';
import { FarmProductService } from '../../service/farm-product';

/**
 * 商家端-农产品管理
 */
@CoolController({
  prefix: '/admin/food/farm-product',
  api: ['page', 'list', 'info', 'update', 'delete'],
  entity: FarmProductEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.categoryId'],
    keyWordLikeFields: ['a.name'],
    // 自动过滤：只显示当前商家的农产品
    where: async ctx => {
      return [
        ['a.merchantId = :merchantId', { merchantId: ctx.admin.userId }],
      ];
    },
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
