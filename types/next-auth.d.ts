import type { DefaultUser } from 'next-auth';
import { CustomUser } from '.';

declare module 'next-auth' {
  interface Session {
    user?: CustomUser;
  }
}
