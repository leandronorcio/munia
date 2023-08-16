import {
  PostLike,
  Post,
  Comment,
  VisualMediaType,
  User,
  About,
  Follow,
  ActivityType,
} from '@prisma/client';

// Use this shortened type of `User`, when the other properties aren't necessary.
type UserSummary = Pick<User, 'id' | 'username' | 'name' | 'profilePhoto'>;

// Use this type when finding a User in prisma.
export interface FindUserResult extends User {
  followers: Follow[];
  _count: {
    following: number;
    followers: number;
  };
}

/**
 * The <FindUserResult> shall be converted to <GetUser>, use
 * the ./src/lib/prisma/toGetUser.ts function to do this.
 * <GetUser> must be the response type of GET users route handlers.
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
   * Use `postLikes` to store the <PostLike>'s id of the user to the Post.
   * If there is a <PostLike> id, that means the user requesting has
   * liked the Post.
   */
  postLikes: {
    id: number;
  }[];
  user: UserSummary;
  visualMedia: VisualMedia[];
  _count: {
    postLikes: number;
    comments: number;
  };
}

/**
 * The <FindPostResult> shall be converted to <GetPost>, use
 * the ./src/lib/prisma/toGetPost.ts function to do this.
 * <GetPost> must be the response type of GET posts route handlers.
 */
export interface GetPost {
  id: number;
  content: string | null;
  createdAt: Date;
  /**
   * The `isLiked` is used to check whether the authenticated user requesting
   * the post has liked it or not.
   */
  isLiked: boolean;
  user: UserSummary;
  visualMedia: VisualMedia[];
  _count: {
    postLikes: number;
    comments: number;
  };
}

/**
 * Use `PostIds` when rendering a list of <Post>'s, this type
 * must be passed to <Post>, and <Post> must use the `id` to
 * check for queried post data using this `queryKey` format:
 * ['posts', number] where number is the post's id
 */
export interface PostIds {
  id: number;
  commentsShown: boolean;
}

// Use this type when finding a Comment in prisma.
export interface FindCommentResult {
  id: number;
  content: string;
  createdAt: Date;
  userId: string;
  postId: number;
  parentId: number | null;
  user: {
    id: string;
    username: string | null;
    name: string | null;
    profilePhoto: string | null;
  };
  /**
   * Use `commentLikes` to store the <CommentLike>'s id of the user to the Comment.
   * If there is a <CommentLike> id, that means the user requesting has
   * liked the Comment.
   */
  commentLikes: {
    id: number;
  }[];
  _count: {
    commentLikes: number;
    replies: number;
  };
}

/**
 * The <FindCommentResult> shall be converted to <GetComment>, use
 * the ./src/lib/prisma/toGetComment.ts function to do this.
 * <GetComment> must be the response type of GET comments route handlers.
 */
export interface GetComment {
  id: number;
  postId: number;
  parentId: number | null;
  content: string;
  createdAt: Date;
  user: UserSummary;
  isLiked: boolean;
  _count: {
    commentLikes: number;
    replies: number;
  };
  repliesShown?: boolean;
}

export interface DiscoverFilters {
  gender?: 'MALE' | 'FEMALE' | 'NONBINARY';
  relationshipStatus?: 'SINGLE' | 'IN_A_RELATIONSHIP' | 'ENGAGED' | 'MARRIED';
}

interface GetActivity {
  id: number;
  type: ActivityType;
  sourceId: number | null;
  targetId: number | null;
  createdAt: Date;
  sourceUser: UserSummary;
  targetUser: UserSummary;
}
