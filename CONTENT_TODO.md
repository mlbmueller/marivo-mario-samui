# Content TODO — open facts before publication

Status: 3 October 2026. Facts are entered in `src/content/*` with status `confirmed`.
`npm run check:release` shows the current state automatically.

Legend: **B** = blocks production build · **H** = automatically hidden while open

## Brand and operator

| # | Item | Where | Effect |
| --- | --- | --- | --- |
| 1 | Approve brand name «Nicky Fashion Samui» (vs. «Atelier Marivo by Mario») | `brand.ts` name/shortName | B |
| 2 | Approve suffix «by Mario» | `brand.ts` suffix | B |
| 3 | Final logo (currently temporary geometric SVG mark) | `Logo.tsx`, `app/icon.svg`, `brand.ts` logo | B |
| 4 | Domain | `SITE_URL` env / `brand.ts` domain | B |
| 5 | Operator details for the legal notice (legal name, address, registration, contact) | `brand.ts` operator | B |
| 6 | Central e-mail address (optional) | `brand.ts` email | – |
| 7 | Date and confirmation of the actual rename (activates `/our-new-name`) | `brand.ts` transition.active | H |

## Stores

| # | Item | Chaweng | Fisherman’s Village | Effect |
| --- | --- | --- | --- | --- |
| 8 | Exact address | open | open | B |
| 9 | Map link to the exact location (no estimated pins) | open | open | B |
| 10 | Opening hours | open | open | H |
| 11 | Phone | open | open | H |
| 12 | WhatsApp number (per store or one central) | open | open | B (at least one) |
| 13 | Directions text per language | open | open | H |
| 14 | Which previous name («Nicky Fashion by Mario» / «Samui Armani By Mario») belonged to which store | open | open | H |

## Team

| # | Item | Effect |
| --- | --- | --- |
| 15 | Mario approves his introduction text (`home.marioText`, `about.marioText`) | H |
| 16 | James: title, responsibilities, store | H (name only) |
| 17 | Further team members: name, role, store, portrait approval | – |

## Offer, process, policies

| # | Item | Effect |
| --- | --- | --- |
| 18 | Actual assortment: men / women / weddings and the garment lists on each page | H per category, B if none |
| 19 | Design options that are really offered | text is generic until then |
| 20 | Prices in THB with scope and surcharges (or decision: no prices online) | H |
| 21 | Fitting process (4 proposed steps) confirmed by Mario | H |
| 22 | Production and fitting times | not mentioned |
| 23 | Deposit / payment rules | not mentioned |
| 24 | Alteration rules | not mentioned |
| 25 | Shipping / delivery abroad | not mentioned |
| 26 | Fabric brands, origin, production location; use of «handmade»/«bespoke» | not mentioned |
| 27 | Additional services (e.g. group handling details) | – |
| 28 | Reorder rules (what is checked, how) | page describes personal review only |

## Texts and languages

| # | Item | Effect |
| --- | --- | --- |
| 29 | Owner approval of all English and German texts | B |
| 30 | Native-speaker review of Thai, French and Italian (written as draft translations) | B |
| 31 | Russian translation (planned) | – |
| 32 | Real customer quotes with written consent | section stays hidden |

## Integrations and legal

| # | Item | Effect |
| --- | --- | --- |
| 33 | Delivery service for requests (webhook target or Resend account + inbox) | B |
| 34 | Shared rate-limit store (Upstash Redis) or equivalent | B |
| 35 | Privacy notice reviewed against actual processing (service, storage period, contact) | B |
| 36 | Decision on analytics (default: none) | – |
