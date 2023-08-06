import { DiscoverProfiles } from '@/app/discover/DiscoverProfiles';
import { getProfile } from '../getProfile';
import { DiscoverSearch } from '@/app/discover/DiscoverSearch';
import { DiscoverFilters } from '@/app/discover/DiscoverFilters';

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getProfile(params.username);

  return (
    <>
      <h1 className="mb-6 text-4xl font-bold">Followers</h1>
      <DiscoverSearch placeholder="Search Followers" />
      <DiscoverFilters />
      <DiscoverProfiles followersOf={profile?.id} />
    </>
  );
}
