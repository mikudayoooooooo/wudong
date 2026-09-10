-- ============================================================
-- 管理后台菜单：食（food）+ 衣（product）模块（Yamal 页面补录）
-- 对应页面：cool-admin-vue/src/modules/{food,product}/views/（config.ts 已注册路由）
-- 执行：mysql -u root -p wudong_platform < 本文件   （库：wudong_platform，需 utf8mb4）
-- 幂等：按 router 前缀清理后再插入
-- 前置：2026-09-09-base-admin-menus.sql（orderNum 衔接）
-- ============================================================
DELETE FROM base_sys_menu WHERE router LIKE '/food/%' OR router LIKE '/product/%' OR name IN ('食·餐饮管理', '衣·商品管理');

-- 食·餐饮管理
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, keepAlive, isShow) VALUES
(NOW(), NOW(), NULL, '食·餐饮管理', NULL, 0, 'Dish', 20, 1, 1);
SET @food = LAST_INSERT_ID();

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, viewPath, keepAlive, isShow) VALUES
(NOW(), NOW(), @food, '餐厅管理',   '/food/restaurant',   1, 'Food',         1, 'modules/food/views/restaurant.vue',   1, 1),
(NOW(), NOW(), @food, '农产品管理', '/food/farm-product', 1, 'Apple',        2, 'modules/food/views/farm-product.vue', 1, 1);

-- 衣·商品管理
INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, keepAlive, isShow) VALUES
(NOW(), NOW(), NULL, '衣·商品管理', NULL, 0, 'Goods', 21, 1, 1);
SET @product = LAST_INSERT_ID();

INSERT INTO base_sys_menu (createTime, updateTime, parentId, name, router, type, icon, orderNum, viewPath, keepAlive, isShow) VALUES
(NOW(), NOW(), @product, '商品列表', '/product/list',     1, 'List',      1, 'modules/product/views/list.vue',     1, 1),
(NOW(), NOW(), @product, '商品分类', '/product/category', 1, 'Menu',      2, 'modules/product/views/category.vue', 1, 1);
