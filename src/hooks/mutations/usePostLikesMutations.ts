'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { GetPost } from '@/types/definitions';

export function usePostLikesMutations({ postId }: { postId: number }) {
  const qc = useQueryClient();
  const queryKey = ['posts', postId];
  const { data: session } = useSession();

  const likeMutation = useMutation({
    mutationFn: async () => {
      // Add the post to the liked posts of the user doing the action
      const res = await fetch(`/api/users/${session?.user?.id}/liked-posts`, {
        method: 'POST',
        body: JSON.stringify({ postId }),
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
    onMutate: async () => {
      // Cancel any outgoing refetches
      await qc.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousPost = qc.getQueryData(queryKey);

      // Optimistically the post
      qc.setQueryData<GetPost>(queryKey, (oldPost) => {
        if (!oldPost) return oldPost;

        return {
          ...oldPost,
          _count: {
            ...oldPost._count,
            postLikes: oldPost._count.postLikes + 1,
          },
          isLiked: true,
        };
      });

      // Return a context object with the snapshotted value
      return { previousPost };
    },
    onError: (err, variables, context) => {
      qc.setQueryData(queryKey, context?.previousPost);
    },
  });

  const unLikeMutation = useMutation({
    mutationFn: async () => {
      // Remove the post from the liked posts of the user doing the action
      const res = await fetch(`/api/users/${session?.user?.id}/liked-posts/${postId}`, {
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
    onMutate: async () => {
      // Cancel any outgoing refetches
      await qc.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousPost = qc.getQueryData(queryKey);

      // Optimistically the post
      qc.setQueryData<GetPost>(queryKey, (oldPost) => {
        if (!oldPost) return oldPost;

        return {
          ...oldPost,
          _count: {
            ...oldPost._count,
            postLikes: oldPost._count.postLikes - 1,
          },
          isLiked: false,
        };
      });

      // Return a context object with the snapshotted value
      return { previousPost };
    },
    onError: (err, variables, context) => {
      qc.setQueryData(queryKey, context?.previousPost);
    },
  });

  return { likeMutation, unLikeMutation };
}
