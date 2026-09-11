#!/usr/bin/env node
/**
 * 乌东苗寨 C 端静态资源抓取/生成管线（零依赖，Node >= 20）。
 *
 * 用法：
 *   node scripts/fetch-assets.mjs                 # 全量（已存在的跳过，可断点续抓）
 *   node scripts/fetch-assets.mjs --only photos   # 只跑某类：photos/icons/fonts/patterns/avatars
 *   node scripts/fetch-assets.mjs --force         # 忽略已有文件重新抓
 *   node scripts/fetch-assets.mjs --ids hero-1    # 只抓指定 id（配合 --force）
 *
 * 图源兜底链（每张图独立）：
 *   1. 策划直链 candidates（Unsplash/Pexels 官方 CDN，Unsplash License / Pexels License，均可免费商用）
 *   2. picsum.photos 种子图（Unsplash 协议图源，题材泛化但稳定）
 *   3. 本地程序化生成的蜡染纹样 SVG（必成功，零版权风险）
 * 如设置 PEXELS_API_KEY / UNSPLASH_ACCESS_KEY，可在 candidates 之前插入 API 检索通道（见 searchViaApi）。
 *
 * 产物：
 *   src/assets/{img,icons,fonts,pattern,avatar}/...
 *   src/assets/manifest.json   抓取清单（来源/协议/状态）
 *   CREDITS.md                 版权出处清单（自动渲染）
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { photos, icons, fonts, fontSubsetText, avatars, patterns } from './assets.config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = path.join(ROOT, 'src/assets/manifest.json');
const CREDITS_PATH = path.join(ROOT, 'CREDITS.md');

const TIMEOUT_MS = 10_000;
const MAX_RETRY = 3;
const CONCURRENCY = 3;
const MIN_PHOTO_BYTES = 20 * 1024;

const args = process.argv.slice(2);
const FLAG = (name) => args.includes(name);
const ARG = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const ONLY = ARG('--only')?.split(',') ?? null;
const FORCE = FLAG('--force');
const IDS = ARG('--ids')?.split(',') ?? null;

const log = (...a) => console.log('[assets]', ...a);
const warn = (...a) => console.warn('[assets][warn]', ...a);

/* ---------------- 基础 HTTP：超时 + 重试 + 退避 ---------------- */

async function fetchBuf(url, { headers = {}, timeout = TIMEOUT_MS } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'wudong-assets/1.0', ...headers },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get('content-type') ?? '';
    return { buf: Buffer.from(await res.arrayBuffer()), type, finalUrl: res.url };
  } finally {
    clearTimeout(t);
  }
}

async function withRetry(fn, label) {
  let lastErr;
  for (let i = 0; i < MAX_RETRY; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const wait = 500 * 2 ** i;
      warn(`${label} 第 ${i + 1} 次失败（${e.message}），${wait}ms 后重试`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

/** 简单并发池 */
async function pool(items, worker, concurrency = CONCURRENCY) {
  const results = new Array(items.length);
  let idx = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (idx < items.length) {
        const i = idx++;
        results[i] = await worker(items[i], i);
      }
    }),
  );
  return results;
}

/* ---------------- manifest / credits ---------------- */

async function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) return {};
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  } catch {
    return {};
  }
}

const manifest = await loadManifest();
const record = (id, entry) => {
  manifest[id] = { ...manifest[id], ...entry, fetchedAt: new Date().toISOString() };
};

async function flushOutputs() {
  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  const lines = [
    '# CREDITS · 第三方素材版权出处',
    '',
    '> 本文件由 `scripts/fetch-assets.mjs` 自动生成，请勿手改。',
    '> 本地生成的纹样/头像/占位图为项目自制，随项目协议使用，未列入本清单。',
    '',
    '| 文件 | 类型 | 来源 | 协议 |',
    '|---|---|---|---|',
  ];
  for (const [id, m] of Object.entries(manifest)) {
    if (!m.source || m.selfMade) continue;
    lines.push(`| ${m.file ?? id} | ${m.kind ?? ''} | ${m.source} | ${m.license ?? ''} |`);
  }
  lines.push('');
  await writeFile(CREDITS_PATH, lines.join('\n'));
}

const skip = (id, file) =>
  !FORCE && !IDS && manifest[id]?.status === 'ok' && file && existsSync(path.join(ROOT, file));

/* ---------------- 本地生成：蜡染纹样 / 头像 / 占位图 ---------------- */

const INDIGO = { deep: '#14324a', main: '#1b425f', paper: '#fbf7ee' };

function patternSvg(kind, { bg = INDIGO.deep, fg = 'rgba(251,247,238,.16)', w = 800, h = 500 } = {}) {
  let body = '';
  if (kind === 'meander') {
    // 回纹：横纵等距折线
    for (let y = 20; y < h; y += 48)
      for (let x = 20; x < w; x += 48)
        body += `<path d="M${x} ${y} h24 v24 h-12 v-12 h-12" fill="none" stroke="${fg}" stroke-width="2"/>`;
  } else if (kind === 'spiral') {
    // 涡纹：大小螺旋圆点阵
    for (let y = 30; y < h; y += 60)
      for (let x = 30; x < w; x += 60) {
        body += `<circle cx="${x}" cy="${y}" r="14" fill="none" stroke="${fg}" stroke-width="2"/>`;
        body += `<circle cx="${x}" cy="${y}" r="5" fill="${fg}"/>`;
      }
  } else if (kind === 'diamond') {
    // 菱格纹
    for (let y = 0; y < h + 40; y += 40)
      for (let x = 0; x < w + 40; x += 40)
        body += `<path d="M${x} ${y - 20} l20 20 l-20 20 l-20 -20 z" fill="none" stroke="${fg}" stroke-width="1.5"/>`;
  } else if (kind === 'fish') {
    // 抽象鱼纹：连续弧鳞
    for (let y = 0; y < h + 30; y += 30)
      for (let x = ((y / 30) % 2) * 15; x < w + 30; x += 30)
        body += `<path d="M${x - 15} ${y} a15 15 0 0 1 30 0" fill="none" stroke="${fg}" stroke-width="2"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${bg}"/>${body}</svg>`;
}

function placeholderSvg(label, w = 800, h = 500) {
  // 图片抓取全部失败时的兜底占位：深靛底 + 回纹 + 主题词，宋体标题字
  const deco = patternSvg('meander', { w, h }).replace(/<svg[^>]*>|<\/svg>/g, '');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${deco}<text x="${w / 2}" y="${h / 2 + 10}" text-anchor="middle" font-family="serif" font-size="34" fill="${INDIGO.paper}" fill-opacity=".85">${label}</text></svg>`;
}

function avatarSvg(char, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="${bg}"/><text x="48" y="62" text-anchor="middle" font-family="serif" font-size="44" fill="${INDIGO.paper}">${char}</text></svg>`;
}

/* ---------------- 1. 照片 ---------------- */

function picsumUrl(seed, w, h) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

function isValidPhoto({ buf, type }) {
  return /^image\/(jpeg|jpg|png|webp)/i.test(type) && buf.length >= MIN_PHOTO_BYTES;
}

/** 可选：API 检索通道（有 key 时启用，返回直链或 null） */
async function searchViaApi(slot) {
  const pexelsKey = process.env.PEXELS_API_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  if (pexelsKey) {
    try {
      const { buf } = await withRetry(
        () => fetchBuf(`https://api.pexels.com/v1/search?query=${encodeURIComponent(slot.theme)}&per_page=1`, { headers: { Authorization: pexelsKey } }),
        'pexels-api',
      );
      const hit = JSON.parse(buf.toString())?.photos?.[0];
      if (hit) return { url: hit.src.large2x ?? hit.src.large, license: 'Pexels License', source: `https://www.pexels.com/photo/${hit.id}/` };
    } catch { /* 继续下一通道 */ }
  }
  if (unsplashKey) {
    try {
      const { buf } = await withRetry(
        () => fetchBuf(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(slot.theme)}&per_page=1`, { headers: { 'Accept-Version': 'v1', Authorization: `Client-ID ${unsplashKey}` } }),
        'unsplash-api',
      );
      const hit = JSON.parse(buf.toString())?.results?.[0];
      if (hit) return { url: `${hit.urls.raw}&w=${slot.w}`, license: 'Unsplash License', source: hit.links.html };
    } catch { /* 继续下一通道 */ }
  }
  return null;
}

async function fetchPhoto(slot) {
  const abs = path.join(ROOT, slot.target);
  if (skip(slot.id, slot.target)) return log(`跳过 ${slot.id}（已存在）`);
  await mkdir(path.dirname(abs), { recursive: true });

  const attempts = [];
  if (!slot.picsumOnly) {
    const api = await searchViaApi(slot);
    if (api) attempts.push({ url: api.url, license: api.license, source: api.source });
    for (const url of slot.candidates)
      attempts.push({
        url,
        license: url.includes('images.unsplash.com') ? 'Unsplash License' : 'Pexels License',
        source: url.split('?')[0],
      });
  }
  attempts.push({ url: picsumUrl(slot.seed, slot.w, slot.h), license: 'Unsplash License (via picsum.photos)', source: `https://picsum.photos/seed/${slot.seed}` });

  for (const a of attempts) {
    try {
      const got = await withRetry(() => fetchBuf(a.url), slot.id);
      if (!isValidPhoto(got)) throw new Error(`校验失败（${got.type}, ${got.buf.length}B）`);
      await writeFile(abs, got.buf);
      record(slot.id, { kind: 'photo', file: path.relative(ROOT, abs), status: 'ok', source: a.source, license: a.license });
      return log(`✓ ${slot.id} <- ${a.url.slice(0, 80)}（${(got.buf.length / 1024).toFixed(0)}KB）`);
    } catch (e) {
      warn(`${slot.id} 通道失败：${a.url.slice(0, 60)} — ${e.message}`);
    }
  }

  // 终极兜底：本地纹样占位 SVG
  const svgPath = slot.target.replace(/\.\w+$/, '.svg');
  await writeFile(path.join(ROOT, svgPath), placeholderSvg(slot.theme, slot.w > 1200 ? 960 : slot.w, slot.w > 1200 ? 540 : slot.h));
  record(slot.id, { kind: 'photo', file: svgPath, status: 'placeholder', selfMade: true });
  warn(`${slot.id} 所有图源失败，已生成纹样占位 ${svgPath}`);
}

/* ---------------- 2. 图标（Tabler, MIT） ---------------- */

async function fetchIcon(name) {
  const file = `src/assets/icons/${name}.svg`;
  if (skip(`icon:${name}`, file)) return;
  const abs = path.join(ROOT, file);
  await mkdir(path.dirname(abs), { recursive: true });
  // filled 变体在 @tabler/icons 的 filled/ 目录下（如 heart-filled → filled/heart.svg）
  const isFilled = name.endsWith('-filled');
  const iconPath = isFilled ? `filled/${name.slice(0, -7)}` : `outline/${name}`;
  const url = `https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/${iconPath}.svg`;
  try {
    const { buf } = await withRetry(() => fetchBuf(url), `icon:${name}`);
    let svg = buf.toString();
    if (!svg.includes('<svg')) throw new Error('非 SVG 响应');
    // 统一描边色为 currentColor，便于 CSS 控制
    svg = svg.replace(/stroke="[^"]*"/, 'stroke="currentColor"');
    await writeFile(abs, svg);
    record(`icon:${name}`, { kind: 'icon', file, status: 'ok', source: url, license: 'MIT (Tabler Icons)' });
  } catch (e) {
    record(`icon:${name}`, { kind: 'icon', status: 'failed', note: e.message });
    warn(`图标 ${name} 抓取失败：${e.message}（不阻塞流程）`);
  }
}

/* ---------------- 3. 字体（Noto Serif SC, OFL，text= 子集） ---------------- */

async function fetchFont(f) {
  const file = `src/assets/fonts/${f.file}`;
  if (skip(`font:${f.file}`, file)) return;
  const abs = path.join(ROOT, file);
  await mkdir(path.dirname(abs), { recursive: true });
  const cssUrl =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f.family)}:wght@${f.weight}` +
    `&text=${encodeURIComponent(fontSubsetText)}&display=swap`;
  const chromeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
  try {
    const { buf: css } = await withRetry(() => fetchBuf(cssUrl, { headers: { 'User-Agent': chromeUA } }), `font-css:${f.file}`);
    const m = css.toString().match(/url\((https:\/\/[^)]+\.[^)]+)\)\s*format\('woff2'\)/);
    if (!m) throw new Error('css2 响应中未找到 woff2 地址');
    const { buf } = await withRetry(() => fetchBuf(m[1], { headers: { 'User-Agent': chromeUA } }), `font-bin:${f.file}`);
    if (buf.length < 4 * 1024) throw new Error(`字体文件异常（${buf.length}B）`);
    await writeFile(abs, buf);
    record(`font:${f.file}`, { kind: 'font', file, status: 'ok', source: 'https://fonts.google.com/noto/specimen/Noto+Serif+SC', license: 'SIL Open Font License 1.1' });
    log(`✓ 字体 ${f.file}（${(buf.length / 1024).toFixed(0)}KB，子集 ${[...new Set(fontSubsetText)].length} 字）`);
  } catch (e) {
    record(`font:${f.file}`, { kind: 'font', status: 'failed', note: e.message });
    warn(`字体 ${f.family} ${f.weight} 抓取失败：${e.message}（正文/标题将回退系统字体栈）`);
  }
}

/** 生成 fonts.css（本地 @font-face，只引用成功下载的字重） */
async function writeFontFace() {
  const ok = fonts.filter((f) => manifest[`font:${f.file}`]?.status === 'ok');
  const css = ok
    .map(
      (f) => `@font-face {
  font-family: 'Noto Serif SC';
  font-style: normal;
  font-weight: ${f.weight};
  font-display: swap;
  src: url('./${f.file}') format('woff2');
}`,
    )
    .join('\n\n');
  await writeFile(path.join(ROOT, 'src/assets/fonts/fonts.css'), css ? css + '\n' : '/* 字体抓取失败，本文件为空；标题将回退系统宋体栈 */\n');
}

/* ---------------- 4/5. 纹样与头像（本地生成） ---------------- */

async function genPatterns() {
  const dir = path.join(ROOT, 'src/assets/pattern');
  await mkdir(dir, { recursive: true });
  for (const kind of patterns) {
    for (const variant of [
      { suffix: 'dark', bg: INDIGO.deep },
      { suffix: 'light', bg: '#eef3f6', fg: 'rgba(27,66,95,.14)' },
    ]) {
      const file = `src/assets/pattern/${kind}-${variant.suffix}.svg`;
      if (skip(`pattern:${file}`, file)) continue;
      await writeFile(path.join(ROOT, file), patternSvg(kind, variant));
      record(`pattern:${file}`, { kind: 'pattern', file, status: 'ok', selfMade: true });
    }
  }
  log('✓ 纹样生成完毕（回纹/涡纹/菱格/鱼纹 × 深浅双色）');
}

async function genAvatars() {
  const dir = path.join(ROOT, 'src/assets/avatar');
  await mkdir(dir, { recursive: true });
  for (const a of avatars) {
    const file = `src/assets/avatar/${a.file}`;
    if (skip(`avatar:${a.file}`, file)) continue;
    await writeFile(path.join(ROOT, file), avatarSvg(a.char, a.bg));
    record(`avatar:${a.file}`, { kind: 'avatar', file, status: 'ok', selfMade: true });
  }
  log('✓ 首字头像生成完毕');
}

/* ---------------- main ---------------- */

const stages = {
  photos: () => pool(photos.filter((p) => !IDS || IDS.includes(p.id)), fetchPhoto),
  icons: () => pool(icons, fetchIcon),
  fonts: async () => { await pool(fonts, fetchFont); await writeFontFace(); },
  patterns: genPatterns,
  avatars: genAvatars,
};

const todo = ONLY ?? Object.keys(stages);
for (const s of todo) {
  if (!stages[s]) { warn(`未知阶段 ${s}`); continue; }
  log(`── ${s} ──`);
  await stages[s]();
}
await flushOutputs();

const failed = Object.entries(manifest).filter(([, m]) => m.status === 'failed');
const placeholders = Object.entries(manifest).filter(([, m]) => m.status === 'placeholder');
log(`完成：${Object.keys(manifest).length} 项，占位 ${placeholders.length} 项，失败 ${failed.length} 项`);
if (failed.length) warn('失败项：', failed.map(([k]) => k).join(', '));
