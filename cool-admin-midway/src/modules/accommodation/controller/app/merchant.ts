import { CoolController, BaseController } from '@cool-midway/core';
import { Get, Inject, Query } from '@midwayjs/core';
import { MerchantScopeService } from '../../service/merchant-scope';
import { MerchantHotelService } from '../../service/merchant-hotel';

/**
 * B 端民宿管理（需登录 + 商家身份 + 归属校验）
 * 前缀显式声明为 /app/accommodation/merchant，避免依赖目录推导
 */
@CoolController({ prefix: '/app/accommodation/merchant' })
export class AppAccommodationMerchantController extends BaseController {
  @Inject() ctx;

  @Inject()
  scopeService: MerchantScopeService;

  @Inject()
  merchantHotelService: MerchantHotelService;

  @Get('/hotel/page', { summary: '我的民宿分页' })
  async hotelPage(@Query() query) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(
      await this.merchantHotelService.hotelPage(merchant.id, query)
    );
  }
}
