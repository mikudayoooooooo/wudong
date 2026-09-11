# 乌东苗寨 C 端（wudong-web）UI 整体优化方案

> 版本：v1.0（待拍板） · 日期：2026-09-11
> 范围：仅 C 端 `wudong-web`，后台 `cool-admin-vue` 不动。

---

## 0. 已确认的决策

| 决策点 | 结论 |
|---|---|
| 美化范围 | 只做 C 端 `wudong-web`（Vue 3.5 + Vite 5，纯手写组件，无 UI 库） |
| 视觉风格 | 蜡染靛蓝民族风，克制编辑化路线（禁紫渐变/卡片阴影堆叠/胶囊标签等 AI 默认特征） |
| 资源来源 | 自写 Node 脚本从 Unsplash / Pexels 抓取免费可商用素材，带错误处理与兜底 |
| 交付方式 | 先出本方案文档，确认后实施 |

## 1. 现状诊断

**项目底子很好**（成品级，非脚手架），问题集中在「视觉资产缺失」和「风格未定型」：

| 维度 | 现状 | 问题 |
|---|---|---|
| 技术栈 | Vue 3.5 + TS + Vite 5，Pinia，vue-router，90 个 vitest 用例 | 健康，无需动架构 |
| 样式体系 | `src/styles/theme.css` CSS 变量 token；住宿模块独立作用域 `accommodation.css` | token 机制完善，**换肤成本极低**，改变量即可全局生效 |
| 当前配色 | 苗寨绿 `#33523e/#4a7a5c` + 橙 `#e8963e`，纸色 `#fffdf8` | 绿色系偏普通，与"蜡染靛蓝"目标方向不符 |
| 图片资源 | **零本地图片**；封面靠 `.ph-0~.ph-5` CSS 渐变占位；民宿 mock 用远程 `picsum.photos` | 最大短板：无真实配图，演示/离线模式视觉空洞，且 picsum 内容与苗寨毫无关联 |
| 字体 | 系统默认字体栈 | 无品牌感，标题缺乏表现力 |
| 图标 | 组件内手写/零散 | 无统一图标语言 |
| 页面 | 27 个视图（首页/线路/景点/住宿/商品/餐饮/社区/订单/我的 + AI 管家） | 结构完整，逐页换皮 + 补图即可 |

**核心结论**：这是一次「换肤 + 补资产」工程，不是重构。token 体系现成，风险可控。

## 2. 设计语言：蜡染靛蓝 · 编辑化

### 2.1 设计原则（硬约束）

1. **零渐变、零投影**：用全幅色块拼接和发丝线（1px hairline）做层次，不用卡片阴影堆叠。
2. **单一强调色**：朱红只用于 CTA、价格、印章式点缀，面积 ≤5%。
3. **版面即装饰**：负字距大标题（思源宋体）+ 明度翻转区块（纸色 ↔ 靛蓝深底）做节奏，不加多余装饰物。
4. **蜡染纹样自制**：用 SVG 画几何蜡染纹（回纹/涡纹/鱼纹抽象化），零版权风险，作为分隔带和深底区块的肌理。

### 2.2 色板

| 角色 | 变量 | 色值 | 用途 |
|---|---|---|---|
| 主色·靛蓝 | `--ind-700` | `#1B425F` | 导航底、按钮主色、链接强调 |
| 靛蓝·深 | `--ind-800` | `#14324A` | hover 态、深底区块 |
| 靛蓝·墨 | `--ind-950` | `#0B1D2C` | 页脚、夜间反转区块 |
| 靛蓝·中 | `--ind-500` | `#35648A` | 次级文字图标、图表 |
| 靛蓝·浅 | `--ind-100` | `#DFEAF1` | 选中底、标签底 |
| 靛蓝·雾 | `--ind-50` | `#F4F8FA` | 交替区块底 |
| 纸色 | `--paper` | `#FBF7EE` | 全局底色（蜡染布底的暖白） |
| 朱红 | `--cinnabar` | `#B23A32` | 价格、主 CTA、印章点缀（克制） |
| 墨色 | `--ink` | `#16232D` | 正文标题 |
| 墨·次 | `--ink-2` | `#4A5B66` | 次级文字 |
| 发丝线 | `--line` | `rgba(27,66,95,.14)` | 全部分隔线，替代边框与阴影 |

语义色（成功/警告/危险）沿用低饱和版本，不另起炉灶。

**与现有 token 的映射**（改 `theme.css` 即全局生效）：

| 现有变量/值 | 新值 | 说明 |
|---|---|---|
| `#33523e` 主绿 | `#1B425F` 靛蓝 | 主色替换 |
| `#4a7a5c` 浅绿 | `#35648A` | 次级替换 |
| `#e8963e` 橙 | `#B23A32` 朱红 | 点缀色替换，使用场景收敛 |
| `#fffdf8` 纸色 | `#FBF7EE` | 微调偏暖 |
| `accommodation.css` `.acc-scope` 重定义 | 并回主 token | 消除双轨，全站统一 |

### 2.3 字体

| 用途 | 字体 | 字重 | 来源/协议 |
|---|---|---|---|
| 标题/大字 | 思源宋体 Noto Serif SC | 500/700 | Google Fonts，**OFL 开源协议，可商用可自托管** |
| 正文/UI | 思源黑体 Noto Sans SC | 400/500 | 同上 |
| 数字/价格 | 思源宋体 tabular 或系统 `tabular-nums` | — | — |

自托管方案：脚本抓取 Google Fonts css2 API 返回的 unicode-range 分包 woff2 + 本地化 `@font-face`，避免 CDN 依赖，加载稳定。标题负字距 `-0.02em`，中文标题字号阶梯 40/32/24/18。

### 2.4 排版与间距规范

- **网格**：4pt 基准；区块垂直节奏 64/96px（移动端 40/56px）。
- **线条**：所有分隔用 1px `--line` 发丝线；卡片直角或 4px 小圆角，**禁止大圆角 + 大投影**。
- **按钮**：主按钮实底靛蓝 + 纸色字；次按钮发丝线描边；危险/价格用朱红文字而非满底红。
- **图片处理**：实景图一律直角满幅裁切（2.35:1 / 16:10 / 1:1 三档比例），叠 8% 靛蓝色罩统一色调。

### 2.5 图标

统一引入 **Tabler Icons**（MIT 协议）：1.5px 描边、24px 基准、SVG sprite 方式内联，替换现有零散图标/emoji。脚本从 jsDelivr 拉取所需图标 SVG 源码本地化。

## 3. 页面改造清单（按优先级）

| 优先级 | 页面/组件 | 文件 | 改造内容 |
|---|---|---|---|
| P0 | 全局 token | `src/styles/theme.css`、`accommodation.css` | 色板迁移、字体注入、发丝线规范、`.ph-*` 占位类替换为纹样占位 |
| P0 | 首页 | `views/HomeView.vue`、`components/HeroCarousel.vue`、`TopNav.vue` | 全幅实景 Hero + 宋体大字标题；导航改纸色底发丝线；区块明度翻转 |
| P0 | 资源落地 | `src/assets/**`、`src/mocks/index.ts` | 抓取图片接入；picsum 远程图替换为本地图 |
| P1 | 线路/景点 | `views/RouteListView/RouteDetailView/Scenic*View.vue` | 列表卡片去阴影改发丝线；详情页头图满幅 + 色罩 |
| P1 | 住宿 | `views/accommodation/*`、`HotelCard.vue` | token 并轨；房态日历配色适配 |
| P1 | 商品/餐饮 | `views/product/*`、`views/food/*` | 瀑布流卡片规范；价格朱红化 |
| P2 | 社区/我的 | `views/Community*`、`views/my/*`、`UserProfileView` | 头像本地生成（首字 + 靛蓝色底 SVG，零版权）；表单控件统一 |
| P2 | AI 管家 | `components/ai/*` | 面板配色适配，不动交互逻辑 |

交互逻辑、接口、路由、测试断言一律不动——90 个 vitest 用例必须全绿。

## 4. 静态资源方案

### 4.1 目录结构

```
wudong-web/
├─ scripts/
│  ├─ fetch-assets.mjs        # 抓取脚本（Node 22，零依赖，原生 fetch）
│  └─ assets.config.mjs       # 素材清单：关键词、数量、尺寸、目标路径
├─ src/assets/
│  ├─ img/{hero,scenic,food,product,hotel}/   # 实景图（webp/jpg，≤1920px，压缩）
│  ├─ pattern/                # 自制蜡染纹样 SVG
│  ├─ avatar/                 # 本地生成的首字头像 SVG
│  ├─ icons/                  # Tabler SVG sprite
│  ├─ fonts/                  # Noto Serif/Sans SC woff2 分包 + font-face.css
│  └─ manifest.json           # 抓取清单（含来源 URL/作者/协议，增量续抓）
└─ CREDITS.md                 # 版权出处清单（自动生成）
```

### 4.2 抓取源与合规

| 源 | 用途 | 协议 | 说明 |
|---|---|---|---|
| Pexels API | 主图源 | Pexels License（免费可商用，无需署名） | 需 `PEXELS_API_KEY`（免费申请） |
| Unsplash API | 备图源 | Unsplash License（免费可商用） | 需 `UNSPLASH_ACCESS_KEY`，可选 |
| Openverse API | 无 key 兜底 | 仅筛选 CC0 / CC-BY 条目 | 无需 key；CC-BY 条目在 CREDITS.md 署名 |
| Tabler Icons (jsDelivr) | 图标 | MIT | 无需 key |
| Google Fonts | 字体 | OFL | 自托管 woff2 |
| 本地生成 | 纹样/头像/终极占位 | 自制 | 零风险 |

抓取题材关键词（中英双语检索）：苗寨吊脚楼、梯田、贵州山水（Miao village / terraced fields Guizhou / stilt house）、酸汤/农家食材、蜡染/银饰/苗绣非遗、山野民宿。每类 4–8 张，Hero 3 张宽幅。

### 4.3 错误处理与兜底链

```
单张图片: Pexels → Unsplash → Openverse(CC0/CC-BY) → 本地纹样占位 SVG（必成功）
```

- 请求超时 10s（AbortController），指数退避重试 3 次，并发限 3。
- 校验响应 MIME 与文件大小（<10KB 视为异常丢弃），图片统一转存并记录原始来源。
- `manifest.json` 记录已抓文件 hash，重复执行增量补齐、不重复下载。
- 任一源失败不中断整体流程，结束后输出成败报告；缺 key 时自动降级到 Openverse。
- 生成 `CREDITS.md`：每张图一行（文件路径 / 作者 / 来源链接 / 协议），CC-BY 强制署名。
- 字体、图标任一失败时：字体回退系统字体栈，图标保留现状，均不阻塞。

## 5. 实施批次

| 批次 | 内容 | 验收 |
|---|---|---|
| P-0 | 抓取脚本 + 资源落地（img/icons/fonts/pattern/CREDITS） | manifest 完整，CREDITS.md 生成，离线可跑 |
| P-1 | token 迁移 + 字体接入 + 住宿并轨 | 全站配色切换，无绿色/橙色残留 |
| P-2 | 首页 + TopNav + Hero 改造， mocks 换本地图 | 首页视觉达标 |
| P-3 | 线路/住宿/商品/餐饮/社区逐页换皮 | 27 视图统一 |
| P-4 | 验证：`vitest` 90 用例全绿 + `vite build` 通过 + dev server 截图巡检 | 交付 |

每批次独立可回滚（token 层一次 commit，页面层按模块 commit）。

## 6. 风险与回滚

| 风险 | 对策 |
|---|---|
| 换色影响测试快照 | token 迁移单独 commit，先跑全量测试确认无断言依赖色值 |
| 抓取图源与苗寨题材不完全匹配 | 关键词人工筛选 + manifest 可手删重抓；宁缺毋滥，缺位用纹样占位 |
| 字体分包体积 | 仅加载用到的 unicode-range 分包，首屏只阻塞标题字重 |
| 住宿作用域并轨引入视觉回归 | P-1 批次单独截图对比住宿模块 |

## 7. 待拍板清单

1. 色板 2.2 是否通过（尤其：绿色系完全替换为靛蓝系，橙色点缀收敛为朱红）。
2. Pexels / Unsplash 的 API key 由你提供，还是直接用 Openverse 无 key 通道（CC 协议，选择面略窄）。
3. 首页 Hero 用真实苗寨摄影，还是「实景 + 8% 靛蓝色罩」统一调（推荐后者）。
4. 批次 P-0~P-4 顺序是否按此执行。
