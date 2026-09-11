// 素材清单配置：图片槽位、图标、字体、纹样、头像。
// 每个图片槽位的兜底链：candidates（策划的 Unsplash/Pexels CDN 直链，可商用协议）
//   → picsum（Unsplash 协议图床，稳定但题材泛化）→ 本地生成纹样 SVG（必成功）。
// 拿到 PEXELS_API_KEY / UNSPLASH_ACCESS_KEY 后可在 fetch-assets.mjs 中启用 API 检索通道。

const U = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&fm=jpg&fit=crop`;
const P = (id, w = 1600) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const photos = [
  // ── 首页 Hero（1920×1080 宽幅）──
  {
    id: 'hero-1', target: 'src/assets/img/hero/hero-1.jpg', w: 1920, h: 1080,
    seed: 'wudong-hero-1', theme: '云雾山峦',
    candidates: [U('1506905925346-21bda4d32df4', 1920), U('1464822759023-fed622ff2c3b', 1920)],
  },
  {
    id: 'hero-2', target: 'src/assets/img/hero/hero-2.jpg', w: 1920, h: 1080,
    seed: 'wudong-hero-2', theme: '山谷梯田绿野',
    candidates: [U('1493246507139-91e8fad9978e', 1920), U('1470071459604-3b5ec3a7fe05', 1920)],
  },
  {
    id: 'hero-3', target: 'src/assets/img/hero/hero-3.jpg', w: 1920, h: 1080,
    seed: 'wudong-hero-3', theme: '湖泊水色',
    candidates: [U('1476514525535-07fb3b4ae5f1', 1920), U('1501785888041-af3ef285b470', 1920)],
  },
  // ── 线路/景点封面（1600×1000）──
  {
    id: 'scenic-waterfall', target: 'src/assets/img/scenic/waterfall.jpg', w: 1600, h: 1000,
    seed: 'wudong-waterfall', theme: '瀑布溪谷',
    candidates: [U('1433086966358-54859d0ed716', 1600), P('2387873', 1600)],
  },
  {
    id: 'scenic-lake-cabin', target: 'src/assets/img/scenic/lake-cabin.jpg', w: 1600, h: 1000,
    seed: 'wudong-lake-cabin', theme: '湖畔木屋',
    candidates: [U('1470770841072-f978cf4d019e', 1600), P('417074', 1600)],
  },
  {
    id: 'scenic-forest', target: 'src/assets/img/scenic/forest.jpg', w: 1600, h: 1000,
    seed: 'wudong-forest', theme: '原始森林',
    candidates: [U('1441974231531-c6227db76b6e', 1600), U('1502082553048-f009c37129b9', 1600)],
  },
  {
    id: 'scenic-field', target: 'src/assets/img/scenic/field.jpg', w: 1600, h: 1000,
    seed: 'wudong-field', theme: '麦田花海',
    candidates: [U('1465146344425-f00d5f5c8f07', 1600), U('1472214103451-9374bd1c798e', 1600)],
  },
  // ── 民宿 mock（900×600，题材经人工审核：木屋/湖山/客房）──
  { id: 'hotel-h1', target: 'src/assets/img/hotel/h1.jpg', w: 900, h: 600, seed: 'h1', theme: '林中木屋', candidates: [U('1449158743715-0a90ebb6d2d8', 900)] },
  { id: 'hotel-h1b', target: 'src/assets/img/hotel/h1b.jpg', w: 900, h: 600, seed: 'h1b', theme: '湖上栈桥', candidates: [U('1439066615861-d1af74d74000', 900)] },
  { id: 'hotel-h2', target: 'src/assets/img/hotel/h2.jpg', w: 900, h: 600, seed: 'h2', theme: '湖山扁舟', candidates: [U('1476514525535-07fb3b4ae5f1', 900)] },
  { id: 'hotel-h3', target: 'src/assets/img/hotel/h3.jpg', w: 900, h: 600, seed: 'h3', theme: '云雾山峦', candidates: [U('1470071459604-3b5ec3a7fe05', 900)] },
  { id: 'hotel-r1', target: 'src/assets/img/hotel/r1.jpg', w: 900, h: 600, seed: 'r1', theme: '木屋大床房', candidates: [U('1590490360182-c33d57733427', 900)] },
  { id: 'hotel-r2', target: 'src/assets/img/hotel/r2.jpg', w: 900, h: 600, seed: 'r2', theme: '观景双床房', candidates: [U('1578683010236-d716f9a3f461', 900)] },
];

// Tabler Icons（MIT），1.5px 描边线性图标，统一全站图标语言
export const icons = [
  'home', 'map-pin', 'map-pins', 'ticket', 'bed', 'tools-kitchen-2', 'shopping-cart',
  'user', 'user-circle', 'heart', 'heart-filled', 'star', 'star-filled', 'search',
  'arrow-right', 'arrow-left', 'arrow-up-right', 'plus', 'minus', 'x', 'check',
  'calendar', 'calendar-time', 'clock', 'phone', 'mail', 'message-circle', 'messages',
  'camera', 'compass', 'mountain', 'leaf', 'chef-hat', 'building', 'building-community',
  'credit-card', 'chevron-down', 'chevron-right', 'chevron-left', 'menu-2', 'logout',
  'settings', 'trash', 'edit', 'send', 'sparkles', 'robot', 'bookmark', 'share',
  'eye', 'flag', 'info-circle', 'alert-circle', 'refresh', 'bus', 'walk', 'tent',
  'basket', 'gift', 'tag', 'users', 'filter', 'mood-smile', 'photo', 'qrcode',
];

// 思源宋体标题字（OFL），text= 动态子集只打包配置中的字符，体积极小。
// 正文继续使用系统字体栈（PingFang SC / Microsoft YaHei），不额外下载。
export const fontSubsetText =
  '乌东苗寨文旅首页行订票住宿非遗商品特色餐厅新鲜农产品社区交通攻略我的票务发布' +
  '搜索路线景区游记话题雷公山麓百年蜡染银饰梯田云海预订行程了解立即查看详情' +
  '热门推荐精选价格起人天晚元好评收藏分享登录注册个人主页订单收藏夹' +
  '吊脚楼木楼观星青山伴月家庭亲子长住旅居摄影私藏地酸汤鱼米酒糍粑' +
  '苗年鼓藏节芦笙歌舞刺绣织锦靛蓝染缸风雨桥鼓楼上巳节' +
  '0123456789·，。、：？！—…「」《》（）%+-~ ';

export const fonts = [
  { family: 'Noto Serif SC', weight: 500, file: 'noto-serif-sc-500.woff2' },
  { family: 'Noto Serif SC', weight: 700, file: 'noto-serif-sc-700.woff2' },
];

// 首字头像（本地生成，零版权风险）：靛蓝色底 + 纸色宋体首字
export const avatars = [
  { char: '阿', bg: '#1b425f', file: 'avatar-a.svg' },
  { char: '苗', bg: '#35648a', file: 'avatar-miao.svg' },
  { char: '山', bg: '#14324a', file: 'avatar-shan.svg' },
  { char: '水', bg: '#2e5f86', file: 'avatar-shui.svg' },
  { char: '绣', bg: '#4a7a9b', file: 'avatar-xiu.svg' },
  { char: '银', bg: '#0b1d2c', file: 'avatar-yin.svg' },
];

// 蜡染纹样（本地程序化生成，零版权风险）
export const patterns = ['meander', 'spiral', 'diamond', 'fish'];
