import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Get, Inject, Post } from '@midwayjs/core';
import { MemberInfoService } from '../../service/info';

/**
 * C端用户资料（需登录，无 IGNORE_TOKEN 标签即走 JWT 校验）
 */
@CoolController()
export class AppMemberInfoController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  memberInfoService: MemberInfoService;

  @Get('/person', { summary: '获取当前用户信息' })
  async person() {
    return this.ok(await this.memberInfoService.person(this.ctx.user.id));
  }

  @Post('/updatePerson', { summary: '更新资料' })
  async updatePerson(@Body() body) {
    return this.ok(
      await this.memberInfoService.updatePerson(this.ctx.user.id, body)
    );
  }

  @Post('/updatePassword', { summary: '验证码重置密码' })
  async updatePassword(
    @Body('password') password: string,
    @Body('smsCode') smsCode: string
  ) {
    return this.ok(
      await this.memberInfoService.updatePassword(
        this.ctx.user.id,
        password,
        smsCode
      )
    );
  }
}
