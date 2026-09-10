import {
  BaseController,
  CoolController,
  CoolTag,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TravelReviewEntity } from '../../entity/review';
import { OrderEntity } from '../../../order/entity/order';

/**
 * C端评价：列表匿名，发布需登录（校验订单归属）
 */
@CoolUrlTag()
@CoolController()
export class AppTravelReviewController extends BaseController {
  @InjectEntityModel(TravelReviewEntity)
  reviewEntity: Repository<TravelReviewEntity>;

  @InjectEntityModel(OrderEntity)
  orderEntity: Repository<OrderEntity>;

  @Inject()
  ctx;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '评价列表' })
  async pageList(
    @Query('targetType') targetType: string,
    @Query('targetId') targetId: number
  ) {
    const list = await this.reviewEntity.find({
      where: { targetType, targetId: Number(targetId), status: 1 },
      order: { id: 'DESC' },
    });
    return this.ok(list);
  }

  @Post('/add', { summary: '发布评价' })
  async addItem(@Body() body) {
    const userId = this.ctx.user.id;
    const targetType = String(body?.targetType);
    const targetId = Number(body?.targetId);
    const rating = Number(body?.rating);
    if (!['scenic', 'route'].includes(targetType)) {
      return this.fail('评价目标类型不正确');
    }
    if (!(rating >= 1 && rating <= 5)) {
      return this.fail('评分需为 1-5');
    }
    let orderId = null;
    if (body?.orderNo) {
      const order = await this.orderEntity.findOneBy({
        orderNo: String(body.orderNo),
        userId,
      });
      if (!order) return this.fail('订单不存在');
      orderId = order.id;
    }
    const row = await this.reviewEntity.save({
      orderId,
      targetType,
      targetId,
      userId,
      rating,
      content: String(body?.content || '').slice(0, 1000),
      images: Array.isArray(body?.images) ? body.images : [],
      status: 1,
    } as any);
    return this.ok({ id: row.id });
  }
}
