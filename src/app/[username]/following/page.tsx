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
      <h1 className="sticky mb-6 text-4xl font-bold">Following</h1>
      <DiscoverSearch placeholder="Search Following" />
      <DiscoverFilters />
      <DiscoverProfiles followingOf={profile?.id} />
    </>
  );
}
