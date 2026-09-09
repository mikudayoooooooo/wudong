import { BaseEntity, transformerTime } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 支付记录
 */
@Entity('payment_record')
export class PaymentRecordEntity extends BaseEntity {
  @Column({ comment: '订单ID' })
  orderId: number;

  @Index({ unique: true })
  @Column({ comment: '支付流水号', length: 32 })
  paymentNo: string;

  @Column({ comment: '支付渠道 wechat/alipay', length: 20 })
  payChannel: string;

  @Column({
    comment: '支付金额',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  payAmount: number;

  @Column({
    comment: '支付状态 1待支付 2已支付 3已退款',
    dict: ['待支付', '已支付', '已退款'],
    default: 1,
  })
  payStatus: number;

  @Column({ comment: '第三方交易号', length: 64, nullable: true })
  transactionId: string;

  @Column({
    comment: '支付时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  payTime: Date;

  @Column({
    comment: '退款时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  refundTime: Date;

  @Column({
    comment: '退款金额',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  refundAmount: number;

  @Column({ comment: '支付回调数据', type: 'json', nullable: true })
  callbackData: any;
}
