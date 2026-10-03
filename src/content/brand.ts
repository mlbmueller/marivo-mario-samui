import { draft, missing, type Fact } from './types';

/**
 * Central brand record. Change the name here and it changes everywhere:
 * header, footer, metadata, form e-mails and structured data.
 *
 * Working name: "Nicky Fashion Samui by Mario" (not yet approved).
 * Discussed alternative: "Atelier Marivo by Mario" — deliberately NOT used anywhere
 * on the site. To switch, replace name/shortName below and the logo mark.
 */
export const brand = {
  name: draft('Nicky Fashion Samui', 'Working name, brand approval pending'),
  /** Used where space is tight (mobile header, browser tab). */
  shortName: draft('Nicky Fashion'),
  suffix: draft('by Mario'),
  /** Temporary geometric mark in src/components/Logo.tsx. Replace once a final logo is approved. */
  logo: draft('temporary-svg-mark', 'Temporary mark, final logo pending'),
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
