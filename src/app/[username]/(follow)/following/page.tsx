import { DiscoverProfiles } from '@/app/discover/DiscoverProfiles';
import { getProfile } from '../../getProfile';
import { DiscoverSearch } from '@/app/discover/DiscoverSearch';
import { DiscoverFilters } from '@/app/discover/DiscoverFilters';

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getProfile(params.username);

  return (
    <div className="pt-4">
      <h1 className="mb-6 mt-1 text-4xl font-bold">
        {profile?.name}'s Following
      </h1>
      <DiscoverSearch label="Search Following" />
      <DiscoverFilters />
      <DiscoverProfiles followingOf={profile?.id} />
    </div>
  );
}
