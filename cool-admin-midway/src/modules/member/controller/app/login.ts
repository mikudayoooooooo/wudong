import {
  CoolController,
  BaseController,
  CoolUrlTag,
  TagTypes,
  CoolTag,
} from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { MemberLoginService } from '../../service/login';

/**
 * C端登录/注册
 */
@CoolUrlTag()
@CoolController()
export class AppMemberLoginController extends BaseController {
  @Inject()
  memberLoginService: MemberLoginService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/smsCode', { summary: '发送验证码（模拟短信）' })
  async smsCode(@Body('phone') phone: string) {
    return this.ok(await this.memberLoginService.smsCode(phone));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/register', { summary: '注册（手机号+验证码+密码）' })
  async register(
    @Body('phone') phone: string,
    @Body('smsCode') smsCode: string,
    @Body('password') password: string,
    @Body('nickname') nickname: string
  ) {
    return this.ok(
      await this.memberLoginService.register(phone, smsCode, password, nickname)
    );
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/sms', { summary: '验证码登录' })
  async sms(@Body('phone') phone: string, @Body('smsCode') smsCode: string) {
    return this.ok(await this.memberLoginService.sms(phone, smsCode));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/password', { summary: '密码登录' })
  async password(
    @Body('phone') phone: string,
    @Body('password') password: string
  ) {
    return this.ok(await this.memberLoginService.password(phone, password));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/refreshToken', { summary: '刷新token' })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.ok(await this.memberLoginService.refreshToken(refreshToken));
  }
}
