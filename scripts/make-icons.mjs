// Generates the favicon PNGs and the 1200x630 social preview image.
// Run: npm run icons   (needs the Playwright browser: npx playwright install chromium)
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const root = process.cwd();
const svg = fs.readFileSync('public/favicon.svg');

await sharp(svg, { density: 384 }).resize(32, 32).png({ compressionLevel: 9 }).toFile('public/favicon-32.png');
// iOS shows transparent corners as black, so the touch icon gets a solid background.
await sharp(svg, { density: 1024 }).resize(180, 180).flatten({ background: '#5B0E2D' }).png({ compressionLevel: 9 }).toFile('public/apple-touch-icon.png');
console.log('favicons written');

const file = (p) => pathToFileURL(path.join(root, p)).href;
const fontDisplay = file('node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2');
const fontBody = file('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2');
const photos = ['cn-tsinghua-old-gate', 'hk-victoria-harbour', 'kr-yonsei-underwood-hall', 'jp-kyoto-clock-tower'].map((id) => file(`public/images/${id}-sm.webp`));
const logo = fs.readFileSync('public/favicon.svg', 'utf8');

const html = `<!doctype html><html><head><style>
@font-face { font-family: Display; src: url(${fontDisplay}) format('woff2'); font-weight: 200 800; }
@font-face { font-family: Body; src: url(${fontBody}) format('woff2'); font-weight: 200 800; }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; font-family: Body; color: #fff4e8;
  background: radial-gradient(700px 420px at 10% 0%, rgba(255,107,107,.22), transparent 60%),
              radial-gradient(600px 400px at 100% 100%, rgba(255,201,64,.18), transparent 60%),
              linear-gradient(160deg, #3a0b1f, #1f0611 60%, #14040b); }
.wrap { display: grid; grid-template-columns: 560px 1fr; gap: 40px; padding: 64px; height: 100%; align-items: center; }
.brand { display: flex; align-items: center; gap: 14px; font-family: Display; font-weight: 700; font-size: 30px; letter-spacing: -0.5px; }
.brand svg { width: 52px; height: 52px; }
h1 { font-family: Display; font-weight: 700; font-size: 58px; line-height: 1.04; letter-spacing: -1.5px; margin-top: 34px; }
h1 span { color: #ffc940; }
p { margin-top: 22px; font-size: 24px; color: #ecd3c7; font-weight: 600; }
.grid { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; height: 470px; }
.grid img { width: 100%; height: 100%; object-fit: cover; border-radius: 22px; border: 1px solid rgba(255,214,150,.25); }
.grid svg.route { position: absolute; inset: -20px; width: calc(100% + 40px); height: calc(100% + 40px); }
</style></head><body><div class="wrap">
<div><div class="brand">${logo}SATORI</div>
<h1>Your admission route to <span>East Asia</span>, step by step</h1>
<p>China, Hong Kong SAR, South Korea and Japan</p></div>
<div class="grid">${photos.map((src) => `<img src="${src}" alt="">`).join('')}
<svg class="route" viewBox="0 0 560 510"><path d="M40 470 C 150 420 120 300 260 280 S 430 190 400 120 S 480 40 520 50" fill="none" stroke="#ffc940" stroke-width="6" stroke-linecap="round"/>
<circle cx="40" cy="470" r="13" fill="#ffc940" stroke="#1f0611" stroke-width="5"/><circle cx="260" cy="280" r="11" fill="#fff4e8" stroke="#1f0611" stroke-width="5"/>
<circle cx="400" cy="120" r="11" fill="#fff4e8" stroke="#1f0611" stroke-width="5"/><circle cx="520" cy="50" r="15" fill="#ffc940" stroke="#1f0611" stroke-width="5"/></svg>
</div></div></body></html>`;

const tmp = path.join(root, 'scripts', '.og-template.html');
fs.writeFileSync(tmp, html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(tmp).href);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
const png = await page.screenshot({ type: 'png' });
await browser.close();
fs.rmSync(tmp);
await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toFile('public/og-image.jpg');
console.log('og-image.jpg written', Math.round(fs.statSync('public/og-image.jpg').size / 1024), 'KB');
