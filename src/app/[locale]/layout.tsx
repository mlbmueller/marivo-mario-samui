import '@fontsource-variable/manrope';
import '@fontsource-variable/noto-sans-thai';
import '../globals.css';
import type { Metadata, Viewport } from 'next';
import { brand } from '@/content/brand';
import { localeMeta, locales } from '@/content/locales';
import { MobileBar, SiteFooter, SiteHeader } from '@/components/SiteChrome';
import { resolveLocale, type LocaleParams } from '@/lib/page';
import { isPreview } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { t } = await resolveLocale(params);
  return {
    title: `${brand.name.value} ${brand.suffix.value}`,
    description: t.meta.siteDescription,
    applicationName: `${brand.name.value} ${brand.suffix.value}`,
    robots: isPreview() ? { index: false, follow: false } : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: '#f7f3eb',
  viewportFit: 'cover',
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  return (
    <html lang={localeMeta[locale].hreflang}>
      <body className="has-mobile-bar">
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
