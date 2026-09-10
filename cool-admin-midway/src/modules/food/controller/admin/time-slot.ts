import { Body, Inject, Post } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { TimeSlotEntity } from '../../entity/time-slot';
import { TimeSlotService } from '../../service/time-slot';

/**
 * 商家端-时段管理
 */
@CoolController({
  prefix: '/admin/food/time-slot',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: TimeSlotEntity,
  pageQueryOp: {
    fieldEq: ['a.restaurantId', 'a.status', 'a.date'],
    keyWordLikeFields: ['a.timePeriod'],
  },
})
export class AdminTimeSlotController extends BaseController {
  @Inject()
  timeSlotService: TimeSlotService;

  /**
   * 批量创建时段
   */
  @Post('/batchCreate', { summary: '批量创建时段' })
  async batchCreate(@Body() body: { restaurantId: number; slots: any[] }) {
    return this.ok(
      await this.timeSlotService.batchCreate(body.restaurantId, body.slots)
    );
  }
}
