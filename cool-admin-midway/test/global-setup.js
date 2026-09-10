const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

/**
 * jest globalSetup：每次运行测试前重建测试库，保证用例可重复执行
 * 连接参数与 src/config/config.unittest.ts 保持一致
 * （本机 3306 被另一个 MySQL 实例占用，项目数据库在 docker wudong-mysql 的 3307 端口）
 */
module.exports = async () => {
  // 清理 dist：cool 的模块系统固定从 <项目>/dist 读模块配置与中间件，
  // 而 jest 通过 ts-jest 从 src 启动，若 dist 残留会导致 src/dist 两套类混用、
  // 容器内 DefinitionNotFound（表现为路由 500 / DI 报错，且报错对象随机）。
  // dist 是 gitignore 的构建产物，npm run dev/build 会自动重新生成。
  fs.rmSync(path.join(__dirname, '..', 'dist'), { recursive: true, force: true });

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '123456',
  });
  await conn.query('DROP DATABASE IF EXISTS wudong_platform_test');
  await conn.query(
    'CREATE DATABASE wudong_platform_test DEFAULT CHARACTER SET utf8mb4'
  );
  await conn.end();
};
