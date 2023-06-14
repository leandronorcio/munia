import type { DefaultUser } from 'next-auth';

declare global {
  interface CustomUser extends DefaultUser {
    handle: string;
    profilePhoto: string;
    coverPhoto: string;
  }
}
