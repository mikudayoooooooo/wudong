import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CartItemEntity } from '../entity/cart-item';
import { ProductEntity } from '../../product/entity/product';
import { FarmProductEntity } from '../../food/entity/farm-product';

/**
 * 购物车服务
 */
@Provide()
export class CartService extends BaseService {
  @InjectEntityModel(CartItemEntity)
  cartItemEntity: Repository<CartItemEntity>;

  @InjectEntityModel(ProductEntity)
  productEntity: Repository<ProductEntity>;

  @InjectEntityModel(FarmProductEntity)
  farmProductEntity: Repository<FarmProductEntity>;

  /**
   * 添加商品到购物车
   */
  async addItem(
    userId: number,
    itemType: number,
    itemId: number,
    quantity: number
  ) {
    // 校验商品类型
    if (![1, 2].includes(itemType)) {
      throw new CoolCommException('商品类型不正确');
    }

    // 校验数量
    const qty = Number(quantity);
    if (!(qty >= 1)) {
      throw new CoolCommException('数量必须大于0');
    }

    // 根据类型查询商品
    let product: any;
    if (itemType === 1) {
      product = await this.productEntity.findOneBy({
        id: itemId,
        status: 1, // 必须上架
      });
    } else {
      product = await this.farmProductEntity.findOneBy({
        id: itemId,
        status: 1,
      });
    }

    if (!product) {
      throw new CoolCommException('商品不存在或已下架');
    }

    // 检查库存（软检查，允许加购）
    if (product.stock < qty) {
      throw new CoolCommException('商品库存不足');
    }

    // 查询是否已存在购物车项
    const existing = await this.cartItemEntity.findOneBy({
      userId,
      itemType,
      itemId,
    });

    if (existing) {
      // 已存在，累加数量
      const newQuantity = existing.quantity + qty;
      if (product.stock < newQuantity) {
        throw new CoolCommException('商品库存不足');
      }
      await this.cartItemEntity.update(
        { id: existing.id },
        {
          quantity: newQuantity,
          // 更新快照（价格可能已变）
          itemName: product.name,
          price: Number(product.price),
          coverImage: product.coverImage,
        }
      );
      return this.cartItemEntity.findOneBy({ id: existing.id });
    } else {
      // 不存在，新增
      const cartItem = await this.cartItemEntity.save({
        userId,
        itemType,
        itemId,
        quantity: qty,
        itemName: product.name,
        price: Number(product.price),
        coverImage: product.coverImage,
      });
      return cartItem;
    }
  }

  /**
   * 更新购物车数量
   */
  async updateQuantity(userId: number, cartItemId: number, quantity: number) {
    const qty = Number(quantity);
    if (!(qty >= 1)) {
      throw new CoolCommException('数量必须大于0');
    }

    // 查询购物车项
    const cartItem = await this.cartItemEntity.findOneBy({
      id: cartItemId,
      userId,
    });
    if (!cartItem) {
      throw new CoolCommException('购物车项不存在');
    }

    // 查询商品当前库存
    let product: any;
    if (cartItem.itemType === 1) {
      product = await this.productEntity.findOneBy({ id: cartItem.itemId });
    } else {
      product = await this.farmProductEntity.findOneBy({
        id: cartItem.itemId,
      });
    }

    if (!product || product.status !== 1) {
      throw new CoolCommException('商品不存在或已下架');
    }

    if (product.stock < qty) {
      throw new CoolCommException('商品库存不足');
    }

    // 更新数量和快照
    await this.cartItemEntity.update(
      { id: cartItemId },
      {
        quantity: qty,
        itemName: product.name,
        price: Number(product.price),
        coverImage: product.coverImage,
      }
    );

    return true;
  }

  /**
   * 移除购物车项
   */
  async removeItem(userId: number, cartItemId: number) {
    const cartItem = await this.cartItemEntity.findOneBy({
      id: cartItemId,
      userId,
    });
    if (!cartItem) {
      throw new CoolCommException('购物车项不存在');
    }

    await this.cartItemEntity.delete({ id: cartItemId });
    return true;
  }

  /**
   * 查看我的购物车
   */
  async getMyCart(userId: number) {
    const cartItems = await this.cartItemEntity.find({
      where: { userId },
      order: { createTime: 'DESC' },
    });

    if (cartItems.length === 0) {
      return {
        items: [],
        totalAmount: 0,
        totalCount: 0,
      };
    }

    // 重新查询商品最新信息
    const items = [];
    let totalAmount = 0;
    let totalCount = 0;

    for (const item of cartItems) {
      let product: any;
      if (item.itemType === 1) {
        product = await this.productEntity.findOneBy({ id: item.itemId });
      } else {
        product = await this.farmProductEntity.findOneBy({ id: item.itemId });
      }

      const isAvailable = product && product.status === 1;
      const currentStock = product ? product.stock : 0;
      const currentPrice = product ? Number(product.price) : 0;

      items.push({
        id: item.id,
        itemType: item.itemType,
        itemId: item.itemId,
        itemName: item.itemName,
        price: Number(item.price), // 快照价格
        quantity: item.quantity,
        coverImage: item.coverImage,
        currentPrice, // 实时价格
        currentStock, // 实时库存
        isAvailable, // 是否可购买
      });

      // 只计算可用商品的总价
      if (isAvailable && currentStock >= item.quantity) {
        totalAmount += Number(item.price) * item.quantity;
        totalCount += item.quantity;
      }
    }

    return {
      items,
      totalAmount: Number(totalAmount.toFixed(2)),
      totalCount,
    };
  }

  /**
   * 清空购物车
   */
  async clearCart(userId: number) {
    await this.cartItemEntity.delete({ userId });
    return true;
  }

  /**
   * 获取购物车商品数量（角标用）
   */
  async getCartCount(userId: number) {
    const count = await this.cartItemEntity.count({ where: { userId } });
    return count;
  }
}
