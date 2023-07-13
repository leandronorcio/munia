import {
  PostLike,
  Post,
  Comment,
  VisualMediaType,
  User,
  About,
  Follow,
} from '@prisma/client';
import type { DefaultUser } from 'next-auth';

export interface CustomUser extends DefaultUser, User {}

// Use this type when finding a User in prisma.
export interface FindUserResult extends User {
  followers: Follow[];
  _count: {
    following: number;
    followers: number;
  };
}

/**
 * The FindUserResult shall be converted to GetUser, use
 * the ./src/lib/prisma/toGetUser.ts function to do this.
 * GetUser must be the response of GET users route handlers.
 */
export interface GetUser extends User {
  followerCount: number | null;
  followingCount: number | null;
  isFollowing: boolean | null; // true when the authenticated user is following the user being requested
}

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

export interface CommentType {
  id: number;
  content: string;
  createdAt: Date;
  postId: number;
  user: {
    id: string;
    username: string | null;
    name: string | null;
    profilePhoto: string | null;
  };
}
