import type { Metadata } from 'next';
import { ClosingCta, PageHead } from '@/components/Sections';
import { localePath } from '@/lib/i18n';
import { pageMetadata, resolveLocale, type LocaleParams } from '@/lib/page';

const PATH = '/faq';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(locale, PATH, t.faq.metaTitle, t.faq.intro);
}

export default async function FaqPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  return (
    <>
      <PageHead title={t.faq.title} lead={t.faq.intro} crumbLabel={t.common.breadcrumb} crumbs={[{ href: localePath(locale, '/'), label: t.common.home }]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="faq-list">
            {t.faq.items.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <ClosingCta locale={locale} t={t} />
    </>
  );
}
