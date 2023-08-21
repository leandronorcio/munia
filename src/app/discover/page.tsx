import { DiscoverFilters } from './DiscoverFilters';
import { DiscoverProfiles } from './DiscoverProfiles';
import { DiscoverSearch } from './DiscoverSearch';

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
