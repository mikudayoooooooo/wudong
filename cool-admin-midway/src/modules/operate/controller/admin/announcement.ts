import { CoolController, BaseController } from '@cool-midway/core';
import { AnnouncementEntity } from '../../entity/announcement';

/**
 * 公告管理
 */
@CoolController({
  prefix: '/admin/operate/announcement',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: AnnouncementEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.type'],
    keyWordLikeFields: ['a.title'],
  },
})
export class AdminOperateAnnouncementController extends BaseController {}
