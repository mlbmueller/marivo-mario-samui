# NICKY FASHION — Website (development preview)

**NICKY FASHION · MEN’S & WOMEN’S WEAR · Tailoring by Mario K.**
Custom tailoring with two stores on Koh Samui — **Chaweng** and **Fisherman’s Village** —
one team led by Mario. Final brand and logo as of 3 October 2026 (briefing v2.0).

> Status: technically complete **development preview**, not approved for publication.
> See [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md), [CONTENT_TODO.md](CONTENT_TODO.md),
> [ASSET_CHECKLIST.md](ASSET_CHECKLIST.md). Changes for v2: [docs/CHANGES_V2.md](docs/CHANGES_V2.md).

## Stack

| Part | Version | Note |
| --- | --- | --- |
| Next.js (App Router, Turbopack) | 16.3.8 | all pages statically pre-rendered, one API route |
| React | 19.3.0 | |
| TypeScript | 5.9.3 | strict |
| Headings | Source Serif 4 (+ Noto Serif Thai), OFL | upright serif, self-hosted via `@fontsource-variable` |
| Body, navigation, forms | Manrope (+ Noto Sans Thai), OFL | clear sans-serif, self-hosted |
| Tests | Vitest 5, Playwright 1.63 | |

No CSS framework, no UI library, no tracking, no CMS. Design tokens in `src/app/globals.css`.
Node ≥ 20.9 (developed on 22).

## Quick start

```bash
npm ci
npm run dev            # http://localhost:3000 → redirects to /en
```

Production-like preview:

```bash
npm run build          # runs the release check first, then next build
npm start
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | development server |
| `npm run build` | release check + production build (preview mode unless `SITE_MODE=production`) |
| `npm run typecheck` / `npm run lint` | TypeScript / ESLint |
| `npm test` | unit tests: validation, look/date context take-over, delivery success/failure/demo, language switch, content and brand rules |
| `npm run test:e2e` | browser tests (desktop 1440 px + mobile 375 px, overflow at 360–1440 px) against `next start`; build first |
| `npm run check:release` | lists blocking and auto-hidden content items; fails in production mode while blockers remain |
| `npm run screenshots` | full-page screenshots at 360/375/390/430/768/1440 px into `docs/screenshots/` (server on :3100) |

Playwright uses a preinstalled Chromium at `/opt/pw-browsers/chromium` when present,
otherwise set `PLAYWRIGHT_CHROMIUM_PATH` or run `npx playwright install chromium`.

## Brand and logo

| Item | Value |
| --- | --- |
| Brand | NICKY FASHION («Samui» is a location, not part of the name) |
| Logo | three upright lines, centred, no symbol: NICKY FASHION / MEN’S & WOMEN’S WEAR / Tailoring by Mario K. |
| Colours | Burgundy `#5A1530`, Ivory `#F7F0E4`, Ink `#222222`, White `#FFFFFF`, Muted `#62605C` |
| Locations line | Chaweng · Fisherman’s Village · Koh Samui (separate text, translated) |

Logo files in `public/brand/` (from the final package, verified):

- `NICKY_FASHION_WEB.svg` — approved file as delivered: viewBox `0 0 4000 1000`, all text as outlined paths, fills `#5A1530`/`#222222`, transparent.
- `NICKY_FASHION_WEB_TRIM.svg` — **used on the site**. Byte-identical paths; only the
  `viewBox` is trimmed to the artwork plus a clear space of half the height of line 2
  (`381 156 3238 789`, ratio ≈ 4.10:1). Reason: in the original 4:1 box the artwork fills
  only ~78 % of the width and ~65 % of the height, so «Tailoring by Mario K.» would be ≈ 6 px
  tall in a 300 px header. A content test proves the paths are unchanged. **Needs a short
  visual approval** (release blocker).
- `NICKY_FASHION_WEB.png` — transparent 2400 × 600 raster alternative (not used currently).

The logo is an `<img>` with `height: auto`, never rebuilt from text, never translated.
Header width: 185–260 px on phones (whatever the two header buttons leave), 320 px from
1280 px. Footer: unchanged logo on an ivory panel (no inverted variant). Print files
(TIFF/JPG/GIF/PDF) are deliberately not part of the web project. No favicon was invented.

## Languages

Active: **English (default), Deutsch, ไทย, Français, Italiano**. Planned: Русский.
All pages exist in all languages under `/{locale}/…` with identical slugs; the language
switcher (header and footer) keeps the current page including its query string.
`/` redirects deterministically to `/en` — no geolocation.

Texts live in `src/content/locales/{en,de,th,fr,it}.ts`. `en.ts` defines the structure;
TypeScript and `src/content/content.test.ts` reject missing keys, empty texts and
mismatched placeholders. To add Russian: create `ru.ts` typed as `Dictionary`, add `'ru'`
to `config.ts` and `index.ts` (Manrope and Source Serif 4 cover Cyrillic).

## Content maintenance

| File | Content |
| --- | --- |
| `src/content/brand.ts` | brand, logo files, domain, central WhatsApp/e-mail, operator, rename switch |
| `src/content/stores.ts` | both stores: address, hours, phone, WhatsApp, map link, directions, photos |
| `src/content/team.ts` | Mario (owner), James (role open), further members |
| `src/content/services.ts` | four style worlds/categories, interests, prices, process, policies, prepared extra services (inactive) |
| `src/content/looks.ts` | selected looks with stable ids (six empty slots for now) |
| `src/content/media.ts` | image register incl. atelier film slot |
| `src/content/reviews.ts` | approved customer quotes only |
| `src/content/locales/*.ts` | all visible texts and alt texts |
| `src/content/redirects.json` | legacy URL redirects (see `docs/REDIRECTS.md`) |

Every fact has a status `confirmed`, `draft` or `missing` (value `null`).
**preview** shows confirmed + draft (with «Draft» marker) and labelled placeholders;
**production** shows only confirmed content — optional gaps disappear automatically, central
gaps (hero, logo approval, looks, store data, …) block the build instead of being hidden.

Adding a real look:

```ts
// looks.ts
{ id: 'look-01', category: 'linen-holiday', image: 'look-01', details: ['detail-finish'],
  occasion: { en: 'Beach wedding', de: 'Strandhochzeit' }, fabric: { en: 'Linen' }, status: 'confirmed' },
// media.ts: set src/width/height/source and rights: 'approved' for 'look-01'
// locales/*.ts: looks.items['look-01'].title in every language
```

## Request form and integrations

Appointment **request**, not a booking. Three groups:

1. **Your request** — one interest field (Suits, Linen & Holiday, Women, Weddings, Other, Not sure yet); a look reference from «Ask about this look» is shown and removable.
2. **Your stay** — arrival/departure or «My dates are still open»; preferred store (default «No preference»); «Suggest a consultation date» reveals the optional date.
3. **Contact** — name, contact method, the matching contact field, optional message.

Rules (`src/lib/inquiry.ts`, client and server): interest, name and matching contact value
required; fixed dates need both dates, departure not before arrival or in the past, ongoing
stays allowed; hidden values (dates when open, date when not suggested) are not sent;
suggested date not in the past (Asia/Bangkok calendar) and within the stay.
Context comes in via `/contact?look=…`, `?interest=…`, `?store=…`, `?arrival=…&departure=…`,
`?datesOpen=1` — never contact data; taking over context sends nothing.

`POST /api/inquiry`: 16 KB limit, JSON only, origin check, honeypot, rate limit;
adapters `demo` / `webhook` (HMAC) / `resend` in `src/lib/server/delivery.ts`. Success only
after the service answered 2xx («Your request has been sent. Our team will contact you to
arrange a suitable time.»); demo shows «Test request — not sent»; production without a
service answers «unavailable». Logs contain no personal data. See [.env.example](.env.example).

WhatsApp links only from **confirmed** numbers, message with look/category and store,
URL-encoded. Mobile quick-contact bar at the bottom edge (safe area), hidden on `/contact`
and `/returning-customers`.

## SEO, indexing, privacy

- preview: `noindex` meta + `X-Robots-Tag`, robots.txt disallows all, empty sitemap
- production: titles/descriptions per page, one H1, hreflang for all languages + `x-default`;
  canonical, Open Graph and sitemap only once `SITE_URL` is confirmed
- JSON-LD only from confirmed, visible store data — no ratings
- no third-party requests: fonts self-hosted, maps as external links, analytics off

## Project documents

[LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) · [CONTENT_TODO.md](CONTENT_TODO.md) ·
[ASSET_CHECKLIST.md](ASSET_CHECKLIST.md) · [docs/CHANGES_V2.md](docs/CHANGES_V2.md) ·
[docs/REDIRECTS.md](docs/REDIRECTS.md) · [docs/GOOGLE_BUSINESS_CHECKLIST.md](docs/GOOGLE_BUSINESS_CHECKLIST.md) ·
[docs/TEST_RESULTS.md](docs/TEST_RESULTS.md) · `docs/screenshots/`
