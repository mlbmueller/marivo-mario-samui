/**
 * Content and configuration release check.
 * - blockers: must be resolved before SITE_MODE=production may be built
 * - hidden:   not blocking; the affected element is automatically hidden in production
 */
import { brand, operator, privacyNotice } from '@/content/brand';
import { localeMeta, locales } from '@/content/locales';
import { media } from '@/content/media';
import { reviews } from '@/content/reviews';
import { categories, categoryIds, processSteps, policies } from '@/content/services';
import { stores, storeIds } from '@/content/stores';
import { team } from '@/content/team';

export type ReleaseItem = { area: string; item: string };
export type ReleaseReport = { blockers: ReleaseItem[]; hidden: ReleaseItem[] };

type Env = Record<string, string | undefined>;

export function getReleaseReport(env: Env = process.env): ReleaseReport {
  const blockers: ReleaseItem[] = [];
  const hidden: ReleaseItem[] = [];
  const block = (area: string, item: string) => blockers.push({ area, item });
  const hide = (area: string, item: string) => hidden.push({ area, item });

  // Brand
  if (brand.name.status !== 'confirmed') block('Brand', 'Brand name approved');
  if (brand.suffix.status !== 'confirmed') block('Brand', 'Name suffix "by Mario" approved');
  if (brand.logo.status !== 'confirmed') block('Brand', 'Final logo approved (temporary SVG mark in use)');
  if (brand.domain.status !== 'confirmed' && !env.SITE_URL) block('Brand', 'Final domain confirmed (SITE_URL)');

  // Legal and privacy
  if (operator.status !== 'confirmed') block('Legal', 'Operator details for the legal notice');
  if (privacyNotice.status !== 'confirmed') block('Legal', 'Privacy notice reviewed against the actual processing');

  // Contact channels
  const anyWhatsApp = brand.whatsapp.status === 'confirmed' || storeIds.some((id) => stores[id].whatsapp.status === 'confirmed');
  if (!anyWhatsApp) block('Contact', 'At least one confirmed WhatsApp number');

  // Stores
  for (const id of storeIds) {
    const s = stores[id];
    if (s.address.status !== 'confirmed') block(`Store ${id}`, 'Exact address');
    if (s.mapUrl.status !== 'confirmed') block(`Store ${id}`, 'Map link for the exact location');
    if (s.hours.status !== 'confirmed') hide(`Store ${id}`, 'Opening hours (hidden until confirmed)');
    if (s.phone.status !== 'confirmed') hide(`Store ${id}`, 'Phone number (hidden until confirmed)');
    if (s.previousName.status !== 'confirmed') hide(`Store ${id}`, 'Previous business name mapping');
  }

  // Team
  for (const member of team) {
    if (member.bio.status === 'draft') hide('Team', `${member.name.value ?? member.id}: introduction text (hidden until approved)`);
    if (member.role.status !== 'confirmed') hide('Team', `${member.name.value ?? member.id}: role/title (name only until confirmed)`);
  }

  // Assortment and process
  for (const id of categoryIds) {
    if (categories[id].offered.status !== 'confirmed') hide('Assortment', `Category "${id}" (removed from navigation and sitemap)`);
    if (categories[id].price.status !== 'confirmed') hide('Assortment', `Prices for "${id}" (personal quote instead)`);
  }
  if (!categoryIds.some((id) => categories[id].offered.status === 'confirmed')) {
    block('Assortment', 'At least one confirmed tailoring category');
  }
  if (processSteps.status !== 'confirmed') hide('Process', 'Fitting process (hidden until Mario confirms it)');
  for (const [key, fact] of Object.entries(policies)) {
    if (fact.status !== 'confirmed') hide('Policies', `${key} (not mentioned on the site)`);
  }

  // Media
  const requiredImages = ['hero-fitting', 'portrait-mario'] as const;
  for (const id of requiredImages) {
    if (media[id].rights !== 'approved' || !media[id].src) block('Media', `Approved photo: ${id}`);
  }
  for (const asset of Object.values(media)) {
    if ((requiredImages as readonly string[]).includes(asset.id)) continue;
    if (asset.rights !== 'approved' || !asset.src) hide('Media', `Photo ${asset.id} (section without image or hidden)`);
  }
  if (reviews.length === 0) hide('Reviews', 'No approved customer quotes (section not shown)');

  // Languages
  for (const locale of locales) {
    if (!localeMeta[locale].reviewed) block('Languages', `Texts in ${localeMeta[locale].label} reviewed and approved`);
  }

  // Integrations
  const delivery = (env.INQUIRY_DELIVERY ?? '').trim();
  const deliveryReady =
    (delivery === 'webhook' && !!env.INQUIRY_WEBHOOK_URL) ||
    (delivery === 'resend' && !!env.RESEND_API_KEY && !!env.INQUIRY_EMAIL_TO && !!env.INQUIRY_EMAIL_FROM);
  if (!deliveryReady) block('Integrations', 'Inquiry delivery service configured (INQUIRY_DELIVERY=webhook|resend)');
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    block('Integrations', 'Shared rate-limit store configured (UPSTASH_REDIS_REST_URL/TOKEN)');
  }

  return { blockers, hidden };
}
