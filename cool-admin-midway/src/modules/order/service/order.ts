import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import {
  InjectDataSource,
  InjectEntityModel,
} from '@midwayjs/typeorm';
import { DataSource, Equal, In, Repository } from 'typeorm';
import * as _ from 'lodash';
import * as moment from 'moment';
import { OrderEntity } from '../entity/order';
import { OrderProductEntity } from '../entity/order-product';
import { OrderReservationEntity } from '../entity/order-reservation';
import { OrderTicketEntity } from '../entity/order-ticket';

/** 模块与订单类型白名单：模块 → 允许的 orderType */
const MODULE_TYPES = {
  product: [1],
  food: [2],
  accommodation: [3],
  travel: [4, 5],
};

/** 订单类型 → 明细实体 */
const TYPE_DETAIL = {
  1: OrderProductEntity,
  2: OrderReservationEntity,
  3: OrderReservationEntity,
  4: OrderTicketEntity,
  5: OrderTicketEntity,
};

/** 各明细类型可写入的快照字段白名单 */
const DETAIL_FIELDS = {
  1: ['productId', 'skuId', 'productName', 'skuName', 'productImage', 'addressId'],
  2: [
    'targetId',
    'targetName',
    'checkInDate',
    'checkOutDate',
    'guestName',
    'guestPhone',
    'guestCount',
    'idCard',
    'timeSlot',
    'roomTypeId',
    'specialRequest',
  ],
  3: [
    'targetId',
    'targetName',
    'checkInDate',
    'checkOutDate',
    'guestName',
    'guestPhone',
    'guestCount',
    'idCard',
    'timeSlot',
    'roomTypeId',
    'specialRequest',
  ],
  4: ['targetId', 'targetName', 'ticketName', 'useDate', 'visitorInfo'],
  5: ['targetId', 'targetName', 'ticketName', 'useDate', 'visitorInfo'],
};

/**
 * 统一订单
 * 说明：价格/库存的业务校验由各业务模块在下单链路前置完成后调用本服务；
 * 本服务只负责主单+明细落库与服务端金额汇总，不反查业务表（单向依赖）。
 */
@Provide()
export class OrderService extends BaseService {
  @InjectEntityModel(OrderEntity)
  orderEntity: Repository<OrderEntity>;

  @InjectEntityModel(OrderProductEntity)
  orderProductEntity: Repository<OrderProductEntity>;

  @InjectEntityModel(OrderReservationEntity)
  orderReservationEntity: Repository<OrderReservationEntity>;

  @InjectEntityModel(OrderTicketEntity)
  orderTicketEntity: Repository<OrderTicketEntity>;

  @InjectDataSource()
  dataSource: DataSource;

  /**
   * 创建订单：主单 + 按 orderType 落对应明细，金额服务端汇总
   */
  async create(userId: number, param) {
    const { module, orderType, remark, items } = param || {};
    if (!MODULE_TYPES[module]) {
      throw new CoolCommException('订单模块不正确');
    }
    const type = Number(orderType);
    if (!MODULE_TYPES[module].includes(type)) {
      throw new CoolCommException('订单类型与模块不匹配');
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new CoolCommException('订单明细不能为空');
    }

    let sum = 0;
    const details = [];
    for (const it of items) {
      const price = Number(it?.price);
      const quantity = Number(it?.quantity);
      if (!(price > 0) || !(quantity >= 1)) {
        throw new CoolCommException('订单明细的单价或数量不正确');
      }
      sum += price * quantity;
      const detail = _.pick(it, DETAIL_FIELDS[type]);
      if (type === 2 || type === 3) {
        detail['reservationType'] = type;
      }
      if (type === 4 || type === 5) {
        detail['ticketType'] = type === 4 ? 1 : 2;
      }
      details.push({
        ...detail,
        price,
        quantity,
        totalAmount: Number((price * quantity).toFixed(2)),
      });
    }

    const orderNo = this.genOrderNo();
    const payAmount = Number(sum.toFixed(2));
    await this.dataSource.transaction(async manager => {
      const inserted = await manager.insert(OrderEntity, {
        orderNo,
        userId,
        orderType: type,
        module,
        totalAmount: payAmount,
        payAmount,
        discountAmount: 0,
        status: 1,
        remark,
      });
      const orderId = inserted.identifiers[0].id;
      for (const detail of details) {
        await manager.insert(TYPE_DETAIL[type], { ...detail, orderId });
      }
    });
    return { orderNo, payAmount };
  }

  /**
   * 订单号：YYYYMMDDHHmmssSSS + 4位随机
   */
  genOrderNo() {
    return `${moment().format('YYYYMMDDHHmmssSSS')}${Math.floor(
      1000 + Math.random() * 9000
    )}`;
  }

  /**
   * 我的订单分页（id 倒序，status 可选过滤）
   */
  async pageList(userId: number, status?: number, page = 1, size = 10) {
    const qb = this.orderEntity
      .createQueryBuilder('a')
      .where('a.userId = :userId', { userId })
      .orderBy('a.id', 'DESC');
    if (status) {
      qb.andWhere('a.status = :status', { status });
    }
    const pageNo = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(size) || 10, 1);
    qb.skip((pageNo - 1) * pageSize).take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total };
  }

  /**
   * 订单详情：主单 + 明细快照
   */
  async getByNo(userId: number, orderNo: string) {
    const order = await this.orderEntity.findOneBy({
      orderNo: Equal(orderNo),
      userId: Equal(userId),
    });
    if (!order) {
      throw new CoolCommException('订单不存在');
    }
    const detailEntity = TYPE_DETAIL[order.orderType];
    const items = await this.dataSource
      .getRepository(detailEntity)
      .find({ where: { orderId: Equal(order.id) }, order: { id: 'ASC' } });
    return { ...order, items };
  }

  /**
   * 取消订单（仅待支付）
   */
  async cancel(userId: number, orderNo: string) {
    const order = await this.orderEntity.findOneBy({
      orderNo: Equal(orderNo),
      userId: Equal(userId),
    });
    if (!order) {
      throw new CoolCommException('订单不存在');
    }
    if (order.status !== 1) {
      throw new CoolCommException('仅待支付订单可取消');
    }
    await this.orderEntity.update(
      { id: order.id },
      { status: 4, cancelTime: new Date() }
    );
    return true;
  }

  /**
   * 标记已支付（供 pay 模块回调）：仅待支付可置
   */
  async markPaid(orderNo: string) {
    const ret = await this.orderEntity.update(
      { orderNo: Equal(orderNo), status: 1 },
      { status: 2, payTime: new Date() }
    );
    if (!ret.affected) {
      throw new CoolCommException('订单不存在或状态已变化');
    }
    return true;
  }

  /**
   * 标记已退款（供业务模块退票/退款流程调用）：已支付/已完成可置
   */
  async markRefunded(orderNo: string) {
    const ret = await this.orderEntity.update(
      { orderNo: Equal(orderNo), status: In([2, 3]) },
      { status: 5 }
    );
    if (!ret.affected) {
      throw new CoolCommException('订单不存在或状态已变化');
    }
    return true;
  }
}
