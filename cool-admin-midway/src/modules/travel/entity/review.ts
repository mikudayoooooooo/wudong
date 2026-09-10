import { BaseEntity, transformerTime } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 评价（行模块：景区/路线）
 */
@Entity('travel_review')
@Index(['targetType', 'targetId'])
export class TravelReviewEntity extends BaseEntity {
  @Column({ comment: '订单ID', nullable: true })
  orderId: number;

  @Column({ comment: '评价目标类型 scenic/route', length: 20 })
  targetType: string;

  @Column({ comment: '评价目标ID' })
  targetId: number;

  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '评分 1-5', default: 5 })
  rating: number;

  @Column({ comment: '内容', length: 1000, nullable: true })
  content: string;

  @Column({ comment: '图片（JSON数组）', type: 'json', nullable: true })
  images: any;

  @Column({ comment: '商家回复', length: 500, nullable: true })
  merchantReply: string;

  @Column({
    comment: '回复时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  replyTime: Date;

  @Column({ comment: '状态 1显示 0隐藏', default: 1 })
  status: number;
}
