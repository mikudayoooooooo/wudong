import { BaseEntity, transformerTime } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 模拟短信验证码
 */
@Entity('member_sms_code')
export class MemberSmsCodeEntity extends BaseEntity {
  @Index()
  @Column({ comment: '手机号', length: 11 })
  phone: string;

  @Column({ comment: '验证码', length: 10 })
  code: string;

  @Column({
    comment: '过期时间',
    type: 'varchar',
    transformer: transformerTime,
  })
  expireTime: Date;

  @Column({ comment: '是否已使用 0未使用 1已使用', default: 0 })
  used: number;
}
