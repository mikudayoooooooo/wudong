import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 举报
 */
@Entity('community_report')
export class CommunityReportEntity extends BaseEntity {
  @Column({ comment: '举报人' })
  userId: number;

  @Column({ comment: '目标类型 post/comment/user', length: 20 })
  targetType: string;

  @Column({ comment: '目标ID' })
  targetId: number;

  @Column({ comment: '理由', length: 500 })
  reason: string;

  @Column({
    comment: '状态 pending待处理 handled已处理 rejected已驳回',
    dict: ['待处理', '已处理', '已驳回'],
    default: 'pending',
    length: 20,
  })
  status: string;

  @Column({ comment: '处理结果', length: 500, nullable: true })
  handleResult: string;
}
