import { describe, expect, it } from 'vitest';
import { emptyInquiry, isValidDate, normaliseInquiry, todayInBangkok, validateInquiry, type InquiryInput } from './inquiry';

const TODAY = '2026-10-03';

const valid = (overrides: Partial<InquiryInput> = {}): InquiryInput => ({
  ...emptyInquiry('en'),
  name: 'Alex Example',
  contactMethod: 'email',
  contactValue: 'alex@example.com',
  concern: 'consultation',
  ...overrides,
});

describe('validateInquiry', () => {
  it('accepts a minimal valid request (name, matching contact, concern)', () => {
    expect(validateInquiry(valid(), TODAY)).toEqual({});
  });

  it('requires name, contact value and concern', () => {
    const errors = validateInquiry(emptyInquiry('en'), TODAY);
    expect(errors).toMatchObject({ name: 'required', contactValue: 'required', concern: 'required' });
  });

  it('checks the contact value against the chosen contact method', () => {
    expect(validateInquiry(valid({ contactValue: 'not-an-email' }), TODAY).contactValue).toBe('invalidEmail');
    expect(validateInquiry(valid({ contactMethod: 'whatsapp', contactValue: 'abc' }), TODAY).contactValue).toBe('invalidPhone');
    expect(validateInquiry(valid({ contactMethod: 'whatsapp', contactValue: '+66 81 234 5678' }), TODAY)).toEqual({});
    expect(validateInquiry(valid({ contactMethod: 'phone', contactValue: '+41 79 123 45 67' }), TODAY)).toEqual({});
  });

  it('rejects departure before arrival', () => {
    const errors = validateInquiry(valid({ arrival: '2026-11-10', departure: '2026-11-05' }), TODAY);
    expect(errors.departure).toBe('departureBeforeArrival');
  });

  it('accepts same-day arrival and departure', () => {
    expect(validateInquiry(valid({ arrival: '2026-11-10', departure: '2026-11-10' }), TODAY)).toEqual({});
  });

  it('rejects a preferred date in the past (Bangkok calendar)', () => {
    expect(validateInquiry(valid({ preferredDate: '2026-10-02' }), TODAY).preferredDate).toBe('dateInPast');
    expect(validateInquiry(valid({ preferredDate: TODAY }), TODAY)).toEqual({});
  });

  it('rejects a preferred date outside the stay', () => {
    const errors = validateInquiry(valid({ arrival: '2026-11-10', departure: '2026-11-20', preferredDate: '2026-11-25' }), TODAY);
    expect(errors.preferredDate).toBe('outsideStay');
  });

  it('ignores travel dates when they are marked as still open', () => {
    expect(validateInquiry(valid({ datesOpen: true, arrival: '2026-11-10', departure: '2026-11-01' }), TODAY)).toEqual({});
  });

  it('rejects impossible calendar dates', () => {
    expect(isValidDate('2026-02-30')).toBe(false);
    expect(isValidDate('2026-02-28')).toBe(true);
    expect(validateInquiry(valid({ preferredDate: '2026-13-01' }), TODAY).preferredDate).toBe('invalidDate');
  });

  it('rejects unknown options and over-long messages', () => {
    const errors = validateInquiry(valid({ product: 'socks', store: 'bangkok', message: 'x'.repeat(2001) }), TODAY);
    expect(errors).toMatchObject({ product: 'invalidOption', store: 'invalidOption', message: 'tooLong' });
  });
});

describe('todayInBangkok', () => {
  it('uses the Asia/Bangkok calendar date, not UTC or the browser zone', () => {
    // 2026-10-03 20:30 UTC is already 2026-10-04 03:30 in Bangkok (UTC+7).
    expect(todayInBangkok(new Date('2026-10-03T20:30:00Z'))).toBe('2026-10-04');
    expect(todayInBangkok(new Date('2026-10-03T16:59:00Z'))).toBe('2026-10-03');
  });
});

describe('normaliseInquiry', () => {
  it('drops unknown keys, trims strings and falls back to safe defaults', () => {
    const n = normaliseInquiry({ name: '  Alex ', contactMethod: 'fax', locale: 'xx', evil: '<script>' });
    expect(n.name).toBe('Alex');
    expect(n.contactMethod).toBe('email');
    expect(n.locale).toBe('en');
    expect('evil' in n).toBe(false);
  });
});
