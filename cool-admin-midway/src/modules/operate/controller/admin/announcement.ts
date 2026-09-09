import { CoolController, BaseController } from '@cool-midway/core';
import { AnnouncementEntity } from '../../entity/announcement';

@CoolController({
  api: ['add', 'delete', 'update', 'page', 'list', 'info'],
  entity: AnnouncementEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.type'],
    keyWordLikeFields: ['a.title'],
  },
})
export class AdminOperateAnnouncementController extends BaseController {}
