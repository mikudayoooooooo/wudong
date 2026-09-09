import { BaseEntity, transformerTime } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 公告
 */
@Entity('announcement')
export class AnnouncementEntity extends BaseEntity {
  @Column({ comment: '标题', length: 200 })
  title: string;

  @Column({ comment: '内容', type: 'text' })
  content: string;

  @Column({ comment: '类型 1系统公告 2活动公告', dict: ['系统', '活动'], default: 1 })
  type: number;

  @Column({
    comment: '开始时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  startTime: Date;

  @Column({
    comment: '结束时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  endTime: Date;

  @Column({ comment: '是否置顶 1是 0否', default: 0 })
  isTop: number;

  @Column({ comment: '状态 1发布 0草稿', dict: ['草稿', '发布'], default: 1 })
  status: number;

  @Column({ comment: '创建人ID' })
  createdBy: number;
}
