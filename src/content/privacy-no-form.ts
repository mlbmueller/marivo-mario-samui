import type { Locale } from './locales';

/**
 * Privacy notice for the reduced launch (no request form; see src/content/launch.ts).
 * Draft by the website team — to be reviewed by the owner. Available in all site languages.
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


const fr: Section[] = [
  { heading: 'Contact', text: 'Ce site n’a pas de formulaire de contact. Si vous nous écrivez sur WhatsApp ou appelez l’une de nos boutiques, nous utilisons vos données uniquement pour vous répondre et planifier votre consultation et vos essayages.' },
  { heading: 'WhatsApp et cartes', text: 'Les boutons WhatsApp et les liens de carte ouvrent des services externes (WhatsApp, Google Maps). Leurs propres règles de confidentialité s’y appliquent. Rien n’est chargé depuis ces services avant votre clic.' },
  { heading: 'Hébergement', text: 'Le site est hébergé par Vercel. Lors de votre visite, des données techniquement nécessaires, comme votre adresse IP et l’heure d’accès, sont traitées pour afficher les pages et les sécuriser.' },
  { heading: 'Aucun suivi', text: 'Ce site n’utilise ni cookies publicitaires ou analytiques, ni outils de suivi. Les polices sont chargées depuis notre propre site.' },
  { heading: 'Vos droits', text: 'Vous pouvez nous demander à tout moment quelles données nous détenons sur vous et les faire corriger ou supprimer. Contactez-nous sur WhatsApp ou par téléphone dans l’une de nos boutiques.' },
];

const it: Section[] = [
  { heading: 'Contatto', text: 'Questo sito non ha un modulo di contatto. Se ci scrivi su WhatsApp o chiami uno dei nostri negozi, usiamo i tuoi dati solo per risponderti e pianificare la consulenza e le prove.' },
  { heading: 'WhatsApp e mappe', text: 'I pulsanti WhatsApp e i link alle mappe aprono servizi esterni (WhatsApp, Google Maps), dove valgono le loro norme sulla privacy. Nulla viene caricato da questi servizi prima del tuo clic.' },
  { heading: 'Hosting', text: 'Il sito è ospitato da Vercel. Durante la visita vengono trattati dati tecnicamente necessari, come l’indirizzo IP e l’orario di accesso, per mostrare le pagine e mantenerle sicure.' },
  { heading: 'Nessun tracciamento', text: 'Questo sito non usa cookie pubblicitari o analitici né strumenti di tracciamento. I caratteri vengono caricati dal nostro sito.' },
  { heading: 'I tuoi diritti', text: 'Puoi chiederci in qualsiasi momento quali dati abbiamo su di te e farli correggere o cancellare. Contattaci su WhatsApp o per telefono in uno dei nostri negozi.' },
];

const ru: Section[] = [
  { heading: 'Связь', text: 'На этом сайте нет контактной формы. Если вы пишете нам в WhatsApp или звоните в один из магазинов, мы используем ваши данные только для ответа и планирования консультации и примерок.' },
  { heading: 'WhatsApp и карты', text: 'Кнопки WhatsApp и ссылки на карты открывают внешние сервисы (WhatsApp, Google Maps), где действуют их собственные правила конфиденциальности. До вашего нажатия с этих сервисов ничего не загружается.' },
  { heading: 'Хостинг', text: 'Сайт размещён у Vercel. При посещении обрабатываются технически необходимые данные, например IP-адрес и время доступа, чтобы показывать страницы и обеспечивать их безопасность.' },
  { heading: 'Без отслеживания', text: 'Сайт не использует рекламные или аналитические cookie и инструменты отслеживания. Шрифты загружаются с нашего собственного сайта.' },
  { heading: 'Ваши права', text: 'Вы можете в любое время узнать, какие данные о вас у нас есть, и попросить исправить или удалить их. Свяжитесь с нами в WhatsApp или по телефону одного из магазинов.' },
];

const th: Section[] = [
  { heading: 'การติดต่อ', text: 'เว็บไซต์นี้ไม่มีแบบฟอร์มติดต่อ หากคุณส่งข้อความหาเราทาง WhatsApp หรือโทรหาร้าน เราจะใช้ข้อมูลของคุณเพื่อตอบกลับและนัดหมายการปรึกษาและการลองชุดเท่านั้น' },
  { heading: 'WhatsApp และแผนที่', text: 'ปุ่ม WhatsApp และลิงก์แผนที่จะเปิดบริการภายนอก (WhatsApp, Google Maps) ซึ่งใช้นโยบายความเป็นส่วนตัวของบริการนั้น จะไม่มีการโหลดข้อมูลจากบริการเหล่านี้จนกว่าคุณจะคลิก' },
  { heading: 'โฮสติ้ง', text: 'เว็บไซต์นี้ให้บริการโดย Vercel เมื่อคุณเข้าชม จะมีการประมวลผลข้อมูลที่จำเป็นทางเทคนิค เช่น ที่อยู่ IP และเวลาเข้าใช้งาน เพื่อแสดงหน้าเว็บและรักษาความปลอดภัย' },
  { heading: 'ไม่มีการติดตาม', text: 'เว็บไซต์นี้ไม่ใช้คุกกี้โฆษณาหรือคุกกี้วิเคราะห์ และไม่ใช้เครื่องมือติดตาม ฟอนต์โหลดจากเว็บไซต์ของเราเอง' },
  { heading: 'สิทธิ์ของคุณ', text: 'คุณสามารถสอบถามได้ทุกเมื่อว่าเรามีข้อมูลใดของคุณ และขอให้แก้ไขหรือลบได้ ติดต่อเราทาง WhatsApp หรือโทรหาร้านของเรา' },
];

const byLocale: Partial<Record<Locale, Section[]>> = { en, de, fr, it, ru, th };

export function privacyNoFormSections(locale: Locale): Section[] {
  return byLocale[locale] ?? en;
}
