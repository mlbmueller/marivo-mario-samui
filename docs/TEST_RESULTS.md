# Test results

Run on 3 October 2026 (v2, final branding), Node 22.22, Playwright 1.63 with the preinstalled
Chromium build (`/opt/pw-browsers`), build in preview mode with demo delivery.
Nobody was notified by any test.

## Automated

| Check | Command | Result |
| --- | --- | --- |
| Lint | `npm run lint` | 0 problems |
| Types | `npm run typecheck` | 0 errors |
| Unit tests | `npm test` | 56 / 56 passed |
| Build (preview) | `npm run build` | passed, 100 static pages + `/api/inquiry` |
| Build (production, current content) | `SITE_MODE=production npm run build` | **fails as intended** — 23 blockers (`npm run check:release`) |
| Browser tests | `npm run test:e2e` | 52 passed, 10 skipped (mobile-only tests on desktop project and vice versa) |
| Dependency audit (runtime) | `npm audit --omit=dev` | 0 vulnerabilities |
| Dependency audit (all) | `npm audit` | 5 high in the lint toolchain only (`braces` via `eslint-config-next`); not shipped |

### Unit tests cover

- form v2: interest/name/contact required and nothing else; «Not sure yet» valid; both dates
  required for fixed dates; departure ≥ arrival; ongoing stays allowed, past departure rejected;
  «dates still open» and un-toggled suggested date are stripped; suggested date not past and
  within the stay; unknown options and look ids rejected; Asia/Bangkok calendar date
- context take-over: look link → look + interest; home module → interest + dates / open;
  unknown values and contact data in the URL ignored
- API: demo → «demo»; webhook 2xx → «accepted» (HMAC); 5xx/network → failure; production
  without service → 503; server field errors; origin 403; oversize 413; honeypot; rate limit;
  no personal data in logs
- language switch paths incl. query; hreflang; WhatsApp only with confirmed number, encoding
- brand: NICKY FASHION confirmed, no «Samui» in the name, no earlier working names; web logo
  has byte-identical paths to the approved SVG, outlines (no `<text>`), viewBox ratio = declared size
- content rules in all five languages (structure, placeholders, banned claims), image alt texts,
  preview vs production visibility, release blockers

### Browser tests cover (desktop 1440 px and mobile 375 px)

- `/` → `/en`, noindex header + meta, one H1 «Your island stay. Your signature style.»
- header logo: approved SVG, alt text, rendered ratio ≈ 4.10:1, ≥ 185 px wide; same file in Thai
- home v2 (DE): H1, locations line, 4 style worlds, 6 look cards, «Looks entdecken» → `#looks`,
  both stores, no anniversary claim / old name, no overflow
- main navigation order Tailoring · Our Work · Mario & Team · Our Stores · Contact (desktop and mobile menu)
- language switch (header, footer) keeps the page and the request context
- five languages on the store page; localised 404
- mobile: keyboard menu with focus handling; quick bar at the visible bottom edge, not covering
  the footer; quick bar absent on `/contact` and `/returning-customers`; hero CTA within ~1 screen
- form: three groups, no `concern`/`product` duplicates, suggested date only after toggle;
  field errors with input kept; date order + past date errors; «dates still open» hides and does
  not send dates; «Ask about this look» → look reference + interest, removable, nothing sent;
  home plan module → interest + dates in the form; category/store links; demo labelled
  «Test request — not sent»; simulated failure with retry; simulated slow success: one request
  only, DE success text «Deine Anfrage wurde gesendet. …»
- Our Work: filter by style (`aria-pressed`), dialog opens, «Ask about this look» link, Escape
  closes, focus returns to the opener
- no horizontal overflow and logo ≥ 185 px at **360, 375, 390, 430, 768, 1440 px** on
  `/en`, `/th`, `/de/contact`, `/en/stores/fishermans-village`, `/fr/our-work`

Additional manual measurement: header fits without wrapping or overflow in all five languages
at 1100, 1279, 1280, 1320 and 1440 px (desktop navigation from 1280 px).

## Visual check

`docs/screenshots/`: home and contact at 360/375/390/430/768/1440 px, German home, store and
Our Work at 375/1440 px — rendered pages, all without horizontal overflow. Reviewed by eye:
three-line word mark legible in header (sub-lines small but readable at 360 px) and on the
ivory footer panel, burgundy/ivory palette, serif headings, hero order on mobile (image, H1,
main action), look reference chip in the form. Note: full-page screenshots show the fixed mobile
bar at the capture position — not its real position.

## Not tested / limits

- No real photos exist: hero, style worlds, looks and stores are placeholders; the visual
  impression of the final image world cannot be judged yet
- No real delivery service or Upstash instance — simulated responses only
- Only Chromium (desktop + Pixel 7 emulation). Safari/iOS (safe area, date picker, keyboard
  opening, zoom, rotation) and Firefox not tested
- No screen-reader session; no Lighthouse/axe scores measured — none claimed
- TH/FR/IT texts not reviewed by native speakers
- Native date inputs show the browser’s locale format; values are sent as `YYYY-MM-DD`
