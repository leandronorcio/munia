import prisma from '@/lib/prisma/prisma';
import { GetUser } from 'types';

export async function getProfile(username: string) {
  // Get the id of the user from the given username.
  const check = await prisma.user.findFirst({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  if (!check) return null;

  // Use the id to fetch from the /api/users/:userId endpoint
  const res = await fetch(`${process.env.URL}/api/users/${check.id}`);
  const user: GetUser = await res.json();

  return user;
}
