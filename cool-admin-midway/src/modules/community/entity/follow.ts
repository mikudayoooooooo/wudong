import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 用户关注
 */
@Entity('community_follow')
@Index(['userId', 'followingId'], { unique: true })
export class CommunityFollowEntity extends BaseEntity {
  @Column({ comment: '关注人（发起方）' })
  userId: number;

  @Column({ comment: '被关注人' })
  followingId: number;
}
