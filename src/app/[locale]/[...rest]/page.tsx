import { notFound } from 'next/navigation';

/** Any unknown path below a language renders the localised 404 page inside the site layout. */
export default function CatchAll() {
  notFound();
}
