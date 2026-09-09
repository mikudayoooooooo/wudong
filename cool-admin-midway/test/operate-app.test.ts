import * as mysql from 'mysql2/promise';
import { boot, close, createHttpRequest } from './helper';

async function seed() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1', port: 3307, user: 'root', password: '123456',
    database: 'wudong_platform_test',
  });
  const t = '2026-09-01 00:00:00';
  const f = '2099-12-31 23:59:59';
  // home 位：有效启用 x2（sort 1、2）+ 禁用 x1；startTime/endTime/createTime/updateTime 用 ? 占位
  await conn.query(
    `INSERT INTO banner (title,image,linkType,linkValue,position,sort,startTime,endTime,status,createTime,updateTime) VALUES
     ('苗寨金秋','b1.jpg','page','/x','home',2,?,?,1,?,?),
     ('非遗节','b2.jpg','none',NULL,'home',1,?,?,1,?,?),
     ('禁用条','b3.jpg','none',NULL,'home',3,?,?,0,?,?)`,
    [t, f, t, t, t, f, t, t, t, f, t, t]
  );
  // 公告：置顶发布 x1、草稿 x1、活动发布 x1
  await conn.query(
    `INSERT INTO announcement (title,content,type,startTime,endTime,isTop,status,createdBy,createTime,updateTime) VALUES
     ('系统维护通知','将于夜间维护',1,?,?,1,1,1,?,?),
     ('草稿公告','未发布',1,NULL,NULL,0,0,1,?,?),
     ('活动招募','集市活动',2,?,?,0,1,1,?,?)`,
    [t, f, t, t, t, t, t, f, t, t]
  );
  await conn.end();
}

describe('operate C 端匿名下发', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
    await seed();
  });

  afterAll(async () => {
    await close(app);
  });

  it('banner 匿名下发：home 启用且在时间窗内，按 sort 升序', async () => {
    const res = await createHttpRequest(app).get('/app/operate/banner?position=home');
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1000);
    const list = res.body.data;
    expect(list.length).toBe(2);
    expect(list[0].title).toBe('非遗节'); // sort=1
    expect(list[1].title).toBe('苗寨金秋'); // sort=2
  });

  it('announcement 匿名下发：发布态+时间窗内，置顶优先', async () => {
    const res = await createHttpRequest(app).get('/app/operate/announcement');
    expect(res.body.code).toBe(1000);
    const list = res.body.data;
    expect(list.length).toBe(2); // 草稿被排除
    expect(list[0].title).toBe('系统维护通知'); // isTop=1
  });

  it('announcement 支持 type 过滤', async () => {
    const res = await createHttpRequest(app).get('/app/operate/announcement?type=2');
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('活动招募');
  });
});
