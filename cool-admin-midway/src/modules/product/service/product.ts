import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entity/product';
import { ProductSkuEntity } from '../entity/sku';
import { ProductImageEntity } from '../entity/image';
import { ReviewEntity } from '../entity/review';
import { FavoriteEntity } from '../entity/favorite';
import { MerchantService } from '../../merchant/service/merchant';

/**
 * 商品服务
 */
@Provide()
export class ProductService extends BaseService {
  @InjectEntityModel(ProductEntity)
  productEntity: Repository<ProductEntity>;

  @InjectEntityModel(ProductSkuEntity)
  productSkuEntity: Repository<ProductSkuEntity>;

  @InjectEntityModel(ProductImageEntity)
  productImageEntity: Repository<ProductImageEntity>;

  @InjectEntityModel(ReviewEntity)
  reviewEntity: Repository<ReviewEntity>;

  @InjectEntityModel(FavoriteEntity)
  favoriteEntity: Repository<FavoriteEntity>;

  @Inject()
  merchantService: MerchantService;

  /**
   * 创建商品（带SKU和图片）
   */
  async create(merchantId: number, data: any) {
    // 1. 验证商家权限
    const merchant = await this.merchantService.isMerchant(merchantId);
    if (!merchant || merchant.module !== 'product') {
      throw new CoolCommException('无权限或模块不匹配');
    }

    // 2. 创建商品主体
    const product = await this.productEntity.save({
      merchantId,
      categoryId: data.categoryId,
      name: data.name,
      coverImage: data.coverImage,
      price: data.price,
      stock: data.stock || 0,
      craftIntro: data.craftIntro,
      inheritorId: data.inheritorId,
      description: data.description,
      status: 0, // 默认下架
    });

    // 3. 批量创建SKU
    if (data.skus && data.skus.length > 0) {
      const skus = data.skus.map(sku => ({
        productId: product.id,
        attributes: sku.attributes,
        price: sku.price,
        stock: sku.stock,
        skuCode: sku.skuCode,
      }));
      await this.productSkuEntity.save(skus);
    }

    // 4. 批量创建图片
    if (data.images && data.images.length > 0) {
      const images = data.images.map((img, index) => ({
        productId: product.id,
        imageUrl: img,
        sort: index,
      }));
      await this.productImageEntity.save(images);
    }

    return product;
  }

  /**
   * 更新商品
   */
  async updateProduct(merchantId: number, productId: number, data: any) {
    // 验证商品归属
    const product = await this.productEntity.findOneBy({
      id: productId,
      merchantId,
    });
    if (!product) {
      throw new CoolCommException('商品不存在或无权限');
    }

    // 更新商品信息
    await this.productEntity.update(
      { id: productId },
      {
        categoryId: data.categoryId,
        name: data.name,
        coverImage: data.coverImage,
        price: data.price,
        stock: data.stock,
        craftIntro: data.craftIntro,
        inheritorId: data.inheritorId,
        description: data.description,
      }
    );

    return true;
  }

  /**
   * 上下架
   */
  async updateStatus(merchantId: number, productId: number, status: number) {
    const product = await this.productEntity.findOneBy({
      id: productId,
      merchantId,
    });
    if (!product) {
      throw new CoolCommException('商品不存在或无权限');
    }

    await this.productEntity.update({ id: productId }, { status });
    return true;
  }

  /**
   * 删除商品（验证权限）
   */
  async deleteProduct(merchantId: number, productId: number) {
    const product = await this.productEntity.findOneBy({
      id: productId,
      merchantId,
    });
    if (!product) {
      throw new CoolCommException('商品不存在或无权限');
    }

    // 删除商品
    await this.productEntity.delete({ id: productId });
    return true;
  }

  /**
   * C端：获取商品列表（仅显示上架商品）
   */
  async getPublicList(params: any) {
    const { page = 1, size = 10, categoryId, keyword, sort } = params;

    const query = this.productEntity
      .createQueryBuilder('product')
      .where('product.status = :status', { status: 1 }) // 只显示上架商品
      .leftJoinAndSelect('product.category', 'category')
      .select([
        'product.id',
        'product.name',
        'product.coverImage',
        'product.price',
        'product.sales',
        'product.createTime',
        'category.name',
      ]);

    // 分类筛选
    if (categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    // 关键词搜索
    if (keyword) {
      query.andWhere('product.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    // 排序
    switch (sort) {
      case 'price_asc':
        query.orderBy('product.price', 'ASC');
        break;
      case 'price_desc':
        query.orderBy('product.price', 'DESC');
        break;
      case 'sales_desc':
        query.orderBy('product.sales', 'DESC');
        break;
      case 'new':
      default:
        query.orderBy('product.createTime', 'DESC');
    }

    const [list, total] = await query
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();

    return {
      list,
      pagination: { page, size, total },
    };
  }

  /**
   * C端：获取商品详情
   */
  async getDetail(id: number) {
    const product = await this.productEntity
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .andWhere('product.status = :status', { status: 1 })
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.skus', 'skus')
      .getOne();

    if (!product) {
      return null;
    }

    // 增加浏览量（可选）
    await this.productEntity.increment({ id }, 'views', 1);

    return product;
  }

  /**
   * C端：收藏/取消收藏
   */
  async toggleFavorite(userId: number, productId: number) {
    const favorite = await this.favoriteEntity.findOne({
      where: { userId, productId },
    });

    if (favorite) {
      // 已收藏，取消收藏
      await this.favoriteEntity.delete({ id: favorite.id });
      return { action: 'unfavorite' };
    } else {
      // 未收藏，添加收藏
      await this.favoriteEntity.save({ userId, productId });
      return { action: 'favorite' };
    }
  }

  /**
   * C端：创建评价
   */
  async createReview(data: any) {
    const { userId, productId, orderId, rating, content, images } = data;

    // 检查是否已评价
    const existingReview = await this.reviewEntity.findOne({
      where: { userId, productId, orderId },
    });

    if (existingReview) {
      throw new CoolCommException('该订单已评价');
    }

    // 创建评价
    const review = await this.reviewEntity.save({
      userId,
      productId,
      orderId,
      rating,
      content,
      images: images ? JSON.stringify(images) : null,
    });

    // 更新商品评分
    await this.updateProductRating(productId);

    return review;
  }

  /**
   * 更新商品平均评分
   */
  private async updateProductRating(productId: number) {
    const result = await this.reviewEntity
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'avgRating')
      .addSelect('COUNT(review.id)', 'reviewCount')
      .where('review.productId = :productId', { productId })
      .getRawOne();

    await this.productEntity.update(
      { id: productId },
      {
        rating: result.avgRating || 0,
        reviewCount: result.reviewCount || 0,
      }
    );
  }

  /**
   * C端：获取评价列表
   */
  async getReviews(productId: number, page = 1, size = 10) {
    const [list, total] = await this.reviewEntity.findAndCount({
      where: { productId },
      order: { createTime: 'DESC' },
      skip: (page - 1) * size,
      take: size,
      relations: ['user'],
    });

    return {
      list: list.map(review => ({
        id: review.id,
        rating: review.rating,
        content: review.content,
        images: review.images ? JSON.parse(review.images) : [],
        createTime: review.createTime,
        user: {
          id: review.user.id,
          nickname: review.user.nickname,
          avatar: review.user.avatar,
        },
      })),
      pagination: { page, size, total },
    };
  }
}
