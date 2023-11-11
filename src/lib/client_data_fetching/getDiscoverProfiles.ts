import { DISCOVER_PROFILES_PER_PAGE } from '@/constants';
import { GetUser } from '@/types/definitions';
import { ReadonlyURLSearchParams } from 'next/navigation';

export async function getDiscoverProfiles({
  offset,
  followersOf,
  followingOf,
  searchParams,
}: {
  offset: number;
  followersOf?: string;
  followingOf?: string;
  searchParams: ReadonlyURLSearchParams;
}) {
  const params = new URLSearchParams(searchParams);
  params.set('limit', DISCOVER_PROFILES_PER_PAGE.toString());
  params.set('offset', offset.toString());

  if (followersOf) params.set('followers-of', followersOf);
  if (followingOf) params.set('following-of', followingOf);

  const res = await fetch(`/api/users?${params.toString()}`);

  if (!res.ok) throw new Error('Error fetching discover profiles.');
  return (await res.json()) as GetUser[];
}
