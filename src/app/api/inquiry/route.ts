import { getDelivery } from '@/lib/server/delivery';
import { handleInquiry } from '@/lib/server/handle-inquiry';
import { getRateLimiter } from '@/lib/server/rate-limit';
import { getSiteUrl, isFormEnabled } from '@/lib/site';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  // No form during the reduced launch: the endpoint does not exist publicly.
  if (!isFormEnabled()) return new Response(null, { status: 404 });
  const siteUrl = getSiteUrl();
  return handleInquiry(request, {
    delivery: getDelivery(),
    limiter: getRateLimiter(),
    allowedOrigins: siteUrl ? [siteUrl] : [],
  });
}
