import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { GetUser } from 'types';
/**
 * Always use this hook when navigating to a profile page.
 * @returns - goToProfile
 */
export function useGoToProfile() {
  const qc = useQueryClient();
  const router = useRouter();

  /**
   * This function makes sure that the user's posts query are removed
   * before going to the profile page, this makes sure that the posts
   * are freshly loaded.
   */
  const goToProfile = useCallback(
    ({ userId, username }: { userId?: string; username: string }) => {
      if (userId) {
        // Remove the user's posts query to make sure the array of posts is fresh
        qc.removeQueries({
          queryKey: ['users', userId, 'posts', { type: 'profile' }],
        });
      } else {
        // If no `userId` is provided, find it from the ['users'] query
        // Find all queries that uses this format for its `queryKey`: ['users', userId]
        const userQueries = qc.getQueriesData(['users']).filter((query) => {
          const [queryKey] = query;
          const [first, second] = queryKey;
          return queryKey.length === 2 && first === 'users' && second;
        });

        // Create an array containing a list of fetched users data, the expected type is <GetUser[]>
        const usersList = userQueries.map((query) => query[1]) as GetUser[];

        // Get the user from the given `username`
        const user = usersList.find((user) => user.username === username);

        // If `user` is found, remove the user's posts query
        if (user) {
          qc.removeQueries({
            queryKey: ['users', user?.id, 'posts', { type: 'profile' }],
          });
        }
      }

      router.push(`/${username}`);
    },
    [],
  );

  return { goToProfile };
}
