import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { HotelEntity } from '../entity/hotel';
import { MerchantScopeService } from './merchant-scope';

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
}
