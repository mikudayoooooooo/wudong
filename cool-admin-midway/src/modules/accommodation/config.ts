import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    name: '住-住宿预订',
    description: 'accommodation：民宿/房型/房态日历管理，C端浏览；预订闭环待 base order/pay',
    middlewares: [],
    globalMiddlewares: [],
    order: 0,
  } as ModuleConfig;
};
