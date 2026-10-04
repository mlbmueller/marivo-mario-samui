import type { Metadata } from 'next';
import { privacyNotice } from '@/content/brand';
import { PreviewNotice } from '@/components/Draft';
import { PageHead } from '@/components/Sections';
import { privacyNoFormSections } from '@/content/privacy-no-form';
import { isFormEnabled } from '@/lib/site';
import { localePath } from '@/lib/i18n';
import { pageMetadata, resolveLocale, type LocaleParams } from '@/lib/page';

const PATH = '/privacy';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(locale, PATH, t.privacy.metaTitle, t.privacy.sections[0]?.text ?? t.privacy.title);
}

/** Privacy notice. Draft until reviewed against the actual processing (release blocker). */
export default async function PrivacyPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  const sections = isFormEnabled() ? t.privacy.sections : privacyNoFormSections(locale);
  return (
    <>
      <PageHead title={t.privacy.title} crumbLabel={t.common.breadcrumb} crumbs={[{ href: localePath(locale, '/'), label: t.common.home }]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose">
          {privacyNotice.status !== 'confirmed' && <PreviewNotice>{t.privacy.draftNotice}</PreviewNotice>}
          {sections.map((s) => (
            <section key={s.heading} style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem' }}>{s.heading}</h2>
              <p>{s.text}</p>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
