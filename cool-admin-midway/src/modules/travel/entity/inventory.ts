import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 日期库存（门票按使用日期、路线按出发日期）
 */
@Entity('travel_inventory')
@Index(['itemType', 'itemId', 'useDate'], { unique: true })
export class TravelInventoryEntity extends BaseEntity {
  @Column({ comment: '项目类型 ticket/route', length: 20 })
  itemType: string;

  @Column({ comment: '项目ID' })
  itemId: number;

  @Column({ comment: '使用日期', length: 20 })
  useDate: string;

  @Column({ comment: '总库存', default: 0 })
  total: number;

  @Column({ comment: '已售', default: 0 })
  sold: number;
}
