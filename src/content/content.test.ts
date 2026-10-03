import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { brand } from './brand';
import en from './locales/en';
import { dictionaries, locales } from './locales';
import { media } from './media';
import { reviews } from './reviews';
import { stores, storeIds } from './stores';
import { team } from './team';
import { getReleaseReport } from '@/lib/release';
import { isPageAvailable, isPublishable, routedLocales } from '@/lib/site';
import { storeJsonLd } from '@/lib/structured-data';

/** Walk two dictionaries in parallel and report keys/arrays that differ in shape. */
function shapeDiff(a: unknown, b: unknown, path = ''): string[] {
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return [path];
    if (a.length !== b.length) return [`${path} (length ${a.length} vs ${b.length})`];
    return a.flatMap((v, i) => shapeDiff(v, b[i], `${path}[${i}]`));
  }
  if (a && typeof a === 'object') {
    if (!b || typeof b !== 'object') return [path];
    const keys = new Set([...Object.keys(a), ...Object.keys(b as object)]);
    return [...keys].flatMap((k) => shapeDiff((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}.${k}`));
  }
  if (typeof a !== typeof b) return [path];
  if (typeof b === 'string' && b.trim() === '') return [`${path} (empty)`];
  return [];
}

const allText = (obj: unknown): string => JSON.stringify(obj);

describe('translations', () => {
  it.each(locales.filter((l) => l !== 'en'))('%s has exactly the English structure, no empty texts', (locale) => {
    expect(shapeDiff(en, dictionaries[locale])).toEqual([]);
  });

  it.each(locales)('%s keeps the same placeholders as English', (locale) => {
    const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');
    const walk = (a: unknown, b: unknown): void => {
      if (typeof a === 'string') expect(placeholders(b as string), a).toBe(placeholders(a));
      else if (a && typeof a === 'object') for (const k of Object.keys(a)) walk((a as never)[k], (b as never)[k]);
    };
    walk(en, dictionaries[locale]);
  });
});

describe('content rules from the briefing', () => {
  const site = locales.map((l) => allText(dictionaries[l])).join(' ');

  it('makes no anniversary / founding claims and no superlatives', () => {
    for (const banned of [/20\s?(years|jahre|y\b)/i, /since\s+\d{4}/i, /seit\s+\d{4}/i, /the best tailor/i, /mr\.?\s*moss/i]) {
      expect(site).not.toMatch(banned);
    }
  });

  it('does not use unconfirmed production claims', () => {
    expect(site).not.toMatch(/\b(bespoke|handmade|hand-made|handgemacht|24[- ]?h(ours?)?|guarantee|garantie)\b/i);
  });

  it('uses only the final brand NICKY FASHION — no alternative or earlier working names', () => {
    expect(brand.name).toMatchObject({ status: 'confirmed', value: 'NICKY FASHION' });
    expect(brand.signature.value).toBe('Tailoring by Mario K.');
    expect(allText({ brand: brand.name, site })).not.toMatch(/marivo|nicky fashion samui/i);
    // "Samui" is a location, not part of the brand name
    expect(brand.name.value).not.toMatch(/samui/i);
  });

  it('logo: approved outlined SVG, web variant changes only the viewBox, ratio from the file', () => {
    const original = readFileSync(join(process.cwd(), 'public', brand.logo.original), 'utf8');
    const web = readFileSync(join(process.cwd(), 'public', brand.logo.web), 'utf8');
    const body = (svg: string) => svg.replace(/<svg[^>]*>/, '');
    expect(body(web)).toBe(body(original));
    expect(original).not.toMatch(/<text|font-family/); // outlines, no font dependency
    const vb = web.match(/viewBox="([\d.\s-]+)"/)![1]!.split(/\s+/).map(Number);
    expect(vb[2]! / vb[3]!).toBeCloseTo(brand.logo.webWidth / brand.logo.webHeight, 3);
    expect(original).toContain('fill="#5A1530"');
  });

  it('mentions previous names only in the transition data, not in visible texts', () => {
    expect(site).not.toMatch(/armani/i);
  });

  it('contains no realistic-looking placeholder contact data', () => {
    for (const id of storeIds) {
      const s = stores[id];
      for (const fact of [s.address, s.phone, s.whatsapp, s.mapUrl, s.hours]) {
        if (fact.status === 'missing') expect(fact.value).toBeNull();
      }
    }
    expect(site).not.toMatch(/\+66\s?\d/);
  });

  it('gives Mario the owner role and invents no title for James', () => {
    expect(team.find((m) => m.id === 'mario')?.role).toMatchObject({ status: 'confirmed', value: 'owner' });
    expect(team.find((m) => m.id === 'james')?.role).toMatchObject({ status: 'missing', value: null });
  });

  it('has no fake reviews and no structured data from unconfirmed facts', () => {
    expect(reviews.every((r) => r.approvedOn && r.attribution)).toBe(true);
    for (const id of storeIds) expect(storeJsonLd(id, 'https://example.test')).toBeNull();
  });

  it('documents every image with description and alt text in all languages', () => {
    for (const asset of Object.values(media)) {
      expect(asset.description.length).toBeGreaterThan(10);
      if (asset.rights !== 'approved') expect(asset.src).toBeNull();
      for (const l of locales) expect(dictionaries[l].media[asset.id as keyof typeof en.media]).toBeTruthy();
    }
  });
});

describe('preview vs production release', () => {
  it('preview shows drafts, production only confirmed content', () => {
    expect(isPublishable('draft', 'preview')).toBe(true);
    expect(isPublishable('draft', 'production')).toBe(false);
    expect(isPublishable('missing', 'preview')).toBe(false);
  });

  it('production routes only the launch languages EN and DE; preview keeps all for review', () => {
    expect(routedLocales('production')).toEqual(['en', 'de']);
    expect(routedLocales('preview')).toEqual(['en', 'de', 'th', 'fr', 'it']);
  });

  it('hides unconfirmed categories, empty work page and inactive rename page in production', () => {
    expect(isPageAvailable('/tailoring/men', 'preview')).toBe(true);
    expect(isPageAvailable('/tailoring/men', 'production')).toBe(false);
    expect(isPageAvailable('/tailoring/linen-holiday', 'preview')).toBe(true);
    expect(isPageAvailable('/our-work', 'preview')).toBe(true);
    expect(isPageAvailable('/our-work', 'production')).toBe(false);
    expect(isPageAvailable('/our-new-name', 'production')).toBe(brand.transition.active);
    expect(isPageAvailable('/stores/chaweng', 'production')).toBe(true);
  });

  it('lists blocking items while production data is missing', () => {
    const report = getReleaseReport({});
    const items = report.blockers.map((b) => b.item).join('\n');
    expect(items).toMatch(/approved looks/);
    expect(items).not.toMatch(/Favicon/); // optional: browser default until approved
    expect(report.hidden.map((h) => h.item).join('\n')).toMatch(/Favicon/);
    // Only the launch languages EN/DE block; TH/FR/IT are switched off instead
    expect(items).toMatch(/English/);
    expect(items).toMatch(/Deutsch/);
    expect(items).not.toMatch(/Italiano|Français|ไทย/);
    expect(items).toMatch(/trimmed web logo/);
    expect(items).toMatch(/WhatsApp/);
    expect(items).toMatch(/Exact address/);
    expect(items).toMatch(/delivery service/);
    expect(items).toMatch(/rate-limit/);
  });
});

describe('store facades', () => {
  it('shows the photo matching the current signage until the rename', async () => {
    const { stores, exteriorImageFor } = await import('./stores');
    const { brand } = await import('./brand');
    const fv = stores['fishermans-village'];
    expect(exteriorImageFor(fv)).toBe(brand.transition.active ? fv.exteriorImageAfterRename : fv.exteriorImage);
    expect(exteriorImageFor({ ...fv, exteriorImageAfterRename: undefined })).toBe(fv.exteriorImage);
  });
});
