import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post } from '@midwayjs/core';
import { MerchantService } from '../../service/merchant';

/**
 * C端商家入驻（需登录）
 */
@CoolController({ prefix: '/app/merchant' })
export class AppMerchantController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  merchantService: MerchantService;

  @Post('/apply', { summary: '提交入驻申请' })
  async apply(@Body() body) {
    return this.ok(await this.merchantService.apply(this.ctx.user.id, body));
  }

  @Get('/my', { summary: '我的店铺' })
  async my() {
    return this.ok(await this.merchantService.my(this.ctx.user.id));
  }

  @Get('/application', { summary: '入驻申请进度' })
  async application() {
    return this.ok(
      await this.merchantService.latestApplication(this.ctx.user.id)
    );
  }
}
