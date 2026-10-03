import '@fontsource-variable/manrope';
import '@fontsource-variable/noto-sans-thai';
import '@fontsource-variable/source-serif-4';
import '@fontsource-variable/noto-serif-thai';
import '../globals.css';
import type { Metadata, Viewport } from 'next';
import { brand, brandLine } from '@/content/brand';
import { localeMeta } from '@/content/locales';
import { MobileBar, SiteFooter, SiteHeader } from '@/components/SiteChrome';
import { resolveLocale, type LocaleParams } from '@/lib/page';
import { isPreview, routedLocales } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return routedLocales().map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { t } = await resolveLocale(params);
  return {
    title: brandLine,
    description: t.meta.siteDescription,
    applicationName: brand.displayName.value,
    robots: isPreview() ? { index: false, follow: false } : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: '#f7f0e4',
  viewportFit: 'cover',
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  return (
    <html lang={localeMeta[locale].hreflang}>
      <body>
        <a className="skip-link" href="#main">
          {t.common.skipToContent}
        </a>
        {isPreview() && <div className="preview-banner">{t.meta.previewBanner}</div>}
        <SiteHeader locale={locale} t={t} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter locale={locale} t={t} />
        <MobileBar locale={locale} t={t} />
      </body>
    </html>
  );
}
