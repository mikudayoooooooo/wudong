#!/usr/bin/env bash
# AI管家演示彩排复位：清测试账号(138000000xx)订单/票/预订/支付 → 重灌演示数据
# 用法：bash cool-admin-midway/scripts/reset-demo.sh   （仓库任意位置可用全路径执行）
# 顺序必须是 先清单 再 重灌：seed 只清 travel 旧单，住宿/餐位彩排单靠 cleanup SQL；
# 库存消耗与演示票复位靠 seed 全量重灌。
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
DB_NAME="${DB_DATABASE:-wudong_platform}"
DB_USER="${DB_USERNAME:-root}"
DB_PASS="${DB_PASSWORD:-123456}"

echo "[1/2] 清理测试账号订单/票/预订/支付…"
if docker ps --format '{{.Names}}' | grep -qx 'wudong-mysql'; then
  docker exec -i wudong-mysql mysql -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$DIR/cleanup-demo-orders.sql"
else
  echo "  (未发现 wudong-mysql 容器，改走 127.0.0.1:${DB_PORT:-3307})"
  mysql -h127.0.0.1 -P"${DB_PORT:-3307}" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$DIR/cleanup-demo-orders.sql"
fi

echo "[2/2] 重灌演示数据…"
node "$DIR/seed.js"

echo "✅ 复位完成：脏单已清、演示数据已恢复初始值。刷新 C 端即可重新彩排。"
