import { Provide } from '@midwayjs/core';
import { BaseService, CoolCommException } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { SensitiveWordEntity } from '../entity/word';

/**
 * 敏感词 DFA 过滤
 * 命中 → 调用方将内容置为待人工复审（机审流程约定）
 * 词表量小则每次查库即可，量大后再加内存缓存
 */
@Provide()
export class SensitiveService extends BaseService {
  @InjectEntityModel(SensitiveWordEntity)
  sensitiveWordEntity: Repository<SensitiveWordEntity>;

  /**
   * 新增敏感词（重复返回已有 id）
   */
  async addWord(word: string): Promise<number> {
    const exist = await this.sensitiveWordEntity.findOneBy({
      word: Equal(word),
    });
    if (exist) {
      return exist.id;
    }
    const inserted = await this.sensitiveWordEntity.insert({ word, status: 1 });
    return inserted.identifiers[0].id;
  }

  /**
   * 禁用敏感词
   */
  async disableWord(id: number) {
    await this.sensitiveWordEntity.update({ id }, { status: 0 });
    return true;
  }

  /**
   * 删除敏感词
   */
  async removeWord(id: number) {
    await this.sensitiveWordEntity.delete({ id });
    return true;
  }

  /**
   * DFA 检查文本，返回是否命中及命中的词
   */
  async check(text: string): Promise<{ hit: boolean; words: string[] }> {
    const result = { hit: false, words: [] };
    if (!text) {
      return result;
    }
    const words = await this.sensitiveWordEntity.find({ where: { status: 1 } });
    if (words.length === 0) {
      return result;
    }
    // 构建 Trie
    const trie: Record<string, any> = {};
    for (const { word } of words) {
      let node = trie;
      for (const char of word) {
        node[char] = node[char] || {};
        node = node[char];
      }
      node['$end'] = word;
    }
    // 扫描
    const hit = new Set<string>();
    for (let i = 0; i < text.length; i++) {
      let node = trie;
      for (let j = i; j < text.length; j++) {
        const char = text[j];
        if (!node[char]) {
          break;
        }
        node = node[char];
        if (node['$end']) {
          hit.add(node['$end']);
        }
      }
    }
    result.hit = hit.size > 0;
    result.words = Array.from(hit);
    return result;
  }

  /**
   * 便捷断言：词不存在时抛业务异常
   */
  async assertExists(id: number) {
    const word = await this.sensitiveWordEntity.findOneBy({ id: Equal(id) });
    if (!word) {
      throw new CoolCommException('敏感词不存在');
    }
    return word;
  }
}
