import { Body, Get, Inject, Post, Provide, Query } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { ReservationService } from '../../service/reservation';
import { Context } from '@midwayjs/koa';

/**
 * 预订C端控制器
 */
@Provide()
@CoolController('/app/food/reservation')
export class AppReservationController extends BaseController {
  @Inject()
  reservationService: ReservationService;

  @Inject()
  ctx: Context;

  /**
   * 创建预订
   */
  @Post('/create', { summary: '创建预订' })
  async create(@Body() body: any) {
    const userId = this.ctx.user?.id;
    if (!userId) {
      return this.fail('请先登录');
    }

    const {
      restaurantId,
      timeSlotId,
      reservationDate,
      peopleCount,
      contactName,
      contactPhone,
      remark,
    } = body;

    // 验证必填字段
    if (
      !restaurantId ||
      !timeSlotId ||
      !reservationDate ||
      !peopleCount ||
      !contactName ||
      !contactPhone
    ) {
      return this.fail('请填写完整的预订信息');
    }

    const reservation = await this.reservationService.create({
      userId,
      restaurantId,
      timeSlotId,
      reservationDate,
      peopleCount,
      contactName,
      contactPhone,
      remark,
    });

    return this.ok(reservation);
  }

  /**
   * 我的预订列表
   */
  @Get('/my', { summary: '我的预订' })
  async getMyReservations(
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
   * 取消预订
   */
  @Post('/:id/cancel', { summary: '取消预订' })
  async cancel(@Query('id') id: number) {
    const userId = this.ctx.user?.id;
    if (!userId) {
      return this.fail('请先登录');
    }

    await this.reservationService.cancelReservation(userId, id);
    return this.ok('取消成功');
  }

  /**
   * 预订详情
   */
  @Get('/:id', { summary: '预订详情' })
  async info(@Query('id') id: number) {
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
}
