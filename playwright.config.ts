import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

// Use a preinstalled Chromium when available (CI images, cloud sandboxes).
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const PORT = Number(process.env.E2E_PORT ?? 3100);

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    launchOptions: executablePath ? { executablePath } : {},
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], viewport: { width: 375, height: 760 } } },
  ],
  // Runs against the production build in preview mode with demo delivery — nobody is notified.
  webServer: {
    command: `npx next start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: true,
    env: { SITE_MODE: 'preview', INQUIRY_DELIVERY: 'demo' },
  },
});
