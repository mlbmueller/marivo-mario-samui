/**
 * Request handler for POST /api/inquiry, kept framework-independent so it can be tested
 * with plain Request objects and simulated delivery services.
 */
import { createHash, randomUUID } from 'node:crypto';
import { LIMITS, hasErrors, normaliseInquiry, validateInquiry, type InquiryResponse } from '@/lib/inquiry';
import type { InquiryDelivery } from './delivery';
import type { RateLimiter } from './rate-limit';

export type InquiryDeps = {
  delivery: InquiryDelivery;
  limiter: RateLimiter;
  /** Extra allowed origins besides the request's own host (e.g. the confirmed SITE_URL). */
  allowedOrigins?: string[];
  today?: string;
  log?: (entry: Record<string, string>) => void;
};

const json = (body: InquiryResponse, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

function originAllowed(request: Request, extra: string[]): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (host && originHost === host) return true;
  return extra.some((allowed) => {
    try {
      return new URL(allowed).host === originHost;
    } catch {
      return false;
    }
  });
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const ip = forwarded || request.headers.get('x-real-ip') || 'unknown';
  // Only a hash leaves this function — no raw IP addresses in the rate-limit store.
  return createHash('sha256').update(ip).digest('hex').slice(0, 32);
}

export async function handleInquiry(request: Request, deps: InquiryDeps): Promise<Response> {
  const log = deps.log ?? ((entry) => console.info(JSON.stringify(entry)));
  const id = randomUUID();

  if (!originAllowed(request, deps.allowedOrigins ?? [])) return json({ ok: false, error: 'forbidden' }, 403);
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) {
    return json({ ok: false, error: 'bad-request' }, 415);
  }
  const declared = Number(request.headers.get('content-length') ?? '0');
  if (declared > LIMITS.body) return json({ ok: false, error: 'too-large' }, 413);

  const text = await request.text();
  if (new TextEncoder().encode(text).length > LIMITS.body) return json({ ok: false, error: 'too-large' }, 413);

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return json({ ok: false, error: 'bad-request' }, 400);
  }

  if (!(await deps.limiter.hit(clientKey(request)))) {
    log({ event: 'inquiry', id, outcome: 'rate-limited' });
    return json({ ok: false, error: 'rate-limited' }, 429);
  }

  const inquiry = normaliseInquiry(raw);

  // Honeypot filled → silently drop. Bots get a neutral answer, nothing is delivered.
  if (inquiry.website) {
    log({ event: 'inquiry', id, outcome: 'honeypot' });
    return json({ ok: true, outcome: deps.delivery.kind === 'demo' ? 'demo' : 'accepted' }, 200);
  }

  const errors = validateInquiry(inquiry, deps.today);
  if (hasErrors(errors)) return json({ ok: false, error: 'validation', fields: errors }, 422);

  const result = await deps.delivery.send(inquiry, { id, receivedAt: new Date().toISOString() });
  // Log only technical data — never names, contact details or message text.
  log({ event: 'inquiry', id, delivery: deps.delivery.kind, outcome: result.ok ? result.outcome : result.reason });

  if (result.ok) return json({ ok: true, outcome: result.outcome }, 200);
  return result.reason === 'unavailable'
    ? json({ ok: false, error: 'unavailable' }, 503)
    : json({ ok: false, error: 'failed' }, 502);
}
