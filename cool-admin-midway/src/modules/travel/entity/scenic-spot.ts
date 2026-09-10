import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 景区/地点（type 为衣食住行预留：spot 景点 dining 餐饮 stay 住宿 experience 体验）
 */
@Entity('travel_scenic_spot')
export class TravelScenicSpotEntity extends BaseEntity {
  @Column({ comment: '名称', length: 100 })
  name: string;

  @Column({
    comment: '类型 spot景点 dining餐饮 stay住宿 experience体验',
    dict: ['景点', '餐饮', '住宿', '体验'],
    default: 'spot',
    length: 20,
  })
  type: string;

  @Column({ comment: '地址', length: 200, nullable: true })
  address: string;

  @Column({ comment: '经度', type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ comment: '纬度', type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ comment: '开放时间', length: 100, nullable: true })
  openTime: string;

  @Column({ comment: '简介', length: 500, nullable: true })
  intro: string;

  @Column({ comment: '主图', length: 255, nullable: true })
  mainImage: string;

  @Column({ comment: '状态 1启用 0禁用', default: 1 })
  status: number;
}
