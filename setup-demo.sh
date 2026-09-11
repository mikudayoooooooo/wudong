#!/usr/bin/env bash
# 乌东演示环境一键初始化（幂等，可重复执行）
#   网络 → 数据库容器 → compose 三服务 → DB_SYNC 建表 → 灌演示数据 → 灌管理端菜单 → 灌路演演示数据 → 自检
# 用法：在仓库根目录执行  bash setup-demo.sh
# 已初始化过再跑一遍也安全：各步骤自动跳过/幂等。彩排后复位用 cool-admin-midway/scripts/reset-demo.sh
set -uo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
DB_USER="${DB_USERNAME:-root}"; DB_PASS="${DB_PASSWORD:-123456}"; DB_NAME="${DB_DATABASE:-wudong_platform}"
step(){ printf "\n\033[1;32m== %s\033[0m\n" "$*"; }
die(){ printf "\033[1;31m✗ %s\033[0m\n" "$*" >&2; exit 1; }

command -v docker >/dev/null 2>&1 || die "未检测到 docker，请先安装 Docker Desktop"
[ -f docker-compose.yml ] || die "请在仓库根目录执行：bash setup-demo.sh"

step "1/8 容器网络"
docker network inspect wudong-net >/dev/null 2>&1 || docker network create wudong-net >/dev/null
echo "wudong-net OK"

step "2/8 数据库容器"
if docker ps --format '{{.Names}}' | grep -qx 'wudong-mysql'; then
  echo "wudong-mysql 已在运行"
else
  docker rm -f wudong-mysql >/dev/null 2>&1
  docker run -d --name wudong-mysql --network wudong-net -p 3307:3306 \
    -e MYSQL_ROOT_PASSWORD="$DB_PASS" -e MYSQL_DATABASE="$DB_NAME" mysql:8.0 >/dev/null \
    || die "mysql 容器启动失败"
fi
printf "等待 MySQL 就绪"
for i in $(seq 1 60); do
  docker exec wudong-mysql mysqladmin ping -u"$DB_USER" -p"$DB_PASS" --silent >/dev/null 2>&1 && { echo " OK"; break; }
  [ "$i" = 60 ] && die "MySQL 迟迟未就绪，请查：docker logs wudong-mysql"
  printf "."; sleep 2
done

step "3/8 起服务（midway / admin / web）"
docker compose up -d

step "4/8 建表（DB_SYNC，仅首次）"
HAS_TABLE=$(docker exec wudong-mysql mysql -N -u"$DB_USER" -p"$DB_PASS" \
  -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DB_NAME' AND table_name='hotel'" 2>/dev/null | tr -d '[:space:]')
if [ "${HAS_TABLE:-0}" != "0" ]; then
  echo "表已存在，跳过"
else
  docker compose run --rm --no-deps -d --name wudong-migrate -e DB_SYNC=true midway \
    || die "迁移容器启动失败"
  printf "等待建表完成"
  for i in $(seq 1 60); do
    docker logs wudong-migrate 2>&1 | grep -q "current app started" && { echo " OK"; break; }
    [ "$i" = 60 ] && die "建表超时，请查：docker logs wudong-migrate"
    printf "."; sleep 2
  done
  docker rm -f wudong-migrate >/dev/null
  docker compose restart midway >/dev/null
  echo "建表完成"
fi

step "5/8 灌演示数据"
docker exec -e DB_HOST=wudong-mysql -e DB_PORT=3306 midway node scripts/seed.js || die "seed 失败"

step "6/8 灌管理端业务菜单"
for f in docs/database/*menus*.sql; do
  docker exec -i wudong-mysql mysql --default-character-set=utf8mb4 -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$f" \
    || die "菜单 SQL 执行失败：$f"
  echo "  ✓ $f"
done

step "7/8 灌路演演示数据（王阿婆商家/权限/民宿改名，幂等）"
DEMO_SQL="docs/database/2026-09-11-demo-route-a.sql"
[ -f "$DEMO_SQL" ] || die "缺少演示 SQL：$DEMO_SQL"
docker exec -i wudong-mysql mysql --default-character-set=utf8mb4 -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$DEMO_SQL" \
  || die "演示 SQL 执行失败：$DEMO_SQL"
echo "  ✓ $DEMO_SQL"

step "8/8 自检"
printf "等待 midway API 就绪"
for i in $(seq 1 30); do
  curl -s --noproxy '*' -m 2 http://localhost:8001/app/food/restaurant/3 2>/dev/null | grep -q '"code":1000' && { echo " OK"; break; }
  [ "$i" = 30 ] && { echo "（API 未就绪，稍后自访问 :8080 再看）"; break; }
  printf "."; sleep 2
done
RESULT=$(docker exec wudong-mysql mysql -N -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SELECT
 (SELECT COUNT(*) FROM hotel),
 (SELECT COUNT(*) FROM restaurant),
 (SELECT COUNT(*) FROM travel_route_package),
 (SELECT COUNT(*) FROM travel_inventory WHERE useDate='2026-10-01'),
 (SELECT COUNT(*) FROM time_slot),
 (SELECT COUNT(*) FROM base_sys_menu WHERE viewPath LIKE 'modules/%'),
 (SELECT COUNT(*) FROM merchant WHERE username='wangapo' AND adminUserId IS NOT NULL AND adminUserId>0),
 (SELECT COUNT(*) FROM base_sys_menu WHERE perms='order:stats')" 2>/dev/null | tr '\t' ' ' | tr -d '\n')
read -r HOTEL REST ROUTE INV SLOT MENU MERCHANT STATS <<< "$RESULT"
check(){ if [ "${2:-0}" -ge "$3" ] 2>/dev/null; then printf "  ✅ %s：%s\n" "$1" "$2"; else printf "  ❌ %s：%s（期望 ≥%s）——重跑本脚本或查上方报错\n" "$1" "${2:-无}" "$3"; fi; }
check "民宿（含王阿婆梯田民宿）" "$HOTEL" 3
check "餐厅（长桌宴）" "$REST" 1
check "路线" "$ROUTE" 2
check "国庆路线库存" "$INV" 1
check "长桌宴时段" "$SLOT" 2
check "管理端业务菜单" "$MENU" 40
check "演示商家（wangapo 已绑定）" "$MERCHANT" 1
check "看板权限节点 order:stats" "$STATS" 1

printf "\n✅ 初始化完成\n  C端   http://localhost:8080   测试账号 13800000001 / abc123456（右上角登录）\n  管理端 http://localhost:8000   商家 wangapo / 123456 ／ 平台 admin / 123456\n  彩排后复位：bash cool-admin-midway/scripts/reset-demo.sh\n"
