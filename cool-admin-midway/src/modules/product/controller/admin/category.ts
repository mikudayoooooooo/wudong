import { Get, Inject } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { ProductCategoryEntity } from '../../entity/category';
import { ProductCategoryService } from '../../service/category';

/**
 * 商家端-商品分类管理
 */
@CoolController({
  prefix: '/admin/product/category',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: ProductCategoryEntity,
})
export class AdminProductCategoryController extends BaseController {
  @Inject()
  productCategoryService: ProductCategoryService;

  /**
   * 分类树
   */
  @Get('/tree', { summary: '分类树' })
  async tree() {
    return this.ok(await this.productCategoryService.tree());
  }
}
