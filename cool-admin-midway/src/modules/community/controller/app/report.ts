import { BaseController, CoolController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityReportEntity } from '../../entity/report';

/**
 * C端举报
 */
@CoolController()
export class AppCommunityReportController extends BaseController {
  @InjectEntityModel(CommunityReportEntity)
  reportEntity: Repository<CommunityReportEntity>;

  @Inject()
  ctx;

  @Post('/add', { summary: '提交举报' })
  async addItem(@Body() body) {
    const targetType = String(body?.targetType);
    if (!['post', 'comment', 'user'].includes(targetType)) {
      return this.fail('举报目标类型不正确');
    }
    const reason = String(body?.reason || '').trim();
    if (!reason) return this.fail('请填写举报理由');
    await this.reportEntity.insert({
      userId: this.ctx.user.id,
      targetType,
      targetId: Number(body?.targetId),
      reason: reason.slice(0, 500),
      status: 'pending',
    });
    return this.ok(true);
  }
}
