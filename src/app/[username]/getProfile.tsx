import prisma from '@/lib/prisma';
import type { User } from '@prisma/client';
import { notFound } from 'next/navigation';

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

  if (!check) {
    notFound();
  }

  // Use the id to fetch from the /api/users/:userId endpoint
  const res = await fetch(`${process.env.URL}/api/users/${check.id}`);
  const { user }: { user: User | null } = await res.json();

  return user;
}
