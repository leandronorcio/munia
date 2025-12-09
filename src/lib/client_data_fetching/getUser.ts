import { GetUser } from '@/types/definitions';

export async function getUser(userId?: string): Promise<GetUser | null> {
  if (!userId) return null;

  const res = await fetch(`/api/users/${userId}`);

  if (!res.ok) {
    throw new Error("Error getting user's data.");
  }

  const user: GetUser = await res.json();
  return user;
}
