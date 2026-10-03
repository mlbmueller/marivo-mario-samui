import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { brand } from '@/content/brand';
import { getDictionary, isLocale, localeMeta, type Dictionary, type Locale } from '@/content/locales';
import { alternates, localePath } from './i18n';
import { getSiteUrl, isPageAvailable, isPreview } from './site';

export type LocaleParams = Promise<{ locale: string }>;

/** Resolve and validate the locale route param. Unknown locales → 404. */
export async function resolveLocale(params: LocaleParams): Promise<{ locale: Locale; t: Dictionary }> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { locale, t: getDictionary(locale) };
}

/** 404 for pages that are switched off in the current mode (see isPageAvailable). */
export function requireAvailable(path: string) {
  if (!isPageAvailable(path)) notFound();
}

/**
 * Per-page metadata: localised title and description, hreflang alternates for all
 * languages, canonical only once the final domain is confirmed, noindex in preview.
 */
export function pageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const siteUrl = getSiteUrl();
  const fullTitle = path === '/' ? `${title} | ${brand.name.value} ${brand.suffix.value}` : `${title} | ${brand.name.value}`;
  return {
    title: fullTitle,
    description,
    ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
    alternates: {
      ...(siteUrl ? { canonical: localePath(locale, path) } : {}),
      languages: alternates(path),
    },
    robots: isPreview() ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: siteUrl
      ? {
          title: fullTitle,
          description,
          locale: localeMeta[locale].intl.replace('-', '_'),
          siteName: `${brand.name.value} ${brand.suffix.value}`,
          url: localePath(locale, path),
          type: 'website',
        }
      : undefined,
  };
}
