import en, { type Dictionary } from './en';
import de from './de';
import th from './th';
import fr from './fr';
import it from './it';
import ru from './ru';
import type { Locale } from './config';

export * from './config';

export const dictionaries: Record<Locale, Dictionary> = { en, de, fr, it, ru, th };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

export type { Dictionary };
