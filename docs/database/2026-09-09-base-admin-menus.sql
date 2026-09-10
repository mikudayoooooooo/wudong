-- ============================================================
-- 管理后台菜单：base 模块（交易/商家/消息/敏感词）
-- 对应后端模块：cool-admin-midway/src/modules/{order,pay,merchant,message,sensitive}
-- 执行：mysql -u root -p wudong_platform < 本文件   （库：wudong_platform，需 utf8mb4）
-- 幂等：按 router 前缀清理后再插入
-- 前置：请先执行 2026-09-09-accommodation-operate-menus.sql（operate/accommodation 菜单）
-- ============================================================
DELETE FROM base_sys_menu WHERE router LIKE '/order%' OR router LIKE '/pay-record%' OR router LIKE '/merchant%' OR router IN ('/message', '/sensitive-word', '交易中心', '商家管理');

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, keepAlive, isShow) VALUES
(NOW(), NOW(), NULL, '交易中心', NULL, 0, 'ShoppingCart', 14, 1, 1);
SET @trade = LAST_INSERT_ID();

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, viewPath, keepAlive, isShow) VALUES
(NOW(), NOW(), @trade, '订单管理',   '/order',      1, 'Tickets',     1, 'modules/order/views/order/index.vue',   1, 1),
(NOW(), NOW(), @trade, '支付流水',   '/pay-record', 1, 'Currency',    2, 'modules/pay/views/record/index.vue',    1, 1);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, keepAlive, isShow) VALUES
(NOW(), NOW(), NULL, '商家管理', NULL, 0, 'Shop', 15, 1, 1);
SET @mch = LAST_INSERT_ID();

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, viewPath, keepAlive, isShow) VALUES
(NOW(), NOW(), @mch, '商家列表',   '/merchant',              1, 'OfficeBuilding', 1, 'modules/merchant/views/merchant/index.vue',    1, 1),
(NOW(), NOW(), @mch, '入驻审核',   '/merchant-application',  1, 'Stamp',          2, 'modules/merchant/views/application/index.vue', 1, 1);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, viewPath, keepAlive, isShow) VALUES
(NOW(), NOW(), NULL, '消息管理', '/message',        1, 'Bell',       16, 1, 'modules/message/views/message/index.vue', 1, 1),
(NOW(), NOW(), NULL, '敏感词',   '/sensitive-word', 1, 'Lock',       17, 1, 'modules/sensitive/views/word/index.vue',  1, 1);
