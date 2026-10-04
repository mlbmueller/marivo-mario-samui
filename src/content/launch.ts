/**
 * Reduced launch, decided by the owner on 4 Oct 2026: the site goes live with the content
 * confirmed so far, before every item of the full release is ready.
 *
 * While active (production only):
 * - no request form — contact via WhatsApp, phone and the store pages
 * - sections without an approved photo are hidden (hero falls back to an approved photo)
 * - legal notice shows the confirmed contact data until the operator details follow
 * - privacy notice describes the site without a form (src/content/privacy-no-form.ts)
 *
 * Switch off once operator details, privacy text, delivery service, hero/portrait/style
 * photos and the six looks are in place; the full release gate then applies again.
 */
export const reducedLaunch = {
  active: true,
  decidedOn: '2026-10-04',
} as const;
