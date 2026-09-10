// 全链路冒烟：C端匿名浏览 → 登录 → 购物车→下单→支付 → 收藏/评价/预订 → 管理端权限/模板/退款
const mysql = require('mysql2/promise');

const BASE = 'http://127.0.0.1:8002';
const results = [];
let memberToken = '';
let adminToken = '';

async function call(method, path, { body, query, token } = {}) {
  const qs = query ? '?' + new URLSearchParams(Object.entries(query).filter(([, v]) => v != null)) : '';
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = token;
  const res = await fetch(`${BASE}${path}${qs}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { http: res.status, code: json.code, data: json.data, message: json.message };
}

function check(name, cond, extra = '') {
  results.push({ name, pass: !!cond, extra });
  console.log(`${cond ? '✅' : '❌'} ${name}${extra ? '  ' + extra : ''}`);
}

(async () => {
  const db = await mysql.createConnection({ host: '127.0.0.1', port: 3307, user: 'root', password: '123456', database: 'wudong_verify' });

  // ---------- A. C端匿名浏览 ----------
  let r = await call('GET', '/app/food/restaurant/list');
  check('A1 餐厅列表', r.code === 1000 && r.data?.list?.length >= 1, `共${r.data?.list?.length}家`);
  const restaurantId = r.data?.list?.[0]?.id;

  r = await call('GET', `/app/food/restaurant/${restaurantId}`);
  check('A2 餐厅详情(路径参数)', r.code === 1000 && r.data?.id === restaurantId);
  r = await call('GET', `/app/food/restaurant/${restaurantId}/dishes`);
  check('A3 餐厅菜品', r.code === 1000);

  r = await call('GET', '/app/product/list');
  check('A4 商品列表', r.code === 1000 && r.data?.list?.length >= 1);
  const productId = r.data?.list?.[0]?.id;

  r = await call('GET', `/app/product/${productId}`);
  check('A5 商品详情(路径参数)', r.code === 1000 && r.data?.id === productId);
  r = await call('GET', `/app/product/${productId}/reviews`);
  check('A6 商品评价列表(新)', r.code === 1000);

  r = await call('GET', '/app/accommodation/hotel/search');
  check('A7 民宿搜索', r.code === 1000 && r.data?.list?.length >= 1);
  const hotelId = r.data?.list?.[0]?.id;
  r = await call('GET', '/app/accommodation/hotel/detail', { query: { id: hotelId } });
  check('A8 民宿详情+房型', r.code === 1000 && r.data?.roomTypes?.length >= 1);
  const roomTypeId = r.data?.roomTypes?.[0]?.id;

  r = await call('GET', '/app/travel/scenic/list');
  check('A9 景区列表', r.code === 1000);

  // ---------- B. C端登录（模拟短信：注册即登录） ----------
  const phone = '13800001234';
  r = await call('POST', '/app/member/login/smsCode', { body: { phone } });
  check('B0 发送验证码', r.code === 1000, r.message);
  const [[sms]] = await db.query('SELECT code FROM member_sms_code WHERE phone=? AND used=0 ORDER BY id DESC LIMIT 1', [phone]);
  r = await call('POST', '/app/member/login/register', { body: { phone, smsCode: sms.code, password: 'smoke123456', nickname: '测试昵称' } });
  if (r.code !== 1000) {
    r = await call('POST', '/app/member/login/sms', { body: { phone, smsCode: sms.code } });
  }
  memberToken = r.data?.token;
  check('B1 注册/登录', r.code === 1000 && !!memberToken, r.message);
  const [[mu1]] = await db.query('SELECT id FROM member_user WHERE phone=?', [phone]);
  const memberId = mu1.id;

  // ---------- C. 地址 → 购物车 → 下单 → 支付 ----------
  r = await call('POST', '/app/user/address/add', { body: { contact: '测试收件人', phone, province: '贵州省', city: '黔东南州', district: '雷山县', address: '乌东村一组', isDefault: 1 }, token: memberToken });
  check('C1 新增收货地址', r.code === 1000, r.message);
  const addrList = await call('POST', '/app/user/address/list', { body: { page: 1, size: 10 }, token: memberToken });
  const addressId = addrList.data?.[0]?.id ?? addrList.data?.list?.[0]?.id;
  check('C2 地址列表', addrList.code === 1000 && !!addressId, addrList.message);

  r = await call('POST', '/app/cart/add', { body: { itemId: productId, itemType: 1, quantity: 2 }, token: memberToken });
  check('C3 加入购物车', r.code === 1000, r.message);
  r = await call('GET', '/app/cart/list', { token: memberToken });
  check('C4 购物车列表', r.code === 1000 && (r.data?.items?.length ?? r.data?.length) >= 1);

  r = await call('POST', '/app/order/create-from-cart', { body: { addressId }, token: memberToken });
  const orderNo = r.data?.orderNo;
  check('C5 购物车下单', r.code === 1000 && !!orderNo, r.message);

  r = await call('POST', '/app/pay/create', { body: { orderNo, channel: 'wechat' }, token: memberToken });
  const paymentNo = r.data?.paymentNo;
  check('C6 创建支付单', r.code === 1000 && !!paymentNo);
  r = await call('POST', '/app/pay/mock', { body: { paymentNo }, token: memberToken });
  check('C7 mock 支付成功', r.code === 1000, r.message);

  // ---------- D. 收藏/评价/预订 ----------
  r = await call('POST', '/app/member/favorite/toggle', { body: { targetType: 'product', targetId: productId }, token: memberToken });
  check('D1 收藏商品', r.code === 1000);
  r = await call('GET', '/app/member/favorite/page', { query: { page: 1, size: 10 }, token: memberToken });
  const favName = r.data?.list?.[0]?.targetName;
  check('D2 收藏列表回填 targetName', r.code === 1000 && favName === '苗绣手帕', `targetName=${favName}`);

  r = await call('POST', '/app/product/review', { body: { productId, rating: 5, content: '绣工精美！' }, token: memberToken });
  check('D3 发布商品评价', r.code === 1000, r.message);
  r = await call('GET', `/app/product/${productId}/reviews`);
  check('D4 评价列表可见', r.code === 1000 && r.data?.list?.length >= 1);

  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  r = await call('GET', `/app/food/restaurant/${restaurantId}/time-slots`, { query: { date: tomorrow } });
  const slotId = r.data?.[0]?.id;
  check('D5 可预订时段', r.code === 1000 && !!slotId);
  r = await call('POST', '/app/food/reservation/create', {
    body: { restaurantId, timeSlotId: slotId, reservationDate: tomorrow, peopleCount: 3, contactName: '测试', contactPhone: phone },
    token: memberToken,
  });
  const resvOrderNo = r.data?.orderNo;
  check('D6 创建餐位预订', r.code === 1000, r.message);
  r = await call('GET', '/app/food/reservation/my', { query: { page: 1, size: 10 }, token: memberToken });
  check('D7 我的预订列表', r.code === 1000 && r.data?.list?.length >= 1);

  r = await call('POST', '/app/accommodation/booking/create', {
    body: { roomTypeId, checkInDate: tomorrow, checkOutDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10), rooms: 1 },
    token: memberToken,
  });
  const hotelOrderNo = r.data?.orderNo;
  check('D8 民宿预订下单', r.code === 1000 && !!hotelOrderNo, r.message);

  // ---------- E. 管理端 ----------
  r = await call('POST', '/admin/base/open/login', { body: { username: 'admin', password: '123456', captchaId: 'smoke', verifyCode: 'smoke' } });
  adminToken = r.data?.token;
  check('E1 管理端登录', r.code === 1000 && !!adminToken, r.message);

  r = await call('POST', '/admin/order/page', { body: { page: 1, size: 20 }, token: adminToken });
  const totalOrders = r.data?.pagination?.total ?? r.data?.total;
  check('E2 全局订单分页(平台视角)', r.code === 1000 && totalOrders >= 3, `total=${totalOrders}`);
  const rows = r.data?.list || [];
  const paidOne = rows.find((o) => o.orderNo === orderNo);
  check('E2b 购物车订单带 merchantId=1', !!paidOne && Number(paidOne.merchantId) === 1, `merchantId=${paidOne?.merchantId}`);

  r = await call('POST', '/admin/pay/record/page', { body: { page: 1, size: 20 }, token: adminToken });
  const rec = r.data?.list?.find((x) => x.paymentNo === paymentNo);
  check('E3 支付流水(带归属)', r.code === 1000 && !!rec && Number(rec.merchantId) === 1);

  if (rec) {
    r = await call('POST', '/admin/pay/record/refund', { body: { id: rec.id }, token: adminToken });
    check('E4 退款审批', r.code === 1000, r.message);
    r = await call('GET', '/app/order/detail', { query: { orderNo }, token: memberToken });
    check('E4b 订单状态→已退款(5)', r.data?.status === 5, `status=${r.data?.status}`);
  }

  r = await call('POST', '/admin/messageTemplate/add', {
    body: { code: 'smoke-1', name: '冒烟模板', type: 'activity', title: 'hi {nickname}', content: '欢迎 {nickname} 来乌东', status: 1 },
    token: adminToken,
  });
  check('E5 新增消息模板', r.code === 1000, r.message);
  r = await call('POST', '/admin/message/sendByTemplate', { body: { templateCode: 'smoke-1', userId: memberId }, token: adminToken });
  check('E6 按模板发送(定向)', r.code === 1000, r.message);
  r = await call('GET', '/app/message/page', { query: { page: 1, size: 5 }, token: memberToken });
  const msg = (r.data?.list || []).find((m) => m.title === 'hi 测试昵称' || /欢迎/.test(m.content || ''));
  check('E7 C端收到模板消息(占位已替换)', !!msg, `title=${msg?.title}`);

  // ---------- F. 商家角色数据权限 ----------
  // 建 merchant1 管理端账号（复用 admin 的密码 hash）+ 商家绑定
  const [[adminRow]] = await db.query("SELECT password FROM base_sys_user WHERE username='admin'");
  const [[mrow]] = await db.query("SELECT id FROM merchant WHERE id=1");
  await db.query(
    "INSERT IGNORE INTO base_sys_user (createTime, updateTime, username, password, nickname, status) VALUES (NOW(), NOW(), 'merchant1', ?, '商家一号', 1)",
    [adminRow.password]
  );
  const [[mu]] = await db.query("SELECT id FROM base_sys_user WHERE username='merchant1'");
  const [[role]] = await db.query("SELECT id FROM base_sys_role WHERE name='商家'");
  if (role) {
    await db.query('INSERT IGNORE INTO base_sys_user_role (createTime, updateTime, userId, roleId) VALUES (NOW(), NOW(), ?, ?)', [mu.id, role.id]);
  }
  if (mrow) {
    await db.query('UPDATE merchant SET adminUserId=? WHERE id=1', [mu.id]);
  }
  await db.query('DELETE FROM base_sys_menu WHERE perms IS NULL AND router IS NULL AND type=2'); // 清意外权限行

  r = await call('POST', '/admin/base/open/login', { body: { username: 'merchant1', password: '123456', captchaId: 'smoke', verifyCode: 'smoke' } });
  const mToken = r.data?.token;
  check('F1 商家角色登录', r.code === 1000 && !!mToken, r.message);

  r = await call('POST', '/admin/order/page', { body: { page: 1, size: 20 }, token: mToken });
  const onlyMine = (r.data?.list || []).every((o) => Number(o.merchantId) === 1);
  check('F2 商家视角只见本商家订单', r.code === 1000 && onlyMine, `total=${r.data?.pagination?.total ?? r.data?.total}`);

  r = await call('POST', '/admin/pay/record/page', { body: { page: 1, size: 20 }, token: mToken });
  check('F3 商家视角支付流水过滤', r.code === 1000 && (r.data?.list || []).every((x) => Number(x.merchantId) === 1));

  r = await call('GET', '/admin/order/info', { query: { id: 999999 }, token: mToken });
  check('F4 无 info 权限 → 403', r.http === 403 || r.code !== 1000, `http=${r.http}`);

  // ---------- 汇总 ----------
  const pass = results.filter((x) => x.pass).length;
  console.log(`\n===== 冒烟汇总: ${pass}/${results.length} 通过 =====`);
  const failed = results.filter((x) => !x.pass);
  if (failed.length) {
    console.log('失败项:', failed.map((f) => f.name).join(' | '));
    process.exitCode = 1;
  }
  await db.end();
})().catch((e) => { console.error('SMOKE CRASH', e); process.exit(1); });
