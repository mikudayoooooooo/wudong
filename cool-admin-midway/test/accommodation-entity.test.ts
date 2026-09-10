import * as mysql from 'mysql2/promise';
import { boot, close } from './helper';

describe('accommodation 实体自动建表', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
  });

  afterAll(async () => {
    await close(app);
  });

  it('hotel / room_type / room_calendar 三表存在且关键列 camelCase', async () => {
    const conn = await mysql.createConnection({
      host: '127.0.0.1', port: 3307, user: 'root',
      password: '123456', database: 'wudong_platform_test',
    });
    const [tables]: any = await conn.query(
      `SELECT COUNT(*) c FROM information_schema.tables
       WHERE table_schema='wudong_platform_test'
         AND table_name IN ('hotel','room_type','room_calendar')`
    );
    expect(Number(tables[0].c)).toBe(3);
    const [cols]: any = await conn.query(
      `SELECT table_name, column_name FROM information_schema.columns
       WHERE table_schema='wudong_platform_test'
         AND ((table_name='hotel' AND column_name IN ('merchantId','name','styleTags','longitude','status'))
           OR (table_name='room_type' AND column_name IN ('hotelId','price','stock','maxGuests'))
           OR (table_name='room_calendar' AND column_name IN ('roomTypeId','date','availableStock','price','status')))`
    );
    expect(cols.length).toBe(14);
    const [uk]: any = await conn.query(
      `SELECT COUNT(*) c FROM information_schema.statistics
       WHERE table_schema='wudong_platform_test' AND table_name='room_calendar'
         AND index_name='uk_room_calendar_roomTypeId_date' AND non_unique=0`
    );
    expect(Number(uk[0].c)).toBeGreaterThan(0);
    await conn.end();
  });
});
