/**
 * Single source of the operating mode (no imports, so next.config.ts can use it too).
 *
 * - SITE_MODE=production → production (any host)
 * - Vercel Production deployment (VERCEL_ENV=production) with LIVE=true → production.
 *   Owner decision, 4 Nov 2026: the public domain shows the full site. To return to the
 *   coming-soon page, set LIVE to false and push.
 * - everything else (Vercel previews, local, tests) → preview
 */
export const LIVE = true;

export function resolveSiteMode(env: Record<string, string | undefined> = process.env): 'preview' | 'production' {
  if (env.SITE_MODE === 'production') return 'production';
  if (LIVE && env.VERCEL_ENV === 'production') return 'production';
  return 'preview';
}
