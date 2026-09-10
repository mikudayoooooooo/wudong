-- ============================================================
-- 管理后台：C端用户管理菜单 + 内容审核/退款审批权限行
-- 执行：mysql -u root -p wudong_platform < 本文件   （库：wudong_platform，需 utf8mb4）
-- 幂等：按 router / perms 清理后再插入
-- 依赖：2026-09-09-base-admin-menus.sql、2026-09-10-travel-community-admin-menus.sql
-- ============================================================
DELETE FROM base_sys_menu WHERE router LIKE '/member-user%' OR router IN ('用户管理');
DELETE FROM base_sys_menu WHERE perms IN ('community:post:audit', 'pay:record:refund');

-- C端用户管理（封禁/解禁走编辑状态）
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, viewPath, keepAlive, isShow) VALUES
(NOW(), NOW(), NULL, '用户管理', NULL, 0, 'User', 22, 1, 1);
SET @member = LAST_INSERT_ID();

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, viewPath, keepAlive, isShow) VALUES
(NOW(), NOW(), @member, 'C端用户', '/member-user', 1, 'Avatar', 1, 'modules/member/views/user/index.vue', 1, 1);

-- 权限行：游记内容审核（挂在社区-游记帖子下）
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, perms, type, orderNum, keepAlive, isShow) VALUES
(NOW(), NOW(), (SELECT id FROM (SELECT id FROM base_sys_menu WHERE router = '/community-post') t), '游记审核', NULL, 'community:post:audit', 2, 1, 1, 0);

-- 权限行：支付流水退款审批（挂在交易中心-支付流水下）
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, perms, type, orderNum, keepAlive, isShow) VALUES
(NOW(), NOW(), (SELECT id FROM (SELECT id FROM base_sys_menu WHERE router = '/pay-record') u), '退款审批', NULL, 'pay:record:refund', 2, 1, 1, 0);
