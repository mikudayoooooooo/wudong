import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 农产品分类
 */
@Entity('farm_product_category')
export class FarmProductCategoryEntity extends BaseEntity {
  @Column({ comment: '分类名称', length: 50 })
  name: string;

  @Column({ comment: '图标', length: 500, nullable: true })
  icon: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '状态：0-禁用 1-启用', default: 1 })
  status: number;
}
