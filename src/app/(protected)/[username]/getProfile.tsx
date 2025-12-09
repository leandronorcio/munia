import prisma from '@/lib/prisma/prisma';
import { GetUser } from '@/types/definitions';

export async function getProfile(username: string): Promise<GetUser | null> {
  // Find the user ID by username
  const userIdRecord = await prisma.user.findFirst({
    where: { username },
    select: { id: true },
  });

  if (!userIdRecord) return null;

  // Fetch the full user data from the API
  const res = await fetch(`${process.env.URL}/api/users/${userIdRecord.id}`);
  if (!res.ok) {
    throw new Error('Error fetching profile information');
  }

  const user: GetUser = await res.json();
  return user;
}
