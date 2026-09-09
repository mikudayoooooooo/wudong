import { BaseEntity, transformerTime } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 订单明细-商品（衣）
 */
@Entity('order_product')
export class OrderProductEntity extends BaseEntity {
  @Column({ comment: '订单ID' })
  orderId: number;

  @Column({ comment: '商品ID' })
  productId: number;

  @Column({ comment: 'SKU ID' })
  skuId: number;

  @Column({ comment: '商品名称', length: 200 })
  productName: string;

  @Column({ comment: 'SKU名称', length: 100, nullable: true })
  skuName: string;

  @Column({ comment: '商品图片', length: 500, nullable: true })
  productImage: string;

  @Column({
    comment: '单价',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({ comment: '数量', default: 1 })
  quantity: number;

  @Column({
    comment: '小计',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalAmount: number;

  @Column({ comment: '收货地址ID', nullable: true })
  addressId: number;

  @Column({ comment: '快递公司', length: 50, nullable: true })
  expressCompany: string;

  @Column({ comment: '快递单号', length: 50, nullable: true })
  expressNo: string;

  @Column({
    comment: '发货时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  shipTime: Date;

  @Column({
    comment: '收货时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  receiveTime: Date;
}
