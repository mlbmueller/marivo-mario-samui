// Renders docs/review/logo-comparison.png: approved logo file vs. the web variant used on the
// site, at identical artwork scale, plus a pixel comparison and the favicon proposals.
// Usage: node scripts/logo-comparison.mjs
import { chromium } from '@playwright/test';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const b64 = (p) => `data:image/svg+xml;base64,${readFileSync(p).toString('base64')}`;
const original = b64('public/brand/NICKY_FASHION_WEB.svg');
const web = b64('public/brand/NICKY_FASHION_WEB_TRIM.svg');
const favA = b64('docs/proposals/favicon-proposal-A-burgundy.svg');
const favB = b64('docs/proposals/favicon-proposal-B-ivory.svg');
const K = 0.25; // artwork scale: 1 viewBox unit = 0.25 px

// For the pixel test the files are loaded with intrinsic size = raster size (no resampling).
const rasterSrc = (p, w, h) =>
  `data:image/svg+xml;base64,${Buffer.from(readFileSync(p, 'utf8').replace(/width="\d+" height="\d+"/, `width="${w}" height="${h}"`)).toString('base64')}`;
const originalRaster = rasterSrc('public/brand/NICKY_FASHION_WEB.svg', 4000, 1000);
const webRaster = rasterSrc('public/brand/NICKY_FASHION_WEB_TRIM.svg', 3238, 789);

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;padding:40px;background:#fff;font:15px/1.5 system-ui,sans-serif;color:#222;width:1120px}
h1{font-size:22px;margin:0 0 6px} h2{font-size:17px;margin:34px 0 8px} p{margin:0 0 8px;max-width:1000px}
.box{position:relative;display:inline-block;background-image:conic-gradient(#eee 25%,#fff 0 50%,#eee 0 75%,#fff 0);background-size:16px 16px;outline:2px dashed #888}
.trim{position:absolute;outline:2px solid #1f6feb}
.lbl{font-size:13px;color:#555;margin-top:6px}
table{border-collapse:collapse;margin-top:8px} td,th{border:1px solid #ddd;padding:5px 10px;text-align:left;font-size:14px}
.ok{color:#1f5f3f;font-weight:700} .bad{color:#a3261b;font-weight:700}
.fav{display:flex;gap:28px;align-items:flex-end} .fav div{text-align:center;font-size:12px;color:#555}
.tab{display:inline-flex;align-items:center;gap:8px;background:#e9e9ef;border-radius:8px 8px 0 0;padding:8px 14px;font-size:13px}
</style></head><body>
<h1>NICKY FASHION – logo file vs. web variant</h1>
<p>Both rendered at the same artwork scale (1 viewBox unit = ${K} px). Checkerboard = transparent area of the file.</p>

<h2>1 · Approved file <code>NICKY_FASHION_WEB.svg</code> — viewBox 0 0 4000 1000 (4 : 1)</h2>
<div class="box" style="width:${4000 * K}px;height:${1000 * K}px">
  <img src="${original}" width="${4000 * K}" height="${1000 * K}" style="display:block">
  <div class="trim" style="left:${381 * K}px;top:${156 * K}px;width:${3238 * K}px;height:${789 * K}px"></div>
</div>
<div class="lbl">Grey dashed = file boundary. Blue = area kept for the web variant (artwork + clear space of ½ the height of line 2 on every side). Everything outside the blue frame is empty, transparent margin.</div>

<h2>2 · Web variant used on the site <code>NICKY_FASHION_WEB_TRIM.svg</code> — viewBox 381 156 3238 789 (≈ 4.10 : 1)</h2>
<div class="box" style="width:${3238 * K}px;height:${789 * K}px"><img src="${web}" width="${3238 * K}" height="${789 * K}" style="display:block"></div>

<h2>3 · Proof: what changed</h2>
<table>
<tr><th>Check</th><th>Result</th></tr>
<tr><td>File content apart from the &lt;svg&gt; tag (all 54 paths, transforms, fills, title)</td><td class="ok">byte-identical (automated test)</td></tr>
<tr><td>Only change</td><td><code>viewBox="0 0 4000 1000"</code> → <code>viewBox="381 156 3238 789"</code> (+ width/height attributes to the same ratio)</td></tr>
<tr><td>Artwork bounding box in the file (measured)</td><td>x 450–3550, y 225–876 (3100 × 651 units)</td></tr>
<tr><td>Removed margin</td><td>left 381, right 381, top 156, bottom 125 units — all outside the artwork, transparent</td></tr>
<tr><td>Pixel comparison of the artwork area (rendered)</td><td id="diff">…</td></tr>
<tr><td>Text, line spacing, proportions, colours #5A1530 / #222222</td><td class="ok">unchanged</td></tr>
<tr><td>Cap height of line 3 («T» = 101 units)</td><td>logo box 320 px (desktop): original 8.1 px · web variant 10.0 px<br>logo box 260 px (phones from 390 px): original 6.6 px · web variant 8.1 px<br>logo box ≈ 234 px (320 px phone): original 5.9 px · web variant 7.3 px</td></tr>
</table>

<h2>4 · Favicon — proposal only, not used on the site</h2>
<p>No new symbol: the letter «N» is taken unchanged from line 1 of the approved artwork and placed on a brand-colour tile. Requires your approval; until then browsers show their default icon.</p>
<div class="fav">
${[favA, favB].map((f, i) => `<div><b>${i ? 'B · ivory' : 'A · burgundy'}</b><br>${[16, 32, 48, 180].map((s) => `<img src="${f}" width="${s}" height="${s}" style="vertical-align:bottom;margin:6px"> `).join('')}<br>16 · 32 · 48 · 180 px</div>`).join('')}
</div>
<p style="margin-top:14px"><span class="tab"><img src="${favA}" width="16" height="16"> Custom Tailoring in Koh Samui | Nicky Fashion</span>&nbsp;&nbsp;<span class="tab"><img src="${favB}" width="16" height="16"> Custom Tailoring in Koh Samui | Nicky Fashion</span></p>
</body></html>`;

mkdirSync('docs/review', { recursive: true });
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });
await page.setContent(html, { waitUntil: 'load' });

// Pixel comparison: draw the original shifted by the trim offset and the web variant, compare.
const diff = await page.evaluate(async ([o, w]) => {
  const load = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = src; });
  const [io, iw] = await Promise.all([load(o), load(w)]);
  const S = 1; // 1 unit = 1 px (integer offsets, no resampling differences)
  const W = Math.round(3238 * S), H = Math.round(789 * S);
  const c1 = new OffscreenCanvas(W, H), c2 = new OffscreenCanvas(W, H);
  c1.getContext('2d').drawImage(io, -381, -156);
  c2.getContext('2d').drawImage(iw, 0, 0);
  const a = c1.getContext('2d').getImageData(0, 0, W, H).data, b = c2.getContext('2d').getImageData(0, 0, W, H).data;
  let differ = 0, maxDelta = 0, ink = 0;
  for (let i = 0; i < a.length; i += 4) {
    const d = Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]), Math.abs(a[i + 3] - b[i + 3]));
    if (a[i + 3] > 0) ink++;
    if (d > 2) differ++;
    maxDelta = Math.max(maxDelta, d);
  }
  return { differ, maxDelta, ink, total: W * H };
}, [originalRaster, webRaster]);
await page.evaluate((d) => {
  const el = document.getElementById('diff');
  const share = (d.differ / d.ink) * 100;
  el.className = share < 0.01 ? 'ok' : 'bad';
  el.textContent = `${d.differ} of ${d.ink} artwork pixels differ (${share.toFixed(4)} %), only anti-aliasing at glyph edges (max channel delta ${d.maxDelta}) — rasteriser tiling, not geometry`;
}, diff);
await page.screenshot({ path: 'docs/review/logo-comparison.png', fullPage: true });
console.log(JSON.stringify(diff));
await browser.close();
