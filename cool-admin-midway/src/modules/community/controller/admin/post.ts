import { BaseController, CoolController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityPostEntity } from '../../entity/post';

/**
 * 游记管理（内容审核：通过→normal，拒绝→offline + 理由）
 */
@CoolController({
  prefix: '/admin/community/post',
  api: ['page', 'list', 'info', 'delete'],
  entity: CommunityPostEntity,
  pageQueryOp: {
    fieldEq: ['a.status', 'a.userId'],
    keyWordLikeFields: ['a.title'],
  },
})
export class AdminCommunityPostController extends BaseController {
  @InjectEntityModel(CommunityPostEntity)
  postEntity: Repository<CommunityPostEntity>;

  @Post('/audit', { summary: '审核游记' })
  async audit(@Body() body) {
    const id = Number(body?.id);
    const pass = !!body?.pass;
    const post = await this.postEntity.findOneBy({ id });
    if (!post) return this.fail('游记不存在');
    await this.postEntity.update(
      { id },
      { status: pass ? 'normal' : 'offline', auditReason: pass ? null : String(body?.reason || '不符合社区规范') }
    );
    return this.ok(true);
  }
}
