import { DiscoverProfiles } from '@/components/DiscoverProfiles';
import { DiscoverSearch } from '@/components/DiscoverSearch';
import { DiscoverFilters } from '@/components/DiscoverFilters';
import { getProfile } from '../../getProfile';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);

  return {
    title: profile ? `Followers | ${profile.name}` : 'Followers',
  };
}

export default async function Page({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);

  // ✅ add null check to prevent TypeScript error
  if (!profile) {
    return <div className="p-4">User not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-6 text-4xl font-bold">{profile.name}&apos;s Followers</h1>
      <DiscoverSearch label="Search Followers" />
      <DiscoverFilters />

      {/* ✔ Now profile.id is guaranteed to exist — no TypeScript error */}
      <DiscoverProfiles followersOf={profile.id} />
    </div>
  );
}
