import { Get, Inject, Query } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { ProductSkuEntity } from '../../entity/sku';
import { ProductSkuService } from '../../service/sku';

/**
 * 商家端-SKU管理
 */
@CoolController({
  prefix: '/admin/product/sku',
  api: ['list', 'info', 'add', 'update', 'delete'],
  entity: ProductSkuEntity,
})
export class AdminProductSkuController extends BaseController {
  @Inject()
  productSkuService: ProductSkuService;

  /**
   * 获取商品SKU列表
   */
  @Get('/byProduct', { summary: '获取商品SKU列表' })
  async byProduct(@Query('productId') productId: number) {
    return this.ok(await this.productSkuService.getByProduct(productId));
  }
}
