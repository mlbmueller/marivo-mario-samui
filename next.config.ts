import type { NextConfig } from 'next';
import legacyRedirects from './src/content/redirects.json';

const isProduction = process.env.SITE_MODE === 'production';

type LegacyRedirect = { from: string; to: string; permanent: boolean; status: string };

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    // Only redirects with status "confirmed" are active. See docs/REDIRECTS.md.
    const confirmed = (legacyRedirects as LegacyRedirect[])
      .filter((r) => r.status === 'confirmed')
      .map((r) => ({ source: r.from, destination: r.to, permanent: r.permanent }));
    return [
      // Root always goes to the English home page. No geolocation, no Accept-Language sniffing.
      { source: '/', destination: '/en', permanent: false },
      ...confirmed,
    ];
  },
  async headers() {
    const security = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];
    // Preview builds must never be indexed, regardless of robots.txt.
    const preview = isProduction ? [] : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }];
    return [{ source: '/:path*', headers: [...security, ...preview] }];
  },
};

export default nextConfig;
