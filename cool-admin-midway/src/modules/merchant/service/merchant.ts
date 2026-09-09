import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { MerchantEntity } from '../entity/merchant';
import { MerchantApplicationEntity } from '../entity/merchant-application';
import { MemberUserEntity } from '../../member/entity/user';
import { MessageService } from '../../message/service/message';

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

  @InjectEntityModel(MemberUserEntity)
  memberUserEntity: Repository<MemberUserEntity>;

  @Inject()
  messageService: MessageService;

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

  /**
   * 审核：通过则生成/启用店铺 + 回写 member role=2 + 站内通知；驳回则通知并可重新申请
   */
  async audit(applicationId: number, pass: boolean, auditResult: string, adminId: number) {
    const application = await this.merchantApplicationEntity.findOneBy({
      id: Equal(applicationId),
    });
    if (!application) {
      throw new CoolCommException('申请不存在');
    }
    if (application.status !== 1) {
      throw new CoolCommException('该申请已审核');
    }
    if (pass) {
      const exist = await this.merchantEntity.findOneBy({
        userId: Equal(application.userId),
      });
      if (exist) {
        await this.merchantEntity.update(
          { id: exist.id },
          {
            shopName: application.shopName,
            module: application.module,
            contactName: application.contactName,
            contactPhone: application.contactPhone,
            businessLicense: application.businessLicense,
            status: 1,
            joinedAt: new Date(),
          }
        );
      } else {
        await this.merchantEntity.insert({
          userId: application.userId,
          username: `m${application.userId}`,
          shopName: application.shopName,
          module: application.module,
          contactName: application.contactName,
          contactPhone: application.contactPhone,
          idCard: application.idCard,
          businessLicense: application.businessLicense,
          status: 1,
          joinedAt: new Date(),
        });
      }
      await this.memberUserEntity.update(
        { id: Equal(application.userId) },
        { role: 2 }
      );
      await this.messageService.send(
        application.userId,
        'system',
        '入驻审核通过',
        `您的店铺「${application.shopName}」已通过入驻审核`
      );
    } else {
      await this.messageService.send(
        application.userId,
        'system',
        '入驻审核未通过',
        `您的入驻申请未通过：${auditResult || '材料不符合要求'}`
      );
    }
    await this.merchantApplicationEntity.update(
      { id: application.id },
      {
        status: pass ? 2 : 3,
        auditResult,
        auditBy: adminId,
        auditTime: new Date(),
      }
    );
    return true;
  }

  /**
   * 商家身份判断（各业务模块数据权限过滤入口）
   */
  async isMerchant(userId: number) {
    return this.merchantEntity.findOneBy({
      userId: Equal(userId),
      status: 1,
    });
  }
}
