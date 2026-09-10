const path = require('path');

/**
 * jest 环境下重定向 @cool-midway/core 的运行路径。
 *
 * 为什么需要：cool 的模块系统（CoolModuleConfig / CoolModuleImport 等）通过
 * LocationUtil.getRunPath() 固定读取 <项目根>/dist/modules/ 下的模块配置、
 * 全局中间件与种子数据；而 jest 通过 ts-jest 直接从 src/ 启动应用，且 dist
 * 会在测试前被 test/global-setup.js 清理（dist 残留会导致 src/dist 两套类
 * 混用、容器内 DefinitionNotFound）。
 * 不重定向时 CoolModuleConfig 找不到 <root>/dist/modules/ 会提前 return，
 * 模块配置（module.user.jwt 等）与全局中间件（/app/* 的 UserMiddleware
 * 鉴权等）全部不生效。这里把 getRunPath 重定向到 src/，使模块世界与
 * jest 的 src 世界一致。
 *
 * 覆盖原型方法：require('@cool-midway/core/dist/util/location').default
 * 导出的单例与容器内创建的 LocationUtil 实例共用原型，一处补丁同时生效。
 */
const locationModule = require('@cool-midway/core/dist/util/location');
locationModule.LocationUtil.prototype.getRunPath = function () {
  return path.join(__dirname, '..', 'src');
};
