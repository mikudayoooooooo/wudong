import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantEntity } from '../entity/merchant';

/**
 * 商家角色管理端数据权限
 * merchant.adminUserId 绑定的管理端账号：admin 侧查询自动收敛到本商家数据；
 * 未绑定（平台管理员）不受限。绑定即生效，无需额外角色判断。
 */
@Provide()
export class MerchantAdminScopeService extends BaseService {
  @InjectEntityModel(MerchantEntity)
  merchantEntity: Repository<MerchantEntity>;

  /** 管理端用户绑定的商家ID；未绑定或商家非正常状态返回 null（平台视角） */
  async resolveMerchantId(adminUserId: number): Promise<number | null> {
    if (!adminUserId) {
      return null;
    }
    const merchant = await this.merchantEntity.findOneBy({
      adminUserId: Number(adminUserId),
    });
    if (!merchant || merchant.status !== 1) {
      return null;
    }
    return merchant.id;
  }

  /**
   * 生成 admin CRUD 的 where 条件（cool pageQueryOp/listQueryOp 的 where 元组）
   * 平台视角返回空数组（不加任何条件）
   */
  async whereFor(
    adminUserId: number
  ): Promise<Array<[string, Record<string, number>]>> {
    const merchantId = await this.resolveMerchantId(adminUserId);
    return merchantId
      ? [['a.merchantId = :merchantId', { merchantId }]]
      : [];
  }
}
