import { BaseEntity, transformerTime } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 统一订单主表
 */
@Entity('order')
export class OrderEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '订单号', length: 32 })
  orderNo: string;

  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '商家ID（归属标识，由下单调用模块解析传入，无商家归属为空）', nullable: true })
  merchantId: number;

  @Column({
    comment: '订单类型 1商品 2餐位 3住宿 4门票 5路线',
    dict: ['商品', '餐位', '住宿', '门票', '路线'],
    default: 1,
  })
  orderType: number;

  @Column({ comment: '所属模块 product/food/accommodation/travel', length: 20 })
  module: string;

  @Column({
    comment: '订单总额',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  @Column({
    comment: '实付金额',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  payAmount: number;

  @Column({
    comment: '优惠金额',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  discountAmount: number;

  @Column({
    comment: '状态 1待支付 2已支付 3已完成 4已取消 5已退款',
    dict: ['待支付', '已支付', '已完成', '已取消', '已退款'],
    default: 1,
  })
  status: number;

  @Column({
    comment: '支付时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  payTime: Date;

  @Column({
    comment: '完成时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  completeTime: Date;

  @Column({
    comment: '取消时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  cancelTime: Date;

  @Column({ comment: '订单备注', length: 500, nullable: true })
  remark: string;
}
