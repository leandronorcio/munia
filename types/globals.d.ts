import { PostLike, Post } from '@prisma/client';
import type { DefaultUser } from 'next-auth';

declare global {
  interface CustomUser extends DefaultUser {
    handle: string;
    profilePhoto: string;
    coverPhoto: string;
  }
  type AnimationState = 'from' | 'to';

  interface PostType extends Post {
    user: {
      name: string | null;
      profilePhoto: string | null;
    };
    visualMedia: {
      type: VisualMediaType;
      url: string;
    }[];
    _count: {
      postLikes: number;
      comments: number;
    };
  }
  interface VisualMedia {
    type: VisualMediaType;
    url: string;
  }
}
