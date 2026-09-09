import { boot, close, createHttpRequest } from './helper';

/**
 * 环境契约测试（金丝雀）
 *
 * 契约：jest 下 cool 模块系统正常加载（test/jest-setup.js 将
 * LocationUtil.getRunPath 重定向到 src），模块全局中间件生效：
 *
 * 1. /app/* 由 user 模块 UserMiddleware 鉴权：无 token 访问受保护接口
 *    被 UserMiddleware 拦截（抛 CoolCommException('登录失效~')，不会穿透到
 *    controller）。注意：BaseTranslateMiddleware 会把无 statusCode 的
 *    CoolCommException 归一化为 HTTP 200 + {code:1001}——这与生产环境行为
 *    完全一致（已对运行中的 docker midway 容器实测：/app 无 token => 200
 *    {"code":1001,"message":"登录失效~"}），故此处断言 200 + 登录失效。
 * 2. /admin/* 由 BaseAuthorityMiddleware 鉴权：其抛错携带 statusCode 401，
 *    因此无 token 返回真实 HTTP 401（生产容器实测一致）。
 *
 * 后续所有 member 模块任务的测试都依赖此环境契约（模块配置可注入、
 * 鉴权中间件生效）。若本用例失败，说明测试环境的模块配置/中间件加载
 * 被破坏，应先修复环境再排查业务用例。
 */
describe('环境契约：模块全局中间件在生产对齐模式下生效', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it('无 token 访问 /app/user/info/person 被 UserMiddleware 拦截（200 + code 1001 登录失效，与生产一致）', async () => {
    const res = await createHttpRequest(app).get('/app/user/info/person');
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1001);
    expect(res.body.message).toBe('登录失效~');
  });

  it('无 token 访问 /admin/base/sys/user/page 返回 401', async () => {
    const res = await createHttpRequest(app).get(
      '/admin/base/sys/user/page?page=1&size=10'
    );
    expect(res.status).toBe(401);
  });
});
