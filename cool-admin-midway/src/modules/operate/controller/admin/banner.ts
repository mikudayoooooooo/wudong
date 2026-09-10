import { CoolController, BaseController } from '@cool-midway/core';
import { BannerEntity } from '../../entity/banner';

@CoolController({
  api: ['add', 'delete', 'update', 'page', 'list', 'info'],
  entity: BannerEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.position'],
    keyWordLikeFields: ['a.title'],
  },
})
export class AdminOperateBannerController extends BaseController {}
