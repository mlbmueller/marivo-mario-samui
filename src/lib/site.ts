import { brand } from '@/content/brand';
import { reducedLaunch } from '@/content/launch';
import { categories, categoryIds } from '@/content/services';
import { looks } from '@/content/looks';
import { media } from '@/content/media';
import type { ContentStatus, Fact } from '@/content/types';
import { localeMeta, locales, type Locale } from '@/content/locales/config';

/**
 * Operating mode, set via SITE_MODE at build time.
 * - preview (default): noindex, drafts visible with markers, placeholders, demo form
 * - production: only confirmed content, form needs a configured delivery service
 */
export type SiteMode = 'preview' | 'production';

export function getSiteMode(): SiteMode {
  return process.env.SITE_MODE === 'production' ? 'production' : 'preview';
}

export const isPreview = () => getSiteMode() === 'preview';

/** Whether content with this status may be shown in the current mode. */
export function isPublishable(status: ContentStatus, mode: SiteMode = getSiteMode()): boolean {
  return mode === 'production' ? status === 'confirmed' : status !== 'missing';
}

/**
 * Languages that are routed and selectable. Preview: all (for review). Production: only
 * languages marked `launch` (EN, DE) — the others return 404 and are not in the switcher,
 * hreflang or sitemap, so they never block or confuse the EN/DE start.
 */
export function routedLocales(mode: SiteMode = getSiteMode()): Locale[] {
  return mode === 'production' ? locales.filter((l) => localeMeta[l].launch) : [...locales];
}

/**
 * Whether the request form is offered. Preview: always (demo delivery). Production: not
 * during the reduced launch — visitors contact the stores via WhatsApp or phone instead.
 */
export function isFormEnabled(mode: SiteMode = getSiteMode()): boolean {
  return mode === 'preview' || !reducedLaunch.active;
}

/** Value of a fact if it may be shown, otherwise null. */
export function shown<T>(fact: Fact<T>, mode: SiteMode = getSiteMode()): T | null {
  return isPublishable(fact.status, mode) ? (fact.value as T) : null;
}

/** Confirmed final site URL (no trailing slash) or null while the domain is not decided. */
export function getSiteUrl(): string | null {
  const fromEnv = process.env.SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, '');
  return brand.domain.status === 'confirmed' ? brand.domain.value.replace(/\/+$/, '') : null;
}

/**
 * Pages that exist conditionally. Every other page is always available.
 * Used by routes (404 when unavailable), navigation and the sitemap.
 */
export function isPageAvailable(path: string, mode: SiteMode = getSiteMode()): boolean {
  // Design draft of the new intro — never part of the production site.
  if (path === '/intro-preview') return mode === 'preview';
  if (path === '/our-new-name') return brand.transition.active || mode === 'preview';
  if (path === '/our-work') return visibleLooks(mode).length > 0;
  if (path.startsWith('/tailoring/')) {
    const id = path.split('/')[2];
    const category = categoryIds.find((c) => c === id);
    return category ? isPublishable(categories[category].offered.status, mode) : false;
  }
  if (path === '/tailoring') return categoryIds.some((id) => isPublishable(categories[id].offered.status, mode));
  return true;
}

/**
 * Looks that may be shown: in preview all non-missing entries (slots with placeholders),
 * in production only confirmed looks with an approved image.
 */
export function visibleLooks(mode: SiteMode = getSiteMode()) {
  return looks.filter((l) => isPublishable(l.status, mode) && (mode === 'preview' || (media[l.image].rights === 'approved' && !!media[l.image].src)));
}

/** All locale-independent paths of the site. */
export const sitePaths = [
  '/',
  '/tailoring',
  ...categoryIds.map((id) => `/tailoring/${id}`),
  '/craftsmanship',
  '/how-it-works',
  '/about',
  '/stores',
  '/stores/chaweng',
  '/stores/fishermans-village',
  '/our-work',
  '/faq',
  '/contact',
  '/returning-customers',
  '/our-new-name',
  '/privacy',
  '/legal',
];
