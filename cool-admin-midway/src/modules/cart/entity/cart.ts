import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 购物车（同用户同 SKU 唯一，重复添加数量累加）
 */
@Entity('cart')
@Index('uk_user_sku', ['userId', 'skuId'], { unique: true })
export class CartEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '商品ID' })
  productId: number;

  @Column({ comment: 'SKU ID' })
  skuId: number;

  @Column({ comment: '数量', default: 1 })
  quantity: number;

  @Column({ comment: '是否选中 1是 0否', default: 1 })
  checked: number;
}
