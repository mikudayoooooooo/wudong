import * as mysql from 'mysql2/promise';
import { boot, close, createHttpRequest } from './helper';

const DB = { host: '127.0.0.1', port: 3307, user: 'root', password: '123456', database: 'wudong_platform_test' };

async function seed() {
  const conn = await mysql.createConnection(DB);
  // 清空本 seed 涉及的表，保证与其它 suite（如 accommodation-room-calendar 先建 status=1 民宿）
  // 的执行顺序无关；无外键约束，DELETE 顺序任意。不重置自增——断言只数行数且返回 insertId。
  await conn.query('DELETE FROM room_calendar');
  await conn.query('DELETE FROM room_type');
  await conn.query('DELETE FROM hotel');
  const t = '2026-09-01 00:00:00';
  // A：上架苗寨木楼（2 个启用房型，最低 380）；B：下架客栈（不应出现在搜索）
  const [h] = await conn.query(
    `INSERT INTO hotel (merchantId,name,address,longitude,latitude,styleTags,facilityTags,mainImage,intro,rating,status,createTime,updateTime) VALUES
     (1,'乌东苗寨木楼','雷山县乌东村',108.10,26.30,'["苗寨","江景"]','["WiFi","空调"]','a.jpg','吊脚楼',4.80,1,?,?),
     (1,'普通客栈','乌东村口',108.11,26.31,'["经济"]','["WiFi"]',NULL,NULL,4.00,0,?,?)`,
    [t, t, t, t]
  );
  const hotelA = (h as any).insertId;
  const [rt] = await conn.query(
    `INSERT INTO room_type (hotelId,name,bedType,maxGuests,price,stock,status,createTime,updateTime) VALUES
     (?, '木屋大床房','大床',2,380.00,3,1,?,?),
     (?, '吊脚楼双床房','双床',2,520.00,2,1,?,?),
     (?, '经济房','单床',1,120.00,5,1,?,?)`,
    [hotelA, t, t, hotelA, t, t, (h as any).insertId + 1, t, t]
  );
  const rtA = (rt as any).insertId; // 第一个房型 id
  // rtA：10-01 剩 2 间 520，10-02 满 0 间；10-03 无记录 → 回退默认
  await conn.query(
    `INSERT INTO room_calendar (roomTypeId,date,availableStock,price,status,createTime,updateTime) VALUES
     (?, '2026-10-01', 2, 520.00, 1, ?, ?),
     (?, '2026-10-02', 0, 520.00, 1, ?, ?)`,
    [rtA, t, t, rtA, t, t]
  );
  await conn.end();
  return { hotelA, hotelB: (h as any).insertId + 1, rtA };
}

describe('accommodation C 端浏览（匿名 IGNORE_TOKEN）', () => {
  let app;
  let ids;

  beforeAll(async () => {
    app = await boot();
    ids = await seed();
  });

  afterAll(async () => {
    await close(app);
  });

  it('search 只返回上架的民宿，且匿名可访问', async () => {
    const res = await createHttpRequest(app).get('/app/accommodation/hotel/search?page=1&size=10');
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1000);
    expect(res.body.data.total).toBe(1);
    expect(res.body.data.list[0].name).toBe('乌东苗寨木楼');
  });

  it('search 支持风格标签过滤与价格带过滤', async () => {
    // 注：URL 查询值走 node http 客户端需百分号编码（raw 中文触发 ERR_UNESCAPED_CHARACTERS），
    // 服务端 qs 解码后 styleTags 仍为 '江景'，语义与手写 URL 完全一致
    const tagged = await createHttpRequest(app).get(
      `/app/accommodation/hotel/search?styleTags=${encodeURIComponent('江景')}`
    );
    expect(tagged.body.data.total).toBe(1);

    // 民宿最低房型价 380：≤400 命中，≥500 不命中
    const max400 = await createHttpRequest(app).get(
      '/app/accommodation/hotel/search?maxPrice=400'
    );
    expect(max400.body.data.total).toBe(1);
    expect(String(max400.body.data.list[0].minPrice)).toBe('380.00');

    const min500 = await createHttpRequest(app).get(
      '/app/accommodation/hotel/search?minPrice=500'
    );
    expect(min500.body.data.total).toBe(0);
  });

  it('detail 返回民宿信息与启用房型列表', async () => {
    const res = await createHttpRequest(app).get(
      `/app/accommodation/hotel/detail?id=${ids.hotelA}`
    );
    expect(res.body.code).toBe(1000);
    expect(res.body.data.info.name).toBe('乌东苗寨木楼');
    expect(res.body.data.roomTypes.length).toBe(2);
  });

  it('room-type calendar 匿名返回逐日房态（缺失日回退默认价/满库）', async () => {
    const res = await createHttpRequest(app).get(
      `/app/accommodation/room-type/calendar?roomTypeId=${ids.rtA}&startDate=2026-10-01&endDate=2026-10-03`
    );
    expect(res.body.code).toBe(1000);
    const days = res.body.data;
    expect(days.length).toBe(3);
    expect(days[0].date).toBe('2026-10-01');
    expect(days[2].date).toBe('2026-10-03');
    expect(String(days[2].price)).toBe('380.00'); // 回退房型基础价
    expect(days[1].availableStock).toBe(0); // 已满
  });
});
