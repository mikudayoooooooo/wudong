import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品主表
 */
@Entity('product')
export class ProductEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商家ID' })
  merchantId: number;

  @Column({ comment: '分类ID' })
  categoryId: number;

  @Column({ comment: '商品名称', length: 100 })
  name: string;

  @Column({ comment: '封面图', length: 500 })
  coverImage: string;

  @Column({
    comment: '售价',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({ comment: '库存', default: 0 })
  stock: number;

  @Column({ comment: '销量', default: 0 })
  sales: number;

  @Column({ comment: '工艺介绍', type: 'text', nullable: true })
  craftIntro: string;

  @Column({ comment: '传承人ID', nullable: true })
  inheritorId: number;

  @Column({ comment: '商品详情', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '状态', dict: ['下架', '上架'], default: 0 })
  status: number;
}
