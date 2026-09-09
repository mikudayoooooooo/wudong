import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { MerchantEntity } from '../entity/merchant';
import { MerchantApplicationEntity } from '../entity/merchant-application';

/** 可入驻模块白名单 */
export const MERCHANT_MODULES = [
  'product',
  'food',
  'accommodation',
  'travel',
];

/**
 * 商家中心
 */
@Provide()
export class MerchantService extends BaseService {
  @InjectEntityModel(MerchantEntity)
  merchantEntity: Repository<MerchantEntity>;

  @InjectEntityModel(MerchantApplicationEntity)
  merchantApplicationEntity: Repository<MerchantApplicationEntity>;

  /**
   * 提交入驻申请：驳回后可重新申请
   */
  async apply(userId: number, param) {
    const {
      shopName,
      module,
      contactName,
      contactPhone,
      idCard,
      idCardFront,
      idCardBack,
      businessLicense,
      otherMaterials,
    } = param || {};
    if (!MERCHANT_MODULES.includes(module)) {
      throw new CoolCommException('入驻模块不正确');
    }
    if (
      !shopName ||
      !contactName ||
      !contactPhone ||
      !idCard ||
      !idCardFront ||
      !idCardBack ||
      !businessLicense
    ) {
      throw new CoolCommException('请填写完整的入驻信息');
    }
    const exist = await this.merchantEntity.findOneBy({
      userId: Equal(userId),
    });
    if (exist) {
      throw new CoolCommException('您已是商家');
    }
    const pending = await this.merchantApplicationEntity.findOneBy({
      userId: Equal(userId),
      status: 1,
    });
    if (pending) {
      throw new CoolCommException('已存在待审核的入驻申请');
    }
    await this.merchantApplicationEntity.insert({
      userId,
      shopName,
      module,
      contactName,
      contactPhone,
      idCard,
      idCardFront,
      idCardBack,
      businessLicense,
      otherMaterials,
      status: 1,
    });
    return true;
  }

  /**
   * 我的店铺（非商家返回 null）
   */
  async my(userId: number) {
    return this.merchantEntity.findOneBy({ userId: Equal(userId) });
  }

  /**
   * 最近一次入驻申请
   */
  async latestApplication(userId: number) {
    const list = await this.merchantApplicationEntity.find({
      where: { userId: Equal(userId) },
      order: { id: 'DESC' },
      take: 1,
    });
    return list[0] || null;
  }
}
