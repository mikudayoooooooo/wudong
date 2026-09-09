import { Column, Entity, Index } from 'typeorm';
import { BaseEntity, transformerTime } from '../../base/entity/base';

/** 财务记录（本期仅建表+只读，结算逻辑 Phase4） */
@Entity('finance_record')
export class FinanceRecordEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单ID' })
  orderId: number;

  @Index()
  @Column({ comment: '商家ID' })
  merchantId: number;

  @Column({ comment: '订单金额', type: 'decimal', precision: 10, scale: 2 })
  orderAmount: number;

  @Column({ comment: '抽佣比例%', type: 'decimal', precision: 5, scale: 2 })
  commissionRate: number;

  @Column({ comment: '平台抽佣', type: 'decimal', precision: 10, scale: 2 })
  commissionAmount: number;

  @Column({ comment: '商家收入', type: 'decimal', precision: 10, scale: 2 })
  merchantIncome: number;

  @Column({
    comment: '结算状态：1待结算 2已结算',
    dict: ['待结算', '已结算'],
    default: 1,
  })
  settlementStatus: number;

  @Column({
    comment: '结算时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  settlementTime: Date;

  @Column({ comment: '结算批次号', length: 50, nullable: true })
  settlementBatch: string;
}
