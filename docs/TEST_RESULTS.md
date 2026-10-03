# Test results

Run on 3 October 2026, Node 22.22, Playwright 1.63 with the preinstalled Chromium build (`/opt/pw-browsers`),
build in preview mode with demo delivery. Nobody was notified by any test.

## Automated

| Check | Command | Result |
| --- | --- | --- |
| Lint | `npm run lint` | 0 problems |
| Types | `npm run typecheck` | 0 errors |
| Unit tests | `npm test` | 51 / 51 passed |
| Build (preview) | `npm run build` | passed, 96 static pages + `/api/inquiry` |
| Build (production, current content) | `SITE_MODE=production npm run build` | **fails as intended** — 21 blockers (see `npm run check:release`) |
| Browser tests | `npm run test:e2e` | 30 passed, 2 skipped (mobile-only tests on the desktop project) |
| Dependency audit (runtime) | `npm audit --omit=dev` | 0 vulnerabilities |
| Dependency audit (all) | `npm audit` | 5 high in the lint toolchain only (`braces` via `eslint-config-next` → `fast-glob`); not shipped, no non-breaking fix available |

### What the unit tests cover

- form validation: required fields, e-mail/phone by contact method, departure ≥ arrival,
  past and out-of-stay preferred dates, impossible dates, unknown options, length limits
- `todayInBangkok` uses the Asia/Bangkok calendar date
- API: demo → «demo» (never «accepted»); webhook 2xx → «accepted» with HMAC signature;
  webhook 5xx / network error → failure; production without service → 503 «unavailable»;
  server-side field errors; foreign/missing origin 403; oversize 413; honeypot not delivered;
  rate limit 429 after 5 requests; logs contain no personal data
- language switch paths incl. query string, hreflang alternates
- WhatsApp: no link without confirmed number; message encoding with product and store
- content rules: identical structure, no empty texts and identical placeholders in all
  five languages; no anniversary claims, superlatives, «bespoke/handmade», guarantees,
  24-hour promises, Mr. Moss, alternative brand name or previous names in visible texts;
  missing facts are `null`; Mario = owner, James without role; no JSON-LD from unconfirmed data;
  every image has description and alt text in all languages
- preview vs production visibility rules and release blockers

### What the browser tests cover (desktop 1440 px and mobile 375 px)

- `/` → `/en`, `noindex` header and meta, exactly one H1
- home in German: both stores, locations line, no «20 years» claim, no horizontal overflow
- language switch (header and footer) keeps the page; on `/contact` also the preselection
- all five languages render the store page with the right `lang` attribute
- localised 404 with HTTP status 404
- mobile menu: opens with Enter, focus moves into the menu, Escape closes and returns focus
- quick-contact bar does not cover the footer; no horizontal overflow on contact page
- form: field errors with input kept; date order and past date errors; product/concern
  taken over from a category link, store from a store link; demo result labelled
  «Test request — not sent»; simulated delivery failure shows error, keeps input, «Try again»;
  simulated slow success: button disabled with «Sending…», a second click sends nothing,
  success text says it is not yet a confirmed appointment
- WhatsApp: no `wa.me` link exists, disabled state is explained

## Visual check

`npm run screenshots` → `docs/screenshots/` (home EN/DE/TH, store, contact at 375, 768,
1440 px). All 15 captures: no horizontal overflow. Reviewed by eye: header with mark left
of the name, sans-serif type, Thai text renders with Noto Sans Thai, mobile menu and quick
bar as intended.

## Not tested / limits

- No real delivery service, no Upstash instance — only simulated responses
- Only Chromium; Safari/iOS (safe-area, date picker) and Firefox not tested
- No screen-reader session; accessibility checked via semantics, labels, focus and
  keyboard tests only. No Lighthouse/axe scores measured — none are claimed
- Thai, French and Italian texts not reviewed by native speakers
- Native date inputs display in the browser’s locale format (e.g. mm/dd/yyyy in an
  English-US browser); values are sent as `YYYY-MM-DD`
