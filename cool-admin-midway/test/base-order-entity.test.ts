import * as mysql from 'mysql2/promise';
import { boot, close } from './helper';

const TABLES = [
  'order',
  'order_product',
  'order_reservation',
  'order_ticket',
  'payment_record',
];

describe('order/pay 实体自动建表', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it('五张表存在', async () => {
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
         AND table_name IN (?)`,
      [TABLES]
    );
    await conn.end();
    expect(Number(rows[0].c)).toBe(5);
  });
});
