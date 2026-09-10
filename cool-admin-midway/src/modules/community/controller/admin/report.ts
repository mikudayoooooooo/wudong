import { BaseController, CoolController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityReportEntity } from '../../entity/report';

/**
 * 举报处理
 */
@CoolController({
  prefix: '/admin/community/report',
  api: ['page', 'list', 'info'],
  entity: CommunityReportEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.targetType'],
    keyWordLikeFields: ['a.reason'],
  },
})
export class AdminCommunityReportController extends BaseController {
  @InjectEntityModel(CommunityReportEntity)
  reportEntity: Repository<CommunityReportEntity>;

  @Post('/handle', { summary: '处理举报' })
  async handle(@Body() body) {
    const id = Number(body?.id);
    const status = String(body?.status);
    if (!['handled', 'rejected'].includes(status)) {
      return this.fail('处理状态不正确');
    }
    const report = await this.reportEntity.findOneBy({ id });
    if (!report) return this.fail('举报不存在');
    await this.reportEntity.update(
      { id },
      { status, handleResult: String(body?.handleResult || '') }
    );
    return this.ok(true);
  }
}
