import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 敏感词
 */
@Entity('sensitive_word')
export class SensitiveWordEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '敏感词', length: 50 })
  word: string;

  @Column({ comment: '状态 1启用 0禁用', dict: ['禁用', '启用'], default: 1 })
  status: number;
}
