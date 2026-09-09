import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { CartService } from '../../service/cart';

/**
 * C端购物车（需登录）
 * 注意：BaseController 自带 add/update/delete/page/list/info 内置方法，
 * 自定义方法名须避开（TS2416），路由路径不受影响
 */
@CoolController({ prefix: '/app/cart' })
export class AppCartController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  cartService: CartService;

  @Post('/add', { summary: '加入购物车' })
  async addItem(
    @Body('productId') productId: number,
    @Body('skuId') skuId: number,
    @Body('quantity') quantity: number
  ) {
    return this.ok(
      await this.cartService.addItem(this.ctx.user.id, productId, skuId, quantity)
    );
  }

  @Post('/update', { summary: '修改数量/勾选' })
  async updateItem(@Body() body) {
    return this.ok(
      await this.cartService.updateItem(this.ctx.user.id, body.id, body)
    );
  }

  @Post('/delete', { summary: '删除购物车项' })
  async removeItem(@Body('ids') ids: number[]) {
    return this.ok(await this.cartService.removeItem(this.ctx.user.id, ids));
  }

  @Get('/page', { summary: '我的购物车' })
  async pageList(
    @Query('page') page: number,
    @Query('size') size: number
  ) {
    return this.ok(
      await this.cartService.pageList(this.ctx.user.id, page, size)
    );
  }
}
