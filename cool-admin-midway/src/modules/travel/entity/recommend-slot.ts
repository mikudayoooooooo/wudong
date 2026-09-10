import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 运营推荐位（首页焦点轮播等，驱动 C 端展示）
 */
@Entity('travel_recommend_slot')
@Index(['position', 'status'])
export class TravelRecommendSlotEntity extends BaseEntity {
  @Column({ comment: '位置 home焦点轮播等', length: 50, default: 'home' })
  position: string;

  @Column({ comment: '标题', length: 200 })
  title: string;

  @Column({ comment: '副标题', length: 200, nullable: true })
  subtitle: string;

  @Column({ comment: '角标', length: 100, nullable: true })
  badge: string;

  @Column({ comment: '项目类型 route/scenic/post', length: 20 })
  itemType: string;

  @Column({ comment: '项目ID' })
  itemId: number;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '轮播分组', default: 1 })
  rotationGroup: number;

  @Column({ comment: '轮播间隔秒', default: 5 })
  intervalSeconds: number;

  @Column({ comment: '状态 1启用 0禁用', default: 1 })
  status: number;
}
