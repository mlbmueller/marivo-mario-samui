import { confirmed, draft, missing, type Fact } from './types';

/**
 * Central brand record (final brand, 3 October 2026).
 * The logo is a fixed, outlined SVG — never rebuilt from HTML text and never translated.
 * "Samui" is a location, not part of the brand name.
 */
export const brand = {
  name: confirmed('NICKY FASHION'),
  /** Mixed-case form for running text and page titles. */
  displayName: confirmed('Nicky Fashion'),
  /** Logo line 2 (part of the logo artwork). */
  category: confirmed('MEN’S & WOMEN’S WEAR'),
  /** Logo line 3 (part of the logo artwork). */
  signature: confirmed('Tailoring by Mario K.'),
  logo: {
    /** Approved web logo exactly as delivered (viewBox 0 0 4000 1000, outlined text). */
    original: '/brand/NICKY_FASHION_WEB.svg',
    /**
     * Same file with only the viewBox trimmed to the artwork plus a clear space of half the
     * height of line 2 (69 units on each side). Paths are byte-identical. Used on the site so
     * the sub-lines stay legible at header size. Needs a short visual approval.
     */
    web: '/brand/NICKY_FASHION_WEB_TRIM.svg',
    webWidth: 3238,
    webHeight: 789,
    /** Transparent raster fallback, 2400 × 600. */
    png: '/brand/NICKY_FASHION_WEB.png',
    alt: 'Nicky Fashion – Men’s & Women’s Wear – Tailoring by Mario K.',
  },
  logoAsset: confirmed(true, 'Approved outlined SVG delivered in the final package'),
  logoWebCrop: draft(true, 'Trimmed viewBox (artwork unchanged) — confirm visually'),
  /** Small format for browser tabs. Not invented from the word mark — open asset. */
  favicon: missing('No approved small logo format') as Fact<string>,
  /** Final domain, e.g. https://example.com — never derived from the name. */
  domain: missing('Domain not decided') as Fact<string>,
  /** Central WhatsApp number in international format without spaces, e.g. "+66..." */
  whatsapp: missing('No confirmed number') as Fact<string>,
  email: missing('No confirmed e-mail address') as Fact<string>,
  /** Previous public names, shown only on the transition page once it is active. */
  previousNames: ['Nicky Fashion by Mario', 'Samui Armani By Mario'],
  /**
   * The "our new name" page stays inactive until the rename has actually happened
   * (signage, Google profiles). Until then the page is not linked, not in the sitemap,
   * and returns 404 in production.
   */
  transition: { active: false },
} as const;

/** Full brand line for metadata and footers. */
export const brandLine = `${brand.displayName.value} – ${brand.signature.value}`;

export type Operator = {
  legalName: string;
  address: string;
  registration: string;
  contact: string;
};

/** Operator details for /legal. Remain missing until confirmed by the owner. */
export const operator: Fact<Operator> = missing('Operator details not confirmed');

/** Privacy notice text approval (content lives in the locale files). */
export const privacyNotice: Fact<true> = draft(true, 'Draft text, needs review against the actual processing');
