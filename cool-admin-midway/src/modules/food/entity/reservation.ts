import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 餐厅预订实体
 */
@Entity('food_reservation')
export class ReservationEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '餐厅ID' })
  restaurantId: number;

  @Index()
  @Column({ comment: '时段ID' })
  timeSlotId: number;

  @Column({ type: 'date', comment: '预订日期' })
  reservationDate: string;

  @Column({ comment: '就餐人数' })
  peopleCount: number;

  @Column({ comment: '联系人姓名' })
  contactName: string;

  @Column({ comment: '联系电话' })
  contactPhone: string;

  @Column({ type: 'text', comment: '备注', nullable: true })
  remark: string;

  @Index()
  @Column({
    type: 'tinyint',
    default: 0,
    comment: '状态：0-待确认 1-已确认 2-已取消 3-已完成',
  })
  status: number;

  @Column({ type: 'datetime', comment: '确认时间', nullable: true })
  confirmTime: Date;

  @Column({ type: 'datetime', comment: '取消时间', nullable: true })
  cancelTime: Date;

  @Index()
  @Column({ comment: '关联公共订单号（order 模块）', length: 32, nullable: true })
  orderNo: string;
}
