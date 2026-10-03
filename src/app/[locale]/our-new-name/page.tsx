import type { Metadata } from 'next';
import { brand } from '@/content/brand';
import { PreviewNotice } from '@/components/Draft';
import { ClosingCta, PageHead } from '@/components/Sections';
import { fmt, localePath } from '@/lib/i18n';
import { pageMetadata, requireAvailable, resolveLocale, type LocaleParams } from '@/lib/page';

const PATH = '/our-new-name';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(locale, PATH, t.newName.metaTitle, t.newName.intro);
}

/**
 * Transition page. Switched on via brand.transition.active once the rename has actually
 * happened. Until then: 404 in production; in preview visible with a clear "not active" note.
 */
export default async function NewNamePage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  requireAvailable(PATH);
  const previous = brand.previousNames.map((n) => `«${n}»`).join(' / ');
  return (
    <>
      <PageHead title={t.newName.title} lead={t.newName.intro} crumbLabel={t.common.breadcrumb} crumbs={[{ href: localePath(locale, '/'), label: t.common.home }]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose">
          {!brand.transition.active && <PreviewNotice>{t.newName.inactiveNotice}</PreviewNotice>}
          <p className="lead">{fmt(t.newName.text, { previous })}</p>
        </div>
      </section>
      <ClosingCta locale={locale} t={t} />
    </>
  );
}
