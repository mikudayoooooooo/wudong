import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, In, Repository } from 'typeorm';
import { CartEntity } from '../entity/cart';

/**
 * 购物车
 */
@Provide()
export class CartService extends BaseService {
  @InjectEntityModel(CartEntity)
  cartEntity: Repository<CartEntity>;

  /**
   * 加入购物车：同用户同 SKU 数量累加
   */
  async addItem(
    userId: number,
    productId: number,
    skuId: number,
    quantity = 1
  ) {
    const qty = Number(quantity);
    if (!(qty >= 1)) {
      throw new CoolCommException('数量不正确');
    }
    const exist = await this.cartEntity.findOneBy({
      userId: Equal(userId),
      skuId: Equal(skuId),
    });
    if (exist) {
      await this.cartEntity.update(
        { id: exist.id },
        { quantity: exist.quantity + qty, checked: 1 }
      );
      return exist.id;
    }
    const inserted = await this.cartEntity.insert({
      userId,
      productId,
      skuId,
      quantity: qty,
      checked: 1,
    });
    return inserted.identifiers[0].id;
  }

  /**
   * 修改数量/勾选（仅本人）
   */
  async updateItem(userId: number, id: number, param) {
    const item = await this.cartEntity.findOneBy({
      id: Equal(id),
      userId: Equal(userId),
    });
    if (!item) {
      throw new CoolCommException('购物车项不存在');
    }
    const data: Record<string, any> = {};
    if (param.quantity !== undefined && param.quantity !== null) {
      const qty = Number(param.quantity);
      if (!(qty >= 1)) {
        throw new CoolCommException('数量不正确');
      }
      data.quantity = qty;
    }
    if (param.checked !== undefined && param.checked !== null) {
      data.checked = param.checked ? 1 : 0;
    }
    if (Object.keys(data).length === 0) {
      throw new CoolCommException('无可更新的字段');
    }
    await this.cartEntity.update({ id: item.id }, data);
    return true;
  }

  /**
   * 删除（仅本人）
   */
  async removeItem(userId: number, ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new CoolCommException('请选择要删除的购物车项');
    }
    const ret = await this.cartEntity.delete({
      id: In(ids),
      userId: Equal(userId),
    });
    if (!ret.affected) {
      throw new CoolCommException('购物车项不存在');
    }
    return true;
  }

  /**
   * 我的购物车分页
   */
  async pageList(userId: number, page = 1, size = 10) {
    const qb = this.cartEntity
      .createQueryBuilder('a')
      .where('a.userId = :userId', { userId })
      .orderBy('a.id', 'DESC');
    const pageNo = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(size) || 10, 1);
    qb.skip((pageNo - 1) * pageSize).take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total };
  }
}
