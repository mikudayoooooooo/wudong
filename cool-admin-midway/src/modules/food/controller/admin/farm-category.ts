import { CoolController, BaseController } from '@cool-midway/core';
import { FarmProductCategoryEntity } from '../../entity/farm-category';

/**
 * 商家端-农产品分类管理
 */
@CoolController({
  prefix: '/admin/food/farm-category',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: FarmProductCategoryEntity,
})
export class AdminFarmCategoryController extends BaseController {}
