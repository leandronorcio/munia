import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const token = await getToken({ req: request });
    const isAuthenticated = !!token;
    const isAuthPage =
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname.startsWith('/register');

    // If path is the root page, do nothing.
    // This'll let the root layout to render
    // either the @onboarding page or the (feed).
    if (path === '/') return null;

    // If path is an auth page.
    if (isAuthPage) {
      // If in auth page but logged in, send to home page.
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Do nothing if not logged in.
      return null;
    }

    // If path is not an auth page and not logged in, send to login page.
    if (!isAuthenticated) {
      let from = path;
      if (request.nextUrl.search) {
        from += request.nextUrl.search;
      }
      const loginUrl = new URL('/login', request.url);
      // Add ?from=/incoming-url to the /login URL
      loginUrl.searchParams.set('from', from);
      return NextResponse.redirect(loginUrl);
    }
  },
  {
    callbacks: {
      // Return true here so that the middleware function is always called.
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (user photos)
     * - default-profile-photo.jpg
     */
    '/((?!api|_next/static|_next/image|favicon.ico|uploads|default-profile-photo.jpg).*)',
  ],
};
