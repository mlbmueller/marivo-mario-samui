import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

// Content release check: always prints the open items. Fails only when
// SITE_MODE=production and blocking items remain (see src/lib/release.ts).
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    include: ['scripts/release-check.test.ts'],
    environment: 'node',
  },
});
