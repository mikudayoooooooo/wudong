import { BaseEntity } from '@cool-midway/core';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品评价实体
 */
@Entity('product_review')
export class ReviewEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '商品ID' })
  productId: number;

  @Column({ comment: '订单ID', nullable: true })
  orderId: number;

  @Column({ type: 'tinyint', comment: '评分（1-5）' })
  rating: number;

  @Column({ type: 'text', comment: '评价内容' })
  content: string;

  @Column({ type: 'text', comment: '评价图片（JSON数组）', nullable: true })
  images: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态：0-隐藏 1-显示' })
  status: number;
}
