/** Minimal user info from Prisma */
export type UserSummary = {
  id: string;
  username: string;
  name: string;
  profilePhoto: string | null;
};

/** Gender and relationship status enums (if not in Prisma) */
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type RelationshipStatus = 'SINGLE' | 'IN_RELATIONSHIP' | 'MARRIED' | 'COMPLICATED';

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
  coverPhoto?: string | null;
  followerCount: number | null;
  followingCount: number | null;
  isFollowing: boolean | null;
  email?: string | null;
  birthDate?: string | null;
  gender?: Gender | null;
  relationshipStatus?: RelationshipStatus | null;
  phoneNumber?: string | null;
  website?: string | null;
  address?: string | null;
}

/** Visual media types */
export type VisualMediaType = 'PHOTO' | 'VIDEO'; // Replace missing Prisma enum

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
  visualMedia: GetVisualMedia[]; // Use local type instead of Prisma VisualMedia
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
  type: string; // Replace Prisma enum if not available
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
