import { CoolController, BaseController } from '@cool-midway/core';
import { HotelEntity } from '../../entity/hotel';

@CoolController({
  api: ['add', 'delete', 'update', 'page', 'list', 'info'],
  entity: HotelEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.merchantId'],
    keyWordLikeFields: ['a.name', 'a.address'],
  },
})
export class AdminAccommodationHotelController extends BaseController {}
