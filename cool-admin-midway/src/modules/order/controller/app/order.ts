import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { OrderService } from '../../service/order';

/**
 * C端统一订单（需登录）
 * 说明：文件名与模块名同名会导致前缀推导重复（/app/order/order），
 * 故显式指定 prefix，保证 URL 与 base 设计一致
 */
@CoolController({ prefix: '/app/order' })
export class AppOrderController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  orderService: OrderService;

  @Post('/create', { summary: '创建订单' })
  async create(@Body() body) {
    return this.ok(await this.orderService.create(this.ctx.user.id, body));
  }

  // 注：BaseController 自带无参 page() 内置方法，自定义方法不能与其重名（TS2416），
  // 故方法命名 pageList，路由仍为 GET /page
  @Get('/page', { summary: '我的订单分页' })
  async pageList(
    @Query('status') status: number,
    @Query('page') page: number,
    @Query('size') size: number
  ) {
    return this.ok(
      await this.orderService.pageList(this.ctx.user.id, status, page, size)
    );
  }

  @Get('/detail', { summary: '订单详情' })
  async detail(@Query('orderNo') orderNo: string) {
    return this.ok(await this.orderService.getByNo(this.ctx.user.id, orderNo));
  }

  @Post('/cancel', { summary: '取消订单' })
  async cancel(@Body('orderNo') orderNo: string) {
    return this.ok(await this.orderService.cancel(this.ctx.user.id, orderNo));
  }
}
