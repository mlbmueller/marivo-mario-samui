import Link from 'next/link';
import type { Metadata } from 'next';
import { reviews } from '@/content/reviews';
import { storeIds } from '@/content/stores';
import { workExamples, workPlaceholders } from '@/content/media';
import { processSteps } from '@/content/services';
import { team } from '@/content/team';
import { DraftBadge } from '@/components/Draft';
import { Icon } from '@/components/Icon';
import { Media } from '@/components/Media';
import { CategoryCards, ClosingCta, ProcessSteps, StoreCard, visibleCategories } from '@/components/Sections';
import { TrackedLink } from '@/components/TrackedLink';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { localePath } from '@/lib/i18n';
import { pageMetadata, resolveLocale, type LocaleParams } from '@/lib/page';
import { isPageAvailable, isPublishable } from '@/lib/site';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(locale, '/', t.home.metaTitle, t.meta.siteDescription);
}

export default async function HomePage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  const lp = (path: string) => localePath(locale, path);
  const mario = team.find((m) => m.id === 'mario')!;
  const showWork = isPageAvailable('/our-work');
  const workImages = workExamples.length > 0 ? workExamples.map((w) => w.image) : workPlaceholders;

  return (
    <>
      {/* 2 — Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>{t.home.heroTitle}</h1>
            <p className="lead">{t.home.heroText}</p>
            <div className="btn-row">
              <TrackedLink href={lp('/contact')} className="btn" event="contact_cta_click">
                <Icon name="calendar" />
                {t.common.planFitting}
              </TrackedLink>
              <WhatsAppButton dict={t} />
            </div>
            <p className="locations-line">
              <Icon name="pin" />
              {t.common.locationsLine}
            </p>
          </div>
          <Media id="hero-fitting" dict={t} priority sizes="(min-width: 960px) 55vw, 100vw" />
        </div>
      </section>

      {/* 3 — Trust */}
      <section className="section-tight section-white" aria-labelledby="trust-heading">
        <div className="container">
          <h2 id="trust-heading" className="visually-hidden">
            {t.home.trustHeading}
          </h2>
          <div className="grid grid-3">
            {t.home.trust.map((item) => (
              <div key={item.title} className="trust-item">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Offer */}
      {visibleCategories().length > 0 && (
        <section className="section" aria-labelledby="offer-heading">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">{t.nav.tailoring}</p>
              <h2 id="offer-heading">{t.home.offerHeading}</h2>
              <p>{t.home.offerIntro}</p>
            </div>
            <CategoryCards locale={locale} t={t} />
          </div>
        </section>
      )}

      {/* 5 — Mario */}
      <section className="section section-white" aria-labelledby="mario-heading">
        <div className="container split">
          <div className="portrait">
            <Media id={mario.portrait} dict={t} ratio="4 / 5" sizes="(min-width: 900px) 440px, 100vw" />
          </div>
          <div className="prose">
            <p className="eyebrow">{t.home.marioRole}</p>
            <h2 id="mario-heading">
              {t.home.marioHeading}
              <DraftBadge status={mario.bio.status} label={t.common.draft} />
            </h2>
            {isPublishable(mario.bio.status) && <p className="lead">{t.home.marioText}</p>}
            <Link href={lp('/about')} className="text-link">
              {t.home.marioLink}
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6 — Process (hidden in production until confirmed) */}
      {isPublishable(processSteps.status) && (
        <section className="section section-dark on-dark" aria-labelledby="process-heading">
          <div className="container">
            <div className="section-head">
              <h2 id="process-heading">{t.home.processHeading}</h2>
              <p>{t.home.processIntro}</p>
            </div>
            <ProcessSteps t={t} />
            <p style={{ marginTop: '2rem' }}>
              <Link href={lp('/how-it-works')} className="text-link">
                {t.home.processLink}
                <Icon name="arrow" />
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* 7 — Selected work (placeholders in preview, hidden in production while empty) */}
      {showWork && (
        <section className="section" aria-labelledby="work-heading">
          <div className="container">
            <div className="section-head">
              <h2 id="work-heading">{t.home.workHeading}</h2>
              <p>{t.home.workIntro}</p>
            </div>
            <div className="grid grid-4">
              {workImages.map((id) => (
                <Media key={id} id={id} dict={t} ratio="3 / 4" sizes="(min-width: 1000px) 25vw, 50vw" />
              ))}
            </div>
            <p style={{ marginTop: '1.5rem' }}>
              <Link href={lp('/our-work')} className="text-link">
                {t.home.workLink}
                <Icon name="arrow" />
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* 8 — Plan your stay */}
      <section className="section section-white" aria-labelledby="plan-heading">
        <div className="container split">
          <div className="prose">
            <h2 id="plan-heading">{t.home.planHeading}</h2>
            <p className="lead">{t.home.planText}</p>
          </div>
          <div className="card" style={{ background: 'var(--ivory)' }}>
            <ul className="list-plain" style={{ display: 'grid', gap: '0.9rem', marginBottom: '1.5rem' }}>
              {[t.form.arrival, t.form.departure, t.form.product].map((label) => (
                <li key={label} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <Icon name="calendar" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
            <TrackedLink href={lp('/contact')} className="btn" event="contact_cta_click">
              {t.home.planCta}
              <Icon name="arrow" />
            </TrackedLink>
          </div>
        </div>
      </section>

      {/* 9 — Testimonials: only real, approved quotes. Not rendered while none exist. */}
      {reviews.length > 0 && (
        <section className="section" aria-labelledby="reviews-heading">
          <div className="container">
            <h2 id="reviews-heading">{t.home.reviewsHeading}</h2>
            <div className="grid grid-3">
              {reviews.map((r) => (
                <figure key={r.quote} className="card" lang={r.lang} style={{ margin: 0 }}>
                  <blockquote style={{ margin: 0 }}>“{r.quote}”</blockquote>
                  <figcaption className="muted small" style={{ marginTop: '1rem' }}>
                    {r.attribution}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10 — Both stores */}
      <section className="section" aria-labelledby="stores-heading">
        <div className="container">
          <div className="section-head">
            <h2 id="stores-heading">{t.home.storesHeading}</h2>
            <p>{t.home.storesIntro}</p>
          </div>
          <div className="grid grid-2">
            {storeIds.map((id) => (
              <StoreCard key={id} store={id} locale={locale} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* 11 — Closing invitation */}
      <ClosingCta locale={locale} t={t} />
    </>
  );
}
