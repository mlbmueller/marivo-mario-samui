import { isLocale, locales, type Locale } from '@/content/locales/config';

/** Fill {placeholders} in a translated string. Unknown placeholders stay visible. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

/** Build a localised path. `path` is locale-independent and starts with "/" ("/" = home). */
export function localePath(locale: Locale, path: string): string {
  const clean = path === '/' || path === '' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/** Strip the locale prefix from a pathname: "/de/stores/chaweng" → "/stores/chaweng". */
export function stripLocale(pathname: string): string {
  const parts = pathname.split('/');
  if (isLocale(parts[1])) {
    const rest = parts.slice(2).join('/');
    return rest ? `/${rest}` : '/';
  }
  return pathname || '/';
}

/**
 * Same page in another language. Slugs are identical across languages, so only the
 * prefix changes. Query string and hash are preserved (e.g. product preselection).
 */
export function switchLocalePath(pathname: string, target: Locale, search = ''): string {
  return localePath(target, stripLocale(pathname)) + search;
}

/** Alternate URLs (hreflang) for metadata, relative to metadataBase. */
export function alternates(path: string, available: readonly Locale[] = locales): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of available) languages[locale] = localePath(locale, path);
  languages['x-default'] = localePath('en', path);
  return languages;
}
