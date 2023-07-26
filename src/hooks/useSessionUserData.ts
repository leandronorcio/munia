'use client';
import { PROFILE_QUERY_STALE_TIME } from '@/constants';
import { fetchUser } from '@/lib/query-functions/fetchUser';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

/**
 * Use this hook to get the data of the current logged in user.
 *
 * NOTE: If you only need to get the `id` of the logged
 * in user, use NextAuth's `useSession()` instead.
 *
 * @returns GetUser
 */

export function useSessionUserData() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const { data } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
    staleTime: PROFILE_QUERY_STALE_TIME,
  });

  return [data];
}
