# Content TODO — open facts before publication

Status: 3 October 2026 (briefing v2.0, final brand NICKY FASHION).
Facts are entered in `src/content/*` with status `confirmed`.
`npm run check:release` shows the current state automatically.

Legend: **B** = blocks production build · **H** = automatically hidden while open

## Brand and operator

| # | Item | Where | Effect |
| --- | --- | --- | --- |
| 1 | ✅ Brand name NICKY FASHION and three-line logo — approved and delivered | `brand.ts`, `public/brand/` | done |
| 2 | Visual OK for the trimmed web logo (viewBox only; paths identical) | `brand.ts` logoWebCrop | B |
| 3 | Favicon / small logo format (not invented from the word mark) | `brand.ts` favicon | B |
| 4 | Domain | `SITE_URL` env / `brand.ts` domain | B |
| 5 | Operator details for the legal notice | `brand.ts` operator | B |
| 6 | Central e-mail address (optional) | `brand.ts` email | – |
| 7 | Date and confirmation of the actual rename (activates `/our-new-name`) | `brand.ts` transition.active | H |

## Stores

| # | Item | Chaweng | Fisherman’s Village | Effect |
| --- | --- | --- | --- | --- |
| 8 | Exact address | open | open | B |
| 9 | Map link to the exact location (no estimated pins) | open | open | B |
| 10 | Facade photo with current signage | open | open | B |
| 11 | Opening hours | open | open | H |
| 12 | Phone | open | open | H |
| 13 | WhatsApp number (per store or one central) | open | open | B (at least one) |
| 14 | Directions text per language | open | open | H |
| 15 | Which previous name («Nicky Fashion by Mario» / «Samui Armani By Mario») belonged to which store | open | open | H |

## Team

| # | Item | Effect |
| --- | --- | --- |
| 16 | Mario approves his introduction text (home + about) | H |
| 17 | James: title, responsibilities, store | H (name only) |
| 18 | Further team members: name, role, store, portrait approval | – |
| 19 | Optional atelier film (20–30 s, with captions) | not shown while missing |

## Offer, looks, process, policies

| # | Item | Effect |
| --- | --- | --- |
| 20 | Confirm the four style worlds: Suits, Linen & Holiday, Women, Weddings (and the garment lists) | H per category, B if none |
| 21 | Hero texts «Custom clothing for men and women…» (assortment statement) | part of text approval |
| 22 | **Six real, approved looks**: photo, title, category, occasion, fabric if known (all languages) | B |
| 23 | Design options that are really offered | text stays generic |
| 24 | Prices in THB with scope and surcharges (or: no prices online) | H |
| 25 | Fitting process (4 proposed steps) confirmed by Mario | H |
| 26 | Production and fitting times | not mentioned |
| 27 | Deposit / payment rules | not mentioned |
| 28 | Alteration rules | not mentioned |
| 29 | Shipping / delivery abroad | not mentioned |
| 30 | Fabric brands, origin, production location; «handmade»/«bespoke» | not mentioned |
| 31 | Extra services: hotel pick-up, villa consultation, hotel delivery, shipping — conditions, area, cost, request path | prepared, inactive |
| 32 | Reorder rules (what is checked, how) | page describes personal review only |

## Texts and languages

| # | Item | Effect |
| --- | --- | --- |
| 33 | Owner approval of all English and German texts | B |
| 34 | Native-speaker review of Thai, French and Italian (draft translations) | B |
| 35 | Russian translation (planned) | – |
| 36 | Real customer quotes with written consent, source and store | section stays hidden |

## Integrations and legal

| # | Item | Effect |
| --- | --- | --- |
| 37 | Delivery service for requests (webhook target or Resend account + inbox) | B |
| 38 | Shared rate-limit store (Upstash Redis) or equivalent | B |
| 39 | Privacy notice reviewed against actual processing (service, storage period, contact) | B |
| 40 | Decision on analytics (default: none) | – |
