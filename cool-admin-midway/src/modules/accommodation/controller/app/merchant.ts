import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { MerchantScopeService } from '../../service/merchant-scope';
import { MerchantHotelService } from '../../service/merchant-hotel';
import { MerchantRoomTypeService } from '../../service/merchant-room-type';
import { MerchantCalendarService } from '../../service/merchant-calendar';

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

  @Inject()
  merchantRoomTypeService: MerchantRoomTypeService;

  @Inject()
  merchantCalendarService: MerchantCalendarService;

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

  @Get('/room-type/page', { summary: '某民宿的房型分页' })
  async roomTypePage(@Query() query) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(
      await this.merchantRoomTypeService.roomTypePage(merchant.id, query)
    );
  }

  @Post('/room-type/add', { summary: '新增房型' })
  async roomTypeAdd(@Body() body) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(await this.merchantRoomTypeService.roomTypeAdd(merchant.id, body));
  }

  @Post('/room-type/update', { summary: '更新房型' })
  async roomTypeUpdate(@Body() body) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(await this.merchantRoomTypeService.roomTypeUpdate(merchant.id, body));
  }

  @Post('/room-type/delete', { summary: '删除房型' })
  async roomTypeDelete(@Body('id') id: number) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(
      await this.merchantRoomTypeService.roomTypeRemove(merchant.id, Number(id))
    );
  }

  @Get('/calendar/range', { summary: '房态区间查询' })
  async calendarRange(
    @Query('roomTypeId') roomTypeId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(
      await this.merchantCalendarService.range(
        merchant.id,
        Number(roomTypeId),
        startDate,
        endDate
      )
    );
  }

  @Post('/calendar/batch', { summary: '批量设置房态' })
  async calendarBatch(@Body() body) {
    const merchant = await this.scopeService.requireMerchant(this.ctx.user.id);
    return this.ok(
      await this.merchantCalendarService.batch(merchant.id, body)
    );
  }
}
