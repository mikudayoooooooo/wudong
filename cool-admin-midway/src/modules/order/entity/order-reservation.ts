import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 订单明细-预订（食餐位/住住宿）
 */
@Entity('order_reservation')
export class OrderReservationEntity extends BaseEntity {
  @Column({ comment: '订单ID' })
  orderId: number;

  @Column({ comment: '预订类型 1餐位 2住宿', dict: ['餐位', '住宿'], default: 1 })
  reservationType: number;

  @Column({ comment: '目标ID（餐厅ID/民宿ID）' })
  targetId: number;

  @Column({ comment: '目标名称', length: 200 })
  targetName: string;

  @Column({ comment: '入住/就餐日期', length: 20 })
  checkInDate: string;

  @Column({ comment: '离店日期（住宿用）', length: 20, nullable: true })
  checkOutDate: string;

  @Column({ comment: '入住人/就餐人姓名', length: 50 })
  guestName: string;

  @Column({ comment: '联系电话', length: 11 })
  guestPhone: string;

  @Column({ comment: '人数', default: 1 })
  guestCount: number;

  @Column({ comment: '身份证号（住宿必填）', length: 18, nullable: true })
  idCard: string;

  @Column({ comment: '时段（餐位用）', length: 50, nullable: true })
  timeSlot: string;

  @Column({ comment: '房型ID（住宿用）', nullable: true })
  roomTypeId: number;

  @Column({ comment: '特殊要求', length: 500, nullable: true })
  specialRequest: string;

  @Column({ comment: '入住码/核销码', length: 20, nullable: true })
  checkInCode: string;
}
