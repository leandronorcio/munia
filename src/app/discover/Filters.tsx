'use client';
import Button from '@/components/ui/Button';
import { DropdownItem } from '@/components/ui/DropdownItem';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { kebabCase, lowerCase, startCase } from 'lodash';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { DiscoverFilters } from 'types';

export function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const filters = {
    gender: searchParams.get('gender') || undefined,
    relationshipStatus: searchParams.get('relationship-status') || undefined,
  };
  const genderFilters: DiscoverFilters['gender'][] = [
    'MALE',
    'FEMALE',
    'NONBINARY',
  ];
  const relationshipStatusFilters: DiscoverFilters['relationshipStatus'][] = [
    'SINGLE',
    'IN_A_RELATIONSHIP',
    'ENGAGED',
    'MARRIED',
  ];

  const updateParams = ({
    title,
    value,
  }: {
    title: string;
    value: DiscoverFilters[keyof DiscoverFilters];
  }) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (value === undefined) {
      newSearchParams.delete(title);
    } else {
      newSearchParams.set(title, kebabCase(value));
    }

    const url = `${pathname}?${newSearchParams.toString()}`;
    router.push(url);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <DropdownMenu
        width="115%"
        trigger={
          <Button mode="subtle" shape="pill">
            Gender: <b>{startCase(filters.gender) || 'All'}</b>
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
              {startCase(lowerCase(gender))}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
      <DropdownMenu
        width="100%"
        trigger={
          <Button mode="subtle" shape="pill">
            Relationship Status:{' '}
            <b>{startCase(filters.relationshipStatus) || 'All'}</b>
          </Button>
        }
      >
        <DropdownItem
          onClick={() =>
            updateParams({ title: 'relationship-status', value: undefined })
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
                  title: 'relationship-status',
                  value: relationship,
                })
              }
            >
              {startCase(lowerCase(relationship))}
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </div>
  );
}
