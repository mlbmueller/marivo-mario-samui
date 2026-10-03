import type { Metadata } from 'next';
import { looks } from '@/content/looks';
import { reviews } from '@/content/reviews';
import { PreviewNotice } from '@/components/Draft';
import { LookGalleryServer } from '@/components/Looks';
import { ClosingCta, PageHead } from '@/components/Sections';
import { localePath } from '@/lib/i18n';
import { pageMetadata, requireAvailable, resolveLocale, type LocaleParams } from '@/lib/page';

const PATH = '/our-work';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(locale, PATH, t.ourWork.metaTitle, t.ourWork.intro);
}

export default async function OurWorkPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  requireAvailable(PATH);
  const hasApprovedWork = looks.some((l) => l.status === 'confirmed');

  return (
    <>
      <PageHead title={t.ourWork.title} lead={t.ourWork.intro} crumbLabel={t.common.breadcrumb} crumbs={[{ href: localePath(locale, '/'), label: t.common.home }]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {!hasApprovedWork && <PreviewNotice>{t.ourWork.emptyPreview}</PreviewNotice>}
          <LookGalleryServer locale={locale} t={t} />
        </div>
      </section>
      {reviews.length > 0 && (
        <section className="section section-white">
          <div className="container">
            <h2>{t.ourWork.reviewsHeading}</h2>
            <div className="grid grid-3">
              {reviews.map((r) => (
                <figure key={r.quote} className="card" lang={r.lang} style={{ margin: 0 }}>
                  <blockquote style={{ margin: 0 }}>“{r.quote}”</blockquote>
                  <figcaption className="muted small" style={{ marginTop: '1rem' }}>
                    {r.attribution}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
      <ClosingCta locale={locale} t={t} />
    </>
  );
}
