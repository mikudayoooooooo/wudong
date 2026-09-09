import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { AnnouncementEntity } from '../entity/announcement';

const NOW = () => moment().format('YYYY-MM-DD HH:mm:ss');

/**
 * 公告下发
 */
@Provide()
export class AnnouncementService extends BaseService {
  @InjectEntityModel(AnnouncementEntity)
  announcementEntity: Repository<AnnouncementEntity>;

  /** 下发：发布态 + 时间窗内，置顶优先再创建时间倒序 */
  async announcementList(type?: number) {
    const qb = this.announcementEntity.createQueryBuilder('a').where('a.status = 1');
    if (type != null) {
      qb.andWhere('a.type = :type', { type });
    }
    const rows = await qb
      .orderBy('a.isTop', 'DESC')
      .addOrderBy('a.createTime', 'DESC')
      .getMany();
    const now = NOW();
    return rows.filter(
      (r) => (!r.startTime || String(r.startTime) <= now) && (!r.endTime || String(r.endTime) >= now)
    );
  }
}
