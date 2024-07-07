import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Facebook from 'next-auth/providers/facebook';
import Google from 'next-auth/providers/google';
import { NextResponse } from 'next/server';

export default {
  providers: [GitHub, Facebook, Google],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const { pathname, search } = nextUrl;
      const isLoggedIn = !!auth?.user;
      const isOnAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

      const unProtectedPages = ['/terms', '/privacy-policy']; // Add more here if needed
      const isOnUnprotectedPage =
        pathname === '/' || // The root page '/' is also an unprotected page
        unProtectedPages.some((page) => pathname.startsWith(page));
      const isProtectedPage = !isOnUnprotectedPage;

      if (isOnAuthPage) {
        // Redirect to /feed, if logged in and is on an auth page
        if (isLoggedIn) return NextResponse.redirect(new URL('/feed', nextUrl));
      } else if (isProtectedPage) {
        // Redirect to /login, if not logged in but is on a protected page
        if (!isLoggedIn) {
          const from = encodeURIComponent(pathname + search); // The /login page shall then use this `from` param as a `callbackUrl` upon successful sign in
          return NextResponse.redirect(new URL(`/login?from=${from}`, nextUrl));
        }
      }

      // Don't redirect if on an unprotected page, or if logged in and is on a protected page
      return true;
    },
  },
} satisfies NextAuthConfig;
