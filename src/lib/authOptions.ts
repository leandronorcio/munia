import prisma from '@/lib/prisma/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import FacebookProvider from 'next-auth/providers/facebook';
import EmailProvider from 'next-auth/providers/email';
import type { Adapter } from 'next-auth/adapters';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  pages: {
    signIn: '/login',
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token }) => {
      // You can add something to the token here, it will be passed to the session.
      // https://next-auth.js.org/configuration/callbacks#jwt-callback
      return token;
    },
    session: async ({ session, token }) => {
      /**
       * Why not get and persist the entire user data to `session.user` here?
       *
       * Every time the session is checked, this callback function is
       * invoked, thus calling the db here would be inefficient as the
       * session is checked multiple times by different components.
       *
       * If you need the other data of the current logged in user, use the
       * `useUserData()` hook instead. But if you only need to get the
       * `id`, `name`, `email` and `image` of the user, use NextAuth's
       * `useSession()` instead.
       */
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  events: {
    createUser: async (message) => {
      const { user } = message;
      // Add the user id as the default username.
      const res = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          username: user.id,
        },
      });

      if (!res) {
        throw new Error('Failed to add username to the newly created account.');
      }
    },
  },
};
