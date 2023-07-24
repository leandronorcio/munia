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

export interface VisualMedia {
  type: VisualMediaType;
  url: string;
}

// Use this type when finding a Post in prisma.
export interface FindPostResult {
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
    username: string | null;
    name: string | null;
    profilePhoto: string | null;
  };
  visualMedia: VisualMedia[];
  _count: {
    postLikes: number;
    comments: number;
  };
}

/**
 * The FindPostResult shall be converted to GetPost, use
 * the ./src/lib/prisma/toGetPost.ts function to do this.
 * GetPost must be the response of GET posts route handlers.
 */
export interface GetPost {
  id: number;
  content: string | null;
  createdAt: Date;
  /**
   * `The isLiked` is used to check whether the authenticated user requesting
   * the post has liked it or not.
   */
  isLiked: boolean;
  user: {
    id: string;
    username: string | null;
    name: string | null;
    profilePhoto: string | null;
  };
  visualMedia: VisualMedia[];
  _count: {
    postLikes: number;
    comments: number;
  };
  commentsShown?: boolean;
}

export interface GetComment {
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

export interface DiscoverFilters {
  gender?: 'male' | 'female' | 'nonbinary';
  relationshipStatus?: 'single' | 'in-a-relationship' | 'engaged' | 'married';
}
