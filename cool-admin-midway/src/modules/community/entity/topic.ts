import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 话题
 */
@Entity('community_topic')
export class CommunityTopicEntity extends BaseEntity {
  @Column({ comment: '名称 #xx', length: 50 })
  name: string;

  @Column({ comment: '简介', length: 200, nullable: true })
  intro: string;

  @Column({ comment: '浏览数', default: 0 })
  viewCount: number;

  @Column({ comment: '粉丝数', default: 0 })
  followerCount: number;

  @Column({ comment: '帖子数', default: 0 })
  postCount: number;

  @Column({ comment: '是否热门', default: 0 })
  isHot: number;

  @Column({ comment: '是否推荐', default: 0 })
  isRecommend: number;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '状态 1启用 0禁用', default: 1 })
  status: number;

  @Column({ comment: '绑定路线（JSON数组）', type: 'json', nullable: true })
  bindRouteIds: any;
}
