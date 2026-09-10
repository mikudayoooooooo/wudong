import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 社区互动消息（like/comment/follow；区别于公共 message 模块的系统消息）
 */
@Entity('community_message')
@Index(['userId', 'isRead'])
export class CommunityMessageEntity extends BaseEntity {
  @Column({ comment: '接收者用户ID' })
  userId: number;

  @Column({
    comment: '类型 like/comment/follow/system',
    length: 20,
    default: 'system',
  })
  type: string;

  @Column({ comment: '关联类型 post/comment/user', length: 20, nullable: true })
  refType: string;

  @Column({ comment: '关联ID', nullable: true })
  refId: number;

  @Column({ comment: '内容', length: 500 })
  content: string;

  @Column({ comment: '是否已读', default: 0 })
  isRead: number;
}
