import { Config, Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { MemberSmsCodeEntity } from '../entity/sms-code';

/**
 * 模拟短信验证码（不接真实短信，验证码入库并输出到日志）
 */
@Provide()
export class MemberSmsService extends BaseService {
  @InjectEntityModel(MemberSmsCodeEntity)
  memberSmsCodeEntity: Repository<MemberSmsCodeEntity>;

  @Config('module.member.sms')
  smsConfig;

  @Inject()
  logger;

  /**
   * 手机号格式校验
   */
  checkPhone(phone: string) {
    if (!/^1[3-9]\d{9}$/.test(phone || '')) {
      throw new CoolCommException('手机号格式不正确');
    }
  }

  /**
   * 发送验证码（模拟）：旧验证码全部作废，新验证码入库 + 日志输出
   * local/unittest 环境返回验证码本身，便于演示与自动化测试
   */
  async sendCode(phone: string) {
    this.checkPhone(phone);
    // 作废旧验证码
    await this.memberSmsCodeEntity.update({ phone, used: 0 }, { used: 1 });
    // 随机6位验证码
    const code = String(Math.floor(100000 + Math.random() * 900000));
    await this.memberSmsCodeEntity.insert({
      phone,
      code,
      expireTime: moment()
        .add(this.smsConfig.expireSeconds, 'seconds')
        .toDate(),
    });
    this.logger.warn(`【模拟短信】向 ${phone} 发送验证码：${code}`);
    const env = process.env.NODE_ENV;
    if (env === 'local' || env === 'unittest') {
      return { code };
    }
    return {};
  }

  /**
   * 校验验证码：取该手机号最新一条未使用的比对，通过则置为已使用
   */
  async verify(phone: string, code: string) {
    this.checkPhone(phone);
    const sms = await this.memberSmsCodeEntity.findOne({
      where: { phone, used: 0 },
      order: { id: 'DESC' },
    });
    if (
      !sms ||
      sms.code !== String(code) ||
      moment(sms.expireTime).isBefore(moment())
    ) {
      throw new CoolCommException('验证码错误或已过期');
    }
    await this.memberSmsCodeEntity.update({ id: sms.id }, { used: 1 });
    return true;
  }
}
