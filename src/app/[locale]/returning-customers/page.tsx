import type { Metadata } from 'next';
import { storeNamesWithStatus } from '@/components/Sections';
import { InquiryForm } from '@/components/InquiryForm';
import { lookInfoFor } from '@/components/Looks';
import { ContactOptions, PageHead } from '@/components/Sections';
import { isFormEnabled } from '@/lib/site';
import { localePath } from '@/lib/i18n';
import { pageMetadata, resolveLocale, type LocaleParams } from '@/lib/page';

const PATH = '/returning-customers';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(locale, PATH, t.returning.metaTitle, isFormEnabled() ? t.returning.intro : t.returning.introNoForm);
}

/** A reorder is a request for personal review — stored measurements are never assumed current. */
export default async function ReturningCustomersPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  const formEnabled = isFormEnabled();
  return (
    <>
      <PageHead title={t.returning.title} lead={formEnabled ? t.returning.intro : t.returning.introNoForm} crumbLabel={t.common.breadcrumb} crumbs={[{ href: localePath(locale, '/'), label: t.common.home }]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: 'calc(820px + 2 * var(--gutter))' }}>
          <p className="muted">{t.returning.hint}</p>
          {formEnabled ? (
            <InquiryForm locale={locale} t={t.form} storeNames={storeNamesWithStatus(t)} privacyHref={localePath(locale, '/privacy')} lookInfo={lookInfoFor(t)} type="reorder" />
          ) : (
            <ContactOptions locale={locale} t={t} />
          )}
        </div>
      </section>
    </>
  );
}
