import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 收藏（行/社区模块共用）
 */
@Entity('user_favorite')
@Index('uk_user_target', ['userId', 'targetType', 'targetId'], { unique: true })
export class MemberFavoriteEntity extends BaseEntity {
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({
    comment: '目标类型',
    dict: ['景区', '路线', '攻略', '游记'],
    length: 20,
  })
  targetType: string;

  @Column({ comment: '目标ID' })
  targetId: number;
}
