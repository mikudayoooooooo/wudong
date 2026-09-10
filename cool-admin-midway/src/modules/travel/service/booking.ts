import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TravelETicketEntity } from '../entity/e-ticket';
import { TravelInventoryEntity } from '../entity/inventory';
import { TravelRoutePackageEntity } from '../entity/route-package';
import { TravelScenicSpotEntity } from '../entity/scenic-spot';
import { TravelTicketTypeEntity } from '../entity/ticket-type';
import { OrderService } from '../../order/service/order';
import { OrderEntity } from '../../order/entity/order';

/**
 * 下单（行模块业务前置）：
 * 服务端查价（不信任前端）→ 库存原子扣减 → 调公共 OrderService（module='travel'）→ 下单即出票
 */
@Provide()
export class TravelBookingService extends BaseService {
  @InjectEntityModel(TravelInventoryEntity)
  inventoryEntity: Repository<TravelInventoryEntity>;

  @InjectEntityModel(TravelTicketTypeEntity)
  ticketTypeEntity: Repository<TravelTicketTypeEntity>;

  @InjectEntityModel(TravelScenicSpotEntity)
  scenicSpotEntity: Repository<TravelScenicSpotEntity>;

  @InjectEntityModel(TravelRoutePackageEntity)
  routePackageEntity: Repository<TravelRoutePackageEntity>;

  @InjectEntityModel(TravelETicketEntity)
  eTicketEntity: Repository<TravelETicketEntity>;

  @InjectEntityModel(OrderEntity)
  orderEntity: Repository<OrderEntity>;

  @Inject()
  orderService: OrderService;

  /**
   * 创建预订
   * @param param itemType(ticket/route) itemId useDate quantity visitors?
   */
  async create(userId: number, param) {
    const itemType = String(param?.itemType);
    const itemId = Number(param?.itemId);
    const useDate = String(param?.useDate || '');
    const quantity = Number(param?.quantity);
    if (!['ticket', 'route'].includes(itemType)) {
      throw new CoolCommException('预订类型不正确');
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 9) {
      throw new CoolCommException('数量需为 1-9 的整数');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(useDate)) {
      throw new CoolCommException('使用日期格式不正确');
    }
    // 文档 9.6：最少提前 1 天预订（使用日期必须晚于今天）
    const today = new Date().toISOString().slice(0, 10);
    if (useDate <= today) {
      throw new CoolCommException('请至少提前 1 天预订');
    }

    // 服务端查价与快照信息拼装
    let price: number;
    let targetName: string;
    let ticketName: string;
    if (itemType === 'ticket') {
      const tt = await this.ticketTypeEntity.findOneBy({
        id: itemId,
        status: 1,
      });
      if (!tt) throw new CoolCommException('票种不存在或已下架');
      const spot = await this.scenicSpotEntity.findOneBy({
        id: tt.scenicSpotId,
      });
      price = Number(tt.price);
      targetName = spot?.name || '景区门票';
      ticketName = tt.name;
    } else {
      const rp = await this.routePackageEntity.findOneBy({
        id: itemId,
        status: 1,
      });
      if (!rp) throw new CoolCommException('路线不存在或已下架');
      price = Number(rp.price);
      targetName = rp.title;
      ticketName = `${rp.days}天行程套餐`;
    }

    // 库存原子扣减（影响行数为 0 即余票不足）
    const dec = await this.inventoryEntity
      .createQueryBuilder()
      .update(TravelInventoryEntity)
      .set({ sold: () => `sold + ${quantity}` })
      .where(
        'itemType = :itemType AND itemId = :itemId AND useDate = :useDate AND total - sold >= :q',
        { itemType, itemId, useDate, q: quantity }
      )
      .execute();
    if (!dec.affected) {
      throw new CoolCommException('该日期余票不足');
    }

    // 公共订单（失败回补库存）
    let orderNo: string;
    let payAmount: number;
    try {
      const r = await this.orderService.create(userId, {
        module: 'travel',
        orderType: itemType === 'ticket' ? 4 : 5,
        items: [
          {
            targetId: itemId,
            targetName,
            ticketName,
            useDate,
            price,
            quantity,
            visitorInfo: Array.isArray(param?.visitors)
              ? param.visitors
              : [],
          },
        ],
      });
      orderNo = r.orderNo;
      payAmount = r.payAmount;
    } catch (err) {
      await this.inventoryEntity
        .createQueryBuilder()
        .update(TravelInventoryEntity)
        .set({ sold: () => `sold - ${quantity}` })
        .where('itemType = :itemType AND itemId = :itemId AND useDate = :useDate', {
          itemType,
          itemId,
          useDate,
        })
        .execute();
      throw err;
    }

    // 下单即出票（核销时校验订单已支付）
    const order = await this.orderEntity.findOneBy({ orderNo });
    const ticketIds: number[] = [];
    for (let i = 0; i < quantity; i++) {
      const row = await this.eTicketEntity.insert({
        orderId: order?.id,
        orderNo,
        userId,
        itemType,
        itemId,
        useDate,
        qrCode: `TK${orderNo}${String(i + 1).padStart(2, '0')}`,
        status: 'unused',
      });
      ticketIds.push(row.identifiers[0].id as number);
    }

    return { orderNo, payAmount, ticketIds };
  }
}
