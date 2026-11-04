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
 * The six looks below are customer photos supplied by the owner (4 Nov 2026). Titles only
 * describe what is visible; occasion and fabric stay empty until the owner confirms them.
 * In production, only looks with status "confirmed" and an approved image are shown.
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
  { id: 'look-01', category: 'men', image: 'look-01', details: [], status: 'confirmed' },
  { id: 'look-02', category: 'linen-holiday', image: 'look-02', details: [], status: 'confirmed' },
  { id: 'look-03', category: 'women', image: 'look-03', details: [], status: 'confirmed' },
  { id: 'look-04', category: 'weddings', image: 'look-04', details: [], status: 'confirmed' },
  { id: 'look-05', category: 'men', image: 'look-05', details: [], status: 'confirmed' },
  { id: 'look-06', category: 'women', image: 'look-06', details: [], status: 'confirmed' },
];

export type LookId = (typeof looks)[number]['id'];

export const findLook = (id: string | null | undefined) => (id ? looks.find((l) => l.id === id) : undefined);

/** Minimum number of approved looks for the public launch (briefing: six). */
export const REQUIRED_LOOKS = 6;
