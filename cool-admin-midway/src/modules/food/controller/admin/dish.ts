import { Body, Inject, Post } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { Context } from '@midwayjs/koa';
import { DishEntity } from '../../entity/dish';
import { DishService } from '../../service/dish';

/**
 * 商家端-菜品管理
 */
@CoolController({
  prefix: '/admin/food/dish',
  api: ['page', 'list', 'info', 'update', 'delete'],
  entity: DishEntity,
  pageQueryOp: {
    fieldEq: ['a.restaurantId', 'a.status', 'a.category'],
    keyWordLikeFields: ['a.name'],
  },
})
export class AdminDishController extends BaseController {
  @Inject()
  dishService: DishService;

  @Inject()
  ctx: Context;

  /**
   * 添加菜品
   */
  @Post('/create', { summary: '添加菜品' })
  async create(@Body() data: any) {
    const merchantId = this.ctx.admin.userId;
    return this.ok(await this.dishService.create(merchantId, data));
  }
}
