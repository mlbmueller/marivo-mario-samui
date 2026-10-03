'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { Dictionary } from '@/content/locales';
import { track } from '@/lib/analytics';
import {
  concerns,
  contactMethods,
  emptyInquiry,
  hasErrors,
  LIMITS,
  productOptions,
  storeOptions,
  todayInBangkok,
  validateInquiry,
  type FieldErrors,
  type InquiryInput,
  type InquiryResponse,
} from '@/lib/inquiry';

type FormDict = Dictionary['form'];

type Props = {
  locale: string;
  t: FormDict;
  storeNames: Dictionary['storeNames'];
  privacyHref: string;
  initial?: Partial<Pick<InquiryInput, 'product' | 'store' | 'concern'>>;
  variant?: 'contact' | 'reorder';
};

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'done'; outcome: 'accepted' | 'demo' }
  | { kind: 'failed'; reason: 'failed' | 'rate-limited' | 'unavailable' };

const FIELD_ORDER: (keyof InquiryInput)[] = ['name', 'contactMethod', 'contactValue', 'concern', 'product', 'store', 'arrival', 'departure', 'preferredDate', 'message'];

const fieldId = (name: keyof InquiryInput) => `inq-${name}`;

const noopSubscribe = () => () => {};

function prefillFromQuery(search: string): Partial<InquiryInput> {
  const q = new URLSearchParams(search);
  const pick = <T extends string>(key: string, allowed: readonly T[]) => {
    const v = q.get(key);
    return v && (allowed as readonly string[]).includes(v) ? (v as T) : undefined;
  };
  const out: Partial<InquiryInput> = {};
  const product = pick('product', productOptions);
  const store = pick('store', storeOptions);
  const concern = pick('concern', concerns);
  if (product) out.product = product;
  if (store) out.store = store;
  if (concern) out.concern = concern;
  return out;
}

export function InquiryForm({ locale, t, storeNames, privacyHref, initial, variant = 'contact' }: Props) {
  const [values, setValues] = useState<InquiryInput>(() => ({ ...emptyInquiry(locale), ...initial }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const inFlight = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Client-only values: "today" on Koh Samui and the query string of the current URL.
  // The server snapshot is empty, so the prebuilt HTML stays identical for every visitor.
  const today = useSyncExternalStore(noopSubscribe, todayInBangkok, () => '');
  const search = useSyncExternalStore(noopSubscribe, () => window.location.search, () => '');

  // Preselection from links such as /contact?product=men&store=chaweng (only known values),
  // merged once when the query string becomes known.
  const [appliedSearch, setAppliedSearch] = useState('');
  if (search !== appliedSearch) {
    setAppliedSearch(search);
    const prefill = prefillFromQuery(search);
    if (Object.keys(prefill).length > 0) setValues((prev) => ({ ...prev, ...prefill }));
  }

  useEffect(() => {
    if (status.kind === 'done' || status.kind === 'failed') statusRef.current?.focus();
  }, [status]);

  const set = <K extends keyof InquiryInput>(key: K, value: InquiryInput[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    // After the first submit attempt, errors update live while the user corrects them.
    if (attempted) setErrors(validateInquiry(next, todayInBangkok()));
  };

  const errorText = (key: keyof InquiryInput) => {
    const code = errors[key];
    return code ? t.errors[code] : null;
  };

  const describedBy = (key: keyof InquiryInput, hint?: boolean) =>
    [hint ? `${fieldId(key)}-hint` : null, errors[key] ? `${fieldId(key)}-error` : null].filter(Boolean).join(' ') || undefined;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return; // no double submission while a request is running
    setAttempted(true);
    const found = validateInquiry(values, todayInBangkok());
    setErrors(found);
    if (hasErrors(found)) {
      setStatus({ kind: 'idle' });
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    inFlight.current = true;
    setStatus({ kind: 'submitting' });
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => null)) as InquiryResponse | null;
      if (data?.ok) {
        setStatus({ kind: 'done', outcome: data.outcome });
        if (data.outcome === 'accepted') {
          track('inquiry_submit_success', { store: values.store, category: values.product, locale });
        }
      } else if (data && data.error === 'validation') {
        setErrors(data.fields);
        setStatus({ kind: 'idle' });
        requestAnimationFrame(() => summaryRef.current?.focus());
      } else if (data?.error === 'rate-limited') {
        setStatus({ kind: 'failed', reason: 'rate-limited' });
      } else if (data?.error === 'unavailable') {
        setStatus({ kind: 'failed', reason: 'unavailable' });
      } else {
        setStatus({ kind: 'failed', reason: 'failed' });
      }
    } catch {
      setStatus({ kind: 'failed', reason: 'failed' });
    } finally {
      inFlight.current = false;
    }
  }

  const reset = () => {
    setValues({ ...emptyInquiry(locale), ...initial, ...prefillFromQuery(search) });
    setErrors({});
    setAttempted(false);
    setStatus({ kind: 'idle' });
  };

  if (status.kind === 'done') {
    const demo = status.outcome === 'demo';
    return (
      <div ref={statusRef} tabIndex={-1} className={`form-status ${demo ? 'status-demo' : 'status-success'}`} role="status" data-testid="inquiry-status" data-outcome={status.outcome}>
        <h2>{demo ? t.demo.title : t.success.title}</h2>
        <p>{demo ? t.demo.text : t.success.text}</p>
        <button type="button" className="btn btn-secondary btn-sm" onClick={reset}>
          {t.success.again}
        </button>
      </div>
    );
  }

  const submitting = status.kind === 'submitting';
  const errorKeys = FIELD_ORDER.filter((k) => errors[k]);
  const contactLabel = values.contactMethod === 'email' ? t.email : values.contactMethod === 'whatsapp' ? t.whatsapp : t.phone;
  const [privacyBefore, privacyAfter] = t.privacyNote.split('{link}');

  return (
    <form className="form-card" onSubmit={onSubmit} noValidate aria-busy={submitting} data-testid="inquiry-form">
      {status.kind === 'failed' && (
        <div ref={statusRef} tabIndex={-1} className="form-status status-error" role="alert" data-testid="inquiry-status" data-outcome="failed">
          <h2>{t.failure.title}</h2>
          <p>{status.reason === 'rate-limited' ? t.failure.rateLimited : status.reason === 'unavailable' ? t.failure.unavailable : t.failure.text}</p>
        </div>
      )}

      {errorKeys.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} className="form-status status-error error-summary" role="alert">
          <p style={{ fontWeight: 700, margin: 0 }}>{t.errorSummary}</p>
          <ul>
            {errorKeys.map((k) => (
              <li key={k}>
                <a href={`#${fieldId(k)}`}>{errorText(k)}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset disabled={submitting}>
        <legend>{t.legend}</legend>
        <p className="hint" style={{ marginTop: '-0.5rem', marginBottom: '1.25rem' }}>
          {t.requiredHint}
        </p>

        <div className="form-grid">
          <div className="field">
            <label htmlFor={fieldId('name')}>
              {t.name}
              <span className="req" aria-hidden="true">*</span>
            </label>
            <input
              id={fieldId('name')}
              type="text"
              autoComplete="name"
              required
              maxLength={LIMITS.name}
              value={values.name}
              onChange={(e) => set('name', e.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describedBy('name')}
            />
            {errors.name && <span id={`${fieldId('name')}-error`} className="field-error">{errorText('name')}</span>}
          </div>

          <div className="field" role="radiogroup" aria-labelledby={`${fieldId('contactMethod')}-label`}>
            <span className="label" id={`${fieldId('contactMethod')}-label`}>
              {t.contactMethod}
              <span className="req" aria-hidden="true">*</span>
            </span>
            <div className="choice-row" id={fieldId('contactMethod')}>
              {contactMethods.map((m) => (
                <label key={m} className="choice">
                  <input type="radio" name="contactMethod" value={m} checked={values.contactMethod === m} onChange={() => set('contactMethod', m)} />
                  <span>{t.contactMethods[m]}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor={fieldId('contactValue')}>
              {contactLabel}
              <span className="req" aria-hidden="true">*</span>
            </label>
            <input
              id={fieldId('contactValue')}
              type={values.contactMethod === 'email' ? 'email' : 'tel'}
              inputMode={values.contactMethod === 'email' ? 'email' : 'tel'}
              autoComplete={values.contactMethod === 'email' ? 'email' : 'tel'}
              required
              maxLength={LIMITS.contactValue}
              value={values.contactValue}
              onChange={(e) => set('contactValue', e.target.value)}
              aria-invalid={errors.contactValue ? true : undefined}
              aria-describedby={describedBy('contactValue')}
            />
            {errors.contactValue && <span id={`${fieldId('contactValue')}-error`} className="field-error">{errorText('contactValue')}</span>}
          </div>

          <div className="form-grid form-grid-2">
            <div className="field">
              <label htmlFor={fieldId('concern')}>
                {t.concern}
                <span className="req" aria-hidden="true">*</span>
              </label>
              <select
                id={fieldId('concern')}
                required
                value={values.concern}
                onChange={(e) => set('concern', e.target.value as InquiryInput['concern'])}
                aria-invalid={errors.concern ? true : undefined}
                aria-describedby={describedBy('concern')}
              >
                <option value="">—</option>
                {concerns.map((c) => (
                  <option key={c} value={c}>
                    {t.concerns[c]}
                  </option>
                ))}
              </select>
              {errors.concern && <span id={`${fieldId('concern')}-error`} className="field-error">{errorText('concern')}</span>}
            </div>

            <div className="field">
              <label htmlFor={fieldId('product')}>{t.product}</label>
              <select id={fieldId('product')} value={values.product} onChange={(e) => set('product', e.target.value)} aria-invalid={errors.product ? true : undefined}>
                {productOptions.map((p) => (
                  <option key={p} value={p}>
                    {t.products[p]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor={fieldId('store')}>{t.store}</label>
            <select id={fieldId('store')} value={values.store} onChange={(e) => set('store', e.target.value)} aria-invalid={errors.store ? true : undefined}>
              {storeOptions.map((s) => (
                <option key={s} value={s}>
                  {s === 'no-preference' ? t.noPreference : storeNames[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset disabled={submitting} style={{ marginTop: '2rem' }}>
        <legend>{t.travelHeading}</legend>
        <div className="form-grid">
          <label className="checkbox">
            <input type="checkbox" checked={values.datesOpen} onChange={(e) => set('datesOpen', e.target.checked)} />
            {t.datesOpen}
          </label>
          <div className="form-grid form-grid-2">
            <div className="field">
              <label htmlFor={fieldId('arrival')}>{t.arrival}</label>
              <input
                id={fieldId('arrival')}
                type="date"
                value={values.arrival}
                disabled={values.datesOpen}
                onChange={(e) => set('arrival', e.target.value)}
                aria-invalid={errors.arrival ? true : undefined}
                aria-describedby={describedBy('arrival')}
              />
              {errors.arrival && <span id={`${fieldId('arrival')}-error`} className="field-error">{errorText('arrival')}</span>}
            </div>
            <div className="field">
              <label htmlFor={fieldId('departure')}>{t.departure}</label>
              <input
                id={fieldId('departure')}
                type="date"
                value={values.departure}
                min={values.arrival || today || undefined}
                disabled={values.datesOpen}
                onChange={(e) => set('departure', e.target.value)}
                aria-invalid={errors.departure ? true : undefined}
                aria-describedby={describedBy('departure')}
              />
              {errors.departure && <span id={`${fieldId('departure')}-error`} className="field-error">{errorText('departure')}</span>}
            </div>
          </div>
          <div className="field">
            <label htmlFor={fieldId('preferredDate')}>{t.preferredDate}</label>
            <input
              id={fieldId('preferredDate')}
              type="date"
              value={values.preferredDate}
              min={today || undefined}
              onChange={(e) => set('preferredDate', e.target.value)}
              aria-invalid={errors.preferredDate ? true : undefined}
              aria-describedby={describedBy('preferredDate', true)}
            />
            <span id={`${fieldId('preferredDate')}-hint`} className="hint">
              {t.preferredDateHint}
            </span>
            {errors.preferredDate && <span id={`${fieldId('preferredDate')}-error`} className="field-error">{errorText('preferredDate')}</span>}
          </div>
          <div className="field">
            <label htmlFor={fieldId('message')}>{t.message}</label>
            <textarea
              id={fieldId('message')}
              maxLength={LIMITS.message}
              value={values.message}
              onChange={(e) => set('message', e.target.value)}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describedBy('message', true)}
            />
            <span id={`${fieldId('message')}-hint`} className="hint">
              {variant === 'reorder' ? t.reorderMessageHint : t.messageHint}
            </span>
            {errors.message && <span id={`${fieldId('message')}-error`} className="field-error">{errorText('message')}</span>}
          </div>
        </div>
      </fieldset>

      {/* Honeypot: hidden from people and assistive technology, tempting for bots. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor={fieldId('website')}>{t.honeypot}</label>
        <input id={fieldId('website')} type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set('website', e.target.value)} />
      </div>

      <p className="hint" style={{ marginTop: '1.5rem' }}>
        {privacyBefore}
        <Link href={privacyHref}>{t.privacyLink}</Link>
        {privacyAfter}
      </p>

      <div className="btn-row" style={{ marginTop: '1rem' }}>
        <button type="submit" className="btn" disabled={submitting} aria-busy={submitting} data-testid="inquiry-submit">
          {submitting && <span className="spinner" aria-hidden="true" />}
          {submitting ? t.submitting : status.kind === 'failed' ? t.failure.retry : t.submit}
        </button>
      </div>
    </form>
  );
}
