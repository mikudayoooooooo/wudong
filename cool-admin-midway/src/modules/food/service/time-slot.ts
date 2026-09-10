import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlotEntity } from '../entity/time-slot';

/**
 * 时段服务
 */
@Provide()
export class TimeSlotService extends BaseService {
  @InjectEntityModel(TimeSlotEntity)
  timeSlotEntity: Repository<TimeSlotEntity>;

  /**
   * 批量创建时段
   */
  async batchCreate(restaurantId: number, slots: any[]) {
    const entities = slots.map(slot => ({
      restaurantId,
      date: slot.date,
      timePeriod: slot.timePeriod,
      startTime: slot.startTime,
      endTime: slot.endTime,
      maxReservations: slot.maxReservations,
    }));

    return await this.timeSlotEntity.save(entities);
  }
}
