import { NextResponse, type NextRequest } from 'next/server';
import { HOLDING, holdingDecision } from '@/lib/holding';

/** Shows the coming-soon page on the public domain while the full site is prepared. */
export function proxy(request: NextRequest) {
  const decision = holdingDecision(request.headers.get('host'), request.nextUrl.pathname);
  switch (decision.action) {
    case 'rewrite':
      return NextResponse.rewrite(new URL(HOLDING.path, request.url));
    case 'redirect-home':
      return NextResponse.redirect(new URL('/', request.url), 307);
    case 'not-found':
      return new NextResponse('Not found', { status: 404 });
    default:
      return NextResponse.next();
  }
}

export const config = {
  // Skip Next's static files; everything else is checked (cheap host comparison).
  matcher: ['/((?!_next/static|_next/image).*)'],
};
