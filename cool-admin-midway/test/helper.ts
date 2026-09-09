import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import { CoolModuleConfig } from '@cool-midway/core';
import * as mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';

export { close, createHttpRequest };

/**
 * 等待 cool 模块种子导入完成。
 *
 * cool 的 CoolModuleImport 在 onServerReady 后 2000ms 的定时器里异步导入各模块
 * 种子数据（initJudge 'db'，以 base_sys_conf 中写入 init_db_<module> 标记为完成），
 * 且不被 await。若 boot() 立即返回、用例快速结束，close() 会在导入进行中销毁
 * 连接池，导致定时器内报 "Pool is closed" 并使整个 suite 失败。
 * 这里轮询标记直到全部模块导入完成：既消除竞态，也保证用例拿到完整种子数据。
 * 连接参数与 test/global-setup.js 保持一致（支持同名 env 覆盖）。
 */
async function waitSeedImport(app: any) {
  const modules: string[] =
    (await app.getApplicationContext().getAsync(CoolModuleConfig)).modules || [];
  // 只有带 db.json 的模块才参与种子导入并写入 init_db_<module> 标记
  // （CoolModuleImport.initDataBase 对无 db.json 的模块直接跳过，不写标记）
  const seedModules = modules.filter(m =>
    fs.existsSync(path.join(__dirname, '..', 'src', 'modules', m, 'db.json'))
  );
  if (seedModules.length === 0) {
    return;
  }
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: 'wudong_platform_test',
  });
  try {
    const deadline = Date.now() + 60_000;
    const placeholders = seedModules.map(() => '?').join(',');
    while (Date.now() < deadline) {
      let done = 0;
      try {
        const [rows]: any = await conn.query(
          `SELECT COUNT(DISTINCT cKey) AS cnt FROM base_sys_conf
           WHERE cKey IN (${placeholders})`,
          seedModules.map(m => `init_db_${m}`)
        );
        done = Number(rows[0]?.cnt || 0);
      } catch {
        // 表尚未就绪等瞬时错误，继续重试
      }
      if (done >= seedModules.length) {
        return;
      }
      await new Promise(r => setTimeout(r, 300));
    }
    throw new Error(
      `等待模块种子导入超时(60s)：期望 ${seedModules.length} 个模块 [${seedModules.join(
        ','
      )}]，base_sys_conf 中未见全部 init_db_* 标记，可能种子导入在 src 世界报错`
    );
  } finally {
    await conn.end();
  }
}

/** 启动完整应用（unittest 环境自动读取 src/config/config.unittest.ts）
 *  注：@midwayjs/mock 3.20 的 createApp 签名为 (baseDir?, options?, customFramework?)，
 *  框架作为泛型参数传入：createApp<Framework>() */
export async function boot() {
  const app: any = await createApp<Framework>();
  await waitSeedImport(app);
  return app;
}

/** 携带 C 端 token 的请求头（脚手架中间件直接读取裸 token，无 Bearer 前缀） */
export function auth(token: string) {
  return { Authorization: token };
}
