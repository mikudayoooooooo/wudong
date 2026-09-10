import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 游记足迹快照（发布时/关联路线时定格；退票保留但灰显）
 */
@Entity('community_post_footprint')
@Index(['postId'])
@Index(['userId', 'scenicSpotId'])
export class CommunityPostFootprintEntity extends BaseEntity {
  @Column({ comment: '游记ID' })
  postId: number;

  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '景区ID' })
  scenicSpotId: number;

  @Column({ comment: '路线ID（模式B骨架）', nullable: true })
  routeId: number;

  @Column({ comment: '订单ID（核销凭证）', nullable: true })
  orderId: number;

  @Column({
    comment: '模式 auto自动聚合 route关联路线',
    dict: ['自动聚合', '关联路线'],
    default: 'auto',
    length: 20,
  })
  mode: string;

  @Column({ comment: '第几天', nullable: true })
  dayNo: number;

  @Column({ comment: '一句话 memo', length: 100, nullable: true })
  memo: string;

  @Column({ comment: '照片', length: 255, nullable: true })
  photo: string;

  @Column({
    comment: '状态 normal正常 refunded退票灰显',
    dict: ['正常', '已退款'],
    default: 'normal',
    length: 20,
  })
  status: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;
}
