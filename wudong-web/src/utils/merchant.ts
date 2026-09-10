// 商家域展示常量与文案（入驻模块 / 申请状态），首页与申请页共用。
export const MODULE_LABELS: Record<string, string> = {
  product: '特产',
  food: '美食',
  accommodation: '住宿',
  travel: '旅行',
};

export const MODULE_OPTIONS: { value: string; label: string }[] = [
  { value: 'accommodation', label: '住宿' },
  { value: 'product', label: '特产' },
  { value: 'food', label: '美食' },
  { value: 'travel', label: '旅行' },
];

/** 后端 dict：1 待审核 2 已通过 3 已驳回 */
export const APPLICATION_STATUS_TEXT: Record<number, string> = {
  1: '待审核',
  2: '已通过',
  3: '已驳回',
};

export const moduleLabel = (module: string): string =>
  MODULE_LABELS[module] ?? module;

export const applicationStatusText = (status: number): string =>
  APPLICATION_STATUS_TEXT[Number(status)] ?? '未知状态';
