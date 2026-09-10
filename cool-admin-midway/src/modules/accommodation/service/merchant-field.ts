import { CoolCommException } from '@cool-midway/core';

/** 一份白名单字段表的归一规则 */
export interface FieldSpec {
  /** 可写字段白名单；不在表里的键（id、归属字段、实体默认字段）一律丢弃 */
  fields: string[];
  /** 需要转成 number 的字段 */
  numeric: string[];
  /** 需要是「非空字符串数组」的字段 */
  json: string[];
  /** 数字字段值为空或无法解析时抛出的文案 */
  numberError: string;
}

/**
 * 字段白名单过滤 + 类型归一（B 端商家服务共用）。
 * - 空串/空数组视为「没填」而不是 0：Number('') === 0 会让必填校验形同虚设
 * - 数组元素必须是字符串：String({url:'a.jpg'}) 会静默存成 '[object Object]'
 */
export function pickFields(body: any, spec: FieldSpec): Record<string, any> {
  const out: Record<string, any> = {};
  for (const key of spec.fields) {
    const value = body?.[key];
    if (value === undefined || value === null) continue;
    if (spec.numeric.includes(key)) {
      if (value === '' || (Array.isArray(value) && value.length === 0)) {
        throw new CoolCommException(spec.numberError);
      }
      const num = Number(value);
      if (Number.isNaN(num)) {
        throw new CoolCommException(spec.numberError);
      }
      out[key] = num;
    } else if (spec.json.includes(key)) {
      if (
        !Array.isArray(value) ||
        value.some((v: unknown) => typeof v !== 'string' || !v.trim())
      ) {
        throw new CoolCommException('标签格式不正确');
      }
      out[key] = value.map((v: string) => v.trim());
    } else {
      out[key] = typeof value === 'string' ? value.trim() : value;
    }
  }
  return out;
}
