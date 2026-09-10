import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品分类
 */
@Entity('product_category')
export class ProductCategoryEntity extends BaseEntity {
  @Column({ comment: '父分类ID', default: 0 })
  parentId: number;

  @Column({ comment: '分类名称', length: 50 })
  name: string;

  @Column({ comment: '分类图标', length: 500, nullable: true })
  icon: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '状态', dict: ['禁用', '正常'], default: 1 })
  status: number;
}
