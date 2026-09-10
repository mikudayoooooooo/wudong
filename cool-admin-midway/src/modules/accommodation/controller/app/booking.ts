import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { AccommodationBookingService } from '../../service/booking';

/**
 * C端住宿预订（需登录）
 * 房态校验（日历行/默认回退）→ 服务端按日计价 → 公共订单(orderType=3)
 */
@CoolController()
export class AppAccommodationBookingController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  bookingService: AccommodationBookingService;

  @Post('/create', { summary: '创建住宿预订' })
  async create(@Body() body) {
    return this.ok(await this.bookingService.create(this.ctx.user.id, body));
  }
}
