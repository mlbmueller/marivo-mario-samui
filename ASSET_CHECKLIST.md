# Asset checklist

Shooting list with resolutions: [docs/IMAGE_BRIEF.md](docs/IMAGE_BRIEF.md).

All images are registered in `src/content/media.ts` with description, size, source and
rights status. Alt texts are in every locale file under `media.*`.
While `src` is `null`, preview shows a labelled placeholder with the target aspect ratio.
No stock photos of strangers presented as Mario, James or customers, no AI-generated faces,
nothing copied from other websites. Central motifs (hero, looks, store facades) must be real
before launch — they are release blockers, not hidden.

## Brand assets (final package, 3 Oct 2026) — checked

| File | Status | Checked |
| --- | --- | --- |
| `public/brand/NICKY_FASHION_WEB.svg` | ✅ delivered, approved | viewBox `0 0 4000 1000`; text as outlined `<path>` (no `<text>`, no font dependency); fills `#5A1530` (line 1) and `#222222` (lines 2–3); transparent; 11 KB |
| `public/brand/NICKY_FASHION_WEB_TRIM.svg` | ⚠️ derived, **visual OK needed** | same paths byte-for-byte (content test), viewBox `381 156 3238 789` = artwork + clear space of ½ line-2 height |
| `public/brand/NICKY_FASHION_WEB.png` | ✅ delivered | 2400 × 600, RGBA, transparent; raster fallback, not used currently |
| Favicon / small format | proposals A/B in `docs/proposals/` | letter «N» from the approved artwork, unchanged; not used until approved (optional for launch) |
| Social preview image (Open Graph) | ❌ missing | create once logo and hero photo are final |
| Print files (TIFF 6.6 MB, JPG 5.6 MB, GIF 0.7 MB, PDF/SVG 4 m) | not in web project | sign production only |

## Photos

| Id | What it must show | Format | Used on | Status | Launch |
| --- | --- | --- | --- | --- | --- |
| `hero-outfit` | finished outfit on a real customer/model (consent), full body, bright setting | 4:5, ≥ 1600 × 2000 | home hero | placeholder | **required** |
| `hero-consultation` | consultation or fitting in the store | 4:3 | home hero (desktop) | placeholder | recommended |
| `portrait-mario` | Mario, portrait or advising a customer | 4:5 | home, team | placeholder | **required** |
| `portrait-james` | James, same style | 4:5 | team | placeholder | optional |
| `team-group` | team together | 3:2 | team | placeholder | optional |
| `store-chaweng-exterior` | facade with current signage | 4:3 | home, stores | ✅ supplied by owner 3 Oct 2026 (`/images/store-chaweng-exterior.webp`, 1448×1086) | **required** |
| `store-fishermans-village-exterior` | facade with current signage | 4:3 | home, stores | ✅ supplied and edited by owner 3 Oct 2026 – current «Samui Armani» signage (owner decision; legal check of third-party trademark recommended before launch) | **required** |
| `store-fishermans-village-exterior-renamed` | facade after rename (NICKY FASHION) | 4:3 | home, stores – replaces the above once `brand.transition.active` | ✅ edited visual supplied by owner 3 Oct 2026 | from rename (2027) |
| `store-*-interior` | interiors with fabrics | 4:3 | store pages | placeholder | optional |
| `category-men` (Suits) | finished suit, full body (consent) | 4:5 | style worlds, page | placeholder | required if published |
| `category-linen-holiday` | linen look, light island setting (consent) | 4:5 | style worlds, page | placeholder | required if published |
| `category-women` | finished women’s outfit (consent) | 4:5 | style worlds, page | placeholder | required if published |
| `category-weddings` | wedding outfit or groomsmen (consent) | 4:5 | style worlds, page | placeholder | required if published |
| `look-01` … `look-06` | six real finished works, complete outfit, + optional details | 3:4 | home, our work, category pages | empty slots | **required (6)** |
| `detail-fabrics`, `detail-measuring`, `detail-finish` | fabric close-up, measuring, finished detail | 4:3 | craftsmanship | placeholder | optional |
| atelier film (`atelierFilm`) | 20–30 s, manual playback, poster, captions, no autoplay sound | 16:9 | home (Mario) | missing | optional |

## For every delivered photo

- [ ] optimised (JPEG/WebP, long edge ≤ 2400 px, < 600 KB) in `public/images/`
- [ ] `src`, `width`, `height` = real file dimensions
- [ ] `source` (photographer/owner, year) and usage rights documented
- [ ] written consent of every recognisable person
- [ ] `rights: 'approved'`; for looks also `status: 'confirmed'` in `looks.ts`
- [ ] alt text checked in all languages
