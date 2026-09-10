import { Config, Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { MemberUserEntity } from '../entity/user';
import { MemberSmsService } from './sms';

/**
 * C端用户密码规则：8-20位，且同时包含字母和数字（规格 §5.1）
 */
export function checkPasswordRule(password: string) {
  if (!/^(?=.*[A-Za-z])(?=.*\d)[\s\S]{8,20}$/.test(password || '')) {
    throw new CoolCommException('密码须为8-20位，且同时包含字母和数字');
  }
}

/**
 * 注册/登录（JWT 配置复用 user 模块，由全局 UserMiddleware 校验）
 */
@Provide()
export class MemberLoginService extends BaseService {
  @InjectEntityModel(MemberUserEntity)
  memberUserEntity: Repository<MemberUserEntity>;

  @Inject()
  memberSmsService: MemberSmsService;

  @Config('module.user.jwt')
  jwtConfig;

  /**
   * 发送验证码（模拟）
   */
  async smsCode(phone: string) {
    return this.memberSmsService.sendCode(phone);
  }

  /**
   * 注册（手机号+验证码+密码），成功即登录
   */
  async register(
    phone: string,
    smsCode: string,
    password: string,
    nickname?: string
  ) {
    this.memberSmsService.checkPhone(phone);
    checkPasswordRule(password);
    const exist = await this.memberUserEntity.findOneBy({
      phone: Equal(phone),
    });
    if (exist) {
      throw new CoolCommException('该手机号已注册，请直接登录');
    }
    await this.memberSmsService.verify(phone, smsCode);
    const result = await this.memberUserEntity.insert({
      phone,
      password: bcrypt.hashSync(password, 10),
      nickname: nickname || `游客${phone.slice(-4)}`,
      status: 1,
      lastLoginTime: new Date(),
    });
    const userId = result.identifiers[0].id;
    return { userId, ...(await this.token({ id: userId })) };
  }

  /**
   * 密码登录
   */
  async password(phone: string, password: string) {
    const user = await this.memberUserEntity.findOneBy({
      phone: Equal(phone),
    });
    if (!user || !bcrypt.compareSync(password || '', user.password || '')) {
      throw new CoolCommException('账号或密码错误');
    }
    if (user.status !== 1) {
      throw new CoolCommException('账号已被禁用');
    }
    return this.loginSuccess(user);
  }

  /**
   * 验证码登录
   */
  async sms(phone: string, smsCode: string) {
    await this.memberSmsService.verify(phone, smsCode);
    const user = await this.memberUserEntity.findOneBy({
      phone: Equal(phone),
    });
    if (!user) {
      throw new CoolCommException('该手机号未注册');
    }
    if (user.status !== 1) {
      throw new CoolCommException('账号已被禁用');
    }
    return this.loginSuccess(user);
  }

  /**
   * 刷新token
   */
  async refreshToken(refreshToken: string) {
    let userId;
    try {
      const info = jwt.verify(refreshToken, this.jwtConfig.secret);
      if (!info['isRefresh']) {
        throw new Error('token类型非refreshToken');
      }
      userId = info['id'];
    } catch (e) {
      throw new CoolCommException(
        '刷新token失败，请检查refreshToken是否正确或过期'
      );
    }
    const user = await this.memberUserEntity.findOneBy({ id: Equal(userId) });
    if (!user || user.status !== 1) {
      throw new CoolCommException(
        '刷新token失败，请检查refreshToken是否正确或过期'
      );
    }
    return this.token({ id: user.id });
  }

  /**
   * 登录成功：更新最后登录时间并签发token
   */
  async loginSuccess(user: MemberUserEntity) {
    await this.memberUserEntity.update(
      { id: user.id },
      { lastLoginTime: new Date() }
    );
    return {
      userId: user.id,
      nickname: user.nickname,
      ...(await this.token({ id: user.id })),
    };
  }

  /**
   * 签发 token
   */
  async token(info) {
    const { expire, refreshExpire } = this.jwtConfig;
    return {
      expire,
      token: await this.generateToken(info, false),
      refreshExpire,
      refreshToken: await this.generateToken(info, true),
    };
  }

  /**
   * 生成token（isRefresh=true 的为刷新token，不能直接用于鉴权）
   */
  async generateToken(info, isRefresh = false) {
    const { expire, refreshExpire, secret } = this.jwtConfig;
    return jwt.sign({ isRefresh, ...info }, secret, {
      expiresIn: isRefresh ? refreshExpire : expire,
    });
  }
}
