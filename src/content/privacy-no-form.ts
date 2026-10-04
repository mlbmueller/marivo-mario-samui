import type { Locale } from './locales';

/**
 * Privacy notice for the reduced launch (no request form; see src/content/launch.ts).
 * Draft by the website team — to be reviewed by the owner. Only EN/DE are routed in
 * production; other languages fall back to English.
 */
type Section = { heading: string; text: string };

const en: Section[] = [
  {
    heading: 'Contact',
    text: 'This website has no contact form. If you write to us on WhatsApp or call one of our stores, we use your details only to answer you and to plan your consultation and fittings.',
  },
  {
    heading: 'WhatsApp and maps',
    text: 'WhatsApp buttons and map links open external services (WhatsApp, Google Maps). Their own privacy policies apply there. Nothing is loaded from these services until you click.',
  },
  {
    heading: 'Hosting',
    text: 'The website is hosted by Vercel. When you visit it, technically necessary data such as your IP address and the time of access is processed to deliver the pages and to keep them secure.',
  },
  {
    heading: 'No tracking',
    text: 'This website uses no advertising or analytics cookies and no tracking tools. Fonts are served from our own website.',
  },
  {
    heading: 'Your rights',
    text: 'You can ask us at any time which data we hold about you and ask us to correct or delete it. Contact us on WhatsApp or by phone at one of our stores.',
  },
];

const de: Section[] = [
  {
    heading: 'Kontakt',
    text: 'Diese Webseite hat kein Kontaktformular. Wenn du uns auf WhatsApp schreibst oder in einem unserer Geschäfte anrufst, verwenden wir deine Angaben nur, um dir zu antworten und deine Beratung und Anproben zu planen.',
  },
  {
    heading: 'WhatsApp und Karten',
    text: 'WhatsApp-Knöpfe und Kartenlinks öffnen externe Dienste (WhatsApp, Google Maps). Dort gelten deren eigene Datenschutzbestimmungen. Bevor du klickst, wird von diesen Diensten nichts geladen.',
  },
  {
    heading: 'Hosting',
    text: 'Die Webseite wird bei Vercel betrieben. Beim Besuch werden technisch notwendige Daten wie deine IP-Adresse und der Zeitpunkt des Zugriffs verarbeitet, um die Seiten auszuliefern und sicher zu betreiben.',
  },
  {
    heading: 'Kein Tracking',
    text: 'Diese Webseite verwendet keine Werbe- oder Analyse-Cookies und keine Tracking-Werkzeuge. Schriften werden von unserer eigenen Webseite geladen.',
  },
  {
    heading: 'Deine Rechte',
    text: 'Du kannst uns jederzeit fragen, welche Daten wir über dich haben, und sie berichtigen oder löschen lassen. Melde dich dafür per WhatsApp oder telefonisch in einem unserer Geschäfte.',
  },
];

export function privacyNoFormSections(locale: Locale): Section[] {
  return locale === 'de' ? de : en;
}
