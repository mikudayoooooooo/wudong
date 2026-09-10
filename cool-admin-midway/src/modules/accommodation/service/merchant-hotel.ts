import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { HotelEntity } from '../entity/hotel';
import { RoomTypeEntity } from '../entity/room-type';
import { MerchantScopeService } from './merchant-scope';

/** 可写字段白名单：不含 merchantId，归属只认登录身份（P5） */
const HOTEL_FIELDS = [
  'name',
  'address',
  'longitude',
  'latitude',
  'styleTags',
  'facilityTags',
  'mainImage',
  'images',
  'intro',
  'checkInTime',
  'checkOutTime',
  'petPolicy',
  'hasBreakfast',
  'deposit',
  'status',
];
const NUMERIC_FIELDS = [
  'longitude',
  'latitude',
  'hasBreakfast',
  'deposit',
  'status',
];
const JSON_FIELDS = ['styleTags', 'facilityTags', 'images'];

/** 商家自管民宿（P5 归属由登录身份决定；P6 有房型不可删） */
@Provide()
export class MerchantHotelService extends BaseService {
  @InjectEntityModel(HotelEntity)
  hotelEntity: Repository<HotelEntity>;

  @Inject()
  scopeService: MerchantScopeService;

  /**
   * 我的民宿分页：name 模糊 + status 精确，按 id 倒序
   * 注：方法名不能用 `page`——BaseService 已内置 page(query, option)，同名会触发 TS2416
   * （与控制器规避 BaseController 内置方法同一原因），故加 hotel 前缀。
   */
  async hotelPage(
    merchantId: number,
    query: any
  ): Promise<{ list: HotelEntity[]; total: number }> {
    const page = Math.max(Number(query?.page) || 1, 1);
    const size = Math.min(Math.max(Number(query?.size) || 10, 1), 50);
    const qb = this.hotelEntity
      .createQueryBuilder('a')
      .where('a.merchantId = :merchantId', { merchantId });

    const status = query?.status;
    if (status !== undefined && status !== null && status !== '') {
      qb.andWhere('a.status = :status', { status: Number(status) });
    }
    const name = String(query?.name ?? '').trim();
    if (name) {
      qb.andWhere('a.name LIKE :name', { name: `%${name}%` });
    }
    qb.orderBy('a.id', 'DESC')
      .skip((page - 1) * size)
      .take(size);

    const [list, total] = await qb.getManyAndCount();
    return { list, total };
  }

  @InjectEntityModel(RoomTypeEntity)
  roomTypeEntity: Repository<RoomTypeEntity>;

  /** 字段白名单过滤 + 类型归一：数字字段 Number()、数组字段校验后逐项 String()、字符串 trim */
  private pick(body: any): Partial<HotelEntity> {
    const out: any = {};
    for (const key of HOTEL_FIELDS) {
      const value = body?.[key];
      if (value === undefined || value === null) continue;
      if (NUMERIC_FIELDS.includes(key)) {
        const num = Number(value);
        if (Number.isNaN(num)) {
          throw new CoolCommException('民宿信息格式不正确');
        }
        out[key] = num;
      } else if (JSON_FIELDS.includes(key)) {
        if (!Array.isArray(value)) {
          throw new CoolCommException('标签格式不正确');
        }
        out[key] = value.map((v: unknown) => String(v));
      } else {
        out[key] = typeof value === 'string' ? value.trim() : value;
      }
    }
    return out;
  }

  /** 民宿详情（仅本人） */
  async hotelInfo(merchantId: number, id: number): Promise<HotelEntity> {
    return this.scopeService.requireOwnedHotel(merchantId, id);
  }

  /** 新增民宿：P4 模块校验 + P5 归属回写；rating/reviewCount 由实体默认值给出 */
  async hotelAdd(
    merchantId: number,
    module: string,
    body: any
  ): Promise<HotelEntity> {
    if (module !== 'accommodation') {
      throw new CoolCommException('您的入驻模块非住宿，无法新增民宿');
    }
    const data = this.pick(body);
    if (
      !data.name ||
      !data.address ||
      data.longitude === undefined ||
      data.latitude === undefined
    ) {
      throw new CoolCommException('请填写完整的民宿信息');
    }
    const hotel = new HotelEntity();
    Object.assign(hotel, data);
    hotel.merchantId = merchantId;
    await this.hotelEntity.save(hotel);
    return hotel;
  }

  /** 更新民宿：归属不可改（merchantId 不在白名单） */
  async hotelUpdate(merchantId: number, body: any): Promise<boolean> {
    const hotel = await this.scopeService.requireOwnedHotel(
      merchantId,
      body?.id
    );
    Object.assign(hotel, this.pick(body));
    await this.hotelEntity.save(hotel);
    return true;
  }

  /** 删除民宿：P6 有房型时拒绝 */
  async hotelRemove(merchantId: number, id: number): Promise<boolean> {
    const hotel = await this.scopeService.requireOwnedHotel(merchantId, id);
    const roomCount = await this.roomTypeEntity.countBy({ hotelId: hotel.id });
    if (roomCount > 0) {
      throw new CoolCommException('请先删除该民宿下的房型');
    }
    await this.hotelEntity.delete({ id: hotel.id });
    return true;
  }
}
