import en, { type Dictionary } from './en';
import de from './de';
import th from './th';
import fr from './fr';
import it from './it';
import type { Locale } from './config';

export * from './config';

export const dictionaries: Record<Locale, Dictionary> = { en, de, th, fr, it };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

export type { Dictionary };
