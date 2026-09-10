import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSkuEntity } from '../entity/sku';

/**
 * SKU服务
 */
@Provide()
export class ProductSkuService extends BaseService {
  @InjectEntityModel(ProductSkuEntity)
  skuEntity: Repository<ProductSkuEntity>;

  /**
   * 添加SKU
   */
  async addSku(productId: number, data: any) {
    return await this.skuEntity.save({
      productId,
      attributes: data.attributes,
      price: data.price,
      stock: data.stock,
      skuCode: data.skuCode,
    });
  }

  /**
   * 获取商品的所有SKU
   */
  async getByProduct(productId: number) {
    return await this.skuEntity.find({ where: { productId } });
  }
}
