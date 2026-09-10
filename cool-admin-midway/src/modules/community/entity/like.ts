import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 点赞
 */
@Entity('community_like')
@Index(['userId', 'targetType', 'targetId'], { unique: true })
export class CommunityLikeEntity extends BaseEntity {
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '目标类型 post/comment', length: 20 })
  targetType: string;

  @Column({ comment: '目标ID' })
  targetId: number;
}
