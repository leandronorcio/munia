'use client';

import { DiscoverProfile } from '@/components/DiscoverProfile';
import { AllCaughtUp } from '@/components/AllCaughtUp';
import useOnScreen from '@/hooks/useOnScreen';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { GetUser } from '@/types/definitions';
import { AnimatePresence, motion } from 'framer-motion';
import { SomethingWentWrong } from '@/components/SometingWentWrong';
import { useShouldAnimate } from '@/hooks/useShouldAnimate';
import { GenericLoading } from '@/components/GenericLoading';
import { getDiscoverProfiles } from '@/lib/client_data_fetching/getDiscoverProfiles';
import { DISCOVER_PROFILES_PER_PAGE } from '@/constants';
import { cn } from '@/lib/cn';

interface DiscoverProfilesProps {
  followersOf?: string;
  followingOf?: string;
}

export function DiscoverProfiles({ followersOf, followingOf }: DiscoverProfilesProps) {
  const searchParams = useSearchParams();
  const bottomElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(bottomElRef);
  const qc = useQueryClient();
  const { shouldAnimate } = useShouldAnimate();

  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery<
    GetUser[],
    Error,
    GetUser[],
    [string, Record<string, string | null | undefined>],
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
    queryFn: async ({ pageParam = 0 }) => {
      const users = await getDiscoverProfiles({
        offset: pageParam,
        followersOf,
        followingOf,
        searchParams,
      });

      // Cache each user individually
      for (const user of users) {
        qc.setQueryData(['users', user.id], user);
      }

      return users;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < DISCOVER_PROFILES_PER_PAGE) return undefined;
      // Sum all previous pages lengths to calculate next offset
      return pages.reduce((acc, page) => acc + page.length, 0);
    },
    defaultPageParam: 0,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const variants = useMemo(
    () => ({
      initial: (animate: boolean) => ({ scale: animate ? 0.8 : 1, opacity: animate ? 0.2 : 1 }),
      animate: { scale: 1, x: 0, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 },
    }),
    [],
  );

  useEffect(() => {
    if (isBottomOnScreen && hasNextPage) fetchNextPage();
  }, [isBottomOnScreen, hasNextPage, fetchNextPage]);

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
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={shouldAnimate}
                key={profile.id}>
                <DiscoverProfile userId={profile.id} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <div ref={bottomElRef} className={cn('h-6', data ? 'block' : 'hidden')} />
      {!isError && !isFetching && !isFetchingNextPage && !hasNextPage && <AllCaughtUp />}
    </>
  );
}
