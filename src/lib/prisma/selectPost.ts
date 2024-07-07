import { includeUserSummary } from './includeUserSummary';

export const selectPost = (userId: string | undefined) => ({
  id: true,
  content: true,
  createdAt: true,
  ...includeUserSummary(),
  visualMedia: true,
  /**
   * Use postLikes to store the <PostLike>'s id of the user to the Post.
   * If there is a <PostLike> id, that means the user requesting has
   * liked the Post.
   */
  postLikes: {
    select: {
      id: true,
    },
    where: {
      userId,
    },
  },
  _count: {
    select: {
      postLikes: true,
      comments: true,
    },
  },
});
