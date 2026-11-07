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
  // look-07 … look-34: customer and mannequin photos from SharePoint, approved 7 Nov 2026
  { id: 'look-07', category: 'men', image: 'look-07', details: [], status: 'confirmed' },
  { id: 'look-08', category: 'women', image: 'look-08', details: [], status: 'confirmed' },
  { id: 'look-09', category: 'weddings', image: 'look-09', details: [], status: 'confirmed' },
  { id: 'look-10', category: 'men', image: 'look-10', details: [], status: 'confirmed' },
  { id: 'look-11', category: 'linen-holiday', image: 'look-11', details: [], status: 'confirmed' },
  { id: 'look-12', category: 'linen-holiday', image: 'look-12', details: [], status: 'confirmed' },
  { id: 'look-13', category: 'men', image: 'look-13', details: [], status: 'confirmed' },
  { id: 'look-14', category: 'linen-holiday', image: 'look-14', details: [], status: 'confirmed' },
  { id: 'look-15', category: 'women', image: 'look-15', details: [], status: 'confirmed' },
  { id: 'look-16', category: 'weddings', image: 'look-16', details: [], status: 'confirmed' },
  { id: 'look-17', category: 'linen-holiday', image: 'look-17', details: [], status: 'confirmed' },
  { id: 'look-18', category: 'men', image: 'look-18', details: [], status: 'confirmed' },
  { id: 'look-19', category: 'women', image: 'look-19', details: [], status: 'confirmed' },
  { id: 'look-20', category: 'women', image: 'look-20', details: [], status: 'confirmed' },
  { id: 'look-21', category: 'men', image: 'look-21', details: [], status: 'confirmed' },
  { id: 'look-22', category: 'women', image: 'look-22', details: [], status: 'confirmed' },
  { id: 'look-23', category: 'men', image: 'look-23', details: [], status: 'confirmed' },
  { id: 'look-24', category: 'women', image: 'look-24', details: [], status: 'confirmed' },
  { id: 'look-25', category: 'linen-holiday', image: 'look-25', details: [], status: 'confirmed' },
  { id: 'look-26', category: 'men', image: 'look-26', details: [], status: 'confirmed' },
  { id: 'look-27', category: 'men', image: 'look-27', details: [], status: 'confirmed' },
  { id: 'look-28', category: 'women', image: 'look-28', details: [], status: 'confirmed' },
  { id: 'look-29', category: 'women', image: 'look-29', details: [], status: 'confirmed' },
  { id: 'look-30', category: 'men', image: 'look-30', details: [], status: 'confirmed' },
  { id: 'look-31', category: 'linen-holiday', image: 'look-31', details: [], status: 'confirmed' },
  { id: 'look-32', category: 'men', image: 'look-32', details: [], status: 'confirmed' },
  { id: 'look-33', category: 'women', image: 'look-33', details: [], status: 'confirmed' },
  { id: 'look-34', category: 'women', image: 'look-34', details: [], status: 'confirmed' },
];

export type LookId = (typeof looks)[number]['id'];

export const findLook = (id: string | null | undefined) => (id ? looks.find((l) => l.id === id) : undefined);

/** Minimum number of approved looks for the public launch (briefing: six). */
export const REQUIRED_LOOKS = 6;
