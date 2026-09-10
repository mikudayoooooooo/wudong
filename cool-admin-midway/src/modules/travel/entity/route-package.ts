import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 路线套餐
 */
@Entity('travel_route_package')
export class TravelRoutePackageEntity extends BaseEntity {
  @Column({ comment: '标题', length: 200 })
  title: string;

  @Column({ comment: '天数', default: 1 })
  days: number;

  @Column({ comment: '主题 亲子/摄影/研学/节庆/经典', length: 20, nullable: true })
  theme: string;

  @Column({
    comment: '价格',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

  @Column({ comment: '包含项目（JSON数组）', type: 'json', nullable: true })
  includes: any;

  @Column({ comment: '出发地', length: 100, nullable: true })
  departure: string;

  @Column({ comment: '目的地', length: 100, nullable: true })
  destination: string;

  @Column({ comment: '住宿标准', length: 200, nullable: true })
  hotelStandard: string;

  @Column({ comment: '餐饮标准', length: 200, nullable: true })
  mealStandard: string;

  @Column({ comment: '预订须知', length: 500, nullable: true })
  notice: string;

  @Column({ comment: '主图', length: 255, nullable: true })
  mainImage: string;

  @Column({ comment: '富文本详情', type: 'text', nullable: true })
  detail: string;

  @Column({ comment: '已售', default: 0 })
  sales: number;

  @Column({ comment: '状态 1上架 0下架', default: 1 })
  status: number;
}
