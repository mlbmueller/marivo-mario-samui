import { describe, expect, it, vi } from 'vitest';
import { getDelivery } from './delivery';
import { handleInquiry } from './handle-inquiry';
import { memoryLimiter } from './rate-limit';

const TODAY = '2026-10-03';

const body = {
  name: 'Alex Example',
  contactMethod: 'email',
  contactValue: 'alex@example.com',
  interest: 'suits',
  store: 'chaweng',
  message: 'Secret message text',
};

function request(payload: unknown = body, headers: Record<string, string> = {}) {
  return new Request('https://preview.local/api/inquiry', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://preview.local', host: 'preview.local', 'x-forwarded-for': '203.0.113.7', ...headers },
    body: typeof payload === 'string' ? payload : JSON.stringify(payload),
  });
}

const okFetch = vi.fn(async () => new Response('ok', { status: 200 }));
const failingFetch = vi.fn(async () => new Response('nope', { status: 500 }));
const throwingFetch = vi.fn(async () => {
  throw new Error('network down');
});

function deps(delivery = getDelivery({ INQUIRY_DELIVERY: 'demo' }, 'preview'), log = vi.fn()) {
  return { delivery, limiter: memoryLimiter(), today: TODAY, log };
}

describe('POST /api/inquiry', () => {
  it('demo mode: validates, sends nothing and reports "demo" (never "accepted")', async () => {
    const res = await handleInquiry(request(), deps());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, outcome: 'demo' });
  });

  it('webhook success: reports "accepted" only after the service returned 2xx', async () => {
    okFetch.mockClear();
    const delivery = getDelivery({ INQUIRY_DELIVERY: 'webhook', INQUIRY_WEBHOOK_URL: 'https://hooks.test/x', INQUIRY_WEBHOOK_SECRET: 's3cret' }, 'production', okFetch);
    const res = await handleInquiry(request(), deps(delivery));
    expect(await res.json()).toEqual({ ok: true, outcome: 'accepted' });
    expect(okFetch).toHaveBeenCalledOnce();
    const init = (okFetch.mock.calls[0] as unknown as [string, RequestInit])[1];
    expect((init.headers as Record<string, string>)['X-Signature']).toMatch(/^sha256=[0-9a-f]{64}$/);
    expect(JSON.parse(init.body as string)).not.toHaveProperty('website');
  });

  it('webhook failure: no success message, error is reported', async () => {
    const delivery = getDelivery({ INQUIRY_DELIVERY: 'webhook', INQUIRY_WEBHOOK_URL: 'https://hooks.test/x' }, 'production', failingFetch);
    const res = await handleInquiry(request(), deps(delivery));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, error: 'failed' });
  });

  it('network error towards the service is a failure, not a success', async () => {
    const delivery = getDelivery({ INQUIRY_DELIVERY: 'webhook', INQUIRY_WEBHOOK_URL: 'https://hooks.test/x' }, 'production', throwingFetch);
    const res = await handleInquiry(request(), deps(delivery));
    expect(res.status).toBe(502);
  });

  it('production without a configured service never fakes success', async () => {
    for (const env of [{}, { INQUIRY_DELIVERY: 'demo' }, { INQUIRY_DELIVERY: 'webhook' }]) {
      const res = await handleInquiry(request(), deps(getDelivery(env, 'production')));
      expect(res.status).toBe(503);
      expect(await res.json()).toEqual({ ok: false, error: 'unavailable' });
    }
  });

  it('returns field errors for invalid input (server-side validation)', async () => {
    const res = await handleInquiry(request({ ...body, name: '', suggestDate: true, preferredDate: '2026-10-01' }), deps());
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ ok: false, error: 'validation', fields: { name: 'required', preferredDate: 'dateInPast' } });
  });

  it('rejects foreign or missing origins', async () => {
    expect((await handleInquiry(request(body, { origin: 'https://evil.example' }), deps())).status).toBe(403);
    const noOrigin = request();
    noOrigin.headers.delete('origin');
    expect((await handleInquiry(noOrigin, deps())).status).toBe(403);
  });

  it('rejects oversized bodies', async () => {
    const res = await handleInquiry(request({ ...body, message: 'x'.repeat(20_000) }), deps());
    expect(res.status).toBe(413);
  });

  it('drops honeypot submissions without delivering them', async () => {
    okFetch.mockClear();
    const delivery = getDelivery({ INQUIRY_DELIVERY: 'webhook', INQUIRY_WEBHOOK_URL: 'https://hooks.test/x' }, 'production', okFetch);
    const res = await handleInquiry(request({ ...body, website: 'http://spam' }), deps(delivery));
    expect(res.status).toBe(200);
    expect(okFetch).not.toHaveBeenCalled();
  });

  it('rate-limits repeated requests from the same client', async () => {
    const d = deps();
    const statuses: number[] = [];
    for (let i = 0; i < 7; i++) statuses.push((await handleInquiry(request(), d)).status);
    expect(statuses.slice(0, 5).every((s) => s === 200)).toBe(true);
    expect(statuses[6]).toBe(429);
  });

  it('never logs personal data', async () => {
    const log = vi.fn();
    await handleInquiry(request(), deps(undefined, log));
    const logged = JSON.stringify(log.mock.calls);
    for (const secret of ['Alex', 'alex@example.com', 'Secret message', '203.0.113.7']) expect(logged).not.toContain(secret);
  });
});
