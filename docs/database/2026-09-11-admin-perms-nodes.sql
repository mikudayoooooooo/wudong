-- ============================================================
-- 管理后台操作按钮权限节点（type=2 perms）补录
-- 根因：菜单 SQL 此前只建了 type=1 页面菜单，未建权限节点，
--       导致前端 service._permission 全 false，cl-crud 操作栏编辑/删除按钮被 vShow 隐藏
-- 范围：有管理页面的全部业务控制器（api 清单取自 eps 再生产物 2026-09-11）
-- 幂等：NOT EXISTS 按 perms 去重；父菜单按 router 动态查找
-- 执行：docker exec -i wudong-mysql mysql -uroot -p123456 wudong_platform < 本文件
-- ============================================================

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'accommodation/hotel:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/accommodation/hotel' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/hotel:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'accommodation/hotel:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/accommodation/hotel' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/hotel:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'accommodation/hotel:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/accommodation/hotel' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/hotel:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '批量操作', 'accommodation/room-calendar:batch', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/accommodation/room-calendar' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/room-calendar:batch' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'accommodation/room-calendar:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/accommodation/room-calendar' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/room-calendar:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '价格日历', 'accommodation/room-calendar:range', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/accommodation/room-calendar' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/room-calendar:range' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'accommodation/room-type:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/accommodation/room-type' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/room-type:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'accommodation/room-type:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/accommodation/room-type' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/room-type:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'accommodation/room-type:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/accommodation/room-type' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'accommodation/room-type:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'community/comment:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/community-comment' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'community/comment:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'community/comment:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/community-comment' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'community/comment:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'community/post:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/community-post' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'community/post:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '处理', 'community/report:handle', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/community-report' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'community/report:handle' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'community/topic:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/community-topic' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'community/topic:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'community/topic:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/community-topic' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'community/topic:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'community/topic:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/community-topic' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'community/topic:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'travel/eTicket:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/e-ticket' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/eTicket:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'travel/eTicket:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/e-ticket' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/eTicket:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'travel/eTicket:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/e-ticket' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/eTicket:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '核销', 'travel/eTicket:verify', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/e-ticket' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/eTicket:verify' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '创建', 'food/farm-product:create', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/food/farm-product' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'food/farm-product:create' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'food/farm-product:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/food/farm-product' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'food/farm-product:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'food/farm-product:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/food/farm-product' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'food/farm-product:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '状态切换', 'food/farm-product:updateStatus', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/food/farm-product' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'food/farm-product:updateStatus' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '创建', 'food/restaurant:create', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/food/restaurant' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'food/restaurant:create' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'food/restaurant:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/food/restaurant' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'food/restaurant:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'food/restaurant:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/food/restaurant' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'food/restaurant:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'travel/itinerary:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/itinerary' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/itinerary:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'travel/itinerary:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/itinerary' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/itinerary:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'travel/itinerary:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/itinerary' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/itinerary:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'member/user:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/member-user' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'member/user:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'member/user:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/member-user' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'member/user:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'merchant:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/merchant' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'merchant:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'merchant:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/merchant' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'merchant:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'merchant:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/merchant' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'merchant:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '审核', 'merchantApplication:audit', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/merchant-application' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'merchantApplication:audit' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'message:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/message' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'message:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'message:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/message' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'message:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'message:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/message' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'message:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'operate/announcement:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/operate/announcement' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'operate/announcement:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'operate/announcement:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/operate/announcement' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'operate/announcement:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'operate/announcement:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/operate/announcement' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'operate/announcement:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'operate/banner:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/operate/banner' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'operate/banner:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'operate/banner:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/operate/banner' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'operate/banner:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'operate/banner:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/operate/banner' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'operate/banner:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'order:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/order' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'order:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'order:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/order' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'order:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'product/category:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/product/category' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'product/category:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'product/category:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/product/category' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'product/category:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '分类树', 'product/category:tree', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/product/category' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'product/category:tree' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'product/category:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/product/category' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'product/category:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '创建', 'product/goods:create', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/product/list' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'product/goods:create' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'product/goods:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/product/list' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'product/goods:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'product/goods:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/product/list' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'product/goods:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '状态切换', 'product/goods:updateStatus', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/product/list' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'product/goods:updateStatus' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'travel/recommend:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/recommend-slot' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/recommend:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'travel/recommend:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/recommend-slot' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/recommend:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'travel/recommend:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/recommend-slot' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/recommend:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'travel/route:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/route-package' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/route:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'travel/route:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/route-package' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/route:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'travel/route:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/route-package' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/route:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'travel/scenic:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/scenic' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/scenic:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'travel/scenic:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/scenic' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/scenic:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'travel/scenic:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/scenic' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/scenic:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'sensitive/word:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/sensitive-word' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'sensitive/word:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'sensitive/word:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/sensitive-word' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'sensitive/word:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'sensitive/word:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/sensitive-word' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'sensitive/word:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'travel/ticketType:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/ticket-type' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/ticketType:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'travel/ticketType:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/ticket-type' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/ticketType:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'travel/ticketType:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/ticket-type' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/ticketType:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'travel/guide:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/traffic-guide' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/guide:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'travel/guide:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/traffic-guide' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/guide:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'travel/guide:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/traffic-guide' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/guide:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'travel/inventory:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/travel-inventory' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/inventory:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'travel/inventory:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/travel-inventory' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/inventory:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'travel/inventory:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/travel-inventory' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/inventory:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '新增', 'travel/review:add', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/travel-review' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/review:add' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '删除', 'travel/review:delete', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/travel-review' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/review:delete' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'travel/review:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/travel-review' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'travel/review:update' AND type = 2) t);

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, perms, type, orderNum, keepAlive, isShow)
SELECT NOW(), NOW(), m.id, '编辑', 'user/info:update', 2, 99, 1, 1
FROM base_sys_menu m
WHERE m.router = '/user/list' AND m.type = 1
  AND NOT EXISTS (SELECT 1 FROM (SELECT id FROM base_sys_menu WHERE perms = 'user/info:update' AND type = 2) t);

