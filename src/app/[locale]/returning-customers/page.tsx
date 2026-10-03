import type { Metadata } from 'next';
import { InquiryForm } from '@/components/InquiryForm';
import { PageHead } from '@/components/Sections';
import { localePath } from '@/lib/i18n';
import { pageMetadata, resolveLocale, type LocaleParams } from '@/lib/page';

const PATH = '/returning-customers';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(locale, PATH, t.returning.metaTitle, t.returning.intro);
}

/** A reorder is a request for personal review — stored measurements are never assumed current. */
export default async function ReturningCustomersPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  return (
    <>
      <PageHead title={t.returning.title} lead={t.returning.intro} crumbLabel={t.common.breadcrumb} crumbs={[{ href: localePath(locale, '/'), label: t.common.home }]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 'calc(820px + 2 * var(--gutter))' }}>
          <p className="muted">{t.returning.hint}</p>
          <InquiryForm locale={locale} t={t.form} storeNames={t.storeNames} privacyHref={localePath(locale, '/privacy')} initial={{ concern: 'reorder' }} variant="reorder" />
        </div>
      </section>
    </>
  );
}
