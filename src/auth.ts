import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from './lib/prisma/prisma';

declare module 'next-auth' {
  interface Session {
    user: { id: string; name: string };
  }
}

export const {
  auth,
  handlers: { GET, POST },
  signIn,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    ...authConfig.callbacks,
    session({ token, user, ...rest }) {
      return {
        /**
         * We need to explicitly return the `id` here to make it available to the client
         * when calling `useSession()` as NextAuth does not include the user's id.
         *
         * If you only need to get the `id` of the user in the client, use NextAuth's
         * `useSession()`, but if you need more of user's data, use the `useSessionUserData()`
         * custom hook instead.
         */
        user: {
          id: token.sub!,
        },
        expires: rest.session.expires,
      };
    },
  },
});
