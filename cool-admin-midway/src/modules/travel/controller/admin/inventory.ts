import { CoolController, BaseController } from '@cool-midway/core';
import { TravelInventoryEntity } from '../../entity/inventory';

/**
 * 日期库存管理
 */
@CoolController({
  prefix: '/admin/travel/inventory',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: TravelInventoryEntity,
  pageQueryOp: {
    fieldEq: ['a.itemType', 'a.itemId', 'a.useDate'],
  },
})
export class AdminTravelInventoryController extends BaseController {}
