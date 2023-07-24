import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { GetComment } from 'types';
import { useToast } from '../useToast';
import { Dispatch, SetStateAction } from 'react';

export function useCommentsMutations(
  queryKey: QueryKey,
  setCommentText: Dispatch<SetStateAction<string>>
) {
  const qc = useQueryClient();
  const { showToast } = useToast();

  const createCommentMutation = useMutation({
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: number;
      content: string;
    }) => {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
        }),
      });

      if (!res.ok) {
        throw new Error('Error Creating Comment');
      }

      return (await res.json()) as GetComment;
    },

    onSuccess: (createdPost) => {
      qc.setQueryData<GetComment[]>(queryKey, (oldComments) => {
        if (!oldComments) return;
        return [...oldComments, createdPost];
      });

      setCommentText('');
    },

    onError: (err: Error) => {
      showToast({ type: 'error', title: err.message });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: content }),
      });

      if (!res.ok) {
        throw new Error('Error Updating Comment');
      }

      return (await res.json()) as GetComment;
    },

    onMutate: async ({ commentId, content }) => {
      await qc.cancelQueries({ queryKey: queryKey });

      // Snapshot the previous value
      const prevComments = qc.getQueryData(queryKey);

      // Optimistically update
      qc.setQueryData<GetComment[]>(queryKey, (oldComments) => {
        if (!oldComments) return;

        // Make a shallow copy of the `oldComments`
        const newComments = [...oldComments];

        // Find the index of the updated comment
        const index = newComments.findIndex(
          (comment) => comment.id === commentId
        );

        // Update the comment
        newComments[index] = {
          ...newComments[index],
          content,
        };

        // Return the updated data
        return newComments;
      });

      // Return a context object with the snapshotted value
      return { prevComments };
    },

    onError: (err: Error, variables, context) => {
      qc.setQueryData(queryKey, context?.prevComments);
      showToast({ type: 'error', title: err.message });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async ({ commentId }: { commentId: number }) => {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Error Deleting Comment');
      }

      return (await res.json()) as { id: number };
    },

    onMutate: async ({ commentId }) => {
      await qc.cancelQueries({ queryKey: queryKey });

      // Snapshot the previous value
      const prevComments = qc.getQueryData(queryKey);

      // Optimistically remove
      qc.setQueryData<GetComment[]>(queryKey, (oldComments) => {
        if (!oldComments) return;

        // Remove the deleted comment and return the new comments
        return oldComments.filter((comment) => comment.id !== commentId);
      });

      return {
        prevComments,
      };
    },

    onError: (err: Error, variables, context) => {
      qc.setQueryData(queryKey, context?.prevComments);
      showToast({ type: 'error', title: err.message });
    },
  });

  return {
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
  };
}
