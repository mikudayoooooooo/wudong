import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
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
}
