import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 订单明细-票（行 门票/路线套餐）
 */
@Entity('order_ticket')
export class OrderTicketEntity extends BaseEntity {
  @Column({ comment: '订单ID' })
  orderId: number;

  @Column({
    comment: '票类型 1门票 2路线套餐',
    dict: ['门票', '路线套餐'],
    default: 1,
  })
  ticketType: number;

  @Column({ comment: '目标ID（景区ID/路线ID）' })
  targetId: number;

  @Column({ comment: '目标名称', length: 200 })
  targetName: string;

  @Column({ comment: '票种名称', length: 100 })
  ticketName: string;

  @Column({ comment: '使用日期', length: 20 })
  useDate: string;

  @Column({ comment: '数量', default: 1 })
  quantity: number;

  @Column({
    comment: '单价',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({
    comment: '总价',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  @Column({ comment: '游客信息（JSON数组）', type: 'json', nullable: true })
  visitorInfo: any;
}
