import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { GetComment } from '@/types/definitions';
import { useErrorNotifier } from '../useErrorNotifier';

// Use this hook for getting the mutations for updating and deleting comments/replies.
export function useUpdateDeleteCommentMutations({ queryKey }: { queryKey: QueryKey }) {
  const qc = useQueryClient();
  const { notifyError } = useErrorNotifier();

  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: number; content: string }) => {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error(res.statusText);
      return (await res.json()) as GetComment;
    },
    onMutate: async ({ commentId, content }) => {
      // Cancel outgoing queries
      await qc.cancelQueries({ queryKey });

      // Snapshot the previous comments
      const prevComments = qc.getQueryData(queryKey);

      // Optimistically update the comment
      qc.setQueryData<GetComment[]>(queryKey, (oldComments) => {
        if (!oldComments) return oldComments;

        // Make a shallow copy of the `oldComments`
        const newComments = [...oldComments];

        // Find the index of the updated comment
        const index = newComments.findIndex((comment) => comment.id === commentId);

        // Update the comment
        newComments[index] = {
          ...newComments[index],
          content,
        };

        return newComments;
      });

      // Return a `context` with the previous comments
      return { prevComments };
    },
    onError: (error, variables, context) => {
      // Revert back to the snapshotted value when there's an error
      qc.setQueryData(queryKey, context?.prevComments);
      notifyError(error);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async ({ commentId }: { commentId: number }) => {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error deleting comment.');
      return (await res.json()) as { id: number };
    },
    onMutate: async ({ commentId }) => {
      await qc.cancelQueries({ queryKey });

      // Snapshot the previous value
      const prevComments = qc.getQueryData(queryKey);

      // Optimistically remove the comment
      qc.setQueryData<GetComment[]>(queryKey, (oldComments) => {
        if (!oldComments) return oldComments;

        // Remove the deleted comment and return the new comments
        return oldComments.filter((comment) => comment.id !== commentId);
      });

      // Return a `context` with the previous comments
      return { prevComments };
    },
    onError: (error, variables, context) => {
      // Revert back to the snapshotted value when there's an error
      qc.setQueryData(queryKey, context?.prevComments);
      notifyError(error);
    },
  });

  return {
    updateCommentMutation,
    deleteCommentMutation,
  };
}
