'use client';

import { AllCaughtUp } from '@/components/AllCaughtUp';
import useOnScreen from '@/hooks/useOnScreen';
import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { GetActivity } from '@/types/definitions';
import { Activity } from '@/components/Activity';
import { SomethingWentWrong } from '@/components/SometingWentWrong';
import { GenericLoading } from '@/components/GenericLoading';
import { getActivities } from '@/lib/client_data_fetching/getActivities';

export function Activities({ userId }: { userId: string }) {
  const bottomElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(bottomElRef);
  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<
    GetActivity[],
    Error,
    InfiniteData<GetActivity[], unknown>,
    QueryKey,
    number
  >({
    queryKey: ['users', userId, 'activity'],
    defaultPageParam: 0,
    queryFn: async ({ pageParam: cursor }) => getActivities({ userId, cursor }),
    getNextPageParam: (lastPage, pages) => {
      // If the `pages` `length` is 0, that means there is not a single activity to load
      if (pages.length === 0) return undefined;

      // If the last page doesn't have activities, that means the end is reached
      if (lastPage.length === 0) return undefined;

      // Return the id of the last activity, this will serve as the cursor
      // that will be passed to `queryFn` as the `pageParam` property
      return lastPage.slice(-1)[0].id;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isBottomOnScreen && hasNextPage) fetchNextPage();
  }, [isBottomOnScreen, hasNextPage, fetchNextPage]);

  const bottomLoaderStyle = useMemo(() => ({ display: data ? 'block' : 'none' }), [data]);

  return (
    <>
      {isPending ? (
        <GenericLoading>Loading activities</GenericLoading>
      ) : isError ? (
        <SomethingWentWrong />
      ) : (
        data.pages.flat().map((activity) => <Activity key={activity.id} {...activity} />)
      )}

      <div
        className="min-h-[16px]"
        ref={bottomElRef}
        /**
         * The first page will be initially loaded by React Query
         * so the bottom loader has to be hidden first
         */
        style={bottomLoaderStyle}>
        {hasNextPage && <GenericLoading>Loading more notifications</GenericLoading>}
      </div>
      {isError && <SomethingWentWrong />}
      {!isError && !isPending && !isFetchingNextPage && !hasNextPage && <AllCaughtUp />}
    </>
  );
}
