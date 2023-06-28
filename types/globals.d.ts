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
    postLikes: {
      id: number;
    }[];
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
      postLikes: number;
      comments: number;
    };
  }

  interface VisualMedia {
    type: VisualMediaType;
    url: string;
  }

  interface PostPOSTRequestBody {
    content?: string;
    files?: Blob | Blob[];
  }

  interface PostLikePostRequestBody {
    postId: number;
  }

  interface CommentPOSTRequestBody {
    content: string;
  }

  interface CommentType {
    user: {
      id: string;
      name: string | null;
      profilePhoto: string | null;
    };
    id: number;
    content: string;
    createdAt: Date;
  }
}
