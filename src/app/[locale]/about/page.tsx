import type { Metadata } from 'next';
import { hasPhoto } from '@/content/media';
import { team } from '@/content/team';
import { DraftBadge } from '@/components/Draft';
import { Media } from '@/components/Media';
import { ClosingCta, PageHead } from '@/components/Sections';
import { localePath } from '@/lib/i18n';
import { pageMetadata, resolveLocale, type LocaleParams } from '@/lib/page';
import { isPreview, isPublishable, shown } from '@/lib/site';

const PATH = '/about';

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return pageMetadata(locale, PATH, t.about.metaTitle, t.about.intro);
}

export default async function AboutPage({ params }: { params: LocaleParams }) {
  const { locale, t } = await resolveLocale(params);
  const a = t.about;
  const mario = team.find((m) => m.id === 'mario')!;
  const others = team.filter((m) => m.id !== 'mario' && isPublishable(m.name.status));

  return (
    <>
      <PageHead title={a.title} lead={a.intro} crumbLabel={t.common.breadcrumb} crumbs={[{ href: localePath(locale, '/'), label: t.common.home }]} />

      <section className="section section-white" aria-labelledby="mario-heading">
        <div className="container split">
          <div className="portrait">
            <Media id={hasPhoto(mario.portrait) || !hasPhoto('hero-consultation') ? mario.portrait : 'hero-consultation'} dict={t} ratio="4 / 5" sizes="(min-width: 900px) 440px, 100vw" />
          </div>
          <div className="prose">
            <p className="eyebrow">{a.roles.owner}</p>
            <h2 id="mario-heading">
              {a.marioHeading}
              <DraftBadge status={mario.bio.status} label={t.common.draft} />
            </h2>
            {isPublishable(mario.bio.status) && <p className="lead">{a.marioText}</p>}
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="section" aria-labelledby="team-heading">
          <div className="container">
            <div className="section-head">
              <h2 id="team-heading">{a.teamHeading}</h2>
              <p>{a.teamText}</p>
            </div>
            <div className="grid grid-3">
              {others.map((member) => {
                const role = shown(member.role);
                return (
                  <article key={member.id}>
                    <Media id={member.portrait} dict={t} ratio="4 / 5" sizes="(min-width: 720px) 33vw, 100vw" />
                    <h3 style={{ marginTop: '1rem', marginBottom: '0.2rem' }}>{member.name.value}</h3>
                    {/* No invented title: the role appears only once confirmed. */}
                    {role ? <p className="muted">{a.roles[role]}</p> : isPreview() ? <p className="pending small">{t.common.toBeConfirmed}</p> : null}
                  </article>
                );
              })}
            </div>
            {isPreview() && (
              <p className="muted" style={{ marginTop: '2rem' }}>
                {a.moreSoon}
              </p>
            )}
          </div>
        </section>
      )}

      <section className="section section-white" aria-labelledby="group-heading">
        <div className="container">
          <h2 id="group-heading">{a.groupPhotoHeading}</h2>
          <Media id="team-group" dict={t} sizes="100vw" />
        </div>
      </section>

      <ClosingCta locale={locale} t={t} />
    </>
  );
}
