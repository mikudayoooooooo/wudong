import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 菜品
 */
@Entity('dish')
export class DishEntity extends BaseEntity {
  @Index()
  @Column({ comment: '餐厅ID' })
  restaurantId: number;

  @Column({ comment: '菜品名称', length: 100 })
  name: string;

  @Column({ comment: '菜品图片', length: 500 })
  image: string;

  @Column({
    comment: '价格',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({ comment: '分类', length: 20, nullable: true })
  category: string;

  @Column({ comment: '菜品介绍', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '是否推荐', default: 0 })
  isRecommended: number;

  @Column({ comment: '状态', dict: ['下架', '上架'], default: 1 })
  status: number;
}
