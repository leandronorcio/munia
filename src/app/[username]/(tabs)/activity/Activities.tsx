'use client';
import { AllCaughtUp } from '@/components/AllCaughtUp';
import useOnScreen from '@/hooks/useOnScreen';
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { GetActivity } from 'types';
import { Activity } from '@/components/Activity';
import { ACTIVITIES_PER_PAGE } from '@/constants';
import { SomethingWentWrong } from '@/components/SometingWentWrong';

export function Activities({ userId }: { userId: string }) {
  const bottomElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(bottomElRef);
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
    GetActivity[],
    Error,
    InfiniteData<GetActivity[], unknown>,
    QueryKey,
    number
  >({
    queryKey: ['users', userId, 'activity'],
    defaultPageParam: 0,
    queryFn: async ({ pageParam }) => {
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
    <>
      {isPending ? (
        <p>Loading activities...</p>
      ) : isError ? (
        <SomethingWentWrong />
      ) : (
        data.pages.flat().map((activity) => {
          return <Activity key={activity.id} {...activity} />;
        })
      )}

      <div
        className="h-2"
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
