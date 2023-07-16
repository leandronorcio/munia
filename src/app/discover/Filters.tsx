'use client';
import Button from '@/components/ui/Button';
import { DropdownItem } from '@/components/ui/DropdownItem';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { kebabToNormal } from '@/lib/kebabToNormal';
import { useDiscoverProfilesStore } from '@/stores/useDiscoverProfilesStore';
import { useSearchParams } from 'next/navigation';
import { DiscoverFilters } from 'types';

export function Filters() {
  const searchParams = useSearchParams();
  const { setProfiles, setIsMaxedOut } = useDiscoverProfilesStore(
    ({ setProfiles, setIsMaxedOut }) => ({ setProfiles, setIsMaxedOut })
  );
  const { filters, setFilters } = useDiscoverProfilesStore(
    ({ filters, setFilters }) => ({ filters, setFilters })
  );
  const genderFilters: DiscoverFilters['gender'][] = [
    'male',
    'female',
    'nonbinary',
  ];
  const relationshipStatusFilters: DiscoverFilters['relationshipStatus'][] = [
    'single',
    'in-a-relationship',
    'engaged',
    'married',
  ];

  const updateParams = ({
    title,
    value,
  }: {
    title: keyof DiscoverFilters;
    value: DiscoverFilters[keyof DiscoverFilters];
  }) => {
    // Don't update when the value is the same
    if (filters[title] === value) return;

    // Reset <DisvoverProfiles> state before updating the filters
    setProfiles([], false);
    setIsMaxedOut(false);

    // Update the filters
    setFilters({ [title]: value });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <DropdownMenu
        width="115%"
        trigger={
          <Button mode="subtle" shape="pill">
            Gender: <b>{kebabToNormal(filters.gender) || 'All'}</b>
          </Button>
        }
      >
        <DropdownItem
          onClick={() => updateParams({ title: 'gender', value: undefined })}
        >
          Clear
        </DropdownItem>
        {genderFilters.map((gender) => {
          return (
            <DropdownItem
              key={gender}
              onClick={() => updateParams({ title: 'gender', value: gender })}
            >
              {kebabToNormal(gender)}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
      <DropdownMenu
        width="100%"
        trigger={
          <Button mode="subtle" shape="pill">
            Relationship Status:{' '}
            <b>{kebabToNormal(filters.relationshipStatus) || 'All'}</b>
          </Button>
        }
      >
        <DropdownItem
          onClick={() =>
            updateParams({ title: 'relationshipStatus', value: undefined })
          }
        >
          Clear
        </DropdownItem>
        {relationshipStatusFilters.map((relationship) => {
          return (
            <DropdownItem
              key={relationship}
              onClick={() =>
                updateParams({
                  title: 'relationshipStatus',
                  value: relationship,
                })
              }
            >
              {kebabToNormal(relationship)}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </div>
  );
}
