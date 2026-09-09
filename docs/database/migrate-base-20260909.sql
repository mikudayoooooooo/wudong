-- ============================================================
-- base 层合并前的本地库清理（2026-09-09）
-- 适用：所有在本地 wudong_platform 库导入过 docs/database/schema.sql 的开发机
-- 背景：schema.sql 版表使用 UNSIGNED 主键 + 物理外键（snake_case 旧设计），
--       与 base 实体（signed id、camelCase、无物理外键）冲突，
--       TypeORM synchronize 改表会被外键挡住导致应用无法启动（ER_FK_INCOMPATIBLE_COLUMNS）
-- 说明：以下表在 schema.sql 导入时均为空表；实体启动后会按新结构自动重建
-- 使用：mysql -uroot -p wudong_platform < docs/database/migrate-base-20260909.sql
-- ============================================================

-- 1. 删除 legacy 表上指向 base 管理表的外键
ALTER TABLE e_ticket      DROP FOREIGN KEY fk_eticket_order;
ALTER TABLE finance_record DROP FOREIGN KEY fk_finance_order;
ALTER TABLE finance_record DROP FOREIGN KEY fk_finance_merchant;

-- 2. 删除 base 实体接管的 legacy 表（order 系 + merchant 系）
DROP TABLE IF EXISTS order_ticket, order_reservation, order_product, payment_record, `order`;
DROP TABLE IF EXISTS merchant_application, merchant;

-- 3. 验证：以下查询应返回 0 行
-- SELECT table_name, constraint_name FROM information_schema.key_column_usage
--  WHERE table_schema = 'wudong_platform'
--    AND referenced_table_name IN ('order','payment_record','merchant','merchant_application');

-- 备注（无需手动处理）：
-- cart / sensitive_word / banner / announcement 等无外键引用的 legacy 表
-- 会被 synchronize 自动改造为新结构，无需删除。
-- e_ticket / finance_record 本身保留（行模块与财务 Phase 4 接管时会按实体重建）。
