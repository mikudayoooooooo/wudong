# 乌东苗寨 C 端 UI 定稿规范与执行清单（交接版）

> 版本 v2.2 · 2026-09-11 · 供后续执行模型使用，**自包含**，无需其他上下文。
> 前置方案文档：`docs/wudong-web-ui-optimization-plan.md`（色板/资源方案已定稿）。
> v2.2 修订（2026-09-11 规范符合性评审）：§3.0 撤销 B.1 序号、收敛 A.3 应用面；§3.1 勘误真根因（.card 撞类）；§3.6 增补 emoji 巡检；新增 §3.7 地图点亮叙事。

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
  | 7a2a6d0 | 本规范文档 |
  | a468385 | 首页版式升级（全幅 Hero 色带/悬浮订票/明度翻转区块） |
  | 2dcddd4 | 顶栏登录后拥挤修复（去重退出/nowrap/≤1180px 汉堡折叠） |
  | a29bede | FootprintMap 手绘地图升级（纸底回纹/线稿山水/朱红点亮脉冲，已定稿） |
  | 1c74f41 | 图片库扩充 18 张 + photos.ts 索引池 + 全站实景图接入 + 地图去 emoji 合规 |
  | d17a8a0 | Hero 改 img 渲染 + 独立遮罩（§3.1 误诊路线，已被 v2.2 勘误取代） |
  | 6cfc26f | 规范 v2.2：评审修订 + Hero 勘误 + emoji 巡检增补 + 新增 §3.7 |
  | d800b34 | §3.1 真修复：.card 撞类 scoped 透明化（三张轮播截图验收通过） |
  | ca9463f | 路由表补 name（商品/餐厅/农产品 6 处按 name 跳转失效修复） |
  | 1e869c6 | §3.0 动效与细节升级（v2.2 修订版应用面） |
  | 95606d5 | §3.7 地图点亮叙事：半径缩放 + 榜一唯一脉冲 + mock 路线3 |
  | 9663040 | §3.6 增补：全站 emoji 当图标清理（23 文件） |
  | a686ad6 | §3.0 D：文楷子集 37KB + 印章 + AppFooter（页脚与深色带连体） |
  | 65f3efd | §3.7B 演示种子路线3 + 活库同步 INSERT（灰站真源在后端） |
  | 71d9a0e | http.ts：1001 仅鉴权语义才清会话（Not Found 不再登出） |
  | ad81fac + 4c25991 + 11d3893 | 购物车登出根因（地址接口 GET→POST）+ 商品/餐厅封面本地化 + 立即购买改加购结算 + /login 死链 |
  | 6b56ddf | §3.7C 首页地图登录态个人语义 |
- 验证基线：`vitest run` = **31 文件 123 用例全绿**；`vite build` 通过。任何改动后必须保持。
- **进度总览（2026-09-11）**：3.0 ✅ ／ 3.1 ✅ ／ 3.2 ✅（六页全完成，含 FilterBar/HotelCard 共享组件）／ 3.6 emoji ✅（截图巡检已覆盖首页+线路+列表页，详情/社区待巡）／ 3.7 A+B+C ✅ ／ 3.3–3.5 ⬜ 未开始。
- **演示数据重建保障**：路线3/收货地址在 `seed.js`，农产品分类中文名在 `schema.sql`（setup-demo.sh 灌库自带 utf8mb4）——重灌即得全部校准数据；另有全量快照 `docs/database/2026-09-11-demo-data-backup.sql`（文件头附恢复命令）。
- **拍板记录（2026-09-11）**：AI 管家 FAB 保持仅首页显示（showFab = route.path === '/'），不改。
- **已知后端待办**：`/app/order/create` 直创订单缺 skuId 默认值必挂（前端已绕道加购结算）；cool 未知路由回 1001 易误导客户端（建议后端改 404 语义码）；种子封面图含 dummyimage/picsum 远程占位（前端已映射本地池兜底，种子可后补真实图）。

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
- **1c74f41 扩充**：`img/route|food|product|post` + `img/scenic` 新增共 18 张题材实景（Bing 图搜抓取→人工挑选，CREDITS 标注「个人学习用途」）。统一入口 **`src/data/photos.ts`**：`POST_PHOTOS`（游记 images 索引池）/ `ROUTE_COVERS` / `SCENIC_COVERS` / `HL_COVERS`——组件取图一律从这里引，禁止散落 assets 路径。补图管线：`scripts/probe-images.mjs`（关键词探测→拼版）→ 人工挑 → `scripts/accept-images.mjs`（入库+CREDITS）。
- 缺图时用 `.ph .ph-N`（纹样占位），**禁止引入远程图床**。fetch-assets.mjs 仍可用于 Unsplash 系换图。

## 2. 已落地样板（参照标准）

- **TopNav**（已定稿，勿再改）：纸色底 + 发丝线，高 56px；朱红印章 logo；激活项 `--ind-700` 加粗 + 2px 朱红下划线；导航项包 `.links`（nowrap，不折行）；用户名 120px 省略号；退出只在用户菜单内（无外挂重复项）；**≤1180px 折叠为汉堡（menu-2）+ 纵向发丝线菜单**，≤720px 隐藏搜索框。
- **首页版式**（a468385，`HomeView.vue`）：全幅 420px Hero 色带 + 右侧悬浮订票面板（`right: max(16px, calc((100vw - 1200px)/2))`）；金刚区 = 发丝线长条（无卡片，行间 1px 分隔，hover `--ind-50`）；手绘地图 = 全幅 `--ind-50` 色带；节庆 = `--ind-800` + `spiral-dark` 纹样块；底部攻略+数据 = 全幅 `--ind-950` + `meander-dark` 纹样收底；区块节奏 margin 44px / band padding 40-44px；移动端 <900px 降级。
- 后续所有页面按此密度与节奏对齐。

## 3. 待执行清单

### 3.0 动效与细节升级（v2.2 修订：对照 frontend-design skill 评审后收敛）

> 原则：一次精心编排的入场 > 散碎微交互；微交互过渡 150–350ms ease（入场编排的 reveal 可至 500ms）；`prefers-reduced-motion` 一律降级为静态；禁卡片浮起/位移。
> **v2.2 修订**（评审结论）：① B.1 的 01–07 序号属「模板默认特征」——编号标记仅适用于真实序列（步骤/时间线），首页区块是并列内容，**撤销**；② A.3 逐 section 全量 reveal 属 AI 默认入场，收敛为「Hero 编排 + 色带结构转折点」；③ 微交互补 `.hl:hover`（原实现遗漏）。

**A. 入场编排**（应用面收敛后）
1. `src/lib/reveal.ts`：`v-reveal` 指令（已实现，质量达标：一次性触发 + reduced-motion 双保险）。
2. `theme.css` 的 `.reveal/.reveal-in` 样式（已实现）。
3. **应用面（收敛版）**：Hero `.card-inner` 三元素（badge/title/subtitle）依次 delay 0/90/180ms——这是全页唯一的入场编排时刻；首屏以下只给「明度翻转色带」加 `v-reveal`（地图带 / 节庆深底带 / 页脚），普通纸底 section、卡片网格、列表一律不加。

**B. 编辑化构图**
1. ~~SectionHeader 序号~~（v2.2 撤销：SectionHeader 移除 `index` prop，theme.css 删 `.sec-index`）。
2. 首页「真实足迹」改 1 大 2 小不对称栅格：
   ```css
   .hl-row { grid-template-columns: 1.4fr 1fr; }
   .hl:first-child { grid-row: span 2; }
   .hl:first-child .hl-img { height: 316px; }  /* 150*2 + 16 gap */
   ```
3. 详情页正文首卡向上重叠头图：`margin-top: -24px; position: relative; z-index: 1; background: var(--paper); border: 1px solid var(--line);`。

**C. 微交互**
```css
/* 实景图缓放 */
.img-frame > img { transition: transform .35s ease; }
.card:hover .img-frame > img, .hl:hover .img-frame > img, .img-frame:hover > img { transform: scale(1.04); }
/* 文字链接下划线滑入（nav item / more / 正文链接） */
.link-slide { position: relative; }
.link-slide::after { content: ""; position: absolute; left: 0; bottom: -2px; width: 0; height: 1px; background: currentColor; transition: width .2s ease; }
.link-slide:hover::after { width: 100%; }
/* 按钮内 icon 微位移 */
.btn-primary .icon, .publish .icon { transition: transform .2s ease; }
.btn-primary:hover .icon, .publish:hover .icon { transform: translateX(2px); }
```
应用面：TopNav 的 `.item`、SectionHeader 的 `.more`、各列表/详情文字链接加 `.link-slide`；含 Icon 的主按钮自动生效。**注意：theme.css 落地时 `.hl:hover` 曾遗漏，需补上。**

**D. 点睛字体 + 印章母题**
1. 霞鹜文楷（LXGW WenKai，OFL 1.1 可商用）自托管子集。简体版不在 Google Fonts，走 GitHub release + pyftsubset：
   ```bash
   PY="C:\Users\cja\.workbuddy\binaries\python\envs\default\Scripts\python.exe"   # 无则先建 venv
   "$PY" -m pip install fonttools brotli
   curl -sL -o src/assets/fonts/LXGWWenKai-Regular.ttf "https://github.com/lxgw/LxgwWenKai/releases/download/v1.522/LXGWWenKai-Regular.ttf"
   "$PY" -m fontTools.subset src/assets/fonts/LXGWWenKai-Regular.ttf \
     --output-file=src/assets/fonts/lxgw-wenkai-400.woff2 --flavor=woff2 \
     --text="乌东苗寨文旅雷公山麓百年蜡染银饰梯田云海诗意栖居苗年芦笙节鼓藏节风雨桥鼓楼山歌米酒酸汤鱼糍粑刺绣织锦靛蓝染缸云上人家心之所向素履以往山河远阔人间烟火节庆团圆迎宾敬酒歌十二道拦门酒0123456789·，。、：？！—…「」 《》（）"
   ```
   成功后删除源 TTF（约 20MB，勿入库）；fonts.css 加 `@font-face { font-family: 'LXGW WenKai'; font-weight: 400; font-display: swap; src: url('./lxgw-wenkai-400.woff2') format('woff2'); }`；token 加 `--font-accent: "LXGW WenKai", "Noto Serif SC", serif;`；CREDITS.md 手动补一行（LXGW WenKai / OFL 1.1 / https://github.com/lxgw/LxgwWenKai）。**兜底**：子集化失败则放弃文楷，用 `--font-display` + 加大字距实现同类效果，不阻塞其余项。
2. 应用面（克制，仅 3 处）：Hero `.subtitle`、节庆卡 `.name`、页脚 slogan——`font-family: var(--font-accent); font-size: 15–18px;`。
3. 印章母题扩展（仅 1 处，避免滥用）：节庆卡右上角加 28×28 朱红印章角标（白字「节」，radius 2px，rotate(-4deg)）。
4. 新增全局页脚 `src/components/AppFooter.vue`（现在没有页脚）：`--ind-950` 底 + `meander-dark` 纹样；左列印章 + slogan（文楷）+ 一行简介；中列两栏站点链接（发丝线分隔）；右列「素材版权 CREDITS」链接（指向 /CREDITS.md 说明页或仓库）。在 `App.vue` 挂载。页脚也执行 `v-reveal` 入场。

### 3.1 【BUG】Hero 画面全白（已确诊，v2.2 勘误）
> v2.0 原诊断「hero-1 亮部占比过大 + 色罩偏弱」是**误诊**：实测 hero-1 平均亮度仅 117/255、亮部占比 11%，与 0.5 遮罩合成应为深色 rgb(64,73,76)。
**真根因**：`HeroCarousel.vue` 标题容器类名 `.card` 与 `theme.css` 全局工具类 `.card { background:#fff; border:1px solid var(--line) }` **撞类**——白底卡片以 z-2 铺满整张轮播（img z-0、遮罩 z-1 全被盖住），纸色标题落在白底上不可读。
执行（`HeroCarousel.vue` scoped 样式，`.card` 类名被测试引用不可删，只覆盖）：
```css
.slide .card { background: transparent; border: none; border-radius: 0; overflow: visible; }
```
遮罩维持 `rgba(11,29,44,.5)` 不动；d17a8a0 的 object-position 调整无害，保留。换图备选方案作废。
验收：截图中 40px 纸色宋体标题在**三张**轮播图上都清晰可读（点圆点逐张确认，修复后从未做过验收截图）。

### 3.2 列表页版式（6 个，结构同构）
文件：`RouteListView / ScenicListView / ProductListView / RestaurantListView / FarmProductListView / accommodation/HotelListView`（RouteList 封面已接入实景图，其余按同法复用 photos.ts：product-* / food-* / EXTRA_COVERS）
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
```
**v2.2 增补——emoji 当图标检查**（v1 巡检盲区，ScenicListView 标题 🎫、RouteDetailView ⭐/🔥、mock badge 🔥📷、RouteQuickView 📷 等残留）：`grep -rPn "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" src/ --exclude-dir=__tests__`（`*.spec.ts` 按纪律豁免；AiButler 演示脚本文案与用户头像 emoji 属内容非图标，豁免）。命中项改为 `<Icon name>` 或纯文字。
```bash
"$N" node_modules/vitest/vitest.mjs run    # 123 全绿
"$N" node_modules/vite/bin/vite.js build   # 通过
```
截图巡检（agent-browser，mock 模式 dev）：首页（首屏+滚到底）、线路列表、线路详情、民宿列表、民宿详情、社区、我的订单。逐张确认：无绿色/橙色残留、无投影、标题宋体生效、图片非远程。

### 3.7 地图点亮叙事（v2.2 新增，2026-09-11 排查结论）
排查确认：全亮不是 bug——判定链 `FootprintMap s.lit` ← `footprint.ts lit = spotLightCounts > 0`（≥1 人持已核销票即亮），mock 里 3 用户已核销票覆盖路线并集全部 5 站，数字与截图逐一吻合（3/2/2/3/2）。**填充真实数据库不会带来暗站**（数据越多越全亮），暗站只出现在从未被核销的新站。
1. **A 兑现「站点大小 = 被点亮次数」**（HomeView 副标题已如此承诺，实现是固定半径）：`FootprintMap` 节点半径随 `lightCount` 缩放（如 node `r = 9 + min(count, 8)`，halo 同步放大；mini 变体用小系数）。纯组件层，不改交互。
2. **B mock 演示灰态（v2.2.1 实施真相）**：**travelApi 全部走真实后端 8001（vite 代理），前端 `data/mock.ts` 的路线不影响线上地图**——lit/lightCount 由后端 space 模块计算。灰站真源 = 演示库数据：已在 `cool-admin-midway/scripts/seed.js` 补路线3「蜡染体验半日游」（仅蜡染坊 spot5、无人核销）并同步 INSERT 进活库（65f3efd）。重灌演示数据后灰站依然成立。
3. **C（已拍板并实施，6b56ddf）**：登录用户首页地图切个人语义（你的点亮 vs 未解锁），数据源 `communityApi.userProfile(session.user.id).litSpotIds`；匿名保持全局态。与订票弹窗「核销自动点亮」闭环。
4. 附带：全亮时 5 站同时无限脉冲偏吵，做 A 时顺手收敛——仅 `lightCount` 最高的站点保留 `fp-pulse`，其余静态 halo。

## 4. 工作纪律（执行模型必读）

1. **同一文件的多次编辑必须串行**（一次只发一个 Edit，禁止并行批量改同一文件——本会话已两次因此丢写）。改完关键文件用 grep 验证编辑真的落盘。
2. 不许改 `*.spec.ts`；测试引用的 class 名（.slide/.dot/.card 等）不许删。
3. commit 按批次（3.1 / 3.2 / 3.3 / 3.4 / 3.6 各一个），message 中文、格式同现有历史（`feat(wudong-web): …`）。**分支名禁含斜杠**。
4. 后台起 dev server 必须用 run_in_background（shell `&` 会被回收）；agent-browser 截图后必须 `agent-browser close`。
5. 遇到拿不准的视觉决策，回到「设计纪律」六条判断；不要引入新的强调色、不要加渐变/投影、不要引远程图。
