import {
  PostLike,
  Post,
  Comment,
  VisualMediaType,
  User,
  About,
} from '@prisma/client';
import type { DefaultUser } from 'next-auth';

export interface CustomUser extends DefaultUser, User {}

export interface PostType {
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

export interface VisualMedia {
  type: VisualMediaType;
  url: string;
}

export interface PostPOSTRequestBody {
  content?: string;
  files?: Blob | Blob[];
}

export interface CommentPOSTRequestBody {
  content: string;
}

export interface CommentPUTRequestBody {
  content: string;
}

export interface CommentType {
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
