import Link from 'next/link';
import type { Metadata } from 'next';
import { atelierFilm, media } from '@/content/media';
import { reviews } from '@/content/reviews';
import { storeIds } from '@/content/stores';
import { processSteps } from '@/content/services';
import { team } from '@/content/team';
import { DraftBadge } from '@/components/Draft';
import { Icon } from '@/components/Icon';
import { LookGrid } from '@/components/Looks';
import { Media } from '@/components/Media';
import { PlanStay } from '@/components/PlanStay';
import { CategoryCards, ClosingCta, ProcessSteps, StoreCard, visibleCategories } from '@/components/Sections';
import { TrackedLink } from '@/components/TrackedLink';
import { localePath } from '@/lib/i18n';
import { pageMetadata, resolveLocale, type LocaleParams } from '@/lib/page';
import { isPageAvailable, isPublishable, visibleLooks } from '@/lib/site';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(locale, '/', t.home.metaTitle, t.meta.siteDescription);
}

export default async function HomePage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  const lp = (path: string) => localePath(locale, path);
  const mario = team.find((m) => m.id === 'mario')!;
  const looks = visibleLooks().slice(0, 6);

  return (
    <>
      {/* 2 — Emotional entry: large outfit image + supporting consultation scene */}
      <section className="hero-v2">
        <div className="container hero-v2-grid">
          <div className="hero-media">
            <div className="hero-main">
              <Media id="hero-outfit" dict={t} priority ratio="4 / 5" sizes="(min-width: 960px) 55vw, 100vw" />
            </div>
            <div className="hero-secondary">
              <Media id="hero-consultation" dict={t} ratio="4 / 3" sizes="25vw" />
            </div>
          </div>
          <div>
            <p className="hero-eyebrow">{t.home.eyebrow}</p>
            <h1>{t.home.heroTitle}</h1>
            <p className="lead">{t.home.heroText}</p>
            <div className="btn-row" style={{ marginTop: '1.5rem' }}>
              <TrackedLink href={lp('/contact')} className="btn" event="contact_cta_click">
                <Icon name="calendar" />
                {t.common.planFitting}
              </TrackedLink>
              <a href="#looks" className="btn btn-secondary">
                {t.common.exploreLooks}
              </a>
            </div>
            <p className="locations-line">
              <Icon name="pin" />
              {t.common.locationsLine}
            </p>
            <p className="seo-line">{t.home.seoLine}</p>
          </div>
        </div>
      </section>

      {/* 3 — Compact trust row */}
      <section aria-labelledby="trust-heading">
        <div className="container">
          <h2 id="trust-heading" className="visually-hidden">
            {t.home.trustHeading}
          </h2>
          <div className="trust-row">
            {t.home.trust.map((item) => (
              <div key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Four style worlds */}
      {visibleCategories().length > 0 && (
        <section className="section" aria-labelledby="worlds-heading">
          <div className="container">
            <div className="section-head">
              <h2 id="worlds-heading">{t.home.worldsHeading}</h2>
              <p>{t.home.worldsIntro}</p>
            </div>
            <CategoryCards locale={locale} t={t} />
          </div>
        </section>
      )}

      {/* 5 — Selected looks, each with a direct request */}
      {looks.length > 0 && (
        <section className="section section-white" id="looks" aria-labelledby="looks-heading" tabIndex={-1}>
          <div className="container">
            <div className="section-head">
              <h2 id="looks-heading">{t.home.looksHeading}</h2>
              <p>{t.home.looksIntro}</p>
            </div>
            <LookGrid looks={looks} locale={locale} t={t} />
            {isPageAvailable('/our-work') && (
              <p style={{ marginTop: '2rem' }}>
                <Link href={lp('/our-work')} className="text-link">
                  {t.home.looksLink}
                  <Icon name="arrow" />
                </Link>
              </p>
            )}
          </div>
        </section>
      )}

      {/* 6 — Mario and the team (optional film, played only on demand) */}
      <section className="section" aria-labelledby="mario-heading">
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
            {atelierFilm.src && atelierFilm.rights === 'approved' && (
              <figure className="film" style={{ margin: '1.5rem 0' }}>
                <video controls preload="none" playsInline poster={media[atelierFilm.poster].src ?? undefined} aria-label={t.home.filmHeading}>
                  <source src={atelierFilm.src} />
                  {atelierFilm.captions && <track kind="captions" src={atelierFilm.captions} default />}
                </video>
                <figcaption className="small muted">{t.home.filmHeading}</figcaption>
              </figure>
            )}
            <Link href={lp('/about')} className="text-link">
              {t.home.marioLink}
              <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7 — Plan your stay: compact, continues in the full form */}
      <section className="section section-white" aria-labelledby="plan-heading">
        <div className="container">
          <div className="section-head">
            <h2 id="plan-heading">{t.home.planHeading}</h2>
            <p>{t.home.planText}</p>
          </div>
          <PlanStay locale={locale} t={t} />
        </div>
      </section>

      {/* 8 — Four steps (proposed until confirmed; hidden in production until then) */}
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

      {/* 11 — Short FAQ, then the closing invitation */}
      <section className="section section-white" aria-labelledby="faq-heading">
        <div className="container">
          <h2 id="faq-heading">{t.home.faqHeading}</h2>
          <div className="faq-list">
            {t.faq.items.slice(0, 4).map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
          <p style={{ marginTop: '1.25rem' }}>
            <Link href={lp('/faq')} className="text-link">
              {t.home.faqLink}
              <Icon name="arrow" />
            </Link>
          </p>
        </div>
      </section>
      <ClosingCta locale={locale} t={t} />
    </>
  );
}
