import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 餐厅
 */
@Entity('restaurant')
export class RestaurantEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商家ID' })
  merchantId: number;

  @Column({ comment: '餐厅名称', length: 100 })
  name: string;

  @Column({ comment: '封面图', length: 500 })
  coverImage: string;

  @Column({
    comment: '餐厅图片JSON',
    type: 'json',
    nullable: true,
    transformer: transformerJson,
  })
  images: object;

  @Column({ comment: '地址', length: 200 })
  address: string;

  @Column({
    comment: '经度',
    type: 'decimal',
    precision: 10,
    scale: 7,
    default: 0,
  })
  longitude: number;

  @Column({
    comment: '纬度',
    type: 'decimal',
    precision: 10,
    scale: 7,
    default: 0,
  })
  latitude: number;

  @Column({ comment: '联系电话', length: 20 })
  phone: string;

  @Column({ comment: '营业时间', length: 100, nullable: true })
  businessHours: string;

  @Column({
    comment: '人均消费',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  avgPrice: number;

  @Column({ comment: '特色菜品', type: 'text', nullable: true })
  specialty: string;

  @Column({ comment: '餐厅介绍', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '状态', dict: ['禁用', '正常'], default: 1 })
  status: number;
}
