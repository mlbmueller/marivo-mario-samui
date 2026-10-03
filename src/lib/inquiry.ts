/**
 * Inquiry (appointment request) model and validation.
 * Shared by the browser form and the API route, so both apply the same rules.
 * Dates are plain local calendar dates (YYYY-MM-DD) and are compared against
 * "today" in Asia/Bangkok — never converted through the browser's time zone.
 *
 * Form v2: three groups — request (one interest field, optional look reference),
 * stay (dates or "still open", store, optional suggested date), contact.
 */
import { interests, type Interest } from '@/content/services';
import { storeIds } from '@/content/stores';
import { looks } from '@/content/looks';
import { locales } from '@/content/locales/config';

export const BUSINESS_TIME_ZONE = 'Asia/Bangkok';

export const contactMethods = ['email', 'whatsapp', 'phone'] as const;
export const requestTypes = ['inquiry', 'reorder'] as const;
export const storeOptions = [...storeIds, 'no-preference'] as const;
export { interests };

export type ContactMethod = (typeof contactMethods)[number];
export type RequestType = (typeof requestTypes)[number];

export type InquiryInput = {
  type: RequestType;
  interest: Interest | '';
  /** Stable look id from src/content/looks.ts, or '' */
  look: string;
  arrival: string;
  departure: string;
  datesOpen: boolean;
  store: string;
  suggestDate: boolean;
  preferredDate: string;
  name: string;
  contactMethod: ContactMethod;
  contactValue: string;
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
  | 'bothDates'
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

export const emptyInquiry = (locale = 'en', type: RequestType = 'inquiry'): InquiryInput => ({
  type,
  interest: '',
  look: '',
  arrival: '',
  departure: '',
  datesOpen: false,
  store: 'no-preference',
  suggestDate: false,
  preferredDate: '',
  name: '',
  contactMethod: 'email',
  contactValue: '',
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
const oneOf = <T extends string>(v: string, allowed: readonly T[], fallback: T): T => ((allowed as readonly string[]).includes(v) ? (v as T) : fallback);

/**
 * Remove values the customer cannot see: dates when "still open" is ticked, the suggested
 * date when the toggle is off. Applied before sending (client) and after receiving (server).
 */
export function stripHidden(input: InquiryInput): InquiryInput {
  return {
    ...input,
    arrival: input.datesOpen ? '' : input.arrival,
    departure: input.datesOpen ? '' : input.departure,
    preferredDate: input.suggestDate ? input.preferredDate : '',
  };
}

/** Coerce untrusted JSON into the input shape (unknown keys are dropped). */
export function normaliseInquiry(raw: unknown): InquiryInput {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return stripHidden({
    type: oneOf(str(r.type), requestTypes, 'inquiry'),
    interest: str(r.interest) as Interest | '',
    look: str(r.look),
    arrival: str(r.arrival),
    departure: str(r.departure),
    datesOpen: r.datesOpen === true,
    store: str(r.store) || 'no-preference',
    suggestDate: r.suggestDate === true,
    preferredDate: str(r.preferredDate),
    name: str(r.name),
    contactMethod: oneOf(str(r.contactMethod), contactMethods, 'email'),
    contactValue: str(r.contactValue),
    message: typeof r.message === 'string' ? r.message.trim() : '',
    locale: oneOf(str(r.locale), locales, 'en'),
    website: str(r.website),
  });
}

export function validateInquiry(raw: InquiryInput, today: string = todayInBangkok()): FieldErrors {
  const input = stripHidden(raw);
  const errors: FieldErrors = {};

  // Group 1 — request
  if (!input.interest) errors.interest = 'required';
  else if (!(interests as readonly string[]).includes(input.interest)) errors.interest = 'invalidOption';
  if (input.look && !looks.some((l) => l.id === input.look)) errors.look = 'invalidOption';

  // Group 2 — stay. Ongoing stays (arrival in the past) are fine; departure may not be past.
  const { arrival, departure } = input;
  if (arrival && !isValidDate(arrival)) errors.arrival = 'invalidDate';
  if (departure && !isValidDate(departure)) errors.departure = 'invalidDate';
  if (!input.datesOpen && (arrival || departure)) {
    if (!arrival) errors.arrival = 'bothDates';
    if (!departure) errors.departure = 'bothDates';
  }
  if (!errors.departure && departure && departure < today) errors.departure = 'dateInPast';
  if (!errors.arrival && !errors.departure && arrival && departure && departure < arrival) {
    errors.departure = 'departureBeforeArrival';
  }
  if (!(storeOptions as readonly string[]).includes(input.store)) errors.store = 'invalidOption';

  if (input.suggestDate) {
    if (!input.preferredDate) errors.preferredDate = 'required';
    else if (!isValidDate(input.preferredDate)) errors.preferredDate = 'invalidDate';
    else if (input.preferredDate < today) errors.preferredDate = 'dateInPast';
    else if (
      (arrival && isValidDate(arrival) && input.preferredDate < arrival) ||
      (departure && isValidDate(departure) && input.preferredDate > departure)
    ) {
      errors.preferredDate = 'outsideStay';
    }
  }

  // Group 3 — contact
  if (!input.name) errors.name = 'required';
  else if (input.name.length > LIMITS.name) errors.name = 'tooLong';

  if (!input.contactValue) errors.contactValue = 'required';
  else if (input.contactValue.length > LIMITS.contactValue) errors.contactValue = 'tooLong';
  else if (input.contactMethod === 'email' && !EMAIL.test(input.contactValue)) errors.contactValue = 'invalidEmail';
  else if (input.contactMethod !== 'email' && !isValidPhone(input.contactValue)) errors.contactValue = 'invalidPhone';

  if (input.message.length > LIMITS.message) errors.message = 'tooLong';

  return errors;
}

export const hasErrors = (errors: FieldErrors) => Object.keys(errors).length > 0;

/** API response contract between the form and /api/inquiry. */
export type InquiryResponse =
  | { ok: true; outcome: 'accepted' | 'demo' }
  | { ok: false; error: 'validation'; fields: FieldErrors }
  | { ok: false; error: 'rate-limited' | 'unavailable' | 'failed' | 'forbidden' | 'too-large' | 'bad-request' };
