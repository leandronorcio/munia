'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { VisualMedia } from 'types';
import { useCallback, useEffect, useRef } from 'react';
import useOnScreen from '@/hooks/useOnScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { Post } from './Post';
import { useCreatePost } from '@/hooks/useCreatePost';
import { usePostsMutations } from '@/hooks/mutations/usePostsMutations';
import { fetchPosts } from '@/lib/query-functions/fetchPosts';
import { AllCaughtUp } from './AllCaughtUp';

export function Posts({
  type,
  userId,
}: {
  type: 'profile' | 'feed';
  userId: string;
}) {
  const { deleteMutation, likeMutation, unLikeMutation, toggleComments } =
    usePostsMutations({
      type,
      userId,
    });
  const bottomElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(bottomElRef);
  const { launchEditPost } = useCreatePost();

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
    queryFn: ({ pageParam }) => fetchPosts({ pageParam, userId }),
    getNextPageParam: (lastPage, pages) => {
      // If the `pages` `length` is 0, that means there is not a single post to load
      if (pages.length === 0) return undefined;

      // If the last page doesn't have posts, that means the end is reached
      if (lastPage.length === 0) return undefined;

      // Return the id of the last post, this will serve as the cursor
      // that will be passed to `queryFn` as `pageParam` property
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
      });
    },
    [],
  );

  const likePost = useCallback(async (postId: number) => {
    likeMutation.mutate({ postId });
  }, []);

  const unLikePost = useCallback(async (postId: number) => {
    unLikeMutation.mutate({ postId });
  }, []);

  return (
    <>
      <div className="flex flex-col">
        {status === 'loading' ? (
          <p>Loading posts...</p>
        ) : status === 'error' ? (
          <p>Error loading posts.</p>
        ) : (
          <AnimatePresence>
            {data.pages.flat().map((post) => (
              <motion.div
                initial={false}
                animate={{
                  height: 'auto',
                  marginTop: '32px',
                  opacity: 1,
                  overflow: 'visible',
                }}
                exit={{
                  height: 0,
                  marginTop: '0px',
                  opacity: 0,
                  overflow: 'hidden',
                }}
                style={{ originY: 0 }}
                transition={{ duration: 0.5 }}
                key={post.id}
              >
                <Post
                  {...post}
                  {...{
                    likePost,
                    unLikePost,
                    editPost,
                    deletePost,
                    toggleComments,
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      <div className="h-6" ref={bottomElRef}></div>
      {!isFetching && !hasNextPage && <AllCaughtUp />}
    </>
  );
}
