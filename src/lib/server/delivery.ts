/**
 * Delivery of inquiries to the business. Server-only.
 *
 * INQUIRY_DELIVERY selects the adapter:
 * - demo     → nothing is sent; the form shows "Test request — not sent". Never allowed in production.
 * - webhook  → POST JSON to INQUIRY_WEBHOOK_URL (e.g. Make, Zapier, n8n, a mail relay),
 *              signed with HMAC-SHA256 (INQUIRY_WEBHOOK_SECRET) in the X-Signature header.
 * - resend   → e-mail via the Resend HTTP API (RESEND_API_KEY, INQUIRY_EMAIL_TO, INQUIRY_EMAIL_FROM).
 *
 * Success is reported only when the service actually accepted the request (2xx).
 */
import { createHmac } from 'node:crypto';
import type { InquiryInput } from '@/lib/inquiry';
import { getSiteMode, type SiteMode } from '@/lib/site';

export type DeliveryResult = { ok: true; outcome: 'accepted' | 'demo' } | { ok: false; reason: 'unavailable' | 'failed' };

export interface InquiryDelivery {
  readonly kind: 'demo' | 'webhook' | 'resend' | 'none';
  send(inquiry: InquiryInput, meta: { id: string; receivedAt: string }): Promise<DeliveryResult>;
}

type Env = Record<string, string | undefined>;
type FetchLike = typeof fetch;

const TIMEOUT_MS = 10_000;

const demoDelivery: InquiryDelivery = {
  kind: 'demo',
  async send() {
    return { ok: true, outcome: 'demo' };
  },
};

const unavailableDelivery: InquiryDelivery = {
  kind: 'none',
  async send() {
    return { ok: false, reason: 'unavailable' };
  },
};

/** Payload without the honeypot field. */
function payload(inquiry: InquiryInput, meta: { id: string; receivedAt: string }) {
  const fields: Partial<InquiryInput> = { ...inquiry };
  delete fields.website;
  return { id: meta.id, receivedAt: meta.receivedAt, type: 'appointment-request', ...fields };
}

function webhookDelivery(url: string, secret: string | undefined, fetchImpl: FetchLike): InquiryDelivery {
  return {
    kind: 'webhook',
    async send(inquiry, meta) {
      const body = JSON.stringify(payload(inquiry, meta));
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (secret) headers['X-Signature'] = `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;
      try {
        const res = await fetchImpl(url, { method: 'POST', headers, body, signal: AbortSignal.timeout(TIMEOUT_MS) });
        return res.ok ? { ok: true, outcome: 'accepted' } : { ok: false, reason: 'failed' };
      } catch {
        return { ok: false, reason: 'failed' };
      }
    },
  };
}

function resendDelivery(apiKey: string, to: string, from: string, fetchImpl: FetchLike): InquiryDelivery {
  return {
    kind: 'resend',
    async send(inquiry, meta) {
      const lines = Object.entries(payload(inquiry, meta)).map(([k, v]) => `${k}: ${String(v)}`);
      const replyTo = inquiry.contactMethod === 'email' ? inquiry.contactValue : undefined;
      try {
        const res = await fetchImpl('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from,
            to: [to],
            reply_to: replyTo,
            subject: `Appointment request ${meta.id} (${inquiry.locale.toUpperCase()})`,
            text: lines.join('\n'),
          }),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        return res.ok ? { ok: true, outcome: 'accepted' } : { ok: false, reason: 'failed' };
      } catch {
        return { ok: false, reason: 'failed' };
      }
    },
  };
}

/**
 * Pick the adapter for the current configuration. Misconfiguration never results in a
 * faked success: in production, demo or an incomplete setup yields "unavailable".
 */
export function getDelivery(env: Env = process.env, mode: SiteMode = getSiteMode(), fetchImpl: FetchLike = fetch): InquiryDelivery {
  const kind = (env.INQUIRY_DELIVERY ?? '').trim() || (mode === 'preview' ? 'demo' : '');

  if (kind === 'webhook' && env.INQUIRY_WEBHOOK_URL) {
    return webhookDelivery(env.INQUIRY_WEBHOOK_URL, env.INQUIRY_WEBHOOK_SECRET, fetchImpl);
  }
  if (kind === 'resend' && env.RESEND_API_KEY && env.INQUIRY_EMAIL_TO && env.INQUIRY_EMAIL_FROM) {
    return resendDelivery(env.RESEND_API_KEY, env.INQUIRY_EMAIL_TO, env.INQUIRY_EMAIL_FROM, fetchImpl);
  }
  if (kind === 'demo' && mode === 'preview') return demoDelivery;
  return unavailableDelivery;
}
