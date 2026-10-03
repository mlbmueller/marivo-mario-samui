import type { MediaId } from './media';
import type { CategoryId, ContentStatus } from './types';

/**
 * Selected looks (real, approved finished work). Stable ids are used in links
 * (/contact?look=<id>), in the form and in WhatsApp messages — never change an id
 * once published.
 *
 * Texts per language live in the locale files under `looks.<id>` (title, occasion,
 * fabric). Fabric information only if actually known.
 *
 * The six entries below are EMPTY SLOTS for the preview layout: status "draft",
 * placeholder images and neutral slot titles. They contain no invented customers,
 * fabrics or occasions. In production, only looks with status "confirmed" and an
 * approved image are shown; fewer than six blocks the release.
 */
export type Look = {
  id: string;
  category: CategoryId;
  image: MediaId;
  /** Optional detail shots. */
  details: MediaId[];
  /** Occasion and fabric per language code — only when actually known. English is the fallback. */
  occasion?: Partial<Record<string, string>>;
  fabric?: Partial<Record<string, string>>;
  status: ContentStatus;
};

export const looks: Look[] = [
  { id: 'look-01', category: 'men', image: 'look-01', details: [], status: 'draft' },
  { id: 'look-02', category: 'linen-holiday', image: 'look-02', details: [], status: 'draft' },
  { id: 'look-03', category: 'women', image: 'look-03', details: [], status: 'draft' },
  { id: 'look-04', category: 'weddings', image: 'look-04', details: [], status: 'draft' },
  { id: 'look-05', category: 'men', image: 'look-05', details: [], status: 'draft' },
  { id: 'look-06', category: 'women', image: 'look-06', details: [], status: 'draft' },
];

export type LookId = (typeof looks)[number]['id'];

export const findLook = (id: string | null | undefined) => (id ? looks.find((l) => l.id === id) : undefined);

/** Minimum number of approved looks for the public launch (briefing: six). */
export const REQUIRED_LOOKS = 6;
