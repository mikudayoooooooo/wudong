import { BaseEntity, transformerTime } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商家入驻申请
 */
@Entity('merchant_application')
export class MerchantApplicationEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '店铺名称', length: 100 })
  shopName: string;

  @Column({ comment: '申请模块 product/food/accommodation/travel', length: 20 })
  module: string;

  @Column({ comment: '联系人', length: 50 })
  contactName: string;

  @Column({ comment: '联系电话', length: 11 })
  contactPhone: string;

  @Column({ comment: '身份证号', length: 18 })
  idCard: string;

  @Column({ comment: '身份证正面', length: 500 })
  idCardFront: string;

  @Column({ comment: '身份证反面', length: 500 })
  idCardBack: string;

  @Column({ comment: '营业执照', length: 500 })
  businessLicense: string;

  @Column({ comment: '其他材料（JSON数组）', type: 'json', nullable: true })
  otherMaterials: any;

  @Column({
    comment: '状态 1待审核 2已通过 3已驳回',
    dict: ['待审核', '已通过', '已驳回'],
    default: 1,
  })
  status: number;

  @Column({ comment: '审核意见', length: 500, nullable: true })
  auditResult: string;

  @Column({ comment: '审核人ID', nullable: true })
  auditBy: number;

  @Column({
    comment: '审核时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  auditTime: Date;
}
