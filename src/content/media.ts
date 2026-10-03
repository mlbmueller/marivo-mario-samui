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
  'hero-fitting': placeholder('hero-fitting', 'Hero, landscape: authentic consultation or fitting in one of the stores', 1800, 1200),
  'portrait-mario': placeholder('portrait-mario', 'Portrait of Mario (owner), upper body, natural light', 1200, 1500),
  'portrait-james': placeholder('portrait-james', 'Portrait of James, same style as Mario’s portrait', 1200, 1500),
  'team-group': placeholder('team-group', 'Group photo of the team, landscape', 1800, 1200),
  'store-chaweng-exterior': placeholder('store-chaweng-exterior', 'Chaweng store: facade with current signage', 1600, 1200),
  'store-chaweng-interior': placeholder('store-chaweng-interior', 'Chaweng store: interior with fabrics', 1600, 1200),
  'store-fishermans-village-exterior': placeholder('store-fishermans-village-exterior', 'Fisherman’s Village store: facade with current signage', 1600, 1200),
  'store-fishermans-village-interior': placeholder('store-fishermans-village-interior', 'Fisherman’s Village store: interior with fabrics', 1600, 1200),
  'category-men': placeholder('category-men', 'Finished men’s garment worn by a customer (with consent), full body', 1200, 1500),
  'category-women': placeholder('category-women', 'Finished women’s garment worn by a customer (with consent), full body', 1200, 1500),
  'category-weddings': placeholder('category-weddings', 'Wedding outfit or group of groomsmen (with consent)', 1200, 1500),
  'detail-fabrics': placeholder('detail-fabrics', 'Close-up of fabric swatches in the store', 1600, 1200),
  'detail-measuring': placeholder('detail-measuring', 'Measuring a customer (hands, tape), no face needed', 1600, 1200),
  'detail-finish': placeholder('detail-finish', 'Close-up of a finished detail: lapel, buttonhole, lining', 1600, 1200),
} satisfies Record<string, MediaAsset>;

export type MediaId = keyof typeof media;

/**
 * Finished work examples for /our-work. Empty until real, approved photos exist —
 * the page and the home page section are hidden in production while empty.
 */
export const workExamples: { image: MediaId; category: 'men' | 'women' | 'weddings' }[] = [];

/** Placeholders shown in preview so layout and cropping can be reviewed. */
export const workPlaceholders: MediaId[] = ['category-men', 'detail-finish', 'category-women', 'category-weddings'];
