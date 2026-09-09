import { BaseEntity, transformerTime } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 轮播图
 */
@Entity('banner')
export class BannerEntity extends BaseEntity {
  @Column({ comment: '标题', length: 100 })
  title: string;

  @Column({ comment: '图片URL', length: 500 })
  image: string;

  @Column({ comment: '跳转类型 page/url/none', length: 20, default: 'none' })
  linkType: string;

  @Column({ comment: '跳转地址', length: 500, nullable: true })
  linkValue: string;

  @Index()
  @Column({ comment: '位置 home/product/food等', length: 20 })
  position: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({
    comment: '开始时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  startTime: Date;

  @Column({
    comment: '结束时间',
    type: 'varchar',
    nullable: true,
    transformer: transformerTime,
  })
  endTime: Date;

  @Column({ comment: '状态 1启用 0禁用', dict: ['禁用', '启用'], default: 1 })
  status: number;
}
