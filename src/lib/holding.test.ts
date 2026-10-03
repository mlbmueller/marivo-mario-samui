import { describe, expect, it } from 'vitest';
import { holdingDecision } from './holding';

const on = { active: true, hosts: ['www.nickyfashionsamui.com', 'nickyfashionsamui.com'], path: '/coming-soon' } as const;

describe('coming-soon holding mode on the public domain', () => {
  it('shows the holding page at the root of both domain variants', () => {
    expect(holdingDecision('www.nickyfashionsamui.com', '/', on)).toEqual({ action: 'rewrite' });
    expect(holdingDecision('NickyFashionSamui.com:443', '/', on)).toEqual({ action: 'rewrite' });
  });

  it('sends every other page on the domain to the holding page and blocks the API', () => {
    expect(holdingDecision('www.nickyfashionsamui.com', '/en/contact', on)).toEqual({ action: 'redirect-home' });
    expect(holdingDecision('www.nickyfashionsamui.com', '/api/inquiry', on)).toEqual({ action: 'not-found' });
  });

  it('lets assets through so the holding page renders', () => {
    for (const p of ['/_next/static/chunks/a.js', '/brand/NICKY_FASHION_WEB_TRIM.svg', '/robots.txt']) {
      expect(holdingDecision('www.nickyfashionsamui.com', p, on)).toEqual({ action: 'pass' });
    }
  });

  it('leaves the Vercel preview addresses and local development untouched', () => {
    expect(holdingDecision('marivo-mario-samui.vercel.app', '/', on)).toEqual({ action: 'pass' });
    expect(holdingDecision('localhost:3000', '/en/contact', on)).toEqual({ action: 'pass' });
  });

  it('switches off completely when the full site launches', () => {
    expect(holdingDecision('www.nickyfashionsamui.com', '/en', { ...on, active: false })).toEqual({ action: 'pass' });
  });
});
