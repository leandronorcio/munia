import { User } from '@prisma/client';
import { notFound } from 'next/navigation';

export async function getProfile(id: string) {
  const res = await fetch(`${process.env.URL}/api/users/${id}`);
  const { user }: { user: User | null } = await res.json();

  if (!user) {
    notFound();
  }
  return user;
}
