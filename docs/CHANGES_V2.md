# Changes v2 — final branding and website corrections (3 Oct 2026)

Based on `CLAUDE_CODE_WEBSITE_BRIEFING.md` v2.0 (master), `CLAUDE_CODE_BRANDING_UPDATE.md` v2.0
and `NICKY_FASHION_FINAL_PACKAGE.zip`. The existing site was revised, not rebuilt.
Languages stay EN / DE / TH / FR / IT (owner decision), Russian planned.

## Decisions taken in this round

| Topic | Decision | Reversible via |
| --- | --- | --- |
| Logo file used on the site | `NICKY_FASHION_WEB_TRIM.svg` — viewBox trimmed to artwork + clear space; paths identical to the approved file. Original 4:1 box would make line 3 ≈ 6 px in the header. Release blocker until visually approved. | `brand.logo.web` → original file |
| Desktop navigation | from 1280 px (German/French labels need the width next to a 320 px logo); below that the menu button | `globals.css` breakpoints |
| Favicon | none — no symbol invented; listed as open asset | `brand.favicon` + `src/app/icon.*` |
| Six looks | six empty, labelled slots (draft) so layout and the request flow can be reviewed; no invented titles, customers or fabrics | `src/content/looks.ts` |
| Headings font | Source Serif 4 (upright serif, OFL, self-hosted) — orientation to Nimbus Roman, not a logo reconstruction | `--font-serif` |
| Mobile bar «mid-page» in the earlier screenshot | capture artefact of a full-page screenshot of a fixed element; in the real viewport the bar sits at the bottom edge (now tested). Hidden on `/contact` and `/returning-customers`. | `MobileBarGate.tsx` |

## What changed

**Brand and design**
- Brand NICKY FASHION everywhere (titles, metadata, Open Graph, footer, alt text, JSON-LD name); working name «Nicky Fashion Samui by Mario», geometric symbol and favicon removed.
- Logo assets in `public/brand/`; `Logo.tsx` renders the SVG as image (`height: auto`, ratio from viewBox); footer shows it on an ivory panel.
- Tokens Burgundy `#5A1530`, Ivory `#F7F0E4`, Ink `#222222`, White, Muted `#62605C`; navy/gold removed; burgundy primary buttons and contrast sections; serif headings, sans body.

**Home page (new order)**: emotional hero (outfit + consultation scene, «CUSTOM TAILORING · KOH SAMUI», new H1, «Plan Your Fitting» + «Explore the Looks», SEO line) → compact trust row → four style worlds → six looks with «Ask about this look» → Mario & team (optional on-demand film) → «When are you visiting Samui?» module → four steps on burgundy → reviews (hidden) → both stores → short FAQ → closing CTA → footer.

**Navigation**: Tailoring · Our Work · Mario & Team · Our Stores · Contact; How It Works via home, tailoring and footer.

**New**: `/tailoring/linen-holiday`; `src/content/looks.ts`; filterable Our Work gallery with accessible `<dialog>`; looks on category pages; prepared but inactive extra services (hotel pick-up, villa consultation, hotel delivery, shipping).

**Form**: three groups, one interest field, removable look reference, dates or «still open», optional suggested date behind a toggle, hidden values not sent, ongoing stays allowed, new success text.

**Release gate**: added blockers for logo crop approval, favicon, six approved looks, store facade photos and confirmed-category photos.

## Files

New: `public/brand/*`, `src/content/looks.ts`, `src/components/{Looks,LookGallery,PlanStay,MobileBarGate}.tsx`, `docs/CHANGES_V2.md`.
Removed: `src/app/icon.svg`.
Changed: `src/content/{brand,services,media,types}.ts`, all five locale files, `src/lib/{inquiry,site,release,whatsapp,page}.ts`,
`src/components/{InquiryForm,Logo,Sections,SiteChrome,WhatsAppButton}.tsx`, `src/app/globals.css`,
`src/app/[locale]/{layout,page}.tsx`, `…/contact`, `…/returning-customers`, `…/our-work`, `…/tailoring/[category]`,
tests (`inquiry.test.ts`, `handle-inquiry.test.ts`, `content.test.ts`, `e2e/site.spec.ts`), `scripts/screenshots.mjs`,
`package.json` (+ Source Serif 4, Noto Serif Thai), documentation.
