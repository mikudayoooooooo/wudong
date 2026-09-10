# 测试方式

脚手架默认注释称 cool-admin 与 jest 不兼容、推荐 Apifox 手工测试。
本项目已启用 **jest + @midwayjs/mock 集成测试**（`createApp` 启动完整应用，
与 dev 脚本 `mwtsc --run @midwayjs/mock/app.js` 同源），冒烟验证见 `test/smoke.test.ts`。

## 运行

```bash
# 前提：本地 MySQL 8 运行于 127.0.0.1:3307（docker wudong-mysql，root/123456）
npm run test
```

- `NODE_ENV=unittest`：读取 `src/config/config.unittest.ts`，连接测试库 `wudong_platform_test`
- `test/global-setup.js`：每次运行前 DROP/CREATE 测试库，用例可重复执行
- `jest.config.js` 设 `maxWorkers: 1` 串行执行，避免并发 synchronize 建表竞态
- 测试专用：`member_sms_code` 模拟短信在 unittest 环境回显验证码（`data.code`），供用例直接取用

## 约定

- 成功响应 `body.code === 1000`；业务异常 `body.code === 1001`
- 未登录访问受保护 `/app/*` 接口 → HTTP 200 + `{code:1001, message:'登录失效~'}`（异常过滤器归一化；`/admin/*` 为 HTTP 401）
- C 端 token 放在 `Authorization` 请求头（无 Bearer 前缀）
