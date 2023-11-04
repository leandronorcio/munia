'use client';
import { DiscoverProfile } from '@/components/DiscoverProfile';
import { AllCaughtUp } from '@/components/AllCaughtUp';
import useOnScreen from '@/hooks/useOnScreen';
import {
  InfiniteData,
  QueryKey,
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { GetUser } from '@/types/definitions';
import { AnimatePresence, motion } from 'framer-motion';
import { SomethingWentWrong } from '@/components/SometingWentWrong';
import { useShouldAnimate } from '@/hooks/useShouldAnimate';
import { GenericLoading } from '@/components/GenericLoading';

const PROFILES_PER_PAGE = 4;
export function DiscoverProfiles({
  followersOf,
  followingOf,
}: {
  followersOf?: string;
  followingOf?: string;
}) {
  const searchParams = useSearchParams();
  const bottomElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(bottomElRef);
  const qc = useQueryClient();
  const { shouldAnimate } = useShouldAnimate();

  const {
    data,
    error,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<
    GetUser[],
    Error,
    InfiniteData<GetUser[], unknown>,
    QueryKey,
    number
  >({
    queryKey: [
      'discover',
      {
        search: searchParams.get('search'),
        gender: searchParams.get('gender'),
        relationshipStatus: searchParams.get('relationship-status'),
        followersOf,
        followingOf,
      },
    ],
    defaultPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams(searchParams);
      params.set('limit', PROFILES_PER_PAGE.toString());
      params.set('offset', pageParam.toString());

      if (followersOf) params.set('followers-of', followersOf);
      if (followingOf) params.set('following-of', followingOf);

      const res = await fetch(`/api/users?${params.toString()}`);
      if (!res.ok) {
        throw new Error('Error fetching discover profiles.');
      }

      const users = (await res.json()) as GetUser[];

      // Update/create a query cache for each of the fetched user data
      for (const user of users) {
        qc.setQueryData(['users', user.id], user);
      }
      return users;
    },
    getNextPageParam: (lastPage, pages) => {
      // If the `pages` `length` is 0, that means there is not a single profile to load
      if (pages.length === 0) return undefined;

      // If the `lastPage` is less than the limit, that means the end is reached
      if (lastPage.length < PROFILES_PER_PAGE) return undefined;

      // This will serve as the offset, passed as `pageParam` to `queryFn`
      return pages.flat().length;
    },
    staleTime: 60000 * 10,
    // https://tanstack.com/query/v5/docs/react/guides/paginated-queries
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!isBottomOnScreen) return;
    if (!hasNextPage) return;

    fetchNextPage();
  }, [isBottomOnScreen]);

  return (
    <>
      {isPending ? (
        <GenericLoading>Loading profiles</GenericLoading>
      ) : isError ? (
        <SomethingWentWrong />
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
          <AnimatePresence>
            {data?.pages.flat().map((profile) => (
              <motion.div
                initial={
                  shouldAnimate && {
                    scale: 0.8,
                    opacity: 0.2,
                  }
                }
                animate={{
                  scale: 1,
                  x: 0,
                  opacity: 1,
                }}
                exit={{
                  scale: 0.8,
                  opacity: 0,
                }}
                key={profile.id}
              >
                <DiscoverProfile userId={profile.id} />
              </motion.div>
            ))}
          </AnimatePresence>
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
      {!isError && !isFetching && !isFetchingNextPage && !hasNextPage && (
        <AllCaughtUp />
      )}
    </>
  );
}
