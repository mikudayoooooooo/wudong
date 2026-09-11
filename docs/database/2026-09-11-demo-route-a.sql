-- ============================================================
-- 路线A 演示数据准备（2026-09-11 路演 demo，只动数据不改代码）
--
-- 解决四件事：
--   1) 清理幽灵脏单（userId=26 不在 member_user 的 order 3/4 及子表）
--   2) 建「王阿婆梯田民宿」商家 + 管理端登录账号 wangapo（密码 123456）+ 商家角色绑定
--   3) 给「商家」角色补授 住宿管理/电子票 页面菜单与接口权限节点（含缺失的 :page/:list）
--   4) 民宿 id=3 改名「王阿婆梯田民宿」并挂到阿婆商家名下（标签 山景/家庭/经济，含"梯田"可被搜索命中）
--
-- 执行顺序：
--   bash cool-admin-midway/scripts/reset-demo.sh      # 先复位 C 端业务数据（幂等）
--   docker exec -i wudong-mysql mysql -uroot -p123456 wudong_platform \
--     --default-character-set=utf8mb4 < docs/database/2026-09-11-demo-route-a.sql
--
-- 幂等：可重复执行；reset-demo.sh 只清 C 端业务表，本脚本的商家/账号/授权在 reset 后依然有效，
--       但 hotel 改名会被 seed 重置，故每次 reset 后需重跑本脚本。
-- 注意：改了角色菜单后，该角色已登录的会话权限有缓存，需重新登录生效。
-- ============================================================

-- ------------------------------------------------------------
-- 1) 幽灵脏单清理（reset-demo 的 cleanup 只删 138 号段，删不到 userId 悬空的孤儿单）
-- ------------------------------------------------------------
DELETE FROM order_reservation WHERE orderId IN
  (SELECT id FROM (SELECT id FROM `order` WHERE userId NOT IN (SELECT id FROM member_user)) t);
DELETE FROM food_reservation WHERE userId NOT IN (SELECT id FROM member_user);
DELETE FROM order_ticket WHERE orderId IN
  (SELECT id FROM (SELECT id FROM `order` WHERE userId NOT IN (SELECT id FROM member_user)) t);
DELETE FROM payment_record WHERE orderId IN
  (SELECT id FROM (SELECT id FROM `order` WHERE userId NOT IN (SELECT id FROM member_user)) t);
DELETE FROM `order` WHERE userId NOT IN (SELECT id FROM member_user);

-- ------------------------------------------------------------
-- 2) 阿婆商家 + 管理端账号 + 绑定
--    登录账号：wangapo / 123456（md5 与 admin 同款， authority 中间件按 passwordV 校验）
-- ------------------------------------------------------------
INSERT INTO merchant (createTime, updateTime, userId, adminUserId, username, shopName, module,
                      contactName, contactPhone, status, joinedAt)
SELECT NOW(), NOW(), 0, NULL, 'wangapo', '王阿婆梯田民宿', 'accommodation',
       '王阿婆', '13800000099', 1, '2026-09-11'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM merchant WHERE username = 'wangapo');

INSERT INTO base_sys_user (createTime, updateTime, name, username, password, passwordV, nickName, status)
SELECT NOW(), NOW(), '王阿婆', 'wangapo', 'e10adc3949ba59abbe56e057f20f883e', 1, '王阿婆', 1
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM base_sys_user WHERE username = 'wangapo');

-- 绑定：merchant.adminUserId 命中 → 订单/流水按本商家隔离（MerchantAdminScopeService）
UPDATE merchant
SET adminUserId = (SELECT id FROM (SELECT id FROM base_sys_user WHERE username = 'wangapo') t)
WHERE username = 'wangapo';

INSERT INTO base_sys_user_role (createTime, updateTime, userId, roleId)
SELECT NOW(), NOW(), u.id, r.id
FROM (SELECT id FROM base_sys_user WHERE username = 'wangapo') u
JOIN (SELECT id FROM base_sys_role WHERE name = '商家') r
WHERE NOT EXISTS (
  SELECT 1 FROM base_sys_user_role ur
  JOIN base_sys_user uu ON ur.userId = uu.id
  WHERE uu.username = 'wangapo');

-- ------------------------------------------------------------
-- 3) 权限节点补建（type=2；页面取数/下拉列表必需的 :page/:list 此前缺失）
--    URL→perms 全等匹配（authority.ts: ':'→'/' 后与 /admin/ 后的路径比对）
-- ------------------------------------------------------------
-- 3.1 民宿管理 /accommodation/hotel
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '分页查询', 'accommodation/hotel:page', 2, 98, 1, 1
FROM base_sys_menu m WHERE m.router = '/accommodation/hotel' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/hotel:page' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '列表查询', 'accommodation/hotel:list', 2, 98, 1, 1
FROM base_sys_menu m WHERE m.router = '/accommodation/hotel' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/hotel:list' AND type = 2) t);

-- 3.2 房型管理 /accommodation/room-type（新增房型走 add；表单民宿下拉走 hotel:list）
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '分页查询', 'accommodation/room-type:page', 2, 98, 1, 1
FROM base_sys_menu m WHERE m.router = '/accommodation/room-type' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/room-type:page' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '列表查询', 'accommodation/room-type:list', 2, 98, 1, 1
FROM base_sys_menu m WHERE m.router = '/accommodation/room-type' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/room-type:list' AND type = 2) t);

-- 3.3 房态日历 /accommodation/room-calendar（页面取数 page + 区间回退 range + 批量设价 batch）
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '分页查询', 'accommodation/room-calendar:page', 2, 98, 1, 1
FROM base_sys_menu m WHERE m.router = '/accommodation/room-calendar' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/room-calendar:page' AND type = 2) t);

-- 3.4 电子票 /e-ticket（页面取数；编辑 update、核销 verify 节点已在 2026-09-11 补录 SQL 建过，缺则补）
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '分页查询', 'travel/eTicket:page', 2, 98, 1, 1
FROM base_sys_menu m WHERE m.router = '/e-ticket' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/eTicket:page' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '核销', 'travel/eTicket:verify', 2, 99, 1, 1
FROM base_sys_menu m WHERE m.router = '/e-ticket' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/eTicket:verify' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'travel/eTicket:update', 2, 99, 1, 1
FROM base_sys_menu m WHERE m.router = '/e-ticket' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/eTicket:update' AND type = 2) t);

-- 3.5 看板统计接口 /admin/order/stats（工作台首页真实数据；admin 天然放行，商家角色需此节点）
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '看板统计', 'order:stats', 2, 98, 1, 1
FROM base_sys_menu m WHERE m.router = '/order' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'order:stats' AND type = 2) t);

-- 3.6 详情/编辑弹窗取数 :info（cl-crud 编辑前先调 info，缺了点编辑直接 403）
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '详情查询', 'travel/eTicket:info', 2, 98, 1, 1
FROM base_sys_menu m WHERE m.router = '/e-ticket' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/eTicket:info' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '详情查询', 'accommodation/hotel:info', 2, 98, 1, 1
FROM base_sys_menu m WHERE m.router = '/accommodation/hotel' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/hotel:info' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '详情查询', 'accommodation/room-type:info', 2, 98, 1, 1
FROM base_sys_menu m WHERE m.router = '/accommodation/room-type' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/room-type:info' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '详情查询', 'accommodation/room-calendar:info', 2, 98, 1, 1
FROM base_sys_menu m WHERE m.router = '/accommodation/room-calendar' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/room-calendar:info' AND type = 2) t);

-- ------------------------------------------------------------
-- 4) 「商家」角色授权：页面菜单 + 权限节点（base_sys_role_menu 与 menuIdList 双写）
-- ------------------------------------------------------------
SET @role = (SELECT id FROM base_sys_role WHERE name = '商家');

INSERT INTO base_sys_role_menu (createTime, updateTime, roleId, menuId)
SELECT NOW(), NOW(), @role, m.id
FROM base_sys_menu m
WHERE (
        -- 页面菜单：工作台首页(42, isShow=0 默认路由) + 住宿管理三项 + 订单/流水 + 电子票
        m.router IN ('/', '/accommodation/hotel', '/accommodation/room-type', '/accommodation/room-calendar',
                     '/order', '/pay-record', '/e-ticket')
        OR m.perms IN (
             -- 住宿：列表/取数/详情/新增/编辑/批量设价/价格日历（不给 delete）
             'accommodation/hotel:page', 'accommodation/hotel:list', 'accommodation/hotel:info',
             'accommodation/hotel:add', 'accommodation/hotel:update',
             'accommodation/room-type:page', 'accommodation/room-type:list', 'accommodation/room-type:info',
             'accommodation/room-type:add', 'accommodation/room-type:update',
             'accommodation/room-calendar:page', 'accommodation/room-calendar:info',
             'accommodation/room-calendar:batch', 'accommodation/room-calendar:range',
             -- 订单/流水只读 + 看板统计
             'order:page', 'order:stats', 'pay:record:page',
             -- 电子票：取数/详情/核销/编辑（核销兜底用）
             'travel/eTicket:page', 'travel/eTicket:info', 'travel/eTicket:verify', 'travel/eTicket:update'
           )
      )
  AND m.type IN (1, 2)
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_role_menu WHERE roleId = @role AND menuId = m.id) t);

-- menuIdList 同步（与管理端角色保存行为一致；登录侧两处都可能读）
UPDATE base_sys_role
SET menuIdList = (
  SELECT CONCAT('[', GROUP_CONCAT(menuId ORDER BY menuId), ']')
  FROM (SELECT menuId FROM base_sys_role_menu WHERE roleId = @role) x
)
WHERE id = @role;

-- ------------------------------------------------------------
-- 5) 阿婆的民宿（seed 固定 id=3 原名「梯田经济客栈」）：改名 + 归属 + 标签 + 简介
--    · 名字含「梯田」→ C 端搜索"梯田"可命中（搜索只匹配民宿名/地址，不匹配房型名）
--    · 标签 山景/家庭/经济：保证列表六个风格 chip（苗寨/江景/山景/观星/家庭/经济）点哪个都非空
-- ------------------------------------------------------------
UPDATE hotel
SET name       = '王阿婆梯田民宿',
    merchantId = (SELECT id FROM (SELECT id FROM merchant WHERE username = 'wangapo') t),
    styleTags  = JSON_ARRAY('山景', '家庭', '经济'),
    intro      = '阿婆家的吊脚楼就在梯田边，推开窗就是山雾与稻香。床品是阿婆自己种的蓝靛、亲手蜡染的。'
WHERE id = 3
  AND name IN ('梯田经济客栈', '王阿婆梯田民宿');

-- ------------------------------------------------------------
-- 6) 入驻审核页乱码修复（shopName 曾被写成 U+FFFD 序列）
-- ------------------------------------------------------------
UPDATE merchant_application SET shopName = '演示商铺（蜡染坊）' WHERE HEX(shopName) LIKE '%EFBFBD%';

-- ------------------------------------------------------------
-- 7) 自检（应各有输出：商家已绑定/账号带角色/角色菜单≥17/民宿3已改名归属）
-- ------------------------------------------------------------
SELECT 'merchant' AS step, id, username, shopName, adminUserId, status FROM merchant;
SELECT 'wangapo-user' AS step, u.id, u.username, r.name AS role
FROM base_sys_user u
LEFT JOIN base_sys_user_role ur ON ur.userId = u.id
LEFT JOIN base_sys_role r ON r.id = ur.roleId
WHERE u.username = 'wangapo';
SELECT 'role-menus' AS step, COUNT(*) AS menuCount
FROM base_sys_role_menu WHERE roleId = (SELECT id FROM base_sys_role WHERE name = '商家');
SELECT 'hotel-3' AS step, id, name, merchantId, styleTags FROM hotel WHERE id = 3;
SELECT 'dirty-orders-left' AS step, COUNT(*) AS cnt FROM `order`
WHERE userId NOT IN (SELECT id FROM member_user);
