import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post } from '@midwayjs/core';
import { TravelTicketService } from '../../service/ticket';

/**
 * C端电子票（需登录）：我的票卡 / 整单退票
 */
@CoolController()
export class AppTravelTicketController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  ticketService: TravelTicketService;

  @Get('/my', { summary: '我的电子票' })
  async my() {
    return this.ok(await this.ticketService.my(this.ctx.user.id));
  }

  @Post('/refund', { summary: '按订单退票（24h 规则，扣 10% 手续费）' })
  async refund(@Body('orderNo') orderNo: string) {
    return this.ok(await this.ticketService.refund(this.ctx.user.id, orderNo));
  }
}
