import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 交通攻略
 */
@Entity('travel_traffic_guide')
export class TravelTrafficGuideEntity extends BaseEntity {
  @Column({ comment: '标题', length: 100 })
  title: string;

  @Column({ comment: '出发地', length: 100 })
  departure: string;

  @Column({ comment: '目的地', length: 100, nullable: true })
  destination: string;

  @Column({ comment: '交通方式', length: 50, nullable: true })
  transportType: string;

  @Column({ comment: '耗时', length: 50, nullable: true })
  duration: string;

  @Column({
    comment: '费用',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  cost: number;

  @Column({ comment: '详情', length: 1000, nullable: true })
  detail: string;

  @Column({ comment: '图片', length: 255, nullable: true })
  image: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '状态 1启用 0禁用', default: 1 })
  status: number;
}
