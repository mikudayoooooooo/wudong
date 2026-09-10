-- ============================================================
-- 管理后台：消息模板菜单 + 按模板发送权限行
-- 对应后端：message 模块 /admin/message/template CRUD + /admin/message/sendByTemplate
-- 执行：mysql -u root -p wudong_platform < 本文件   （库：wudong_platform，需 utf8mb4）
-- 幂等：按 router / perms 清理后再插入
-- 依赖：2026-09-09-base-admin-menus.sql（消息管理组已存在，router='/message'）
-- ============================================================
DELETE FROM base_sys_menu WHERE router = '/message-template';
DELETE FROM base_sys_menu WHERE perms IN ('message:template:page', 'message:template:list', 'message:template:info', 'message:template:add', 'message:template:update', 'message:template:delete', 'message:sendByTemplate');

-- 消息模板页（挂在「消息管理」组下）
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, viewPath, keepAlive, isShow) VALUES
(NOW(), NOW(), (SELECT id FROM (SELECT id FROM base_sys_menu WHERE router = '/message') t), '消息模板', '/message-template', 1, 'Tickets', 2, 'modules/message/views/template/index.vue', 1, 1);
SET @tpl = LAST_INSERT_ID();

-- 模板页权限行（供非超管角色授权用；超管 admin 天然放行）
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, perms, type, orderNum, keepAlive, isShow) VALUES
(NOW(), NOW(), @tpl, '模板查询', NULL, 'message:template:page', 2, 1, 1, 0),
(NOW(), NOW(), @tpl, '模板列表', NULL, 'message:template:list', 2, 2, 1, 0),
(NOW(), NOW(), @tpl, '模板详情', NULL, 'message:template:info', 2, 3, 1, 0),
(NOW(), NOW(), @tpl, '模板新增', NULL, 'message:template:add', 2, 4, 1, 0),
(NOW(), NOW(), @tpl, '模板编辑', NULL, 'message:template:update', 2, 5, 1, 0),
(NOW(), NOW(), @tpl, '模板删除', NULL, 'message:template:delete', 2, 6, 1, 0);

-- 按模板发送权限行（挂在「消息管理」页下）
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, perms, type, orderNum, keepAlive, isShow) VALUES
(NOW(), NOW(), (SELECT id FROM (SELECT id FROM base_sys_menu WHERE router = '/message') u), '按模板发送', NULL, 'message:sendByTemplate', 2, 1, 1, 0);
