// USE_MOCK 读取逻辑内聚为可测纯函数：env.ts 导出 parseUseMock(v: unknown): boolean
import { describe, expect, it } from 'vitest';
import { parseUseMock } from './env';

describe('parseUseMock', () => {
  it('仅字符串 "true" 为真', () => {
    expect(parseUseMock('true')).toBe(true);
    expect(parseUseMock('false')).toBe(false);
    expect(parseUseMock(undefined)).toBe(false);
    expect(parseUseMock(true)).toBe(false); // 非字符串真值不认
  });
});
