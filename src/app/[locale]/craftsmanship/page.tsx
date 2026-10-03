import type { Metadata } from 'next';
import { policies } from '@/content/services';
import { Media } from '@/components/Media';
import { PreviewNotice } from '@/components/Draft';
import { ClosingCta, PageHead } from '@/components/Sections';
import { localePath } from '@/lib/i18n';
import { pageMetadata, resolveLocale, type LocaleParams } from '@/lib/page';
import type { MediaId } from '@/content/media';

const PATH = '/craftsmanship';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(locale, PATH, t.craftsmanship.metaTitle, t.craftsmanship.intro);
}

export default async function CraftsmanshipPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  const c = t.craftsmanship;
  const blocks: { heading: string; text: string; image: MediaId }[] = [
    { heading: c.fabricsHeading, text: c.fabricsText, image: 'detail-fabrics' },
    { heading: c.detailsHeading, text: c.detailsText, image: 'detail-finish' },
    { heading: c.fitHeading, text: c.fitText, image: 'detail-measuring' },
  ];
  return (
    <>
      <PageHead
        title={c.title}
        lead={c.intro}
        crumbLabel={t.common.breadcrumb}
        crumbs={[
          { href: localePath(locale, '/'), label: t.common.home },
          { href: localePath(locale, '/tailoring'), label: t.nav.tailoring },
        ]}
      />
      {blocks.map((b, i) => (
        <section key={b.heading} className={`section ${i % 2 === 0 ? 'section-white' : ''}`}>
          <div className={`container split ${i % 2 === 1 ? 'split-reverse' : ''}`}>
            <Media id={b.image} dict={t} ratio="4 / 3" />
            <div className="prose">
              <h2>{b.heading}</h2>
              <p className="lead">{b.text}</p>
            </div>
          </div>
        </section>
      ))}
      {policies.fabrics.status !== 'confirmed' && (
        <div className="container" style={{ paddingBlock: '2rem' }}>
          <PreviewNotice>{c.note}</PreviewNotice>
        </div>
      )}
      <ClosingCta locale={locale} t={t} />
    </>
  );
}
