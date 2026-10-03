import type { Metadata } from 'next';
import { storeIds } from '@/content/stores';
import { ClosingCta, PageHead, StoreCard } from '@/components/Sections';
import { localePath } from '@/lib/i18n';
import { pageMetadata, resolveLocale, type LocaleParams } from '@/lib/page';

const PATH = '/stores';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(locale, PATH, t.stores.metaTitle, t.stores.intro);
}

export default async function StoresPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  return (
    <>
      <PageHead title={t.stores.title} lead={t.stores.intro} crumbLabel={t.common.breadcrumb} crumbs={[{ href: localePath(locale, '/'), label: t.common.home }]} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid grid-2">
          {storeIds.map((id) => (
            <StoreCard key={id} store={id} locale={locale} t={t} headingLevel={2} />
          ))}
        </div>
      </section>
      <ClosingCta locale={locale} t={t} />
    </>
  );
}
