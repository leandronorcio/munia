import { Gender, RelationshipStatus } from '@prisma/client';
import { Filters } from './Filters';
import { headers } from 'next/headers';
import { DiscoverProfiles } from './DiscoverProfiles';
import { GetUser } from 'types';

interface DiscoverSearchParams {
  gender?: Gender;
  'relationship-status'?: RelationshipStatus;
  'follow-status'?: 'follower' | 'following';
  limit?: string;
  offset?: string;
}

async function getProfiles({
  searchParams,
}: {
  searchParams: DiscoverSearchParams;
}): Promise<GetUser[]> {
  const params = new URLSearchParams([
    ...Object.entries(searchParams),
  ]).toString();
  const url = new URL(`${process.env.URL}/api/users?${params}`);
  const res = await fetch(url.href, {
    headers: headers(),
  });
  if (!res.ok) {
    throw Error('Failed to fetch profiles.');
  }
  return (await res.json()) as GetUser[];
}

export default async function Discover({
  searchParams,
}: {
  searchParams: DiscoverSearchParams;
}) {
  const initialProfiles = await getProfiles({ searchParams });
  return (
    <div className="mt-0 md:mt-8 p-4 md:p-0">
      <Filters />
      <DiscoverProfiles initialProfiles={initialProfiles} />
    </div>
  );
}
