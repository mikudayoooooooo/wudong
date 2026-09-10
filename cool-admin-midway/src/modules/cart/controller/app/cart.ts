import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post } from '@midwayjs/core';
import { CartService } from '../../service/cart';
import { Context } from '@midwayjs/koa';

/**
 * C端购物车控制器
 */
@CoolController({ prefix: '/app/cart' })
export class AppCartController extends BaseController {
  @Inject()
  ctx: Context;

  @Inject()
  cartService: CartService;

  @Post('/add', { summary: '加入购物车' })
  async addToCart(@Body() body: any) {
    const userId = this.ctx.user?.id;
    if (!userId) {
      return this.fail('请先登录');
    }

    const { itemType, itemId, quantity } = body;
    if (!itemType || !itemId) {
      return this.fail('商品信息不完整');
    }

    const result = await this.cartService.addItem(
      userId,
      itemType,
      itemId,
      quantity || 1
    );
    return this.ok(result);
  }

  @Post('/update', { summary: '更新购物车数量' })
  async updateCart(@Body() body: any) {
    const userId = this.ctx.user?.id;
    if (!userId) {
      return this.fail('请先登录');
    }

    const { cartItemId, quantity } = body;
    if (!cartItemId || !quantity) {
      return this.fail('参数不完整');
    }

    await this.cartService.updateQuantity(userId, cartItemId, quantity);
    return this.ok(true);
  }

  @Post('/remove', { summary: '移除购物车商品' })
  async remove(@Body() body: any) {
    const userId = this.ctx.user?.id;
    if (!userId) {
      return this.fail('请先登录');
    }

    const { cartItemId } = body;
    if (!cartItemId) {
      return this.fail('参数不完整');
    }

    await this.cartService.removeItem(userId, cartItemId);
    return this.ok(true);
  }

  @Get('/list', { summary: '查看购物车' })
  async list() {
    const userId = this.ctx.user?.id;
    if (!userId) {
      return this.fail('请先登录');
    }

    const result = await this.cartService.getMyCart(userId);
    return this.ok(result);
  }

  @Post('/clear', { summary: '清空购物车' })
  async clear() {
    const userId = this.ctx.user?.id;
    if (!userId) {
      return this.fail('请先登录');
    }

    await this.cartService.clearCart(userId);
    return this.ok(true);
  }

  @Get('/count', { summary: '获取购物车数量' })
  async count() {
    const userId = this.ctx.user?.id;
    if (!userId) {
      return this.ok(0);
    }

    const count = await this.cartService.getCartCount(userId);
    return this.ok(count);
  }
}
