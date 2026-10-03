# CLAUDE.md

Website for a custom tailoring business with two stores on Koh Samui (Chaweng,
Fisherman’s Village). Working brand «Nicky Fashion Samui by Mario» — not approved.
Next.js 16 App Router, TypeScript, plain CSS. See README.md.

## Commands

`npm run lint` · `npm run typecheck` · `npm test` · `npm run build` · `npm run test:e2e` (after build) · `npm run check:release`

## Rules

1. All facts live in `src/content/*` with status confirmed/draft/missing. Missing = `null`.
   Never invent addresses, numbers, hours, prices, reviews, roles, biographies or production claims.
2. Every visible text goes through the locale files (en, de, th, fr, it). Add new keys to all
   five; `en.ts` defines the structure. Russian is planned.
3. No anniversary/founding claims, no superlatives, no «bespoke/handmade» or time guarantees,
   no Mr. Moss references, never the alternative name «Atelier Marivo».
4. Colours only via CSS variables in `globals.css`. Sans-serif, mark left of the name.
5. Form success only after the delivery service accepted; demo mode must say «not sent».
6. Preview stays noindex. No third-party trackers or embeds.
7. Before committing: lint, typecheck, unit tests, build; after UI changes also e2e + screenshots.
