import type { MetadataRoute } from 'next';
import { getSiteUrl, isPreview } from '@/lib/site';

/** Preview: nothing may be indexed. Production: everything published, plus the sitemap. */
export default function robots(): MetadataRoute.Robots {
  if (isPreview()) return { rules: { userAgent: '*', disallow: '/' } };
  const siteUrl = getSiteUrl();
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    ...(siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
