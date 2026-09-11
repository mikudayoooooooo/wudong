import { Provide, Inject } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { OrderEntity } from '../entity/order';
import { MerchantAdminScopeService } from '../../merchant/service/admin-scope';

/**
 * 工作台看板统计（真实聚合，替换 demo 随机数假数据）
 * 口径：订单数/销售额统计「已支付+已完成」（status 2/3），金额取实付 payAmount；
 * 商家账号（merchant.adminUserId 绑定）只统计本商家，平台 admin 全量视角。
 * 注意：日期口径与库内 payTime 写入口径一致（同一容器时区），"今日"以数据库 CURDATE() 为准。
 */
@Provide()
export class OrderStatsService extends BaseService {
  @InjectEntityModel(OrderEntity)
  orderEntity: Repository<OrderEntity>;

  @Inject()
  merchantAdminScopeService: MerchantAdminScopeService;

  async adminStats(adminUserId: number) {
    const merchantId = await this.merchantAdminScopeService.resolveMerchantId(
      adminUserId
    );
    // typeorm 原生查询走位置参数（?），商家过滤统一追加在每个 WHERE 末尾
    const midSql = merchantId ? ' AND o.merchantId = ?' : '';
    const params: number[] = merchantId ? [merchantId] : [];
    const paid = 'o.status IN (2, 3)';

    // —— 卡片：总/今日 订单数与销售额 ——
    const [cards] = await this.orderEntity.query(
      `SELECT COUNT(*) AS orderTotal,
              IFNULL(SUM(IF(LEFT(o.payTime, 10) = CURDATE(), 1, 0)), 0) AS orderToday,
              IFNULL(SUM(o.payAmount), 0) AS salesTotal,
              IFNULL(SUM(IF(LEFT(o.payTime, 10) = CURDATE(), o.payAmount, 0)), 0) AS salesToday
       FROM \`order\` o
       WHERE ${paid}${midSql}`,
      params
    );

    // —— 近 7 日趋势（缺日补零）——
    const trendRows = await this.orderEntity.query(
      `SELECT LEFT(o.payTime, 10) AS date,
              COUNT(*) AS orderCount,
              IFNULL(SUM(o.payAmount), 0) AS salesAmount
       FROM \`order\` o
       WHERE ${paid} AND LEFT(o.payTime, 10) >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)${midSql}
       GROUP BY LEFT(o.payTime, 10)`,
      params
    );
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, 'day').format('YYYY-MM-DD');
      const hit: any = trendRows.find((r: any) => LEFT10(r.date) === date);
      trend.push({
        date,
        orderCount: Number(hit?.orderCount || 0),
        salesAmount: Number(hit?.salesAmount || 0),
      });
    }

    // —— 热门排行：住宿/门票路线/商品 明细 UNION，按名称聚合有效订单数 ——
    // UNION 三个分支各出现一次商家过滤占位符，参数需按份数传入
    const hotParams = merchantId ? [merchantId, merchantId, merchantId] : [];
    const hotRows = await this.orderEntity.query(
      `SELECT t.name, COUNT(DISTINCT t.orderId) AS orderCount
       FROM (
         SELECT r.targetName AS name, r.orderId
           FROM order_reservation r JOIN \`order\` o ON o.id = r.orderId
          WHERE ${paid} AND r.targetName <> ''${midSql}
         UNION ALL
         SELECT k.targetName AS name, k.orderId
           FROM order_ticket k JOIN \`order\` o ON o.id = k.orderId
          WHERE ${paid} AND k.targetName <> ''${midSql}
         UNION ALL
         SELECT g.productName AS name, g.orderId
           FROM order_product g JOIN \`order\` o ON o.id = g.orderId
          WHERE ${paid}${midSql}
       ) t
       GROUP BY t.name
       ORDER BY orderCount DESC
       LIMIT 5`,
      hotParams
    );

    // —— 品类占比（按模块订单数）——
    const moduleRows = await this.orderEntity.query(
      `SELECT o.module, COUNT(*) AS orderCount
       FROM \`order\` o
       WHERE ${paid}${midSql}
       GROUP BY o.module`,
      params
    );

    return {
      orderTotal: Number(cards?.orderTotal || 0),
      orderToday: Number(cards?.orderToday || 0),
      salesTotal: Number(cards?.salesTotal || 0),
      salesToday: Number(cards?.salesToday || 0),
      trend,
      hot: hotRows.map((r: any) => ({
        name: r.name,
        orderCount: Number(r.orderCount),
      })),
      moduleRatio: moduleRows.map((r: any) => ({
        module: r.module,
        orderCount: Number(r.orderCount),
      })),
    };
  }
}

/** mysql LEFT() 在部分驱动下返回 Date 对象（DATE() 才会），这里兜底转字符串 */
function LEFT10(v: any): string {
  if (!v) {
    return '';
  }
  if (typeof v === 'string') {
    return v.slice(0, 10);
  }
  return moment(v).format('YYYY-MM-DD');
}
