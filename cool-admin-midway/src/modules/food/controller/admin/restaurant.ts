import { Body, Inject, Post } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { Context } from '@midwayjs/koa';
import { RestaurantEntity } from '../../entity/restaurant';
import { RestaurantService } from '../../service/restaurant';

/**
 * 商家端-餐厅管理
 */
@CoolController({
  prefix: '/admin/food/restaurant',
  api: ['page', 'list', 'info', 'update', 'delete'],
  entity: RestaurantEntity,
  pageQueryOp: {
    fieldEq: ['a.status'],
    keyWordLikeFields: ['a.name', 'a.phone'],
    // 自动过滤：只显示当前商家的餐厅
    where: async ctx => {
      return [
        ['a.merchantId = :merchantId', { merchantId: ctx.admin.userId }],
      ];
    },
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
