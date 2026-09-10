import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { SystemMessageEntity } from '../../entity/system-message';
import { MessageService } from '../../service/message';

/**
 * 消息管理（平台群发：add 时 userId 留空即全员）
 */
@CoolController({
  prefix: '/admin/message',
  api: ['page', 'list', 'info', 'add', 'update', 'delete'],
  entity: SystemMessageEntity,
  pageQueryOp: {
    fieldEq: ['a.type', 'a.isRead'],
    keyWordLikeFields: ['a.title'],
  },
})
export class AdminMessageController extends BaseController {
  @Inject()
  messageService: MessageService;

  @Post('/sendByTemplate', { summary: '按模板发送' })
  async sendByTemplate(@Body() body) {
    return this.ok(
      await this.messageService.sendByTemplate(
        String(body?.templateCode || ''),
        body?.userId ? Number(body.userId) : undefined,
        body?.linkType
          ? { linkType: String(body.linkType), linkValue: String(body.linkValue) }
          : undefined
      )
    );
  }
}
