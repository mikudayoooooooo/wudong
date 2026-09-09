import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 话题关注
 */
@Entity('community_topic_follow')
@Index(['topicId', 'userId'], { unique: true })
export class CommunityTopicFollowEntity extends BaseEntity {
  @Column({ comment: '话题ID' })
  topicId: number;

  @Column({ comment: '用户ID' })
  userId: number;
}
