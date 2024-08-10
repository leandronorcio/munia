import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { GetComment } from '@/types/definitions';

export function useCommentLikesMutations({ queryKey }: { queryKey: QueryKey }) {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user.id;

  const likeUnlikeOptimisticSetter = ({ commentId, isLiked }: { commentId: number; isLiked: boolean }) => {
    qc.setQueryData<GetComment[]>(queryKey, (oldComments) => {
      if (!oldComments) return oldComments;

      // Make a shallow copy of `oldComments`
      const newComments = [...oldComments];

      // Find the index of the comment to update
      const index = newComments.findIndex((comment) => comment.id === commentId);
      const oldComment = newComments[index];

      // Update the comment's `isLiked` property
      newComments[index] = {
        ...oldComment,
        isLiked,
        _count: {
          ...oldComment._count,
          commentLikes: oldComment._count.commentLikes + (isLiked ? 1 : -1),
        },
      };

      return newComments;
    });
  };

  const likeCommentMutation = useMutation({
    mutationFn: async ({ commentId }: { commentId: number }) => {
      const res = await fetch(`/api/users/${userId}/liked-comments`, {
        method: 'POST',
        body: JSON.stringify({ commentId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        /**
         * No need to throw an error when there is a 409 conflict.
         * Why? Trying to like an already liked post should not
         * roll back the optimistic LIKE mutation.
         */
        if (res.status === 409) return true;
        throw Error('Error liking post.');
      }

      return true;
    },
    onMutate: async ({ commentId }) => {
      // Cancel any outgoing refetches
      await qc.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousComments = qc.getQueryData(queryKey);

      // Optimistically update posts
      likeUnlikeOptimisticSetter({ commentId, isLiked: true });

      // Return a context object with the snapshotted value
      return { previousComments };
    },
    onError: (err, _, context) => {
      qc.setQueryData(queryKey, context?.previousComments);
    },
  });

  const unLikeCommentMutation = useMutation({
    mutationFn: async ({ commentId }: { commentId: number }) => {
      const res = await fetch(`/api/users/${userId}/liked-comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        /**
         * No need to throw an error when there is a 409 conflict.
         * Why? Trying to unlike a post that is not liked yet should
         * NOT roll back the optimistic UNLIKE mutation.
         */
        if (res.status === 409) return true;
        throw Error('Error unliking post.');
      }

      return true;
    },
    onMutate: async ({ commentId }) => {
      // Cancel any outgoing refetches
      await qc.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousComments = qc.getQueryData(queryKey);

      // Optimistically update posts
      likeUnlikeOptimisticSetter({ commentId, isLiked: false });

      // Return a context object with the snapshotted value
      return { previousComments };
    },
    onError: (err, _, context) => {
      qc.setQueryData(queryKey, context?.previousComments);
    },
  });

  return { likeCommentMutation, unLikeCommentMutation };
}
