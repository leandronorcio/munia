import { ACTIVITIES_PER_PAGE } from '@/constants';
import { GetActivity } from '@/types/definitions';

export async function getNotifications({
  userId,
  cursor,
  direction,
}: {
  userId: string;
  cursor: number;
  direction: 'forward' | 'backward';
}) {
  const isForwards = direction === 'forward';
  const params = new URLSearchParams('');
  params.set('limit', ACTIVITIES_PER_PAGE.toString());
  params.set('cursor', cursor.toString());
  params.set('sort-direction', isForwards ? 'desc' : 'asc');

  const res = await fetch(`/api/users/${userId}/notifications?${params.toString()}`);

  if (!res.ok) throw new Error('Failed to load notifications.');
  return (await res.json()) as GetActivity[];
}
