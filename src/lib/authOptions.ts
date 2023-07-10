import prisma from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import FacebookProvider from 'next-auth/providers/facebook';
import EmailProvider from 'next-auth/providers/email';
import type { Adapter } from 'next-auth/adapters';
import type { NextAuthOptions } from 'next-auth';
import { CustomUser } from 'types';

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
    session: async ({ token, session }) => {
      let user: CustomUser | null = null;
      if (token) {
        // Retrieve user from the database using the token.
        user = await prisma.user.findFirst({
          where: {
            id: token.sub,
          },
        });
      }

      return {
        ...session,
        // Pass the retrieved user object to the client.
        user: user || undefined,
      };
    },
  },
};
