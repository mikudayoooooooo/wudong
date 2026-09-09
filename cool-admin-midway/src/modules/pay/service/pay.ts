import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import * as moment from 'moment';
import { OrderEntity } from '../../order/entity/order';
import { OrderService } from '../../order/service/order';
import { PaymentRecordEntity } from '../entity/record';

/**
 * 统一支付（模拟）
 * 接真实微信支付时只替换 mockPay 的内部实现（下单→回调），对上层透明
 */
@Provide()
export class PayService extends BaseService {
  @InjectEntityModel(PaymentRecordEntity)
  paymentRecordEntity: Repository<PaymentRecordEntity>;

  @InjectEntityModel(OrderEntity)
  orderEntity: Repository<OrderEntity>;

  @Inject()
  orderService: OrderService;

  /**
   * 创建支付单：校验归属与待支付状态；同订单已有待支付流水则幂等复用
   */
  async create(userId: number, orderNo: string, channel: string) {
    if (!['wechat', 'alipay'].includes(channel)) {
      throw new CoolCommException('支付渠道不正确');
    }
    const order = await this.orderEntity.findOneBy({
      orderNo: Equal(orderNo),
      userId: Equal(userId),
    });
    if (!order) {
      throw new CoolCommException('订单不存在');
    }
    if (order.status !== 1) {
      throw new CoolCommException('订单当前状态不可支付');
    }
    const pending = await this.paymentRecordEntity.findOneBy({
      orderId: order.id,
      payStatus: 1,
    });
    if (pending) {
      return { paymentNo: pending.paymentNo };
    }
    const paymentNo = this.genPaymentNo();
    await this.paymentRecordEntity.insert({
      orderId: order.id,
      paymentNo,
      payChannel: channel,
      payAmount: Number(order.payAmount),
      payStatus: 1,
    });
    return { paymentNo };
  }

  /**
   * 模拟支付成功：流水置已支付 → 订单置已支付
   */
  async mockPay(paymentNo: string) {
    const record = await this.paymentRecordEntity.findOneBy({
      paymentNo: Equal(paymentNo),
    });
    if (!record) {
      throw new CoolCommException('支付单不存在');
    }
    if (record.payStatus !== 1) {
      throw new CoolCommException('支付单当前状态不可支付');
    }
    const order = await this.orderEntity.findOneBy({
      id: Equal(record.orderId),
    });
    if (!order || order.status !== 1) {
      throw new CoolCommException('订单已取消或状态已变化');
    }
    await this.paymentRecordEntity.update(
      { id: record.id },
      {
        payStatus: 2,
        payTime: new Date(),
        transactionId: `MOCK${paymentNo}`,
      }
    );
    await this.orderService.markPaid(order.orderNo);
    return true;
  }

  /**
   * 退款：流水置已退款；订单状态由业务模块调 OrderService.markRefunded
   */
  async refund(paymentNo: string, amount: number) {
    const record = await this.paymentRecordEntity.findOneBy({
      paymentNo: Equal(paymentNo),
    });
    if (!record) {
      throw new CoolCommException('支付单不存在');
    }
    if (record.payStatus !== 2) {
      throw new CoolCommException('仅已支付的支付单可退款');
    }
    const amt = Number(amount);
    if (!(amt > 0) || amt > Number(record.payAmount)) {
      throw new CoolCommException('退款金额不正确');
    }
    await this.paymentRecordEntity.update(
      { id: record.id },
      { payStatus: 3, refundTime: new Date(), refundAmount: amt }
    );
    return true;
  }

  /**
   * 本人订单的支付流水
   */
  async records(userId: number, orderNo: string) {
    const order = await this.orderEntity.findOneBy({
      orderNo: Equal(orderNo),
      userId: Equal(userId),
    });
    if (!order) {
      throw new CoolCommException('订单不存在');
    }
    return this.paymentRecordEntity.find({
      where: { orderId: order.id },
      order: { id: 'DESC' },
    });
  }

  /**
   * 支付流水号：PAY + YYYYMMDDHHmmssSSS + 4位随机
   */
  genPaymentNo() {
    return `PAY${moment().format('YYYYMMDDHHmmssSSS')}${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  }
}
