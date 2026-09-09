import { Column, Entity, Index } from 'typeorm';
import { BaseEntity, transformerJson } from '../../base/entity/base';

/** 房型 */
@Entity('room_type')
export class RoomTypeEntity extends BaseEntity {
  @Index()
  @Column({ comment: '民宿ID' })
  hotelId: number;

  @Column({ comment: '房型名称', length: 100 })
  name: string;

  @Column({ comment: '床型', length: 50, nullable: true })
  bedType: string;

  @Column({ comment: '面积(㎡)', nullable: true })
  area: number;

  @Column({ comment: '最多入住人数', default: 2 })
  maxGuests: number;

  @Column({ comment: '设施列表', type: 'json', nullable: true, transformer: transformerJson })
  facilities: string[];

  @Column({ comment: '基础价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '房间数量', default: 1 })
  stock: number;

  @Column({ comment: '房型图片', type: 'json', nullable: true, transformer: transformerJson })
  images: string[];

  @Column({ comment: '状态：1正常 0停用', dict: ['停用', '正常'], default: 1 })
  status: number;
}
