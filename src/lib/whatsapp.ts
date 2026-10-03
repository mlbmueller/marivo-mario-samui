import { brand } from '@/content/brand';
import { stores } from '@/content/stores';
import type { CategoryId, StoreId } from '@/content/types';
import type { Dictionary } from '@/content/locales';
import { fmt } from './i18n';

/** Normalise "+66 81 234 5678" → "66812345678" for wa.me. Returns null if not plausible. */
export function normaliseWhatsAppNumber(number: string): string | null {
  const digits = number.replace(/[^\d]/g, '');
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

/**
 * The confirmed number for a store, falling back to the central brand number.
 * Only confirmed numbers ever produce a link — a draft is not enough for a contact channel,
 * in preview or in production.
 */
export function whatsappNumberFor(store: StoreId | null): string | null {
  const storeFact = store ? stores[store].whatsapp : null;
  if (storeFact?.status === 'confirmed') return storeFact.value;
  if (brand.whatsapp.status === 'confirmed') return brand.whatsapp.value;
  return null;
}

/**
 * Build a wa.me link with a prefilled, URL-encoded message mentioning product and store.
 * Never includes personal form data. Returns null when no confirmed number exists, so the
 * caller renders a disabled control instead of a fake contact.
 */
export function buildWhatsAppLink(opts: {
  number: string | null;
  dict: Dictionary;
  category?: CategoryId | null;
  store?: StoreId | null;
}): string | null {
  if (!opts.number) return null;
  const digits = normaliseWhatsAppNumber(opts.number);
  if (!digits) return null;
  const { dict } = opts;
  const parts = [
    opts.category
      ? fmt(dict.whatsapp.withCategory, { category: dict.categories[opts.category].name })
      : dict.whatsapp.greeting,
  ];
  if (opts.store) parts.push(fmt(dict.whatsapp.atStore, { store: dict.storeNames[opts.store] }));
  return `https://wa.me/${digits}?text=${encodeURIComponent(parts.join(' '))}`;
}
