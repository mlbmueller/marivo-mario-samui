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
  /** Landscape clip for desktop, e.g. '/video/intro-1920-v2.mp4' (H.264, muted). */
  src: string;
  /** Optional portrait/square clip for phones, e.g. '/video/intro-mobile.mp4'. */
  mobileSrc?: string;
  /** Still image shown immediately and whenever the video cannot play. */
  poster: MediaId;
};

export const introSlides: IntroSlide[] = [
  { media: 'detail-fabrics', focus: '55% 30%', mobileFocus: '55% 22%' }, // fabrics and the order sheet
  { media: 'team-group', focus: '50% 28%', mobileFocus: '50% 42%' }, // consultation: Mario and James with a customer
  { media: 'detail-measuring', focus: '58% 30%', mobileFocus: '60% 28%' }, // measuring
  { media: 'hero-consultation', focus: '42% 0%', mobileFocus: '45% 0%' }, // fitting and a smile
];

/** Real store footage supplied by the owner (4 Nov 2026), edited to a calm 17.5 s loop without sound. */
export const introVideo: IntroVideo | null = {
  src: '/video/intro-1920-v2.mp4',
  mobileSrc: '/video/intro-1280-v2.mp4',
  poster: 'intro-poster',
};

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


const fr: IntroTexts = {
  headline: ['L’esprit des vacances.', 'Taillé pour vous.'],
  text: 'Des vêtements sur mesure pour hommes et femmes, conçus avec Mario et son équipe.',
  personalHeading: 'Un essayage. Un sourire. Un peu de Samui.',
  personalText: 'Choisir ses vêtements doit être aussi agréable que les porter. Rencontrez Mario et l’équipe, découvrez les tissus ensemble et profitez d’un essayage personnel dès le premier instant.',
  features: ['Conseil personnel', 'Coupe individuelle', 'Fait pour vous'],
  pause: 'Mettre l’animation en pause',
  play: 'Lancer l’animation',
  draftNote: { video: 'Projet de design · fond : vidéo', photos: 'Projet de design · fond : photos animées' },
};

const it: IntroTexts = {
  headline: ['La sensazione della vacanza.', 'Su misura per te.'],
  text: 'Abiti su misura per uomo e donna, creati con Mario e il suo team.',
  personalHeading: 'Una prova. Un sorriso. Un po’ di Samui.',
  personalText: 'Scegliere i propri abiti deve essere bello quanto indossarli. Conosci Mario e il team, scoprite insieme i tessuti e goditi una prova personale fin dall’inizio.',
  features: ['Consulenza personale', 'Vestibilità individuale', 'Fatto per te'],
  pause: 'Metti in pausa l’animazione',
  play: 'Avvia l’animazione',
  draftNote: { video: 'Bozza di design · sfondo: video', photos: 'Bozza di design · sfondo: foto animate' },
};

const ru: IntroTexts = {
  headline: ['Ощущение отпуска.', 'Сшито для вас.'],
  text: 'Одежда на заказ для мужчин и женщин — лично от Марио и его команды.',
  personalHeading: 'Примерка. Улыбка. Немного Самуи.',
  personalText: 'Выбирать одежду должно быть так же приятно, как её носить. Познакомьтесь с Марио и командой, выберите ткани вместе и наслаждайтесь примеркой, которая с самого начала только ваша.',
  features: ['Личная консультация', 'Индивидуальная посадка', 'Сшито для вас'],
  pause: 'Остановить анимацию',
  play: 'Запустить анимацию',
  draftNote: { video: 'Дизайн-черновик · фон: видео', photos: 'Дизайн-черновик · фон: анимированные фото' },
};

const th: IntroTexts = {
  headline: ['บรรยากาศแห่งวันพักผ่อน', 'ตัดเย็บเพื่อคุณ'],
  text: 'เสื้อผ้าตัดตามสั่งสำหรับผู้ชายและผู้หญิง ดูแลโดยมาริโอและทีมงาน',
  personalHeading: 'ลองชุด ยิ้มได้ และกลิ่นอายสมุย',
  personalText: 'การเลือกเสื้อผ้าควรรู้สึกดีเหมือนตอนสวมใส่ มาพบมาริโอและทีมงาน เลือกผ้าด้วยกัน และสนุกกับการลองชุดที่เป็นส่วนตัวตั้งแต่เริ่มต้น',
  features: ['คำแนะนำส่วนตัว', 'ทรงพอดีตัว', 'ทำเพื่อคุณ'],
  pause: 'หยุดภาพเคลื่อนไหว',
  play: 'เล่นภาพเคลื่อนไหว',
  draftNote: { video: 'แบบร่างดีไซน์ · พื้นหลัง: วิดีโอ', photos: 'แบบร่างดีไซน์ · พื้นหลัง: ภาพเคลื่อนไหว' },
};

const byLocale: Partial<Record<Locale, IntroTexts>> = { en, de, fr, it, ru, th };

/** Draft copy in all site languages (English fallback). */
export const introTexts = (locale: Locale): IntroTexts => byLocale[locale] ?? en;
