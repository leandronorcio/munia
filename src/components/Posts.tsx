'use client';
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { GetPost, PostIds } from 'types';
import { useCallback, useEffect, useRef, useState } from 'react';
import useOnScreen from '@/hooks/useOnScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { Post } from './Post';
import { AllCaughtUp } from './AllCaughtUp';
import { POSTS_PER_PAGE } from '@/constants';
import { chunk } from 'lodash';

export function Posts({
  type,
  userId,
}: {
  type: 'profile' | 'feed';
  userId: string;
}) {
  const qc = useQueryClient();
  const queryKey = ['users', userId, 'posts', { type }];
  const bottomElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(bottomElRef);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    /**
     * What's this?
     *  This runs after the first render and prevents instant rendering of cached
     * React Query posts (if there's any), avoiding interference with NextJS scroll behavior
     * i.e scroll to top when navigating to a new route.
     *
     * Why do this?
     *  NextJS's scroll behavior is messed up when interfered by the instant rendering of posts,
     * this trick solves this issue.
     */
    setShouldRender(true);
  }, []);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<
    PostIds[],
    Error,
    InfiniteData<PostIds[], unknown>,
    QueryKey,
    number
  >({
    queryKey,
    defaultPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const endpoint = type === 'profile' ? 'posts' : 'feed';
      const params = new URLSearchParams();
      params.set('limit', POSTS_PER_PAGE.toString());
      params.set('cursor', pageParam.toString());

      const res = await fetch(
        `/api/users/${userId}/${endpoint}?${params.toString()}`,
      );

      if (!res.ok) {
        throw Error('Failed to load posts.');
      }

      const posts: GetPost[] = await res.json();
      // Set query data for each post, these queries will be used by the <Post> component
      return posts.map((post) => {
        qc.setQueryData(['posts', post.id], post);
        return {
          id: post.id,
          commentsShown: false,
        };
      });
    },
    getNextPageParam: (lastPage, pages) => {
      // If the `pages` `length` is 0, that means there is not a single post to load
      if (pages.length === 0) return undefined;

      // If the last page doesn't have posts, that means the end is reached
      if (lastPage.length === 0) return undefined;

      // Return the id of the last post, this will serve as the cursor
      // that will be passed to `queryFn` as `pageParam` property
      return lastPage.slice(-1)[0].id;
    },
    staleTime: 60000 * 10,
  });

  useEffect(() => {
    if (!isBottomOnScreen) return;
    if (!data) return;
    if (!hasNextPage) return;

    fetchNextPage();
  }, [isBottomOnScreen]);

  const toggleComments = useCallback(async (postId: number) => {
    qc.setQueryData<InfiniteData<{ id: number; commentsShown: boolean }[]>>(
      queryKey,
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
          pages: chunk(newPosts, POSTS_PER_PAGE),
          pageParams: oldData.pageParams,
        };
      },
    );
  }, []);

  return (
    <>
      {shouldRender && (
        <div className="flex flex-col">
          {status === 'pending' ? (
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
                    marginTop: '16px',
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
                    id={post.id}
                    commentsShown={post.commentsShown}
                    toggleComments={toggleComments}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      )}
      <div
        className="h-6"
        ref={bottomElRef}
        /**
         * The first page will be initially loaded by React Query
         * so the bottom loader has to be hidden first
         */
        style={{ display: data ? 'block' : 'none' }}
      ></div>
      {!isFetching && !isFetchingNextPage && !hasNextPage && <AllCaughtUp />}
    </>
  );
}
