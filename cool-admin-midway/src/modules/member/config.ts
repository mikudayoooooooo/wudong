import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块配置
 */
export default () => {
  return {
    // 模块名称
    name: 'C端用户公共模块',
    // 模块描述
    description: 'member：注册/登录/JWT鉴权/模拟短信/收藏，行与社区模块共用',
    // 中间件，只对本模块有效
    middlewares: [],
    // 全局 /app/* 鉴权沿用 user 模块的 UserMiddleware，此处不重复注册
    globalMiddlewares: [],
    // 模块加载顺序，默认为0，值越大越优先加载
    order: 0,
    // 模拟短信
    sms: {
      // 验证码有效期，单位秒
      expireSeconds: 5 * 60,
    },
  } as ModuleConfig;
};
