import { CoolController, BaseController } from '@cool-midway/core';
import { RoomTypeEntity } from '../../entity/room-type';

@CoolController({
  api: ['add', 'delete', 'update', 'page', 'list', 'info'],
  entity: RoomTypeEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.hotelId'],
    keyWordLikeFields: ['a.name'],
  },
})
export class AdminAccommodationRoomTypeController extends BaseController {}
