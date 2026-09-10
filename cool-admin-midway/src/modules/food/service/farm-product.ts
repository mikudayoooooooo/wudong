import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { FarmProductEntity } from '../entity/farm-product';
import { FarmCategoryEntity } from '../entity/farm-category';
import { MerchantService } from '../../merchant/service/merchant';

/**
 * 农产品服务
 */
@Provide()
export class FarmProductService extends BaseService {
  @InjectEntityModel(FarmProductEntity)
  farmProductEntity: Repository<FarmProductEntity>;

  @InjectEntityModel(FarmCategoryEntity)
  farmCategoryEntity: Repository<FarmCategoryEntity>;

  @Inject()
  merchantService: MerchantService;

  /**
   * 创建农产品
   */
  async create(merchantId: number, data: any) {
    const merchant = await this.merchantService.isMerchant(merchantId);
    if (!merchant || merchant.module !== 'food') {
      throw new CoolCommException('无权限或模块不匹配');
    }

    return await this.farmProductEntity.save({
      merchantId,
      categoryId: data.categoryId,
      name: data.name,
      coverImage: data.coverImage,
      images: data.images,
      price: data.price,
      unit: data.unit,
      stock: data.stock,
      origin: data.origin,
      description: data.description,
    });
  }

  /**
   * 更新农产品
   */
  async updateProduct(merchantId: number, productId: number, data: any) {
    const product = await this.farmProductEntity.findOneBy({
      id: productId,
      merchantId,
    });
    if (!product) {
      throw new CoolCommException('农产品不存在或无权限');
    }

    await this.farmProductEntity.update(
      { id: productId },
      {
        categoryId: data.categoryId,
        name: data.name,
        coverImage: data.coverImage,
        images: data.images,
        price: data.price,
        unit: data.unit,
        stock: data.stock,
        origin: data.origin,
        description: data.description,
      }
    );

    return true;
  }

  /**
   * 上下架
   */
  async updateStatus(merchantId: number, productId: number, status: number) {
    const product = await this.farmProductEntity.findOneBy({
      id: productId,
      merchantId,
    });
    if (!product) {
      throw new CoolCommException('农产品不存在或无权限');
    }

    await this.farmProductEntity.update({ id: productId }, { status });
    return true;
  }

  /**
   * C端：获取农产品列表（仅显示上架商品）
   */
  async getPublicList(params: any) {
    const { page = 1, size = 10, categoryId, keyword, sort } = params;

    const query = this.farmProductEntity
      .createQueryBuilder('product')
      .where('product.status = :status', { status: 1 })
      .leftJoinAndSelect('product.category', 'category')
      .select([
        'product.id',
        'product.name',
        'product.coverImage',
        'product.price',
        'product.unit',
        'product.origin',
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
   * C端：获取农产品详情
   */
  async getDetail(id: number) {
    const product = await this.farmProductEntity
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .andWhere('product.status = :status', { status: 1 })
      .leftJoinAndSelect('product.category', 'category')
      .getOne();

    if (!product) {
      return null;
    }

    // 增加浏览量
    await this.farmProductEntity.increment({ id }, 'views', 1);

    return product;
  }

  /**
   * 获取农产品分类
   */
  async getCategories() {
    const categories = await this.farmCategoryEntity.find({
      where: { status: 1 },
      order: { sort: 'ASC', createTime: 'DESC' },
    });

    return categories;
  }
}
