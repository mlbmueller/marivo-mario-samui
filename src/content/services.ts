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
};

export const categories: Record<CategoryId, Category> = {
  men: {
    id: 'men',
    offered: draft(true, 'Assortment not confirmed'),
    price: missing('No approved prices') as Fact<PriceInfo>,
    image: 'category-men',
  },
  women: {
    id: 'women',
    offered: draft(true, 'Assortment not confirmed'),
    price: missing('No approved prices') as Fact<PriceInfo>,
    image: 'category-women',
  },
  weddings: {
    id: 'weddings',
    offered: draft(true, 'Assortment and group handling not confirmed'),
    price: missing('No approved prices') as Fact<PriceInfo>,
    image: 'category-weddings',
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
