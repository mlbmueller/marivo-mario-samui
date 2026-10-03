// Full-page screenshots of key pages at 375 / 768 / 1440 px.
// Usage: npm run build && npx next start -p 3100 &  then  npm run screenshots
// Output: docs/screenshots/<page>-<width>.png
import { chromium } from '@playwright/test';
import { existsSync, mkdirSync } from 'node:fs';

const base = process.env.BASE_URL ?? 'http://localhost:3100';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const pages = (process.env.PAGES ?? 'en:home,en/stores/chaweng:store,en/contact:contact,de:home-de,th:home-th').split(',');
const widths = (process.env.WIDTHS ?? '375,768,1440').split(',').map(Number);

mkdirSync('docs/screenshots', { recursive: true });
const browser = await chromium.launch(executablePath ? { executablePath } : {});
for (const width of widths) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  for (const entry of pages) {
    const [path, name] = entry.split(':');
    await page.goto(`${base}/${path}`, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await page.screenshot({ path: `docs/screenshots/${name}-${width}.png`, fullPage: true });
    console.log(`${name} @ ${width}px — horizontal overflow: ${overflow > 0 ? `${overflow}px ✗` : 'none ✓'}`);
  }
  await context.close();
}
await browser.close();
