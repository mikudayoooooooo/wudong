import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectDataSource, InjectEntityModel } from '@midwayjs/typeorm';
import { DataSource, Equal, In, Repository } from 'typeorm';
import * as _ from 'lodash';
import * as moment from 'moment';
import { OrderEntity } from '../entity/order';
import { OrderProductEntity } from '../entity/order-product';
import { OrderReservationEntity } from '../entity/order-reservation';
import { OrderTicketEntity } from '../entity/order-ticket';
import { CartItemEntity } from '../../cart/entity/cart-item';
import { ProductEntity } from '../../product/entity/product';
import { FarmProductEntity } from '../../food/entity/farm-product';
import { UserAddressEntity } from '../../user/entity/address';

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
  1: [
    'productId',
    'skuId',
    'productName',
    'skuName',
    'productImage',
    'addressId',
  ],
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

  @InjectEntityModel(CartItemEntity)
  cartItemEntity: Repository<CartItemEntity>;

  @InjectEntityModel(ProductEntity)
  productEntity: Repository<ProductEntity>;

  @InjectEntityModel(FarmProductEntity)
  farmProductEntity: Repository<FarmProductEntity>;

  @InjectEntityModel(UserAddressEntity)
  userAddressEntity: Repository<UserAddressEntity>;

  @InjectDataSource()
  dataSource: DataSource;

  /**
   * 创建订单：主单 + 按 orderType 落对应明细，金额服务端汇总
   * merchantId 为可信归属参数：仅限业务模块服务端调用时传入（通用 C 端入口不得透传），
   * 归属正确性由调用模块自行解析，本服务不反查业务表（单向依赖）
   */
  async create(userId: number, param, merchantId?: number) {
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
    const mid = Number(merchantId);
    const ownerMerchantId =
      Number.isInteger(mid) && mid > 0 ? mid : null;

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
        merchantId: ownerMerchantId,
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

  /**
   * 从购物车创建订单
   */
  async createFromCart(userId: number, addressId: number, remark?: string) {
    // 1. 查询购物车
    const cartItems = await this.cartItemEntity.find({
      where: { userId },
    });

    if (cartItems.length === 0) {
      throw new CoolCommException('购物车为空');
    }

    // 2. 校验收货地址
    const address = await this.userAddressEntity.findOneBy({
      id: addressId,
      userId,
    });
    if (!address) {
      throw new CoolCommException('收货地址不存在');
    }

    // 3. 开启事务
    return await this.dataSource.transaction(async manager => {
      const orderItems = [];
      let totalAmount = 0;
      // 商家归属：购物车项全部同一商家则带归属，混合商家置空（平台视角）
      let ownerMerchantId: number | null = null;

      // 4. 逐项校验商品和库存
      for (const cartItem of cartItems) {
        let product: any;
        let tableName: string;

        if (cartItem.itemType === 1) {
          // 非遗商品
          product = await manager.findOneBy(ProductEntity, {
            id: cartItem.itemId,
          });
          tableName = 'product';
        } else if (cartItem.itemType === 2) {
          // 农产品
          product = await manager.findOneBy(FarmProductEntity, {
            id: cartItem.itemId,
          });
          tableName = 'farm_product';
        } else {
          throw new CoolCommException('购物车数据异常');
        }

        // 校验商品存在且上架
        if (!product || product.status !== 1) {
          throw new CoolCommException(`商品【${cartItem.itemName}】已下架`);
        }

        // 归属一致性：混合商家订单不带归属（null=平台视角）
        const itemMerchantId = Number(product.merchantId) || null;
        if (ownerMerchantId === null) {
          ownerMerchantId = itemMerchantId;
        } else if (
          itemMerchantId !== null &&
          itemMerchantId !== ownerMerchantId
        ) {
          ownerMerchantId = null;
        }

        // 校验库存
        if (product.stock < cartItem.quantity) {
          throw new CoolCommException(`商品【${cartItem.itemName}】库存不足`);
        }

        // 获取当前价格
        const currentPrice = Number(product.price);
        const snapshotPrice = Number(cartItem.price);

        // 检查价格变动（超过10%则提示）
        const priceChangePercent =
          Math.abs(currentPrice - snapshotPrice) / snapshotPrice;
        if (priceChangePercent > 0.1) {
          throw new CoolCommException(
            `商品【${cartItem.itemName}】价格变动较大，请重新确认`
          );
        }

        // 使用实时价格计算
        const itemTotal = currentPrice * cartItem.quantity;
        totalAmount += itemTotal;

        // 准备订单明细数据
        orderItems.push({
          productId: cartItem.itemId,
          skuId: 0, // 暂不支持SKU
          productName: product.name,
          skuName: null,
          productImage: product.coverImage,
          price: currentPrice,
          quantity: cartItem.quantity,
          totalAmount: Number(itemTotal.toFixed(2)),
          addressId: addressId,
          tableName, // 用于后续扣库存
        });
      }

      // 5. 创建订单主记录
      const orderNo = this.genOrderNo();
      const payAmount = Number(totalAmount.toFixed(2));

      const orderResult = await manager.insert(OrderEntity, {
        orderNo,
        userId,
        merchantId: ownerMerchantId,
        orderType: 1, // 商品订单
        module: 'product',
        totalAmount: payAmount,
        payAmount,
        discountAmount: 0,
        status: 1, // 待支付
        remark,
      });

      const orderId = orderResult.identifiers[0].id;

      // 6. 创建订单明细并扣减库存
      for (const item of orderItems) {
        const { tableName, ...orderItemData } = item;

        // 插入订单明细
        await manager.insert(OrderProductEntity, {
          orderId,
          ...orderItemData,
        });

        // 扣减库存（使用行锁防止超卖）
        const EntityClass =
          tableName === 'product' ? ProductEntity : FarmProductEntity;
        const updateResult = await manager
          .createQueryBuilder()
          .update(EntityClass)
          .set({ stock: () => `stock - ${item.quantity}` })
          .where('id = :id AND stock >= :quantity', {
            id: item.productId,
            quantity: item.quantity,
          })
          .execute();

        if (updateResult.affected === 0) {
          throw new CoolCommException(
            `商品【${item.productName}】库存不足或已下架`
          );
        }
      }

      // 7. 清空购物车
      await manager.delete(CartItemEntity, { userId });

      return { orderNo, payAmount };
    });
  }
}
