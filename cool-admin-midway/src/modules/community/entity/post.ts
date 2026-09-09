import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 游记帖子
 */
@Entity('community_post')
@Index(['status', 'userId'])
export class CommunityPostEntity extends BaseEntity {
  @Column({ comment: '作者用户ID' })
  userId: number;

  @Column({ comment: '标题', length: 200 })
  title: string;

  @Column({ comment: '正文（≤5000字）', type: 'text' })
  content: string;

  @Column({ comment: '图片（JSON数组≤9）', type: 'json', nullable: true })
  images: any;

  @Column({ comment: '视频地址', length: 255, nullable: true })
  videoUrl: string;

  @Column({ comment: '视频时长秒（≤60）', nullable: true })
  videoDuration: number;

  @Column({ comment: '关联路线ID（模式B）', nullable: true })
  linkedRouteId: number;

  @Column({ comment: '话题ID（JSON数组）', type: 'json', nullable: true })
  topicIds: any;

  @Column({ comment: '浏览数', default: 0 })
  viewCount: number;

  @Column({ comment: '点赞数', default: 0 })
  likeCount: number;

  @Column({ comment: '评论数', default: 0 })
  commentCount: number;

  @Column({ comment: '收藏数', default: 0 })
  favoriteCount: number;

  @Column({
    comment: '状态 pending审核中 normal正常 offline已下架',
    dict: ['审核中', '正常', '已下架'],
    default: 'pending',
    length: 20,
  })
  status: string;

  @Column({ comment: '审核理由', length: 200, nullable: true })
  auditReason: string;
}
