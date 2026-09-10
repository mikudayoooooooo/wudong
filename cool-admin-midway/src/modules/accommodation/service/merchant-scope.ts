import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantEntity } from '../../merchant/entity/merchant';
import { HotelEntity } from '../entity/hotel';
import { RoomTypeEntity } from '../entity/room-type';

/**
 * B 端数据归属校验（P2/P3）
 * 所有 B 端住宿接口的第一步：先确认调用者是正常商家，再确认资源属于他。
 * “不存在”与“非本人”一律同一文案，避免被用来探测他人资源是否存在。
 */
@Provide()
export class MerchantScopeService extends BaseService {
  @InjectEntityModel(MerchantEntity)
  merchantEntity: Repository<MerchantEntity>;

  @InjectEntityModel(HotelEntity)
  hotelEntity: Repository<HotelEntity>;

  @InjectEntityModel(RoomTypeEntity)
  roomTypeEntity: Repository<RoomTypeEntity>;

  /** P2：必须是 status=1 的商家 */
  async requireMerchant(userId: number): Promise<MerchantEntity> {
    const merchant = await this.merchantEntity.findOneBy({ userId });
    if (!merchant || merchant.status !== 1) {
      throw new CoolCommException('仅商家可访问');
    }
    return merchant;
  }

  /** P3：民宿必须属于该商家 */
  async requireOwnedHotel(
    merchantId: number,
    hotelId: number
  ): Promise<HotelEntity> {
    const id = Number(hotelId);
    const hotel = id ? await this.hotelEntity.findOneBy({ id }) : null;
    if (!hotel || Number(hotel.merchantId) !== Number(merchantId)) {
      throw new CoolCommException('无权操作该资源');
    }
    return hotel;
  }

  /** P3：房型必须属于该商家的民宿 */
  async requireOwnedRoomType(
    merchantId: number,
    roomTypeId: number
  ): Promise<RoomTypeEntity> {
    const id = Number(roomTypeId);
    const roomType = id ? await this.roomTypeEntity.findOneBy({ id }) : null;
    if (!roomType) {
      throw new CoolCommException('无权操作该资源');
    }
    const hotel = await this.hotelEntity.findOneBy({ id: roomType.hotelId });
    if (!hotel || Number(hotel.merchantId) !== Number(merchantId)) {
      throw new CoolCommException('无权操作该资源');
    }
    return roomType;
  }
}
