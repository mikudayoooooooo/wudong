import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { BannerEntity } from '../entity/banner';

const NOW = () => moment().format('YYYY-MM-DD HH:mm:ss');

/**
 * 轮播图下发
 */
@Provide()
export class BannerService extends BaseService {
  @InjectEntityModel(BannerEntity)
  bannerEntity: Repository<BannerEntity>;

  /** 下发：启用 + 生效时间窗内，按 sort asc */
  async bannerList(position?: string) {
    const qb = this.bannerEntity.createQueryBuilder('a').where('a.status = 1');
    if (position) {
      qb.andWhere('a.position = :position', { position });
    }
    const rows = await qb
      .orderBy('a.sort', 'ASC')
      .addOrderBy('a.id', 'ASC')
      .getMany();
    const now = NOW();
    return rows.filter(
      r =>
        (!r.startTime || String(r.startTime) <= now) &&
        (!r.endTime || String(r.endTime) >= now)
    );
  }
}
