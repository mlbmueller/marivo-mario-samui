import { describe, expect, it } from 'vitest';
import { emptyInquiry, isValidDate, normaliseInquiry, stripHidden, todayInBangkok, validateInquiry, type InquiryInput } from './inquiry';
import { prefillFromQuery } from '@/components/InquiryForm';

const TODAY = '2026-10-03';

const valid = (overrides: Partial<InquiryInput> = {}): InquiryInput => ({
  ...emptyInquiry('en'),
  interest: 'suits',
  name: 'Alex Example',
  contactMethod: 'email',
  contactValue: 'alex@example.com',
  ...overrides,
});

describe('validateInquiry (form v2)', () => {
  it('accepts a minimal valid request: interest, name, matching contact', () => {
    expect(validateInquiry(valid(), TODAY)).toEqual({});
  });

  it('requires interest, name and contact value — and nothing else', () => {
    const errors = validateInquiry(emptyInquiry('en'), TODAY);
    expect(errors).toEqual({ interest: 'required', name: 'required', contactValue: 'required' });
  });

  it('accepts "Not sure yet" as a valid interest', () => {
    expect(validateInquiry(valid({ interest: 'unsure' }), TODAY)).toEqual({});
  });

  it('checks the contact value against the chosen contact method', () => {
    expect(validateInquiry(valid({ contactValue: 'not-an-email' }), TODAY).contactValue).toBe('invalidEmail');
    expect(validateInquiry(valid({ contactMethod: 'whatsapp', contactValue: 'abc' }), TODAY).contactValue).toBe('invalidPhone');
    expect(validateInquiry(valid({ contactMethod: 'whatsapp', contactValue: '+66 81 234 5678' }), TODAY)).toEqual({});
  });

  it('with fixed travel dates requires both dates', () => {
    expect(validateInquiry(valid({ arrival: '2026-11-10' }), TODAY).departure).toBe('bothDates');
    expect(validateInquiry(valid({ departure: '2026-11-10' }), TODAY).arrival).toBe('bothDates');
  });

  it('rejects departure before arrival', () => {
    expect(validateInquiry(valid({ arrival: '2026-11-10', departure: '2026-11-05' }), TODAY).departure).toBe('departureBeforeArrival');
  });

  it('allows an ongoing stay (arrival in the past) but not a past departure', () => {
    expect(validateInquiry(valid({ arrival: '2026-09-28', departure: '2026-10-12' }), TODAY)).toEqual({});
    expect(validateInquiry(valid({ arrival: '2026-09-20', departure: '2026-09-30' }), TODAY).departure).toBe('dateInPast');
  });

  it('allows a request without booked travel when dates are open — hidden dates are not used', () => {
    expect(validateInquiry(valid({ datesOpen: true, arrival: '2026-11-10', departure: '2026-11-01' }), TODAY)).toEqual({});
    expect(stripHidden(valid({ datesOpen: true, arrival: '2026-11-10', departure: '2026-11-12' }))).toMatchObject({ arrival: '', departure: '' });
  });

  it('validates the suggested date only when the customer chose to suggest one', () => {
    expect(validateInquiry(valid({ suggestDate: false, preferredDate: '2020-01-01' }), TODAY)).toEqual({});
    expect(validateInquiry(valid({ suggestDate: true, preferredDate: '' }), TODAY).preferredDate).toBe('required');
    expect(validateInquiry(valid({ suggestDate: true, preferredDate: '2026-10-02' }), TODAY).preferredDate).toBe('dateInPast');
    expect(validateInquiry(valid({ suggestDate: true, preferredDate: TODAY }), TODAY)).toEqual({});
    expect(stripHidden(valid({ suggestDate: false, preferredDate: '2026-12-01' })).preferredDate).toBe('');
  });

  it('rejects a suggested date outside the stay', () => {
    const errors = validateInquiry(valid({ arrival: '2026-11-10', departure: '2026-11-20', suggestDate: true, preferredDate: '2026-11-25' }), TODAY);
    expect(errors.preferredDate).toBe('outsideStay');
  });

  it('rejects impossible dates, unknown options and unknown look ids', () => {
    expect(isValidDate('2026-02-30')).toBe(false);
    const errors = validateInquiry(valid({ interest: 'socks' as never, store: 'bangkok', look: 'look-99', message: 'x'.repeat(2001) }), TODAY);
    expect(errors).toMatchObject({ interest: 'invalidOption', store: 'invalidOption', look: 'invalidOption', message: 'tooLong' });
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
  it('drops unknown keys, trims strings, defaults safely and strips hidden dates', () => {
    const n = normaliseInquiry({ name: '  Alex ', contactMethod: 'fax', locale: 'xx', evil: '<script>', datesOpen: true, arrival: '2026-11-01' });
    expect(n.name).toBe('Alex');
    expect(n.contactMethod).toBe('email');
    expect(n.locale).toBe('en');
    expect(n.arrival).toBe('');
    expect('evil' in n).toBe(false);
  });
});

describe('context take-over from links (no double entry, no contact data)', () => {
  const lookInfo = { 'look-02': { title: 'Look slot 2', interest: 'linen-holiday' } };

  it('a look link preselects the look reference and its interest', () => {
    expect(prefillFromQuery('?look=look-02', lookInfo)).toEqual({ look: 'look-02', interest: 'linen-holiday' });
  });

  it('the home "plan your stay" module carries interest and dates', () => {
    expect(prefillFromQuery('?interest=weddings&arrival=2026-12-01&departure=2026-12-14', lookInfo)).toEqual({
      interest: 'weddings',
      arrival: '2026-12-01',
      departure: '2026-12-14',
    });
    expect(prefillFromQuery('?interest=women&arrival=2026-12-01&datesOpen=1', lookInfo)).toEqual({ interest: 'women', datesOpen: true });
  });

  it('ignores unknown values and never reads contact data from the URL', () => {
    expect(prefillFromQuery('?look=look-99&interest=socks&store=x&arrival=tomorrow&name=Alex&contactValue=a@b.c', lookInfo)).toEqual({});
  });
});
