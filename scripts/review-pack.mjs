// Visual review pack: full-length originals plus readable slices for chat/review.
// Usage: npm run build && npx next start -p 3100 &  then  node scripts/review-pack.mjs
// Output: docs/review/originals/*.png (full page, uncut) and docs/review/slices/*.png
// Mobile captures use deviceScaleFactor 2 (like a real phone) so type stays sharp.
// The fixed mobile quick bar is hidden in full-page captures (it would otherwise be drawn at the
// capture position); a separate viewport shot shows it at its real place.
import { chromium } from '@playwright/test';
import { existsSync, mkdirSync, rmSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:3100';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const SLICE = 1600; // CSS px per slice

const shots = [
  { name: '01-home-desktop', path: '/en', width: 1440, dpr: 1 },
  { name: '02-home-mobile', path: '/en', width: 390, dpr: 2 },
  { name: '03-contact-mobile', path: '/en/contact?look=look-02', width: 390, dpr: 2 },
  { name: '04-service-linen-desktop', path: '/en/tailoring/linen-holiday', width: 1440, dpr: 1 },
  { name: '05-service-linen-mobile', path: '/en/tailoring/linen-holiday', width: 390, dpr: 2 },
  { name: '06-store-chaweng-desktop', path: '/en/stores/chaweng', width: 1440, dpr: 1 },
  { name: '07-store-chaweng-mobile', path: '/en/stores/chaweng', width: 390, dpr: 2 },
  { name: '08-store-fishermans-village-desktop', path: '/en/stores/fishermans-village', width: 1440, dpr: 1 },
  { name: '09-store-fishermans-village-mobile', path: '/en/stores/fishermans-village', width: 390, dpr: 2 },
  { name: '10-home-desktop-de', path: '/de', width: 1440, dpr: 1 },
];

rmSync('docs/review', { recursive: true, force: true });
mkdirSync('docs/review/originals', { recursive: true });
mkdirSync('docs/review/slices', { recursive: true });
const browser = await chromium.launch(executablePath ? { executablePath } : {});

for (const s of shots) {
  const context = await browser.newContext({ viewport: { width: s.width, height: 900 }, deviceScaleFactor: s.dpr, isMobile: s.dpr > 1, hasTouch: s.dpr > 1 });
  const page = await context.newPage();
  await page.goto(base + s.path, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: '.mobile-bar{display:none!important}' });
  await page.screenshot({ path: `docs/review/originals/${s.name}.png`, fullPage: true });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  let n = 1;
  for (let y = 0; y < height; y += SLICE, n++) {
    const h = Math.min(SLICE, height - y);
    await page.screenshot({ path: `docs/review/slices/${s.name}-part${n}.png`, fullPage: true, clip: { x: 0, y, width: s.width, height: h } });
  }
  console.log(`${s.name}: ${height}px → ${n - 1} slices`);
  await context.close();
}

// Real viewport on a phone, quick bar at its actual position.
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const p = await phone.newPage();
await p.goto(base + '/en', { waitUntil: 'networkidle' });
await p.screenshot({ path: 'docs/review/originals/11-home-mobile-first-screen.png' });
await p.screenshot({ path: 'docs/review/slices/11-home-mobile-first-screen.png' });
await phone.close();
await browser.close();
