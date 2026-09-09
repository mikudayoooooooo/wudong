import { Column, Entity, Index } from 'typeorm';
import { BaseEntity, transformerTime } from '../../base/entity/base';

/** 平台公告 */
@Entity('announcement')
export class AnnouncementEntity extends BaseEntity {
  @Column({ comment: '标题', length: 200 })
  title: string;

  @Column({ comment: '内容', type: 'text' })
  content: string;

  @Column({ comment: '类型：1系统 2活动', dict: ['系统公告', '活动公告'], default: 1 })
  type: number;

  @Column({ comment: '生效开始时间', type: 'varchar', nullable: true, transformer: transformerTime })
  startTime: Date;

  @Column({ comment: '生效结束时间', type: 'varchar', nullable: true, transformer: transformerTime })
  endTime: Date;

  @Column({ comment: '是否置顶', dict: ['否', '是'], default: 0 })
  isTop: number;

  @Column({ comment: '状态：1发布 0草稿', dict: ['草稿', '发布'], default: 1 })
  status: number;

  @Column({ comment: '创建人ID', nullable: true })
  createdBy: number;
}
