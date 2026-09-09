import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 路线行程站点
 */
@Entity('travel_route_itinerary')
@Index(['routeId'])
export class TravelRouteItineraryEntity extends BaseEntity {
  @Column({ comment: '路线ID' })
  routeId: number;

  @Column({ comment: '第几天', default: 1 })
  dayNo: number;

  @Column({ comment: '当天顺序', default: 1 })
  sort: number;

  @Column({ comment: '行程描述', length: 200, nullable: true })
  description: string;

  @Column({ comment: '景区ID（站点）' })
  scenicSpotId: number;

  @Column({ comment: '餐饮安排', length: 200, nullable: true })
  meal: string;

  @Column({ comment: '住宿安排', length: 200, nullable: true })
  stay: string;

  @Column({ comment: '交通方式', length: 100, nullable: true })
  transport: string;
}
