'use client';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { GetUser } from 'types';

/**
 * Use this hook to get the data of the current logged in user.
 *
 * NOTE: If you only need to get the `id`, `name`, `email` and `image`
 * of the user, use NextAuth's useSession()` instead.
 *
 * @returns @typedef GetUser
 */
export async function useUserData() {
  const { data: session } = useSession();
  const { data } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch(`/api/users/${session?.user.id}`);

      if (!res) {
        throw new Error("Error getting logged in user's data.");
      }

      return (await res.json()) as GetUser;
    },
    staleTime: 1000 * 60 * 5,
  });

  return { userData: data };
}
