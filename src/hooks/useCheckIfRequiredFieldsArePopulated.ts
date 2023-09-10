import 'server-only';

import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';
import { redirect } from 'next/navigation';

/**
 * Use this hook to verify if the required fields for a user is populated,
 * if not this will redirect them to `/setup` page which requires them
 * to fill those up.
 */
export async function useCheckIfRequiredFieldsArePopulated() {
  const [user] = await getServerUser();

  // If the user is logged in and if they don't have a set `username`, `email`, or `name`, redirect them to `/setup`
  if (user?.id) {
    const res = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        username: true,
        name: true,
      },
    });

    if (!res) return;
    if (!res.username || !res.name) {
      redirect('/setup');
    }
  }
}
