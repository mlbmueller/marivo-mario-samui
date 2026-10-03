import type { MediaId } from './media';
import { draft, missing, type CategoryId, type Fact } from './types';

export type PriceInfo = {
  /** Price in THB, e.g. "from 12000" — only once approved. */
  fromThb: number;
  scope: string;
  surcharges: string;
};

export type Category = {
  id: CategoryId;
  /**
   * Whether this category is part of the real assortment. While "draft", the category is
   * visible in preview (marked) and removed from navigation and sitemap in production.
   */
  offered: Fact<true>;
  /** Approved prices. Missing → the page leads to a personal quote. */
  price: Fact<PriceInfo>;
  image: MediaId;
  /** Matching value of the single interest field in the request form. */
  interest: Interest;
};

/**
 * One interest/concern selection in the request form (briefing v2: no second field).
 * "suits" belongs to the men's page /tailoring/men.
 */
export const interests = ['suits', 'linen-holiday', 'women', 'weddings', 'other', 'unsure'] as const;
export type Interest = (typeof interests)[number];

/** Order = order of the four style worlds on the home page. */
export const categories: Record<CategoryId, Category> = {
  men: {
    id: 'men',
    offered: draft(true, 'Assortment not confirmed'),
    price: missing('No approved prices') as Fact<PriceInfo>,
    image: 'category-men',
    interest: 'suits',
  },
  'linen-holiday': {
    id: 'linen-holiday',
    offered: draft(true, 'Linen & holiday assortment not confirmed'),
    price: missing('No approved prices') as Fact<PriceInfo>,
    image: 'category-linen-holiday',
    interest: 'linen-holiday',
  },
  women: {
    id: 'women',
    offered: draft(true, 'Assortment not confirmed'),
    price: missing('No approved prices') as Fact<PriceInfo>,
    image: 'category-women',
    interest: 'women',
  },
  weddings: {
    id: 'weddings',
    offered: draft(true, 'Assortment and group handling not confirmed'),
    price: missing('No approved prices') as Fact<PriceInfo>,
    image: 'category-weddings',
    interest: 'weddings',
  },
};

export const categoryIds = Object.keys(categories) as CategoryId[];

export const isCategoryId = (value: unknown): value is CategoryId =>
  typeof value === 'string' && (categoryIds as string[]).includes(value);

/**
 * The fitting process shown on the home page and /how-it-works.
 * Proposed by the website team — marked as draft until Mario confirms it.
 */
export const processSteps = draft(['consultation', 'measuring', 'fitting', 'handover'] as const, 'Proposed process, not confirmed by Mario');

/** Facts the FAQ and product pages must not invent. */
export const policies = {
  productionTimes: missing('Production and fitting times not confirmed') as Fact<string>,
  deposit: missing('Deposit / payment rules not confirmed') as Fact<string>,
  alterations: missing('Alteration rules not confirmed') as Fact<string>,
  shipping: missing('Shipping not confirmed') as Fact<string>,
  fabrics: missing('Fabric brands, origin and production location not confirmed') as Fact<string>,
};

/**
 * Prepared, NOT active: hotel pick-up, villa consultation, hotel delivery, shipping.
 * Nothing is shown publicly until Mario confirms conditions, area, cost and how to request.
 */
export type ExtraService = {
  id: 'hotel-pickup' | 'villa-consultation' | 'hotel-delivery' | 'shipping';
  active: Fact<true>;
  conditions: Fact<string>;
  area: Fact<string>;
  cost: Fact<string>;
  howToRequest: Fact<string>;
};

const inactive = (id: ExtraService['id']): ExtraService => ({
  id,
  active: missing('Not confirmed by Mario') as Fact<true>,
  conditions: missing() as Fact<string>,
  area: missing() as Fact<string>,
  cost: missing() as Fact<string>,
  howToRequest: missing() as Fact<string>,
});

export const extraServices: ExtraService[] = [inactive('hotel-pickup'), inactive('villa-consultation'), inactive('hotel-delivery'), inactive('shipping')];
