import { Column, Entity, Index } from 'typeorm';
import { BaseEntity, transformerJson } from '../../base/entity/base';

/** 民宿 */
@Entity('hotel')
export class HotelEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商家ID（归属标识）', nullable: true })
  merchantId: number;

  @Column({ comment: '民宿名称', length: 100 })
  name: string;

  @Column({ comment: '地址', length: 200 })
  address: string;

  @Column({ comment: '经度', type: 'decimal', precision: 10, scale: 6 })
  longitude: number;

  @Column({ comment: '纬度', type: 'decimal', precision: 10, scale: 6 })
  latitude: number;

  @Column({
    comment: '风格标签',
    type: 'json',
    nullable: true,
    transformer: transformerJson,
  })
  styleTags: string[];

  @Column({
    comment: '设施标签',
    type: 'json',
    nullable: true,
    transformer: transformerJson,
  })
  facilityTags: string[];

  @Column({ comment: '主图', length: 500, nullable: true })
  mainImage: string;

  @Column({
    comment: '图片集',
    type: 'json',
    nullable: true,
    transformer: transformerJson,
  })
  images: string[];

  @Column({ comment: '介绍', type: 'text', nullable: true })
  intro: string;

  @Column({ comment: '入住时间', length: 5, default: '14:00' })
  checkInTime: string;

  @Column({ comment: '离店时间', length: 5, default: '12:00' })
  checkOutTime: string;

  @Column({ comment: '宠物政策', length: 200, nullable: true })
  petPolicy: string;

  @Column({ comment: '是否含早餐', dict: ['不含早', '含早'], default: 0 })
  hasBreakfast: number;

  @Column({
    comment: '押金',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  deposit: number;

  @Column({
    comment: '评分',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 5.0,
  })
  rating: number;

  @Column({ comment: '评价数', default: 0 })
  reviewCount: number;

  @Column({ comment: '状态：1正常 0下架', dict: ['下架', '正常'], default: 1 })
  status: number;
}
