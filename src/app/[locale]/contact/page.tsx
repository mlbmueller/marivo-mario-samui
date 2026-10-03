import type { Metadata } from 'next';
import Link from 'next/link';
import { storeIds } from '@/content/stores';
import { InquiryForm } from '@/components/InquiryForm';
import { lookInfoFor } from '@/components/Looks';
import { PageHead } from '@/components/Sections';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { fmt, localePath } from '@/lib/i18n';
import { pageMetadata, resolveLocale, type LocaleParams } from '@/lib/page';

const PATH = '/contact';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(locale, PATH, t.contact.metaTitle, t.contact.intro);
}

export default async function ContactPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  return (
    <>
      <PageHead title={t.contact.title} lead={t.contact.intro} crumbLabel={t.common.breadcrumb} crumbs={[{ href: localePath(locale, '/'), label: t.common.home }]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container detail-grid">
          <InquiryForm locale={locale} t={t.form} storeNames={t.storeNames} privacyHref={localePath(locale, '/privacy')} lookInfo={lookInfoFor(t)} />
          <aside className="sticky-aside stack">
            <div className="card">
              <h2 style={{ fontSize: '1.25rem' }}>{t.contact.otherWays}</h2>
              <div className="stack" style={{ marginTop: '1rem' }}>
                {storeIds.map((id) => (
                  <div key={id}>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                      <Link href={localePath(locale, `/stores/${id}`)}>
                        {t.storeNames[id]}, {t.common.koh}
                      </Link>
                    </p>
                    <WhatsAppButton dict={t} store={id} label={fmt(t.contact.whatsappStore, { store: t.storeNames[id] })} className="btn btn-secondary btn-sm" />
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h2 style={{ fontSize: '1.25rem' }}>{t.nav.returning}</h2>
              <p>{t.returning.hint}</p>
              <Link href={localePath(locale, '/returning-customers')} className="text-link">
                {t.nav.returning}
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
