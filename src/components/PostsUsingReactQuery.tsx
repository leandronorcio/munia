'use client';

import {
  InfiniteData,
  QueryFunction,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { GetPost, VisualMedia } from 'types';
import { CreatePostModalLauncher } from './CreatePostModalLauncher';
import { useCallback, useEffect, useRef } from 'react';
import useOnScreen from '@/hooks/useOnScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { Post } from './Post';
import { postsPerPage } from '@/contants';
import { useCreatePost } from '@/hooks/useCreatePost';
import { useToast } from '@/hooks/useToast';
import { chunk } from 'lodash';

export function PostsUsingReactQuery({
  type,
  userId,
  shouldShowCreatePost,
}: {
  type: 'profile' | 'feed';
  userId: string;
  shouldShowCreatePost: boolean;
}) {
  const qc = useQueryClient();
  const bottomElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(bottomElRef);
  const { launchEditPost } = useCreatePost();
  const { showToast } = useToast();

  const fetchPosts: QueryFunction<GetPost[]> = async ({ pageParam = 0 }) => {
    const params = new URLSearchParams();
    params.set('limit', postsPerPage.toString());
    params.set('cursor', pageParam.toString());

    const res = await fetch(`/api/users/${userId}/posts?${params.toString()}`);

    if (!res.ok) {
      throw Error('Failed to load posts.');
    }

    return (await res.json()) as GetPost[];
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['users', userId, type, 'posts'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, pages) => {
      // If the last page doesn't have posts, that means the end is reached
      if (lastPage.length === 0) return undefined;

      // Return the id of the last post, this will serve as the cursor
      // that will be passed to `fetchPosts()` when calling `fetchNextPage()`
      return lastPage.slice(-1)[0].id;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!isBottomOnScreen) return;
    if (!data) return;
    if (!hasNextPage) return;

    fetchNextPage();
  }, [isBottomOnScreen]);

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

  const deletePost = useCallback((postId: number) => {
    deleteMutation.mutate({ postId });
  }, []);

  const editPost = useCallback(
    ({
      postId,
      content,
      visualMedia,
    }: {
      postId: number;
      content: string;
      visualMedia?: VisualMedia[];
    }) => {
      launchEditPost({
        postId,
        initialContent: content,
        initialVisualMedia: visualMedia || [],
        onSuccess: () => {},
      });
    },
    []
  );

  const likePost = useCallback(async (postId: number) => {}, []);

  const unLikePost = useCallback(async (postId: number) => {}, []);

  return (
    <div className="flex flex-col justify-between">
      <div className="flex flex-col">
        {shouldShowCreatePost && (
          <CreatePostModalLauncher onSuccess={(post) => {}} />
        )}

        {status === 'loading' ? (
          <p>Loading posts...</p>
        ) : status === 'error' ? (
          <p>Error loading posts.</p>
        ) : (
          <AnimatePresence>
            {data.pages.flat().map((post) => (
              <motion.div
                initial={false}
                animate={{ height: 'auto', marginTop: '32px', opacity: 1 }}
                exit={{ height: 0, marginTop: '0px', opacity: 0 }}
                style={{ originY: 0, overflowY: 'hidden' }}
                transition={{ duration: 0.5 }}
                key={post.id}
              >
                <Post
                  {...post}
                  {...{ likePost, unLikePost, editPost, deletePost }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      <div className="mt-6" ref={bottomElRef}>
        {isFetchingNextPage ? 'Loading more...' : 'No more to load.'}
      </div>
    </div>
  );
}
