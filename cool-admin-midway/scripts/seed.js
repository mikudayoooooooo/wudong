/**
 * 乌东演示数据种子脚本（幂等：按范围先删后插）
 * 用法：node scripts/seed.js   （连接 127.0.0.1:3307/wudong_platform，可用环境变量覆盖）
 * 范围：travel_/community_ 表 + 指定测试手机号用户 + operate banner/announcement
 */
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const DB = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3307),
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_DATABASE || 'wudong_platform',
};

async function main() {
  const conn = await mysql.createConnection(DB);
  console.log('connected', DB.database);

  // ---- 清理（限定范围）----
  await conn.query(`SET FOREIGN_KEY_CHECKS=0`);
  for (const t of [
    'travel_scenic_spot', 'travel_ticket_type', 'travel_route_package',
    'travel_route_itinerary', 'travel_inventory', 'travel_e_ticket',
    'travel_traffic_guide', 'travel_review', 'travel_recommend_slot',
    'community_post', 'community_post_footprint', 'community_comment',
    'community_topic', 'community_topic_follow', 'community_follow',
    'community_like', 'community_report', 'community_message',
    'banner', 'announcement',
  ]) {
    await conn.query(`TRUNCATE TABLE \`${t}\``);
  }
  await conn.query(`DELETE FROM \`order\` WHERE module='travel'`);
  await conn.query(`DELETE FROM order_ticket`);
  await conn.query(`DELETE FROM payment_record`);
  await conn.query(`DELETE FROM member_user WHERE phone LIKE '138000000%'`);
  await conn.query(`SET FOREIGN_KEY_CHECKS=1`);

  const now = new Date(Date.now() + 8 * 3600 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  const ins = async (table, cols, rows) => {
    if (!rows.length) return;
    const placeholders = rows.map(() => `(${cols.map(() => '?').join(',')})`).join(',');
    const flat = rows.flat();
    await conn.query(
      `INSERT INTO \`${table}\` (${cols.map((c) => `\`${c}\``).join(',')}) VALUES ${placeholders}`,
      flat
    );
  };

  // ---- 用户（密码 abc123456；不固定 id，插后按手机号回查）----
  const hash = bcrypt.hashSync('abc123456', 10);
  await ins(
    'member_user',
    ['phone', 'password', 'nickname', 'avatar', 'gender', 'bio', 'status', 'role', 'createTime', 'updateTime'],
    [
      ['13800000001', hash, '山野小鱼', '🧑‍🌾', 1, '山野与烟火气都爱', 1, 1, now, now],
      ['13800000002', hash, '奶爸游记', '👨', 1, '带娃看世界', 1, 1, now, now],
      ['13800000003', hash, '快门手', '📷', 1, '只拍晨雾和夜晚', 1, 1, now, now],
      ['13800000004', hash, '干饭人小王', '🍚', 1, '为吃而行', 1, 1, now, now],
    ]
  );
  const [urows] = await conn.query(`SELECT id, phone FROM member_user WHERE phone LIKE '138000000%'`);
  const uid = {};
  for (const r of urows) uid[r.phone] = r.id;
  const U = (n) => uid[`1380000000${n}`];

  // ---- 景区 ----
  await ins('travel_scenic_spot',
    ['id', 'name', 'type', 'address', 'openTime', 'intro', 'mainImage', 'status', 'createTime', 'updateTime'],
    [
      [1, '乌东梯田', 'spot', '乌东村东岭', '全天', '晨雾六点十分从谷底漫上来', 'ph1', 1, now, now],
      [2, '银饰工坊', 'experience', '乌东村中街', '9:00-17:00', '非遗银饰锻造体验', 'ph2', 1, now, now],
      [3, '长桌宴', 'dining', '乌东村广场', '11:00-21:00', '苗家长桌宴 酸汤鱼', 'ph3', 1, now, now],
      [4, '吊脚楼民宿', 'stay', '乌东村北巷', '全天', '特色吊脚楼住宿', 'ph4', 1, now, now],
      [5, '蜡染坊', 'experience', '乌东村南巷', '9:00-17:00', '蜡染手作体验', 'ph5', 1, now, now],
      [6, '芦笙广场', 'spot', '乌东村中心', '全天', '节庆芦笙舞主场', 'ph6', 1, now, now],
    ]);

  // ---- 票种 ----
  await ins('travel_ticket_type',
    ['id', 'scenicSpotId', 'name', 'price', 'totalStock', 'validityRule', 'status', 'createTime', 'updateTime'],
    [
      [11, 1, '成人票', 40, 200, '当日有效', 1, now, now],
      [12, 2, '体验票', 60, 50, '预约日有效', 1, now, now],
      [13, 1, '家庭套票', 100, 300, '当日有效', 1, now, now],
    ]);

  // ---- 路线 ----
  await ins('travel_route_package',
    ['id', 'title', 'days', 'theme', 'price', 'includes', 'departure', 'destination', 'hotelStandard', 'mealStandard', 'notice', 'mainImage', 'sales', 'status', 'createTime', 'updateTime'],
    [
      [1, '苗寨深度两日游', 2, '经典', 899,
       JSON.stringify(['门票', '长桌宴', '民宿一晚', '导游']), '凯里南站', '乌东村',
       '吊脚楼特色民宿', '长桌宴 + 苗家早餐',
       '使用日期前24小时可退（扣10%手续费）；最少提前1天预订', 'ph1', 1284, 1, now, now],
      [2, '晨雾梯田摄影一日游', 1, '摄影', 299,
       JSON.stringify(['门票', '跟拍摄影点']), '凯里南站', '乌东村',
       '无住宿', '苗家午餐', '含早出发，请自备保暖', 'ph2', 487, 1, now, now],
    ]);

  // ---- 行程 ----
  await ins('travel_route_itinerary',
    ['id', 'routeId', 'dayNo', 'sort', 'description', 'scenicSpotId', 'createTime', 'updateTime'],
    [
      [101, 1, 1, 1, '梯田日出观景', 1, now, now],
      [102, 1, 1, 2, '长桌宴午餐', 3, now, now],
      [103, 1, 1, 3, '入住吊脚楼', 4, now, now],
      [104, 1, 2, 1, '银饰锻造体验', 2, now, now],
      [105, 1, 2, 2, '芦笙舞广场', 6, now, now],
      [106, 2, 1, 1, '晨雾拍摄', 1, now, now],
      [107, 2, 1, 2, '工坊人文扫街', 2, now, now],
    ]);

  // ---- 库存（含紧张/售罄日）----
  await ins('travel_inventory',
    ['itemType', 'itemId', 'useDate', 'total', 'sold', 'createTime', 'updateTime'],
    [
      ['route', 1, '2026-09-12', 30, 7, now, now],
      ['route', 1, '2026-09-13', 30, 22, now, now],
      ['route', 1, '2026-09-14', 30, 30, now, now],
      ['route', 2, '2026-09-12', 20, 3, now, now],
      ['route', 2, '2026-09-13', 20, 12, now, now],
      ['ticket', 11, '2026-09-12', 200, 45, now, now],
      ['ticket', 13, '2026-09-12', 300, 120, now, now],
    ]);

  // ---- 电子票（足迹演示：user1/user2 核销路线1，user3 核销路线2，user2 一张退款票）----
  await ins('travel_e_ticket',
    ['orderNo', 'userId', 'itemType', 'itemId', 'useDate', 'qrCode', 'status', 'verifyTime', 'createTime', 'updateTime'],
    [
      ['WD20260901-0001', U(1), 'route', 1, '2026-09-01', 'TK20260901-0001-01', 'used', now, now, now],
      ['WD20260913-0003', U(1), 'route', 1, '2026-09-13', 'TK20260913-0003-01', 'unused', null, now, now],
      ['WD20260901-0002', U(1), 'ticket', 11, '2026-09-01', 'TK20260901-0002-01', 'used', now, now, now],
      ['WD20260902-0004', U(2), 'route', 1, '2026-09-02', 'TK20260902-0004-01', 'used', now, now, now],
      ['WD20260903-0005', U(3), 'route', 2, '2026-09-03', 'TK20260903-0005-01', 'used', now, now, now],
      ['WD20260820-0006', U(2), 'ticket', 13, '2026-08-20', 'TK20260820-0006-01', 'refunded', null, now, now],
    ]);

  // ---- 交通攻略 ----
  await ins('travel_traffic_guide',
    ['id', 'title', 'departure', 'destination', 'transportType', 'duration', 'cost', 'detail', 'sort', 'status', 'createTime', 'updateTime'],
    [
      [301, '贵阳→乌东', '贵阳北', '乌东村', '高铁+班车', '约2.5小时', 180, '贵阳北→凯里南高铁约1.5小时，凯里客车站班车1小时直达乌东村口。', 1, 1, now, now],
      [302, '凯里→乌东', '凯里', '乌东村', '班车直达', '约1小时', 35, '凯里客车站每日 8:00/13:00 两班直达乌东。', 2, 1, now, now],
      [303, '广州→乌东', '广州南', '乌东村', '高铁+包车', '约5.5小时', 480, '广州南→凯里南约4小时，出站包车1.5小时进村。', 3, 1, now, now],
    ]);

  // ---- 评价 ----
  await ins('travel_review',
    ['id', 'targetType', 'targetId', 'userId', 'rating', 'content', 'status', 'createTime', 'updateTime'],
    [
      [401, 'route', 1, U(4), 5, '长桌宴的酸汤鱼绝了，导游很会讲苗族故事。', 1, now, now],
      [402, 'route', 1, U(2), 5, '带孩子体验银饰锻造，值回票价。', 1, now, now],
      [403, 'scenic', 1, U(3), 5, '晨雾六点十分准时从谷底漫上来，机位在东侧亭子。', 1, now, now],
    ]);

  // ---- 推荐位 ----
  await ins('travel_recommend_slot',
    ['id', 'position', 'title', 'subtitle', 'badge', 'itemType', 'itemId', 'sort', 'rotationGroup', 'intervalSeconds', 'status', 'createTime', 'updateTime'],
    [
      [701, 'home', '苗寨深度两日游 · 邂逅梯田日出', '¥899 起 · 已售 1,284 · 平均点亮 4/5 站', '🔥 运营置顶 · 本周精选', 'route', 1, 1, 1, 5, 1, now, now],
      [702, 'home', '晨雾梯田摄影一日游', '¥299 起 · 本周 +89 人成行', '📷 摄影主题 · 热度上升', 'route', 2, 2, 1, 5, 1, now, now],
      [703, 'home', '芦笙广场 · 节庆进行时', '成人票 ¥40 · 家庭套票 ¥100', '👪 亲子优选 · 好评率 98%', 'scenic', 6, 3, 1, 5, 1, now, now],
    ]);

  // ---- 话题 ----
  await ins('community_topic',
    ['id', 'name', 'intro', 'viewCount', 'followerCount', 'postCount', 'isHot', 'isRecommend', 'sort', 'status', 'bindRouteIds', 'createTime', 'updateTime'],
    [
      [501, '#苗寨风光', '分享苗寨美景', 21000, 12, 3, 1, 1, 1, 1, JSON.stringify([2]), now, now],
      [502, '#徒步路线', '用脚步丈量苗寨', 5103, 8, 2, 1, 0, 2, 1, JSON.stringify([1]), now, now],
      [503, '#美食打卡', '长桌宴与酸汤鱼', 8900, 15, 1, 1, 1, 3, 1, JSON.stringify([]), now, now],
      [504, '#非遗手作', '银饰与蜡染', 3877, 6, 1, 0, 0, 4, 1, JSON.stringify([1]), now, now],
    ]);

  // ---- 游记 ----
  await ins('community_post',
    ['id', 'userId', 'title', 'content', 'images', 'topicIds', 'linkedRouteId', 'viewCount', 'likeCount', 'commentCount', 'favoriteCount', 'footprintTotal', 'status', 'createTime', 'updateTime'],
    [
      [601, U(1), '晨雾还没散，就到了观景台', '五点半摸黑上山，六点十分雾从谷底漫上来，梯田一层层亮起来。银饰工坊的老师傅手真稳，吊脚楼夜里能听见虫鸣。',
       JSON.stringify([1, 2, 3]), JSON.stringify([501, 502]), 1, 1204, 328, 41, 96, 5, 'normal', '2026-09-02 08:30:00', now],
      [602, U(2), '带娃做蜡染的一下午', '蜡染坊的阿婆教得耐心，小朋友的蓝白世界。', JSON.stringify([4]), JSON.stringify([504]), 1, 892, 189, 22, 45, 5, 'normal', '2026-09-03 14:10:00', now],
      [603, U(3), '长桌宴扫街指南', '酸汤鱼、糯米饭、米豆腐，一碗接一碗。', JSON.stringify([5, 6, 1]), JSON.stringify([503]), null, 640, 256, 38, 30, 0, 'normal', '2026-09-04 12:00:00', now],
      [604, U(3), '雨后的吊脚楼', '屋檐滴水，青石板发亮。', JSON.stringify([2]), JSON.stringify([501]), null, 455, 87, 12, 18, 0, 'normal', '2026-09-05 17:40:00', now],
    ]);

  // ---- 足迹快照（601 模式B：4/5 站 memo；602 模式B 2/5；其余 auto）----
  await ins('community_post_footprint',
    ['postId', 'userId', 'scenicSpotId', 'routeId', 'mode', 'dayNo', 'memo', 'status', 'sort', 'createTime', 'updateTime'],
    [
      [601, U(1), 1, 1, 'route', 1, '晨雾六点十分', 'normal', 0, now, now],
      [601, U(1), 3, 1, 'route', 1, '酸汤鱼两碗', 'normal', 1, now, now],
      [601, U(1), 4, 1, 'route', 1, '夜听虫鸣', 'normal', 2, now, now],
      [601, U(1), 6, 1, 'route', 2, '芦笙响起来', 'normal', 3, now, now],
      [601, U(1), 2, 1, 'route', 2, null, 'refunded', 4, now, now],
      [602, U(2), 5, 1, 'route', 1, '蓝白世界', 'normal', 0, now, now],
      [602, U(2), 3, 1, 'route', 1, '午饭后出发', 'normal', 1, now, now],
    ]);

  // ---- 互动消息示例 ----
  await ins('community_message',
    ['userId', 'type', 'refType', 'refId', 'content', 'isRead', 'createTime', 'updateTime'],
    [
      [U(1), 'like', 'post', 601, '有人赞了你的游记《晨雾还没散，就到了观景台》', 0, now, now],
      [U(1), 'comment', 'post', 601, '你的游记收到了新评论', 0, now, now],
    ]);

  // ---- 平台运营位 ----
  await ins('banner',
    ['title', 'image', 'linkType', 'linkValue', 'position', 'sort', 'status', 'createTime', 'updateTime'],
    [
      ['苗寨秋收节', 'ph-banner1', 'page', '/route', 'home', 1, 1, now, now],
      ['非遗体验周', 'ph-banner2', 'page', '/scenic', 'home', 2, 1, now, now],
    ]);
  await ins('announcement',
    ['title', 'content', 'type', 'isTop', 'status', 'createdBy', 'createTime', 'updateTime'],
    [
      ['中秋两日游余票紧张', '中秋前后路线余票紧张，建议提前 3 天预订。', 1, 1, 1, 1, now, now],
      ['新上线：银饰锻造体验票', '银饰工坊体验票上线，体验 60 分钟锻造。', 2, 0, 1, 1, now, now],
    ]);

  const [rows] = await conn.query(`SELECT
    (SELECT COUNT(*) FROM member_user WHERE phone LIKE '138000000%') AS users,
    (SELECT COUNT(*) FROM travel_scenic_spot) AS spots,
    (SELECT COUNT(*) FROM travel_route_package) AS routes,
    (SELECT COUNT(*) FROM travel_e_ticket) AS tickets,
    (SELECT COUNT(*) FROM community_post) AS posts,
    (SELECT COUNT(*) FROM community_post_footprint) AS footprints`);
  console.log('seed done:', rows[0]);
  await conn.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
