import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 消息模板：管理端维护，群发/定向发送时按 code 取用填充
 */
@Entity('message_template')
export class MessageTemplateEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '模板编码', length: 50 })
  code: string;

  @Column({ comment: '模板名称', length: 100 })
  name: string;

  @Column({
    comment: '消息类型 order/system/activity/interact',
    length: 20,
    default: 'system',
  })
  type: string;

  @Column({ comment: '标题模板（支持 {nickname} 等占位）', length: 200 })
  title: string;

  @Column({ comment: '内容模板（支持占位）', type: 'text' })
  content: string;

  @Column({ comment: '状态 1启用 0停用', default: 1 })
  status: number;
}
