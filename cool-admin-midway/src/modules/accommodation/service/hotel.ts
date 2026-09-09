import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { HotelEntity } from '../entity/hotel';
import { RoomTypeEntity } from '../entity/room-type';

/**
 * C 端民宿浏览（搜索/详情）
 */
@Provide()
export class AccommodationHotelService extends BaseService {
  @InjectEntityModel(HotelEntity)
  hotelEntity: Repository<HotelEntity>;

  @InjectEntityModel(RoomTypeEntity)
  roomTypeEntity: Repository<RoomTypeEntity>;

  /**
   * 搜索：status=1 + 标签/评分/关键字，价格用"启用房型最低基础价"做 JS 端过滤（数据量小，
   * 避免 groupBy+having 的 TypeORM 歧义）；minPrice 附在每个结果上。
   */
  async search(query: {
    keyword?: string; styleTags?: string; facilityTags?: string;
    minPrice?: number; maxPrice?: number; rating?: number;
    sort?: string; page?: number; size?: number;
  }) {
    const qb = this.hotelEntity.createQueryBuilder('a').where('a.status = 1');
    if (query.keyword) {
      qb.andWhere('(a.name LIKE :kw OR a.address LIKE :kw)', { kw: `%${query.keyword}%` });
    }
    if (query.styleTags) {
      qb.andWhere('JSON_CONTAINS(a.styleTags, :tag)', { tag: JSON.stringify(query.styleTags) });
    }
    if (query.facilityTags) {
      qb.andWhere('JSON_CONTAINS(a.facilityTags, :fac)', { fac: JSON.stringify(query.facilityTags) });
    }
    if (query.rating) {
      qb.andWhere('a.rating >= :rating', { rating: query.rating });
    }
    if (query.sort === 'rating') {
      qb.orderBy('a.rating', 'DESC');
    } else if (query.sort !== 'price' && query.sort !== 'priceDesc') {
      qb.orderBy('a.id', 'DESC');
    }

    const all = await qb.getMany();
    // 房型最低价 map
    const minMap: Record<number, any> = {};
    if (all.length) {
      const raws: any = await this.roomTypeEntity
        .createQueryBuilder('rt')
        .select('rt.hotelId', 'hotelId')
        .addSelect('MIN(rt.price)', 'minPrice')
        .where('rt.status = 1')
        .andWhere('rt.hotelId IN (:...ids)', { ids: all.map((h: any) => h.id) })
        .groupBy('rt.hotelId')
        .getRawMany();
      for (const r of raws) minMap[Number(r.hotelId)] = r.minPrice;
    }

    const hasPriceFilter = query.minPrice != null || query.maxPrice != null;
    let rows: any[] = all.map((h: any) => ({ ...h, minPrice: minMap[h.id] ?? null }));
    if (hasPriceFilter) {
      rows = rows.filter((h) => {
        if (h.minPrice == null) return false;
        const p = Number(h.minPrice);
        if (query.minPrice != null && p < Number(query.minPrice)) return false;
        if (query.maxPrice != null && p > Number(query.maxPrice)) return false;
        return true;
      });
    }
    if (query.sort === 'price') {
      rows.sort((a, b) => (Number(a.minPrice) || 0) - (Number(b.minPrice) || 0));
    } else if (query.sort === 'priceDesc') {
      rows.sort((a, b) => (Number(b.minPrice) || 0) - (Number(a.minPrice) || 0));
    }

    const total = rows.length;
    const pageNo = Math.max(Number(query.page) || 1, 1);
    const pageSize = Math.max(Number(query.size) || 10, 1);
    return { list: rows.slice((pageNo - 1) * pageSize, pageNo * pageSize), total };
  }

  /**
   * 详情：民宿 + 启用房型（按价升序）
   */
  async detail(id: number) {
    const info = await this.hotelEntity.findOneBy({ id });
    if (!info || info.status !== 1) {
      throw new CoolCommException('民宿不存在或已下架');
    }
    const roomTypes = await this.roomTypeEntity.find({
      where: { hotelId: id, status: 1 },
      order: { price: 'ASC' },
    });
    return { info, roomTypes };
  }
}
