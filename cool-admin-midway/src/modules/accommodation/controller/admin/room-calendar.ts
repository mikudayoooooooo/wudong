import { CoolController, BaseController } from '@cool-midway/core';
import { RoomCalendarEntity } from '../../entity/room-calendar';

@CoolController({
  api: ['page', 'info', 'delete'],
  entity: RoomCalendarEntity,
  pageQueryOp: {
    fieldEq: ['a.roomTypeId', 'a.status'],
  },
})
export class AdminAccommodationRoomCalendarController extends BaseController {}
