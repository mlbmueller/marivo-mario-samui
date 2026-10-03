/**
 * Image register. Every asset has a description, an alt text (in the locale files under
 * `media.<id>`), its origin and its approval status. While `src` is null a labelled
 * placeholder with the correct aspect ratio is rendered (preview only).
 *
 * To add a real photo: put the optimised file in /public/images/, set `src`, `width`,
 * `height`, `source` and `rights: 'approved'`. Keep ASSET_CHECKLIST.md in sync.
 */
export type MediaRights = 'approved' | 'pending' | 'missing';

export type MediaAsset = {
  id: string;
  /** Internal description of what the photo must show. */
  description: string;
  /** Intrinsic size (or placeholder ratio) — prevents layout shift. */
  width: number;
  height: number;
  src: string | null;
  /** Photographer / origin of the file. */
  source: string | null;
  rights: MediaRights;
  /** Focal point for cropping (CSS object-position), e.g. '50% 30%'. Default: centre. */
  focus?: string;
  /** Optional separate crop for phones (e.g. a 4:3 version of the full-length hero). */
  mobileSrc?: string | null;
};

const placeholder = (id: string, description: string, width: number, height: number): MediaAsset => ({
  id,
  description,
  width,
  height,
  src: null,
  source: null,
  rights: 'missing',
});

export const media = {
  'hero-outfit': placeholder('hero-outfit', 'Hero, main motif: a finished outfit worn by a real customer or model (with consent), full body, bright atelier or island setting', 1600, 2000),
  'hero-consultation': placeholder('hero-consultation', 'Hero, supporting motif: personal consultation or fitting in the store', 1600, 1200),
  'portrait-mario': placeholder('portrait-mario', 'Portrait of Mario (owner) or Mario advising a customer, natural light', 1200, 1500),
  'portrait-james': placeholder('portrait-james', 'Portrait of James, same style as Mario’s portrait', 1200, 1500),
  'team-group': placeholder('team-group', 'Group photo of the team, landscape', 1800, 1200),
  'store-chaweng-exterior': {
    id: 'store-chaweng-exterior',
    description: 'Chaweng store: facade with current signage (NICKY FASHION)',
    width: 1448,
    height: 1086,
    src: '/images/store-chaweng-exterior.webp',
    source: 'Supplied by the owner, 3 Oct 2026',
    rights: 'approved',
  } as MediaAsset,
  'store-chaweng-interior': placeholder('store-chaweng-interior', 'Chaweng store: interior with fabrics', 1600, 1200),
  /** Current signage (until the rename in 2027) still reads «Samui Armani» — owner decision, 3 Oct 2026. */
  'store-fishermans-village-exterior': {
    id: 'store-fishermans-village-exterior',
    description: 'Fisherman’s Village store: facade with current signage (Samui Armani, until the rename)',
    width: 1448,
    height: 1086,
    src: '/images/store-fishermans-village-exterior.webp',
    source: 'Supplied by the owner, 3 Oct 2026 (edited by the owner)',
    rights: 'approved',
  } as MediaAsset,
  /** Facade after the rename (2027). Edited visual supplied by the owner; shown only once brand.transition.active is true. */
  'store-fishermans-village-exterior-renamed': {
    id: 'store-fishermans-village-exterior-renamed',
    description: 'Fisherman’s Village store: facade with NICKY FASHION signage (after the rename)',
    width: 1448,
    height: 1086,
    src: '/images/store-fishermans-village-exterior-renamed.webp',
    source: 'Edited visual supplied by the owner, 3 Oct 2026',
    rights: 'approved',
  } as MediaAsset,
  'store-fishermans-village-interior': placeholder('store-fishermans-village-interior', 'Fisherman’s Village store: interior with fabrics', 1600, 1200),
  'category-men': placeholder('category-men', 'Style world Suits: finished suit worn by a customer (with consent), full body', 1200, 1500),
  'category-linen-holiday': placeholder('category-linen-holiday', 'Style world Linen & Holiday: linen shirt/suit in a light island setting (with consent)', 1200, 1500),
  'category-women': placeholder('category-women', 'Style world Women: finished women’s outfit worn by a customer (with consent), full body', 1200, 1500),
  'category-weddings': placeholder('category-weddings', 'Style world Weddings: wedding outfit or groomsmen group (with consent)', 1200, 1500),
  'detail-fabrics': placeholder('detail-fabrics', 'Close-up of fabric swatches in the store', 1600, 1200),
  'detail-measuring': placeholder('detail-measuring', 'Measuring a customer (hands, tape), no face needed', 1600, 1200),
  'detail-finish': placeholder('detail-finish', 'Close-up of a finished detail: lapel, buttonhole, lining', 1600, 1200),
  'look-01': placeholder('look-01', 'Look slot 1 — real finished work, complete outfit', 1200, 1600),
  'look-02': placeholder('look-02', 'Look slot 2 — real finished work, complete outfit', 1200, 1600),
  'look-03': placeholder('look-03', 'Look slot 3 — real finished work, complete outfit', 1200, 1600),
  'look-04': placeholder('look-04', 'Look slot 4 — real finished work, complete outfit', 1200, 1600),
  'look-05': placeholder('look-05', 'Look slot 5 — real finished work, complete outfit', 1200, 1600),
  'look-06': placeholder('look-06', 'Look slot 6 — real finished work, complete outfit', 1200, 1600),
} satisfies Record<string, MediaAsset>;

export type MediaId = keyof typeof media;

/**
 * Optional atelier film (20–30 s). Played only on demand, with poster and controls,
 * never with automatic sound. Not rendered while `src` is null.
 */
export const atelierFilm: { src: string | null; poster: MediaId; captions: string | null; rights: MediaRights } = {
  src: null,
  poster: 'portrait-mario',
  captions: null,
  rights: 'missing',
};
