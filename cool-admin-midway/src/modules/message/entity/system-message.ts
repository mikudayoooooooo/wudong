import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 站内消息（userId 为 NULL 表示全员广播）
 */
@Entity('system_message')
export class SystemMessageEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID（NULL表示全员消息）', nullable: true })
  userId: number;

  @Column({
    comment: '消息类型 order/system/activity/interact',
    dict: ['订单', '系统', '活动', '互动'],
    default: 'system',
  })
  type: string;

  @Column({ comment: '消息标题', length: 200 })
  title: string;

  @Column({ comment: '消息内容', type: 'text' })
  content: string;

  @Column({ comment: '跳转类型', length: 20, nullable: true })
  linkType: string;

  @Column({ comment: '跳转地址', length: 500, nullable: true })
  linkValue: string;

  @Column({ comment: '是否已读 0未读 1已读', default: 0 })
  isRead: number;
}
