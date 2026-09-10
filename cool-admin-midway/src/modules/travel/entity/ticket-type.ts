import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 票种（隶属景区）
 */
@Entity('travel_ticket_type')
@Index(['scenicSpotId'])
export class TravelTicketTypeEntity extends BaseEntity {
  @Column({ comment: '景区ID' })
  scenicSpotId: number;

  @Column({ comment: '票种名称', length: 100 })
  name: string;

  @Column({
    comment: '票价',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({ comment: '总库存', default: 0 })
  totalStock: number;

  @Column({ comment: '有效期规则', length: 200, nullable: true })
  validityRule: string;

  @Column({ comment: '状态 1在售 0下架', default: 1 })
  status: number;
}
