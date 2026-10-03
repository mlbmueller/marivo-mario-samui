import { dictionaries, locales } from '@/content/locales';
import { NotFoundContent } from '@/components/NotFoundContent';

/** 404 inside a language. The client part picks the texts matching the URL prefix. */
export default function NotFound() {
  const texts = Object.fromEntries(locales.map((l) => [l, dictionaries[l].notFound]));
  return <NotFoundContent texts={texts} />;
}
