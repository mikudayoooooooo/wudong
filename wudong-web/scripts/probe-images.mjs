#!/usr/bin/env node
/**
 * 题材图片探测抓取（个人学习用途）：按槽位关键词抓 Bing 图片搜索 Top-N 候选，
 * 存到 scripts/.probe/<slot>/<n>.jpg，人工挑选后由 accept-images.mjs 正式入库。
 *
 * 用法：
 *   node scripts/probe-images.mjs                # 全部槽位
 *   node scripts/probe-images.mjs --ids food-1   # 指定槽位
 *   node scripts/probe-images.mjs --per 5        # 每槽位候选数（默认 3）
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'scripts/.probe');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

// 扩充槽位：id / 目标目录（accept 时用）/ 检索词
export const probeSlots = [
  // 路线封面 ×4
  { id: 'route-wudong', cat: 'route', kw: '贵州 苗寨 村落 吊脚楼', label: '乌东苗寨全景' },
  { id: 'route-leigong', cat: 'route', kw: '贵州 云雾 山村', label: '雷公山徒步' },
  { id: 'route-xijiang', cat: 'route', kw: '千户苗寨', label: '千户苗寨' },
  { id: 'route-festival', cat: 'route', kw: '苗族 芦笙节 盛装', label: '节庆路线' },
  // 景点 ×4
  { id: 'scenic-terrace', cat: 'scenic', kw: '贵州 梯田 日落', label: '梯田日落' },
  { id: 'scenic-cloud', cat: 'scenic', kw: '雷公山 云海', label: '雷公云海' },
  { id: 'scenic-bridge', cat: 'scenic', kw: '苗寨 风雨桥', label: '风雨桥' },
  { id: 'scenic-falls', cat: 'scenic', kw: '黄果树瀑布', label: '峡谷瀑布' },
  // 餐饮 ×4
  { id: 'food-sourfish', cat: 'food', kw: '贵州 酸汤鱼', label: '酸汤鱼' },
  { id: 'food-ricewine', cat: 'food', kw: '贵州 糯米酒 酒坛', label: '米酒' },
  { id: 'food-ciba', cat: 'food', kw: '糍粑 打糍粑', label: '糍粑' },
  { id: 'food-longtable', cat: 'food', kw: '贵州 长桌宴 吃饭', label: '长桌宴' },
  // 非遗商品 ×4
  { id: 'product-silver', cat: 'product', kw: '苗族 银饰 头饰', label: '银饰' },
  { id: 'product-batik', cat: 'product', kw: '蜡染 布料 靛蓝', label: '蜡染' },
  { id: 'product-embroidery', cat: 'product', kw: '苗绣 刺绣 细节', label: '苗绣' },
  { id: 'product-brocade', cat: 'product', kw: '织锦 布料 纹样 特写', label: '织锦' },
  // 社区游记 ×6
  { id: 'post-1', cat: 'post', kw: '苗寨 旅拍 人像', label: '旅拍人像' },
  { id: 'post-2', cat: 'post', kw: '苗族姑娘 银饰盛装', label: '苗族服饰' },
  { id: 'post-3', cat: 'post', kw: '梯田 日出 云海', label: '梯田晨雾' },
  { id: 'post-4', cat: 'post', kw: '千户苗寨 夜景 灯火', label: '苗寨夜景' },
  { id: 'post-5', cat: 'post', kw: '贵州 旅行 山水', label: '贵州山水' },
  { id: 'post-6', cat: 'post', kw: '苗族 节日 歌舞', label: '苗节歌舞' },
];

const args = process.argv.slice(2);
const ARG = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const IDS = ARG('--ids')?.split(',') ?? null;
const PER = Number(ARG('--per') ?? 3);
const TIMEOUT = 15_000;

const log = (...a) => console.log('[probe]', ...a);

async function fetchBuf(url, headers = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: 'follow', headers: { 'User-Agent': UA, ...headers } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { buf: Buffer.from(await res.arrayBuffer()), type: res.headers.get('content-type') ?? '' };
  } finally { clearTimeout(t); }
}

async function bingImageUrls(kw, count) {
  const url = `https://cn.bing.com/images/search?q=${encodeURIComponent(kw)}&mkt=zh-CN&form=HDRSC2`;
  const { buf } = await fetchBuf(url);
  const html = buf.toString('utf8');
  const urls = [];
  for (const m of html.matchAll(/murl&quot;:&quot;([^&]+?)&quot;/g)) {
    const u = m[1];
    if (/^https?:\/\//.test(u) && !urls.includes(u)) urls.push(u);
    if (urls.length >= count * 3) break; // 多取防失效
  }
  return urls;
}

async function probeSlot(slot) {
  const dir = path.join(OUT, slot.id);
  await mkdir(dir, { recursive: true });
  let urls;
  try {
    urls = await bingImageUrls(slot.kw, PER);
  } catch (e) {
    return { id: slot.id, error: `搜索失败: ${e.message}`, saved: [] };
  }
  const saved = [];
  let i = 0;
  for (const u of urls) {
    if (saved.length >= PER) break;
    i++;
    try {
      const { buf, type } = await fetchBuf(u, { Referer: 'https://cn.bing.com/' });
      if (!/^image\/(jpeg|jpg|png|webp)/i.test(type) || buf.length < 20 * 1024) continue;
      const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
      const file = `${saved.length + 1}.${ext}`;
      await writeFile(path.join(dir, file), buf);
      saved.push({ file, src: u, kb: Math.round(buf.length / 1024) });
    } catch { /* 单个失败跳过 */ }
  }
  log(`${slot.id}（${slot.kw}）：${saved.length} 张候选`);
  return { id: slot.id, cat: slot.cat, label: slot.label, kw: slot.kw, saved };
}

const todo = probeSlots.filter((s) => !IDS || IDS.includes(s.id));
const results = [];
for (const s of todo) results.push(await probeSlot(s)); // 串行，避免触发反爬
await mkdir(OUT, { recursive: true });
// 与已有 index.json 合并（按 id 覆盖），保证分批次探测不丢历史记录
const indexPath = path.join(OUT, 'index.json');
const prev = existsSync(indexPath) ? JSON.parse(await readFile(indexPath, 'utf8')) : [];
const merged = [...prev.filter((p) => !todo.some((s) => s.id === p.id)), ...results];
await writeFile(indexPath, JSON.stringify(merged, null, 2));
const total = results.reduce((n, r) => n + (r.saved?.length ?? 0), 0);
log(`完成：${todo.length} 个槽位，共 ${total} 张候选 → scripts/.probe/<slot>/`);
log('下一步：人工挑选后在 scripts/.probe/picks.json 写 { "<slot>": <编号> }，再跑 accept-images.mjs');
