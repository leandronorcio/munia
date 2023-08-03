import { DiscoverFilters } from './DiscoverFilters';
import { DiscoverProfiles } from './DiscoverProfiles';
import { DiscoverSearch } from './DiscoverSearch';

export default async function Discover() {
  return (
    <div className="px-4 pt-4">
      <DiscoverSearch />
      <DiscoverFilters />
      <DiscoverProfiles />
    </div>
  );
}
