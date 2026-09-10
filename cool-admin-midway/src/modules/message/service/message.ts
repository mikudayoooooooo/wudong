import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, In, Repository } from 'typeorm';
import { SystemMessageEntity } from '../entity/system-message';
import { MessageTemplateEntity } from '../entity/template';

/** 消息类型白名单 */
export const MESSAGE_TYPES = ['order', 'system', 'activity', 'interact'];

/**
 * 消息中心
 */
@Provide()
export class MessageService extends BaseService {
  @InjectEntityModel(SystemMessageEntity)
  systemMessageEntity: Repository<SystemMessageEntity>;

  @InjectEntityModel(MessageTemplateEntity)
  messageTemplateEntity: Repository<MessageTemplateEntity>;

  /**
   * 发送消息：userId 为 null 表示全员广播
   */
  async send(
    userId: number | null,
    type: string,
    title: string,
    content: string,
    link?: { linkType: string; linkValue: string }
  ) {
    if (!MESSAGE_TYPES.includes(type)) {
      throw new CoolCommException('消息类型不正确');
    }
    await this.systemMessageEntity.insert({
      userId: userId ?? null,
      type,
      title,
      content,
      linkType: link?.linkType,
      linkValue: link?.linkValue,
    });
    return true;
  }

  /**
   * 按模板发送：取启用模板的 type/title/content 落库；userId 空则全员广播
   */
  async sendByTemplate(
    templateCode: string,
    userId?: number,
    link?: { linkType: string; linkValue: string }
  ) {
    const template = await this.messageTemplateEntity.findOneBy({
      code: Equal(templateCode),
      status: 1,
    });
    if (!template) {
      throw new CoolCommException('模板不存在或已停用');
    }
    return this.send(
      userId ?? null,
      template.type,
      template.title,
      template.content,
      link
    );
  }

  /**
   * 我的消息分页：定向给我的 + 全员广播，id 倒序
   */
  async pageList(userId: number, type?: string, page = 1, size = 10) {
    const qb = this.systemMessageEntity
      .createQueryBuilder('a')
      .where('(a.userId IS NULL OR a.userId = :userId)', { userId })
      .orderBy('a.id', 'DESC');
    if (type) {
      qb.andWhere('a.type = :type', { type });
    }
    const pageNo = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(size) || 10, 1);
    qb.skip((pageNo - 1) * pageSize).take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total };
  }

  /**
   * 未读数（定向未读 + 全员未读）
   */
  async unreadCount(userId: number) {
    return this.systemMessageEntity
      .createQueryBuilder('a')
      .where('(a.userId IS NULL OR a.userId = :userId)', { userId })
      .andWhere('a.isRead = 0')
      .getCount();
  }

  /**
   * 标记已读：仅能标记自己的定向消息（全员消息不可单独标记）
   */
  async markRead(userId: number, ids: number[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new CoolCommException('请选择要标记的消息');
    }
    await this.systemMessageEntity.update(
      { id: In(ids), userId: Equal(userId) },
      { isRead: 1 }
    );
    return true;
  }
}
