import { FindCommentResult, GetComment } from 'types';

export const toGetComment = (
  findCommentResult: FindCommentResult,
): GetComment => {
  const { commentLikes, ...rest } = findCommentResult;
  const isLiked = commentLikes.length > 0;

  return {
    isLiked,
    ...rest,
  };
};
