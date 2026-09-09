import { CoolController, BaseController, CoolUrlTag, TagTypes, CoolTag } from '@cool-midway/core';
import { Get, Inject, Query } from '@midwayjs/core';
import { RoomCalendarService } from '../../service/room-calendar';

/**
 * C 端房态日历（匿名，缺省回退见 service）
 */
@CoolUrlTag()
@CoolController()
export class AppAccommodationRoomTypeController extends BaseController {
  @Inject()
  roomCalendarService: RoomCalendarService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/calendar', { summary: '房态日历' })
  async calendar(
    @Query('roomTypeId') roomTypeId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    return this.ok(
      await this.roomCalendarService.range(Number(roomTypeId), startDate, endDate)
    );
  }
}
