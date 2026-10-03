import type { Metadata } from 'next';
import { processSteps } from '@/content/services';
import { ClosingCta, PageHead, ProcessSteps } from '@/components/Sections';
import { localePath } from '@/lib/i18n';
import { pageMetadata, resolveLocale, type LocaleParams } from '@/lib/page';
import { isPublishable } from '@/lib/site';

const PATH = '/how-it-works';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(locale, PATH, t.howItWorks.metaTitle, t.howItWorks.intro);
}

export default async function HowItWorksPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  const h = t.howItWorks;
  return (
    <>
      <PageHead title={h.title} lead={h.intro} crumbLabel={t.common.breadcrumb} crumbs={[{ href: localePath(locale, '/'), label: t.common.home }]} />
      {isPublishable(processSteps.status) && (
        <section className="section section-dark on-dark" aria-labelledby="steps-heading">
          <div className="container">
            <h2 id="steps-heading" className="section-head">
              {h.stepsHeading}
            </h2>
            <ProcessSteps t={t} />
          </div>
        </section>
      )}
      <section className="section" aria-labelledby="plan-heading">
        <div className="container">
          <div className="section-head">
            <h2 id="plan-heading">{h.planHeading}</h2>
            <p>{h.planIntro}</p>
          </div>
          <div className="grid grid-2">
            {h.tips.map((tip) => (
              <div key={tip.title} className="card">
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </div>
            ))}
          </div>
          <p className="muted" style={{ marginTop: '2rem', maxWidth: 'var(--text)' }}>
            {h.timingNote}
          </p>
        </div>
      </section>
      <ClosingCta locale={locale} t={t} heading={t.home.planHeading} text={t.home.planText} />
    </>
  );
}
