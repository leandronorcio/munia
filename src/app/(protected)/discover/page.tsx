import { DiscoverFilters } from '@/components/DiscoverFilters';
import { DiscoverProfiles } from '@/components/DiscoverProfiles';
import { DiscoverSearch } from '@/components/DiscoverSearch';

export const metadata = {
  title: 'Munia | Discover',
};

export default async function Discover() {
  return (
    <div className="px-4 pt-4">
      <h1 className="mb-4 text-4xl font-bold">Discover</h1>
      <DiscoverSearch />
      <DiscoverFilters />
      <DiscoverProfiles />
    </div>
  );
}
