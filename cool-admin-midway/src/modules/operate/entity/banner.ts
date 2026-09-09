import { Column, Entity, Index } from 'typeorm';
import { BaseEntity, transformerTime } from '../../base/entity/base';

/** 首页轮播/横幅 */
@Entity('banner')
export class BannerEntity extends BaseEntity {
  @Column({ comment: '标题', length: 100 })
  title: string;

  @Column({ comment: '图片URL', length: 500 })
  image: string;

  @Column({ comment: '跳转类型', length: 20, default: 'none' })
  linkType: string;

  @Column({ comment: '跳转地址', length: 500, nullable: true })
  linkValue: string;

  @Index()
  @Column({ comment: '位置：home/product/food/accommodation等', length: 20 })
  position: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({
    comment: '生效开始时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  startTime: Date;

  @Column({
    comment: '生效结束时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  endTime: Date;

  @Column({ comment: '状态：1启用 0禁用', dict: ['禁用', '启用'], default: 1 })
  status: number;
}
