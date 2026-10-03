import { getDelivery } from '@/lib/server/delivery';
import { handleInquiry } from '@/lib/server/handle-inquiry';
import { getRateLimiter } from '@/lib/server/rate-limit';
import { getSiteUrl } from '@/lib/site';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const siteUrl = getSiteUrl();
  return handleInquiry(request, {
    delivery: getDelivery(),
    limiter: getRateLimiter(),
    allowedOrigins: siteUrl ? [siteUrl] : [],
  });
}
