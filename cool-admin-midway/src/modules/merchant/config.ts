import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块配置
 */
export default () => {
  return {
    name: '商家中心模块',
    description: 'merchant：商家入驻申请、审核与商家身份服务',
    middlewares: [],
    globalMiddlewares: [],
    order: 0,
  } as ModuleConfig;
};
