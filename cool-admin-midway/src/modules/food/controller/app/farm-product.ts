import { Body, Get, Inject, Post, Provide, Query } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { FarmProductService } from '../../service/farm-product';
import { Context } from '@midwayjs/koa';

/**
 * 农产品C端控制器
 */
@Provide()
@CoolController('/app/food/farm-product')
export class AppFarmProductController extends BaseController {
  @Inject()
  farmProductService: FarmProductService;

  @Inject()
  ctx: Context;

  /**
   * 农产品列表
   */
  @Get('/list', { summary: '农产品列表' })
  async list(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('categoryId') categoryId?: number,
    @Query('keyword') keyword?: string,
    @Query('sort') sort?: string // price_asc, price_desc, sales_desc, new
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
  @Get('/:id', { summary: '农产品详情' })
  async info(@Query('id') id: number) {
    const product = await this.farmProductService.getDetail(id);
    if (!product) {
      return this.fail('农产品不存在');
    }
    return this.ok(product);
  }

  /**
   * 获取农产品分类
   */
  @Get('/categories', { summary: '农产品分类' })
  async getCategories() {
    const categories = await this.farmProductService.getCategories();
    return this.ok(categories);
  }
}
