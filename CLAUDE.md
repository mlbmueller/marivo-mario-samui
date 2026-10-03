# CLAUDE.md

Website of NICKY FASHION – Men’s & Women’s Wear – Tailoring by Mario K. Two stores on
Koh Samui (Chaweng, Fisherman’s Village). Next.js 16 App Router, TypeScript, plain CSS.
Master brief: briefing v2.0 (3 Oct 2026). See README.md.

## Commands

`npm run lint` · `npm run typecheck` · `npm test` · `npm run build` · `npm run test:e2e` (after build) · `npm run check:release`

## Rules

1. Brand is NICKY FASHION. Logo = the delivered outlined SVG in `public/brand/`; never rebuild
   it from text, never distort it, never translate it, no symbol/monogram/italic, no favicon invented.
2. Colours only via tokens in `globals.css` (Burgundy/Ivory/Ink/White/Muted). Serif headings,
   sans-serif body/navigation/forms. No navy/gold.
3. All facts in `src/content/*` with status confirmed/draft/missing; missing = `null`. Never invent
   addresses, numbers, hours, prices, reviews, roles, looks, fabrics or service promises.
4. Every visible text in all five locale files (en, de, th, fr, it); `en.ts` defines the shape.
5. No anniversary claims, superlatives, «bespoke/handmade» or time guarantees, no Mr. Moss.
6. Form success only after the delivery service accepted; demo mode must say «not sent».
7. Preview stays noindex. No third-party trackers or embeds.
8. Before committing: lint, typecheck, unit tests, build; after UI changes also e2e + screenshots.
