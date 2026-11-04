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
  'intro-poster': {
    id: 'intro-poster',
    description: 'Still from the store video: suits and fabric shelves in the store',
    width: 1920,
    height: 1080,
    src: '/images/intro-poster.webp',
    source: 'Frame from the owner’s store video, 4 Nov 2026',
    rights: 'approved',
  } as MediaAsset,
  'hero-outfit': placeholder('hero-outfit', 'Hero, main motif: a finished outfit worn by a real customer or model (with consent), full body, bright atelier or island setting', 1600, 2000),
  'hero-consultation': {
    id: 'hero-consultation',
    description: 'Mario at a fitting with a customer (pinned waistcoat), in the store',
    width: 791,
    height: 861,
    src: '/images/hero-consultation.webp',
    source: 'Supplied by the owner, 4 Oct 2026 — customer consent confirmed by the owner',
    rights: 'approved',
    focus: '50% 25%',
  } as MediaAsset,
  'portrait-mario': {
    id: 'portrait-mario',
    description: 'Mario in a navy pinstripe suit, full length, in the store',
    width: 1086,
    height: 1448,
    src: '/images/portrait-mario.webp',
    source: 'Supplied by the owner, 4 Nov 2026',
    rights: 'approved',
    focus: '50% 0%',
  } as MediaAsset,
  'portrait-james': {
    id: 'portrait-james',
    description: 'James in a navy double-breasted pinstripe jacket, full length, in the store',
    width: 1086,
    height: 1448,
    src: '/images/portrait-james.webp',
    source: 'Supplied by the owner, 4 Nov 2026',
    rights: 'approved',
    focus: '50% 20%',
  } as MediaAsset,
  'team-group': {
    id: 'team-group',
    description: 'Mario and James measuring a customer in the store',
    width: 802,
    height: 794,
    src: '/images/team-group.webp',
    source: 'Supplied by the owner, 4 Oct 2026 — customer consent confirmed by the owner',
    rights: 'approved',
    focus: '50% 30%',
  } as MediaAsset,
  'store-chaweng-exterior': {
    id: 'store-chaweng-exterior',
    description: 'Chaweng store: facade with current signage (NICKY FASHION), evening',
    width: 1448,
    height: 1086,
    src: '/images/store-chaweng-exterior.webp',
    source: 'Supplied by the owner, 4 Nov 2026 (replaces the daytime photo of 3 Oct 2026)',
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
  'category-men': {
    id: 'category-men',
    description: 'Style world Suits: Mario presenting a tailored checked jacket',
    width: 1086,
    height: 1448,
    src: '/images/category-men.webp',
    source: 'Supplied by the owner, 4 Nov 2026',
    rights: 'approved',
    focus: '55% 30%',
  } as MediaAsset,
  'category-linen-holiday': {
    id: 'category-linen-holiday',
    description: 'Style world Linen & Holiday: light beige summer suit',
    width: 941,
    height: 1672,
    src: '/images/category-linen-holiday.webp',
    source: 'Supplied by the owner, 4 Nov 2026 (customer photo; use approved by the owner)',
    rights: 'approved',
    focus: '50% 20%',
  } as MediaAsset,
  'category-women': {
    id: 'category-women',
    description: 'Style world Women: green three-piece trouser suit',
    width: 1086,
    height: 1448,
    src: '/images/category-women.webp',
    source: 'Supplied by the owner, 4 Nov 2026 (customer photo; use approved by the owner)',
    rights: 'approved',
    focus: '50% 20%',
  } as MediaAsset,
  'category-weddings': {
    id: 'category-weddings',
    description: 'Style world Weddings: brown three-piece suit with bow tie',
    width: 1086,
    height: 1448,
    src: '/images/category-weddings.webp',
    source: 'Supplied by the owner, 4 Nov 2026 (customer photo; use approved by the owner)',
    rights: 'approved',
    focus: '50% 20%',
  } as MediaAsset,
  'detail-fabrics': {
    id: 'detail-fabrics',
    description: 'James writing up an order with fabric swatches',
    width: 1086,
    height: 1448,
    src: '/images/detail-fabrics.webp',
    source: 'Supplied by the owner, 4 Nov 2026',
    rights: 'approved',
    focus: '55% 35%',
  } as MediaAsset,
  'detail-measuring': {
    id: 'detail-measuring',
    description: 'James taking measurements of a customer in the store',
    width: 743,
    height: 929,
    src: '/images/detail-measuring.webp',
    source: 'Supplied by the owner, 4 Oct 2026 — customer consent confirmed by the owner',
    rights: 'approved',
    focus: '50% 35%',
  } as MediaAsset,
  'detail-finish': placeholder('detail-finish', 'Close-up of a finished detail: lapel, buttonhole, lining', 1600, 1200),
  'look-01': {
    id: 'look-01',
    description: 'Royal blue three-piece suit with peak lapels',
    width: 1086,
    height: 1448,
    src: '/images/look-01.webp',
    source: 'Supplied by the owner, 4 Nov 2026 (customer photo; use approved by the owner)',
    rights: 'approved',
    focus: '50% 20%',
  } as MediaAsset,
  'look-02': {
    id: 'look-02',
    description: 'Light linen jacket with paisley lining, pink shirt',
    width: 853,
    height: 1844,
    src: '/images/look-02.webp',
    source: 'Supplied by the owner, 4 Nov 2026 (customer photo; use approved by the owner)',
    rights: 'approved',
    focus: '50% 25%',
  } as MediaAsset,
  'look-03': {
    id: 'look-03',
    description: 'Ivory sheath dress with navy waist bands',
    width: 1086,
    height: 1448,
    src: '/images/look-03.webp',
    source: 'Supplied by the owner, 4 Nov 2026 (customer photo; use approved by the owner)',
    rights: 'approved',
    focus: '50% 20%',
  } as MediaAsset,
  'look-04': {
    id: 'look-04',
    description: 'Black double-breasted dinner jacket with satin shawl lapels',
    width: 1086,
    height: 1448,
    src: '/images/look-04.webp',
    source: 'Supplied by the owner, 4 Nov 2026 (customer photo; use approved by the owner)',
    rights: 'approved',
    focus: '50% 20%',
  } as MediaAsset,
  'look-05': {
    id: 'look-05',
    description: 'Charcoal double-breasted pinstripe suit',
    width: 1086,
    height: 1448,
    src: '/images/look-05.webp',
    source: 'Supplied by the owner, 4 Nov 2026 (customer photo; use approved by the owner)',
    rights: 'approved',
    focus: '50% 20%',
  } as MediaAsset,
  'look-06': {
    id: 'look-06',
    description: 'Purple brocade cheongsam dress',
    width: 1086,
    height: 1448,
    src: '/images/look-06.webp',
    source: 'Supplied by the owner, 4 Nov 2026 (customer photo; use approved by the owner)',
    rights: 'approved',
    focus: '50% 20%',
  } as MediaAsset,
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

/** Whether an approved photo exists for this slot (otherwise production renders nothing there). */
export const hasPhoto = (id: MediaId): boolean => media[id].rights === 'approved' && !!media[id].src;
