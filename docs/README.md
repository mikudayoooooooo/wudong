# 乌东文旅"衣食住行"综合服务平台

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node.js-18.x-green.svg)](https://nodejs.org/)
[![Vue](https://img.shields.io/badge/vue-3.x-brightgreen.svg)](https://vuejs.org/)

> 基于 Midway.js + Cool Admin + uni-app + Vue3 的苗族特色文旅综合服务平台

---

## 📖 项目简介

乌东文旅平台是一个服务于贵州黔东南乌东苗寨的综合性文旅服务系统，涵盖"衣、食、住、行、社区"五大业务模块，为游客提供一站式的线上服务，为商家提供完善的运营管理工具。

### 核心特性

- 🛍️ **衣-非遗商品**：苗族银饰、蜡染、刺绣等非遗手工艺品在线交易
- 🍜 **食-餐饮美食**：特色餐厅预订 + 农产品特产销售
- 🏠 **住-住宿预订**：苗寨特色民宿在线预订与房态管理
- 🎫 **行-线路订票**：景区门票、旅游路线套餐购买与电子票核销
- 📷 **社区-照片分享**：游客UGC内容社区，游记发布与互动
- 🔧 **平台管理**：统一的用户、商家、订单、数据管理后台

---

## 🏗️ 技术架构

### 整体架构

```
┌─────────────────────────────────────────┐
│  客户端层                                 │
│  uni-app小程序 | Vue3 PC端 | Cool Admin │
└─────────────┬───────────────────────────┘
              │ HTTPS/JSON
┌─────────────▼───────────────────────────┐
│  业务服务层 - Midway.js 3.x + TypeScript │
│  6个业务模块 + 公共服务层                  │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│  数据层 - MySQL 8.0 + Redis 6.x         │
└─────────────────────────────────────────┘
```

### 技术栈

**后端**
- 框架：Midway.js 3.x + TypeScript 5.x
- 数据库：MySQL 8.0 + Redis 6.x
- ORM：TypeORM 0.3.x
- 认证：JWT + bcrypt
- 进程管理：PM2

**前端**
- 小程序：uni-app 3.x (Vue3)
- PC端：Vue 3 + Element Plus + Vite
- 管理后台：Cool Admin 7.x
- 状态管理：Pinia
- 数据可视化：ECharts 5.x

**运维**
- Web服务器：Nginx
- 操作系统：Ubuntu 20.04 / CentOS 7
- 监控：PM2 Monitor
- 日志：logrotate

---

## 📁 项目结构

```
wudong-platform/
├── backend/                    # 后端项目（Midway.js）
│   ├── src/
│   │   ├── config/            # 配置文件
│   │   ├── common/            # 公共模块（装饰器/工具/中间件）
│   │   ├── core/              # 核心公共服务（用户/订单/支付/购物车）
│   │   └── modules/           # 业务模块
│   │       ├── product/       # 模块1：衣-非遗商品
│   │       ├── food/          # 模块2：食-餐饮美食
│   │       ├── accommodation/ # 模块3：住-住宿预订
│   │       ├── travel/        # 模块4：行-线路订票
│   │       ├── community/     # 模块5：社区-照片分享
│   │       └── admin/         # 模块6：平台管理后台
│   ├── test/                  # 测试文件
│   └── package.json
│
├── frontend-mobile/            # 小程序端（uni-app）
│   ├── src/
│   │   ├── pages/            # 页面
│   │   ├── components/       # 组件
│   │   ├── store/            # Pinia状态管理
│   │   └── api/              # API封装
│   └── package.json
│
├── frontend-pc/                # PC网页端（Vue3）
│   ├── src/
│   │   ├── views/            # 页面
│   │   ├── components/       # 组件
│   │   ├── router/           # 路由
│   │   └── store/            # Pinia
│   └── package.json
│
├── frontend-admin/             # 管理后台（Cool Admin）
│   ├── src/
│   │   └── modules/          # 业务模块
│   └── package.json
│
├── database/                   # 数据库脚本
│   ├── schema.sql            # 表结构
│   ├── data.sql              # 初始数据
│   └── init.sql              # 初始化脚本
│
├── docs/                       # 项目文档
│   ├── 乌东文旅平台-完整技术设计方案V1.0.md
│   ├── 数据库设计文档.md
│   ├── API接口设计文档.md
│   └── 部署运维文档.md
│
└── README.md                   # 项目说明
```

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.x
- MySQL >= 8.0
- Redis >= 6.x
- Nginx (生产环境)

### 后端启动

```bash
# 1. 克隆项目
git clone https://github.com/your-org/wudong-platform.git
cd wudong-platform/backend

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入数据库配置

# 4. 初始化数据库
mysql -u root -p < ../database/init.sql

# 5. 启动开发服务器
npm run dev

# 访问 http://localhost:7001
# Swagger文档：http://localhost:7001/swagger-ui/index.html
```

### 小程序端启动

```bash
cd frontend-mobile

# 安装依赖
npm install

# 启动开发服务器
npm run dev:mp-weixin

# 使用微信开发者工具打开 dist/dev/mp-weixin 目录
```

### PC端启动

```bash
cd frontend-pc

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 管理后台启动

```bash
cd frontend-admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5174
# 默认账号：admin / admin123
```

---

## 📚 文档导航

| 文档 | 说明 |
|-----|------|
| [完整技术设计方案](docs/乌东文旅平台-完整技术设计方案V1.0.md) | 架构设计、技术选型、目录结构 |
| [数据库设计文档](docs/数据库设计文档.md) | 表结构、ER图、索引设计 |
| [API接口设计文档](docs/API接口设计文档.md) | RESTful接口、请求响应格式 |
| [部署运维文档](docs/部署运维文档.md) | 服务器配置、部署流程、监控 |
| [需求规格说明书](2026-06-09-wudong-yishizuxing-platform-design.md) | 原始需求文档 |

---

## 🗄️ 数据库设计

### 核心表结构

```
用户体系：
├── user（用户表）
└── user_address（收货地址表）

订单体系：
├── order（订单主表）
├── order_product（商品订单子表）
├── order_reservation（预订订单子表）
├── order_ticket（票务订单子表）
├── payment_record（支付记录表）
└── cart（购物车表）

业务模块：
├── 模块1：product系列（商品/SKU/分类/评价）
├── 模块2：food系列（餐厅/菜品/预订/农产品）
├── 模块3：accommodation系列（民宿/房型/房态日历）
├── 模块4：travel系列（景区/门票/路线/电子票）
├── 模块5：community系列（游记/评论/话题/关注）
└── 模块6：admin系列（管理员/角色/商家/财务）
```

总计约50张表，完整建表语句见 `database/schema.sql`

---

## 🔌 API接口

### 核心接口示例

```bash
# 用户注册
POST /api/auth/register

# 商品列表
GET /api/product/list?page=1&pageSize=20

# 创建订单
POST /api/order/create

# 微信支付
POST /api/payment/create
```

完整接口文档：
- 开发环境：http://localhost:7001/swagger-ui/index.html
- 生产环境：https://api.wudong.com/swagger-ui/index.html

总计约134个接口，详见 [API接口设计文档](docs/API接口设计文档.md)

---

## 📦 部署

### 生产环境部署

```bash
# 1. 后端部署
cd backend
npm run build
pm2 start ecosystem.config.js --env production

# 2. 前端构建
cd frontend-pc
npm run build
# 将 dist/ 目录上传到服务器

# 3. 小程序上传
cd frontend-mobile
npm run build:mp-weixin
# 使用微信开发者工具上传
```

详细部署流程请参考 [部署运维文档](docs/部署运维文档.md)

---

## 🧪 测试

```bash
# 单元测试
npm test

# 测试覆盖率
npm run test:cov

# E2E测试
npm run test:e2e
```

---

## 📊 模块说明

### 模块1：衣-非遗商品
- 商品分类管理（银饰/蜡染/刺绣/服饰）
- 商品SKU与库存管理
- 购物车与订单
- 商品评价与收藏
- 商家后台管理

### 模块2：食-餐饮美食
- 餐厅信息展示
- 餐位预订（时段管理）
- 农产品特产销售
- 地图模式查找

### 模块3：住-住宿预订
- 民宿信息管理
- 房型与房态日历
- 在线预订与入住码
- 动态定价

### 模块4：行-线路订票
- 景区门票销售
- 旅游路线套餐
- 电子票生成与核销
- 交通攻略

### 模块5：社区-照片分享
- 游记发布（图片/视频）
- 评论与点赞
- 话题系统
- 用户关注

### 模块6：平台管理后台
- 用户与商家管理
- 数据统计看板
- 内容审核
- 财务结算
- 系统配置

---

## 🤝 团队协作

### 6个小组分工

| 小组 | 负责模块 | 主要任务 |
|-----|---------|---------|
| 第1组 | 衣-非遗商品 | 商品管理、SKU、评价 |
| 第2组 | 食-餐饮美食 | 餐厅、预订、农产品 |
| 第3组 | 住-住宿预订 | 民宿、房型、房态 |
| 第4组 | 行-线路订票 | 景区、门票、路线 |
| 第5组 | 社区-照片分享 | 游记、评论、话题 |
| 第6组 | 平台管理后台 | 用户、数据、运营 |

### Git协作规范

```bash
# 功能开发
git checkout -b feature/module1-product-list
git commit -m "feat(product): 添加商品列表筛选功能"
git push origin feature/module1-product-list

# 提交PR进行代码审查
```

提交信息格式：
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关

---

## 📈 项目进度

### 开发里程碑

- [x] 需求分析与设计（2024-01）
- [x] 技术选型与架构设计（2024-02）
- [ ] 后端开发（2024-03 - 2024-05）
- [ ] 前端开发（2024-03 - 2024-05）
- [ ] 联调测试（2024-06）
- [ ] 上线部署（2024-07）

### 验收标准

- [ ] 单元测试覆盖率 ≥ 60%
- [ ] API响应时间95分位 ≤ 500ms
- [ ] 首页加载时间 ≤ 2秒
- [ ] 支持1000并发用户
- [ ] 所有核心功能正常运行

---

## 🔒 安全说明

- 密码使用bcrypt加密存储
- JWT Token认证，2小时过期
- HTTPS加密传输
- SQL注入防护
- XSS攻击防护
- 敏感信息脱敏展示
- 操作日志全记录

---

## 📞 联系方式

- **技术支持**：support@wudong.com
- **项目文档**：https://docs.wudong.com
- **代码仓库**：https://github.com/wudong-platform
- **问题反馈**：https://github.com/wudong-platform/issues

---

## 📄 License

[MIT License](LICENSE)

---

## 🙏 致谢

感谢以下开源项目：
- [Midway.js](https://midwayjs.org/)
- [Cool Admin](https://cool-js.com/)
- [uni-app](https://uniapp.dcloud.io/)
- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [TypeORM](https://typeorm.io/)

---

**开发团队** © 2024 乌东文旅平台项目组
