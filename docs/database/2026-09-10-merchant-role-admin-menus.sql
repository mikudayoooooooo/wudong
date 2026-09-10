-- ============================================================
-- 管理后台商家角色：只读接入「交易中心」（订单/支付流水）
-- 对应后端：order/pay admin 控制器 merchantId 数据权限（merchant.adminUserId 绑定生效）
-- 依赖：2026-09-09-base-admin-menus.sql 已执行（订单/支付流水菜单存在）
-- 执行：mysql -u root -p wudong_platform < 本文件   （库：wudong_platform，需 utf8mb4）
-- 幂等：角色按唯一键 name 清理重建；权限行按 perms 清理后再插
-- 绑定用法（角色建好后，按实际 id 执行）：
--   UPDATE merchant SET adminUserId = <sys_user.id> WHERE id = <merchant.id>;
--   INSERT INTO base_sys_user_role (userId, roleId) VALUES (<sys_user.id>, <本角色id>);
--   绑定后该账号配「商家」角色登录，仅能查看本商家订单/流水；未绑定 adminUserId 的账号不受限（平台视角）
-- ============================================================

-- 1) 幂等清理旧角色及其授权
DELETE rm FROM base_sys_role_menu rm JOIN base_sys_role r ON rm.roleId = r.id WHERE r.name = '商家';
DELETE FROM base_sys_role WHERE name = '商家';

-- 2) 权限行（type=2，挂在对应菜单下）——商家只授只读 page，info/list/update/delete 不授即 403
DELETE FROM base_sys_menu WHERE perms IN ('order:page', 'pay:record:page');
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, perms, type, orderNum, keepAlive, isShow) VALUES
(NOW(), NOW(), (SELECT id FROM (SELECT id FROM base_sys_menu WHERE router = '/order') t),       '订单查询', NULL, 'order:page',      2, 1, 1, 0),
(NOW(), NOW(), (SELECT id FROM (SELECT id FROM base_sys_menu WHERE router = '/pay-record') u),  '流水查询', NULL, 'pay:record:page', 2, 1, 1, 0);

SET @menuOrder = (SELECT id FROM base_sys_menu WHERE router = '/order' LIMIT 1);
SET @menuPay   = (SELECT id FROM base_sys_menu WHERE router = '/pay-record' LIMIT 1);
SET @permOrder = (SELECT id FROM base_sys_menu WHERE perms = 'order:page' LIMIT 1);
SET @permPay   = (SELECT id FROM base_sys_menu WHERE perms = 'pay:record:page' LIMIT 1);

-- 3) 商家角色
INSERT INTO base_sys_role (createTime, updateTime, userId, name, label, remark, relevance, menuIdList, departmentIdList)
VALUES (NOW(), NOW(), 0, '商家', 'merchant', '商家端接入：仅能查看本商家订单/支付流水', 0, '[]', '[]');
SET @role = LAST_INSERT_ID();

-- 4) 授权：两个菜单（侧边栏可见）+ 两个权限行（接口放行）
INSERT INTO base_sys_role_menu (createTime, updateTime, roleId, menuId) VALUES
(NOW(), NOW(), @role, @menuOrder),
(NOW(), NOW(), @role, @menuPay),
(NOW(), NOW(), @role, @permOrder),
(NOW(), NOW(), @role, @permPay);

-- 5) 同步角色菜单 JSON（与 role_menu 双写，和管理端保存行为一致）
UPDATE base_sys_role
SET menuIdList = CONCAT('[', @menuOrder, ',', @menuPay, ',', @permOrder, ',', @permPay, ']')
WHERE id = @role;
