import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { introSlides, introTexts, introVideo } from '@/content/intro';
import { hasPhoto, media, type MediaId } from '@/content/media';
import { storeIds } from '@/content/stores';
import { Icon } from '@/components/Icon';
import { IntroMedia, type IntroMediaSlide } from '@/components/IntroMedia';
import { Media } from '@/components/Media';
import { Reveal } from '@/components/Reveal';
import { CategoryCards, ClosingCta, StoreCard, visibleCategories } from '@/components/Sections';
import { TrackedLink } from '@/components/TrackedLink';
import type { Dictionary } from '@/content/locales';
import { localePath } from '@/lib/i18n';
import { resolveLocale, type LocaleParams } from '@/lib/page';
import { isPageAvailable } from '@/lib/site';

const PATH = '/intro-preview';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { t } = await resolveLocale(params);
  return { title: `Intro preview | ${t.home.metaTitle}`, robots: { index: false, follow: false } };
}

const toSlide = (id: MediaId, t: Dictionary, focus: string, mobileFocus?: string): IntroMediaSlide => ({
  src: media[id].src!,
  width: media[id].width,
  height: media[id].height,
  alt: t.media[id],
  focus,
  mobileFocus: mobileFocus ?? focus,
});

/**
 * Design draft for a new, animated intro (preview deployments only; 404 in production).
 * Uses the existing header, language switch, tokens and components; the current home page
 * stays unchanged. Media and copy live in src/content/intro.ts.
 */
export default async function IntroPreviewPage({ params }: { params: LocaleParams }) {
  if (!isPageAvailable(PATH)) notFound();
  const { locale, t } = await resolveLocale(params);
  const x = introTexts(locale);
  const lp = (path: string) => localePath(locale, path);

  const slides = introSlides.filter((s) => hasPhoto(s.media)).map((s) => toSlide(s.media, t, s.focus, s.mobileFocus));
  const video = introVideo && hasPhoto(introVideo.poster)
    ? { src: introVideo.src, mobileSrc: introVideo.mobileSrc ?? null, poster: toSlide(introVideo.poster, t, '50% 30%') }
    : null;
  const looksHref = isPageAvailable('/our-work') ? lp('/our-work') : `${lp('/')}#looks`;

  return (
    <>
      <p className="draft-label" role="note">
        {video ? x.draftNote.video : x.draftNote.photos}
      </p>

      {/* 1 — Hero: background media, text on the left, the next section already peeks in */}
      <section className="intro-hero" aria-labelledby="intro-heading">
        <IntroMedia slides={slides} video={video} labels={{ pause: x.pause, play: x.play }} />
        <div className="intro-shade" aria-hidden="true" />
        <div className="container intro-content">
          <div className="intro-copy">
            <p className="intro-eyebrow intro-in" style={{ '--i': 0 } as React.CSSProperties}>
              {t.home.eyebrow}
            </p>
            <h1 id="intro-heading" className="intro-in" style={{ '--i': 1 } as React.CSSProperties}>
              <span>{x.headline[0]}</span> <span>{x.headline[1]}</span>
            </h1>
            <p className="intro-text intro-in" style={{ '--i': 2 } as React.CSSProperties}>
              {x.text}
            </p>
            <div className="btn-row intro-actions intro-in" style={{ '--i': 3 } as React.CSSProperties}>
              <TrackedLink href={lp('/contact')} className="btn" event="contact_cta_click">
                <Icon name="calendar" />
                {t.common.planFitting}
              </TrackedLink>
              <a href={looksHref} className="btn btn-secondary">
                {t.common.exploreLooks}
                <Icon name="arrow" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — Personal section: the real fitting photo, overlapping the hero edge */}
      <section className="intro-personal" aria-labelledby="personal-heading">
        <div className="container intro-personal-grid">
          <div className="intro-personal-photo">
            <Media id="hero-consultation" dict={t} ratio="4 / 5" sizes="(min-width: 960px) 40vw, 100vw" />
          </div>
          <Reveal className="intro-personal-copy">
            <p className="eyebrow">{t.common.locationsLine}</p>
            <h2 id="personal-heading">{x.personalHeading}</h2>
            <p className="lead">{x.personalText}</p>
            <ul className="intro-features">
              {x.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 3 — Existing sections, gently revealed on scroll */}
      {visibleCategories().length > 0 && (
        <section className="section" aria-labelledby="worlds-heading">
          <Reveal className="container">
            <div className="section-head">
              <h2 id="worlds-heading">{t.home.worldsHeading}</h2>
              <p>{t.home.worldsIntro}</p>
            </div>
            <CategoryCards locale={locale} t={t} />
          </Reveal>
        </section>
      )}

      <section className="section section-white" aria-labelledby="stores-heading">
        <Reveal className="container">
          <div className="section-head">
            <h2 id="stores-heading">{t.home.storesHeading}</h2>
            <p>{t.home.storesIntro}</p>
          </div>
          <div className="grid grid-2">
            {storeIds.map((id) => (
              <StoreCard key={id} store={id} locale={locale} t={t} />
            ))}
          </div>
        </Reveal>
      </section>

      <Reveal>
        <ClosingCta locale={locale} t={t} />
      </Reveal>
    </>
  );
}
