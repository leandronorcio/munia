// import { PROFILE_QUERY_STALE_TIME } from '@/constants';
import { getUser } from '@/lib/client_data_fetching/getUser';
import { useQuery } from '@tanstack/react-query';

/**
 * Always use this query hook when querying user data/subscribing to a user data query.
 * @param userId string | undefined
 */
export function useUserQuery(userId?: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
    staleTime: 60000 * 10,
    // staleTime: PROFILE_QUERY_STALE_TIME,
  });
}
