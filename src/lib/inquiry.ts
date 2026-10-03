/**
 * Inquiry (appointment request) model and validation.
 * Shared by the browser form and the API route, so both apply the same rules.
 * Dates are plain local calendar dates (YYYY-MM-DD) and are compared against
 * "today" in Asia/Bangkok — never converted through the browser's time zone.
 */
import { categoryIds } from '@/content/services';
import { storeIds } from '@/content/stores';
import { locales } from '@/content/locales/config';

export const BUSINESS_TIME_ZONE = 'Asia/Bangkok';

export const contactMethods = ['email', 'whatsapp', 'phone'] as const;
export const concerns = ['consultation', 'wedding', 'reorder', 'question'] as const;
export const productOptions = [...categoryIds, 'unsure'] as const;
export const storeOptions = [...storeIds, 'no-preference'] as const;

export type ContactMethod = (typeof contactMethods)[number];
export type Concern = (typeof concerns)[number];

export type InquiryInput = {
  name: string;
  contactMethod: ContactMethod;
  contactValue: string;
  concern: Concern | '';
  product: string;
  store: string;
  arrival: string;
  departure: string;
  datesOpen: boolean;
  preferredDate: string;
  message: string;
  /** Language the customer used — replies should be in that language. */
  locale: string;
  /** Honeypot. Must stay empty. */
  website: string;
};

export type ErrorCode =
  | 'required'
  | 'tooLong'
  | 'invalidEmail'
  | 'invalidPhone'
  | 'invalidOption'
  | 'invalidDate'
  | 'departureBeforeArrival'
  | 'dateInPast'
  | 'outsideStay';

export type FieldErrors = Partial<Record<keyof InquiryInput, ErrorCode>>;

export const LIMITS = {
  name: 100,
  contactValue: 120,
  message: 2000,
  /** Maximum accepted request body in bytes. */
  body: 16 * 1024,
} as const;

export const emptyInquiry = (locale = 'en'): InquiryInput => ({
  name: '',
  contactMethod: 'email',
  contactValue: '',
  concern: '',
  product: 'unsure',
  store: 'no-preference',
  arrival: '',
  departure: '',
  datesOpen: false,
  preferredDate: '',
  message: '',
  locale,
  website: '',
});

/** Today's calendar date on Koh Samui as YYYY-MM-DD. */
export function todayInBangkok(now: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** Strict YYYY-MM-DD check including real calendar days (no 2026-02-30). */
export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number) as [number, number, number];
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidPhone(value: string): boolean {
  if (!/^\+?[\d\s()./-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Coerce untrusted JSON into the input shape (unknown keys are dropped). */
export function normaliseInquiry(raw: unknown): InquiryInput {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const method = str(r.contactMethod);
  return {
    name: str(r.name),
    contactMethod: (contactMethods as readonly string[]).includes(method) ? (method as ContactMethod) : 'email',
    contactValue: str(r.contactValue),
    concern: str(r.concern) as Concern | '',
    product: str(r.product) || 'unsure',
    store: str(r.store) || 'no-preference',
    arrival: str(r.arrival),
    departure: str(r.departure),
    datesOpen: r.datesOpen === true,
    preferredDate: str(r.preferredDate),
    message: typeof r.message === 'string' ? r.message.trim() : '',
    locale: (locales as readonly string[]).includes(str(r.locale)) ? str(r.locale) : 'en',
    website: str(r.website),
  };
}

export function validateInquiry(input: InquiryInput, today: string = todayInBangkok()): FieldErrors {
  const errors: FieldErrors = {};

  if (!input.name) errors.name = 'required';
  else if (input.name.length > LIMITS.name) errors.name = 'tooLong';

  if (!input.contactValue) errors.contactValue = 'required';
  else if (input.contactValue.length > LIMITS.contactValue) errors.contactValue = 'tooLong';
  else if (input.contactMethod === 'email' && !EMAIL.test(input.contactValue)) errors.contactValue = 'invalidEmail';
  else if (input.contactMethod !== 'email' && !isValidPhone(input.contactValue)) errors.contactValue = 'invalidPhone';

  if (!input.concern) errors.concern = 'required';
  else if (!(concerns as readonly string[]).includes(input.concern)) errors.concern = 'invalidOption';

  if (!(productOptions as readonly string[]).includes(input.product)) errors.product = 'invalidOption';
  if (!(storeOptions as readonly string[]).includes(input.store)) errors.store = 'invalidOption';

  if (input.message.length > LIMITS.message) errors.message = 'tooLong';

  // Travel dates are ignored when the customer says they are still open.
  const arrival = input.datesOpen ? '' : input.arrival;
  const departure = input.datesOpen ? '' : input.departure;
  if (arrival && !isValidDate(arrival)) errors.arrival = 'invalidDate';
  if (departure && !isValidDate(departure)) errors.departure = 'invalidDate';
  if (!errors.departure && departure && departure < today) errors.departure = 'dateInPast';
  if (!errors.arrival && !errors.departure && arrival && departure && departure < arrival) {
    errors.departure = 'departureBeforeArrival';
  }

  if (input.preferredDate) {
    if (!isValidDate(input.preferredDate)) errors.preferredDate = 'invalidDate';
    else if (input.preferredDate < today) errors.preferredDate = 'dateInPast';
    else if (
      (arrival && isValidDate(arrival) && input.preferredDate < arrival) ||
      (departure && isValidDate(departure) && input.preferredDate > departure)
    ) {
      errors.preferredDate = 'outsideStay';
    }
  }

  return errors;
}

export const hasErrors = (errors: FieldErrors) => Object.keys(errors).length > 0;

/** API response contract between the form and /api/inquiry. */
export type InquiryResponse =
  | { ok: true; outcome: 'accepted' | 'demo' }
  | { ok: false; error: 'validation'; fields: FieldErrors }
  | { ok: false; error: 'rate-limited' | 'unavailable' | 'failed' | 'forbidden' | 'too-large' | 'bad-request' };
