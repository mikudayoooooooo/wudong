import { BaseEntity, transformerTime } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商家
 */
@Entity('merchant')
export class MerchantEntity extends BaseEntity {
  @Index()
  @Column({ comment: '关联用户ID' })
  userId: number;

  @Index({ unique: true })
  @Column({ comment: '商家账号', length: 50 })
  username: string;

  @Column({ comment: '店铺名称', length: 100 })
  shopName: string;

  @Column({
    comment: '所属模块 product/food/accommodation/travel',
    length: 20,
  })
  module: string;

  @Column({ comment: '联系人', length: 50 })
  contactName: string;

  @Column({ comment: '联系电话', length: 11 })
  contactPhone: string;

  @Column({ comment: '身份证号', length: 18, nullable: true })
  idCard: string;

  @Column({ comment: '营业执照URL', length: 500, nullable: true })
  businessLicense: string;

  @Column({ comment: '状态 1正常 0禁用', dict: ['禁用', '正常'], default: 1 })
  status: number;

  @Column({
    comment: '入驻时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  joinedAt: Date;
}
