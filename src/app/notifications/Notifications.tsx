'use client';

import useOnScreen from '@/hooks/useOnScreen';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { GetActivity } from 'types';
import { Activity } from '../../components/Activity';
import { AllCaughtUp } from '../../components/AllCaughtUp';
import { useSession } from 'next-auth/react';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { DropdownItem } from '@/components/ui/DropdownItem';
import { useNotificationsReadStatusMutations } from '@/hooks/mutations/useNotificationsReadStatusMutations';
import { ACTIVITIES_PER_PAGE } from '@/constants';
import { Badge } from '@/components/ui/Badge';
import { useNotificationsCountQuery } from '@/hooks/queries/useNotificationsCountQuery';

export function Notifications() {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { data: notificationCount } = useNotificationsCountQuery();
  const { markAllAsReadMutation } = useNotificationsReadStatusMutations();

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
    queryKey: ['users', userId, 'notifications'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `/api/users/${userId}/notifications?limit=${ACTIVITIES_PER_PAGE}&cursor=${pageParam}`,
      );
      if (!res.ok) {
        throw new Error('Failed to load notifications.');
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
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!isBottomOnScreen) return;
    if (!data) return;
    if (!hasNextPage) return;

    fetchNextPage();
  }, [isBottomOnScreen]);

  const markAllAsRead = () => markAllAsReadMutation.mutate();

  return (
    <div>
      <div className="flex justify-between">
        <div className="mb-6 flex items-center gap-2">
          <h1 className="text-4xl font-bold">Notifications</h1>
          {notificationCount && <Badge>{notificationCount}</Badge>}
        </div>
        <DropdownMenu>
          <DropdownItem onClick={markAllAsRead}>Mark all as read</DropdownItem>
        </DropdownMenu>
      </div>
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
