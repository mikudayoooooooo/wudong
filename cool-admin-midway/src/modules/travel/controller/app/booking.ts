import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { TravelBookingService } from '../../service/booking';

/**
 * C端下单（需登录）
 * 服务端查价 + 库存校验扣减 + 公共订单 + 下单即出票
 */
@CoolController()
export class AppTravelBookingController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  bookingService: TravelBookingService;

  @Post('/create', { summary: '创建预订' })
  async create(@Body() body) {
    return this.ok(await this.bookingService.create(this.ctx.user.id, body));
  }
}
