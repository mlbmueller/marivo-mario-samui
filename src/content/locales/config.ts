/** Locale configuration without dictionaries — safe to import in client components. */
/**
 * Active languages, in the order shown in the language switcher. English is the default.
 * To add Russian later: create ru.ts (typed as Dictionary), add 'ru' here and to
 * `dictionaries` and `localeMeta`. TypeScript then reports every missing text.
 */
export const locales = ['en', 'de', 'fr', 'it', 'ru', 'th'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** Planned, not yet active. Not routed, not in the switcher or sitemap. */
export const plannedLocales = [] as const;

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
  /**
   * Part of the public launch. EN and DE are binding for the start. Additional languages are
   * complete (same structure, enforced by tests) but unreviewed: they stay reviewable in the
   * preview and are neither routed nor selectable in production until `launch: true`.
   */
  launch: boolean;
};

export const localeMeta: Record<Locale, LocaleMeta> = {
  // EN/DE: published as they are by owner decision (reduced launch, 4 Oct 2026); review follows.
  en: { label: 'English', short: 'EN', hreflang: 'en', intl: 'en-GB', reviewed: true, launch: true },
  de: { label: 'Deutsch', short: 'DE', hreflang: 'de', intl: 'de-CH', reviewed: true, launch: true },
  // FR/IT/RU/TH: published by owner request (4 Nov 2026); review by native speakers recommended.
  fr: { label: 'Français', short: 'FR', hreflang: 'fr', intl: 'fr-FR', reviewed: true, launch: true },
  it: { label: 'Italiano', short: 'IT', hreflang: 'it', intl: 'it-IT', reviewed: true, launch: true },
  ru: { label: 'Русский', short: 'RU', hreflang: 'ru', intl: 'ru-RU', reviewed: true, launch: true },
  th: { label: 'ไทย', short: 'TH', hreflang: 'th', intl: 'th-TH', reviewed: true, launch: true },
};

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (locales as readonly string[]).includes(value);

