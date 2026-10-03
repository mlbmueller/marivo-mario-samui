import { describe, expect, it } from 'vitest';
import { alternates, fmt, localePath, stripLocale, switchLocalePath } from './i18n';
import { dictionaries, locales } from '@/content/locales';
import { buildWhatsAppLink, normaliseWhatsAppNumber, whatsappNumberFor } from './whatsapp';

describe('language switch keeps the current page', () => {
  it('replaces only the locale prefix', () => {
    expect(switchLocalePath('/en/stores/chaweng', 'de')).toBe('/de/stores/chaweng');
    expect(switchLocalePath('/de/tailoring/weddings', 'th')).toBe('/th/tailoring/weddings');
    expect(switchLocalePath('/it', 'fr')).toBe('/fr');
  });

  it('keeps the query string (e.g. product preselection)', () => {
    expect(switchLocalePath('/en/contact', 'it', '?product=men&store=chaweng')).toBe('/it/contact?product=men&store=chaweng');
  });

  it('strips and builds locale paths', () => {
    expect(stripLocale('/fr/faq')).toBe('/faq');
    expect(stripLocale('/en')).toBe('/');
    expect(localePath('de', '/')).toBe('/de');
    expect(localePath('de', '/about')).toBe('/de/about');
  });

  it('produces hreflang alternates for every active language plus x-default', () => {
    const alt = alternates('/faq');
    expect(Object.keys(alt).sort()).toEqual([...locales, 'x-default'].sort());
    expect(alt['x-default']).toBe('/en/faq');
  });

  it('fills placeholders', () => {
    expect(fmt('Our store in {store}', { store: 'Chaweng' })).toBe('Our store in Chaweng');
    expect(fmt('{missing}', {})).toBe('{missing}');
  });
});

describe('WhatsApp links', () => {
  it('are not generated without a confirmed number', () => {
    expect(whatsappNumberFor('chaweng')).toBeNull();
    expect(buildWhatsAppLink({ number: null, dict: dictionaries.en })).toBeNull();
  });

  it('encode product and store in the message, without personal data', () => {
    const link = buildWhatsAppLink({ number: '+66 81 234 5678', dict: dictionaries.de, category: 'weddings', store: 'fishermans-village' })!;
    expect(link.startsWith('https://wa.me/66812345678?text=')).toBe(true);
    const text = decodeURIComponent(link.split('text=')[1]!);
    expect(text).toContain('Hochzeit');
    expect(text).toContain('Fisherman’s Village');
    expect(link).not.toMatch(/[ ’]/); // properly URL-encoded
  });

  it('reject implausible numbers', () => {
    expect(normaliseWhatsAppNumber('12')).toBeNull();
  });
});
