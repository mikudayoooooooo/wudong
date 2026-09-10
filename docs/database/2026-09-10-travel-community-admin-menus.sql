-- ============================================================
-- 管理后台菜单：行（travel）+ 社区（community）模块
-- 对应后端模块：cool-admin-midway/src/modules/{travel,community}
-- 执行：mysql -u root -p wudong_platform < 本文件   （库：wudong_platform，需 utf8mb4）
-- 幂等：按 router 前缀清理后再插入
-- 前置：2026-09-09-accommodation-operate-menus.sql / 2026-09-09-base-admin-menus.sql
-- ============================================================
DELETE FROM base_sys_menu WHERE router LIKE '/route-package%' OR router LIKE '/scenic%' OR router LIKE '/ticket-type%' OR router LIKE '/travel-inventory%' OR router LIKE '/itinerary%' OR router LIKE '/e-ticket%' OR router LIKE '/recommend-slot%' OR router LIKE '/traffic-guide%' OR router LIKE '/travel-review%' OR router LIKE '/community-%' OR router IN ('行·旅游管理', '社区管理');

-- 行·旅游管理
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, keepAlive, isShow) VALUES
(NOW(), NOW(), NULL, '行·旅游管理', NULL, 0, 'Van', 18, 1, 1);
SET @travel = LAST_INSERT_ID();

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, viewPath, keepAlive, isShow) VALUES
(NOW(), NOW(), @travel, '路线套餐', '/route-package',    1, 'Suitcase',     1, 'modules/travel/views/route/index.vue',       1, 1),
(NOW(), NOW(), @travel, '景区管理', '/scenic',           1, 'Place',        2, 'modules/travel/views/scenic/index.vue',      1, 1),
(NOW(), NOW(), @travel, '票种管理', '/ticket-type',      1, 'Ticket',       3, 'modules/travel/views/ticket-type/index.vue', 1, 1),
(NOW(), NOW(), @travel, '按日库存', '/travel-inventory', 1, 'Box',          4, 'modules/travel/views/inventory/index.vue',   1, 1),
(NOW(), NOW(), @travel, '行程站点', '/itinerary',        1, 'GuidePost',    5, 'modules/travel/views/itinerary/index.vue',   1, 1),
(NOW(), NOW(), @travel, '电子票',   '/e-ticket',         1, 'Postcard',     6, 'modules/travel/views/e-ticket/index.vue',    1, 1),
(NOW(), NOW(), @travel, '推荐位',   '/recommend-slot',   1, 'Star',         7, 'modules/travel/views/recommend/index.vue',   1, 1),
(NOW(), NOW(), @travel, '交通攻略', '/traffic-guide',    1, 'MapLocation',  8, 'modules/travel/views/guide/index.vue',       1, 1),
(NOW(), NOW(), @travel, '评价管理', '/travel-review',    1, 'ChatDotRound', 9, 'modules/travel/views/review/index.vue',      1, 1);

-- 社区管理
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, keepAlive, isShow) VALUES
(NOW(), NOW(), NULL, '社区管理', NULL, 0, 'ChatLineSquare', 19, 1, 1);
SET @community = LAST_INSERT_ID();

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, viewPath, keepAlive, isShow) VALUES
(NOW(), NOW(), @community, '游记帖子', '/community-post',    1, 'Notebook',   1, 'modules/community/views/post/index.vue',    1, 1),
(NOW(), NOW(), @community, '话题管理', '/community-topic',   1, 'CollectionTag', 2, 'modules/community/views/topic/index.vue', 1, 1),
(NOW(), NOW(), @community, '评论管理', '/community-comment', 1, 'Comment',    3, 'modules/community/views/comment/index.vue', 1, 1),
(NOW(), NOW(), @community, '举报处理', '/community-report',  1, 'Warning',    4, 'modules/community/views/report/index.vue',  1, 1);
