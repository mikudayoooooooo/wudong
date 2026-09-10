// 数据源开关：真实后端(8001) 与 mocks 演示数据 的唯一选择处。
// 仅字符串 "true" 视为开启 mock —— import.meta.env 里所有值都是字符串。
export const parseUseMock = (v: unknown): boolean => v === 'true';

export const USE_MOCK: boolean = parseUseMock(import.meta.env.VITE_USE_MOCK);
