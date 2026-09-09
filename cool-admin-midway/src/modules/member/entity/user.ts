import { BaseEntity, transformerTime } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * C端用户
 */
@Entity('member_user')
export class MemberUserEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '手机号', length: 11 })
  phone: string;

  @Column({ comment: '密码（bcrypt）', length: 100, nullable: true })
  password: string;

  @Column({ comment: '昵称', length: 50, nullable: true })
  nickname: string;

  @Column({ comment: '头像', length: 500, nullable: true })
  avatar: string;

  @Column({ comment: '性别', dict: ['未知', '男', '女'], default: 0 })
  gender: number;

  @Column({ comment: '个人简介', length: 200, nullable: true })
  bio: string;

  @Column({ comment: '状态', dict: ['禁用', '正常'], default: 1 })
  status: number;

  @Column({
    comment: '最后登录时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  lastLoginTime: Date;
}
