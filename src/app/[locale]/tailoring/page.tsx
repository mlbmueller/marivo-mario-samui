import type { Metadata } from 'next';
import Link from 'next/link';
import { CategoryCards, ClosingCta, PageHead } from '@/components/Sections';
import { Icon } from '@/components/Icon';
import { localePath } from '@/lib/i18n';
import { pageMetadata, requireAvailable, resolveLocale, type LocaleParams } from '@/lib/page';

const PATH = '/tailoring';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(locale, PATH, t.categories.shared.overviewTitle, t.categories.shared.overviewIntro);
}

export default async function TailoringPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  requireAvailable(PATH);
  return (
    <>
      <PageHead
        title={t.categories.shared.overviewTitle}
        lead={t.categories.shared.overviewIntro}
        crumbLabel={t.common.breadcrumb}
        crumbs={[{ href: localePath(locale, '/'), label: t.common.home }]}
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <CategoryCards locale={locale} t={t} />
        </div>
      </section>
      <section className="section section-white">
        <div className="container split">
          <div className="prose">
            <h2>{t.craftsmanship.title}</h2>
            <p>{t.craftsmanship.intro}</p>
            <Link href={localePath(locale, '/craftsmanship')} className="text-link">
              {t.common.learnMore}
              <Icon name="arrow" />
            </Link>
          </div>
          <div className="prose">
            <h2>{t.categories.shared.priceHeading}</h2>
            <p>{t.categories.shared.priceText}</p>
          </div>
        </div>
      </section>
      <ClosingCta locale={locale} t={t} />
    </>
  );
}
