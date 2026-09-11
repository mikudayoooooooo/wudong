#!/usr/bin/env node
/**
 * 把人工挑中的候选图正式入库：
 * 1. 读 scripts/.probe/picks.json —— { "<slotId>": <编号 1..N 或 0=放弃> }
 * 2. 复制选中图到 src/assets/img/<cat>/<slotId>.jpg
 * 3. 更新 src/assets/manifest.json 与 CREDITS.md（标注：网络抓取·个人学习用途）
 *
 * 用法：node scripts/accept-images.mjs
 */
import { mkdir, copyFile, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROBE = path.join(ROOT, 'scripts/.probe');
const MANIFEST_PATH = path.join(ROOT, 'src/assets/manifest.json');
const CREDITS_PATH = path.join(ROOT, 'CREDITS.md');

const log = (...a) => console.log('[accept]', ...a);

const index = JSON.parse(await readFile(path.join(PROBE, 'index.json'), 'utf8'));
const picks = JSON.parse(await readFile(path.join(PROBE, 'picks.json'), 'utf8'));
const manifest = existsSync(MANIFEST_PATH) ? JSON.parse(await readFile(MANIFEST_PATH, 'utf8')) : {};

let ok = 0, skip = 0;
for (const slot of index) {
  const pick = picks[slot.id];
  if (!pick) { skip++; continue; }
  const cand = slot.saved?.[pick - 1];
  if (!cand) { log(`跳过 ${slot.id}：候选 #${pick} 不存在`); skip++; continue; }
  const srcAbs = path.join(PROBE, slot.id, cand.file);
  const ext = path.extname(cand.file);
  const rel = `src/assets/img/${slot.cat}/${slot.id}${ext}`;
  await mkdir(path.join(ROOT, 'src/assets/img', slot.cat), { recursive: true });
  await copyFile(srcAbs, path.join(ROOT, rel));
  manifest[slot.id] = {
    kind: 'photo', file: rel, status: 'ok', fetchedAt: new Date().toISOString(),
    source: cand.src, license: '网络抓取（个人学习用途，商用前须替换为正版图）',
  };
  ok++;
  log(`✓ ${slot.id} <- #${pick}（${cand.kb}KB）`);
}

await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
const lines = [
  '# CREDITS · 第三方素材版权出处',
  '',
  '> 本文件由抓取脚本自动维护。本地生成的纹样/头像/占位图为项目自制，未列入。',
  '> ⚠️ 标注「网络抓取」的素材仅作个人学习用途，商用前必须替换为正版图或取得授权。',
  '',
  '| 文件 | 类型 | 来源 | 协议 |',
  '|---|---|---|---|',
];
for (const [id, m] of Object.entries(manifest)) {
  if (!m.source || m.selfMade) continue;
  lines.push(`| ${m.file ?? id} | ${m.kind ?? ''} | ${m.source} | ${m.license ?? ''} |`);
}
await writeFile(CREDITS_PATH, lines.join('\n') + '\n');
log(`入库 ${ok} 张，跳过 ${skip} 个槽位`);
