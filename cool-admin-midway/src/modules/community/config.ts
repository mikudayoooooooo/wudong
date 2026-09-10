import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块配置
 */
export default () => {
  return {
    name: '社区模块',
    description:
      'community：游记/足迹快照/评论/话题/关注/点赞/举报/互动消息；敏感词复用公共 sensitive 模块',
    middlewares: [],
    globalMiddlewares: [],
    order: 0,
  } as ModuleConfig;
};
