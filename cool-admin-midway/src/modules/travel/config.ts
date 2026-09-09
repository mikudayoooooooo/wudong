import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块配置
 */
export default () => {
  return {
    name: '行模块',
    description:
      'travel：景区/票种/路线/库存/电子票/攻略/评价/推荐位，订单与支付复用公共 order/pay 模块',
    middlewares: [],
    globalMiddlewares: [],
    order: 0,
  } as ModuleConfig;
};
