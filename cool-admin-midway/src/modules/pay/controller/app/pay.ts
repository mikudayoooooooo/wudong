import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { PayService } from '../../service/pay';

/**
 * C端统一支付（需登录）
 * 说明：文件名与模块名同名会导致前缀推导重复（/app/pay/pay），
 * 故显式指定 prefix，保证 URL 与 base 设计一致
 */
@CoolController({ prefix: '/app/pay' })
export class AppPayController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  payService: PayService;

  @Post('/create', { summary: '创建支付单' })
  async create(
    @Body('orderNo') orderNo: string,
    @Body('channel') channel: string
  ) {
    return this.ok(
      await this.payService.create(this.ctx.user.id, orderNo, channel)
    );
  }

  @Post('/mock', { summary: '模拟支付成功' })
  async mock(@Body('paymentNo') paymentNo: string) {
    return this.ok(await this.payService.mockPay(paymentNo));
  }

  @Get('/record', { summary: '订单支付流水' })
  async record(@Query('orderNo') orderNo: string) {
    return this.ok(await this.payService.records(this.ctx.user.id, orderNo));
  }
}
