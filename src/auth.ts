import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/lib/prisma/prisma';
import { createSendEmailCommand } from '@/lib/ses/createSendEmailCommand';
import { sesClient } from '@/lib/ses/sesClient';

declare module 'next-auth' {
  interface Session {
    user: { id: string; name: string };
  }
}

// We are splitting the auth configuration into multiple files (`auth.config.ts` and `auth.ts`),
// as some adapters (Prisma) and Node APIs (`stream` module required for sending emails) are
// not supported in the Edge runtime. More info here: https://authjs.dev/guides/upgrade-to-v5
export const {
  auth,
  handlers: { GET, POST },
  signIn,
} = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    {
      // There's currently an issue with NextAuth that requires all these properties to be specified
      // even if we really only need the `sendVerificationRequest`: https://github.com/nextauthjs/next-auth/issues/8125
      id: 'email',
      type: 'email',
      name: 'Email',
      from: 'noreply@norcio.dev',
      server: {},
      maxAge: 24 * 60 * 60,
      options: {},
      async sendVerificationRequest({ identifier: email, url }) {
        const sendEmailCommand = createSendEmailCommand(
          email,
          'noreply@norcio.dev',
          'Login To Munia',
          `<body>
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style=" max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif;">
        Login to <strong>Munia</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="purple"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: black; text-decoration: none; border-radius: 5px; padding: 10px 20px; display: inline-block; font-weight: bold;">Login</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif;">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>`,
        );
        await sesClient.send(sendEmailCommand);
      },
    },
  ],
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
