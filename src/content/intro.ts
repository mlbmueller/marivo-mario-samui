import type { Locale } from './locales';
import type { MediaId } from './media';

/**
 * Intro hero draft (/intro-preview, preview only).
 *
 * Background media: while `introVideo` is null, the hero plays the real photos below as a
 * calm sequence (slow zoom, soft cross-fade, ~5 s each). To switch to film later, add the
 * clip files to /public/video/ and set `introVideo` — no component changes needed.
 * Desired film sequence (15–20 s loop, no sound): hand over fabric → swatch book opens →
 * consultation with Mario → measuring detail → lapel/sleeve adjusted at a fitting → smile.
 */
export type IntroSlide = {
  media: MediaId;
  /** Crop focus (CSS object-position) for desktop and phone — keeps faces and hands in frame. */
  focus: string;
  mobileFocus?: string;
};

export type IntroVideo = {
  /** Landscape clip for desktop, e.g. '/video/intro-1920.mp4' (H.264, muted). */
  src: string;
  /** Optional portrait/square clip for phones, e.g. '/video/intro-mobile.mp4'. */
  mobileSrc?: string;
  /** Still image shown immediately and whenever the video cannot play. */
  poster: MediaId;
};

export const introSlides: IntroSlide[] = [
  { media: 'team-group', focus: '50% 28%', mobileFocus: '50% 42%' }, // consultation: Mario and James with a customer
  { media: 'detail-measuring', focus: '58% 30%', mobileFocus: '60% 28%' }, // measuring
  { media: 'hero-consultation', focus: '42% 0%', mobileFocus: '45% 0%' }, // fitting and a smile
];

export const introVideo: IntroVideo | null = null;

type IntroTexts = {
  headline: [string, string];
  text: string;
  personalHeading: string;
  personalText: string;
  features: [string, string, string];
  pause: string;
  play: string;
  draftNote: { video: string; photos: string };
};

const en: IntroTexts = {
  headline: ['That holiday feeling.', 'Tailored to you.'],
  text: 'Custom clothing for men & women, made personal by Mario and the team.',
  personalHeading: 'A fitting. A smile. A little Samui.',
  personalText:
    'Choosing your clothes should feel as good as wearing them. Meet Mario and the team, explore fabrics together, and enjoy a fitting that’s personal from the start.',
  features: ['Personal advice', 'Individual fit', 'Made for you'],
  pause: 'Pause background animation',
  play: 'Play background animation',
  draftNote: { video: 'Design draft · background: video', photos: 'Design draft · background: animated photos (no video yet)' },
};

const de: IntroTexts = {
  headline: ['Das Feriengefühl.', 'Auf dich zugeschnitten.'],
  text: 'Individuelle Kleidung für Damen und Herren – persönlich gemacht von Mario und seinem Team.',
  personalHeading: 'Eine Anprobe. Ein Lächeln. Ein bisschen Samui.',
  personalText:
    'Kleidung auszuwählen soll sich so gut anfühlen, wie sie zu tragen. Lerne Mario und das Team kennen, entdeckt gemeinsam Stoffe und geniesse eine Anprobe, die von Anfang an persönlich ist.',
  features: ['Persönliche Beratung', 'Individuelle Passform', 'Für dich gemacht'],
  pause: 'Hintergrundanimation anhalten',
  play: 'Hintergrundanimation abspielen',
  draftNote: { video: 'Designentwurf · Hintergrund: Video', photos: 'Designentwurf · Hintergrund: animierte Fotos (noch kein Video)' },
};

/** Draft copy: EN (given) and DE; other languages fall back to English until reviewed. */
export const introTexts = (locale: Locale): IntroTexts => (locale === 'de' ? de : en);
