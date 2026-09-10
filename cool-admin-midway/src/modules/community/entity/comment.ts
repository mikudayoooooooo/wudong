import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 评论（二级回复）
 */
@Entity('community_comment')
@Index(['postId'])
export class CommunityCommentEntity extends BaseEntity {
  @Column({ comment: '游记ID' })
  postId: number;

  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '内容（≤500字）', length: 500 })
  content: string;

  @Column({ comment: '父评论ID（二级回复）', nullable: true })
  parentId: number;

  @Column({ comment: '点赞数', default: 0 })
  likeCount: number;

  @Column({ comment: '状态 1显示 0隐藏', default: 1 })
  status: number;
}
