import { includeUserSummary } from './includeUserSummary';

export const includeToComment = (userId?: string) => ({
  /**
   * The `commentLikes` will only be used to check whether
   * the requestee has liked the comment or not.
   */
  commentLikes: {
    select: {
      id: true,
    },
    where: {
      userId,
    },
  },
  _count: {
    select: {
      commentLikes: true,
      replies: true,
    },
  },
  ...includeUserSummary(),
});
