import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';

export { close, createHttpRequest };

/** 启动完整应用（unittest 环境自动读取 src/config/config.unittest.ts）
 *  注：@midwayjs/mock 3.20 的 createApp 签名为 (baseDir?, options?, customFramework?)，
 *  框架作为泛型参数传入：createApp<Framework>() */
export async function boot() {
  return createApp<Framework>();
}

/** 携带 C 端 token 的请求头（脚手架中间件直接读取裸 token，无 Bearer 前缀） */
export function auth(token: string) {
  return { Authorization: token };
}
