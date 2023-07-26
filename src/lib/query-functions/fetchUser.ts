import { GetUser } from 'types';

export async function fetchUser(userId?: string) {
  const res = await fetch(`/api/users/${userId}`);

  if (!res) {
    throw new Error("Error getting logged in user's data.");
  }

  return (await res.json()) as GetUser;
}
