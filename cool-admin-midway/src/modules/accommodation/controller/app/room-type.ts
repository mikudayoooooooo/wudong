import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
  CoolTag,
  CoolCommException,
} from '@cool-midway/core';
import { Get, Inject, Query } from '@midwayjs/core';
import * as moment from 'moment';
import { RoomCalendarService } from '../../service/room-calendar';

const FMT = 'YYYY-MM-DD';
// 规范：C 端日历窗口上限（含首尾）32 天
const MAX_DAYS = 32;

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
    const start = moment(startDate, FMT, true);
    const end = moment(endDate, FMT, true);
    if (!start.isValid() || !end.isValid() || start.isAfter(end)) {
      throw new CoolCommException('日期区间无效');
    }
    if (end.diff(start, 'days') + 1 > MAX_DAYS) {
      throw new CoolCommException('日期区间最多32天');
    }
    return this.ok(
      await this.roomCalendarService.range(
        Number(roomTypeId),
        startDate,
        endDate
      )
    );
  }
}
