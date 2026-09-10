import { CoolController, BaseController } from '@cool-midway/core';
import { BannerEntity } from '../../entity/banner';

/**
 * 轮播图管理
 */
@CoolController({
  prefix: '/admin/operate/banner',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: BannerEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.position'],
  },
})
export class AdminOperateBannerController extends BaseController {}
