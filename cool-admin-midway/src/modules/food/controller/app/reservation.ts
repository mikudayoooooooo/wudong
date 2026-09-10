import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { CoolController, BaseController, CoolUrlTag, CoolTag, TagTypes } from '@cool-midway/core';
import { ReservationService } from '../../service/reservation';
import { Context } from '@midwayjs/koa';

/**
 * 预订C端控制器
 */
@CoolUrlTag()
@CoolController()
export class AppReservationController extends BaseController {
  @Inject()
  reservationService: ReservationService;

  @Inject()
  ctx: Context;

  /**
   * 创建预订
   */
  @Post('/app/food/reservation/create', { summary: '创建预订' })
  async create(@Body() body: any) {
    const userId = this.ctx.user?.id;
    if (!userId) {
      return this.fail('请先登录');
    }

    const { restaurantId, timeSlotId, reservationDate, peopleCount, note } =
      body;

    // 验证必填字段
    if (!restaurantId || !timeSlotId || !reservationDate || !peopleCount) {
      return this.fail('餐厅、时段、日期和人数不能为空');
    }

    const reservation = await this.reservationService.create({
      userId,
      restaurantId,
      timeSlotId,
      reservationDate,
      peopleCount,
      contactName: body.contactName,
      contactPhone: body.contactPhone,
      note,
    });

    return this.ok(reservation);
  }

  /**
   * 用户的预订列表
   */
  @Get('/app/food/reservation/my-list', { summary: '我的预订' })
  async myList(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('status') status?: number
  ) {
    const userId = this.ctx.user?.id;
    if (!userId) {
      return this.fail('请先登录');
    }

    const result = await this.reservationService.getUserReservations(
      userId,
      page,
      size,
      status
    );
    return this.ok(result);
  }

  /**
   * 预订详情
   */
  @Get('/app/food/reservation/detail', { summary: '预订详情' })
  async getDetail(@Query('id') id: number) {
    const userId = this.ctx.user?.id;
    if (!userId) {
      return this.fail('请先登录');
    }

    const reservation = await this.reservationService.getDetail(userId, id);
    if (!reservation) {
      return this.fail('预订不存在');
    }
    return this.ok(reservation);
  }

  /**
   * 取消预订
   */
  @Post('/app/food/reservation/cancel', { summary: '取消预订' })
  async cancel(@Body() body: { id: number }) {
    const userId = this.ctx.user?.id;
    if (!userId) {
      return this.fail('请先登录');
    }

    await this.reservationService.cancelReservation(userId, body.id);
    return this.ok('预订已取消');
  }
}
