import type { DefaultUser } from 'next-auth';

declare global {
  interface CustomUser extends DefaultUser {
    handle: string;
    profilePhoto: string;
    coverPhoto: string;
  }
  type AnimationState = 'from' | 'to';
  interface VisualMedia {
    type: 'photo' | 'video';
    url: string;
  }
}
