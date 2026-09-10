import * as mysql from 'mysql2/promise';
import { boot, close, createHttpRequest } from './helper';

describe('operate 平台运营', () => {
  let app;

  beforeAll(async () => {
    app = await boot();
    // unittest 无 admin 会话，管理端数据用 service 直插模拟
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3307,
      user: 'root',
      password: '123456',
      database: 'wudong_platform_test',
    });
    // 前置清理：套件顺序无关（jest 时长优先排序可能把其它 operate 套件排到本套件之前）
    await conn.query('DELETE FROM banner');
    await conn.query('DELETE FROM announcement');
    await conn.query(
      "INSERT INTO banner (title, image, linkType, linkValue, position, sort, status, createTime, updateTime) VALUES ('首页焦点A', 'http://img/a.png', 'page', '/pages/route/1', 'home', 1, 1, NOW(), NOW())"
    );
    await conn.query(
      "INSERT INTO banner (title, image, linkType, linkValue, position, sort, status, createTime, updateTime) VALUES ('首页焦点B', 'http://img/b.png', 'none', NULL, 'home', 2, 1, NOW(), NOW())"
    );
    await conn.query(
      "INSERT INTO banner (title, image, linkType, linkValue, position, sort, status, createTime, updateTime) VALUES ('商品页横幅', 'http://img/c.png', 'url', 'https://wudong.cn', 'product', 1, 1, NOW(), NOW())"
    );
    await conn.query(
      "INSERT INTO banner (title, image, linkType, linkValue, position, sort, status, createTime, updateTime) VALUES ('已禁用位', 'http://img/d.png', 'none', NULL, 'home', 0, 0, NOW(), NOW())"
    );
    await conn.query(
      "INSERT INTO announcement (title, content, type, isTop, status, createdBy, createTime, updateTime) VALUES ('置顶公告', '平台上线', 1, 1, 1, 1, NOW(), NOW())"
    );
    await conn.query(
      "INSERT INTO announcement (title, content, type, isTop, status, createdBy, createTime, updateTime) VALUES ('普通公告', '国庆活动', 2, 0, 1, 1, NOW(), NOW())"
    );
    await conn.query(
      "INSERT INTO announcement (title, content, type, isTop, status, createdBy, createTime, updateTime) VALUES ('草稿', '未发布', 1, 0, 0, 1, NOW(), NOW())"
    );
    await conn.end();
  });

  afterAll(async () => {
    await close(app);
  });

  it('匿名按 position 查启用 banner，禁用不出现', async () => {
    const res = await createHttpRequest(app).get(
      '/app/operate/banner/list?position=home'
    );
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1000);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].title).toBe('首页焦点A');
    expect(res.body.data.every((b: any) => b.position === 'home')).toBe(true);
  });

  it('product 位的 banner', async () => {
    const res = await createHttpRequest(app).get(
      '/app/operate/banner/list?position=product'
    );
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('商品页横幅');
  });

  it('匿名查公告：置顶优先且草稿不出现', async () => {
    const res = await createHttpRequest(app).get(
      '/app/operate/announcement/list'
    );
    expect(res.body.code).toBe(1000);
    expect(res.body.data.length).toBe(2);
    expect(res.body.data[0].title).toBe('置顶公告');
  });

  it('finance_record 表存在', async () => {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3307,
      user: 'root',
      password: '123456',
      database: 'wudong_platform_test',
    });
    const [rows]: any = await conn.query(
      "SELECT COUNT(*) AS c FROM information_schema.tables WHERE table_schema = 'wudong_platform_test' AND table_name = 'finance_record'"
    );
    await conn.end();
    expect(Number(rows[0].c)).toBe(1);
  });

  it('管理端三个路由未登录返回401', async () => {
    for (const p of [
      '/admin/operate/banner/page?page=1&size=1',
      '/admin/operate/announcement/page?page=1&size=1',
      '/admin/operate/finance/page?page=1&size=1',
    ]) {
      const res = await createHttpRequest(app).get(p);
      expect(res.status).toBe(401);
    }
  });
});
