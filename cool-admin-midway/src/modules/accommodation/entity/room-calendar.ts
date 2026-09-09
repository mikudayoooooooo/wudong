import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../base/entity/base';

/** 房态日历 */
@Entity('room_calendar')
@Index('uk_room_calendar_roomTypeId_date', ['roomTypeId', 'date'], { unique: true })
export class RoomCalendarEntity extends BaseEntity {
  @Column({ comment: '房型ID' })
  roomTypeId: number;

  @Column({ comment: '日期', type: 'date' })
  date: string;

  @Column({ comment: '当日可售间数', default: 0 })
  availableStock: number;

  @Column({ comment: '当日价格（动态定价）', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '状态：1可订 0不可订', dict: ['不可订', '可订'], default: 1 })
  status: number;
}
