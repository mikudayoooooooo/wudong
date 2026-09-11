// 本地截图工具（playwright-core + agent-browser 的 Chrome）
// 用法：node scripts/shot.mjs <url> <out.png> [waitMs] [scrollY] [width] [height]
import { chromium } from 'playwright-core';

const EXE = 'C:\\Users\\cja\\.agent-browser\\browsers\\chrome-153.0.8010.36\\chrome.exe';
const [, , url, out, waitMs = '2500', scrollY = '0', w = '1440', h = '900'] = process.argv;

const browser = await chromium.launch({ executablePath: EXE });
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(Number(waitMs));
if (Number(scrollY)) {
  await page.evaluate((y) => window.scrollTo(0, y), Number(scrollY));
  await page.waitForTimeout(700);
}
await page.screenshot({ path: out });
await browser.close();
console.log('saved', out);
