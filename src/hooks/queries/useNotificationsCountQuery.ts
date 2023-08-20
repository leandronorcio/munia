import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export function useNotificationsCountQuery() {
  const { data: session } = useSession();
  const userId = session?.user.id;

  return useQuery<number>({
    queryKey: ['users', userId, 'notifications', 'count'],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/notifications/count`);

      if (!res.ok) {
        throw new Error('Error fetching notifications count.');
      }

      return await res.json();
    },
    refetchInterval: 5000,
    enabled: !!userId,
  });
}
