import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { RoomCalendarEntity } from '../../entity/room-calendar';
import { RoomCalendarService } from '../../service/room-calendar';

@CoolController({
  api: ['page', 'info', 'delete'],
  entity: RoomCalendarEntity,
  pageQueryOp: {
    fieldEq: ['a.roomTypeId', 'a.status'],
  },
})
export class AdminAccommodationRoomCalendarController extends BaseController {
  @Inject()
  roomCalendarService: RoomCalendarService;

  @Post('/batch', { summary: '批量设置房态（动态定价/关房）' })
  async batch(@Body() body) {
    return this.ok(await this.roomCalendarService.batch(body));
  }

  @Get('/range', { summary: '区间查询（含默认回退）' })
  async range(
    @Query('roomTypeId') roomTypeId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.ok(await this.roomCalendarService.range(Number(roomTypeId), startDate, endDate));
  }
}
