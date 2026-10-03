# Asset checklist

All images are registered in `src/content/media.ts` with description, size, source and
rights status. Alt texts are in every locale file under `media.*`.
While `src` is `null`, preview shows a labelled placeholder with the target aspect ratio;
production renders nothing in its place. No stock photos of strangers presented as Mario,
James or customers, no AI-generated faces, nothing copied from other websites.

## Required photos

| Id | What it must show | Format / min. size | Used on | Status | Required for launch |
| --- | --- | --- | --- | --- | --- |
| `hero-fitting` | authentic consultation or fitting in one of the stores | landscape 3:2, ≥ 2400 × 1600 | home hero | placeholder | **yes** |
| `portrait-mario` | Mario, upper body, natural light | portrait 4:5, ≥ 1200 × 1500 | home, team | placeholder | **yes** |
| `portrait-james` | James, same style as Mario | portrait 4:5 | team | placeholder | no |
| `team-group` | the team together | landscape 3:2 | team | placeholder | no |
| `store-chaweng-exterior` | Chaweng facade with current signage | 4:3 | home, stores, store page | placeholder | recommended |
| `store-chaweng-interior` | Chaweng interior with fabrics | 4:3 | store page | placeholder | no |
| `store-fishermans-village-exterior` | Fisherman’s Village facade with current signage | 4:3 | home, stores, store page | placeholder | recommended |
| `store-fishermans-village-interior` | Fisherman’s Village interior | 4:3 | store page | placeholder | no |
| `category-men` | finished men’s garment worn by a customer (consent) | 4:5 | home, tailoring, men | placeholder | if category is published |
| `category-women` | finished women’s garment worn by a customer (consent) | 4:5 | home, tailoring, women | placeholder | if category is published |
| `category-weddings` | wedding outfit or groomsmen group (consent) | 4:5 | home, tailoring, weddings | placeholder | if category is published |
| `detail-fabrics` | close-up of fabric swatches | 4:3 | craftsmanship | placeholder | no |
| `detail-measuring` | measuring (hands, tape) | 4:3 | craftsmanship | placeholder | no |
| `detail-finish` | finished detail: lapel, buttonhole, lining | 4:3 | craftsmanship, work | placeholder | no |
| work examples | real finished garments, full body and details | 3:4 | our work, home | none | page hidden while empty |

## For every delivered photo

- [ ] File optimised (JPEG/WebP, long edge ≤ 2400 px, < 600 KB), stored in `public/images/`
- [ ] `src`, `width`, `height` set to the real file dimensions
- [ ] `source` filled in (photographer / owner, year)
- [ ] usage rights documented (who may use it where, for how long)
- [ ] consent of every recognisable person, in writing
- [ ] `rights: 'approved'`
- [ ] alt text checked in all languages (`media.<id>` in the locale files)

## Logo

| Asset | Status |
| --- | --- |
| Horizontal logo (mark left, name, «by Mario») | **temporary** SVG: diamond with stitch line, `src/components/Logo.tsx` |
| Favicon | temporary, `src/app/icon.svg` |
| Social preview image (Open Graph) | not created — add once logo and hero photo are final |
