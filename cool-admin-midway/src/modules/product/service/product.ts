import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entity/product';
import { ProductSkuEntity } from '../entity/sku';
import { ProductImageEntity } from '../entity/image';
import { ReviewEntity } from '../entity/review';
import { MemberFavoriteService } from '../../member/service/favorite';
import { MerchantService } from '../../merchant/service/merchant';
import { ProductCategoryEntity } from '../entity/category';
import { MemberUserEntity } from '../../member/entity/user';

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

  @InjectEntityModel(ProductCategoryEntity)
  productCategoryEntity: Repository<ProductCategoryEntity>;

  @InjectEntityModel(ReviewEntity)
  reviewEntity: Repository<ReviewEntity>;


  @InjectEntityModel(MemberUserEntity)
  memberUserEntity: Repository<MemberUserEntity>;

  @Inject()
  merchantService: MerchantService;

  @Inject()
  memberFavoriteService: MemberFavoriteService;

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
      .where('product.status = :status', { status: 1 });

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

    // 补分类名（实体无关系定义，手动组装）
    const cids = [...new Set(list.map((p) => p.categoryId).filter(Boolean))];
    const cats = cids.length
      ? await this.productCategoryEntity
          .createQueryBuilder()
          .where('id IN (:...ids)', { ids: cids })
          .getMany()
      : [];
    const cmap = new Map(cats.map((c) => [c.id, c.name]));

    return {
      list: list.map((p) => ({ ...p, categoryName: cmap.get(p.categoryId) })),
      pagination: { page, size, total },
    };
  }

  /**
   * C端：获取商品详情
   */
  async getDetail(id: number) {
    const product = await this.productEntity.findOneBy({ id, status: 1 });
    if (!product) {
      return null;
    }

    const images = await this.productImageEntity.find({
      where: { productId: id },
      order: { sort: 'ASC' },
    });
    const skus = await this.productSkuEntity.find({
      where: { productId: id },
    });
    const cat = product.categoryId
      ? await this.productCategoryEntity.findOneBy({ id: product.categoryId })
      : null;

    return {
      ...product,
      images: images.map((i) => i.imageUrl),
      skus,
      categoryName: cat?.name,
    };
  }

  /**
   * C端：收藏/取消收藏（复用 base member 收藏，targetType='product'）
   */
  async toggleFavorite(userId: number, productId: number) {
    return this.memberFavoriteService.toggle(userId, 'product', productId);
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
    });
    // 评价作者信息：按 userId 查 member_user（无物理外键，逻辑关联）
    const uids = [...new Set(list.map((r) => r.userId))];
    const users = uids.length
      ? await this.memberUserEntity
          .createQueryBuilder()
          .where('id IN (:...ids)', { ids: uids })
          .getMany()
      : [];
    const umap = new Map(users.map((u) => [u.id, u]));

    return {
      list: list.map(review => {
        const u = umap.get(review.userId);
        return {
          id: review.id,
          rating: review.rating,
          content: review.content,
          images: review.images ? JSON.parse(review.images) : [],
          createTime: review.createTime,
          user: {
            id: review.userId,
            nickname: u?.nickname || '游客',
            avatar: u?.avatar || '👤',
          },
        };
      }),
      pagination: { page, size, total },
    };
  }
}
