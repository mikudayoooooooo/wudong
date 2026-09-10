import { BaseEntity, transformerTime } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 电子票（核销凭证 = 足迹点亮依据）
 * 下单即按数量生成；核销时校验所属订单已支付
 */
@Entity('travel_e_ticket')
@Index(['userId', 'status'])
export class TravelETicketEntity extends BaseEntity {
  @Column({ comment: '订单ID', nullable: true })
  orderId: number;

  @Index()
  @Column({ comment: '订单号', length: 32 })
  orderNo: string;

  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '项目类型 ticket/route', length: 20 })
  itemType: string;

  @Column({ comment: '项目ID' })
  itemId: number;

  @Column({ comment: '使用日期', length: 20 })
  useDate: string;

  @Column({ comment: '核销码', length: 64 })
  qrCode: string;

  @Column({
    comment: '状态 unused未使用 used已核销 refunded已退款',
    dict: ['待使用', '已核销', '已退款'],
    default: 'unused',
    length: 20,
  })
  status: string;

  @Column({
    comment: '核销时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  verifyTime: Date;

  @Column({ comment: '核销管理员ID', nullable: true })
  verifyAdminId: number;
}
