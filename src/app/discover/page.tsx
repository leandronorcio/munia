import { Filters } from './Filters';
import { DiscoverProfiles } from './DiscoverProfiles';
import { PageWrapper } from '@/components/ui/PageWrapper';

export default async function Discover() {
  return (
    <PageWrapper>
      <div className="mt-0 md:mt-8 p-4 md:p-0">
        <Filters />
        <DiscoverProfiles />
      </div>
    </PageWrapper>
  );
}
