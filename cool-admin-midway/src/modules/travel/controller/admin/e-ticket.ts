import { BaseController, CoolController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TravelETicketEntity } from '../../entity/e-ticket';
import { OrderEntity } from '../../../order/entity/order';

/**
 * 电子票管理（核销扫码/手动输码）
 */
@CoolController({
  prefix: '/admin/travel/eTicket',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: TravelETicketEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.itemType', 'a.userId', 'a.orderNo'],
    keyWordLikeFields: ['a.qrCode'],
  },
})
export class AdminTravelETicketController extends BaseController {
  @InjectEntityModel(TravelETicketEntity)
  eTicketEntity: Repository<TravelETicketEntity>;

  @InjectEntityModel(OrderEntity)
  orderEntity: Repository<OrderEntity>;

  @Inject()
  ctx;

  /**
   * 核销：unused → used；需所属订单已支付（订单状态 2/3）
   */
  @Post('/verify', { summary: '核销电子票' })
  async verify(@Body() body) {
    const ticket = body?.id
      ? await this.eTicketEntity.findOneBy({ id: Number(body.id) })
      : await this.eTicketEntity.findOneBy({
          qrCode: String(body?.qrCode || ''),
        });
    if (!ticket) return this.fail('电子票不存在');
    if (ticket.status === 'used') return this.fail('该票已核销');
    if (ticket.status === 'refunded') return this.fail('该票已退款');
    const order = await this.orderEntity.findOneBy({ orderNo: ticket.orderNo });
    if (!order || ![2, 3].includes(order.status)) {
      return this.fail('订单未支付，不可核销');
    }
    await this.eTicketEntity.update(
      { id: ticket.id },
      { status: 'used', verifyTime: new Date(), verifyAdminId: this.ctx.user.id }
    );
    return this.ok({ id: ticket.id, qrCode: ticket.qrCode });
  }
}
