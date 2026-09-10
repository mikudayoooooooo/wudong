import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 餐位时段
 */
@Entity('time_slot')
export class TimeSlotEntity extends BaseEntity {
  @Index()
  @Column({ comment: '餐厅ID' })
  restaurantId: number;

  @Column({ comment: '日期', type: 'date' })
  date: Date;

  @Column({ comment: '时段', length: 20 })
  timePeriod: string;

  @Column({ comment: '开始时间', length: 10 })
  startTime: string;

  @Column({ comment: '结束时间', length: 10 })
  endTime: string;

  @Column({ comment: '最大预订数', default: 10 })
  maxReservations: number;

  @Column({ comment: '当前预订数', default: 0 })
  currentReservations: number;

  @Column({ comment: '状态', dict: ['禁用', '正常'], default: 1 })
  status: number;
}
