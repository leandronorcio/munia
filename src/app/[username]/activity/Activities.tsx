'use client';
import { AllCaughtUp } from '@/components/AllCaughtUp';
import useOnScreen from '@/hooks/useOnScreen';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { GetActivity } from 'types';
import { Activity } from '../../../components/Activity';
import { ACTIVITIES_PER_PAGE } from '@/constants';

export function Activities({ userId }: { userId: string }) {
  const bottomElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(bottomElRef);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<GetActivity[]>({
    queryKey: ['users', userId, 'activity'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `/api/users/${userId}/activity?limit=${ACTIVITIES_PER_PAGE}&cursor=${pageParam}`,
      );
      if (!res.ok) {
        throw new Error('Failed to load activities.');
      }

      return (await res.json()) as GetActivity[];
    },
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
    if (!isBottomOnScreen) return;
    if (!data) return;
    if (!hasNextPage) return;

    fetchNextPage();
  }, [isBottomOnScreen]);

  return (
    <div>
      {data?.pages.flat().map((activity) => {
        return <Activity key={activity.id} {...activity} />;
      })}

      <div
        className="h-6"
        ref={bottomElRef}
        /**
         * The first page will be initially loaded by React Query
         * so the bottom loader has to be hidden first
         */
        style={{ display: data ? 'block' : 'none' }}
      ></div>
      {!isFetching && !hasNextPage && <AllCaughtUp />}
    </div>
  );
}
