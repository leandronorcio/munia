'use client';

import { useSession } from 'next-auth/react';
import { useUserQuery } from './queries/useUserQuery';

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

  const { data } = useUserQuery(userId);
  return [data];
}
