import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategoryEntity } from '../entity/category';

/**
 * 商品分类服务
 */
@Provide()
export class ProductCategoryService extends BaseService {
  @InjectEntityModel(ProductCategoryEntity)
  categoryEntity: Repository<ProductCategoryEntity>;

  /**
   * 获取分类树
   */
  async tree() {
    const categories = await this.categoryEntity.find({
      where: { status: 1 },
      order: { sort: 'ASC' },
    });

    return this.buildTree(categories, 0);
  }

  /**
   * 构建树形结构
   */
  private buildTree(categories: any[], parentId: number) {
    const result = [];
    for (const cat of categories) {
      if (cat.parentId === parentId) {
        const children = this.buildTree(categories, cat.id);
        result.push({
          ...cat,
          children: children.length > 0 ? children : undefined,
        });
      }
    }
    return result;
  }
}
