import '@fontsource-variable/manrope';
import '@fontsource-variable/source-serif-4';
import '../globals.css';
import type { Metadata, Viewport } from 'next';
import { brand, brandLine } from '@/content/brand';

export const metadata: Metadata = {
  title: `${brand.displayName.value} – Custom Tailoring in Koh Samui`,
  description: 'NICKY FASHION – Men’s & Women’s Wear – Tailoring by Mario K. Chaweng · Fisherman’s Village · Koh Samui. Our new website is coming soon.',
  applicationName: brandLine,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#f7f0e4',
  viewportFit: 'cover',
};

/** Separate root layout: the holding page has no navigation, no forms, no placeholders. */
export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
