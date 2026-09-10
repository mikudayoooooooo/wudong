import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
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

  @Get('/hotel/info', { summary: '民宿详情' })
  async hotelInfo(@Query('id') id: number) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(
      await this.merchantHotelService.hotelInfo(merchant.id, Number(id))
    );
  }

  @Post('/hotel/add', { summary: '新增民宿' })
  async hotelAdd(@Body() body) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(
      await this.merchantHotelService.hotelAdd(
        merchant.id,
        merchant.module,
        body
      )
    );
  }

  @Post('/hotel/update', { summary: '更新民宿' })
  async hotelUpdate(@Body() body) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(
      await this.merchantHotelService.hotelUpdate(merchant.id, body)
    );
  }

  @Post('/hotel/delete', { summary: '删除民宿' })
  async hotelDelete(@Body('id') id: number) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(
      await this.merchantHotelService.hotelRemove(merchant.id, Number(id))
    );
  }
}
