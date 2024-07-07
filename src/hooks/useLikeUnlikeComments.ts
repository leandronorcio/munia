import { QueryKey } from '@tanstack/react-query';
import { useCommentLikesMutations } from './mutations/useCommentLikesMutations';

export function useLikeUnlikeComments({ queryKey }: { queryKey: QueryKey }) {
  const { likeCommentMutation, unLikeCommentMutation } = useCommentLikesMutations({ queryKey });

  const likeComment = ({ commentId }: { commentId: number }) => {
    likeCommentMutation.mutate({ commentId });
  };

  const unLikeComment = ({ commentId }: { commentId: number }) => {
    unLikeCommentMutation.mutate({ commentId });
  };

  return { likeComment, unLikeComment };
}
