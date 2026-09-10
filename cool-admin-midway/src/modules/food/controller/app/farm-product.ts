import { Get, Inject, Query } from '@midwayjs/core';
import { CoolController, BaseController, CoolUrlTag, CoolTag, TagTypes } from '@cool-midway/core';
import { FarmProductService } from '../../service/farm-product';

/**
 * 农产品C端控制器
 */
@CoolUrlTag()
@CoolController('/app/food/farm-product')
export class AppFarmProductController extends BaseController {
  @Inject()
  farmProductService: FarmProductService;

  /**
   * 农产品分类
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/categories', { summary: '农产品分类' })
  async getCategories() {
    const categories = await this.farmProductService.getCategories();
    return this.ok(categories);
  }

  /**
   * 农产品列表
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '农产品列表' })
  async list(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('categoryId') categoryId?: number,
    @Query('keyword') keyword?: string,
    @Query('sort') sort?: string
  ) {
    const result = await this.farmProductService.getPublicList({
      page,
      size,
      categoryId,
      keyword,
      sort,
    });
    return this.ok(result);
  }

  /**
   * 农产品详情
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/detail', { summary: '农产品详情' })
  async getDetail(@Query('id') id: number) {
    const product = await this.farmProductService.getDetail(id);
    if (!product) {
      return this.fail('农产品不存在');
    }
    return this.ok(product);
  }
}
