import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { MerchantApplicationEntity } from '../../entity/merchant-application';
import { MerchantService } from '../../service/merchant';

/**
 * 入驻申请管理
 */
@CoolController({
  prefix: '/admin/merchantApplication',
  api: ['page', 'list', 'info'],
  entity: MerchantApplicationEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.module'],
    keyWordLikeFields: ['a.shopName', 'a.contactPhone'],
  },
})
export class AdminMerchantApplicationController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  merchantService: MerchantService;

  @Post('/audit', { summary: '入驻审核' })
  async audit(@Body() body) {
    return this.ok(
      await this.merchantService.audit(
        body.id,
        !!body.pass,
        body.auditResult,
        this.ctx.admin?.id
      )
    );
  }
}
