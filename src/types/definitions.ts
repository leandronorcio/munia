import { VisualMediaType, User, Follow, ActivityType, Gender, VisualMedia, RelationshipStatus } from '@prisma/client';

/** Minimal user info from Prisma */
export type UserSummary = Pick<User, 'id' | 'username' | 'name' | 'profilePhoto'>;

/** After initial setup, `username` and `name` are guaranteed non-null */
export interface UserSummaryAfterSetUp {
  id: string;
  username: string;
  name: string;
  profilePhoto: string | null;
}

/** Full user after setup (used for `GetUser` and API responses) */
export interface UserAfterSetUp {
  id: string;
  username: string;
  name: string;
  profilePhoto: string | null;
}

/** Type returned by Prisma for `user.findMany` or `user.findFirst` */
export type FindUserResult = {
  id: string;
  username: string | null;
  name: string | null;
  profilePhoto: string | null;
  _count: {
    followers: number;
    following: number;
  };
  followers: { followerId: string }[];
};

/** User API response */
export interface GetUser extends UserAfterSetUp {
  bio?: string | null;
  coverPhoto?: string | null; // optional cover photo
  followerCount: number | null;
  followingCount: number | null;
  isFollowing: boolean | null; // true when current user is following
}

/** Visual media types */
export interface GetVisualMedia {
  type: VisualMediaType;
  url: string;
}

export interface VisualMediaModalType {
  visualMedia: GetVisualMedia[];
  initialSlide: number;
}

/** Post types */
export interface FindPostResult {
  id: number;
  content: string | null;
  createdAt: Date;
  postLikes: { id: number }[];
  user: UserSummary;
  visualMedia: VisualMedia[];
  _count: { postLikes: number; comments: number };
}

export interface GetPost {
  id: number;
  content: string | null;
  createdAt: Date;
  isLiked: boolean;
  user: UserSummaryAfterSetUp;
  visualMedia: GetVisualMedia[];
  _count: { postLikes: number; comments: number };
}

export interface PostId {
  id: number;
  commentsShown: boolean;
}

export type PostIds = PostId[];

/** Comment types */
export interface FindCommentResult {
  id: number;
  content: string;
  createdAt: Date;
  userId: string;
  postId: number;
  parentId: number | null;
  user: UserSummary;
  commentLikes: { id: number }[];
  _count: { commentLikes: number; replies: number };
}

export interface GetComment {
  id: number;
  postId: number;
  parentId: number | null;
  content: string;
  createdAt: Date;
  user: UserSummaryAfterSetUp;
  isLiked: boolean;
  _count: { commentLikes: number; replies: number };
  repliesShown?: boolean;
}

/** Discover filters */
export type DiscoverFilterKeys = 'gender' | 'relationship-status';
export interface DiscoverFilters {
  gender?: Gender;
  'relationship-status'?: RelationshipStatus;
}

/** Activity types */
export interface FindActivityResult {
  id: number;
  type: ActivityType;
  sourceId: number;
  targetId: number | null;
  createdAt: Date;
  isNotificationRead: boolean;
  sourceUser: UserSummary & { gender: Gender | null };
  targetUser: UserSummary & { gender: Gender | null };
}

export type FindActivityResults = FindActivityResult[];

export interface GetActivity extends FindActivityResult {
  sourceUser: UserSummaryAfterSetUp & { gender: Gender | null };
  targetUser: UserSummaryAfterSetUp & { gender: Gender | null };
  content?: string | null;
}

export type GetActivities = GetActivity[];
