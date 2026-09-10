import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 农产品
 */
@Entity('farm_product')
export class FarmProductEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商家ID' })
  merchantId: number;

  @Column({ comment: '分类ID' })
  categoryId: number;

  @Column({ comment: '产品名称', length: 100 })
  name: string;

  @Column({ comment: '封面图', length: 500 })
  coverImage: string;

  @Column({
    comment: '产品图片JSON',
    type: 'json',
    nullable: true,
    transformer: transformerJson,
  })
  images: object;

  @Column({
    comment: '价格',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({ comment: '单位', length: 10 })
  unit: string;

  @Column({ comment: '库存', default: 0 })
  stock: number;

  @Column({ comment: '产地', length: 100, nullable: true })
  origin: string;

  @Column({ comment: '产品描述', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '状态', dict: ['下架', '上架'], default: 0 })
  status: number;
}
