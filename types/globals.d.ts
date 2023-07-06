import {
  PostLike,
  Post,
  Comment,
  VisualMediaType,
  User,
  About,
} from '@prisma/client';
import type { DefaultUser } from 'next-auth';

declare global {
  interface CustomUser extends DefaultUser, User {}
  type AnimationState = 'from' | 'to';

  interface PostType {
    id: number;
    content: string | null;
    createdAt: Date;
    /**
     * Use postLikes to store the <PostLike>'s id of the user to the Post.
     * If there is a <PostLike> id, that means the user requesting has
     * liked the Post.
     */
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

  interface PostPUTRequestBody {
    content?: string;
    files?: Blob | Blob[];
  }

  interface PostLikePostRequestBody {
    postId: number;
  }

  interface CommentPOSTRequestBody {
    content: string;
  }

  interface CommentPUTRequestBody {
    content: string;
  }

  interface CommentType {
    id: number;
    content: string;
    createdAt: Date;
    postId: number;
    user: {
      id: string;
      name: string | null;
      profilePhoto: string | null;
    };
  }
}
