import * as mysql from 'mysql2/promise';
import { boot, close } from './helper';

describe('member 实体自动建表', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it('member_user / member_sms_code / user_favorite 三张表存在', async () => {
    // 应用启动（synchronize: true）应自动创建三张表，用原生连接直接查 information_schema
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3307,
      user: 'root',
      password: '123456',
      database: 'wudong_platform_test',
    });
    const [rows]: any = await conn.query(
      `SELECT COUNT(*) AS c FROM information_schema.tables
       WHERE table_schema = 'wudong_platform_test'
         AND table_name IN ('member_user', 'member_sms_code', 'user_favorite')`
    );
    await conn.end();
    expect(Number(rows[0].c)).toBe(3);
  });
});
