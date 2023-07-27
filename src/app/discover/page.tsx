import { Filters } from './Filters';
import { DiscoverProfiles } from './DiscoverProfiles';

export default async function Discover() {
  return (
    <div className="px-4 pt-4">
      <Filters />
      <DiscoverProfiles />
    </div>
  );
}
