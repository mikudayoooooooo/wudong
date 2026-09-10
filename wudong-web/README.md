# 乌东文旅 C 端（wudong-web）

行（线路订票）+ 社区（照片分享）+ 住宿浏览的 C 端 PC 站点。**对接真实后端**（base 公共底座 + 六业务模块），支持 mock 开关离线演示。

## 启动

### 方式一：Docker 一键（推荐）

仓库根目录：

```bash
docker compose up -d          # 后端 API :8001 + 管理后台 :8000
```

首次或表结构变更后，同步表结构并灌入演示数据：

```bash
docker compose run --rm -d --no-deps --name migrate -e DB_SYNC=true midway
# 等日志出现 current app started（约 30s）后：
docker rm -f migrate
docker exec -e DB_HOST=wudong-mysql -e DB_PORT=3306 midway node scripts/seed.js
```

再起 C 端前端：

```bash
cd wudong-web
npm install
npm run dev                   # http://localhost:5175（代理 /api → 8001）
```

### 方式二：本地开发（不套 Docker）

前置：MySQL 8 运行在 `127.0.0.1:3307`（root/123456，库 `wudong_platform`），账号同上。

```bash
# 后端（cool-admin-midway/）
npm run dev                   # NODE_ENV=local，synchronize 自动建表，:8001
node scripts/seed.js          # 演示数据（幂等）

# 前端（wudong-web/）
npm install && npm run dev    # :5175
```

## 测试

```bash
npm test                      # 前端 90 用例（jsdom）
# 后端（cool-admin-midway/，连 3307 的 wudong_platform_test，需先停占用 8001 的进程）
npm test
```

## 登录 / 测试账号

右上角「登录」弹窗，支持密码或验证码（dev 环境验证码直接回显）：

| 手机号 | 密码 | 昵称 |
|---|---|---|
| 13800000001 | abc123456 | 山野小鱼 |
| 13800000002 | abc123456 | 奶爸游记 |
| 13800000003 | abc123456 | 快门手 |
| 13800000004 | abc123456 | 干饭人小王 |

## 亮点效果速览

- **真实足迹链**（`/post/601`）：路线为骨架的手绘地图，点亮 = 已核销电子票，未解锁站点灰置 🔒
- **路线详情**（`/route/1`）：每站「N 人点亮」、购票卡余票紧张度、「走过这条线的人」联动游记
- **电子票卡包**（`/my/tickets`）：登机牌票卡，已核销 → 「去写游记」转化入口；支持整单退票（24h 规则，扣 10%）
- **购票闭环**：选日期 → 模拟支付 → 出票，服务端查价 + 库存原子扣减
- **住宿**（`/hotels`）：民宿列表 URL 同步筛选、详情 + 房态日历（7/30 天切换、动态定价/满房/关房）
- **首页七区块**：焦点轮播（运营推荐位驱动）/ 快捷订票 / 金刚区 / 手绘地图总览 / 足迹榜 / 公告（真实 announcement 接口）/ 瀑布流 + CountUp
- **发布零门槛**：2 步发帖，模式 A 自动生成核销足迹；敏感词命中转人工审核

## 演示动线（约 5 分钟）

1. 首页：轮播自动切换（hover 暂停）→ 地图总览点站点 → 足迹榜
2. 右上角登录（13800000001 / abc123456）
3. `/route/1`：行程地图 → 选日期（余票紧张橙色）下单 → 模拟支付出票
4. `/my/tickets`：票卡包 → 退票看灰显，或「去写游记」
5. `/community`：卡片路线标签 → 速览面板 → 「看全部游记」
6. `/post/601`：足迹收起条 → 展开地图（「还有 1 站未解锁」🔒）→ 去走同款
7. `/publish`：发一篇 → 自动附上核销足迹 → 详情页查看
8. `/hotels`：民宿列表筛选 → 详情房态日历
9. `/user/1`：足迹档案 + 徽章；`/topic/502`：话题 + 绑定路线

## 结构

- `src/api/` —— 数据层（member/travel/community/operate），mock/real 同构切换（`VITE_USE_MOCK`）
- `src/lib/http.ts` —— fetch 封装（裸 JWT 头、code!==1000 抛错、1001 统一登出）
- `src/lib/` —— 足迹计算/信息流排序（纯函数，已测）
- `src/stores/` —— 会话（token 持久化 + 刷新续期）
- `src/components/FootprintMap.vue` —— 全站复用手绘足迹地图（chain/overview/mini）

## 与后端的契约要点

- 响应封套 `{code:1000, message, data}`；业务失败 HTTP 200 + `{code:1001}`（前端据此统一登出）
- 认证头 `Authorization: <裸JWT>`（无 Bearer）；token 24h，refreshToken 30d
- C 端分页统一 `{list, total}`；时间格式 `'YYYY-MM-DD HH:mm:ss'`

设计文档：`../docs/superpowers/specs/2026-09-09-travel-community-design.md`
