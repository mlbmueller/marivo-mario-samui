/** Locale configuration without dictionaries — safe to import in client components. */
/**
 * Active languages, in the order shown in the language switcher. English is the default.
 * To add Russian later: create ru.ts (typed as Dictionary), add 'ru' here and to
 * `dictionaries` and `localeMeta`. TypeScript then reports every missing text.
 */
export const locales = ['en', 'de', 'th', 'fr', 'it'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** Planned, not yet active. Not routed, not in the switcher or sitemap. */
export const plannedLocales = ['ru'] as const;

export type LocaleMeta = {
  /** Name of the language in that language. */
  label: string;
  short: string;
  /** BCP 47 tag for <html lang> and hreflang. */
  hreflang: string;
  /** Intl locale for date formatting. */
  intl: string;
  /** Texts reviewed and approved for publication (owner / native speaker). */
  reviewed: boolean;
};

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: { label: 'English', short: 'EN', hreflang: 'en', intl: 'en-GB', reviewed: false },
  de: { label: 'Deutsch', short: 'DE', hreflang: 'de', intl: 'de-CH', reviewed: false },
  th: { label: 'ไทย', short: 'TH', hreflang: 'th', intl: 'th-TH', reviewed: false },
  fr: { label: 'Français', short: 'FR', hreflang: 'fr', intl: 'fr-FR', reviewed: false },
  it: { label: 'Italiano', short: 'IT', hreflang: 'it', intl: 'it-IT', reviewed: false },
};

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (locales as readonly string[]).includes(value);

