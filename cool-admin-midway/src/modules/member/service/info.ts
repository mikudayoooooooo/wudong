import { Inject, Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import * as _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import { MemberUserEntity } from '../entity/user';
import { MemberSmsService } from './sms';
import { checkPasswordRule } from './login';

/**
 * C端用户资料
 */
@Provide()
export class MemberInfoService extends BaseService {
  @InjectEntityModel(MemberUserEntity)
  memberUserEntity: Repository<MemberUserEntity>;

  @Inject()
  memberSmsService: MemberSmsService;

  /**
   * 获取用户信息（不含密码）
   */
  async person(userId: number) {
    const info = await this.memberUserEntity.findOneBy({
      id: Equal(userId),
    });
    if (!info) {
      throw new CoolCommException('用户不存在');
    }
    delete info.password;
    return info;
  }

  /**
   * 更新资料（仅允许昵称/头像/性别/简介）
   */
  async updatePerson(userId: number, param) {
    const data = _.pick(param || {}, ['nickname', 'avatar', 'gender', 'bio']);
    if (_.isEmpty(data)) {
      throw new CoolCommException('无可更新的字段');
    }
    await this.memberUserEntity.update({ id: Equal(userId) }, data);
    return true;
  }

  /**
   * 通过短信验证码重置密码
   */
  async updatePassword(userId: number, password: string, smsCode: string) {
    checkPasswordRule(password);
    const user = await this.memberUserEntity.findOneBy({
      id: Equal(userId),
    });
    if (!user) {
      throw new CoolCommException('用户不存在');
    }
    await this.memberSmsService.verify(user.phone, smsCode);
    await this.memberUserEntity.update(
      { id: userId },
      { password: bcrypt.hashSync(password, 10) }
    );
    return true;
  }
}
