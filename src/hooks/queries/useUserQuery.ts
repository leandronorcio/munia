import { PROFILE_QUERY_STALE_TIME } from '@/constants';
import { fetchUser } from '@/lib/query-functions/fetchUser';
import { useQuery } from '@tanstack/react-query';

/**
 * Always use this query hook when querying user data/subscribing to a user data query.
 * @param userId string | undefined
 * @param initialData GetUser | undefined
 */
export function useUserQuery(userId?: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
    staleTime: PROFILE_QUERY_STALE_TIME,
  });
}
