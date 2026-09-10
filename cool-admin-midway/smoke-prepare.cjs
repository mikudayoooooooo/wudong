// 冒烟准备：执行菜单 SQL + 灌最小种子数据（wudong_verify）
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const ROOT = path.resolve(__dirname, '..');
const SQL_DIR = path.join(ROOT, 'docs', 'database');

(async () => {
  const c = await mysql.createConnection({
    host: '127.0.0.1', port: 3307, user: 'root', password: '123456',
    database: 'wudong_verify', multipleStatements: true,
  });

  // 1) 菜单 SQL（按依赖顺序）
  const files = [
    '2026-09-09-accommodation-operate-menus.sql',
    '2026-09-09-base-admin-menus.sql',
    '2026-09-10-travel-community-admin-menus.sql',
    '2026-09-10-merchant-role-admin-menus.sql',
    '2026-09-10-food-product-admin-menus.sql',
    '2026-09-10-member-user-menus.sql',
    '2026-09-10-message-template-menus.sql',
  ];
  for (const f of files) {
    const sql = fs.readFileSync(path.join(SQL_DIR, f), 'utf8');
    // 先剥掉整行注释再切分（否则注释头会黏住 DELETE 导致其被过滤）
    const cleaned = sql.split('\n').filter(l => !l.trim().startsWith('--')).join('\n');
    const stmts = cleaned.split(/;\s*\n/).map(s => s.trim()).filter(Boolean);
    let ok = 0, fail = 0;
    for (const st of stmts) {
      try { await c.query(st); ok++; }
      catch (e) { fail++; console.log('  语句失败:', f, '|', e.message.slice(0, 80), '|', st.slice(0, 60).replace(/\n/g, ' ')); }
    }
    console.log(`SQL ${fail ? 'PART' : 'OK  '}: ${f} (${ok}/${stmts.length})`);
  }

  // 2) 清理成员/交易数据（保证冒烟可重复）
  await c.query('SET FOREIGN_KEY_CHECKS=0');
  for (const t of ['user_favorite','product_review','food_reservation','cart_item','payment_record','order_product','order_reservation','order_ticket','`order`','user_address','member_sms_code','member_user','system_message','message_template']) {
    await c.query(`DELETE FROM ${t}`);
  }
  await c.query("DELETE FROM base_sys_user WHERE username='merchant1'");
  await c.query('UPDATE merchant SET adminUserId=NULL');
  await c.query('SET FOREIGN_KEY_CHECKS=1');

  // 3) 最小种子（幂等：先清后插）
  await c.query('DELETE FROM time_slot'); await c.query('DELETE FROM restaurant');
  await c.query('DELETE FROM travel_ticket_type'); await c.query('DELETE FROM travel_scenic_spot');
  await c.query('DELETE FROM travel_route_package');
  await c.query('DELETE FROM product'); await c.query('DELETE FROM product_category'); await c.query('DELETE FROM room_type'); await c.query('DELETE FROM hotel');

  const [r1] = await c.query(
    "INSERT INTO restaurant (createTime, updateTime, merchantId, name, coverImage, address, phone, avgPrice, rating, status) VALUES (NOW(), NOW(), 1,'苗寨酸汤鱼餐厅','/img/r1.jpg','乌东村一组', '13800000001', 68.00, 4.7, 1)"
  );
  await c.query(
    `INSERT INTO time_slot (createTime, updateTime, restaurantId, date, timePeriod, startTime, endTime, maxReservations) VALUES
     (NOW(), NOW(), ${r1.insertId}, DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 DAY),'%Y-%m-%d'), '午餐', '11:30', '13:30', 10),
     (NOW(), NOW(), ${r1.insertId}, DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 DAY),'%Y-%m-%d'), '晚餐', '17:30', '20:00', 10)`
  );
  const [s1] = await c.query(
    "INSERT INTO travel_scenic_spot (createTime, updateTime, name, type, address, intro, status) VALUES (NOW(), NOW(),'乌东梯田观景台','spot','乌东村后山','百年梯田',1)"
  );
  await c.query(
    `INSERT INTO travel_ticket_type (createTime, updateTime, scenicSpotId, name, price, totalStock, status) VALUES (NOW(), NOW(), ${s1.insertId}, '成人票', 60.00, 100, 1)`
  );
  await c.query(
    "INSERT INTO travel_route_package (createTime, updateTime, title, days, theme, price, status) VALUES (NOW(), NOW(),'苗寨深度两日游', 2, '经典', 599.00, 1)"
  );
  const [cat] = await c.query(
    "INSERT INTO product_category (createTime, updateTime, name, status) VALUES (NOW(), NOW(), '非遗手作', 1)"
  );
  const [p1] = await c.query(
    "INSERT INTO product (createTime, updateTime, merchantId, categoryId, name, coverImage, price, stock, status, sales) VALUES (NOW(), NOW(), 1, ?, '苗绣手帕', '/img/p1.jpg', 128.00, 50, 1, 12)",
    [cat.insertId]
  );
  const [h1] = await c.query(
    "INSERT INTO hotel (createTime, updateTime, merchantId, name, address, longitude, latitude, status) VALUES (NOW(), NOW(), 1,'乌东木楼民宿','乌东村一组', 108.500000, 26.400000, 1)"
  );
  await c.query(
    `INSERT INTO room_type (createTime, updateTime, hotelId, name, bedType, maxGuests, price, stock, status) VALUES (NOW(), NOW(), ${h1.insertId}, '苗族木屋大床房', '大床', 2, 380.00, 3, 1)`
  );
  console.log('种子完成: restaurant/time-slot/scenic/ticket/route/product/hotel/room_type');
  await c.end();
})().catch((e) => { console.error('PREPARE FAIL', e.message); process.exit(1); });
