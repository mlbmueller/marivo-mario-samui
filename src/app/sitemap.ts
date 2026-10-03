import type { MetadataRoute } from 'next';
import { locales } from '@/content/locales';
import { localePath } from '@/lib/i18n';
import { getSiteUrl, isPageAvailable, isPreview, sitePaths } from '@/lib/site';

/**
 * Lists only pages available in the current mode, with all language alternates.
 * Empty while the final domain is unknown or in preview (preview is not indexable anyway).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl || isPreview()) return [];
  return sitePaths
    .filter((path) => isPageAvailable(path))
    .flatMap((path) =>
      locales.map((locale) => ({
        url: `${siteUrl}${localePath(locale, path)}`,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}${localePath(l, path)}`])),
        },
      })),
    );
}
