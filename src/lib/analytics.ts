/**
 * Prepared measurement events. Disabled until a service and its configuration are decided
 * (NEXT_PUBLIC_ANALYTICS_ENABLED=true). Even then only whitelisted, non-personal parameters
 * are passed on — never names, phone numbers, e-mail addresses or message text.
 */
export type AnalyticsEvent = 'contact_cta_click' | 'whatsapp_click' | 'directions_click' | 'inquiry_submit_success';
export type AnalyticsParams = { store?: string; category?: string; locale?: string };

const ALLOWED: (keyof AnalyticsParams)[] = ['store', 'category', 'locale'];

export function sanitiseParams(params: Record<string, unknown>): AnalyticsParams {
  const out: AnalyticsParams = {};
  for (const key of ALLOWED) {
    const value = params[key];
    if (typeof value === 'string' && value.length <= 40) out[key] = value;
  }
  return out;
}

export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}): void {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'true' || typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...sanitiseParams(params) });
}
