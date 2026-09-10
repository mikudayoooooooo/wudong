import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 购物车项
 */
@Entity('cart_item')
export class CartItemEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({
    comment: '商品类型 1-非遗商品 2-农产品',
    type: 'tinyint',
  })
  itemType: number;

  @Column({ comment: '商品ID（product.id 或 farm_product.id）' })
  itemId: number;

  @Column({ comment: '数量', default: 1 })
  quantity: number;

  @Column({ comment: '商品名称快照', length: 100 })
  itemName: string;

  @Column({
    comment: '单价快照',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({ comment: '封面图快照', length: 500, nullable: true })
  coverImage: string;
}
