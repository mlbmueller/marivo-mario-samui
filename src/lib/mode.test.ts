import { describe, expect, it } from 'vitest';
import { LIVE, resolveSiteMode } from './mode';

describe('resolveSiteMode', () => {
  it('previews and local builds stay in preview', () => {
    expect(resolveSiteMode({})).toBe('preview');
    expect(resolveSiteMode({ VERCEL_ENV: 'preview', SITE_MODE: 'preview' })).toBe('preview');
  });
  it('SITE_MODE=production always wins', () => {
    expect(resolveSiteMode({ SITE_MODE: 'production' })).toBe('production');
  });
  it('the Vercel production deployment follows the LIVE switch', () => {
    expect(resolveSiteMode({ VERCEL_ENV: 'production', SITE_MODE: 'preview' })).toBe(LIVE ? 'production' : 'preview');
  });
});
