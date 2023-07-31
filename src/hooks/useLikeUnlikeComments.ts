import { useCallback } from 'react';
import { useCommentLikesMutations } from './mutations/useCommentLikesMutations';
import { QueryKey } from '@tanstack/react-query';

export function useLikeUnlikeComments({ queryKey }: { queryKey: QueryKey }) {
  const { likeCommentMutation, unLikeCommentMutation } =
    useCommentLikesMutations({ queryKey });

  const likeComment = useCallback(({ commentId }: { commentId: number }) => {
    likeCommentMutation.mutate({ commentId });
  }, []);

  const unLikeComment = useCallback(({ commentId }: { commentId: number }) => {
    unLikeCommentMutation.mutate({ commentId });
  }, []);

  return { likeComment, unLikeComment };
}
