import { ACTIVITIES_PER_PAGE } from '@/constants';
import { GetActivity } from '@/types/definitions';

export async function getActivities({ userId, cursor }: { userId: string; cursor: number }) {
  const res = await fetch(`/api/users/${userId}/activity?limit=${ACTIVITIES_PER_PAGE}&cursor=${cursor}`);

  if (!res.ok) throw new Error('Failed to load activities.');
  return (await res.json()) as GetActivity[];
}
