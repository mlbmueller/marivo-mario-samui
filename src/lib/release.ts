/**
 * Content and configuration release check.
 * - blockers: must be resolved before SITE_MODE=production may be built
 * - hidden:   not blocking; the affected element is automatically hidden in production
 */
import { brand, operator, privacyNotice } from '@/content/brand';
import { localeMeta, locales } from '@/content/locales';
import { looks, REQUIRED_LOOKS } from '@/content/looks';
import { media } from '@/content/media';
import { reviews } from '@/content/reviews';
import { categories, categoryIds, extraServices, processSteps, policies } from '@/content/services';
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
  if (brand.logoAsset.status !== 'confirmed') block('Brand', 'Approved logo SVG in public/brand/');
  if (brand.logoWebCrop.status !== 'confirmed') block('Brand', 'Visual approval of the trimmed web logo (viewBox only, artwork unchanged)');
  // Optional: without an approved small format the browser shows its default icon.
  if (brand.favicon.status !== 'confirmed') hide('Brand', 'Favicon (browser default until a proposal is approved — see docs/proposals/)');
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
  for (const s of extraServices) {
    if (s.active.status !== 'confirmed') hide('Services', `${s.id} (no public service promise)`);
  }
  for (const [key, fact] of Object.entries(policies)) {
    if (fact.status !== 'confirmed') hide('Policies', `${key} (not mentioned on the site)`);
  }

  // Looks — a convincing real selection is required, not hidden away
  const approvedLooks = looks.filter((l) => l.status === 'confirmed' && media[l.image].rights === 'approved' && media[l.image].src);
  if (approvedLooks.length < REQUIRED_LOOKS) block('Looks', `${REQUIRED_LOOKS} real, approved looks (currently ${approvedLooks.length})`);

  // Media
  const requiredImages = [
    'hero-outfit',
    'portrait-mario',
    ...storeIds.map((id) => stores[id].exteriorImage),
    ...categoryIds.filter((id) => categories[id].offered.status === 'confirmed').map((id) => categories[id].image),
  ] as const;
  for (const id of requiredImages) {
    if (media[id].rights !== 'approved' || !media[id].src) block('Media', `Approved photo: ${id}`);
  }
  for (const asset of Object.values(media)) {
    if ((requiredImages as readonly string[]).includes(asset.id) || asset.id.startsWith('look-')) continue;
    if (asset.rights !== 'approved' || !asset.src) hide('Media', `Photo ${asset.id} (section without image or hidden)`);
  }
  if (reviews.length === 0) hide('Reviews', 'No approved customer quotes (section not shown)');

  // Languages
  for (const locale of locales) {
    const label = localeMeta[locale].label;
    if (localeMeta[locale].launch && !localeMeta[locale].reviewed) block('Languages', `Texts in ${label} reviewed and approved`);
    if (!localeMeta[locale].launch) hide('Languages', `${label}: not part of the launch (no route, not selectable) until reviewed and set to launch`);
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
