'use client';
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { GetPost, PostIds } from '@/types/definitions';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useOnScreen from '@/hooks/useOnScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { Post } from './Post';
import { AllCaughtUp } from './AllCaughtUp';
import { NO_PREV_DATA_LOADED, POSTS_PER_PAGE } from '@/constants';
import { chunk } from 'lodash';
import { useShouldAnimate } from '@/hooks/useShouldAnimate';
import { deductLowerMultiple } from '@/lib/deductLowerMultiple';
import { SomethingWentWrong } from './SometingWentWrong';
import { ButtonNaked } from './ui/ButtonNaked';
import SvgForwardArrow from '@/svg_components/ForwardArrow';
import { postFramerVariants } from '@/lib/framerVariants';
import { GenericLoading } from './GenericLoading';

// If the `type` is 'profile' or 'feed', the `userId` property is required
// If the `type` is 'hashtag', the `hashtag` property is required
type PostsProps =
  | {
      type: 'hashtag';
      userId?: undefined;
      hashtag: string;
    }
  | {
      type: 'profile' | 'feed';
      userId: string;
      hashtag?: undefined;
    };

export function Posts({ type, hashtag, userId }: PostsProps) {
  const qc = useQueryClient();
  // Need to memoize `queryKey`, so when used in a dependency array, it won't trigger the `useEffect`/`useCallback`
  const queryKey = useMemo(
    () =>
      type === 'hashtag'
        ? ['posts', { hashtag }]
        : ['users', userId, 'posts', { type }],
    [type, userId, hashtag],
  );
  const topElRef = useRef<HTMLDivElement>(null);
  const isTopOnScreen = useOnScreen(topElRef);
  const bottomElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(bottomElRef);
  // `shouldAnimate` is `false` when the browser's back button is pressed
  // `true` when the page is pushed
  const { shouldAnimate } = useShouldAnimate();
  // This keeps track of the number of pages loaded by the `fetchPreviousPage()`
  const [numberOfNewPostsLoaded, setNumberOfNewPostsLoaded] = useState(0);

  const {
    data,
    error,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    fetchPreviousPage,
    isFetchingNextPage,
  } = useInfiniteQuery<PostIds, Error, InfiniteData<PostIds>, QueryKey, number>(
    {
      queryKey,
      defaultPageParam: 0,
      queryFn: async ({ pageParam, direction }): Promise<PostIds> => {
        const isForwards = direction === 'forward';
        const params = new URLSearchParams('');
        params.set('limit', POSTS_PER_PAGE.toString());
        params.set('cursor', pageParam.toString());
        params.set('sort-direction', isForwards ? 'desc' : 'asc');

        const fetchUrl =
          type === 'hashtag'
            ? `/api/posts/hashtag/${hashtag}`
            : `/api/users/${userId}/${type === 'profile' ? 'posts' : 'feed'}`;
        const res = await fetch(`${fetchUrl}?${params.toString()}`);

        if (!res.ok) {
          throw Error('Failed to load posts.');
        }

        const posts: GetPost[] = await res.json();

        // Prevent React Query from 'prepending' the data with an empty array
        if (!posts.length && !isForwards) {
          throw new Error(NO_PREV_DATA_LOADED);
        }

        if (!isForwards) {
          setNumberOfNewPostsLoaded((prev) => prev + posts.length);
        }

        return posts.map((post) => {
          // Set query data for each `post`, these queries will be used by the <Post> component
          qc.setQueryData(['posts', post.id], post);

          // If the `post` already exists in `data`, make sure to use its current `commentsShown`
          // value to prevent the post's comment section from closing if it is already shown
          const currentPostId = data?.pages
            .flat()
            .find(({ id }) => id === post.id);
          return {
            id: post.id,
            commentsShown: currentPostId?.commentsShown || false,
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
      getPreviousPageParam: (firstPage) => {
        if (!firstPage?.length) return 0;
        return firstPage[0].id;
      },
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
  );

  useEffect(() => {
    // Reset the queries when the page has just been pushed, this is to account
    // for changes in the user's follows, e.g. if they start following people,
    // their posts must be shown in the user's feed
    if (shouldAnimate) {
      // Need to manually reset as the `staleTime` is set to `Infinity`
      qc.resetQueries({ queryKey, exact: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Check for new posts every 5 seconds, this allows for bidirectional infinite queries
    const interval = setInterval(fetchPreviousPage, 5000);
    return () => clearInterval(interval);
  }, [fetchPreviousPage]);

  useEffect(() => {
    if (isBottomOnScreen && hasNextPage) fetchNextPage();
  }, [isBottomOnScreen, hasNextPage, fetchNextPage]);

  useEffect(() => {
    // If top of <Posts> is on screen and the `numberOfNewPostsLoaded` is more than 0,
    // reset the `numberOfNewPostsLoaded`
    if (isTopOnScreen && numberOfNewPostsLoaded) {
      setTimeout(() => setNumberOfNewPostsLoaded(0), 1000);
    }
  }, [isTopOnScreen, numberOfNewPostsLoaded]);

  const viewNewlyLoadedPosts = () => {
    topElRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleComments = useCallback(
    async (postId: number) => {
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
    },
    [qc, queryKey],
  );

  return (
    <>
      <div ref={topElRef}></div>
      <div className="flex flex-col">
        <AnimatePresence>
          {numberOfNewPostsLoaded !== 0 && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="sticky top-5 z-10 mx-auto overflow-hidden"
            >
              <ButtonNaked
                onPress={viewNewlyLoadedPosts}
                className="mt-4 inline-flex cursor-pointer select-none items-center gap-3 rounded-full bg-primary px-4 py-2  text-secondary-foreground hover:bg-primary-accent"
              >
                <div className="-rotate-90 rounded-full border-2 border-border bg-muted/70 p-[6px]">
                  <SvgForwardArrow className="h-5 w-5" />
                </div>
                <p>
                  <b>{numberOfNewPostsLoaded}</b> new{' '}
                  {numberOfNewPostsLoaded > 1 ? 'posts' : 'post'} loaded
                </p>
              </ButtonNaked>
            </motion.div>
          )}
        </AnimatePresence>
        {isPending ? (
          <GenericLoading>Loading posts</GenericLoading>
        ) : (
          <AnimatePresence>
            {data?.pages.map((page) =>
              page.map((post, i) => {
                return (
                  <motion.div
                    variants={postFramerVariants}
                    initial={shouldAnimate ? 'start' : false}
                    animate="animate"
                    exit="exit"
                    transition={{
                      delay: deductLowerMultiple(i, POSTS_PER_PAGE) * 0.115,
                    }}
                    key={post.id}
                  >
                    <Post
                      id={post.id}
                      commentsShown={post.commentsShown}
                      toggleComments={toggleComments}
                    />
                  </motion.div>
                );
              }),
            )}
          </AnimatePresence>
        )}
      </div>

      <div
        className="min-h-[16px]"
        ref={bottomElRef}
        /**
         * The first page will be initially loaded by React Query
         * so the bottom loader has to be hidden first
         */
        style={{ display: data ? 'block' : 'none' }}
      >
        {isFetchingNextPage && (
          <GenericLoading>Loading more posts...</GenericLoading>
        )}
      </div>
      {isError && error.message !== NO_PREV_DATA_LOADED && (
        <SomethingWentWrong />
      )}
      {!isPending && !isFetchingNextPage && !hasNextPage && <AllCaughtUp />}
    </>
  );
}
