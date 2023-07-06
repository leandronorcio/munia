import { User } from '@prisma/client';

export async function getProfile(id: string) {
  const res = await fetch(`${process.env.URL}/api/users/${id}`);

  if (!res.ok) {
    throw new Error('Failed to fetch user profile.');
  }

  const { user }: { user: User } = await res.json();
  return user;
}
