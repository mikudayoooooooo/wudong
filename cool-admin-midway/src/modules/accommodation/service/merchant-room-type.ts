import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { RoomTypeEntity } from '../entity/room-type';
import { RoomCalendarEntity } from '../entity/room-calendar';
import { MerchantScopeService } from './merchant-scope';
import { pickFields } from './merchant-field';

/** 可写字段白名单：不含 hotelId，房型不能改挂到别的人民宿 */
const ROOM_FIELDS = [
  'name',
  'bedType',
  'area',
  'maxGuests',
  'facilities',
  'price',
  'stock',
  'images',
  'status',
];
const NUMERIC_FIELDS = ['area', 'maxGuests', 'price', 'stock', 'status'];
const JSON_FIELDS = ['facilities', 'images'];

/** 商家自管房型（P7 删房型级联清房态） */
@Provide()
export class MerchantRoomTypeService extends BaseService {
  @InjectEntityModel(RoomTypeEntity)
  roomTypeEntity: Repository<RoomTypeEntity>;

  @InjectEntityModel(RoomCalendarEntity)
  roomCalendarEntity: Repository<RoomCalendarEntity>;

  @Inject()
  scopeService: MerchantScopeService;

  /** 字段白名单过滤 + 类型归一（与民宿共用 `pickFields`） */
  private pick(body: any): Partial<RoomTypeEntity> {
    return pickFields(body, {
      fields: ROOM_FIELDS,
      numeric: NUMERIC_FIELDS,
      json: JSON_FIELDS,
      numberError: '房型信息格式不正确',
    });
  }

  /** 某民宿的房型分页（必须先确认民宿归属） */
  async roomTypePage(
    merchantId: number,
    query: any
  ): Promise<{ list: RoomTypeEntity[]; total: number }> {
    if (!query?.hotelId) {
      throw new CoolCommException('请指定民宿');
    }
    const hotel = await this.scopeService.requireOwnedHotel(
      merchantId,
      query.hotelId
    );

    const page = Math.max(Number(query?.page) || 1, 1);
    const size = Math.min(Math.max(Number(query?.size) || 20, 1), 50);
    const qb = this.roomTypeEntity
      .createQueryBuilder('a')
      .where('a.hotelId = :hotelId', { hotelId: hotel.id });

    const status = query?.status;
    if (status !== undefined && status !== null && status !== '') {
      qb.andWhere('a.status = :status', { status: Number(status) });
    }
    const name = String(query?.name ?? '').trim();
    if (name) {
      qb.andWhere('a.name LIKE :name', { name: `%${name}%` });
    }
    qb.orderBy('a.id', 'ASC')
      .skip((page - 1) * size)
      .take(size);

    const [list, total] = await qb.getManyAndCount();
    return { list, total };
  }

  /** 新增房型 */
  async roomTypeAdd(merchantId: number, body: any): Promise<RoomTypeEntity> {
    const hotel = await this.scopeService.requireOwnedHotel(
      merchantId,
      body?.hotelId
    );
    const data = this.pick(body);
    if (!data.name || data.price === undefined) {
      throw new CoolCommException('请填写完整的房型信息');
    }
    if (Number(data.price) <= 0) {
      throw new CoolCommException('房型价格必须大于 0');
    }
    if (data.stock !== undefined && Number(data.stock) < 1) {
      throw new CoolCommException('房间数量至少为 1');
    }
    const roomType = new RoomTypeEntity();
    Object.assign(roomType, data);
    roomType.hotelId = hotel.id;
    await this.roomTypeEntity.save(roomType);
    return roomType;
  }

  /** 更新房型 */
  async roomTypeUpdate(merchantId: number, body: any): Promise<boolean> {
    const roomType = await this.scopeService.requireOwnedRoomType(
      merchantId,
      body?.id
    );
    Object.assign(roomType, this.pick(body));
    if (Number(roomType.price) <= 0) {
      throw new CoolCommException('房型价格必须大于 0');
    }
    if (Number(roomType.stock) < 1) {
      throw new CoolCommException('房间数量至少为 1');
    }
    await this.roomTypeEntity.save(roomType);
    return true;
  }

  /** 删除房型：P7 先清该房型的房态记录（二者无外键，需显式级联） */
  async roomTypeRemove(merchantId: number, id: number): Promise<boolean> {
    const roomType = await this.scopeService.requireOwnedRoomType(
      merchantId,
      id
    );
    await this.roomCalendarEntity.delete({ roomTypeId: roomType.id });
    await this.roomTypeEntity.delete({ id: roomType.id });
    return true;
  }
}
