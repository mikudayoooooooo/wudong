import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import * as moment from 'moment';
import { RoomCalendarService } from './room-calendar';
import { MerchantScopeService } from './merchant-scope';

const FMT = 'YYYY-MM-DD';
// 与 C 端一致：单次窗口上限（含首尾）32 天
const MAX_DAYS = 32;

/**
 * 商家自管房态：只做归属校验 + 窗口校验，具体读写复用 RoomCalendarService
 * （默认回退、库存截断等语义单一来源，避免两套实现漂移）
 */
@Provide()
export class MerchantCalendarService extends BaseService {
  @Inject()
  roomCalendarService: RoomCalendarService;

  @Inject()
  scopeService: MerchantScopeService;

  /** 区间合法性：格式、先后、上限 */
  private assertPeriod(startDate: string, endDate: string) {
    const start = moment(startDate, FMT, true);
    const end = moment(endDate, FMT, true);
    if (!start.isValid() || !end.isValid() || start.isAfter(end)) {
      throw new CoolCommException('日期区间无效');
    }
    if (end.diff(start, 'days') + 1 > MAX_DAYS) {
      throw new CoolCommException('日期区间最多32天');
    }
  }

  /** 房态区间查询（含回退默认） */
  async range(
    merchantId: number,
    roomTypeId: number,
    startDate: string,
    endDate: string
  ) {
    const roomType = await this.scopeService.requireOwnedRoomType(
      merchantId,
      roomTypeId
    );
    this.assertPeriod(startDate, endDate);
    return this.roomCalendarService.range(
      roomType.id,
      startDate,
      endDate
    );
  }

  /** 批量设置房态：价格/库存/关房，可限定星期几 */
  async batch(merchantId: number, body: any): Promise<{ count: number }> {
    const roomType = await this.scopeService.requireOwnedRoomType(
      merchantId,
      body?.roomTypeId
    );
    this.assertPeriod(body?.startDate, body?.endDate);
    if (body?.closed !== true && body?.price == null && body?.availableStock == null) {
      throw new CoolCommException('请至少填写价格或可售间数');
    }
    if (body?.price != null && Number(body.price) <= 0) {
      throw new CoolCommException('房型价格必须大于 0');
    }
    return this.roomCalendarService.batch({
      roomTypeId: roomType.id,
      startDate: body.startDate,
      endDate: body.endDate,
      weekDays: body.weekDays,
      price: body.price == null ? undefined : Number(body.price),
      availableStock:
        body.availableStock == null ? undefined : Number(body.availableStock),
      closed: body.closed === true,
    });
  }
}
