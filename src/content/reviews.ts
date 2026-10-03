/**
 * Customer quotes. Only real quotes with documented approval from the customer.
 * While this list is empty, the testimonials section is not rendered at all —
 * in preview and in production. No ratings, star counts or combined scores.
 */
export type Review = {
  quote: string;
  /** As approved by the customer, e.g. first name + country. */
  attribution: string;
  /** Language of the original quote. Quotes are shown in the original, not translated. */
  lang: string;
  store: 'chaweng' | 'fishermans-village' | null;
  approvedOn: string;
};

export const reviews: Review[] = [];
