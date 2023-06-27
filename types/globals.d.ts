import { PostLike, Post, Comment, VisualMediaType } from '@prisma/client';
import type { DefaultUser } from 'next-auth';

declare global {
  interface CustomUser extends DefaultUser {
    handle: string;
    profilePhoto: string;
    coverPhoto: string;
  }
  type AnimationState = 'from' | 'to';

  interface PostType {
    id: number;
    content: string | null;
    createdAt: Date;
    postLikes: PostLike[];
    comments: Comment[];
    user: {
      id: string;
      name: string | null;
      profilePhoto: string | null;
    };
    visualMedia: {
      type: VisualMediaType;
      url: string;
    }[];
    _count: {
      comments: number;
      postLikes: number;
    };
  }
  interface VisualMedia {
    type: VisualMediaType;
    url: string;
  }

  interface PostLikePostRequestBody {
    postId: number;
  }
}
