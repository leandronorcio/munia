'use client';

import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { chunk } from 'lodash';
import { POSTS_PER_PAGE } from '@/constants';
import { useSession } from 'next-auth/react';
import { PostIds } from '@/types/definitions';
import { useErrorNotifier } from '../useErrorNotifier';

export function useDeletePostMutation() {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const queryKey = ['users', session?.user.id, 'posts'];
  const { notifyError } = useErrorNotifier();

  const deleteMutation = useMutation({
    mutationFn: async ({ postId }: { postId: number }) => {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw Error('Failed to delete post.');
      }

      return (await res.json()) as { id: number };
    },
    onMutate: async ({ postId }) => {
      // Cancel any outgoing refetches
      await qc.cancelQueries({ queryKey });

      // Snapshot the previous posts
      const previousPosts = qc.getQueryData(queryKey);

      // Optimistically remove the post
      qc.setQueriesData<InfiniteData<PostIds>>({ queryKey }, (oldData) => {
        if (!oldData) return oldData;

        // Flatten the old pages first
        const oldPosts = oldData.pages.flat();

        // Remove the deleted post from the `oldPosts`
        const newPosts = oldPosts.filter((post) => post.id !== postId);

        // Chunk the `newPosts` depending on the number of posts per page
        const newPages = chunk(newPosts, POSTS_PER_PAGE);

        const newPageParams = [
          // The first `pageParam` is undefined as the initial page does not use a `pageParam`
          undefined,
          // Create the new `pageParams`, it must contain the id of each page's (except last page's) last post
          ...newPages.slice(0, -1).map((page) => page.at(-1)?.id),
        ];

        return {
          pages: newPages,
          pageParams: newPageParams,
        };
      });

      // Return a context object with the snapshotted value
      return { previousPosts };
    },
    onError: (error, variables, context) => {
      qc.setQueryData(queryKey, context?.previousPosts);
      notifyError(error);
    },
  });

  return { deleteMutation };
}
