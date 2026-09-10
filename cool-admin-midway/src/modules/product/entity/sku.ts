import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品SKU
 */
@Entity('product_sku')
export class ProductSkuEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商品ID' })
  productId: number;

  @Column({ comment: '规格属性JSON', type: 'json', transformer: transformerJson })
  attributes: object;

  @Column({
    comment: 'SKU价格',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({ comment: 'SKU库存', default: 0 })
  stock: number;

  @Column({ comment: 'SKU编码', length: 50, nullable: true })
  skuCode: string;
}
