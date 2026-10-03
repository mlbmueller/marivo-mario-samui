# Launch checklist

Separate **technical readiness** (done in this repository) from **content approval**
(owner decisions). Public deployment, domain changes, Google profile changes and real
customer messages require a separate order.

## 1. Technical readiness (status: done in preview)

- [x] All pages in EN / DE / TH / FR / IT, language switch keeps the page
- [x] Design system, header with mobile navigation, footer, mobile quick-contact bar
- [x] Request form with client + server validation, demo mode, delivery adapters
- [x] Release gate: production build fails while blockers remain
- [x] Preview not indexable (meta, header, robots.txt)
- [x] Final branding (logo, burgundy/ivory, serif headings), v2 home page, looks, 3-group form
- [x] Unit tests and browser tests green (see `docs/TEST_RESULTS.md`)

## 2. Content approval (owner)

Work through [CONTENT_TODO.md](CONTENT_TODO.md), [docs/IMAGE_BRIEF.md](docs/IMAGE_BRIEF.md) and [docs/RELEASE_GATE.md](docs/RELEASE_GATE.md).
Minimum to pass the release gate:

- [x] brand NICKY FASHION and approved logo SVG (delivered 3 Oct 2026)
- [ ] visual OK for the trimmed web logo (favicon optional)
- [ ] domain decided
- [ ] operator details and reviewed privacy notice
- [ ] exact address, map link and facade photo for both stores
- [ ] at least one confirmed WhatsApp number
- [ ] at least one confirmed style world (Suits, Linen & Holiday, Women, Weddings) with its photo
- [ ] six real, approved looks
- [ ] approved hero outfit photo and Mario portrait
- [ ] English and German texts approved (TH/FR/IT stay off until reviewed)

## 3. Production configuration

- [ ] Hosting project created (e.g. Vercel), Node 20.9+
- [ ] Environment variables set (see `.env.example`):
  - [ ] `SITE_MODE=production`
  - [ ] `SITE_URL=https://…` (final domain)
  - [ ] `INQUIRY_DELIVERY=webhook` + `INQUIRY_WEBHOOK_URL` (+ `INQUIRY_WEBHOOK_SECRET`) **or** `resend` + key/to/from
  - [ ] `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- [ ] Test request on the staging URL reaches the inbox; failure case tested by
      temporarily pointing the webhook to an invalid URL (error message must appear)
- [ ] `npm run check:release` with production env: 0 blockers
- [ ] Legacy redirects entered and set to `confirmed` (`docs/REDIRECTS.md`)

## 4. Go-live checks (on the production URL)

- [ ] `/robots.txt` allows crawling and lists the sitemap
- [ ] `/sitemap.xml` lists only published pages in all languages
- [ ] Page source: no `noindex`, canonical and hreflang point to the final domain
- [ ] Store data identical on page, JSON-LD and Google profile
- [ ] WhatsApp buttons open the right chat with the prefilled message
- [ ] Mobile check at 360–430 px on real devices (iOS Safari + Android Chrome): navigation, quick-contact bar, keyboard, zoom, rotation, form
- [ ] Lighthouse / accessibility check measured and documented (no values claimed without measurement)

## 5. After launch

- [ ] Google Business Profiles updated per `docs/GOOGLE_BUSINESS_CHECKLIST.md` (separate order)
- [ ] `/our-new-name` activated only once the rename is real (`brand.transition.active`)
