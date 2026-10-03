/**
 * Holding ("coming soon") mode for the public domain.
 *
 * While `HOLDING.active` is true, requests to the public domain show only the
 * coming-soon page; the full preview stays reachable on the Vercel addresses.
 * To launch the full site on the domain: set `active: false` (and remove the matching
 * `missing` condition in next.config.ts), then deploy.
 */
export const HOLDING = {
  active: true,
  hosts: ['www.nickyfashionsamui.com', 'nickyfashionsamui.com'],
  path: '/coming-soon',
} as const;

export type HoldingDecision = { action: 'pass' } | { action: 'rewrite' } | { action: 'redirect-home' } | { action: 'not-found' };

/** Files that the holding page itself needs (styles, fonts, logo, Next runtime). */
const ASSET = /^\/(_next\/|brand\/|favicon|robots\.txt$|sitemap\.xml$|icon)/;

export function holdingDecision(host: string | null, pathname: string, cfg: { active: boolean; hosts: readonly string[]; path: string } = HOLDING): HoldingDecision {
  const h = (host ?? '').toLowerCase().split(':')[0] ?? '';
  if (!cfg.active || !cfg.hosts.includes(h)) return { action: 'pass' };
  if (ASSET.test(pathname)) return { action: 'pass' };
  if (pathname.startsWith('/api/')) return { action: 'not-found' };
  if (pathname === '/' || pathname === cfg.path) return { action: 'rewrite' };
  // Any other page on the domain (e.g. /en/contact) leads to the single holding page.
  return { action: 'redirect-home' };
}
