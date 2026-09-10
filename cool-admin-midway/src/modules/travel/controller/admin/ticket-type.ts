import { CoolController, BaseController } from '@cool-midway/core';
import { TravelTicketTypeEntity } from '../../entity/ticket-type';

/**
 * 票种管理
 */
@CoolController({
  prefix: '/admin/travel/ticketType',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: TravelTicketTypeEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.scenicSpotId'],
    keyWordLikeFields: ['a.name'],
  },
})
export class AdminTravelTicketTypeController extends BaseController {}
