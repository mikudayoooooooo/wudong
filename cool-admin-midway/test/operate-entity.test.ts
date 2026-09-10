import * as mysql from 'mysql2/promise';
import { boot, close } from './helper';

describe('operate 实体自动建表', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it('banner / announcement / finance_record 三表存在且关键列 camelCase', async () => {
    const conn = await mysql.createConnection({
      host: '127.0.0.1', port: 3307, user: 'root',
      password: '123456', database: 'wudong_platform_test',
    });
    const [tables]: any = await conn.query(
      `SELECT COUNT(*) c FROM information_schema.tables
       WHERE table_schema='wudong_platform_test'
         AND table_name IN ('banner','announcement','finance_record')`
    );
    expect(Number(tables[0].c)).toBe(3);
    const [cols]: any = await conn.query(
      `SELECT table_name, column_name FROM information_schema.columns
       WHERE table_schema='wudong_platform_test'
         AND ((table_name='banner' AND column_name IN ('title','image','linkType','position','sort','startTime','status'))
           OR (table_name='announcement' AND column_name IN ('title','content','isTop','status','createdBy'))
           OR (table_name='finance_record' AND column_name IN ('orderId','merchantId','commissionRate','settlementStatus')))`
    );
    expect(cols.length).toBe(16);
    await conn.end();
  });
});
