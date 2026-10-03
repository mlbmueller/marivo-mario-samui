# Nicky Fashion Samui by Mario — Website (development preview)

Website for a custom tailoring business with two stores on Koh Samui
(**Chaweng** and **Fisherman’s Village**), led by Mario.
Working brand name: **Nicky Fashion Samui by Mario** — not yet approved, centrally replaceable.

> Status: technically complete **development preview**. Not approved for publication —
> see [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) and [CONTENT_TODO.md](CONTENT_TODO.md).

## Stack

| Part | Version | Note |
| --- | --- | --- |
| Next.js (App Router, Turbopack) | 16.3.8 | static pre-rendering of all pages, one API route |
| React | 19.3.0 | |
| TypeScript | 5.9.3 | strict |
| Fonts | Manrope (Latin/Cyrillic) + Noto Sans Thai, OFL | self-hosted via `@fontsource-variable`, no Google requests |
| Tests | Vitest 5, Playwright 1.63 | |

No CSS framework, no UI library, no tracking, no CMS. Plain CSS design system in
`src/app/globals.css` (tokens in `:root`). Node ≥ 20.9 (developed on 22).

## Quick start

```bash
npm ci
npm run dev            # http://localhost:3000 → redirects to /en
```

Production-like preview:

```bash
npm run build          # runs the release check first, then next build
npm start              # http://localhost:3000
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | development server |
| `npm run build` | release check + production build (preview mode unless `SITE_MODE=production`) |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint (next/core-web-vitals + TypeScript) |
| `npm test` | unit tests: validation, delivery success/failure/demo, language switch, content rules |
| `npm run test:e2e` | browser tests (desktop 1440 px + mobile 375 px) against `next start`; build first |
| `npm run check:release` | lists blocking and auto-hidden content items; fails in production mode while blockers remain |
| `npm run screenshots` | full-page screenshots at 375/768/1440 px into `docs/screenshots/` (server must run on :3100) |

Playwright uses a preinstalled Chromium at `/opt/pw-browsers/chromium` when present,
otherwise set `PLAYWRIGHT_CHROMIUM_PATH` or run `npx playwright install chromium`.

## Languages

Active: **English (default), Deutsch, ไทย, Français, Italiano**. Planned: Русский.
All pages exist in all languages under `/{locale}/…` with identical slugs; the language
switcher (header and footer) keeps the current page including its query string.
`/` redirects deterministically to `/en` — no geolocation, no browser-language sniffing.

Texts live in `src/content/locales/{en,de,th,fr,it}.ts`. `en.ts` defines the structure;
TypeScript and `src/content/content.test.ts` reject missing keys, empty texts and
mismatched placeholders in any other language.

**Adding Russian:** create `src/content/locales/ru.ts` typed as `Dictionary`, add `'ru'`
to `locales` and `localeMeta` in `config.ts` and to `dictionaries` in `index.ts`.
Manrope already covers Cyrillic.

## Content maintenance

All content is file-based and typed. Components never contain contact data.

| File | Content |
| --- | --- |
| `src/content/brand.ts` | name, suffix, logo status, domain, central WhatsApp/e-mail, operator, rename switch |
| `src/content/stores.ts` | both stores: address, hours, phone, WhatsApp, map link, directions, photos |
| `src/content/team.ts` | Mario (owner), James (role open), further members |
| `src/content/services.ts` | categories (men/women/weddings), prices, process, policies |
| `src/content/media.ts` | image register: description, size, source, rights; work examples |
| `src/content/reviews.ts` | approved customer quotes only |
| `src/content/locales/*.ts` | all visible texts, alt texts |
| `src/content/redirects.json` | legacy URL redirects (see `docs/REDIRECTS.md`) |

Every fact has a status: `confirmed`, `draft` or `missing` (value `null`).
Use the helpers `confirmed(value)`, `draft(value)`, `missing()`.

- **preview**: confirmed + draft are shown, drafts carry a «Draft» badge; missing values show «To be confirmed»; photos show labelled placeholders.
- **production**: only confirmed content. Unconfirmed categories, the empty work page,
  the inactive rename page, unconfirmed process/bio texts and placeholder images disappear
  automatically (and from navigation and sitemap). Essential gaps block the build.

Examples:

```ts
// stores.ts — confirm an address and a WhatsApp number
address: confirmed('123 Example Road, Chaweng, Koh Samui 84320'),
whatsapp: confirmed('+66XXXXXXXXX'),

// team.ts — confirm James' title
role: confirmed('tailor'),

// media.ts — add an approved photo (file in public/images/)
'hero-fitting': { ...,  src: '/images/hero-fitting.jpg', width: 2400, height: 1600,
                  source: 'Photographer name, 2026', rights: 'approved' },
```

After a change: `npm run check:release` shows what is still open.

## Brand switch

Name, short name, suffix and logo are only defined in `src/content/brand.ts` and
`src/components/Logo.tsx` (temporary geometric SVG mark + favicon `src/app/icon.svg`).
The discussed alternative «Atelier Marivo by Mario» is intentionally **not** used anywhere;
a content test fails if it appears.

## Contact form and integrations

The form is an **appointment request**, not a booking. `POST /api/inquiry`:

- same validation on client and server (`src/lib/inquiry.ts`): name, matching contact
  value and concern required; departure not before arrival; no past or out-of-stay
  preferred dates; dates are calendar dates in **Asia/Bangkok**
- body limit 16 KB, JSON only, origin check, honeypot, rate limit (5 per 10 min per client)
- delivery adapters in `src/lib/server/delivery.ts`: `demo`, `webhook` (HMAC-signed), `resend`
- success only after the service answered 2xx; demo mode says «Test request — not sent»;
  production without a configured service answers «unavailable» — never a fake success
- logs contain only request id, adapter and outcome — no names, contacts, messages or IPs

Configuration: see [.env.example](.env.example). For production a shared rate-limit store
(Upstash Redis REST) is required; the in-memory limiter is preview-only.

WhatsApp links are built only from **confirmed** numbers (`wa.me`, message with product
and store, URL-encoded, no form data). Without a number the button is visibly disabled
in preview and absent in production.

## SEO, indexing, privacy

- preview: `noindex` meta, `X-Robots-Tag: noindex` header, `robots.txt` disallows all, empty sitemap
- production: per-page titles/descriptions, one H1 per page, hreflang alternates for all
  languages + `x-default`; canonical URLs, Open Graph and sitemap only once `SITE_URL` is set
- JSON-LD (`ClothingStore`) only from confirmed and visible store data — no ratings
- no third-party requests: fonts self-hosted, maps only as external links, analytics off
  (prepared events: `contact_cta_click`, `whatsapp_click`, `directions_click`,
  `inquiry_submit_success`, parameters limited to store/category/locale)

## Project documents

- [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) — release path from preview to production
- [CONTENT_TODO.md](CONTENT_TODO.md) — open business facts and texts
- [ASSET_CHECKLIST.md](ASSET_CHECKLIST.md) — required photos, placeholders, approvals
- [docs/REDIRECTS.md](docs/REDIRECTS.md) — fill-in table for legacy URLs
- [docs/GOOGLE_BUSINESS_CHECKLIST.md](docs/GOOGLE_BUSINESS_CHECKLIST.md) — operator checklist for Google profiles
- [docs/TEST_RESULTS.md](docs/TEST_RESULTS.md) — what was actually tested, with limits
- `docs/screenshots/` — home, store and contact at 375 / 768 / 1440 px
