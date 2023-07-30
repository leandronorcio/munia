import { useMutation } from '@tanstack/react-query';
import { GetComment } from 'types';

export function useCommentsMutations() {
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
        throw new Error('Error creating comment.');
      }

      return (await res.json()) as GetComment;
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: async ({
      parentId,
      content,
    }: {
      parentId: number;
      content: string;
    }) => {
      const res = await fetch(`/api/comments/${parentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
        }),
      });

      if (!res.ok) {
        throw new Error('Error creating comment.');
      }

      return (await res.json()) as GetComment;
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
        throw new Error('Error updating comment.');
      }

      return (await res.json()) as GetComment;
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async ({ commentId }: { commentId: number }) => {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Error deleting comment.');
      }

      return (await res.json()) as { id: number };
    },
  });

  return {
    createCommentMutation,
    createReplyMutation,
    updateCommentMutation,
    deleteCommentMutation,
  };
}
