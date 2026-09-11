# 乌东苗寨 C 端 UI 定稿规范与执行清单（交接版）

> 版本 v2.0 · 2026-09-11 · 供后续执行模型使用，**自包含**，无需其他上下文。
> 前置方案文档：`docs/wudong-web-ui-optimization-plan.md`（色板/资源方案已定稿）。

---

## 0. 仓库与分支现状

- 仓库根：`C:\Users\cja\wudong\code`（monorepo），目标项目 `wudong-web/`（Vue 3.5 + TS + Vite 5.4，纯手写组件，无 UI 库）。
- **工作分支：`wudong-web-ui-indigo`**（基于 main 6b591d0）。⚠️ 本环境 git 沙箱怪异：**分支名含 `/` 会导致引用静默丢失**（refs/heads 下无法建子目录），建新分支一律用无斜杠命名。
- 已完成提交（不要重做）：
  | commit | 内容 |
  |---|---|
  | 52180f8 | P-0 资源管线 + 素材（13 实景图/60 图标/字体子集/纹样/头像/CREDITS.md） |
  | c575ef1 | P-1 token 迁移蜡染靛蓝 + 字体接入 + 住宿并轨 |
  | e86c6a9 + 9c4c00c | P-2 首页/TopNav/HeroCarousel 换肤 + Icon.vue + mocks 图片本地化 |
  | c358517 | P-3 38 文件逐页清理（渐变/投影/硬编码色/emoji 图标） |
  | a468385 | 首页版式升级（全幅 Hero 色带/悬浮订票/明度翻转区块） |
- 验证基线：`vitest run` = **31 文件 123 用例全绿**；`vite build` 通过。任何改动后必须保持。

### 常用命令（Node 用 managed 绝对路径）
```bash
cd /c/Users/cja/wudong/code/wudong-web
N="C:\Users\cja\.workbuddy\binaries\node\versions\22.22.2-2\node.exe"
"$N" node_modules/vitest/vitest.mjs run          # 测试（必须 123 全绿）
"$N" node_modules/vite/bin/vite.js build         # 构建（TS 校验）
VITE_USE_MOCK=true "$N" node_modules/vite/bin/vite.js --port 5173 --strictPort   # dev（用 run_in_background 启动，shell 内 & 会被回收）
```

## 1. 设计系统（已定稿，代码即真源）

### 1.1 token（`src/styles/theme.css`）
```
--ind-950 #0b1d2c  --ind-800 #14324a  --ind-700 #1b425f(主色)  --ind-500 #35648a
--ind-300 #8fb0c6  --ind-100 #dfeaf1  --ind-50  #f4f8fa
--cinnabar #b23a32(点缀,≤5%面积)  --cinnabar-700 #8f2d27  --cinnabar-300 #d98d85  --cinnabar-100 #f3e2df
--paper #fbf7ee(全局底)  --ink #16232d  --ink-2 #4a5b66
--line rgba(27,66,95,.14)  --line-soft rgba(27,66,95,.08)
--radius 4px   --shadow none   --font-display "Noto Serif SC","Songti SC","SimSun",serif
```
旧变量 `--green-*/--orange-*` 是别名，新写样式一律用新 token。

### 1.2 设计纪律（硬约束，违例即返工）
1. **零渐变**（唯一例外 `TicketsView.vue .qr` 的二维码纹理）、**零投影**；分隔一律 1px 发丝线。
2. 朱红只用于：价格、主 CTA、印章、榜一标记；面积 ≤5%。
3. 层次靠「全幅色块拼接 + 明度翻转」（paper ↔ ind-50 ↔ ind-950），不靠卡片堆叠。
4. 标题宋体负字距（`.font-display`），正文系统黑体；数字/价格可 `.font-display`。
5. 实景图一律 `.img-frame`（满幅 object-fit cover + 8% 靛蓝色罩），直角或小圆角。
6. 图标一律 `<Icon name>`（Tabler，src/components/Icon.vue），禁新增 emoji 当图标。

### 1.3 资源（`src/assets/`）
- `img/hero|scenic|hotel` 13 张实景（Unsplash License）；`pattern/` 8 个蜡染纹样 SVG（深浅双色）；`avatar/` 6 首字头像；`icons/` 60 Tabler；`fonts/` 思源宋体子集。
- 缺图时用 `.ph .ph-N`（纹样占位），**禁止引入远程图床**。
- 换图/补图：`node scripts/fetch-assets.mjs --force --ids <id>`（候选链在 scripts/assets.config.mjs；有 PEXELS_API_KEY/UNSPLASH_ACCESS_KEY 可走 API 检索）。

## 2. 已落地样板（参照标准）

- **TopNav**：纸色底 + 发丝线；朱红印章 logo；激活项 `--ind-700` 加粗 + 2px 朱红下划线；高 56px。
- **首页版式**（a468385，`HomeView.vue`）：全幅 420px Hero 色带 + 右侧悬浮订票面板（`right: max(16px, calc((100vw - 1200px)/2))`）；金刚区 = 发丝线长条（无卡片，行间 1px 分隔，hover `--ind-50`）；手绘地图 = 全幅 `--ind-50` 色带；节庆 = `--ind-800` + `spiral-dark` 纹样块；底部攻略+数据 = 全幅 `--ind-950` + `meander-dark` 纹样收底；区块节奏 margin 44px / band padding 40-44px；移动端 <900px 降级。
- 后续所有页面按此密度与节奏对齐。

## 3. 待执行清单

### 3.1 【BUG】Hero 画面过曝（优先）
现象：dev 截图中 Hero 接近全白、标题不可读。确诊：图片正常加载（404 会显示 carousel 深色底而非白色），原因是 hero-1（雪山云海）亮部占比过大 + 色罩偏弱。
执行（`HeroCarousel.vue`）：
1. `.slide::before` 色罩 `rgba(11,29,44,.46)` → `rgba(11,29,44,.56)`。
2. `heroImgs` 的 hero-1 `pos: 'center 62%'` → `'center 75%'`（裁向山脊暗部）；hero-3 `pos` → `'center 60%'`。
3. 若仍偏亮：用抓取脚本把 hero-1 换成下龙湾喀斯特图——`assets.config.mjs` 中 hero-1 的 candidates 第一项改为 `U('1528127269322-539801943592', 1920)`，然后 `node scripts/fetch-assets.mjs --force --ids hero-1`。
4. 验收：截图中 40px 纸色宋体标题在任何一张轮播图上都清晰可读（目测对比度足够即可）。

### 3.2 列表页版式（6 个，结构同构）
文件：`RouteListView / ScenicListView / ProductListView / RestaurantListView / FarmProductListView / accommodation/HotelListView`
1. 页面顶部：标题区 `h1.font-display` 24px `--ind-800` + 一行 sub（12px `--text-3`）+ 底部发丝线；上边距 24px。（已用 SectionHeader 的页面确认 icon 传的是图标名不是 emoji。）
2. FilterBar/筛选条：去掉任何底色块，贴发丝线底边；激活 chip = `--ind-700` 实底纸色字，未激活 = 白底发丝线。
3. 卡片栅格：`gap: 16px`；封面改 `.img-frame` 16:10（无图时 `.ph` 纹样）；卡内标题 15px；价格 `var(--cinnabar)` + `.font-display`。
4. 卡片 hover：`border-color: var(--ind-300)`（禁投影/位移）。

### 3.3 详情页版式（6 个）
文件：`RouteDetailView / ScenicDetailView / ProductDetailView / RestaurantDetailView / FarmProductDetailView / accommodation/HotelDetailView`
1. 页头：有封面图 → 全幅 320px `.img-frame`，标题 32px `.font-display` 纸色压图（底部 24px）；无图 → `--ind-800` + `diamond-dark` 纹样块同高。
2. 返回/操作按钮：发丝线描边，禁投影。
3. 正文信息分区：去卡片化，用发丝线分节（`border-top: 1px solid var(--line)`，节 padding 20px 0）；节标题 15px `.font-display` `--ind-800`。
4. 价格/费用：`var(--cinnabar)` + `.font-display`；主 CTA `.btn-primary`。

### 3.4 社区与个人中心
- `CommunityView / PostDetailView / TopicView / UserProfileView`：瀑布流卡片封面 `.img-frame`；页头规则同 3.2；`UserProfileView` 头像优先用 `src/assets/avatar/` 首字头（无远程图）。
- `my/MyOrdersView / MyReservationsView / MyFavoritesView`：表格行发丝线分隔（tr border-bottom `--line-soft`）；状态 pill 保持方形（radius 2px）；空态图标用 Icon。
- `cart/CartView / order/OrderDetailView`：结算/金额区改 `--ind-800` 深色块 + 纸色字；总金额 `.font-display` `var(--cinnabar-300)`。

### 3.5 弹层
- `LoginModal / BookingModal / RouteQuickView`：标题 `.font-display`；输入框白底发丝线（focus `--ind-500`）；遮罩 `rgba(11,29,44,.5)`（已大部分完成，巡检补齐）。

### 3.6 全局巡检（收尾必做）
```bash
grep -rn "linear-gradient\|box-shadow\|#33523e\|#4a7a5c\|#e8963e\|#7fae8e\|picsum" src/   # 应只剩 .qr 例外与注释
"$N" node_modules/vitest/vitest.mjs run    # 123 全绿
"$N" node_modules/vite/bin/vite.js build   # 通过
```
截图巡检（agent-browser，mock 模式 dev）：首页（首屏+滚到底）、线路列表、线路详情、民宿列表、民宿详情、社区、我的订单。逐张确认：无绿色/橙色残留、无投影、标题宋体生效、图片非远程。

## 4. 工作纪律（执行模型必读）

1. **同一文件的多次编辑必须串行**（一次只发一个 Edit，禁止并行批量改同一文件——本会话已两次因此丢写）。改完关键文件用 grep 验证编辑真的落盘。
2. 不许改 `*.spec.ts`；测试引用的 class 名（.slide/.dot/.card 等）不许删。
3. commit 按批次（3.1 / 3.2 / 3.3 / 3.4 / 3.6 各一个），message 中文、格式同现有历史（`feat(wudong-web): …`）。**分支名禁含斜杠**。
4. 后台起 dev server 必须用 run_in_background（shell `&` 会被回收）；agent-browser 截图后必须 `agent-browser close`。
5. 遇到拿不准的视觉决策，回到「设计纪律」六条判断；不要引入新的强调色、不要加渐变/投影、不要引远程图。
