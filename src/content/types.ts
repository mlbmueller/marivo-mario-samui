/**
 * Every fact on the site carries a status.
 * - confirmed: approved by the owner, may be published
 * - draft:     written or proposed, visible in preview with a "Draft" marker only
 * - missing:   not known yet; value is null, never a realistic-looking substitute
 */
export type ContentStatus = 'confirmed' | 'draft' | 'missing';

export type Fact<T> =
  | { status: 'confirmed'; value: T; note?: string }
  | { status: 'draft'; value: T; note?: string }
  | { status: 'missing'; value: null; note?: string };

export const missing = (note?: string): Fact<never> => ({ status: 'missing', value: null, note });
export const draft = <T>(value: T, note?: string): Fact<T> => ({ status: 'draft', value, note });
export const confirmed = <T>(value: T, note?: string): Fact<T> => ({ status: 'confirmed', value, note });

export type StoreId = 'chaweng' | 'fishermans-village';
export type CategoryId = 'men' | 'linen-holiday' | 'women' | 'weddings';
export type TeamMemberId = 'mario' | 'james';
