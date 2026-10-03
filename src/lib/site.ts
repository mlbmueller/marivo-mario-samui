import { brand } from '@/content/brand';
import { categories, categoryIds } from '@/content/services';
import { workExamples } from '@/content/media';
import type { ContentStatus, Fact } from '@/content/types';

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
  if (path === '/our-new-name') return brand.transition.active || mode === 'preview';
  if (path === '/our-work') return workExamples.length > 0 || mode === 'preview';
  if (path.startsWith('/tailoring/')) {
    const id = path.split('/')[2];
    const category = categoryIds.find((c) => c === id);
    return category ? isPublishable(categories[category].offered.status, mode) : false;
  }
  if (path === '/tailoring') return categoryIds.some((id) => isPublishable(categories[id].offered.status, mode));
  return true;
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
