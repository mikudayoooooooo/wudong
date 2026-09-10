import { Body, Get, Inject, Param, Post, Provide, Query } from '@midwayjs/core';
import { BaseController, CoolController, CoolTag, CoolUrlTag, TagTypes } from '@cool-midway/core';
import { ProductService } from '../../service/product';
import { ProductCategoryService } from '../../service/category';
import { Context } from '@midwayjs/koa';

/**
 * 商品C端控制器
 */
@Provide()
@CoolUrlTag()
@CoolController('/app/product')
export class AppProductController extends BaseController {
  @Inject()
  productService: ProductService;

  @Inject()
  categoryService: ProductCategoryService;

  @Inject()
  ctx: Context;

  /**
   * 获取商品分类
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/categories', { summary: '获取商品分类' })
    async getCategories() {
    const categories = await this.categoryService.tree();
    return this.ok(categories);
  }

  /**
   * 商品列表
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '商品列表' })
    async list(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('categoryId') categoryId?: number,
    @Query('keyword') keyword?: string,
    @Query('sort') sort?: string // price_asc, price_desc, sales_desc, new
  ) {
    const result = await this.productService.getPublicList({
      page,
      size,
      categoryId,
      keyword,
      sort,
    });
    return this.ok(result);
  }

  /**
   * 商品详情
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/:id', { summary: '商品详情' })
    async infoItem(@Param('id') id: number) {
    const product = await this.productService.getDetail(Number(id));
    if (!product) {
      return this.fail('商品不存在');
    }
    return this.ok(product);
  }

  /**
   * 商品评价列表（匿名）
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  /**
   * 收藏商品
   */
  @Post('/:id/favorite', { summary: '收藏商品' })
  async favorite(@Param('id') id: number) {
    const userId = this.ctx.user?.id;
    if (!userId) {
      return this.fail('请先登录');
    }
    await this.productService.toggleFavorite(userId, Number(id));
    return this.ok('操作成功');
  }

  /**
   * 发布评价
   */
  @Post('/review', { summary: '发布评价' })
  async createReview(@Body() body: any) {
    const userId = this.ctx.user?.id;
    if (!userId) {
      return this.fail('请先登录');
    }

    const { productId, orderId, rating, content, images } = body;

    // 验证必填字段
    if (!productId || !rating || !content) {
      return this.fail('商品ID、评分和内容不能为空');
    }

    await this.productService.createReview({
      userId,
      productId,
      orderId,
      rating,
      content,
      images,
    });

    return this.ok('评价成功');
  }

  /**
   * 评价列表
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/:id/reviews', { summary: '商品评价列表' })
    async getReviews(
    @Param('id') id: number,
    @Query('page') page = 1,
    @Query('size') size = 10
  ) {
    const result = await this.productService.getReviews(Number(id), page, size);
    return this.ok(result);
  }
}
