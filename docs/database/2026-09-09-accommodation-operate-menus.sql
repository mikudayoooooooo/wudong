-- ============================================================
-- 管理后台菜单：accommodation(住宿) + operate(平台运营)
-- 对应后端模块：cool-admin-midway/src/modules/{accommodation,operate}
-- 执行：mysql -u root -p cool < 本文件   （库：cool，需 utf8mb4）
-- 幂等：按 router 前缀清理后再插入
-- ============================================================
DELETE FROM base_sys_menu WHERE router LIKE '/accommodation/%' OR router LIKE '/operate/%' OR name IN ('住宿管理','平台运营');

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, keepAlive, isShow) VALUES
(NOW(), NOW(), NULL, '住宿管理', NULL, 0, 'HomeFilled', 12, 1, 1);
SET @acm = LAST_INSERT_ID();

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, viewPath, keepAlive, isShow) VALUES
(NOW(), NOW(), @acm, '民宿管理',   '/accommodation/hotel',        1, 'OfficeBuilding', 1, 'modules/accommodation/views/hotel/index.vue',        1, 1),
(NOW(), NOW(), @acm, '房型管理',   '/accommodation/room-type',    1, 'Calendar',       2, 'modules/accommodation/views/room-type/index.vue',    1, 1),
(NOW(), NOW(), @acm, '房态日历',   '/accommodation/room-calendar',1, 'DataBoard',      3, 'modules/accommodation/views/room-calendar/index.vue',1, 1);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, keepAlive, isShow) VALUES
(NOW(), NOW(), NULL, '平台运营', NULL, 0, 'Picture', 13, 1, 1);
SET @op = LAST_INSERT_ID();

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, viewPath, keepAlive, isShow) VALUES
(NOW(), NOW(), @op, '轮播图管理', '/operate/banner',          1, 'Picture', 1, 'modules/operate/views/banner/index.vue',          1, 1),
(NOW(), NOW(), @op, '公告管理',   '/operate/announcement',    1, 'Bell',    2, 'modules/operate/views/announcement/index.vue',    1, 1),
(NOW(), NOW(), @op, '财务记录',   '/operate/finance-record',  1, 'Money',   3, 'modules/operate/views/finance-record/index.vue',  1, 1);
