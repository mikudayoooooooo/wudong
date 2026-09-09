import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    name: '平台运营位',
    description: 'operate：banner/announcement 运营内容管理 + finance_record 预留（模块6 子集）',
    middlewares: [],
    globalMiddlewares: [],
    order: 0,
  } as ModuleConfig;
};
