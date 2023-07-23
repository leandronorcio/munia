'use client';

import { postsPerPage } from '@/contants';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { chunk } from 'lodash';
import { GetPost } from 'types';
import { useToast } from './useToast';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';

export function usePostsMutations({
  type,
  userId,
}: {
  type: 'profile' | 'feed';
  userId: string;
}) {
  const qc = useQueryClient();
  const { data: session } = useSession();
  const { showToast } = useToast();

  const deleteMutation = useMutation(
    async ({ postId }: { postId: number }) => {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw Error('Failed to delete post.');
      }

      return (await res.json()) as { id: number };
    },
    {
      onSuccess: ({ id: postId }) => {
        qc.setQueryData<InfiniteData<GetPost[]>>(
          ['users', userId, type, 'posts'],
          (oldData) => {
            if (!oldData) return;

            // Flatten the old pages first
            const oldPosts = oldData.pages.flat();

            // Remove the deleted post from the `oldPosts`
            const newPosts = oldPosts.filter((post) => post.id !== postId);

            // Chunk the `newPosts` depending on the number of posts per page
            const newPages = chunk(newPosts, postsPerPage);

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
          }
        );
      },
      onError: () => {
        showToast({ title: 'Unable to Delete', type: 'error' });
      },
    }
  );

  const likeUnlikeOptimisticSetter = ({
    postId,
    isLiked,
  }: {
    postId: number;
    isLiked: boolean;
  }) => {
    // Optimistically update the post that has been liked
    qc.setQueryData<InfiniteData<GetPost[]>>(
      ['users', userId, type, 'posts'],
      (oldData) => {
        if (!oldData) return;

        // Flatten the old pages
        const newPosts = oldData?.pages.flat();

        // Find the index of the post
        const index = newPosts.findIndex((post) => post.id === postId);

        // Get the value of the old post
        const oldPost = newPosts[index];

        newPosts[index] = {
          ...oldPost,
          // Update the `isLiked` property
          isLiked,
          // Update the `postLikes` count
          _count: {
            ...oldPost._count,
            postLikes: oldPost._count.postLikes + (isLiked ? 1 : -1),
          },
        };

        return {
          pages: chunk(newPosts, postsPerPage),
          pageParams: oldData.pageParams,
        };
      }
    );
  };

  const likeMutation = useMutation(
    // The `postId` will be automatically passed to `onMutate` callback
    async ({ postId }: { postId: number }) => {
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
    {
      onMutate: async ({ postId }) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await qc.cancelQueries({ queryKey: ['users', userId, type, 'posts'] });

        // Snapshot the previous value
        const previousPosts = qc.getQueryData(['users', userId, type, 'posts']);

        // Optimistically update posts
        likeUnlikeOptimisticSetter({ postId, isLiked: true });

        // Return a context object with the snapshotted value
        return { previousPosts };
      },
      onError: (err, { postId }, context) => {
        qc.setQueryData(
          ['users', userId, type, 'posts'],
          context?.previousPosts
        );
      },
    }
  );

  const unLikeMutation = useMutation(
    // The `postId` will be automatically passed to `onMutate` callback
    async ({ postId }: { postId: number }) => {
      // Remove the post from the liked posts of the user doing the action
      const res = await fetch(
        `/api/users/${session?.user?.id}/liked-posts/${postId}`,
        {
          method: 'DELETE',
        }
      );

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
    {
      onMutate: async ({ postId }) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await qc.cancelQueries({ queryKey: ['users', userId, type, 'posts'] });

        // Snapshot the previous value
        const previousPosts = qc.getQueryData(['users', userId, type, 'posts']);

        // Optimistically update posts
        likeUnlikeOptimisticSetter({ postId, isLiked: false });

        // Return a context object with the snapshotted value
        return { previousPosts };
      },
      onError: (err, { postId }, context) => {
        qc.setQueryData(
          ['users', userId, type, 'posts'],
          context?.previousPosts
        );
      },
    }
  );

  const toggleComments = useCallback(async (postId: number) => {
    qc.setQueryData<InfiniteData<GetPost[]>>(
      ['users', userId, type, 'posts'],
      (oldData) => {
        if (!oldData) return;

        // Flatten the old pages
        const newPosts = oldData?.pages.flat();

        // Find the index of the post
        const index = newPosts.findIndex((post) => post.id === postId);

        // Get the value of the old post
        const oldPost = newPosts[index];

        // Toggle the `commentsShown` boolean property of the target post
        newPosts[index] = {
          ...oldPost,
          commentsShown: !oldPost.commentsShown,
        };

        return {
          pages: chunk(newPosts, postsPerPage),
          pageParams: oldData.pageParams,
        };
      }
    );
  }, []);

  return { deleteMutation, likeMutation, unLikeMutation, toggleComments };
}
