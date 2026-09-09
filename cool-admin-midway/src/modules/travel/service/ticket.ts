import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TravelETicketEntity } from '../entity/e-ticket';
import { TravelInventoryEntity } from '../entity/inventory';
import { OrderEntity } from '../../order/entity/order';
import { OrderService } from '../../order/service/order';
import { PayService } from '../../pay/service/pay';
import { PaymentRecordEntity } from '../../pay/entity/record';

/** 退票手续费比例（文档 9.6：使用日期前 24h 可退，扣 10% 手续费） */
const REFUND_FEE_RATE = 0.1;

/**
 * 电子票：我的票卡与退票
 */
@Provide()
export class TravelTicketService extends BaseService {
  @InjectEntityModel(TravelETicketEntity)
  eTicketEntity: Repository<TravelETicketEntity>;

  @InjectEntityModel(TravelInventoryEntity)
  inventoryEntity: Repository<TravelInventoryEntity>;

  @InjectEntityModel(OrderEntity)
  orderEntity: Repository<OrderEntity>;

  @InjectEntityModel(PaymentRecordEntity)
  paymentRecordEntity: Repository<PaymentRecordEntity>;

  @Inject()
  orderService: OrderService;

  @Inject()
  payService: PayService;

  /** 我的电子票（附订单状态） */
  async my(userId: number) {
    const tickets = await this.eTicketEntity.find({
      where: { userId },
      order: { id: 'DESC' },
    });
    const orderNos = [...new Set(tickets.map((t) => t.orderNo))];
    const orders = orderNos.length
      ? await this.orderEntity
          .createQueryBuilder()
          .where('orderNo IN (:...nos)', { nos: orderNos })
          .getMany()
      : [];
    const orderMap = new Map(orders.map((o) => [o.orderNo, o]));
    return tickets.map((t) => {
      const o = orderMap.get(t.orderNo);
      return {
        ...t,
        orderStatus: o?.status,
        payAmount: o?.payAmount,
        // 未支付订单的票不可核销，展示为待支付
        effectiveStatus:
          t.status === 'unused' && o?.status !== 2 && o?.status !== 3
            ? 'unpaid'
            : t.status,
      };
    });
  }

  /**
   * 按订单整单退票：使用日期前 24h 可退，扣 10% 手续费
   * 票置 refunded → 库存回补 → 订单置已退款 → 支付流水退款
   */
  async refund(userId: number, orderNo: string) {
    const order = await this.orderEntity.findOneBy({ orderNo });
    if (!order || order.userId !== userId) {
      throw new CoolCommException('订单不存在');
    }
    if (![2, 3].includes(order.status)) {
      throw new CoolCommException('仅已支付订单可退');
    }
    const tickets = await this.eTicketEntity.find({
      where: { orderNo, userId },
    });
    if (!tickets.length) throw new CoolCommException('订单下无电子票');
    // 已核销的票不可退（整单存在任一核销即拒绝）
    if (tickets.some((t) => t.status === 'used')) {
      throw new CoolCommException('已核销的票不可退');
    }
    // 24h 规则：使用日期 00:00（东八区）距现在不足 24h 则不可退
    const deadline = Date.now() + 24 * 3600 * 1000;
    for (const t of tickets) {
      if (new Date(`${t.useDate}T00:00:00+08:00`).getTime() < deadline) {
        throw new CoolCommException('距使用日期不足 24 小时，不可退');
      }
    }

    // 票置 refunded
    await this.eTicketEntity.update(
      { orderNo, userId },
      { status: 'refunded' }
    );
    // 库存回补（按 itemType/itemId/useDate 分组）
    const groups = new Map<string, { itemType: string; itemId: number; useDate: string; n: number }>();
    for (const t of tickets) {
      const key = `${t.itemType}:${t.itemId}:${t.useDate}`;
      const g = groups.get(key) || { ...t, n: 0 };
      g.n += 1;
      groups.set(key, g);
    }
    for (const g of groups.values()) {
      await this.inventoryEntity
        .createQueryBuilder()
        .update(TravelInventoryEntity)
        .set({ sold: () => `sold - ${g.n}` })
        .where(
          'itemType = :itemType AND itemId = :itemId AND useDate = :useDate AND sold >= :n',
          { itemType: g.itemType, itemId: g.itemId, useDate: g.useDate, n: g.n }
        )
        .execute();
    }
    // 订单置已退款（内部流转，非 HTTP）
    await this.orderService.markRefunded(orderNo);
    // 支付流水退款（扣 10% 手续费）；无已支付流水不阻断主流程
    const refundAmount = Number(
      (Number(order.payAmount) * (1 - REFUND_FEE_RATE)).toFixed(2)
    );
    const paid = await this.paymentRecordEntity.findOneBy({
      orderId: order.id,
      payStatus: 2,
    });
    if (paid) {
      await this.payService.refund(paid.paymentNo, refundAmount);
    }
    return { refundAmount: paid ? refundAmount : 0, ticketCount: tickets.length };
  }
}
