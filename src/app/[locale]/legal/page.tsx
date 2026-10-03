import type { Metadata } from 'next';
import { operator } from '@/content/brand';
import { PageHead } from '@/components/Sections';
import { localePath } from '@/lib/i18n';
import { pageMetadata, resolveLocale, type LocaleParams } from '@/lib/page';
import { shown } from '@/lib/site';

const PATH = '/legal';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(locale, PATH, t.legal.metaTitle, t.legal.pendingNotice);
}

/** Operator details — only confirmed data, never derived from the brand name. */
export default async function LegalPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  const data = shown(operator);
  const fields = ['legalName', 'address', 'registration', 'contact'] as const;
  return (
    <>
      <PageHead title={t.legal.title} crumbLabel={t.common.breadcrumb} crumbs={[{ href: localePath(locale, '/'), label: t.common.home }]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose">
          {!data && <p className="notice">{t.legal.pendingNotice}</p>}
          <dl className="facts">
            {fields.map((f) => (
              <div key={f} style={{ display: 'contents' }}>
                <dt>{t.legal.fields[f]}</dt>
                <dd>{data ? data[f] : <span className="pending">{t.common.toBeConfirmed}</span>}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
